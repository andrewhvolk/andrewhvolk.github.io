SQUARE PACKING MANIPULATIVE - PROJECT FILES
Release 1.1.0, 23 October 2026
https://andrewhvolk.github.io/RW26.html

A. H. Volk, J. Drambi, and J. Holt, Liberty University
Liberty University Research Week 2026
Licensed CC BY 4.0; see LICENSE.txt


--------------------------------------------------------------------------
WHAT IS IN THIS RELEASE, AND WHAT IS NOT
--------------------------------------------------------------------------

This folder holds the two OpenSCAD concepts that preceded the final design.
The SOLIDWORKS artifact and the slicer projects are in ../solidworks/ and
../slicer/.

Release 1.1.0 adds the artifact itself: the adjustable frame-and-slider
assembly demonstrated at Research Week, in both iterations, as SOLIDWORKS
sources and 3MF exports, together with the two saved Bambu Studio project
files that record how the parts were actually printed. See FABRICATION.txt
one level up for the full fabrication record.

One design is still outstanding: an overlapping-corners variant developed in
Blender in April 2026, after the presentation. Its export carries no usable
scale and is not included.


--------------------------------------------------------------------------
FILES
--------------------------------------------------------------------------

frames-and-tiles.scad
    Corrected release of the first model concept: twelve unit tiles plus four
    rigid frames, one per case. Parametric; edit the calibration block at the
    top and re-export. Running the file echoes a verification line for every
    frame, confirming that its effective ratio still represents the bound it
    is meant to represent.

frames-plate.stl        213 x 208 x 10 mm
    The four frames arranged two by two on one plate. Exported with
        openscad -D 'part="frames"' -o frames-plate.stl frames-and-tiles.scad

tiles-plate.stl         111 x 82 x 6 mm
    The twelve tiles on one plate. Exported with
        openscad -D 'part="tiles"' -o tiles-plate.stl frames-and-tiles.scad

overlapping-corners.scad
    Third model concept: two interlocking plates whose diagonal overlap
    shrinks the enclosed square continuously, so one pair covers every case.
    Header documents the three dated revisions it went through.

overlapping-corners-pair.stl    212 x 212 x 25 mm
    Both halves, laid out for one plate. Exported with
        openscad -D 'show_cube=false' -D 'slideblue=112' \
                 -o overlapping-corners-pair.stl overlapping-corners.scad

Both plates fit a 256 x 256 mm bed with room for a brim.


--------------------------------------------------------------------------
THE FOUR FRAMES, AND WHY ONE OF THEM CANNOT BE FILLED
--------------------------------------------------------------------------

s(n) is the side of the smallest square that can contain n unit squares.

    n = 5    s(5)  = 2 + 1/sqrt(2)  = 2.707107      exact
    n = 10   s(10) = 3 + 1/sqrt(2)  = 3.707107      exact
    n = 11   s(11) >= 2 + 4/sqrt(5) = 3.788854      proved lower bound
             s(11) <= 3.87708359                    best known construction

The n = 11 case is unresolved: the bounds do not meet. The release therefore
includes two frames for it. The one labelled "n=11 NO" is sized just below the
proved lower bound, so eleven tiles provably cannot be made to fit, no matter
how long anyone tries. The one labelled "n=11 best" is sized just above the
published construction, so they can. The gap between them, at this tile size,
is about 2.2 mm.

That pair is the point of the whole artifact. Failing to fill the first frame
is not a proof of anything; a proof is what tells you the second frame is not
yet known to be the smallest one that works.

Sources: Goebel (1979); Friedman (1998/2009, Electronic Journal of
Combinatorics, Dynamic Survey 7); Stromquist (2003, EJC 10(1), R8); Gensane
and Ryckelynck (2005, Discrete & Computational Geometry 34, 97-109).

The status of n = 11 should be rechecked against current literature before
reprinting. If a better construction or a matching proof has appeared, the
"n=11 best" frame is out of date.


--------------------------------------------------------------------------
CALIBRATION
--------------------------------------------------------------------------

Clearance in this design is deliberately asymmetric, because the two kinds of
error are not equally harmful. A frame that is too tight is annoying. A frame
that is too loose lets someone produce an arrangement that appears to beat a
published bound, which teaches something false. So:

    tiles are printed slightly UNDER nominal, so they slide;
    frames that must close are sized slightly OVER the bound;
    the n = 11 lower-bound frame is sized slightly UNDER the bound, so that
        after every tolerance it is still provably impossible to fill.

The defaults in frames-and-tiles.scad are

    tile_side       25      nominal mathematical unit
    tile_clearance  0.30    total, subtracted from the printed tile
    frame_margin    0.40    total, added to frames that must close
    bound_margin    0.40    total, subtracted from the impossible frame

To re-tune for a different printer or filament, print the tiles plate first,
measure a tile across two opposite faces, and adjust tile_clearance until the
printed tile measures 24.7 mm. Then re-export the frames. Do not adjust the
frames to fit oversized tiles; that is the change that breaks the n = 11
demonstration. Re-run the file after any edit and read the echoed verification
lines: each frame reports OK or DEMONSTRATION BROKEN.

These models were printed on a Bambu Lab A1 with a 0.4 mm stainless-steel
nozzle in Bambu Lab PLA Matte and PLA Basic at 0.20 mm layers. Clearances are
specific to that combination. Elephant-foot compensation matters here: an
uncompensated first layer adds a lip at the base of every frame wall and will
make tiles bind at the bottom of a frame.


--------------------------------------------------------------------------
PRINTING NOTES
--------------------------------------------------------------------------

Neither plate needs supports. Both are flat-bottomed and print without
overhangs. A brim helps the frames, whose walls are 4 mm wide and 10 mm tall
and can lift at the corners on a cold plate.

Tiles print fastest face-down at low infill. Frames benefit from more walls
than infill, since all the dimensional accuracy that matters is in the walls.


--------------------------------------------------------------------------
CITATION
--------------------------------------------------------------------------

Volk, A. H., Drambi, J., & Holt, J. (2026). Square packing manipulative
    (Version 1.1.0) [3D model files]. https://andrewhvolk.github.io/RW26.html
