// ---------- Parameters (edit these) ----------
// From image callouts (mm)
stem_len      = 10.0;   // 0.39"
stem_d        = 4.0;    // 0.16"
neck_d        = 6.5;    // 0.26"  (diameter at the throat under the stem)
flange_th     = 1.9;    // 0.07"
body_len      = 14.5;   // 0.57"
body_d_top    = 7.2;    // 0.28"  (near the flange)
body_d_bot    = 6.6;    // 0.26"  (at the tip)

// Not labeled in the image (choose/adjust as needed)
flange_od     = 15.0;   // outer diameter of the flange (edit to match your part)
neck_h        = 1.5;    // height of cylindrical neck above flange before the stem

// Cosmetic longitudinal ribs on the lower body
show_ribs     = true;
rib_count     = 12;
rib_height    = 0.3;    // radial protrusion
rib_width     = 0.8;    // circumferential width at surface
rib_len       = body_len * 0.85; // length along Z
rib_z0        = 0.6;    // start above the tip

// Rendering quality
$fn = 100;

// ---------- Helper ----------
module frustum(h, d1, d2)  // right circular cone frustum
    cylinder(h = h, d1 = d1, d2 = d2, center = false);

// ---------- Main ----------
module plug() {
    // Z = 0 at bottom tip; Z increases upward
    union() {

        // Tapered insert body (black part below the flange)
        translate([0,0,0])
            frustum(body_len, body_d_bot, body_d_top);

        // Flange (disk with through opening sized at neck_d)
        translate([0,0,body_len])
            difference() {
                cylinder(h = flange_th, d = flange_od);
                cylinder(h = flange_th + 0.2, d = neck_d + 0.05); // clearance hole
            }

        // Neck (short cylinder above flange that the stem sits on)
        translate([0,0,body_len + flange_th])
            cylinder(h = neck_h, d = neck_d);

        // Stem (white cylindrical post)
        translate([0,0,body_len + flange_th + neck_h])
            cylinder(h = stem_len, d = stem_d);

        // Optional ribs on the tapered body
        if (show_ribs) {
            for (i = [0 : 360/rib_count : 360 - 360/rib_count]) {
                rotate([0,0,i]) translate([(body_d_top/2)+0.01, 0, rib_z0])
                    linear_extrude(height = rib_len)
                        offset(r = 0.0)
                            square([rib_height, rib_width], center = true);
            }
        }
    }
}

// ---------- Assemble ----------
plug();
