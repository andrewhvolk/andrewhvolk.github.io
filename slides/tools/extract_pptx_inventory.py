#!/usr/bin/env python3
"""Extract PPTX text, notes, and images into migration evidence.

This command refreshes source inventories only. It never creates or modifies
canonical lecture manifests.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
INVENTORY = ROOT / "migration" / "inventory"
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
REL_NS = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}


@dataclass
class Block:
    paragraphs: list[str]
    x: int = 0
    y: int = 0


@dataclass
class Slide:
    number: int
    title: str
    blocks: list[Block] = field(default_factory=list)
    images: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    @property
    def body(self) -> list[str]:
        values = []
        for block_index, block in enumerate(self.blocks):
            for paragraph_index, paragraph in enumerate(block.paragraphs):
                if block_index == 0 and paragraph_index == 0 and paragraph == self.title:
                    continue
                value = normalize(paragraph)
                if value and value != self.title and value not in values:
                    values.append(value)
        return values


def normalize(value: str) -> str:
    return re.sub(r"[ \t]+", " ", value.replace("\u00a0", " ").replace("\u200b", "")).strip()


def number_in(value: str) -> int:
    match = re.search(r"(\d+)", value)
    return int(match.group(1)) if match else 0


def paragraphs(node: ET.Element) -> list[str]:
    output = []
    for paragraph in node.findall(".//a:p", NS):
        parts = []
        for child in paragraph.iter():
            if child.tag.endswith("}t") and child.text:
                parts.append(child.text)
            elif child.tag.endswith("}br"):
                parts.append(" ")
        value = normalize("".join(parts))
        if value:
            output.append(value)
    return output


def position(node: ET.Element) -> tuple[int, int]:
    off = node.find(".//a:xfrm/a:off", NS) or node.find(".//p:xfrm/a:off", NS)
    return (int(off.attrib.get("x", 0)), int(off.attrib.get("y", 0))) if off is not None else (0, 0)


def relationships(zf: ZipFile, slide_number: int) -> dict[str, str]:
    name = f"ppt/slides/_rels/slide{slide_number}.xml.rels"
    if name not in zf.namelist():
        return {}
    root = ET.fromstring(zf.read(name))
    return {
        item.attrib["Id"]: item.attrib["Target"]
        for item in root.findall("rel:Relationship", REL_NS)
    }


def notes(zf: ZipFile, slide_number: int) -> list[str]:
    names = sorted(
        [name for name in zf.namelist() if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", name)],
        key=number_in,
    )
    if slide_number > len(names):
        return []
    values = paragraphs(ET.fromstring(zf.read(names[slide_number - 1])))
    return [value for value in values if value not in {"Slide image", str(slide_number)}]


def extract(pptx: Path) -> list[Slide]:
    asset_dir = ASSETS / pptx.stem.lower()
    asset_dir.mkdir(parents=True, exist_ok=True)
    output = []
    with ZipFile(pptx) as zf:
        names = sorted(
            [name for name in zf.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)],
            key=number_in,
        )
        for number, name in enumerate(names, 1):
            root = ET.fromstring(zf.read(name))
            blocks = []
            for shape in root.findall(".//p:sp", NS):
                text = paragraphs(shape)
                if text:
                    x, y = position(shape)
                    blocks.append(Block(text, x, y))
            blocks.sort(key=lambda item: (item.y, item.x))
            title = next((text for block in blocks for text in block.paragraphs), f"Slide {number}")
            rels = relationships(zf, number)
            images = []
            for picture in root.findall(".//p:pic", NS):
                blip = picture.find(".//a:blip", NS)
                if blip is None:
                    continue
                rel_id = blip.attrib.get(f"{{{NS['r']}}}embed", "")
                target = rels.get(rel_id, "")
                if not target.startswith("../media/"):
                    continue
                zip_name = "ppt/media/" + target.rsplit("/", 1)[-1]
                if zip_name not in zf.namelist():
                    continue
                output_name = f"slide-{number:02d}-{len(images) + 1}{Path(zip_name).suffix.lower()}"
                (asset_dir / output_name).write_bytes(zf.read(zip_name))
                images.append(f"assets/{pptx.stem.lower()}/{output_name}")
            output.append(Slide(number, normalize(title), blocks, images, notes(zf, number)))
    return output


def main() -> None:
    INVENTORY.mkdir(parents=True, exist_ok=True)
    for pptx in sorted(ROOT.glob("Math130Unit*.pptx")):
        slides = extract(pptx)
        payload = {
            "deck": pptx.stem,
            "source": pptx.name,
            "slide_count": len(slides),
            "slides": [
                {
                    "number": slide.number,
                    "title": slide.title,
                    "text": slide.body,
                    "images": slide.images,
                    "speaker_notes": slide.notes,
                }
                for slide in slides
            ],
        }
        target = INVENTORY / f"{pptx.stem}.json"
        target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"refreshed {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
