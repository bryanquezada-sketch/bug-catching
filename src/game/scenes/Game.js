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
    }

    update()
    {
        //#region Top-Down Controller with Sprint and cancel-logic for opposing arrow keys pressed. Remember to turn off gravity.
        /*
        const playerSpeed = 160;

        let x = 0;
        let y = 0

        if (this.cursors.up.isDown || this.wasd.up.isDown ) {
            y -= playerSpeed;
        }
        if (this.cursors.down.isDown || this.wasd.down.isDown ) {
            y += playerSpeed;
        }
        if (this.cursors.left.isDown || this.wasd.left.isDown ) {
            x -= playerSpeed;
        }
        if (this.cursors.right.isDown || this.wasd.right.isDown ) {
            x += playerSpeed;
        }

        this.player.setVelocity(x, y);

        if (x !== 0 || y !== 0) {
            this.player.body.velocity.normalize().scale(playerSpeed);
            if (this.cursors.shift.isDown) {
                this.player.body.velocity.normalize().scale(playerSpeed * 1.5);
            }
        }
        */
        //#endregion

        //#region Precise Movement 2D Controller with Last Button Pressed logic and Buffer for anti-fat-fingering. Only left and right directions and No Jump(Add that later Bryan)
        /*

        // --- vvv IMPORTANT, ADD THIS TO CREATE vvv ---
        this.stopBuffer = 0;
        this.lastXKey = 'none'
        this.input.keyboard.on('keydown', (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.lastXKey = 'left';
            } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.lastXKey = 'right';
            }
        });
        // --- ^^^ IMPORTANT, ADD THIS TO CREATE ^^^ ---

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
        */
        //#endregion
    }
}
