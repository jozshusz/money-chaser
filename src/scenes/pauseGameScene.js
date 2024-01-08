import * as Phaser from 'phaser'
import GameScene from './gameScene'

export default class PauseGameScene extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {
  }

  create() {
    // Background color
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.4)')

    // Texts
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Game Paused!', { fontSize: '40px' })
      .setOrigin(0.5).setColor('#ffffff')
    const resumeBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Resume Game', { fontSize: '48px' })
      .setOrigin(0.5).setColor('#ffffff')
    resumeBtn.setInteractive()
    resumeBtn.on('pointerdown', this.resumeGame)
  }

  update() {
  }

  resumeGame() {
    this.scene.scene.resume('GameScene')
    this.scene.scene.stop()
  }
}