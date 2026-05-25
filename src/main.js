import Phaser from 'phaser';
import LoginScene from './scenes/LoginScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.NO_CENTER,
    },
    scene: [LoginScene, GameScene],
};

new Phaser.Game(config);