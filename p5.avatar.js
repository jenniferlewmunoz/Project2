/***********************************************************************************
  Avatar Classes

  Uses the p5.play library with Avatar and other classes

  This class is a TEMPLATE for you to modify in your other code.

  Avatar Class:
    - will automatically mirror when you change the speed of the avatar
    - you can change the speed of the avatar
    - set positions for each one
    - do collision-detection
  
------------------------------------------------------------------------------------
  To use:
  Add this line to the index.html

  <script src="p5.avatar.js"></script>
***********************************************************************************/

// Animated character
class Avatar {
  // gets called with new keyword
  constructor(name, x, y) {
    this.name = name;
    this.sprite = createSprite(x, y);

    this.maxSpeed = 6;
    this.hasStandingAnimation = false;
    this.hasMovingAnimation = false;

    // no grabables
    this.grabbable = undefined;

    // make avatar still
    this.setSpeed(0, 0);
  }

  // adds a moving animation (optional)
  addMovingAnimation(startPNGPath, endPNGPath) {
    this.sprite.addAnimation('walking', startPNGPath, endPNGPath);
    this.hasMovingAnimation = true;
    this.currentAnimation = 'walking';
  }

  // adds a standing animation (optional)
  addStandingAnimation(startPNGPath, endPNGPath) {
    this.sprite.addAnimation('standing', startPNGPath, endPNGPath);
    this.hasStandingAnimation = true;
  }

  setPosition(x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
  }

  // store max speed in a class variable, so that we never go past this number
  setMaxSpeed(num) {
    this.maxSpeed = num;
  }

  // return name of current grabble, empty string if none
  getGrabbableName() {
    if (this.grabbable === undefined) {
      return "";
    }
    else {
      return this.grabbable.name;
    }
  }

  // set current speed, flip sprite, constain to max, change animations
  setSpeed(xSpeed, ySpeed) {
    // flip sprite depending on direction
    if (xSpeed > 0) {
      this.sprite.mirrorX(-1);
    }
    else {
      this.sprite.mirrorX(1);
    }

    if (this.hasStandingAnimation) {
      this.sprite.changeAnimation('standing');
    }

    // may need to optimize this
    if (xSpeed === 0 && ySpeed === 0 && this.hasStandingAnimation) {
      this.sprite.changeAnimation('standing');
    }
    else if (this.hasMovingAnimation) {
      this.sprite.changeAnimation('walking');
    }

    // set to xSpeed and constrain to max speed
    this.sprite.velocity.x = constrain(xSpeed, -this.maxSpeed, this.maxSpeed);
    this.sprite.velocity.y = constrain(ySpeed, -this.maxSpeed, this.maxSpeed);
  }

  // a sprite (or avatar to check overlap with)
  overlap(overlapSprite, callback) {
    if (overlapSprite === undefined) {
      return;
    }

    this.overlap(overlapSprite.sprite, callback);
  }

  // accessor function to give avatar a grabbable
  clearGrabbable() {
    this.grabbable = undefined;
  }

  // accessor function to give avatar a grabbable
  setGrabbable(grabbable) {
    this.grabbable = grabbable;
  }

  // if avatar has a grabble, update the position of that grabbable
  // call every draw loop
  update() {
    if (this.grabbable !== undefined) {
      this.grabbable.sprite.position.x = this.sprite.position.x + 50;
      this.grabbable.sprite.position.y = this.sprite.position.y + 10;
    }
  }

  // draws the name, an optional feature
  drawLabel() {
    textSize(12);
    fill(240);
    text(this.name, this.sprite.position.x + 20, this.sprite.position.y + 10);
  }
}

// 2D sprite which we will be able to pick up and dropp
class StaticSprite {
  // call upon preload() of p5.js to acutally load the image
  constructor(name, x, y, pngPath) {
    this.name = name;
    this.img = loadImage(pngPath);
    this.sprite = createSprite(x, y);
  }

  setup() {
    this.sprite.addImage('static', this.img);
  }
}

// extend static sprite
// setBounds(minX, maxX) 
// add a timer when u get to the end ?
// call update in draw every cycle

/*
  NPC Class - By Luis, modified by Scott
  
  This is a custom NPC class that extends the current Avatar class. An NPC will be able
  to have conversations with the player, who will be prompted to press a key in order
  to start a dialogue. Dialogue is progressed by pressing the same button while overlapping
  the NPC sprite. If a player steps away from an NPC, the dialogue will disappear.

  Functions:

*/

class NPC extends Avatar {
  constructor(name, x, y, pngPath) {
    super(name, x, y);
    this.interactionsArray = [];
    this.interactionIndex = 0;
    this.isActive = false;
    this.interactWithMeMessage = 'Press SPACE to interact';
    this.displayMessage = this.interactWithMeMessage;
    this.img = loadImage(pngPath);

    this.promptX = 0;
    this.promptY = -50;
    this.keyCodeNum = 32;   // default to SPACE Bar
    this.state = "default";
  }

  // Same as StaticSprite class, to support static NPCs
  setup() {
    this.sprite.addImage('static', this.img);
  }

  // default is space bar, this allows for others
  setInteractionKeyCode(keyCodeNum) {
    this.keyCodeNum = keyCodeNum;
  }

  // default interact with me message
  setInteractWithMeMessage(interactWithMeMessage) {
    this.interactWithMeMessage = interactWithMeMessage;
  }

  // where prompt will be located
  setPromptLocation(x, y) {
    this.promptX = x;
    this.promptY = y;
  }

  // allows for you to set a state message, can be anything you want
  setState(state) {
    this.state = state;
  }

  // Adds a single interaction to the array, should be a string parameter.
  addSingleInteraction(interaction) {
    this.interactionsArray.push(interaction);
  }

  // displays interactin prompt, usually with a collision
  displayInteractPrompt(target) {
    // Only displays the interact prompt or current dialogue of the NPC when the player 
    // avatar is overlapping the NPC sprite.
    if (target.sprite.overlap(this.sprite)) {
      this.drawPrompt();
      if (keyCode === this.keyCodeNum) {
        // This variable is to ensure that only one NPC is active at a time. Without this,
        // having multiple NPCs on a single screen may cause some bugs in the progression of
        // their individual dialogue.
        this.isActive = true;
        // Keeps an NPC from moving when they're being interacted with. Haven't tested yet, but
        // the idea is to be able to have NPCs that walk around on a set path. If you interact 
        // with an NPC during its cycle, it'll pause. Still thinking about how to continue the 
        // cycle afterwards.
        this.setSpeed(0, 0);

        this.displayMessage = this.interactionsArray[this.interactionIndex];
      }
    }
    else {
      // Go back to interact with me message
      this.displayMessage = this.interactWithMeMessage;
      this.isActive = false;
    }
  }

  // MODIFY THIS - drawing of the prompt
  drawPrompt() {
    fill('white');
    textSize(14);

    textAlign(CENTER);

    text(this.displayMessage, this.sprite.position.x + this.promptX, this.sprite.position.y + this.promptY);
  }

  // Continues the conversation with an NPC through the interaction array.
  continueInteraction() {
    if (this.isActive) {
      if (this.interactionIndex < this.interactionsArray.length - 1) {
        this.interactionIndex++;
      }
    }
  }

  // goes to zero
  resetInteraction() {
    this.interactionIndex = 0;
  }

  // Check for player avatar overlapping an NPC sprite and if that NPC and if that NPC 
  // is the current active NPC (only 1 at a time);
  isInteracting(target) {
    return target.sprite.overlap(this.sprite) && this.isActive;
  }
}

class GarbageCan extends StaticSprite {
  constructor(name, x, y, pngPath) {
    super(name, x, y, pngPath);
    this.items = [];
    this.full = false;
    this.message = "Pick up and toss all the trash before the timer runs out!";
  }

  // Check if item has
  addItem(item) {
    this.items.push(item);
    this.message = "Great job! You threw away a " + item + "!";
  }

  itemsThrownAway() {
    return this.items;
  }

  // Checks if the garbage can is full to end the mini-game
  // Bag, Wrapper, Straw, Bottle
  isFull() {
    if (this.items.length == 4) {
      this.full = true;
      this.message = "The park is all clean now thanks to you!";
      return true;
    }
    return false;
  }

}

class StoreAssociate extends StaticSprite {
  constructor(name, x, y, pngPath) {
    super(name, x, y, pngPath);
    this.basket = [];
    this.goodFood = ["Apple", "Banana", "Broccoli", "Tofu"];
    this.badFood = ["Bacon", "Chicken", "Steak", "Milk"];
    this.message = "Bring me food items that will help reduce your carbon footprint!";
  }

  addToBasket(name) {

    if (!this.basket.includes(name)) {
      this.basket.push(name);

      switch (name) {
        case "Apple":
          this.message = "Apples are great! They have a fairly low impaact on the environment, and their trees love to consume CO2 environment. Apples are at risk of extinction due to rising temperatures though!";
          break;
        case "Banana":
          this.message = "Bananas are great! They have a fairly low impact on the environment, and large banana tree plants love to consume CO2 from the atmosphere reducing the potential of climate change.";
          break;
        case "Broccoli":
          this.messaage = "Broccoli is great! Only 2kg of carbon are produced per kg of broccoli consumedd. Broccoli is delicious both raw and cooked. It makes a nutritious snack any time of day and an excellent side to just about any dish.";
          break;
        case "Bacon":
          this.message = "Bacon is bad! While beef production has a larger climate impact than pork, the gases emitted by hog manure lagoons contribute significantly to global warming. Pig waste produces large amounts of nitrous oxide, which has 300x the warming potential of CO2.";
          break;
        case "Chicken":
          this.message = "Chicken is bad! Land for “free roaming chicken” has a high demand and delicate ecosystems are being wiped out for livestock. These chickens release carbon dioxide into the atmosphere that those plants and trees would have absorbed for us.";
          break;
        case "Steak":
          this.message = "Steak is bad! Cows alone are responsible for the majority of livestock’s contribution to climate change, releasing methane through their burps, farts, and manure. Methane is at least 28 times as destructive as carbon dioxide!";
          break;
        case "Tofu":
          this.message = "Tofu is great! It is one of the most versatile plant proteins and comes in a range of soft and firm consistencies. Tofu takes on most any flavor or seasoning it’s given. The greenhouse gas emissions of tofu are 12.5x lower than a beef burger.";
          break;
        case "Milk":
          this.message = "Milk is bad! Cows alone are responsible for the majority of livestocks'contribution to climate change. Any plant based milk emit a lot less greenhouse gasses & even pull CO2 out of the atmosphere since they're plants!";
          break;
        default:
          this.message = "Please bring a me a food item from the store to check!";
      }
    }
  }

  basketContainsAllGoodFood() {
    let contains = true;
    for (let i = 0; i < this.goodFood.length; i++) {
      if (this.basket.includes(this.goodFood[i])) {
        contains = true;
      } else {
        return false;
      }
    }
    return true;
  }

  goodFoodsCollected() {
    let collected = 0;
    for (let i = 0; i < this.goodFood.length; i++) {
      if (this.basket.includes(this.goodFood[i])) {
        collected++;
      }
    }
    return collected;
  }
}

