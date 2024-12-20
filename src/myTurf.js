// Creates an object "turf" that consists of three functions (circle, union, difference)
// imported from the 'turf' package and then exports this object.
import circle from 'turf/src/circle';
import union from 'turf/src/union/';
import difference from 'turf/src/difference';


let turf = {
  circle: circle,
  union: union,
  difference: difference
};

export default turf;
