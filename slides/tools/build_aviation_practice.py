"""Four fresh parallel problems modeled on the Spring 2026 aviation quiz."""
import math
from pathlib import Path
from practice_packet_layout import Packet

ROOT=Path(__file__).resolve().parents[2]

def build():
    packet=Packet(ROOT/'pdfs/math130-aviation-quiz-practice.pdf','MATH 130 | Aviation applications | Practice and worked answers')
    packet.title('Aviation applications','Four parallel problem types from the Spring 2026 Quiz 11 format. Confirm this semester’s coverage in Canvas.')
    packet.p('Name: __________________________  Class: __________')
    packet.p('Show a labeled sketch, the equation, the time conversion, and the final answer with units. Use degree mode. Keep full precision until final rounding.','small')
    packet.question(1,'An airplane climbs at 9° at an average airspeed of 360 mph along its flight path. How long does it take to gain 5 miles of altitude? Round to the nearest minute.',165)
    packet.question(2,'An airplane descends at an average airspeed of 260 mph along its flight path, at an angle of depression of 3°. How much altitude does it lose in 8 minutes? Round to the nearest tenth of a mile.',165)
    packet.page()
    packet.title('Bearings and the return flight','For each problem, sketch the route on the compass axes before choosing sine, cosine, or inverse tangent.')
    packet.question(3,'An airplane travels at 280 knots on a bearing of S38°W (218° compass heading) for 1.8 hours. How many nautical miles south and west has it traveled? Round each to the nearest nautical mile.')
    packet.sketch_and_fields(['Total distance = __________________','South = __________________ nautical miles','West = __________________ nautical miles'],True)
    packet.question(4,'An airplane leaves an airport, flies north for 1.5 hours, then west for 0.75 hour, at 350 mph on both legs. Find the direct distance and bearing back to the airport. Round miles and the bearing angle to one decimal.')
    packet.sketch_and_fields(['North leg = __________; west leg = __________','Direct distance back = __________ miles','Return bearing = __________________'],True)
    packet.p('Check: the return route points toward the airport, opposite both components of the outbound displacement.','small')
    packet.page()
    packet.title('Worked answers','Read the setup as well as the final number. Bearings are measured from north or south unless another reference direction is stated.')
    t=60*5/(360*math.sin(math.radians(9)))
    loss=260*(8/60)*math.sin(math.radians(3))
    south=504*math.cos(math.radians(38));west=504*math.sin(math.radians(38))
    distance=math.hypot(525,262.5);angle=math.degrees(math.atan2(262.5,525))
    packet.question(1,'Time to altitude')
    packet.p(f'Vertical speed = 360 sin 9° miles/hour. Time = 5/(360 sin 9°) hours. Multiply by 60: {t:.3f} minutes, so <b>{round(t)} minutes</b>. The 360 mph speed is along the sloped flight path, not vertically upward.')
    packet.question(2,'Altitude lost')
    packet.p(f'Time = 8/60 hour. Flight-path distance = 260(8/60) = 34.666… miles. Altitude lost = 260(8/60) sin 3° = {loss:.4f} miles, so <b>{loss:.1f} miles</b>. Use sine to take the vertical component.')
    packet.question(3,'Both compass components')
    packet.p(f'Total distance = 280(1.8) = 504 nautical miles. Bearing S38°W is measured 38° from south toward west. South = 504 cos 38° = {south:.3f}, so <b>{round(south)} nautical miles south</b>. West = 504 sin 38° = {west:.3f}, so <b>{round(west)} nautical miles west</b>.')
    packet.question(4,'Distance and bearing back')
    packet.p(f'North leg = 350(1.5) = 525 miles; west leg = 350(0.75) = 262.5 miles. Direct distance = √(525² + 262.5²) = <b>{distance:.1f} miles</b>. The return displacement points south and east. Angle from south = arctan(262.5/525) = {angle:.4f}°. Return bearing: <b>S {angle:.1f}° E</b>. Equivalent forms are E {90-angle:.1f}° S or compass heading {180-angle:.1f}°.')
    packet.save()

if __name__=='__main__':build()
