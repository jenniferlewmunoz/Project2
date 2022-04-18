/***********************************************************************************
  MoodyMaze
  by Scott Kildall

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
  To use:
  Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

//--- TEMPLATE STUFF: Don't change

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

var speed = 7;

// fonts
var din_condensed;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  din_condensed = loadFont("fonts/DinCondensed.ttf");
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables
  clickables = clickablesManager.setup();

  // avatar set up
  playerAvatar = new Avatar("Player", 640, 400);
  playerAvatar.setMaxSpeed(20);
  playerAvatar.addMovingAnimation('assets/female_running01.png', 'assets/female_running03.png');
  playerAvatar.addStandingAnimation('assets/female_standing01.png', 'assets/female_standing02.png');

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerAvatar.sprite);

  // manage turning visibility of buttons on/off based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables();
}

// Adventure manager handles it all!
function draw() {
  //--- TEMPLATE STUFF: Don't change
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
  //---

  //--- MODIFY THESE CONDITONALS
  // No avatar for Splash screen or Instructions screen
  if (adventureManager.getStateName() !== "Splash" &&
    adventureManager.getStateName() !== "Instructions") {

    //--- TEMPLATE STUFF: Don't change    
    // responds to keydowns
    checkMovement();

    // this is a function of p5.play, not of this sketch
    drawSprite(playerAvatar.sprite);
    //--
  }
}

// respond to W-A-S-D or the arrow keys
function checkMovement() {
  var xSpeed = 0;
  var ySpeed = 0;

  // Check x movement
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    xSpeed = speed;
  }
  else if (keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    xSpeed = -speed;
  }

  // Check y movement
  if (keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    ySpeed = speed;
  }
  else if (keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    ySpeed = -speed;
  }

  playerAvatar.setSpeed(xSpeed, ySpeed);
}
//--

//-- MODIFY THIS: this is an example of how I structured my code. You may
// want to do it differently
function mouseReleased() {
  if (adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Instructions");
  }
}


//-------------- CLICKABLE CODE  ---------------//

//--- TEMPLATE STUFF: Don't change 
function setupClickables() {
  // All clickables to have same effects
  for (let i = 0; i < clickables.length; i++) {

    // Callbacks
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;

    // Style
    clickables[i].textFont = din_condensed;
    clickables[i].textSize = 20;
    clickables[i].strokeWeight = 5;
    clickables[i].stroke = "#FFFFFF";
  }
}
//--

//-- MODIFY THIS:
// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#A9A9A9";
  this.noTint = false;
  this.tint = "#A9A9A9";
}

//-- MODIFY THIS:
// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#FFFFFF";
}

//--- TEMPLATE STUFF: Don't change 
clickableButtonPressed = function () {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name);
}
//

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

//-- MODIFY THIS:
// Change for your own instructions screen

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width / 6) * 4;
    this.textBoxHeight = (height / 6) * 4;

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are navigating through the interior space of your moods. There is no goal to this game, but just a chance to explore various things that might be going on in your head. Use the ARROW keys to navigate your avatar around.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {

    // this calls PNGRoom.draw()
    super.draw();

  }
}

//-- MODIFY THIS: for your own classes
// (1) copy this code block below
// (2) paste after //-- done copy
// (3) Change name of TemplateScreen to something more descriptive, e.g. "PuzzleRoom"
// (4) Add that name to the adventureStates.csv file for the classname for that appropriate room
class TemplateScreen extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
  }
}
//-- done copy

