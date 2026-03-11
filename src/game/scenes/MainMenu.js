import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

        const phaserLogo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo').setOrigin(0.5).setScale(0.5);

        const madeWith = this.add.bitmapText(this.scale.width / 2, this.scale.height / 2 - 40, 'globalFont', 'M A D E  W I T H', 8).setOrigin(0.5);
        madeWith.setTintFill(0xffffff);
        const startClick = this.add.bitmapText(this.scale.width / 2, this.scale.height / 2 + 45, 'globalFont', 'Click to Start', 14).setOrigin(0.5);

        this.add.bitmapText(400, 300, 'globalFont', 'SCORE: 100', 16, 0);

        this.tweens.add({
            targets: startClick,
            alpha: 0,
            duration: 1,
            yoyo: true,
            hold: 500,
            repeat: -1,
            repeatDelay: 1500,
            ease: 'Stepped',
            easeParams: [1]
        })

        
        this.input.once('pointerdown', () => {

            this.cameras.main.fadeOut(750, 0, 0, 0);

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('Game');
            })

        });
    }
}
