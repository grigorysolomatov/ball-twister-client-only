import { timeout } from './tools/async.js';
import { StateMachine } from './tools/state.js';
import { PatternMaker } from './pattern-maker.js';

//const content = new PatternMaker(5, 3)
//      .draw(0, 0, [[1], [2], [3]])
//      .symmetrize((row, col) => [row, 2-col])
//      .get();
//console.log(content)

class LevelBase {
    constructor() {
	this.external = {};
	this.internal = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
    // -------------------------------------------------------------------------
    precompute() {
	const {scene, content} = this.external;
	
	const [nrows, ncols] = [content.length, content[0].length];
	const {height, width} = scene.game.config;
	const [x, y] = [0.5*width, 0.5*height];
	const step = 0.9*width/ncols;

	const pointsRowCol = ({
	    get: () => {
		const pts = [];
		for (let row = 0; row < nrows; row++) {
		    for (let col = 0; col < ncols; col++) {
			pts.push([row, col]);
		    }
		}
		return pts;
	    },
	}).get();
	const pointsXY = pointsRowCol.map(([row, col]) => {
	    return [
		x + step*(col - 0.5*(ncols-1)),
		y + step*(row - 0.5*(nrows-1)),
	    ];
	});

	this.internal = {
	    ...this.internal,
	    x, y, nrows, ncols, height, width, step, pointsRowCol, pointsXY,
	};
	return this;
    }
    isSolved() {
	const {content} = this.external;
	const {balls} = this.internal;
	const flatContent = content.flatMap(row => row);
	const match = flatContent
	      .map((_, i) => i)
	      .reduce((acc, i) => acc && (flatContent[i] === balls[i].ballContent), true);
	return match;
    }    
    makeSpriteGrid(imageFunc) {
	const {scene} = this.external;
	const {pointsRowCol, pointsXY, ncols} = this.internal;
	const sprites = pointsRowCol.map(([row, col]) => {
	    const idx = col + ncols*row;
	    const sprite = scene.newSprite(...pointsXY[idx], imageFunc(row, col));
	    return sprite;
	});
	return sprites;
    }
    activateSensors(yes) {
	const {sensors} = this.internal;
	if (yes) { sensors.forEach(sensor => sensor.setInteractive()); }
	if (!yes) { sensors.forEach(sensor => sensor.disableInteractive()); }
	return this;
    }
    // -------------------------------------------------------------------------
    showHints(t) {
	const {balls, hints} = this.internal;
	hints.forEach(correct => {
	    correct.tween({
		alpha: t,
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	});
	balls.forEach(ball => {
	    ball.tween({
		scale: (1-t)*ball.baseScale + t*0.5*ball.baseScale,
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	});
	return this;
    }
    twistBoard(row, col, angle) {
	const {balls, pointsXY, nrows, ncols} = this.internal;
	
	if (({
	    isOnEdge: () => {
		const horizontal = Math.abs(col - Math.floor(ncols/2)) === Math.floor(ncols/2);
		const vertical = Math.abs(row - Math.floor(nrows/2)) === Math.floor(nrows/2);
		return horizontal || vertical;
	    },
	}).isOnEdge()) { return false; }

	const cyclePoints = ({
	    getOffsets: () => {
		return [
		    [-1, -1],
		    [-1, 0],
		    [-1, 1],
		    [0, 1],
		    [1, 1],
		    [1, 0],
		    [1, -1],
		    [0, -1],
		];
	    },
	}).getOffsets().map(([r, c]) => [row + r, col + c]);
	const tempBalls = [...balls];
	const startIdxs = cyclePoints.map(([row, col]) => col + row*ncols);
	const endIdxs = cyclePoints.map((_, i) => startIdxs[(i + angle + startIdxs.length) % startIdxs.length]);
	
	startIdxs.map((_, i) => {
	    balls[endIdxs[i]] = tempBalls[startIdxs[i]];
	    tempBalls[startIdxs[i]].tween({
		x: pointsXY[endIdxs[i]][0],
		y: pointsXY[endIdxs[i]][1],
		duration: 600,
		ease: 'Quint.easeOut',
	    });
	});	
	return true;
    }
    // -------------------------------------------------------------------------
    replaceBall(row, col, k) {
	const {scene, images} = this.external;
	const {balls, nrows, ncols} = this.internal;
	
	const i = ncols*row + col;
	const oldBall = balls[i];
	const newBall = scene.newSprite(oldBall.x, oldBall.y, images[k]).setScale(oldBall.scale);
	newBall.baseScale = oldBall.baseScale;
	newBall.ballContent = k;
	balls[i] = newBall;
	
	oldBall.tween({
	    alpha: 0,
	    scale: 1.5*oldBall.scale,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	    onComplete: () => oldBall.destroy(),
	});
	newBall.tween({
	    alpha: {from: 0, to: 1},
	    scale: {from: 0, to: newBall.scale},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	
	return this;
    }
    spawnRandomBall() { // DELETE?
	const {images} = this.external;
	const {balls, nrows, ncols, pointsRowCol} = this.internal;

	const emptySpots = pointsRowCol.filter(([row, col]) => balls[row*ncols + col].ballContent === 0);
	const [row, col] = emptySpots[Math.floor(Math.random()*emptySpots.length)];
	const value = Math.floor(Math.random()*(images.length-1)) + 1;

	this.replaceBall(row, col, value);
	
	return this;
    }
    seedBall(row, col, k) {
	const {scene, images} = this.external;
	const {balls, nrows, ncols} = this.internal;

	const targetBall = balls[row*ncols + col];
	const seedBall = scene.newSprite(targetBall.x, targetBall.y, images[k]).setScale(0.5*targetBall.scale);
	seedBall.tween({
	    alpha: {from: 0, to: 1},
	    scale: {from: 0, to: seedBall.scale},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	
	const follow = () => { seedBall.x = targetBall.x; seedBall.y = targetBall.y;}
	targetBall.seed = seedBall;
	seedBall.grow = () => {
	    scene.events.off('update', follow);
	    seedBall.baseScale = targetBall.baseScale;
	    seedBall.ballContent = k;
	    targetBall.tween({
		alpha: 0,
		scale: 1.4*targetBall.scale,
		duration: 500,
		ease: 'Cubic.easeOut',
		onComplete: () => targetBall.destroy(),
	    });
	    seedBall.tween({
		// alpha: {from: 0, to: 1},
		scale: seedBall.baseScale,
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	}	
	scene.events.on('update', follow);
	
	return this;
    }
    seedRandomBall() {
	const {images} = this.external;
	const {balls, nrows, ncols, pointsRowCol} = this.internal;

	const canSeed = ball => (ball.ballContent === 0) && !ball.seed;
	const emptySpots = pointsRowCol.filter(([row, col]) => canSeed(balls[row*ncols + col]));
	const [row, col] = emptySpots[Math.floor(Math.random()*emptySpots.length)];
	const value = Math.floor(Math.random()*(images.length-1)) + 1;

	this.seedBall(row, col, value);
	
	return this;
    }
    growAllSeeds() {
	const {balls} = this.internal;
	balls.map((_, i) => i).forEach(i => {
	    const ball = balls[i];
	    const seed = ball.seed;
	    if (!seed) { return; }
	    balls[i] = seed;
	    seed.grow();
	});
    }
    getKillableBalls() {
	const {balls, nrows, ncols, pointsRowCol} = this.internal;	
	const toKill = [];
	const getBall = (r, c) => balls[r*ncols + c];
	pointsRowCol.forEach(([row, col]) => {   	    
	    const targetBall = getBall(row, col);
	    if (targetBall.ballContent === 0) { return; }
	    
	    const horizontal = [1, 2]
		  .map(t => getBall(row, col + t)?.ballContent)
		  .every(ballContent => ballContent === targetBall.ballContent)
	    const vertical = [1, 2]
		  .map(t => getBall(row + t, col)?.ballContent)
		  .every(ballContent => ballContent === targetBall.ballContent)
	    
	    if (horizontal) { toKill.push([row, col], [row, col+1], [row, col+2])}
	    if (vertical) { toKill.push([row, col], [row+1, col], [row+2, col])}
	});
	const uniqueToKill = [...new Set(toKill.map(([row, col]) => `${row} ${col}`))]
	      .map(s => s.split(' ').map(x => Number(x)));
	return uniqueToKill;
	//uniqueToKill.forEach(([row, col]) => {
	//    this.replaceBall(row, col, 0);
	//});
	//return this;
    }
    // -------------------------------------------------------------------------    
    async makeBoard() {
	const {scene, content, images, sensor: imageSensor} = this.external;
	const {x, y, step, ncols} = this.internal;
	
	const hints = this.makeSpriteGrid((row, col) => images[content[row][col]]);
	hints.forEach(hint => hint.setDisplaySize(0.9*step, 0.9*step).setAlpha(0));
	
	const balls = this.makeSpriteGrid((row, col) => images[content[row][col]]);
	const p_animate = balls.map(async (ball, i) => {
	    const [row, col] = [Math.floor(i/ncols), i % ncols];
	    ball.setDisplaySize(0.7*step, 0.7*step).setAlpha(0);
	    ball.baseScale = ball.scale;
	    ball.ballContent = content[row][col];
	    await timeout(Math.random()*1000);
	    await ball.tween({
		scale: {from: 0, to: ball.scale},
		x: {from: x, to: ball.x},
		y: {from: y, to: ball.y},
		alpha: 1,
		duration: 1000,
		ease: 'Cubic.easeOut',
	    });
	});
	await Promise.all(p_animate);

	const sensors = this.makeSpriteGrid((row, col) => imageSensor);
	sensors.forEach(sensor => sensor.setDisplaySize(step, step).setAlpha(1e-99));

	this.internal = {...this.internal, hints, balls, sensors};
	
	return this;
    }
    async removeBoard() {
	const {x, y, balls, sensors} = this.internal;
	
	sensors.forEach(sensor => sensor.destroy());	
	await Promise.all(balls.map(async ball => {
	    await timeout(Math.random()*500);
	    await ball.tween({
		x, y,
		scale: 0,
		alpha: 0,
		duration: 1000,
		ease: 'Cubic.easeInOut',
	    });
	}));
	balls.forEach(ball => ball.destroy());
	return this;
    }        
    async shuffleBoard(num=250, delay=1) {
	const {nrows, ncols, backButton} = this.internal;
	const shuffleSeq = ({
	    getSingle: () => {
		const row = Math.floor(Math.random()*(nrows-2) + 1);
		const col = Math.floor(Math.random()*(ncols-2) + 1);
		const angle = Math.sign(Math.random()-0.5)*2;
		return [row, col, angle];
	    },
	    get: function(num) {
		return new Array(num).fill(null).map(_ => this.getSingle());
	    },
	}).get(num);
	let abort = false;

	const p_shuffle = new Promise(async resolve => {
	    for (const [row, col, angle] of shuffleSeq) {
		if (abort) { break; }
		if (delay > 0) { await timeout(delay); }
		this.twistBoard(row, col, angle);
	    }
	    resolve('shuffled');
	});
	const p_back = new Promise(resolve => {
	    backButton.on('pointerup', () => { abort = true; resolve('back'); });
	});
	
	const result = await Promise.race([p_shuffle, p_back]);
	
	return result;
    }
    async playerTurn() {
	const {sensors, nrows, ncols, backButton} = this.internal;
	
	const p_twist = sensors.map((sensor, i) => new Promise(resolve => {
	    const [row, col] = [Math.floor(i/ncols), i % ncols];
	    sensor.removeAllListeners().once('pointerdown', async () => {
		const angle = await Promise.race([
		    new Promise(resolve => setTimeout(() => resolve(-2), 200)),
		    new Promise(resolve => sensor.on('pointerup', () => resolve(2))),
		]);
		this.twistBoard(row, col, angle);
		resolve('twist');
	    });
	}));
	const p_back = new Promise(resolve => {
	    backButton.once('pointerup', () => resolve('back'));
	});

	const result = await Promise.race([...p_twist, p_back]);
	return result;
    }
    async makeButtons() {
	const {scene, eye: eyeImage} = this.external;
	const {balls, height, width} = this.internal;

	const menuStep = 50;	
	const backXY = [0.5*width, 0.9*height];
	const startXY = [
	    0.5*width,
	    Math.min(
		balls[balls.length-1].y + 1.5*menuStep,
		0.5*(balls[balls.length-1].y + backXY[1]),
	    ),
	]; // const startXY = [0.5*width, balls[balls.length-1].y + 1.5*menuStep];
	
	const startButton = scene.newText(...startXY, 'Start').setOrigin(0.5);
	startButton.tween({
	    y: {from: height, to: startButton.y},
	    alpha: {from: 0, to: 1},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});

	await timeout(200);
	
	const backButton = scene.newText(...backXY, 'Back').setOrigin(0.5);
	backButton.tween({
	    y: {from: height, to: backButton.y},
	    alpha: {from: 0, to: 1},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});	
	
	const eyeButton = scene.newSprite(...startXY, eyeImage).setDisplaySize(80, 40).setAlpha(0);		

	this.internal = {...this.internal, startButton, backButton, eyeButton};
	
	return this;
    }
    async playerStart() {
	const {startButton, backButton} = this.internal;

	const p_back = new Promise(resolve => backButton.setInteractive()
				   .on('pointerup', () => resolve('back')));
	const p_start = new Promise(resolve => startButton.setInteractive()
				    .on('pointerup', () => resolve('start')));
	const choice = await Promise.race([p_back, p_start]);
	
	startButton.disableInteractive().tween({
	    alpha: 0,
	    duration: 250,	    
	});
	
	return choice;
    }
    async eyeOpen() {
	const {eyeButton} = this.internal;
	await eyeButton.setAlpha(1).setInteractive().tween({
	    scaleY: {from: 0, to: eyeButton.scale},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	eyeButton.on('pointerover', () => this.showHints(1));
	eyeButton.on('pointerout', () => this.showHints(0));
	return this;
    }
    async eyeClose() {
	const {eyeButton, backButton} = this.internal;
	backButton.tween({
	    alpha: 0,
	    duration: 250,
	    ease: 'Cubic.easeOut',
	});
	await eyeButton.disableInteractive().tween({
	    scaleY: 0,
	    alpha: 0,
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	
	return this;
    }
    async showReward() {
	const {scene, trofe} = this.external;
	const {x, y, height, width} = this.internal;
	
	const rewardImage = scene.newSprite(x, y, trofe).setDisplaySize(150, 150);
	rewardImage.tween({
	    scale: {from: 0, to: rewardImage.scale},
	    alpha: {from: 0, to: 1},
	    duration: 1500,
	    ease: 'Cubic.easeOut',
	});
	
	const rewardText = scene
	      .newText(rewardImage.x, rewardImage.y - 120, 'Success')
	      .setOrigin(0.5);
	await rewardText.tween({
	    alpha: {from: 0, to: 1},
	    duration: 1000,
	    ease: 'Cubic.easeOut',
	});

	const submitText = scene
	      .newText(rewardImage.x, rewardImage.y + 120, 'Continue')
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

	[rewardText, submitText, submitText].forEach(element => {
	    element.tween({
		alpha: 0,
		duration: 500,
		ease: 'Cubic.easeOut',
	    });
	});	
	await rewardImage.tween({
	    x: width + 0.5*rewardImage.width,
	    duration: 1000,
	    ease: 'Quint.easeIn',
	});	

	this.internal = {...this.internal, rewardImage, rewardText, submitText};
	return this;
    }
    async cleanup(animate=true) {
	const targets = [
	    ...this.internal.hints,
	    ...this.internal.balls,
	    ...this.internal.balls.filter(ball => ball.seed).map(ball => ball.seed),
	    ...this.internal.sensors,
	    ...['rewardImage', 'rewardText', 'submitText',
		'startButton', 'backButton', 'eyeButton',
		'infoText']
		.map(key => this.internal[key]),
	];
	if (animate) {
	    const p_fadeout = targets.map(async target => {
		if (!target?.active) { return; }
		await target.tween({
		    alpha: 0,
		    duration: 500,
		    ease: 'Cubic.easeOut',
		});
	    });
	    await Promise.all(p_fadeout);
	}
	targets.forEach(target => target?.destroy());
	return this;
    }
}
export class LevelPuzzle {
    constructor() {
	this.external = {};
	this.internal = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
    async run() {
	const settings = this.external;	
	const base = new LevelBase().set(settings);
	const states = {
	    's_init': async () => {
		base.precompute();
		await base.makeBoard();
		await base.makeButtons();
		return 's_start';
	    },
	    's_start': async () => {
		const result = await base.playerStart();
		return {'start': 's_shuffle', 'back': 's_cleanup', }[result];
	    },
	    's_shuffle': async () => {
		const result = await base.shuffleBoard();
		return {'shuffled': 's_eyeOpen', 'back': 's_cleanup'}[result];
	    },
	    's_eyeOpen': async () => {
		await timeout(500);
		base.activateSensors(true);
		await base.eyeOpen();
		return 's_twist';
	    },
	    's_twist': async () => {
		const result = await base.playerTurn();
		return {'twist': 's_checkWin', 'back': 's_cleanup'}[result];
	    },
	    's_checkWin': async () => {
		if (base.isSolved()) { return 's_eyeClose'; }
		return 's_twist';
	    },
	    's_eyeClose': async () => {
		await timeout(500);
		await base.eyeClose();
		return 's_reward';
	    },
	    's_reward': async() => {
		base.removeBoard();
		await timeout(500);
		await base.showReward();
		return 's_fastCleanup';
	    },
	    's_cleanup': async () => {
		await base.cleanup();
		return;
	    },
	    's_fastCleanup': () => {
		base.cleanup();
		return;
	    },
	    's_end': async () => {
		console.log('END STATE')
		await timeout(500);
		await new Promise(resolve => {});
	    },
	};
	await new StateMachine().set({states, start: 's_init'}).run();
    }
}
export class LevelShariki {
    constructor() {
	this.external = {};
	this.internal = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
    async run() {
	const settings = this.external;	
	const base = new LevelBase().set(settings);
	let spawnCounter = 0;
	const states = {
	    's_init': async () => {
		base.precompute();
		await base.makeBoard();
		await base.makeButtons();
		return 's_start';
	    },
	    's_start': async () => {
		const result = await base.playerStart();
		return {'start': 's_eyeOpen', 'back': 's_cleanup', }[result];
	    },
	    's_shuffle': async () => {
		const result = await base.shuffleBoard();
		return {'shuffled': 's_eyeOpen', 'back': 's_cleanup'}[result];
	    },
	    's_eyeOpen': async () => {
		await timeout(500);
		base.activateSensors(true);
		await base.eyeOpen();
		return 's_spawn';
	    },
	    's_spawn': async () => {		
		if (spawnCounter === 0) {
		    spawnCounter = 3;
		    await timeout(600);
		    base.growAllSeeds();
		    try {
			new Array(5).fill(null).map(_ => base.seedRandomBall());
		    } catch {
			return 's_cleanup';
		    }
		} spawnCounter -= 1;
		const killables = base.getKillableBalls();
		if (killables.length > 0) {
		    await timeout(600);
		    killables.forEach(([row, col]) => base.replaceBall(row, col, 0));
		}
		return 's_twist';
	    },
	    's_twist': async () => {
		const result = await base.playerTurn();		
		return {'twist': 's_spawn', 'back': 's_cleanup'}[result];
	    },
	    's_eyeClose': async () => {
		await timeout(500);
		await base.eyeClose();
		return 's_reward';
	    },
	    's_reward': async() => {
		base.removeBoard();
		await timeout(500);
		await base.showReward();
		return 's_fastCleanup';
	    },
	    's_cleanup': async () => {
		await base.cleanup();
		return;
	    },
	    's_fastCleanup': () => {
		base.cleanup();
		return;
	    },
	    's_end': async () => {
		console.log('END STATE')
		await timeout(500);
		await new Promise(resolve => {});
	    },
	};
	await new StateMachine().set({states, start: 's_init'}).run();
    }
}
