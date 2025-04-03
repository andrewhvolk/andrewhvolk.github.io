/*
 * Baseboard Generator
 * Creates customizable baseboard molding profiles by importing SVG files.
 * ASSUMES ALL SOURCE SVG FILES HAVE BEEN STANDARDIZED TO THE SAME DIMENSIONS (e.g., 60x300 units).
 *
 * Parameters:
 * - style: Profile style SVG filename (e.g., "StyleAClean", "StyleBClean", etc. from BaseboardStyles folder)
 * - base_height: Desired total height of the final baseboard (mm)
 * - base_depth: Desired thickness/depth of the final baseboard (mm)
 * - length: Length of the baseboard segment (mm)
 * - resolution: Curve smoothness for OpenSCAD rendering ($fn)
 */

// --- Standard SVG Dimensions (Hardcoded) ---
// IMPORTANT: All SVG files in BaseboardStyles MUST be preprocessed to match these dimensions!
standard_svg_width = 60;   // Standardized width of the SVG drawing units
standard_svg_height = 300; // Standardized height of the SVG drawing units 

// --- User Parameters ---
style = "StyleAClean"; // Baseboard profile style (Filename without .svg extension)

// --- Desired Output Dimensions ---
// Common Heights: 3.25in (82.55mm), 4.25in (107.95mm), 5.25in (133.35mm)
base_height = 107.95;  // Desired total height (mm) - Set to 4.25in equivalent

// Common Depths (Thickness): 9/16in (14.2875mm), 1/2in (12.7mm)
base_depth = 14.2875;  // Desired depth/thickness (mm) - Set to 9/16in equivalent

length = 50;         // Segment length (mm)
$fn = 50;              // Curve resolution

// Module to import, center, and translate the STANDARDIZED SVG profile to origin
module baseboard_profile() {
    svg_path = str("BaseboardStyles/", style, ".svg");
    
    // Translate the centered SVG so its bottom-left corner is at [0,0]
    // Uses the hardcoded standard dimensions.
    translate([standard_svg_width / 2, standard_svg_height / 2]) 
    import(svg_path, center=true); // Import centered at the origin
}

// Module to scale and extrude the profile
module baseboard() {
    // Calculate scaling factors using the hardcoded standard dimensions
    x_scale = (standard_svg_width > 0) ? base_depth / standard_svg_width : 1;
    y_scale = (standard_svg_height > 0) ? base_height / standard_svg_height : 1;

    // Apply linear extrude and scaling
    // The profile should already be positioned at the origin by baseboard_profile()
    linear_extrude(height=length)
    scale([x_scale, y_scale])
    baseboard_profile(); // Instantiate the module
}

// Generate the final baseboard
baseboard();

// Uncomment to preview the raw imported profile (unscaled, but positioned at origin)
// baseboard_profile();