/**
   author: Bret Jackson
**/

define(function() {
    function swapXY(point) {
	var tmp = point.x;
	point.x = point.y;
	point.y = tmp;
	return point;
    }

    return {
	intersect: function(lineSeg1, lineSeg2) {
	    var dir1, dir2, origin1, origin2, d, m, t1, t2;
	    
	    if ((lineSeg1.x1 === lineSeg2.x1 && lineSeg1.y1 === lineSeg2.y1) || (lineSeg1.x1 === lineSeg2.x2 && lineSeg1.y1 === lineSeg2.y2)){
		// The segments share an endpoint
		return {x: lineSeg1.x1, y: lineSeg1.y1};
	    }
	    if (lineSeg1.x2 === lineSeg2.x2 && lineSeg1.y2 === lineSeg2.y2) {
		// The segments share an endpoint
		return {x: lineSeg1.x2, y: lineSeg1.y2};
	    }
	    
	    dir1 = {
		x: lineSeg1.x2 - lineSeg1.x1,
		y: lineSeg1.y2 - lineSeg1.y1
	    };
	    dir2 = {
		x: lineSeg2.x2 - lineSeg2.x1,
		y: lineSeg2.y2 - lineSeg2.y1
	    };
	    origin1 = {
		x: lineSeg1.x1,
		y: lineSeg1.y1
	    }
	    origin2 = {
		x: lineSeg2.x1,
		y: lineSeg2.y1
	    }
	    
	    // Avoid a divide by zero
	    if (dir1.x === 0) {
		dir1 = swapXY(dir1);
		dir2 = swapXY(dir2);
		origin1 = swapXY(origin1);
		origin2 = swapXY(origin2);				
	    }
	    
	    d = {
		x: origin2.x - origin1.x,
		y: origin2.y - origin1.y
	    };
	    m = dir1.y / dir1.x;
	    
	    t2 = (d.x*m - d.y) / (dir2.y - dir2.x*m);
	    if (!isFinite(t2)) {
		// parallel lines no intersection
		return null;
	    }
	    
	    if ((t2 < 0.0) || (t2 > 1.0)) {
		// intersection occurs past the end of the line segments
		return null;
	    }
	    
	    t1 = (d.x + dir2.x * t2)/ dir1.x;
	    if ((t1 < 0.0) || (t1 > 1.0)) {
		// intersection occurs past the end of the line segements
		return null;
	    }
	    
	    // Return the intersection point
	    // d is with respect to the first line segment
	    return {
		x: lineSeg1.x1 + (lineSeg1.x2 - lineSeg1.x1)*t1,
		y: lineSeg1.y1 + (lineSeg1.y2 - lineSeg1.y1)*t1,
		d: t1
	    };
	}
    };
});
