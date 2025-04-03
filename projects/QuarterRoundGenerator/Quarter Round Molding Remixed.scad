// Straight Quarter Round Molding Model in OpenSCAD with Automatic End Cuts
// Author: Andrewhvolk
// Description: Creates a quarter round molding with configurable end angles
// Last Updated: March 17, 2025

// Parameters
radius = 18;       // Radius of quarter round (mm), 3/4 inch radius
wallsidelength = 190.5;  // Length of wall side (mm), remains constant regardless of cuts
left_end = "inner";   // Left end angle: "square", "inner", or "outer"
right_end = "outer";  // Right end angle: "90", inner"45", or outer="135"
$fn = 100;         // Number of fragments for circle approximation


// Base quarter round profile
module quarter_round(radius, length) {
    // Create a quarter round profile and extrude it along the X-axis
    rotate([90, 0, 90])
    translate([0, 0, -radius])
        linear_extrude(length)
            intersection() {
                square([radius, radius]);
                circle(r=radius);
            }
}

// Function to create right end cut (at beginning of quarter round)
module right_end_cut(angle, radius) {
    if (angle == "square") {
        // 90 degree cut (square)
        translate([-50, -25, -25])
        cube([50, 50, 50]);
    } else if (angle == "inner") {
        // 45 degree cut (miter) - Acute angle
        translate([-50, -50, -50])
        rotate([0, 0, 45])
        cube([100, 100, 100]);
    } else if (angle == "outer") {
        // 135 degree cut (reverse miter) - Obtuse angle
        translate([-50*sqrt(2), 0, -1])
        rotate([0, 0, -45])
        cube([50, 50, 50]);
    }
}

// Function to create left end cut (at end of quarter round)
module left_end_cut(angle, radius, wallsidelength) {
    if (angle == "square") {
        // 90 degree cut (square)
        translate([wallsidelength, -25, -1])
        cube([50, 50, 50]);
    } else if (angle == "inner") {
        // 45 degree cut (miter) - Acute angle
        translate([wallsidelength-radius, radius, -1])
        rotate([0, 0, -45])
        cube([50, 50, 50]);
    } else if (angle == "outer") {
        // 135 degree cut (reverse miter) - Obtuse angle
        translate([wallsidelength, 0, -1])
        rotate([0, 0, -45])
        cube([50, 50, 50]);
    }
}

// Main module to generate the quarter round with cuts
module quarter_round_with_cuts(radius, wallsidelength, left_end, right_end) {
    difference() {
        // Create a quarter round that's always long enough
        quarter_round(radius, wallsidelength + 2*radius);
        
        union() {
            // Right end cut (at beginning of the quarter round)
            right_end_cut(right_end, radius);
            
            // Left end cut (at end of the quarter round)
            left_end_cut(left_end, radius, wallsidelength);
        }
    }
}

// Visual verification - Wall side measurement line
module wall_measurement_line(wallsidelength) {
    color("red")
    translate([0, -5, 0])
    rotate([90, 0, 0])
    linear_extrude(1)
    square([wallsidelength, 1]);
}

// Generate the final model
quarter_round_with_cuts(radius, wallsidelength, left_end, right_end);
//wall_measurement_line(wallsidelength);
