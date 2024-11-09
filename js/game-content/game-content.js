import { puzzles } from './puzzles.js';
import { learn } from './learn.js';
import { shariki } from './shariki.js';

export const gameContent = {
    0: async ctx => {
	const {scene} = ctx;
	
	await scene.loadAssets({
	    gray: 'assets/balls/gray.svg',
	    yellow: 'assets/balls/yellow.svg',
	    red: 'assets/balls/red.svg',
	    green: 'assets/balls/green.svg',
	    blue: 'assets/balls/blue.svg',
	    pink: 'assets/balls/pink.svg',
	    
	    sensor: 'assets/misc/sensor.svg',
	    trofe: 'assets/misc/trofe.png',
	    eye: 'assets/misc/eye.svg',
	    undo: 'assets/misc/undo.svg',

	    heart: 'assets/counters/heart.svg',
	    dollar: 'assets/counters/dollar.svg',
	    scul: 'assets/counters/scul.svg',
	    clock: 'assets/counters/clock.svg',
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
