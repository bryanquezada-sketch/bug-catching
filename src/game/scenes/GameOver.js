import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(0, 0, 'background').setAlpha(0.5).setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);
        this.add.bitmapText(this.scale.width / 2, this.scale.height / 2, 'globalFont', 'Game Over\n\nClick to Return to Main Menu', 10, 1).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
