import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // --- Camera and UI ---
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.setBackgroundColor(0x141414);
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');

        // --- Player ---
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

        // === UNDER CONSTRUCTION ===

        this.netContainer = this.add.container(this.player.x, this.player.y);
        this.net = this.add.sprite(0, 0, 'net');
        this.net.setOrigin(0.5, 1);
        this.net.setAngle(-45);
        this.netContainer.add(this.net);

        this.netZone = this.add.zone(-8, -this.net.displayHeight + 10, 16, 16);
        this.physics.add.existing(this.netZone);
        this.netZone.body.setAllowGravity(false);
        this.netZone.body.enable = false;
        this.netContainer.add(this.netZone);

        // --- END OF UPDATE ---
    }

    swingNet() {
        this.netIsActive = true;
        this.netZone.body.enable = true;
        this.net.setFrame(1);
        this.netContainer.scaleX = this.facing;
        this.tweens.killTweensOf(this.net);
        this.net.setAngle(-45);
    
        let startAngle = -45;
        let endAngle = 90;
        const netLength = this.net.displayHeight - 9;
        
        this.net.angle = startAngle;
    
        this.netTween = this.tweens.add({
            targets: this.net,
            angle: endAngle,
            duration: 1000, 
            ease: 'Cubic.Out',
            onUpdate: () => {
                const rad = Phaser.Math.DegToRad(this.net.angle - 90);
    
                this.netZone.x = Math.cos(rad) * netLength;
                this.netZone.y = Math.sin(rad) * netLength;
                
                this.netZone.body.updateFromGameObject();
            },
            onComplete: () => {
                this.net.angle = startAngle;
                this.net.setFrame(0);
                this.netZone.body.enable = false;
                this.netIsActive = false;
                this.netZone.setPosition(-8, -this.net.displayHeight + 10);
            }
        });
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
        
        this.netContainer.setPosition(this.player.x, this.player.y);

        if (!this.netIsActive) {
            this.netContainer.scaleX = this.facing;
        }
    }
}