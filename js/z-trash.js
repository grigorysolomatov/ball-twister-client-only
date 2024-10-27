const trash = {
    0: async ctx => {
	const {scene, height, width, title} = ctx;
	const level = await scene.newLevel().set({
	    x: 0.5*width,
	    y: 0.5*height,
	    content: [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,1,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
	    ],
	    images: ['gray', 'red'],
	    sensor: 'sensor',
	}).appear();
	
	const buttonBack = ({
	    buttonBack: () => {
		const buttonBack = scene.newText(0.5*width, 0.9*height, 'Back').setOrigin(0.5);
		buttonBack.tween({
		    alpha: {from: 0, to: 1},
		    y: {from: height, to: buttonBack.y},
		    duration: 500,
		    ease: 'Cubic.easeOut',
		});
		return buttonBack;
	    },
	}).buttonBack();
	const p_back = new Promise(resolve => {
	    buttonBack.setInteractive();
	    buttonBack.on('pointerup', resolve);
	});
	const p_play = new Promise(async resolve => {
	    await ({
		pressStart: async () => {
		    const start = scene.newText(0.5*width, 0.8*height, 'Start').setOrigin(0.5);
		    await start.tween({
			y: {from: height, to: start.y},
			alpha: {from: 0, to: 1},
			duration: 500,
			ease: 'Cubic.easeOut',
		    });
		    await new Promise(resolve => {
			start.setInteractive();
			start.on('pointerup', () => {
			    start.tween({
				alpha: 0,
				duration: 250,
				ease: 'Cubic.easeOut',
				onComplete: () => start.destroy(),
			    });
			    resolve();
			});
		    });
		},
	    }).pressStart();			
	    await level.shuffle(250, 1);
	    await level.solve();
	    buttonBack.tween({
		alpha: 0,
		duration: 500,
		ease: 'Cubic.easeOut',
		onComplete: () => buttonBack.destroy(),
	    });
	    await timeout(1000);
	    level.remove();
	    await timeout(500);
	    const pill = ({
		makePill: () => {
		    const pill = scene
			  .newSprite(0.5*width, 0.5*height, 'pill').setDisplaySize(100, 100);
		    pill.tween({
			scale: {from: 0, to: pill.scale},
			alpha: {from: 0, to: 1},
			duration: 1500,
			ease: 'Cubic.easeOut',
		    });
		    return pill;
		},
	    }).makePill();
	    const winText = ({
		makeWinText: () => {
		    const winText = scene
			  .newText(0.5*width, pill.y - 120, 'Pill Complete!')
			  .setOrigin(0.5);

		    winText.tween({
			alpha: {from: 0, to: 1},
			duration: 1000,
			ease: 'Cubic.easeOut',
		    });
		    return winText;
		},
	    }).makeWinText();
	    await timeout(1500);
	    const submitText = await ({
		submitPill: async () => {
		    const submitText = scene
			  .newText(0.5*width, pill.y + 120, 'Submit')
			  .setOrigin(0.5);

		    await submitText.tween({
			alpha: {from: 0, to: 1},
			y: {from: height, to: submitText.y},
			duration: 1000,
			ease: 'Cubic.easeOut',
		    });
		    await new Promise(resolve => {
			submitText.setInteractive();
			submitText.on('pointerup', resolve);
		    });
		    return submitText;
		},
	    }).submitPill();

	    [winText, submitText, buttonBack].forEach(async entity => {
		await entity.tween({
		    alpha: 0,
		    duration: 500,
		    ease: 'Quint.easeOut',
		});
		entity.destroy();
	    });
	    await pill.tween({
		x: 1.2*width,
		duration: 1000,
		ease: 'Quint.easeIn',
	    });
	    pill.destroy();
	    resolve();
	});

	await Promise.race([p_back, p_play]);
	scene.children.list.forEach(async child => {
	    if (child === title) { return; }
	    await child.tween({
		alpha: 0,
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	    await timeout(5000); // Hack?
	    child.destroy();
	});
	
	return '..';
    },
};
const levelTemplateOld = settings => async ctx => {
    const {scene, height, width, title} = ctx;
    const level = await scene.newLevel().set({x: 0.5*width, y: 0.5*height, ...settings}).appear();
    
    const buttonBack = ({
	buttonBack: () => {
	    const buttonBack = scene.newText(0.5*width, 0.9*height, 'Back').setOrigin(0.5);
	    buttonBack.tween({
		alpha: {from: 0, to: 1},
		y: {from: height, to: buttonBack.y},
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	    return buttonBack;
	},
    }).buttonBack();
    const p_back = new Promise(resolve => {
	buttonBack.setInteractive();
	buttonBack.on('pointerup', resolve);
    });
    const p_play = new Promise(async resolve => {
	await ({
	    pressStart: async () => {
		const start = scene.newText(0.5*width, 0.8*height, 'Start').setOrigin(0.5);
		await start.tween({
		    y: {from: height, to: start.y},
		    alpha: {from: 0, to: 1},
		    duration: 500,
		    ease: 'Cubic.easeOut',
		});
		await new Promise(resolve => {
		    start.setInteractive();
		    start.on('pointerup', () => {
			start.tween({
			    alpha: 0,
			    duration: 250,
			    ease: 'Cubic.easeOut',
			    onComplete: () => start.destroy(),
			});
			resolve();
		    });
		});
	    },
	}).pressStart();
	await level.shuffle(250, 1);

	const eye = scene.newSprite(0.5*width, 0.8*height, 'eye').setDisplaySize(80, 40);
	eye.tween({
	    alpha: {from: 0, to: 1},
	    scaleY: {from: 0, to: eye.scaleY},
	    duration: 1000,
	    ease: 'Cubic.easeOut',
	});
	eye.setInteractive();
	eye.on('pointerover', () => {
	    eye.setTint(0xffff44);
	    level.showCorrects(1);
	});
	eye.on('pointerout', () => {
	    eye.setTint(0xffffff);
	    level.showCorrects(0);
	});
	
	await level.solve();
	
	eye.disableInteractive();
	eye.tween({
	    alpha: 0,
	    scaleY: 0,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	
	buttonBack.tween({
	    alpha: 0,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	    onComplete: () => buttonBack.destroy(),
	});
	await timeout(500);
	level.remove();
	await timeout(500);
	const pill = ({
	    makePill: () => {
		const pill = scene
		      .newSprite(0.5*width, 0.5*height, 'pill').setDisplaySize(100, 100);
		pill.tween({
		    scale: {from: 0, to: pill.scale},
		    alpha: {from: 0, to: 1},
		    duration: 1500,
		    ease: 'Cubic.easeOut',
		});
		return pill;
	    },
	}).makePill();
	const winText = ({
	    makeWinText: () => {
		const winText = scene
		      .newText(0.5*width, pill.y - 120, 'Pill Complete!')
		      .setOrigin(0.5);

		winText.tween({
		    alpha: {from: 0, to: 1},
		    duration: 1000,
		    ease: 'Cubic.easeOut',
		});
		return winText;
	    },
	}).makeWinText();
	await timeout(1500);
	const submitText = await ({
	    submitPill: async () => {
		const submitText = scene
		      .newText(0.5*width, pill.y + 120, 'Submit')
		      .setOrigin(0.5);

		await submitText.tween({
		    alpha: {from: 0, to: 1},
		    y: {from: height, to: submitText.y},
		    duration: 1000,
		    ease: 'Cubic.easeOut',
		});
		await new Promise(resolve => {
		    submitText.setInteractive();
		    submitText.on('pointerup', resolve);
		});
		return submitText;
	    },
	}).submitPill();

	[winText, submitText, buttonBack].forEach(async entity => {
	    await entity.tween({
		alpha: 0,
		duration: 500,
		ease: 'Quint.easeOut',
	    });
	    entity.destroy();
	});
	await pill.tween({
	    x: 1.2*width,
	    duration: 1000,
	    ease: 'Quint.easeIn',
	});
	pill.destroy();
	resolve();
    });

    await Promise.race([p_back, p_play]);
    scene.children.list.forEach(async child => {
	if (child === title) { return; }
	await child.tween({
	    alpha: 0,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	await timeout(5000); // Hack?
	child.destroy();
    });
    
    return '..';
};
