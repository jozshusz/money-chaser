import * as Phaser from 'phaser'
import GameScene from './scenes/gameScene'
import GameOverScene from './scenes/gameOverScene'
import StartGameScene from './scenes/startGameScene'
import PauseGameScene from './scenes/pauseGameScene'

// Game config: resolution, physics, scaling, title
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 300 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  title: 'Money Chaser'
}

// Setup game & scenes
const game = new Phaser.Game(config)
game.scene.add('StartGameScene', StartGameScene)
game.scene.add('GameOverScene', GameOverScene)
game.scene.add('GameScene', GameScene)
game.scene.add('PauseGameScene', PauseGameScene)
game.scene.start('StartGameScene')
console.log(screen.orientation.type)
console.log(window.screen.orientation.type)
window.screen.orientation.lock('landscape')
