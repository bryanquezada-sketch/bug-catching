import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {        
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
        this.net.setAngle(-45).setOrigin(0.5, 1);
        this.net.body.allowGravity = false;
        this.netActive = false;

        this.input.keyboard.on('keydown-SPACE', (e) => {
            this.netSwing();
        });

        this.netZone = this.add.zone(0, 0);
        this.physics.add.existing(this.netZone);
        this.netZone.body.setCircle(8);
        this.netZone.body.setAllowGravity(false);

        this.events.on('postupdate', () => { 
            this.net.x = this.player.x;
            this.net.y = this.player.y;

            const netLength = this.net.displayHeight - 10;

            this.netZone.x = this.net.x - 6;
            this.netZone.y = this.net.y - netLength;

            Phaser.Math.RotateAround(
                this.netZone,
                this.net.x,
                this.net.y,
                this.net.rotation
            );

            this.netZone.body.setOffset(-8, -8); 
        });
        

        // --- END OF CREATE ---
    }

    netSwing()
    {
        if (this.netActive === false) {
            this.netActive = true;
            this.net.setFrame(1);
            
            // Initial swing
            this.tweens.add({
                targets: this.net,
                angle: '+=145',
                duration: 100
            });

            // Return to starting position
            this.time.delayedCall(250, () => {
                this.net.setFrame(0);
                this.tweens.add({
                    targets: this.net,
                    angle: '-=145',
                    duration: 250
                });
            });

            this.time.delayedCall(500, () => {
                this.netActive = false;
            });
        }
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
            } else {
                this.player.setVelocityX(playerSpeed);
            } 
        } else if (leftDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(-playerSpeed)
        } else if (rightDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(playerSpeed);
        } else {
            this.stopBuffer++;
            if (this.stopBuffer > 2) {
                this.player.setVelocityX(0);
                this.lastXKey = 'none';
            }
        }
    }
}
