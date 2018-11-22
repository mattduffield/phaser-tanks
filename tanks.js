var land;

var shadow;
var tank;
var bullets;

var logo;

var cursors;
var fireButton;
var currentSpeed = 0;

var bullets;
var fireRate = 100;
var nextFire = 0;

var bulletTime = 0;
var bullet;
var size = {
  height: 768,
  width: 1024
};
var game = new Phaser.Game(size.width, size.height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  // game.load.baseURL = 'http://localhost:8080/assets/';
  game.load.baseURL = 'assets/';
  game.load.crossOrigin = 'anonymous';

  game.load.image('logo', 'logo.png');  
  game.load.image('tank', 'tank_black.png');
  game.load.image('bullet', 'bullet.png');
  // game.load.image('bullet', 'bullet0.png');
  game.load.image('earth', 'scorched_earth.png');  
}
function create() {
  //  Resize our game world to be a 2000 x 2000 square
  game.world.setBounds(-1000, -1000, 2000, 2000);
  //  Our tiled scrolling background
  land = game.add.tileSprite(0, 0, size.width, size.height, 'earth');
  land.fixedToCamera = true;
  //  The base of our tank
  // tank = game.add.sprite(0, 0, 'tank', 'tank1');
  tank = game.add.sprite(0, 0, 'tank');
  tank.anchor.setTo(0.5, 0.5);
  // tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
  //  This will force it to decelerate and limit its speed
  game.physics.enable(tank, Phaser.Physics.ARCADE);
  tank.body.drag.set(0.2);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;
  
  //  A shadow below our tank
  shadow = game.add.sprite(0, 0, 'tank', 'shadow');
  shadow.anchor.setTo(0.5, 0.5);
  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet', 0, false);
  bullets.setAll('anchor.x', -1.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  //  Explosion pool
  explosions = game.add.group();
  
  for (var i = 0; i < 10; i++) {
    var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('kaboom');
  }

  tank.bringToTop();
  

  logo = game.add.sprite(0, 200, 'logo');
  logo.fixedToCamera = true;

  game.input.onDown.add(removeLogo, this);

  game.camera.follow(tank);
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}
function removeLogo () {
  game.input.onDown.remove(removeLogo, this);
  logo.kill();
}
function update () {
  tank.body.velocity.x = 0;
  tank.body.velocity.y = 0;
  
  if (cursors.left.isDown) {
    tank.angle -= 4;
  }
  else if (cursors.right.isDown) {
    tank.angle += 4;
  }
  if (cursors.up.isDown) {
    //  The speed we'll travel at
    currentSpeed = 300;
  }
  else {
    if (currentSpeed > 0) {
      currentSpeed -= 4;
    }
  }

  if (currentSpeed > 0) {
    game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
  }
  
  land.tilePosition.x = -game.camera.x;
  land.tilePosition.y = -game.camera.y;

  //  Position all the parts and align rotations
  shadow.x = tank.x;
  shadow.y = tank.y;
  shadow.rotation = tank.rotation;

  if (fireButton.isDown) {
    fire();
  }
}
function fire () {
  if (game.time.now > nextFire && bullets.countDead() > 0) {
    nextFire = game.time.now + fireRate;
    var bullet = bullets.getFirstExists(false);
    bullet.reset(tank.x, tank.y);
    bullet.rotation = tank.rotation;
    game.physics.arcade.velocityFromRotation(bullet.rotation, 1000, bullet.body.velocity);
    // bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
  }
}
function render () {

}
