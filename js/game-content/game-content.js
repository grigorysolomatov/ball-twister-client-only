import { puzzles } from './puzzles.js';
import { learn } from './learn.js';
import { shariki } from './shariki.js';

export const gameContent = {
    0: async ctx => {
	const {scene} = ctx;
	
	await scene.loadAssets({
	    gray: 'assets/gray.svg',
	    yellow: 'assets/yellow.svg',
	    red: 'assets/red.svg',
	    green: 'assets/green.svg',
	    blue: 'assets/blue.svg',
	    pink: 'assets/pink.svg',
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
		puzzles: 'Puzzles',
		shariki: 'Shariki',
		learn: 'Learn',
	    });
	    return choice;
	},
	puzzles,
	learn,
	shariki,
    },
};
