import { LevelPuzzle } from '../level.js';

const levelTemplate = settings => async ctx => {
    const {scene} = ctx;
    await new LevelPuzzle().set({scene, ...settings}).run();
    return '..';
};
export const puzzles = {
    0: async ctx => {
	const {scene, height, width} = ctx;
	const choice = await scene.newMenu(0.5*width, 0.5*height, {
	    chapter1: 'Chapter   I',
	    chapter2: 'Chapter  II',
	    chapter3: 'Chapter III',
	    chapter4: 'Chapter IV',
	    chapter5: 'Chapter  V',
	    __space__: '',
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
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
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
    },
    chapter3: {
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
		    [0,0,1,1,1,0,0],
		    [0,0,0,0,1,0,0],
		    [0,0,1,1,1,0,0],
		    [0,0,1,0,0,0,0],
		    [0,0,1,1,1,0,0],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	tuesday: {
	    0: levelTemplate({
		content: [
		    [0,0,0,0,0,0,0],
		    [0,1,1,1,1,1,0],
		    [0,0,0,0,0,1,0],
		    [0,1,1,1,1,1,0],
		    [0,1,0,0,0,0,0],
		    [0,1,1,1,1,1,0],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	wednesday: {
	    0: levelTemplate({
		content: [
		    [0,0,0,0,0,0,0],
		    [1,1,1,1,1,1,1],
		    [0,0,0,0,0,0,1],
		    [1,1,1,1,1,1,1],
		    [1,0,0,0,0,0,0],
		    [1,1,1,1,1,1,1],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	thursday: {
	    0: levelTemplate({
		content: [
		    [0,0,0,0,0,0,0],
		    [1,1,1,0,1,1,1],
		    [0,0,1,0,1,0,0],
		    [1,1,1,0,1,1,1],
		    [1,0,0,0,0,0,1],
		    [1,1,1,0,1,1,1],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	friday: {
	    0: levelTemplate({
		content: [
		    [1,1,1,0,1,1,1],
		    [0,0,1,0,1,0,0],
		    [1,1,1,0,1,1,1],
		    [1,0,0,0,0,0,1],
		    [1,1,1,0,1,1,1],
		    [0,0,1,0,1,0,0],
		    [1,1,1,0,1,1,1],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
    },
    chapter4: {
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
		    [0,0,1,1,1,0,0],
		    [0,0,0,1,0,0,0],
		    [0,0,0,0,0,0,0],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
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
		    [0,1,1,1,1,1,0],
		    [0,0,0,1,0,0,0],
		    [0,0,0,1,0,0,0],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	wednesday: {
	    0: levelTemplate({
		content: [
		    [0,0,0,0,0,0,0],
		    [0,0,0,1,0,0,0],
		    [0,0,1,1,1,0,0],
		    [0,1,1,0,1,1,0],
		    [0,0,1,1,1,0,0],
		    [0,0,0,1,0,0,0],
		    [0,0,0,0,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	thursday: {
	    0: levelTemplate({
		content: [
		    [0,0,0,1,0,0,0],
		    [0,0,0,1,0,0,0],
		    [0,0,1,1,1,0,0],
		    [1,1,1,0,1,1,1],
		    [0,0,1,1,1,0,0],
		    [0,0,0,1,0,0,0],
		    [0,0,0,1,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	friday: {
	    0: levelTemplate({
		content: [
		    [1,0,0,1,0,0,1],
		    [0,1,0,1,0,1,0],
		    [0,0,1,1,1,0,0],
		    [1,1,1,0,1,1,1],
		    [0,0,1,1,1,0,0],
		    [0,1,0,1,0,1,0],
		    [1,0,0,1,0,0,1],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
    },
    chapter5: {
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
		    [0,0,0,1,0,0,0],
		    [0,0,1,0,1,0,0],
		    [0,1,1,0,1,1,0],
		    [1,0,0,1,0,0,1],
		    [0,1,1,0,1,1,0],
		    [0,0,1,0,1,0,0],
		    [0,0,0,1,0,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	tuesday: {
	    0: levelTemplate({
		content: [
		    [1,0,1,0,1,0,1],
		    [0,0,1,0,1,0,0],
		    [1,0,1,0,1,0,1],
		    [0,1,1,1,1,1,0],
		    [1,0,1,0,1,0,1],
		    [0,0,1,0,1,0,0],
		    [1,0,1,0,1,0,1],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	wednesday: {
	    0: levelTemplate({
		content: [
		    [0,0,1,1,1,0,0],
		    [0,1,0,0,0,1,0],
		    [1,0,1,0,1,0,1],
		    [1,0,0,1,0,0,1],
		    [1,0,1,0,1,0,1],
		    [0,1,0,0,0,1,0],
		    [0,0,1,1,1,0,0],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	thursday: {
	    0: levelTemplate({
		content: [
		    [1,0,1,1,1,0,1],
		    [0,1,0,0,0,1,0],
		    [1,0,1,1,1,0,1],
		    [1,0,1,0,1,0,1],
		    [1,0,1,1,1,0,1],
		    [0,1,0,0,0,1,0],
		    [1,0,1,1,1,0,1],
		],
		images: ['gray', 'yellow'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
	friday: {
	    0: levelTemplate({
		content: [
		    [2,0,0,0,0,0,2],
		    [0,2,1,1,1,2,0],
		    [0,1,2,2,2,1,0],
		    [0,1,2,1,2,1,0],
		    [0,1,2,2,2,1,0],
		    [0,2,1,1,1,2,0],
		    [2,0,0,0,0,0,2],
		],
		images: ['gray', 'yellow', 'red'],
		sensor: 'sensor',
		eye: 'eye',
		trofe: 'trofe',
	    }),
	},
    },
};
