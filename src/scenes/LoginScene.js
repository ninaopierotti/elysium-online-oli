import Phaser from 'phaser';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    create() {
        const loginScreen = document.getElementById('login-screen');
        const loginBtn = document.getElementById('login-btn');
        const loginInput = document.getElementById('login-name');

        const startGame = () => {
            const name = loginInput.value.trim() || 'Player';
            loginScreen.style.display = 'none';
            this.scene.start('GameScene', { playerName: name });
        };

        loginBtn.addEventListener('click', startGame);
        loginInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startGame();
        });
    }
}