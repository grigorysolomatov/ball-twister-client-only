import { LevelShariki } from '../level.js';

const levelTemplate = settings => async ctx => {
    const {scene} = ctx;
    await new LevelShariki().set({scene, ...settings}).run();
    return '..';
};
export const shariki = {
    0: async ctx => {
	const {scene, height, width} = ctx;
	const choice = await scene.newMenu(0.5*width, 0.5*height, {
	    classic: 'Classic',	    
	    __space__: '',
	    '..': 'Back',
	});
	return choice;
    },
    classic: {
	0: levelTemplate({
	    content: [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
	    ],
	    images: ['gray', 'yellow', 'red', 'green', 'blue'],
	    sensor: 'sensor',
	    eye: 'eye',
	    trofe: 'trofe',
	}),
    },
};
