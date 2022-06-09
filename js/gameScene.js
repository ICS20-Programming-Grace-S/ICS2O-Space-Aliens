/* global Phaser */

// Created by: Mr. Coxall
// Created on: April 2022
// This file contains the JS functions for index.html

class GameScene extends Phaser.Scene {

  // create an alien
  createAlien () {
    const alienXLocation = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920;
    let alienXVelocity = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50;
    alienXVelocity *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
    const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
    anAlien.body.velocity.y = 200
    anAlien.body.velocity.x = alienXVelocity
    this.alienGroup.add(anAlien)
  }

  
  constructor () {
    super({ key: 'gameScene' })

    this.ship = null
    this.fireMissile = false
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }

    this.gameOverText = null
    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#0x5f6e7a')
  }

  preload () {
    console.log('Game Scene')

    // images
    this.load.image('starBackground', 'images/star_background1.avif')
    this.load.image('ship', 'images/spaceShip.png')
    this.load.image('missile', 'images/missile.png')
    this.load.image('alien', 'images/alien.png')
    
    // sounds
    this.load.audio('laser', 'sounds/laser1.wav')
    this.load.audio('explosion', 'sounds/barrelExploding.wav')
  }

  create (data) {
    this.background = this.add.image(0, 0, 'starBackground').setScale(4.0)
    this.background.setOrigin(0, 0)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the aliens
    this.alienGroup = this.add.group()
    this.createAlien()

    //Collisions between missiles and aliens
    this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileColllide, alienCollide) {
      alienCollide.destroy()
      missileColllide.destroy()
      this.sound.play('explosion')
      this.createAlien()
      this.createAlien()
    }.bind(this))
  }

  update (time, delta) {
    // called 60 times a second, hopefully!
    const keyLeftObj = this.input.keyboard.addKey('LEFT')
    const keyRightObj = this.input.keyboard.addKey('RIGHT')
    const keySpaceObj = this.input.keyboard.addKey('SPACE')

    if (keyLeftObj.isDown === true) {
      this.ship.x -= 15
      if (this.ship.x < 0) {
        this.ship.x = 1920
      }
    }

    if (keyRightObj.isDown === true) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 0
      }
    }
    if (keySpaceObj.isDown === true) {
      if (this.fireMissile === false) {
        
        // fire missile
        this.fireMissile = true
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)
        this.sound.play('laser')
      }
    }
  
    if (keySpaceObj.isUp === true) {
      this.fireMissile = false
    }

    this.missileGroup.children.each(function (item) {
      item.y = item.y - 15
      if (item.y < 0) {
        item.destroy()
      }
    })
  }
}

export default GameScene