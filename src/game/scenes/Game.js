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

        // --- Input ---
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

        this.facing = 1;     
        
        this.input.keyboard.on('keydown-SPACE', () => this.swingNet());


        // --- Net Visuals ---
        this.net = this.add.sprite(this.player.x, this.player.y, 'net');
        this.net.setOrigin(0.5, 1); // pivot at bottom of net
        this.net.setFrame(0);

        // --- Zone for hit detection ---
        this.netZone = this.add.zone(this.net.x, this.net.y, 16, 16);
        this.physics.add.existing(this.netZone);
        this.netZone.body.setAllowGravity(false);
        this.netZone.body.enable = false;
    }

    swingNet() {
        if (this.netTween) {
            this.netTween.stop();
            this.netTween = null;
        }
    
        this.net.setFrame(1);
        this.netZone.body.enable = true;
    
        let startAngle, endAngle;
    
        const swingArc = 135;
    
        if (this.facing === 1) {
            this.net.flipX = false;
            startAngle = -45;
            endAngle = startAngle + swingArc;
        } else {
            this.net.flipX = true;
            startAngle = -315;
            endAngle = startAngle - swingArc;
        }
    
        this.net.angle = startAngle;
    
        const swing = { t: 0 };
    
        this.netTween = this.tweens.add({
            targets: swing,
            t: 1,
            duration: 500,
            ease: 'Cubic.Out',
    
            onUpdate: () => {
                // Interpolate between start and end angles
                this.net.angle = Phaser.Math.Interpolation.Linear([startAngle, endAngle], swing.t);
    
                // Update zone at net tip
                this.updateNetZone();
            },
    
            onComplete: () => {
                this.netZone.body.enable = false;
                this.net.setFrame(0); // back to idle
            }
        });
    }

    updateNetZone() {
        if (!this.netZone.body.enable) return;

        // --- tip coordinates relative to pivot ---
        const tipX = -8;
        const tipY = -this.net.displayHeight + 10;

        // mirror X if facing left
        const localX = this.facing === 1 ? tipX : -tipX;
        const localY = tipY;

        // rotate by net angle
        const rad = Phaser.Math.DegToRad(this.net.angle);
        const rotatedX = localX * Math.cos(rad) - localY * Math.sin(rad);
        const rotatedY = localX * Math.sin(rad) + localY * Math.cos(rad);

        // set world position
        this.netZone.setPosition(this.net.x + rotatedX, this.net.y + rotatedY);
    }

    update() {
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
        
        this.net.x = this.player.x;
        this.net.y = this.player.y;
    }
}