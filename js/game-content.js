import { timeout } from './async.js';
import { LevelClassic } from './level.js';

const levelTemplate = settings => async ctx => {
    const {scene} = ctx;
    const level = new LevelClassic(scene).set(settings);
    await level.run();
    return '..';
};
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
		play: 'Play',
		learn: 'Learn',
	    });
	    return choice;
	},
	play: {
	    0: async ctx => {
		const {scene, height, width} = ctx;
		const choice = await scene.newMenu(0.5*width, 0.5*height, {
		    chapter1: 'Chapter 1',
		    chapter2: 'Chapter 2',
		    '..': 'Back',
		});
		return choice;
	    },
	    chapter1: {
		0: async ctx => {
		    const {scene, height, width} = ctx;
		    const choice = await scene.newMenu(0.5*width, 0.5*height, {
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			__space__: '',
			'..': 'Back',
		    });
		    return choice;
		},
		monday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		tuesday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		wednesday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			    [0,0,0,1,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		thursday: {
		    0: levelTemplate({
			content: [
			    [0,0,1,0,1,0,0],
			    [0,0,1,0,1,0,0],
			    [0,0,1,0,1,0,0],
			    [0,0,1,0,1,0,0],
			    [0,0,1,0,1,0,0],
			    [0,0,1,0,1,0,0],
			    [0,0,1,0,1,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		friday: {
		    0: levelTemplate({
			content: [
			    [0,1,0,1,0,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,0,1,0,1,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
	    },
	    chapter2: {
		0: async ctx => {
		    const {scene, height, width} = ctx;
		    const choice = await scene.newMenu(0.5*width, 0.5*height, {
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			__space__: '',
			'..': 'Back',
		    });
		    return choice;
		},
		monday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			    [0,0,1,1,1,0,0],
			    [0,0,1,0,1,0,0],
			    [0,0,1,1,1,0,0],
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		tuesday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			    [0,1,1,1,1,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,1,1,1,1,0],
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		wednesday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			    [1,1,1,1,1,1,1],
			    [1,0,1,0,1,0,1],
			    [1,1,1,1,1,1,1],
			    [0,0,0,0,0,0,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		thursday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,1,1,1,1,1,0],
			    [0,1,0,0,0,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,0,0,0,1,0],
			    [0,1,1,1,1,1,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
		friday: {
		    0: levelTemplate({
			content: [
			    [0,0,0,0,0,0,0],
			    [0,1,1,1,1,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,1,1,1,1,0],
			    [0,1,0,1,0,1,0],
			    [0,1,1,1,1,1,0],
			    [0,0,0,0,0,0,0],
			],
			images: ['gray', 'gold'],
			sensor: 'sensor',
			eye: 'eye',
			trofe: 'trofe',
		    }),
		},
	    },
	},
	learn: {
	    0: async ctx => {
		const {scene, height, width} = ctx;
		const choice = await scene.newMenu(0.5*width, 0.5*height, {
		    '..': 'Back',
		});
		return choice;
	    },
	},
    },
};
