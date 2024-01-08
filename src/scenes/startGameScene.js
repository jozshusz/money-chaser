import * as Phaser from 'phaser'
import GameScene from './gameScene'

export default class StartGameScene extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {
  }

  create() {
    // Background color
    this.cameras.main.setBackgroundColor('#fff')

    // Texts
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Welcome To Money Chaser!', { fontSize: '40px' })
      .setOrigin(0.5).setColor('#262626')
    const restartBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Start Game', { fontSize: '48px' })
      .setOrigin(0.5).setColor('#262626')
    restartBtn.setInteractive()
    restartBtn.on('pointerdown', this.restartGame)
  }

  update() {
  }

  restartGame() {
    this.scene.scene.start('GameScene')
  }
}