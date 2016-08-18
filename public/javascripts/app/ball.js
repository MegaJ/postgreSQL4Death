define(["fabric.min", "math", "convenience"], function(fabricjs, math, convenience){

    var Ball = function(dx, dy, fabricOptions) {
	this.dx = dx;
	this.dy = dy;
	this.fabricBall = new fabric.Circle(fabricOptions);
	this.willCollide = false;
    }

    convenience.addMethod.call(Ball.prototype, "addMethod", convenience.addMethod);
    Ball.prototype
	.addMethod("updateVelocity",
    			  function(dx, dy) {
    			      this.dx = dx;
    			      this.dy = dy;
    			  })
    	.addMethod("detectCollision",
     		   function() {
		       
     		   });
    
    return Ball;
});				  
