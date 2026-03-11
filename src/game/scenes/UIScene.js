import { Scene } from 'phaser';

export class UIScene extends Scene {
    constructor ()
    {
        super ({ key: 'UIScene' });
    }

    create () {
        this.gameScene = this.scene.get('Game');
        this.hpCounter = this.add.bitmapText(0, 0, `globalFont`, 'HP: 3', 16, 0);
        this.hpCounter.setTintFill(0xffffff);


        this.gameScene.events.on('playerLost', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU LOSE!', {
                fontSize: '128px',
                wordWrap: { width: this.scale.width },
                align: 'center'
            }).setOrigin(0.5);
        });

        this.gameScene.events.on('playerWon', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU WIN!\nDISNEY WORLD THAT WAY ->', {
                fontSize: '64px',
                wordWrap: { width: this.scale.width },
                align: 'center'
            }).setOrigin(0.5);
        });
        
    }
}