import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.facing = 1;        
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');
        this.cameras.main.setBackgroundColor(0x141414);

        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
        this.player.setCollideWorldBounds(true);
        Phaser.Display.Bounds.SetBottom(this.player, this.scale.height);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys ({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.stopBuffer = 0;
        this.lastXKey = 'none'
        this.input.keyboard.on('keydown', (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.lastXKey = 'left';
            } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.lastXKey = 'right';
            }
        });

        this.net = this.physics.add.sprite(this.player.x, this.player.y, 'net');
        this.net.setAngle(-45).setOrigin(0.5, 0.9);
        this.net.body.allowGravity = false;
        this.netSwinging = false;
        this.netTween = null;

        this.input.keyboard.on('keydown-SPACE', (e) => {
            this.netSwing();
        });

        this.netZone = this.add.zone(0, 0);
        this.physics.add.existing(this.netZone);
        this.netZone.body.setCircle(8);
        this.netZone.body.setAllowGravity(false);
        this.netZone.body.enable = false;

        // --- END OF CREATE ---
    }

    netSwing()
    {
       if (this.netTween) {
        this.netTween.stop();
       }

       this.netActive = true;

       const startAngle = this.facing === 1 ? -45 : 255;
       const endAngle = this.facing === 1 ? 90 : 90;

       this.net.setAngle(startAngle);
       this.net.setFrame(1);

       this.netZone.body.enable = true;

       this.netTween = this.tweens.add({
        targets: this.net,
        angle: endAngle,
        duration: 180,
        ease: "Cubic.Out",
        onComplete: () => {
            this.netZone.body.enable = false;
            this.resetNet();
        }
       });
    }

    resetNet()
    {
        const idleAngle = this.facing === 1 ? -45 : 225;

        this.net.setFrame(0);

        this.tweens.add({
            targets: this.net,
            angle: idleAngle,
            duration: 120,
            ease: "Cubic.Out",
            onComplete: () => {
                this.netActive = false;
            }
        });
    }

    updateNetZone()
    {
        if (!this.netZone.body.enable) return;

        const length = 48;
        const angle = Phaser.Math.DegToRad(this.net.angle);

        const x = this.net.x + Math.cos(angle) * length;
        const y = this.net.y + Math.sin(angle) * length;

        this.netZone.setPosition(x, y);
    }

    update()
    {   
        const playerSpeed = 160
        const leftDown = this.wasd.left.isDown || this.cursors.left.isDown;
        const rightDown = this.wasd.right.isDown || this.cursors.right.isDown;

        if (leftDown && rightDown) {
            this.stopBuffer = 0;
            if (this.lastXKey === 'left'){
                this.player.setVelocityX(-playerSpeed);
                this.facing = -1;
            } else {
                this.player.setVelocityX(playerSpeed);
                this.facing = 1;
            } 
        } else if (leftDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(-playerSpeed)
            this.facing = -1;
        } else if (rightDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(playerSpeed);
            this.facing = 1;
        } else {
            this.stopBuffer++;
            if (this.stopBuffer > 2) {
                this.player.setVelocityX(0);
                this.lastXKey = 'none';
            }
        }

        const netOffsetX = 12 * this.facing;
        const netOffsetY = -6;

        this.net.setPosition(
            this.player.x + netOffsetX,
            this.player.y + netOffsetY
        );

        this.net.setFlipX(this.facing === -1);

        this.updateNetZone();

        // --- END OF UPDATE ---
    }
}
