//var myCanvas;
//
//// tilt data
//var xTilt, yTilt;
//var isDevice;
//
//// Globe object
//var g;
//
//function centerCanvas() {
//  var x = (windowWidth - width) / 2;
//  var y = (windowHeight - height) / 2;
//  myCanvas.position(x, y);
//}
//
//function setup() {
//  myCanvas = createCanvas(2 * windowWidth, 2 * windowHeight, WEBGL);
//  //myCanvas.parent('sketch');
//  //centerCanvas();
//
//  // initialize tilt stuff
//  isDevice = true;
//  xTilt = 0;
//  yTilt = 0;
//
//  g = new Globe();
//}
//
//function windowResized() {
//  //centerCanvas();
//	resizeCanvas(2 * windowWidth, 2 * windowHeight);
//  g.resize();
//}
//
//function draw() {
//
//  background(250, 0);
//
//  if (!isDevice) {
//    xTilt = map(mouseX, 0, width, -9, 9);
//    yTilt = map(mouseY, 0, height, -9, 9);
//  }
//  //console.log(xTilt + " + " + yTilt);
//
//  g.update();
//  g.display();
//
//}
//
//function Globe() {
//
//	this.maxRadius = min(windowWidth, windowHeight);
//  this.radius = this.maxRadius / 6;
//  this.minRadius = this.radius;
//  this.boxSize = this.radius / 56;
//  // this number controls the arc distance between points
//  // and the amount of points generated
//  // it is recommended that you make this divisible by 3
//  // a higher number corresponds to more points and vice versa
//  this.pointAmount = 24;
//  // this number is half of pointAmount to correctly divide PI
//  this.piDivider = this.pointAmount / 2;
//  this.grown = false;
//
//  this.display = function() {
//    // idk what this does
//    normalMaterial();
//    push();
//    // tilt rotation
//    rotateX(0.03 * yTilt);
//    rotateY(0.03 * xTilt);
//    // constant rotation
//    rotateY(frameCount * 0.01);
//    // place the boxes
//    for (var yi = 0; yi < this.pointAmount; yi++) {
//      push();
//      rotateY(yi * (PI / this.piDivider));
//      for (var xi = 0; xi < this.pointAmount; xi++) {
//        push();
//        rotateX(xi * (PI / this.piDivider));
//        translate(0, 0, this.radius);
//        box(this.boxSize);
//        pop();
//      }
//      pop();
//    }
//    pop();
//  }
//
//  this.update = function() {
//    if (this.grown) {
//      if (this.radius <= this.maxRadius) {
//        this.radius *= 1.03;
//      }
//    }
//  }
//
//  this.resize = function() {
//    var maxRadiusOld = this.maxRadius;
//    var oldBoxSize = this.boxSize;
//    this.maxRadius = min(windowWidth, windowHeight);
//    this.minRadius = this.maxRadius / 6;
//    this.radius = this.maxRadius * this.radius / maxRadiusOld;
//    this.boxSize = this.maxRadius * oldBoxSize / maxRadiusOld;
//  }
//
//}
//
//function moveCanvasLeft() {
//	if(left < 1) {
//		left+=0.01;
//		myCanvas.position(windowWidth*left, 0);
//	}
//}
//
//function mouseClicked() {
//  g.grown = true;
//}
//
//// accelerometer Data
//window.addEventListener('devicemotion', function(e) {
//  if (e.accelerationIncludingGravity.x !== null)
//    isDevice = true;
//  else
//    isDevice = false;
//
//  if (isDevice) {
//    xTilt = parseInt(e.accelerationIncludingGravity.x);
//    yTilt = parseInt(e.accelerationIncludingGravity.y);
//  }
//});