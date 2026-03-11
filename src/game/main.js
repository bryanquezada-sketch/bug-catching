import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game, Physics } from 'phaser';
import { UIScene } from './scenes/UIScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig

/*
Resolution 	Style/Feel	                        Scaling to 1080p	Art Workload
160 x 90	Extreme Retro (Pico-8 / GameBoy)	12x (Perfect)	    Very Low
320 x 180	Very Retro (GBA/SNES)               6x (Perfect)	    Low
480 x 270	"HD" Retro	                        4x (Perfect)        Medium
640 x 360	Modern Pixel Art	                3x (Perfect)	    High
960 x 540	High-Detail/Niche	                2x (Perfect)	    Very High
*/

const config = {
    type: AUTO,
    width: 320,
    height: 180,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,   // Sets Nearest Neighbor filtering globally
    roundPixels: true, // Now TRUE by default in 3.90, but explicitly setting it ensures uRoundPixels uniform is used in shaders
    render: {
        antialias: false,        // Essential to disable browser-level smoothing
        pixelArt: true,          // Redundant but safe within the render block
        roundPixels: true,       // Ensures vertex rounding happens in the GPU
        transparent: false,      // Better performance for pixel art unless needed
        clearBeforeRender: true, // Standard for preventing "ghosting" artifacts
        
        // v3.70+ Addition: If your pixel art game doesn't use Post-FX, 
        // disable them to save texture memory in the Pipeline Manager.
        disablePreFX: false, 
        disablePostFX: false 
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        //zoom: 3 // Scales entire game canvas without changing the internal resolution of the game world for efficiency.
    },
    physics: {
        default: 'arcade',
        arcade: {
              // --- WORLD SETTINGS ---
              gravity: { x: 0, y: 300 }, // Global acceleration in px/sec²
              //fps: 60,                   // Simulation frequency (ignored if fixedStep: false)
              fixedStep: true,           // Ensures physics steps are consistent regardless of FPS
              //timeScale: 1,              // 1.0 = normal, 2.0 = half speed, 0.5 = double speed
              //isPaused: false,           // Start with simulation frozen
              
              // --- COLLISION TUNING ---
              //overlapBias: 4,            // Pixels to overlap before separation kicks in
              //tileBias: 16,              // Buffer for tilemap collision checks
              //forceX: false,             // Forces X-axis separation before Y
              
              // --- DEBUG SETTINGS ---
              debug: true,               // Master switch for all debug visuals
              //debugShowBody: true,       // Draw dynamic body outlines
              //debugShowStaticBody: true, // Draw static body outlines (blue by default)
              //debugShowVelocity: true,   // Draw green vectors for movement direction
              
              // --- DEBUG COLORS ---
              //debugBodyColor: 0xff00ff,       // Hex for dynamic bodies (pink)
              //debugStaticBodyColor: 0x0000ff, // Hex for static bodies (blue)
              //debugVelocityColor: 0x00ff00,   // Hex for velocity lines (green)
              
              // --- WORLD BOUNDS ---
              //checkCollision: { 
              //    up: true, 
              //    down: true, 
              //    left: true, 
              //    right: true 
              //}
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        UIScene,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
