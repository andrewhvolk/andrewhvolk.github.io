//
// Tangible Math Project - Square Packing
// Frames and tiles: corrected release of the first model concept
//
// Andrew H. Volk, Liberty University.  Released under CC BY 4.0.
// Release 1.0.0, 23 October 2026.
//
// ---------------------------------------------------------------------------
// WHAT THIS IS, AND WHAT IT IS NOT
// ---------------------------------------------------------------------------
// This is the FIRST of four model concepts built for the Research Week 2026
// square-packing manipulative: a set of unit tiles plus one rigid frame per
// case.  It is NOT the adjustable frame-and-slider artifact described in the
// Montview paper; that model was built in SOLIDWORKS and is published
// separately.  This file is released because it is simple, it prints in one
// go, and it demonstrates the paper's central point without any mechanism.
//
// ---------------------------------------------------------------------------
// WHAT CHANGED FROM THE ORIGINAL 2026-03-14 FILE
// ---------------------------------------------------------------------------
// 1. The case multipliers in the original file were placeholders and did not
//    match the literature the paper cites.  They have been replaced with the
//    published values and each is now sourced in a comment.  The original
//    values, for the record, were 2.41421356 (n=5), 3.306 (n=10),
//    [3.35, 3.40, 3.45] (n=11) and 3.5 (n=12).  All four were wrong.
// 2. n = 12 has been removed.  The sources cited in the paper do not settle
//    it, and the project's own literature timeline describes it as unresolved.
//    Printing a frame implies a claim about the bound; we decline to make one.
// 3. n = 11 now gets TWO frames rather than three guesses: one at the proved
//    lower bound, which is provably too small, and one at the best known
//    published construction, which works.  Holding both is the artifact's
//    whole argument in two pieces of plastic.
// 4. fit_clearance was 0.0, which cannot be printed as intended.  Clearance is
//    now handled explicitly and asymmetrically; see the next section.
// 5. Frames are now sized from the PRINTED tile rather than the nominal tile,
//    so the ratio a user actually holds is the mathematical one.
// 6. An echo() block reports the effective ratio of every frame at compile
//    time, so the demonstration can be verified after any edit.
//
// ---------------------------------------------------------------------------
// WHY THE CLEARANCE IS ASYMMETRIC
// ---------------------------------------------------------------------------
// A frame that is too generous lets a user produce an arrangement that appears
// to beat a published bound.  That is worse than a frame that is too tight,
// because it teaches something false.  So:
//
//   * tiles are printed slightly UNDER nominal, so they slide;
//   * achievable frames are sized slightly OVER the bound, so they close;
//   * the n = 11 lower-bound frame is sized slightly UNDER the bound, so that
//     after every tolerance it is still provably impossible to fill.
//
// Run this file and read the console.  Every frame prints its effective ratio
// against the bound it represents.  If an edit ever pushes the lower-bound
// frame above 3.788854, the demonstration is broken and the echo will show it.
//
// Units: mm.
//

$fn = 64;
eps = 0.02;

// ---------- Calibration: edit here, then re-read the echo output ----------
tile_side       = 25;     // nominal mathematical unit square
tile_clearance  = 0.30;   // total, subtracted from the printed tile
frame_margin    = 0.40;   // total, ADDED to frames that must close
bound_margin    = 0.40;   // total, SUBTRACTED from the impossible frame

tile_printed    = tile_side - tile_clearance;

// ---------- Tile and frame geometry ----------
tile_thickness  = 6;      // raised so a tile can be gripped and turned
frame_wall      = 4;
frame_floor     = 2.4;
frame_height    = 10;     // taller than the tile is deep, so tiles stay seated

label_depth     = 0.8;
label_size      = 4.5;
label_font      = "Liberation Sans:style=Bold";

// ---------- Published values for the cases the artifact represents ----------
// s(n) is the side of the smallest square known to contain n unit squares.
//
// n = 5   exact: 2 + 1/sqrt(2).  Goebel (1979) construction; matching lower
//         bound in Friedman's survey (1998/2009).
// n = 10  exact: 3 + 1/sqrt(2).  Stromquist (2003).
// n = 11  UNRESOLVED.  Stromquist (2003) proved s(11) >= 2 + 4/sqrt(5).
//         Gensane and Ryckelynck (2005) give a construction of about
//         3.87708359.  The bounds do not meet.
//
// Recheck n = 11 against the current literature before reprinting.
s5           = 2 + 1/sqrt(2);        // 2.707107, exact
s10          = 3 + 1/sqrt(2);        // 3.707107, exact
s11_lower    = 2 + 4/sqrt(5);        // 3.788854, proved impossible below this
s11_best     = 3.87708359;           // best known published construction

// ---------- Layout ----------
// part = "preview" shows everything at once and does not fit a build plate.
// Export the two printable plates with, for example:
//   openscad -D 'part="frames"' -o frames.stl frames-and-tiles.scad
//   openscad -D 'part="tiles"'  -o tiles.stl  frames-and-tiles.scad
// Both plates fit a 256 x 256 mm bed (Bambu Lab A1) with room for a brim.
part            = "preview";

tile_count      = 12;     // 11 for the largest case, plus one spare
tile_grid_cols  = 4;
tile_pitch      = tile_printed + 4;
frame_gap       = 8;

module tile(side = tile_printed, thickness = tile_thickness) {
    linear_extrude(height = thickness)
        square([side, side], center = false);
}

module frame(inner_side, label_txt) {
    outer_side = inner_side + 2 * frame_wall;

    difference() {
        cube([outer_side, outer_side, frame_height], center = false);

        translate([frame_wall, frame_wall, frame_floor])
            cube([inner_side, inner_side, frame_height - frame_floor + eps],
                 center = false);

        translate([outer_side / 2, outer_side - 1.6,
                   frame_height - label_depth + eps])
            linear_extrude(height = label_depth + eps)
                text(label_txt, size = label_size, halign = "center",
                     valign = "top", font = label_font);
    }
}

module tile_set() {
    for (i = [0 : tile_count - 1]) {
        row = floor(i / tile_grid_cols);
        col = i % tile_grid_cols;
        translate([col * tile_pitch, -row * tile_pitch, 0]) tile();
    }
}

// Each entry: [label, multiplier, closes?]
// closes = true  -> frame is sized up, the arrangement must fit
// closes = false -> frame is sized down, the arrangement must NOT fit
cases = [
    ["n=5 exact",   s5,        true ],
    ["n=10 exact",  s10,       true ],
    ["n=11 NO",     s11_lower, false],
    ["n=11 best",   s11_best,  true ]
];

function inner_for(multiplier, closes) =
    multiplier * tile_printed + (closes ? frame_margin : -bound_margin);

function outer_for(i) = inner_for(cases[i][1], cases[i][2]) + 2 * frame_wall;

// Two by two, largest frames in the lower row, so the plate stays compact.
frame_slots = [[0, 0], [1, 0], [0, 1], [1, 1]];
col_w = max(outer_for(0), outer_for(2)) + frame_gap;
row_h = max(outer_for(0), outer_for(1)) + frame_gap;

module frame_grid() {
    for (i = [0 : len(cases) - 1])
        translate([frame_slots[i][0] * col_w, -frame_slots[i][1] * row_h, 0])
            frame(inner_for(cases[i][1], cases[i][2]), cases[i][0]);
}

if (part == "tiles" || part == "preview") tile_set();

if (part == "frames")
    frame_grid();
else if (part == "preview")
    translate([0, -(ceil(tile_count / tile_grid_cols) * tile_pitch + 30), 0])
        frame_grid();

// ---------- Verification ----------
echo(str("Printed tile side: ", tile_printed, " mm"));
for (c = cases) {
    inner = inner_for(c[1], c[2]);
    ratio = inner / tile_printed;
    ok    = c[2] ? ratio >= c[1] : ratio < c[1];
    echo(str(c[0],
             "  frame inner ", inner, " mm",
             "  effective ratio ", ratio,
             "  target ", c[1],
             "  ", ok ? "OK" : "*** DEMONSTRATION BROKEN ***"));
}
echo(str("n=11 gap between the proved lower bound and the best known ",
         "construction, at this tile size: ",
         (s11_best - s11_lower) * tile_printed, " mm"));
