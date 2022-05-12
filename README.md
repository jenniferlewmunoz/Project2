# The Hot Clcok
## 2D Adventure Game on Climate Change
#### by Jennifer Lew Munoz

## Links
Play The Hot Clock: https://xarts.usfca.edu/~jjlewmunoz/Project2/

Adobe XD: https://xd.adobe.com/view/6f00a53c-f8de-4144-a329-c506ed693ac9-3a53/


## Introduction 
The Hot Clock is a social justice 2D adventure game that addresses the issue of climate change. Since the 1760 Industrial Reveloution, humans have been causing long term changes to our planet's climate that will soon become irreversible if our ways of living do not change. This game brings to light the 3 biggest contributors to climate change:

- Methane emissions from landfills
- The burning of fossil fuels
- Food waste / livestock emissions

## Instructions

Use the arrow keys on your keyboard to move left, right, up, down, and diagonally. If carrying an item such as trash, or a grocery item, you can use the 'X' key on your keyboard to drop the item.

Complete all three tasks that combat the biggest contributors to climate change today in order to win the game and 'show humans how to defeat climate change.'


## sketch.js
This file describes most of the functionality of the game as it is made up of many classes that describe each “scene” in the game. Some of the classes include:

- FountainRoom: where the player spawns at the beginning of the game & must return at the end to complete the game
- ParkRoom: player must complete “TrashGame” here which is described in code by them overlapping their avatar coordinates with those of “grabable” trash objects and bringing them to the trash can in the middle (code that describes the trash can can be found in p5.avatar.js)
- PlayRoom: describes a simple filler room that shows a playground, there is one NPC character who is a child that says something silly
- HomesRoom: player must complete the “SolarGame” in this room in which one sunlight sprite falls from a random X coordinate at the top of the screen every second until the player is able to collect/overlap 16 of these sunlight sprites to fill the “energy bar” on the left
- ParkingRoom: player must find their way around cars in the parking lot when they first enter; if they happen to bump into one, the avatar is respawned at the very left of the screen to try again. If the player, has completed the game inside the store, the cars will stop moving so it is not difficult for them to get back to the rest of the game.
- StoreRoom: The player must collect 4 different climate change friendly foods throughout the store; those that have a bouncing effect are foods that are “grabbable” and can be brought to the cashier for inspection. More source code that defines the cashier can be found in p5.avatar.js. A 60 second timer is run until the player successfully brings all 4 “correct” food items to the cashier.
