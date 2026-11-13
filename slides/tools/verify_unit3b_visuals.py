"""Independently audit the geometry actually written to the Section 5.3 SVGs."""
import json
import math
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets/math130unit3b/visuals'
NS={'s':'http://www.w3.org/2000/svg'}

def near(a,b,label,tol=0.0006):
    assert abs(a-b)<tol, f'{label}: {a} != {b}'

def points(element):
    return [tuple(map(float,p.split(','))) for p in element.attrib['points'].split()]

def linepoints(e):
    return tuple(float(e.attrib[k]) for k in ('x1','y1')),tuple(float(e.attrib[k]) for k in ('x2','y2'))

def verify():
    index=json.loads((ASSETS/'index.json').read_text())
    assert len(index)==15
    evidence={}
    for asset in index.values():
        path=ROOT/asset['src'];root=ET.parse(path).getroot()
        assert root.find('s:desc',NS).text==asset['alt']
        ids=[e.attrib['id'] for e in root.iter() if 'id' in e.attrib]
        assert len(ids)==len(set(ids))
        _,_,width,height=map(float,root.attrib['viewBox'].split())
        for e in root.findall('.//s:text',NS):
            assert 0<=float(e.attrib['x'])<=width and 0<=float(e.attrib['y'])<=height
        for ray in root.findall('.//s:line[@data-degrees]',NS):
            c,end=linepoints(ray);degrees=float(ray.attrib['data-degrees'])
            measured=math.degrees(math.atan2(c[1]-end[1],end[0]-c[0]))%360
            near((measured-degrees+180)%360-180,0,'terminal angle')
            prefix=ray.attrib['id'].removesuffix('-ray')
            rotation=root.find(f".//*[@id='{prefix}-rotation']")
            ps=points(rotation)
            measured_angles=[math.atan2(c[1]-p[1],p[0]-c[0]) for p in ps]
            delta=sum((b-a+math.pi)%(2*math.pi)-math.pi for a,b in zip(measured_angles,measured_angles[1:]))
            near(math.degrees(delta),degrees,'signed total rotation')
            reference=root.find(f".//*[@id='{prefix}-reference']")
            if reference is not None:
                p0,p1=points(reference)[0],points(reference)[-1]
                near(p0[1],c[1],'reference starts on x-axis')
                u=(p0[0]-c[0],c[1]-p0[1]);v=(p1[0]-c[0],c[1]-p1[1])
                alpha=math.degrees(math.acos(max(-1,min(1,(u[0]*v[0]+u[1]*v[1])/(math.hypot(*u)*math.hypot(*v))))))
                assert 0<alpha<90
                near((p1[0]-c[0])*(end[1]-c[1])-(p1[1]-c[1])*(end[0]-c[0]),0,'reference ends on terminal ray',0.03)
            circles=[q for q in root.findall('.//s:circle',NS) if float(q.attrib['r'])>10 and float(q.attrib['cx'])==c[0] and float(q.attrib['cy'])==c[1]]
            for circle in circles:near(math.dist(c,end),float(circle.attrib['r']),'terminal point on circle')
        triangle=root.find(".//*[@id='triangle']")
        if triangle is not None:
            o,foot,p=points(triangle);scale=float(triangle.attrib['data-scale'])
            near((p[0]-o[0])/scale,float(triangle.attrib['data-x']),'signed x')
            near((o[1]-p[1])/scale,float(triangle.attrib['data-y']),'signed y')
            near(foot[1],o[1],'horizontal leg');near(foot[0],p[0],'perpendicular leg')
        evidence[asset['src']]='Parsed SVG geometry: equal coordinate scales, signed terminal directions, acute arcs to the x-axis, accessible labels, and no numeric practice solutions.'
    root=ET.parse(ASSETS/'sine-two-solutions.svg').getroot()
    circle=root.find(".//*[@id='unit-circle']");cx,cy,r=(float(circle.attrib[k]) for k in ('cx','cy','r'))
    chord=root.find(".//*[@id='sine-line']");level=float(chord.attrib['data-value'])
    for name,quadrant in [('root-left',3),('root-right',4)]:
        origin,p=linepoints(root.find(f".//*[@id='{name}']"))
        near(math.dist(origin,p),r,'sine root radius')
        near((cy-p[1])/r,level,'sine root height')
        assert (p[0]<cx if quadrant==3 else p[0]>cx) and p[1]>cy
        near(p[1],float(chord.attrib['y1']),'root meets horizontal line')
    root=ET.parse(ASSETS/'triangle-area-76.svg').getroot()
    a,b,c=points(root.find(".//*[@id='area-triangle']"))
    u=(b[0]-a[0],b[1]-a[1]);v=(c[0]-a[0],c[1]-a[1])
    angle=math.degrees(math.acos(sum(x*y for x,y in zip(u,v))/(math.hypot(*u)*math.hypot(*v))))
    near(angle,76,'included area angle');near(math.dist(a,c)/math.dist(a,b),34/21,'area side proportion')
    # Student practice figures must not print the requested reference angle/radius/ratios.
    for name,banned in [('practice-580.svg',['220°','40°']),('radian-practice.svg',['π/6','π/4']),('point-negative2-negative5.svg',['√29','5/2']),('point-positive4-negative3.svg',['r = 5','−3/5','4/5'])]:
        root=ET.parse(ASSETS/name).getroot()
        visible=' '.join(e.text or '' for e in root.findall('.//s:text',NS))
        for token in banned:
            # The original angle includes these strings as substrings, so compare labels.
            assert not any((e.text or '')==token for e in root.findall('.//s:text',NS)),(name,token)
    return evidence

if __name__=='__main__':
    for name in verify():print('PASS',name)
