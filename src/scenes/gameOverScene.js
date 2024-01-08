import * as Phaser from 'phaser'
import GameScene from './gameScene'

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {
  }

  create() {
    // Background color
    this.cameras.main.setBackgroundColor('#262626')

    // Texts
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Game Over!', { fontSize: '40px' })
      .setOrigin(0.5).setColor('#ffffff')
    const restartBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Restart Game', { fontSize: '48px' })
      .setOrigin(0.5).setColor('#ffffff')
    restartBtn.setInteractive()
    restartBtn.on('pointerdown', this.restartGame)
  }

  update() {
  }

  restartGame() {
    this.scene.scene.start('GameScene')
  }
}