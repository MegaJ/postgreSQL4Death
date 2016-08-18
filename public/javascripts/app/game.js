Window.onload = define(["fabric.min",
			"math",
			"app/model",
			"app/paddle",
			"app/ball",
			"app/brick",
			"gameMath"],

		       /**
			  I didn't want to wrap everything in this callback
			  Because I didn't want the +1 level of indentation
			  for the entire file.
			**/
		       function(fabric, math, model, Paddle, Ball, Brick, gameMath) {

			   // For some reason fabric doesn't need to be set to window obj
			   // window.fabric = fabric;
			   window.math = math;
			   window.model = model;
			   window.Paddle = Paddle;
			   window.Ball = Ball;
			   window.Brick = Brick;
			   window.gameMath = gameMath;
			   
			   initialize();
			   addListeners();
			   
			   // calls game once user ready to play
			   userReady(game);
		       });

var gameMath = window.gameMath;
//var gameWidth = window.innerWidth - getScrollbarWidth();

// for 30 frames a second
var MS_PER_UPDATE = 1000 / 30;

// for now I don't want these dynamically changed
var BALL_RADIUS = 5;
var PADDLE_LENGTH = 80;
var PADDLE_WIDTH = 20;
var BRICK_WIDTH = 45;
var BRICK_HEIGHT = 20;
var LAG = 0.0;
var previous;

var userReady = function() {
    render();
    var fireGame = function () {
	document.removeEventListener("keydown", fireGame);
	var startTime = previous = performance.now();
	game(startTime);
    }
    
    document.addEventListener("keydown", fireGame);
}


// game runs at a series of fixed time steps
// the game function relies on requestAnimationFrame
// to invoke it as a callback. rAF will pass in a high res times stamp
var game = function(time) {

    var current = time;
    var elapsed = current - previous;

    previous = current;
    LAG += elapsed;
    
    processInput();

    while (LAG >= MS_PER_UPDATE) {
	update(); // if there is a collision, should I force a render?
	LAG -= MS_PER_UPDATE;
    }

    // beware of possible negative LAG
    render(LAG / MS_PER_UPDATE); // interpolation of rendering
   
    requestAnimationFrame(game);
}

var initialize = function () {
     
    canvas = new fabric.Canvas('game', {stateful: false,
					renderOnAddRemove: false
				       });
    window.canvas = canvas;


    
    canvas.backgroundColor = "grey";
    var canvasWidth = canvas.getWidth();
    var canvasHeight = canvas.getHeight();
    console.log("width: " + canvasWidth + " height: " + canvasHeight);

    makeArrayOfBlocks();

    /** 
	TODO: initialize paddle and ball start positions.
	TODO: Maybe figure out a way to separate debug version
	from production version. Don't make paddle and ball global
	in the production version.
     **/
    window.paddle = paddle = new Paddle(PADDLE_LENGTH, PADDLE_WIDTH, 30);
    canvas.add(paddle.fabricPaddle);

    window.ball = ball = new Ball(10, 9,
				  {radius: BALL_RADIUS,
				   fill: 'green',
				   originX: 'center',
				   originY: 'center',
				   transformMatrix: [1, 0,  0, 1, 0, 0]
				  });
    canvas.add(ball.fabricBall);
}

// courtesy of https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

var makeRowOfBlocks = function(verticalOffset) {
    for (var i = 0; i < 4; i++) {

	// center each rectangle at (0,0)
	// then transform it to the correct location in view space
	var offset = 50;
	var brickCenterX = offset + BRICK_WIDTH/2 + (BRICK_WIDTH + 1)*i
	var brickCenterY = verticalOffset
	var fabricObj = {
	    originX: 'center',
	    originY: 'center',
	    width: BRICK_WIDTH,
	    height: BRICK_HEIGHT,
	    transformMatrix: [1,0,  0,1,  brickCenterX, brickCenterY]};
	
    	canvas.add(new Brick(fabricObj).fabricRect);
    };
}

var makeArrayOfBlocks = function(){
    for (var i = 1; i <= 5; i++) {
	makeRowOfBlocks(i*30);
    }
}

/**
   TODO: listeners might not be a good idea
   May lead to state when the ball is inside another
   graphical object.
**/
var processInput = function() {
    
}

var getMatrixX = function(fabricObj) {
    return fabricObj.transformMatrix[4];
}

var getMatrixY = function(fabricObj) {
    return fabricObj.transformMatrix[5];
}

// courtCollision is preemptive: if the ball will hit the bounds
// the ball is set to a position where it makes contact with the wall
// and it's direction is reversed
var courtCollision = function() {

    var ballPosX = getMatrixX(ball.fabricBall);
    var ballPosY = getMatrixY(ball.fabricBall);

    var outOfBoundsRight = ballPosX + ball.dx > canvas.width - BALL_RADIUS;
    var outOfBoundsLeft = ballPosX + ball.dx < 0 + BALL_RADIUS;
    var outOfHorizontalBounds = outOfBoundsLeft || outOfBoundsRight;

    ballPosX = outOfBoundsRight ? canvas.width - BALL_RADIUS : ballPosX;
    ballPosX = outOfBoundsLeft ? 0 + BALL_RADIUS : ballPosX;
    ball.dx = outOfHorizontalBounds ? -ball.dx : ball.dx;

    var outOfBoundsTop = ballPosY + ball.dy > canvas.height - BALL_RADIUS;
    var outOfBoundsBottom = ballPosY + ball.dy < 0 + BALL_RADIUS;
    var outOfVerticalBounds = outOfBoundsTop || outOfBoundsBottom;

    ballPosY = outOfBoundsTop ? canvas.height - BALL_RADIUS : ballPosY;
    ballPosY = outOfBoundsBottom ? 0 + BALL_RADIUS : ballPosY;
    ball.dy = outOfVerticalBounds ? -ball.dy : ball.dy;

    var outOfBounds = outOfVerticalBounds || outOfHorizontalBounds;

    /* Set position explicitly to be inbounds. So next call, this
     * function will return false.
     * On next update, the ball's dx and dy will have been set
     * by this function.
     */
    if (outOfBounds) {
	ball.fabricBall.transformMatrix = [1, 0,  0, 1,  ballPosX, ballPosY];
	return true;
    }
}

/**
   Keeps only the collisions with the smallest distance
   from the ball's current position.

   modifies arrayOfCollisions which is passed in inside update()
**/
var findBallBrickCollisions = function(obj, arrayOfCollisions) {
    if (obj.type === "rect") {

	var brickCollision = ballBrickCollision(ball, obj);

	if (brickCollision) {

	    // in order to know which rectangle the collision was with
	    // so we can remove it later inside update()
	    brickCollision.rect = obj; 

	    if (arrayOfCollisions.length === 0) {
		arrayOfCollisions.push(brickCollision)
	    }

	    else if (brickCollision.d < arrayOfCollisions[0].d) {
		arrayOfCollisions = [brickCollision];
	    }

	    else if (brickCollision.d === arrayOfCollisions[0].d) {
		arrayOfCollisions.push(brickCollision);
	    }
	}
    }
    
    return arrayOfCollisions;
}

var moveBallToIntersection = function(collisionObj) {
    ball.fabricBall.transformMatrix =
    	[1,0, 0,1, collisionObj.x, collisionObj.y];
}

var updateBallVelocityFromCollision = function(ball, collisionObj) {
    console.log(collisionObj.type); // debug
    switch(collisionObj.type) {

    case "vertical":
	ball.dy = -ball.dy;
	break;
    case "horizontal":
	ball.dx = -ball.dx;
	break;
    case "corner":
	ball.dx = -ball.dx;
	ball.dy = -ball.dy;
	break;

    default:
	throw "Undefined collision type!"
    }
}


var update = function(elapsed) {

    if (courtCollision()) {
	return;
    }

    // canvas only holds canvas objects..should I extend them in my own prototypes?
    var testBrick = canvas._objects[0];
    testBrick.set("fill", "red");
    
    var collisions = [];
    canvas.forEachObject(function(obj) {
	collisions = findBallBrickCollisions(obj, collisions);
    });

    // Determine the closest collisions (more than 1 is rare, but possible)
    if (collisions.length > 0) {
	
	for(var i=0; i < collisions.length; i++) {
	    canvas.remove(collisions[i].rect);
	    delete collisions[i].rect;
	}
	
	moveBallToIntersection(collisions[0]);
	updateBallVelocityFromCollision(ball, collisions[0]);
	return;
    }

    // Update ball position if and only if no collisions
    var translate = [1, 0, 0, 1, ball.dx, ball.dy];
    var newTranslate = fabric.util.
    	multiplyTransformMatrices(ball.fabricBall.transformMatrix,
    				  translate);
    ball.fabricBall.transformMatrix = newTranslate;
}


// this function can return an object with all the types of collisions
// pass in the fabricBall
var ballBrickCollision = function (ball, rect) {
    var circle = ball.fabricBall;
    var radius = circle.radius;
    
    // Get center distances between ball's future position and rect
    // Follows the early exit idea from http://stackoverflow.com/a/402010
    var xCentersDistance = Math.abs(getMatrixX(circle) + ball.dx - getMatrixX(rect));
    var yCentersDistance = Math.abs(getMatrixY(circle) + ball.dy - getMatrixY(rect));

    // This pair of checks does not do any line intersection testing
    if (xCentersDistance > (rect.width/2 + radius)) { return false; }
    if (yCentersDistance > (rect.height/2 + radius)) { return false; }

    // At this stage, the ball is almost guaranteed a collision
    // The only case is when the ball is at a corner, but for now
    // This can't happen because we don't have rounded rectangles yet
    
    // If we have a state such that the ball may be inside the brick
    // Then this will fail to detect the collision
    
    // Line Intersection testing begins
    var ballPosX = getMatrixX(circle);
    var ballPosY = getMatrixY(circle);
    var ballTrajectory = {
	x1: ballPosX,
	y1: ballPosY,
	x2: ballPosX + ball.dx,
	y2: ballPosY + ball.dy
    }

    //debugDrawLine(ballTrajectory);

    var brickPosX = getMatrixX(rect);
    var brickPosY = getMatrixY(rect);

    /**
       TODO: optimize the structure of this function
       once you have debugged it satisfactorily
       
       TODO: replace the brick boundaries which are currently
       rectangles, with rounded rectangles. This means you
       need circle-line segment intersection testing for corners.
    **/

    var topSegment = {
	x1: brickPosX - rect.width/2 - radius, //
	y1: brickPosY - rect.height/2 - radius,
	x2: brickPosX + rect.width/2 + radius, //
	y2: brickPosY - rect.height/2 - radius,
    };
    
    var topSegment = {
	x1: brickPosX - rect.width/2 - radius, //
	y1: brickPosY - rect.height/2 - radius,
	x2: brickPosX + rect.width/2 + radius, //
	y2: brickPosY - rect.height/2 - radius,
    };

    var botSegment = {
	x1: brickPosX - rect.width/2 - radius, //
	y1: brickPosY + rect.height/2 + radius,
	x2: brickPosX + rect.width/2 + radius, //
	y2: brickPosY + rect.height/2 + radius,
    }

    var rightSegment = {
	x1: brickPosX + rect.width/2 + radius,
	y1: brickPosY - rect.height/2 - radius, //
	x2: brickPosX + rect.width/2 + radius,
	y2: brickPosY + rect.height/2 + radius, //
    }

    var leftSegment = {
	x1: brickPosX - rect.width/2 - radius,
	y1: brickPosY - rect.height/2 - radius, //
	x2: brickPosX - rect.width/2 - radius,
	y2: brickPosY + rect.height/2 + radius, //
    }
/**
    debugDrawLine(topSegment);
    debugDrawLine(botSegment);
    debugDrawLine(leftSegment);
    debugDrawLine(rightSegment);
**/

    
    var intersectPt = null;
    // ball goes downwards
    if (ball.dy > 0) {
	intersectPt = gameMath.intersect(ballTrajectory, topSegment);
	if (intersectPt) {
	    intersectPt.type = "vertical";
	    return intersectPt;
	}
    }
    
    // upwards
    if (ball.dy < 0) {
	intersectPt = gameMath.intersect(ballTrajectory, botSegment);
	if (intersectPt) {
	    intersectPt.type = "vertical";
	    return intersectPt;
	}
    }

    if (ball.dx > 0) {
	intersectPt = gameMath.intersect(ballTrajectory, leftSegment);
	if (intersectPt) {
	    intersectPt.type = "horizontal";
	    return intersectPt;
	}
    }

    // ball is probably going leftwards (dx < 0)
    intersectPt = gameMath.intersect(ballTrajectory, rightSegment);

    if (intersectPt) {
	intersectPt.type = "horizontal";
	return intersectPt;
    }

    // TODO: Line segment intersections with circles
    // to catch corner cases.
    var topRightArc;
    var topLeftArc;
    var botLeftArc;
    var botRightArc;

    throw "Collision Detection doesn't catch all cases!";
}

var updatePaddle = function(matrix){
    
}

var render = function() {
    canvas.renderAll();
}

var addListeners = function() {
    translatePaddle();
    morphPaddle();
}

var previousMouseCoord = {x: 0, y: 0};
var currentMouseCoords = {x: 0, y: 0};

var translatePaddle = function() {
     canvas.on('mouse:move', function(evt) {
	 var currentMouseCoords = getMouseCoords(evt);
	 var dx = currentMouseCoords.x - previousMouseCoord.x;
	 var dy = currentMouseCoords.y - previousMouseCoord.y;
	 previousMouseCoord = currentMouseCoords;
	 
	 var translate = [1, 0, 0, 1, dx, dy];
	 var newTranslate = fabric.util.multiplyTransformMatrices(
	     paddle.fabricPaddle.transformMatrix, translate);
	 
	 paddle.fabricPaddle.transformMatrix = newTranslate;
     }, false);    
}

var morphPaddle = function() {
    document.addEventListener("keydown", function(evt) {
	var keyCode = evt.keyCode;
	if (keyCode === 65) {
	    paddle.updatePaddleForm(PADDLE_LENGTH, PADDLE_WIDTH, paddle.angle + 5);
	} else if (keyCode === 83) {
	    paddle.updatePaddleForm(PADDLE_LENGTH, PADDLE_WIDTH, paddle.angle - 5);
	}
	
    });
}

var getMouseCoords = function(event) {
    var pointer = canvas.getPointer(event.e);
    return {
	x: pointer.x,
	y: pointer.y
    }; 
}

var debugDrawLine = (function() {
    
    var dbgLCount = 0;
    return function (opts, x1, y1, x2, y2) {	
	var dbgLineName = "dbgL_" + dbgLCount;
	dbgLCount++;

	if (opts) {
	    window[dbgLineName] = new fabric.Line(
		[opts.x1, opts.y1,
		 opts.x2, opts.y2],
		{stroke: "yellow", originX: 'left', originY: 'top'});
	    
	} else {
	    window[dbgLineName] = new fabric.Line(
		[x1, y1,
		 x2, y2],
		{stroke: "yellow", originX: 'left', originY: 'top'});
	}
	
	return canvas.add(window[dbgLineName]);
    }
    
})();
