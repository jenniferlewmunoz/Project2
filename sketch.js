/***********************************************************************************
  MultiSprite Navigation

  Use of the p5.play library with a sprite class

  Improvements:
  - stop for an avatar
  - mirror
  - add individual speeds for different avatars
  - set positions for each one
  - do collision-detection
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.timer.js"></script>
***********************************************************************************/

// This is a speed of the 'sprite' which we can move
var speed = 20;

// an array of all the class avaatars
var playerAvatar;
var selectedIndex = 0;

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

function preload() {
 
  // Add new avatar animations here
  playerAvatar = new Avatar("Player", 100, 150, 'assets/run1.png', 'assets/run2.png');
  playerAvatar.setMaxSpeed(5);
  playerAvatar.addStandingAnimation('assets/standing1.png', 'assets/standing2.png')
}

// Setup code goes here
function setup() {
  createCanvas(1000, 800);

  frameRate(30);
 }

// Draw code goes here
function draw() {
  // could draw a PNG file here
  background(128);

  // trap keyboard arrow keys
  checkMovement();

  // drawSprites is a function in p5.play, draws all the sprites
  drawSprites();

  playerAvatar.update();
}

// This will reset position
function keyPressed() {
  if( key === ' ') {
    // we could do something here with the keyboard
  }
}

// respond to W-A-S-D or the arrow keys
function checkMovement() {
  var xSpeed = 0;
  var ySpeed = 0;

  // Check x movement
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    xSpeed = speed;
  }
  else if(keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    xSpeed = -speed;
  }
  
  // Check y movement
  if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    ySpeed = speed;
  }
  else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    ySpeed = -speed;
  }

  playerAvatar.setSpeed(xSpeed,ySpeed);
}

// Animated character
class Avatar  {
  // gets called with new keyword
  constructor(name, x, y, startPNGPath, endPNGPath) {
    this.name = name;
    this.sprite = createSprite(x, y);
    this.sprite.addAnimation('walking', startPNGPath, endPNGPath);
    this.maxSpeed = 6;
    this.hasStandingAnimation = false;
    this.currentAnimation = 'walking';
    
    //console.log(this);
    // no grabables
    this.grabbable = undefined;

    // make avatar still
    this.setSpeed(0,0);
  }

  // adds a standing animation (optional)
  addStandingAnimation(startPNGPath, endPNGPath) {
    this.sprite.addAnimation('standing', startPNGPath, endPNGPath);
    this.hasStandingAnimation = true;
  }
  // store max speed in a class variable
  setMaxSpeed(num) {
    this.maxSpeed = num;
  }

  // set current speed, flip sprite, constain to max
  setSpeed(xSpeed,ySpeed) {
    // flip sprite depending on direction
    if( xSpeed > 0 ) {
      this.sprite.mirrorX(-1);
    }
    else {
      this.sprite.mirrorX(1);
    }

    this.sprite.changeAnimation('standing');
    
    // may need to optimize this
    if( xSpeed === 0 && ySpeed === 0 && this.hasStandingAnimation === true ) {
      this.sprite.changeAnimation('standing');
    }
    else {
      this.sprite.changeAnimation('walking');
    }
    
    // set to xSpeed and constrain to max speed
    this.sprite.velocity.x = constrain(xSpeed, -this.maxSpeed, this.maxSpeed );
    this.sprite.velocity.y = constrain(ySpeed, -this.maxSpeed, this.maxSpeed );
  }

  // accessor function to give avatar a grabbable
  setGrabbable(grabbable) {
    this.grabbable = grabbable;
  }

  // if avatar has a grabble, update the position of that grabbable
  // call every draw loop
  update() {
    if( this.grabbable !== undefined ) {
      this.grabbable.sprite.position.x = this.sprite.position.x + 10;
      this.grabbable.sprite.position.y = this.sprite.position.y + 10;
    }
  }

  // draws the name
  drawLabel() {
    textSize(12);
    fill(240);
    text(this.name, this.sprite.position.x + 20, this.sprite.position.y);
  }
}

// 2D sprite which we will be able to pick up
class Grabbable {
  // call upon preload() of p5.js to acutally load the image
  constructor(x, y, pngPath) {
    this.img = loadImage(pngPath);
    this.sprite = createSprite(x, y);
  }

  setup() {
    this.sprite.addImage('static', this.img );
  }
}