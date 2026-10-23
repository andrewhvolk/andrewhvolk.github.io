//
// Tangible Math Project - Square Packing
// Overlapping corners: third model concept
//
// Andrew H. Volk, Liberty University.  Released under CC BY 4.0.
// Release 1.0.0, 23 October 2026.  Source unchanged from the working copy of
// 9 April 2026; only this header has been added.
//
// Two congruent plates, each a trapezoid plus a right triangle, carrying
// raised trapezoidal border bars that interleave on alternating layers.
// Sliding one plate diagonally across the other shrinks the enclosed square
// continuously, so a single pair covers every case rather than one frame per
// case.  This is the blue part in the Research Week prototype photograph.
//
// Revision history, from the project repository:
//   2026-03-30  first working version: tri_leg 40 mm, border_h 10 mm,
//               tile pitch (100 - 2*10)/4 = 20 mm, BOSL2 dependency,
//               each piece emitted as a separate solid
//   2026-03-31  every red piece and every blue piece unioned into one solid
//               per half - a printability fix, not a geometry change
//   2026-04-09  tri_leg 40 -> 105/sqrt(2) so the overlap diagonal spans the
//               full corner-to-corner distance; border_h 10 -> 5 mm, which is
//               the universal bar height the final SOLIDWORKS family uses;
//               tile pitch divisor 4 -> 5, so the tile drops 20 -> 16 mm;
//               BOSL2 dependency removed so the file needs no library
//
// Clearances here are 0.24 mm, looser than the 0.16 mm and 0.08 mm the final
// SOLIDWORKS family settled on.  They are centred: red_margin_z and
// blue_margin_z are removed from the stacked bars in Z, layer0_xy_margin from
// the base plates in XY.
//
// The companion STL, overlapping-corners-pair.stl, was exported with
//   openscad -D 'show_cube=false' -D 'slideblue=112' //            -o overlapping-corners-pair.stl overlapping-corners.scad
// show_cube is a preview aid: it parks a loose tile on top of the red plate,
// which is not a print layout.  slideblue separates the two halves; the file
// default of 150 gives a 250 mm footprint, which leaves no room for a brim on
// a 256 mm bed, so the published export uses 112 for a 212 mm footprint.
//

//include <BOSL2/std.scad>;

side      = 100;   // overall square size
tri_leg   = 105/sqrt(2);    // controls the size of the two right triangles
thickness = 5;     // base thickness in mm

border_w      = 10;    // inward depth of each trapezoidal border
border_h      = 5;    // nominal height of each border layer
border_layers = 5;     // total possible layers in the design

red_margin_z      = 0.24;  // centered Z margin for raised red layers
blue_margin_z     = 0.24;  // centered Z margin for raised blue layers
layer0_xy_margin  = 0.24;  // centered XY margin for all layer-0 partition pieces
smallcube         = (side-2*border_w)/5; // squares for packing up to 16
slideblue         = 150;   // shifts all blue shapes by [-slideblue, -slideblue, 0]

show_layer5       = false; // toggle fifth layer on/off
show_cube         = true;  // toggle cube on/off
show_blue         = true;  // toggle all blue geometry on/off

// Extra height so layer-0 right triangles reach the raised trapezoids
red_right_triangle_extra_z  = red_margin_z/2;
blue_right_triangle_extra_z = blue_margin_z/2;

module poly2d(pts, xy_margin=0) {
    if (xy_margin > 0)
        offset(delta=-xy_margin) polygon(points=pts);
    else
        polygon(points=pts);
}

module piece(pts, c, h=thickness, xy_margin=0, shift=[0,0,0]) {
    color(c)
        translate(shift)
            linear_extrude(height=h)
                poly2d(pts, xy_margin);
}

module stacked_trapezoid_bars(
    pts,
    c,
    keep_layers=[1,2,3,4,5],
    layer_h=10,
    z0=0,
    z_margin=0,
    shift=[0,0,0]
) {
    actual_h = layer_h - z_margin;
    z_shift  = z_margin / 2;

    for (layer_num = keep_layers) {
        color(c)
            translate([
                shift[0],
                shift[1],
                shift[2] + z0 + (layer_num-1)*layer_h + z_shift
            ])
                linear_extrude(height=actual_h)
                    polygon(points=pts);
    }
}

module prism_from_poly(pts, c, z0=0, h=50, shift=[0,0,0]) {
    color(c)
        translate([shift[0], shift[1], shift[2] + z0])
            linear_extrude(height=h)
                polygon(points=pts);
}

module square_partition(side=100, tri_leg=40, thickness=5) {
    s = side;
    t = tri_leg;
    w = border_w;

    blue_shift = [-slideblue, -slideblue, 0];
    red_shift  = [0,0,0];

    // Layer-0 square partition
    blue_trapezoid = [
        [-s/2, -s/2],
        [-s/2,  s/2 - t],
        [-s/2 + t,  s/2],
        [ s/2,  s/2]
    ];

    red_trapezoid = [
        [-s/2, -s/2],
        [ s/2 - t, -s/2],
        [ s/2, -s/2 + t],
        [ s/2,  s/2]
    ];

    top_left_triangle = [
        [-s/2,  s/2],
        [-s/2,  s/2 - t],
        [-s/2 + t,  s/2]
    ];

    bottom_right_triangle = [
        [ s/2, -s/2],
        [ s/2 - t, -s/2],
        [ s/2, -s/2 + t]
    ];

    // Raised trapezoidal edge footprints
    top_bar = [
        [-s/2,  s/2],
        [ s/2,  s/2],
        [ s/2 - w,  s/2 - w],
        [-s/2 + w,  s/2 - w]
    ];

    right_bar = [
        [ s/2,  s/2],
        [ s/2, -s/2],
        [ s/2 - w, -s/2 + w],
        [ s/2 - w,  s/2 - w]
    ];

    bottom_bar = [
        [ s/2, -s/2],
        [-s/2, -s/2],
        [-s/2 + w, -s/2 + w],
        [ s/2 - w, -s/2 + w]
    ];

    left_bar = [
        [-s/2, -s/2],
        [-s/2,  s/2],
        [-s/2 + w,  s/2 - w],
        [-s/2 + w, -s/2 + w]
    ];

    // Corner wedges
    top_right_wedge = [
        [ s/2,      s/2     ],
        [ s/2,      s/2 - w ],
        [ s/2 - w,  s/2 - w ]
    ];

    bottom_left_wedge = [
        [-s/2,     -s/2     ],
        [-s/2 + w, -s/2 + w ],
        [-s/2,     -s/2 + w ]
    ];

    // Adjacent rectangular prisms along the border
    top_right_rect = [
        [ s/2 - w,  s/2 - w ],
        [ s/2,      s/2 - w ],
        [ s/2,      s/2 - w - smallcube ],
        [ s/2 - w,  s/2 - w - smallcube ]
    ];

    bottom_left_rect = [
        [-s/2,      -s/2 + w ],
        [-s/2 + w,  -s/2 + w ],
        [-s/2 + w,  -s/2 + w + smallcube ],
        [-s/2,      -s/2 + w + smallcube ]
    ];

    odd_layers  = show_layer5 ? [1,3,5] : [1,3];
    even_layers = [2,4];

    z0 = thickness;
    active_top_layer    = show_layer5 ? 5 : 4;
    total_border_height = border_h * active_top_layer;

    // Union all red into one solid
    union() {
        piece(red_trapezoid, "red", thickness, layer0_xy_margin, red_shift);

        piece(
            top_left_triangle,
            "red",
            thickness + red_right_triangle_extra_z,
            layer0_xy_margin,
            red_shift
        );

        stacked_trapezoid_bars(top_bar,   "red", odd_layers,  border_h, z0, red_margin_z, red_shift);
        stacked_trapezoid_bars(right_bar, "red", even_layers, border_h, z0, red_margin_z, red_shift);

        prism_from_poly(top_right_wedge, "red", z0, total_border_height, red_shift);
        prism_from_poly(top_right_rect,  "red", z0, total_border_height, red_shift);
    }

    // Union all blue into one solid
    if (show_blue)
        union() {
            piece(blue_trapezoid, "blue", thickness, layer0_xy_margin, blue_shift);

            piece(
                bottom_right_triangle,
                "blue",
                thickness + blue_right_triangle_extra_z,
                layer0_xy_margin,
                blue_shift
            );

            stacked_trapezoid_bars(bottom_bar, "blue", odd_layers,  border_h, z0, blue_margin_z, blue_shift);
            stacked_trapezoid_bars(left_bar,   "blue", even_layers, border_h, z0, blue_margin_z, blue_shift);

            prism_from_poly(bottom_left_wedge, "blue", z0, total_border_height, blue_shift);
            prism_from_poly(bottom_left_rect,  "blue", z0, total_border_height, blue_shift);
        }
}

square_partition(side=side, tri_leg=tri_leg, thickness=thickness);

if (show_cube)
    translate([0,0,thickness])
        cube(smallcube);