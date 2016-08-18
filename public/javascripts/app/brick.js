define(["fabric.min", "math"], function(fabricjs, math){

    var Brick = function(fabricObj) {
	
	this.fabricRect = new fabric.Rect(fabricObj);
    }

    return Brick;
});
