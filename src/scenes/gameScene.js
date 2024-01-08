import * as Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  cursors
  businessMan
  coins
  invoices
  bullets
  canFireBullet = false
  triggerCoinsTimer
  triggerInvoicesTimer
  points = 0
  scoreText
  turboChargePoints = 100
  isTurboCharging = false
  turboBox
  backgroundMusic
  invoiceSpawnDelay

  constructor() {
    super()
  }

  preload() {
    // Imgs
    this.load.image('backgroundCity', 'background_city.png')
    this.load.image('coin', 'coin.png')
    this.load.image('invoice', 'invoice.png')
    this.load.image('bullet', 'bullet-36942_640.png')
    this.load.image('pauseBtn', 'pause-button.png')

    // Character sprite
    this.load.spritesheet('businessMan',
      'boy-312238_1280.png',
      { frameWidth: 329, frameHeight: 429 }
    )

    // Sounds
    this.load.audio('coinPickUpSound', 'collectcoin-6075.mp3')
    this.load.audio('gameOverSound', 'game-over-arcade-6435.mp3')
    this.load.audio('backgroundMusic', 'music-for-arcade-style-game-146875.mp3')
  }

  create() {
    // Init
    this.points = 0
    this.cameras.main.fadeIn(2000)
    this.invoiceSpawnDelay = 2000

    // Background music
    this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.2 })
    this.backgroundMusic.play()
    this.backgroundMusic.setLoop(true)

    // Add background, fit
    const backgroundImg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'backgroundCity')//.setOrigin(0, 0)
    let scaleX = this.cameras.main.width / backgroundImg.width
    let scaleY = this.cameras.main.height / backgroundImg.height
    let scale = Math.max(scaleX, scaleY)
    backgroundImg.setScale(scale).setScrollFactor(0)

    // Pause button, top right
    const pauseBtn = this.add.image(this.cameras.main.width - 50, 50, 'pauseBtn').setScale(0.1)
    pauseBtn.setInteractive()
    pauseBtn.on('pointerdown', this.pauseScene.bind(this))

    // Character
    this.businessMan = this.physics.add.sprite(0, this.cameras.main.height, 'businessMan').setScale(0.5)
    this.businessMan.setCollideWorldBounds(true)
    this.businessMan.setBounce(0.1)
    // Character animations
    if (!this.anims.exists('left')) {
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('businessMan', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
      })
    }
    if (!this.anims.exists('turn')) {
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'businessMan', frame: 1 }],
        frameRate: 20
      })
    }
    if (!this.anims.exists('right')) {
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('businessMan', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
      })
    }
    this.cursors = this.input.keyboard.createCursorKeys()

    // Init item groups
    this.coins = this.add.group()
    this.invoices = this.add.group()
    this.bullets = this.add.group()

    this.triggerCoinsTimer = this.time.addEvent({
      callback: this.spawnCoins,
      callbackScope: this,
      delay: 1000, // 1000 = 1 second
      loop: true
    })
    this.triggerInvoicesTimer = this.time.addEvent({
      callback: this.spawnInvoices,
      callbackScope: this,
      delay: this.invoiceSpawnDelay, // 1000 = 1 second
      loop: true
    })

    // Collisions & overlaps
    // This code is from:
    // https://phaser.discourse.group/t/pixelperfect-collision-or-hittest-between-object-and-any-coordinate-not-pointer/6377/3
    let localPoint = new Phaser.Math.Vector2()
    this.physics.add.overlap(
      this.businessMan,
      this.coins,
      function overlap(businessMan, coin) {
        this.collectCoins(businessMan, coin)
      },
      function process(businessMan, coin) {
        let { x, y } = coin.body.center
        businessMan.getLocalPoint(x, y, localPoint)
        return (
          this.textures.getPixelAlpha(
            Math.floor(localPoint.x),
            Math.floor(localPoint.y),
            'businessMan'
          ) === 255
        )
      },
      this
    )
    this.physics.add.overlap(
      this.businessMan,
      this.invoices,
      function overlap(businessMan, invoice) {
        this.collectInvoices(businessMan, invoice)
      },
      function process(businessMan, invoice) {
        let { x, y } = invoice.body.center
        businessMan.getLocalPoint(x, y, localPoint)
        return (
          this.textures.getPixelAlpha(
            Math.floor(localPoint.x),
            Math.floor(localPoint.y),
            'businessMan'
          ) === 255
        )
      },
      this
    )
    this.physics.add.collider(this.invoices, this.bullets)

    // Score
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })

    // Turbo
    this.add.text(16, 54, 'Turbo: ', { fontSize: '32px', fill: '#000' })
    this.turboBox = this.add.graphics()
    this.turboBox.fillStyle(0x222222, 0.8)
    this.turboBox.fillRect(140, 58, 100, 25)
  }

  update() {
    // Turbo
    if (this.cursors.space.isDown) {
      if (this.turboChargePoints > 0) {
        this.isTurboCharging = true
        this.turboChargePoints -= 1
        this.turboBox.clear()
        this.turboBox.fillStyle(0x222222, 0.8)
        this.turboBox.fillRect(140, 58, this.turboChargePoints, 25)
      } else {
        this.isTurboCharging = false
      }
    }
    if (!this.cursors.space.isDown) {
      this.isTurboCharging = false
      if (this.turboChargePoints < 100) {
        this.turboChargePoints += 1
        this.turboBox.clear()
        this.turboBox.fillStyle(0x222222, 0.8)
        this.turboBox.fillRect(140, 58, this.turboChargePoints, 25)
      }
    }

    // Bullets
    if (this.cursors.up.isDown) {
      if (this.canFireBullet) {
        const bullet = this.physics.add.sprite(this.businessMan.x, this.businessMan.y, 'bullet')
          .setScale(0.2).setVelocityY(-1000).setBounce(2)
        this.bullets.add(bullet)
        this.canFireBullet = false
      }
    }
    if (this.cursors.up.isUp) {
      this.canFireBullet = true
    }

    // Left, right movements
    if (this.cursors.left.isDown) {
      const velocitySpeed = this.isTurboCharging ? -800 : -400
      this.businessMan.setVelocityX(velocitySpeed)
      this.businessMan.anims.play('left', true)
      this.businessMan.setFlipX(false)
    } else if (this.cursors.right.isDown) {
      const velocitySpeed = this.isTurboCharging ? 800 : 400
      this.businessMan.setVelocityX(velocitySpeed)
      this.businessMan.anims.play('right', true)
      this.businessMan.setFlipX(true)
    }
    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.businessMan.setVelocityX(0)
      this.businessMan.anims.play('turn')
    }

    // Destroy items that have fallen through
    this.coins.children.each(
      (item) => {
        if (item.y > this.cameras.main.height) {
          item.destroy()
        }
      }
    )
    this.invoices.children.each(
      (item) => {
        if (item.y > this.cameras.main.height) {
          item.destroy()
        }
      }
    )
    this.bullets.children.each(
      (item) => {
        if (item.y > this.cameras.main.height) {
          item.destroy()
        }
      }
    )
  }

  spawnCoins() {
    // Coins to collect
    const coin = this.physics.add.sprite(Math.floor(Math.random() * this.cameras.main.width + 1), -40, 'coin')
      .setScale(0.2)
    this.coins.add(coin)
  }

  spawnInvoices() {
    // Invoices to avoid
    const invoice = this.physics.add.sprite(Math.floor(Math.random() * this.cameras.main.width + 1), -40, 'invoice')
      .setScale(0.2)
    this.invoices.add(invoice)
  }

  collectCoins(player, coin) {
    coin.destroy()
    this.points += 1
    this.scoreText.setText('Score: ' + this.points)
    this.sound.play('coinPickUpSound')

    if (this.points % 10 === 0) {
      const divider = (this.points / 10) + 1
      this.invoiceSpawnDelay = this.invoiceSpawnDelay / divider
      this.triggerInvoicesTimer.reset({
        callback: this.spawnInvoices,
        callbackScope: this,
        delay: this.invoiceSpawnDelay, // 1000 = 1 second
        loop: true
      })
    }
  }

  collectInvoices(player, coin) {
    //this.game.pause()
    this.sound.play('gameOverSound')
    this.backgroundMusic.stop()
    this.scene.start('GameOverScene')
  }

  pauseScene() {
    this.scene.pause()
    this.scene.launch('PauseGameScene')
  }
}