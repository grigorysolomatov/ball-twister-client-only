//import { timeout } from './tools/async.js';
//import { LevelClassic } from './level.js';
import { chapters } from './game-content/chapters.js';
import { learn } from './game-content/learn.js';

export const gameContent = {
    0: async ctx => {
	const {scene} = ctx;
	
	await scene.loadAssets({
	    red: 'assets/red.svg',
	    gray: 'assets/gray.svg',
	    gold: 'assets/gold.svg',
	    sensor: 'assets/sensor.svg',
	    trofe: 'assets/trofe.png',
	    eye: 'assets/eye.svg',
	    brain: 'assets/brain.png',
	});
	
	const {height, width} = scene.game.config;
	const title = scene.newText(0.5*width, 0.5*height, "Ball Twister").setOrigin(0.5);    
	await title.tween({
	    y: {from: height, to: 0.1*height},
	    alpha: {from: 0, to: 1},
	    duration: 1000,
	    ease: 'Cubic.easeOut',
	});

	Object.assign(ctx, {title, height, width});
	return 'mainMenu';
    },
    mainMenu: {
	0: async ctx => {
	    const {scene, height, width, title} = ctx;
	    
	    const choice = await scene.newMenu(0.5*width, 0.5*height, {
		chapters: 'Chapters',
		learn: 'Learn',
	    });
	    return choice;
	},
	chapters,
	learn,
    },
};
