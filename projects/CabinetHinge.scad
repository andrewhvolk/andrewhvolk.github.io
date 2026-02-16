// Base rectangle dimensions
length = 32;   // mm
width  = 12;   // mm
height = 1.2;  // mm

// Hole dimensions
hole_diameter = 5;  // mm

// Added rectangle dimensions
rect2_length = 4.7625;  // mm
rect2_width  = 12;      // mm
rect2_height = 12;      // mm

// Toggle: set to true to show the second rectangle, false to hide it
show_second_rect = false;

// Smoothness
$fn = 100;

// Main model
difference() {
    union() {
        // Base rectangle
        cube([length, width, height], center = true);
        
        // Optional second rectangle
        if (show_second_rect) {
            translate([(length/2) - (rect2_length/2), 0, (rect2_height/2) - (height/2)])
                cube([rect2_length, rect2_width, rect2_height], center = true);
        }
    }
    
    // Cylindrical hole moved 7 mm along X-axis
    translate([-9, 0, 0])
        cylinder(d = hole_diameter, h = rect2_height + height, center = true);
}
