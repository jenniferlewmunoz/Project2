/***********************************************************************************
  The Hot Clock: A 2D Adventure Game on Climate Change

  by Jennifer Lew Munoz
  Uses the p5.2DAdventure.js class 
------------------------------------------------------------------------------------
  To use:
  Add this line to the index.html
  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;
var clickablesManager;
var clickables;

// avatar selction
var playerAvatar;
var playerGirl;
var playerBoy;

// keycods
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;
const X_KEY = 88;
const SPACE_KEY = 32;
var speed = 5;

// fonts
var din_condensed;

// Variables needed for intro screen
var timer;
var animated_girl = [];
var animated_boy = [];
var animated_index = 0;

// Grabbable arrays
var trash = [];
var groceries = [];

// Cashier in store
var cashier = [];
var curr_cashier = 0;

// Text box image
var textbox;
var med_textbox;
var long_textbox;
var thick_textbox;

// Grass and tree animations
var grass = [];
var trees = [];
var curr_grass = 0;
var curr_tree = 0;

// Change if mini-games/tasks have been completed
var tasks = 0;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  // Pre load fonts
  din_condensed = loadFont("fonts/DinCondensed.ttf");

  // Pre load images for animated character selection
  animated_girl[0] = loadImage('assets/people/female_standing01.png');
  animated_girl[1] = loadImage('assets/people/female_standing02.png');
  animated_boy[0] = loadImage('assets/people/male_standing02.png');
  animated_boy[1] = loadImage('assets/people/male_standing01.png');

  // Pre load image of a text box
  textbox = loadImage('assets/textboxes/textbox.png');
  timer_textbox = loadImage('assets/textboxes/timer_textbox02.png');
  med_textbox = loadImage('assets/textboxes/medium_textbox.png');
  long_textbox = loadImage('assets/textboxes/long-textbox.png');
  thick_textbox = loadImage('assets/textboxes/thick_textbox.png');

  // Pre load images for grass
  grass[0] = loadImage('assets/grass01.png');
  grass[1] = loadImage('assets/grass02.png');
  grass[2] = loadImage('assets/grass03.png');
  grass[3] = loadImage('assets/grass04.png');

  // Pre load images for trees
  trees[0] = loadImage('assets/tree01.png');
  trees[1] = loadImage('assets/tree02.png');
  trees[2] = loadImage('assets/tree03.png');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables
  clickables = clickablesManager.setup();

  // avatar set up
  playerGirl = new Avatar("Girl", 640, 525);
  playerGirl.setMaxSpeed(20);
  playerGirl.addMovingAnimation('assets/people/female_running01.png', 'assets/people/female_running03.png');
  playerGirl.addStandingAnimation('assets/people/female_standing01.png', 'assets/people/female_standing02.png');

  playerBoy = new Avatar("Boy", 640, 525);
  playerBoy.setMaxSpeed(20);
  playerBoy.addMovingAnimation('assets/people/male_running01.png', 'assets/people/male_running03.png');
  playerBoy.addStandingAnimation('assets/people/male_standing01.png', 'assets/people/male_standing02.png');

  // manage turning visibility of buttons on/off based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables();

  timer = new Timer(300);
  timer.start();
}

// Adventure manager handles it all!
function draw() {

  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  if (trashGameLost) {
    clickables[2].visible = true;
  } else {
    clickables[2].visible = false;
  }

  if (solarGameLost) {
    clickables[3].visible = true;
  } else {
    clickables[3].visible = false;
  }

  if (groceryGameLost) {
    clickables[4].visible = true;
  } else {
    clickables[4].visible = false;
  }
  clickablesManager.draw();
}

function notSplashOrInstruct() {
  checkMovement();
  drawSprite(playerAvatar.sprite);
  playerAvatar.update();
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

function mouseReleased() {
  if (adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Instructions");
  }
}

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

clickableButtonHover = function () {
  this.color = "#A9A9A9";
  this.noTint = false;
  this.tint = "#A9A9A9";
}

clickableButtonOnOutside = function () {
  this.color = "#FFFFFF";
}

clickableButtonPressed = function () {

  adventureManager.clickablePressed(this.name);

  // Character selection
  if (this.name == "ChooseFemale") {
    playerAvatar = playerGirl;
  }
  if (this.name == "ChooseMale") {
    playerAvatar = playerBoy;
  }

  // Restart game if the player lost
  if (this.name == "Retry1" || this.name == "Retry2" || this.name == "Retry3") {
    location.reload();
  }

  adventureManager.setPlayerSprite(playerAvatar.sprite);
}

class InstructionsScreen extends PNGRoom {

  preload() {
  }

  draw() {
    super.draw();

    // Draw animation of girl
    let img1 = animated_girl[animated_index];
    img1.resize(160, 300);
    image(img1, 445, 270);

    // Draw animation of boy
    let img2 = animated_boy[animated_index];
    img2.resize(160, 300);
    image(img2, 695, 270);

    // Change image
    if (timer.expired()) {
      if (animated_index == 0) {
        animated_index = 1;
      } else {
        animated_index = 0;
      }
      timer.start();
    }
  }
}

/**
 * Class for the spawn room, the park
 */

var mouseClicks = 0;
var lastTrashGrab1 = -1; // most recent
var lastTrashGrab2 = -1; // second most recent
var preventPickupTrash = [false, false, false, false]; // true if you cannot pick up item
var can;

var trashTimer;
var waitForClick;

var trashGameLost = false;
var trashGameStarted = false;
var trashGameCanStart = false;
var trashGameCompleted = false;

class ParkRoom extends PNGRoom {
  preload() {

    // Pre load trash grabbables
    trash.push(new StaticSprite("plastic bag", 100, 200, 'assets/items/plastic_bag.png'));
    trash.push(new StaticSprite("candy wrapper", 800, 70, 'assets/items/plastic_wrap.png'));
    trash.push(new StaticSprite("straw", 400, 600, 'assets/items/straw.png'));
    trash.push(new StaticSprite("plastic water bottle", 1180, 650, 'assets/items/water_bottle.png'));

    can = new GarbageCan("Can", width / 2, height / 2, 'assets/trash.png');

    this.neighborhood_sign = loadImage('assets/neighborhood_sign.png');
    this.store_sign = loadImage('assets/store_sign.png');

    this.isSetup = false;
  }

  draw() {
    if (this.isSetup === false) {

      // Set up for grabbales
      for (let i = 0; i < trash.length; i++) {
        trash[i].setup();
      }

      // Set up for text boxes
      can.setup();
      mouseClicks = 0;

      // Set up for mini game timer
      trashTimer = new Timer(20000); // 20 seconds
      trashTimer.start();

      this.isSetup = true;
    }

    super.draw();
    notSplashOrInstruct();

    // Draw sprites
    drawSprite(can.sprite);

    for (let i = 0; i < trash.length; i++) {
      drawSprite(trash[i].sprite);
    }

    // Draw grass
    let x_grass = [50, 100, 200, 300, 400, 500, 700, 800, 900, 1000, 1100, 1200];
    let y_grass = [50, 650, 150, 500, 260, 600, 200, 400, 100, 650, 500, 50];

    for (let i = 0; i < x_grass.length; i++) {
      image(grass[curr_grass], x_grass[i], y_grass[i]);
    }

    // Draw tree
    let x_tree = [150, 300, 910, 950];
    let y_tree = [550, 0, 340, -150];

    let tree = trees[curr_tree];
    tree.resize(180, 337);

    for (let j = 0; j < x_tree.length; j++) {
      image(tree, x_tree[j], y_tree[j]);
    }

    // Change images
    if (timer.expired()) {
      curr_grass++;
      curr_tree++;
      if (curr_grass == 4) {
        curr_grass = 0;
      }
      if (curr_tree == 3) {
        curr_tree = 0;
      }
      timer.start();
    }

    // Trash can code
    if (can.isFull()) {
      trashTimer.pause();
      trashGameCompleted = true;
    }

    // Check if the player is overlapping the trash can & add item 
    if (playerAvatar.sprite.overlap(can.sprite) && playerAvatar.grabbable !== undefined) {
      can.addItem(playerAvatar.getGrabbableName());
      playerAvatar.grabbable.sprite.remove();
      playerAvatar.clearGrabbable();
    }

    // Grabbale Code
    if (lastTrashGrab1 >= 0 && !playerAvatar.sprite.overlap(trash[lastTrashGrab1].sprite)) {
      preventPickupTrash[lastTrashGrab1] = false;
      lastTrashGrab1 = -1;
    }

    for (i = 0; i < trash.length; i++) {

      // If you can pick it up & if the player is overlapping the item
      if (!preventPickupTrash[i] && playerAvatar.sprite.overlap(trash[i].sprite)) {

        // Don't re-pick up removed items
        if (!can.itemsThrownAway().includes(trash[i].name)) {
          playerAvatar.setGrabbable(trash[i]);
          preventPickupTrash[i] = true;
          lastTrashGrab2 = lastTrashGrab1;
          lastTrashGrab1 = i;
        }
      }
    }

    if (lastTrashGrab1 >= 0 && lastTrashGrab2 >= 0 && !playerAvatar.sprite.overlap(trash[lastTrashGrab2].sprite)) {
      preventPickupTrash[lastTrashGrab2] = false;
      lastTrashGrab2 = -1;
    }

    checkItemDrop();

    // Draw text box intro & don't let character move until they go through all the text
    if (!trashGameCompleted) {
      if (mouseClicks === 0) {
        speed = 0;
        drawTextBox("You", 147, 508, "Hmm, it looks like this park is littered with single use plastics.");
      } else if (mouseClicks === 1) {
        drawTextBox("You", 147, 508, "Don't these humans know plastics take years to break down & cause green house gasses to leak into their atmosphere?");
      } else if (mouseClicks === 2) {
        drawTextBox("You", 147, 508, "I guess I should quickly go around and pick everything up!");
        trashGameCanStart = true;
      } else {
        // Draw "trash collected"
        textAlign(CENTER);
        textFont(din_condensed);
        image(med_textbox, 1110, 10);
        textSize(50);
        text(can.items.length + "/4", 1185, 65);
        textSize(13);
        text("TRASH COLLECTED", 1185, 92);
      }
    } else {
      image(this.neighborhood_sign, 30, 220);
      image(this.store_sign, 1150, 280);
      drawTasks();
    }

    // If user went through the intro, begin mini-game
    if (trashGameStarted === true) {
      speed = 5;
      drawTimer(trashTimer);

      // If player did not complete task on time, tell them to restart
      if (trashTimer.expired() && !can.isFull()) {
        can.message = "Oh no you ran out of time!"
        speed = 0;
        image(thick_textbox, 350, 200);
        textAlign(CENTER);
        textSize(24);
        text("Oh no you ran out time, too many green house gasses polluted the air, and climate change on Earth is now irriversable. Let's head back to the ship to retry!", 400, 255, 500, 150);
        trashGameLost = true;
      }

      if (solarGameCompleted && groceryGameCompleted) {
        can.message = "Go back to the fountain to return to ship!";
      } else if (solarGameCompleted) {
        can.message = "Two tasks done, now let's check out the store!";
      } else if (groceryGameCompleted) {
        can.message = "Two tasks done, now let's check out the neighborhood!";
      }

      // Draw progress text at the bottom of the screen
      image(long_textbox, 393, 625);
      textAlign(CENTER);
      textSize(17);
      textFont(din_condensed);
      text(can.message, width / 2, height - 50);
    }
  }
}

/**
 * Class for the grocery store
 */

var lastGroceryGrab1 = -1; // most recent
var lastGroceryGrab2 = -1; // second most recent
var preventPickupGroceries = [false, false, false, false, false, false, false, false]; // true if you cannot pick up item

var cashierClicks;
var cashier;
var cashierTimer;

var groceryGameLost = false;
var groceryGameStarted = false;
var groceryGameCompleted = false;

var upDown = false; // up=true, down=false
var upDownTimer;

class StoreRoom extends PNGRoom {
  preload() {

    // Pre load images of groceries
    groceries.push(new StaticSprite("Apple", 755, 382, 'assets/items/apple.png'));
    groceries.push(new StaticSprite("Banana", 1000, 380, 'assets/items/banana.png'));
    groceries.push(new StaticSprite("Broccoli", 1125, 383, 'assets/items/broccoli.png'));
    groceries.push(new StaticSprite("Bacon", 937, 115, 'assets/items/bacon.png'));
    groceries.push(new StaticSprite("Chicken", 505, 117, 'assets/items/chicken.png'));
    groceries.push(new StaticSprite("Steak", 1095, 120, 'assets/items/steak.png'));
    groceries.push(new StaticSprite("Tofu", 188, 117, 'assets/items/tofu.png'));
    groceries.push(new StaticSprite("Milk", 350, 117, 'assets/items/milk.png'));

    // Create cashier sprite
    cashier = new StoreAssociate("Cashier", 78, 393, 'assets/people/store_associate01.png');

    this.message = "Bring climate friendly foods over to the cashier!";
    this.isSetup = false;
  }

  draw() {

    // Set up for StoreRoom
    if (this.isSetup === false) {
      for (let i = 0; i < groceries.length; i++) {
        groceries[i].setup();
      }

      cashier.setup();

      cashierTimer = new Timer(60000); // 60 seconds
      cashierTimer.start();

      upDownTimer = new Timer(500); // 1 seconds
      upDownTimer.start();

      mouseClicks = 0;
      cashierClicks = 0;
      this.isSetup = true;
    }

    super.draw();
    notSplashOrInstruct();

    // Draw Sprites
    drawSprite(cashier.sprite);

    for (let i = 0; i < groceries.length; i++) {
      drawSprite(groceries[i].sprite);
    }

    // Make foods that are grabbale bounce up and down
    if (upDownTimer.expired()) {
      for (let i = 0; i < groceries.length; i++) {
        if (playerAvatar.getGrabbableName !== groceries[i].name && upDown) {
          groceries[i].sprite.position.y = groceries[i].sprite.position.y + 5;
        } else if (playerAvatar.getGrabbableName !== groceries[i].name && !upDown) {
          groceries[i].sprite.position.y = groceries[i].sprite.position.y - 5;
        }
      }
      if (upDown) {
        upDown = false;
      } else {
        upDown = true;
      }
      upDownTimer.start();
    }


    // Grabbale Code
    if (lastGroceryGrab1 >= 0 && !playerAvatar.sprite.overlap(groceries[lastGroceryGrab1].sprite)) {
      preventPickupGroceries[lastGroceryGrab1] = false;
      lastGroceryGrab1 = -1;
    }

    // Check if you can pick up a grabbable, and if so set some variables
    for (i = 0; i < groceries.length; i++) {
      if (!preventPickupGroceries[i] && playerAvatar.sprite.overlap(groceries[i].sprite)) {
        if (!cashier.basket.includes(groceries[i].name)) {
          playerAvatar.setGrabbable(groceries[i]);
          preventPickupGroceries[i] = true;
          lastGroceryGrab2 = lastGroceryGrab1;
          lastGroceryGrab1 = i;
        }
      }
    }
    if (lastGroceryGrab1 >= 0 && lastGroceryGrab2 >= 0 && !playerAvatar.sprite.overlap(groceries[lastGroceryGrab2].sprite)) {
      preventPickupGroceries[lastGroceryGrab2] = false;
      lastGroceryGrab2 = -1;
    }

    checkItemDrop();

    // Draw message about the product after it is added to basket
    if (cashierClicks === 0) {
      speed = 0;
      drawTextBox("Cashier", 313, 353, cashier.message);
    }

    // Check if the player is overlapping the cashier with grabbable
    if (playerAvatar.sprite.overlap(cashier.sprite) && playerAvatar.grabbable !== undefined) {
      cashier.addToBasket(playerAvatar.getGrabbableName());
      playerAvatar.grabbable.sprite.remove();
      playerAvatar.clearGrabbable();

      cashierClicks = 0;
    }

    if (mouseClicks > 0) {
      speed = 5;
      groceryGameStarted = true;
      drawTimer(cashierTimer);

      // Check if player got all the correct food items
      if (cashier.basketContainsAllGoodFood()) {
        groceryGameCompleted = true;
        cashierTimer.pause();
      } else if (cashierTimer.expired()) {
        speed = 0;
        image(thick_textbox, 350, 200);
        textAlign(CENTER);
        textSize(24);
        text("You're out of time! Poor food choices made by humans caused too many green house gasses to pollute the air, and climate change is now irriversable. Let's head back to the ship to retry!", 400, 245, 500, 150);
        groceryGameLost = true;
      }

      if (!groceryGameCompleted) {
        // Draw "food collected"
        textAlign(CENTER);
        textFont(din_condensed);
        image(med_textbox, 1110, 10);
        textSize(50);
        text(cashier.goodFoodsCollected() + "/4", 1185, 65);
        textSize(13);
        text("GOOD FOODS", 1185, 92);
      } else {
        drawTasks();
      }
    }

    if (groceryGameStarted) {
      if (trashGameCompleted && groceryGameCompleted && solarGameCompleted) {
        this.message = "Go back to the fountain to return to ship!";
      } else if (groceryGameCompleted) {
        this.message = "Great job, let's go to the neighborhood now!";
      } else if (cashier.goodFoodsCollected() > 1) {
        this.message = "You're half way there, keep it up!";
      }
      // Draw progress text at the bottom of the screen
      image(long_textbox, 393, 625);
      textAlign(CENTER);
      textSize(17);
      textFont(din_condensed);
      text(this.message, width / 2, height - 50);
    }

    let x = playerAvatar.sprite.position.x;
    let y = playerAvatar.sprite.position.y;

    // Allow exit of store
    if (x === 10) {
      playerAvatar.sprite.position.x = 1050;
      playerAvatar.sprite.position.y = 330;
      adventureManager.changeState("Parking");
    }
  }
}

/**
 * Class that describes what happens in the parking lot.
 */

var carTimer;

class ParkingRoom extends PNGRoom {

  preload() {

    carTimer = new Timer()

    this.blueCar = new StaticSprite('BlueCar', 480, 170, 'assets/car01.png');
    this.greenCar = new StaticSprite('GreenCar', 630, 550, 'assets/car02.png');
    this.redCar = new StaticSprite('RedCar', 870, 430, 'assets/car03.png');

    this.setup = false;
  }

  draw() {

    // Set up for ParkingRoom
    if (this.setup === false) {
      carTimer = new Timer(5000);

      this.blueCar.setup();
      this.changeBlueDir = true;

      this.greenCar.setup();
      this.changeGreenDir = true;

      this.redCar.setup();
      this.changeRedDir = true;

      this.setup = true;
    }
    super.draw();
    notSplashOrInstruct();

    // Draw the cars
    drawSprite(this.blueCar.sprite);
    drawSprite(this.greenCar.sprite);
    drawSprite(this.redCar.sprite);

    // If the greocery game is completed, stop moving the cars
    if (!groceryGameCompleted) {
      // Move the blue car
      if (this.blueCar.sprite.position.x > 720) {
        this.changeBlueDir = true;
      } else if (this.blueCar.sprite.position.x <= 480) {
        this.changeBlueDir = false;
      }
      if (this.blueCar.sprite.position.x >= 480 && this.changeBlueDir == false) {
        this.blueCar.sprite.position.x += 5;
      } else if (this.changeBlueDir == true) {
        this.blueCar.sprite.position.x -= 5;
      }

      // Move the green car
      if (this.greenCar.sprite.position.x > 900) {
        this.changeGreenDir = true;
      } else if (this.greenCar.sprite.position.x <= 630) {
        this.changeGreenDir = false;
      }
      if (this.greenCar.sprite.position.x >= 630 && this.changeGreenDir == false) {
        this.greenCar.sprite.position.x += 8;
      } else if (this.changeGreenDir == true) {
        this.greenCar.sprite.position.x -= 8;
      }

      // Move the red car
      if (this.redCar.sprite.position.x > 870) {
        this.changeRedDir = true;
      } else if (this.redCar.sprite.position.x <= 600) {
        this.changeRedDir = false;
      }
      if (this.redCar.sprite.position.x >= 600 && this.changeRedDir == false) {
        this.redCar.sprite.position.x += 2;
      } else if (this.changeRedDir == true) {
        this.redCar.sprite.position.x -= 2;
      }

      // Check if player crashed into car
      if (playerAvatar.sprite.overlap(this.blueCar.sprite) ||
        playerAvatar.sprite.overlap(this.redCar.sprite) ||
        playerAvatar.sprite.overlap(this.greenCar.sprite)) {
        playerAvatar.sprite.position.x = 100;
        playerAvatar.sprite.position.y = 200;
      }
    }


    // Use the door to get inside SafeWay
    let x = playerAvatar.sprite.position.x;
    let y = playerAvatar.sprite.position.y;

    if (x > 1055 && x < 1135 && y > 275 && y < 425) {
      playerAvatar.sprite.position.x = 50;
      playerAvatar.sprite.position.y = 200;
      adventureManager.changeState("Store");
    }

    // Draw remaining tasks
    drawTasks();
  }
}

/**
 * Class that describes the neighborhood & the solar energy game
 */
var energyTimer;
var spawnSunTimer;
var sun;
var sunshinesCaught = 0;
var energybars = [];

var solarGameLost = false;
var solarGameStarted = false;
var solarGameCompleted = false;

class HomesRoom extends PNGRoom {
  preload() {

    sun = loadImage('assets/sun.png');
    energybars[0] = loadImage('assets/energybars/energybar0.png');
    energybars[1] = loadImage('assets/energybars/energybar1.png');
    energybars[2] = loadImage('assets/energybars/energybar2.png');
    energybars[3] = loadImage('assets/energybars/energybar3.png');
    energybars[4] = loadImage('assets/energybars/energybar4.png');
    energybars[5] = loadImage('assets/energybars/energybar5.png');
    energybars[6] = loadImage('assets/energybars/energybar6.png');
    energybars[7] = loadImage('assets/energybars/energybar7.png');
    energybars[8] = loadImage('assets/energybars/energybar8.png');
    energybars[9] = loadImage('assets/energybars/energybar9.png');
    energybars[10] = loadImage('assets/energybars/energybar10.png');
    energybars[11] = loadImage('assets/energybars/energybar11.png');
    energybars[12] = loadImage('assets/energybars/energybar12.png');
    energybars[13] = loadImage('assets/energybars/energybar13.png');
    energybars[14] = loadImage('assets/energybars/energybar14.png');
    energybars[15] = loadImage('assets/energybars/energybar15.png');
    energybars[16] = loadImage('assets/energybars/energybar16.png');

    this.sunshines = new Group();
    this.message = "Collect solar energy to power the neighborhood!";
    this.setup = false;
  }
  draw() {

    // Set up function for HomesRoom
    if (this.setup === false) {

      energyTimer = new Timer(25000); // 25 seconds for game
      spawnSunTimer = new Timer(1000); // spawn a sun every second
      energyTimer.start();
      spawnSunTimer.start();

      mouseClicks = 0;
      this.setup = true;
    }

    super.draw();
    notSplashOrInstruct();

    // Have player go through story before game beings
    if (mouseClicks === 0) {
      drawTextBox("You", 147, 508, "It looks like a lot of people on Earth have not added solar panels to their roofs.");
    } else if (mouseClicks === 1) {
      drawTextBox("You", 147, 508, "If more people went solar, fossil fuel consumption would be reduced, limiting greenhouse gas emissions.");
    } else if (mouseClicks === 2) {
      drawTextBox("You", 147, 508, "Just one home installing solar can have a measurable effect on the environment.");
    } else if (mouseClicks === 3) {
      drawTextBox("You", 147, 508, "I will help them take the first step by gathering up as much solar energy while I am here.");
    } else {
      drawTimer(energyTimer);
      image(energybars[sunshinesCaught], 30, 100);
    }

    // Begin minigame after player goes through text
    if (mouseClicks > 3) {
      solarGameStarted = true;

      // Player gathered all sunshines, they win
      if (sunshinesCaught === 16) {
        energyTimer.pause();
        solarGameCompleted = true;

        // End game if player fails to gather sunshines before time ends
      } else if (energyTimer.expired()) {

        speed = 0;
        image(thick_textbox, 350, 200);
        textAlign(CENTER);
        textSize(20);
        text("Since not enough people switched to solar energy, green house gasses produced from burning fossil fuels have polluted the atmosphere beyond levels of expectation, and climate change on Earth is now irriversable. Head back to the ship to retry!", 400, 255, 500, 200);
        solarGameLost = true;

        // Run the game
      } else {

        // Creaate a new sunshine every second
        if (!energyTimer.expired() || sunshinesCaught < 16) {
          if (spawnSunTimer.expired()) {
            let randX = random(10, 1280);
            var sunshine = createSprite(randX, 10);
            sunshine.addAnimation('regular', sun, sun);
            this.sunshines.add(sunshine);
            spawnSunTimer.start();
          }

          // Add velocity to sunshines & remove them if they go off the screen
          for (i = 0; i < this.sunshines.length; i++) {

            // Randomize the speed of the sun falling
            var sprite = this.sunshines[i];
            sprite.velocity.y = random(3, 6);

            // Remove sprite if it falls past the screen
            if (sprite.position.y > 740) {
              sprite.remove();
            }

            // Check if avatar caught a sprite
            if (sprite.overlap(playerAvatar.sprite) && sunshinesCaught < 16) {
              sunshinesCaught++;
              sprite.remove();
            }
          }
          // Draw sunshine sprites
          this.sunshines.draw();
        }
      }

      // Once game has started, draw game progress messages
      if (solarGameStarted) {
        // Game progess messages
        if (trashGameCompleted && groceryGameCompleted && solarGameCompleted) {
          this.message = "Go back to the fountain to return to ship!";
        } else if (solarGameCompleted) {
          this.message = "You collected enough energy, let's go to the store now!";
        } else if (sunshinesCaught > 8) {
          this.message = "You're half way there, keep it up!";
        }

        // Draw text box and game progress message
        image(long_textbox, 393, 625);
        textAlign(CENTER);
        textSize(17);
        textFont(din_condensed);
        text(this.message, width / 2, height - 50);
      }
    }

    // Draw the number of tasks completed
    drawTasks();
  }
}

/**
 * Class that describes what happens at the playground.
 */
class PlayRoom extends PNGRoom {
  preload() {
    this.child = new StaticSprite("Child", 800, 300, 'assets/people/child.png');
    this.setup = false;
  }
  draw() {

    // Set up for PlayRoom
    if (this.setup === false) {
      this.child.setup();
      this.setup = true;
    }
    super.draw();
    notSplashOrInstruct();

    // Draw child sprite that asks for phone games
    drawSprite(this.child.sprite);
    if (playerAvatar.sprite.overlap(this.child.sprite)) {
      drawTextBox("Child", 140, 508, "*sniff* Got any games on your phone? *sniff*");
    }

    // Draw the number of tasks completed
    drawTasks();
  }
}

/**
 * Class that describes what happens in the fountain room.
 */
var readInstructions = false;
var gameCompleted = false;

class FountainRoom extends PNGRoom {

  preload() {
    this.setup = false;
    this.teleport = loadImage('assets/teleport.png');
  }

  draw() {

    // Set up for FountainRoom
    if (this.setup === false) {
      mouseClicks = 0;
      this.setup = true;
    }
    super.draw();
    notSplashOrInstruct();

    // Draw grass
    let x_grass = [50, 100, 300, 470, 900, 1000, 1130, 1200];
    let y_grass = [30, 700, 570, 640, 30, 650, 470, 150];

    for (let i = 0; i < x_grass.length; i++) {
      image(grass[curr_grass], x_grass[i], y_grass[i]);
    }

    // Draw tree
    let x_tree = [-50, 150, 1070, 1100];
    let y_tree = [75, 550, 340, -100];

    let tree = trees[curr_tree];
    tree.resize(180, 337);

    for (let j = 0; j < x_tree.length; j++) {
      image(tree, x_tree[j], y_tree[j]);
    }

    // Change images
    if (timer.expired()) {
      curr_grass++;
      curr_tree++;
      if (curr_grass == 4) {
        curr_grass = 0;
      }
      if (curr_tree == 3) {
        curr_tree = 0;
      }
      timer.start();
    }

    // Draw beginning instructions, and don't let player move until they click
    if (mouseClicks === 0 && gameCompleted === false) {
      speed = 0;
      image(thick_textbox, 350, 200);
      textAlign(CENTER);
      textSize(24);
      textFont(din_condensed);
      text("Complete three tasks to help humans reverse climate change before it is too late! Use your keyboard's arrow keys to move and the keyboard letter X to drop any items you are carrying. Return here once all three tasks are complete!", 400, 250, 500, 200);
      textSize(15);
      text("Click anywhere to begin!", 650, 455);
    } else {
      speed = 5;
    }

    // Allow the player to teleport if all the tasks have been completed
    if (trashGameCompleted && solarGameCompleted && groceryGameCompleted) {

      image(this.teleport, 900, 0);

      let x = playerAvatar.sprite.position.x;
      let y = playerAvatar.sprite.position.y;
      if (x > 940 && x < 1090 && y < 285 && y > 100) {
        speed = 0;
        image(thick_textbox, 350, 200);
        textAlign(CENTER);
        textSize(24);
        textFont(din_condensed);
        text("The timer on this hot clock called Earth has been put in reverse! Humans watched the way you dealt with climate change and are now on the way to making changes to make Earth a better, and cooler place!", 400, 280, 500, 200);
        textSize(15);
      }
    }

    // Draw number of tasks left
    drawTasks();
  }
}

/**
 * Check if x key has been pressed to drop item.
 */
function checkItemDrop() {
  if (keyIsDown(X_KEY) && playerAvatar.grabbable !== undefined) {
    playerAvatar.clearGrabbable();
  }
}

/**
 * Reset timers when mouse has been pressed.
 */
function mousePressed() {
  mouseClicks++;
  cashierClicks++;

  if (trashGameStarted === false && trashGameCanStart === true) {
    trashTimer.reset();
    trashGameStarted = true;
  }

  if (solarGameStarted === false) {
    energyTimer.reset();
  }

  if (groceryGameStarted === false) {
    cashierTimer.reset();
  }
}

/**
 * Draw text box with specified name and message.
 */
function drawTextBox(name, name_x, name_y, message) {
  textFont(din_condensed);

  textSize(25);
  if (adventureManager.getStateName() === "Store") {
    image(textbox, 215, 315);
    text(name, name_x, name_y);
    textSize(19);
    text(message, 270, 385, 580, 150);
    textSize(15);
    text("Click to continue", 740, 505);
  } else if (adventureManager.getStateName() === "Playground") {
    image(textbox, 30, 470);
    text(name, name_x, name_y);
    text(message, 80, 545, 600, 150);
    textSize(15);
    text("Walk away to ignore", 530, 650);
  } else {
    image(textbox, 30, 470);
    text(name, name_x, name_y);
    text(message, 80, 545, 600, 150);
    textSize(15);
    text("Click to continue", 550, 650);
  }
}

/**
 * Draw the remaining time of the specified timer in the top left corner.
 */
function drawTimer(timer) {
  textAlign(CENTER);
  image(timer_textbox, 30, 10);
  textFont(din_condensed);
  textSize(50);
  text(Math.round(timer.getRemainingTime() / 1000), 80, 62);
  textSize(13);
  text("SECONDS", 80, 90);
}

/**
 * Draw the progress of tasks completed in the top right corner.
 */
function drawTasks() {

  // Add one if a game has been completed
  let tasks = 0;
  if (trashGameCompleted) {
    tasks++;
  }
  if (solarGameCompleted) {
    tasks++;
  }
  if (groceryGameCompleted) {
    tasks++;
  }

  // Draw textbox
  textAlign(CENTER);
  textFont(din_condensed);
  image(med_textbox, 1110, 10);
  textSize(50);
  text(tasks + "/3", 1185, 65);
  textSize(13);
  text("TASKS COMPLETE", 1185, 92);

  // If all three tasks have been completed, the game is done.
  if (tasks === 3) {
    gameCompleted = true;
  }
}

/**
 * Debugging function that draws avatar & mouse X/Y positions.
 */
function drawMousePosition() {
  text("Avatar X: " + playerAvatar.sprite.position.x, 600, 50);
  text("Avatar Y: " + playerAvatar.sprite.position.y, 600, 70);

  text("X: " + mouseX, 600, 180);
  text("Y: " + mouseY, 600, 200);
}