import { timeout } from '../tools/async.js';

export const learn = {
    0: async ctx => {
	const {scene, height, width} = ctx;
	
	const text = scene.newText(
	    0.5*width, 0.5*height,
	    [
		'Restore the pattern',
		'by twisting the balls',
		'',
		'You tap or you hold:',
		'those are the controls',
		'',
		'Design your solution',
		'in your unique way',
		'',
		'Success is contingent',
		'on patience and brain',
	    ].join('\n'), {align: 'center'}).setOrigin(0.5).setScale(0.8).setAlpha(0);
	await timeout(200);
	await text.setAlpha(1).tween({
	    x: {from: 3*text.x, to: text.x},
	    duration: 1000,
	    ease: 'Cubic.easeOut',
	});
	const choice = await scene.newMenu(0.5*width, 0.9*height, {
	    '..': 'Back',
	});
	await text.tween({
	    x: 3*text.x,
	    duration: 1000,
	    ease: 'Cubic.easeIn',
	}); text.destroy();
	
	return choice;
    },
};
