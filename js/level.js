import { timeout } from './tools/async.js';

class MakePattern {
    constructor(nrows, ncols) {
	const content = new Array(nrows).fill(null).map(_ => new Array(ncols).fill(0));
	const patterns = {
	    '0': [
		[1, 1, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
	    ],
	    '1': [
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
	    ],
	    '2': [
		[1, 1, 1],
		[0, 0, 1],
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 1],
	    ],
	    '3': [
		[1, 1, 1],
		[0, 0, 1],
		[0, 1, 1],
		[0, 0, 1],
		[1, 1, 1],
	    ],
	    '4': [
		[1, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 1],
		[0, 0, 1],
	    ],
	    '5': [
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 1],
		[1, 1, 1],
	    ],
	    '6': [
		[1, 1, 1],
		[1, 0, 0],
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
	    ],
	    '7': [
		[1, 1, 1],
		[0, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
	    ],
	    '8': [
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
	    ],
	    '9': [
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 1],
		[1, 1, 1],
	    ],
	};
	this.internal = {nrows, ncols, content, patterns};
	this.external = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
    drawCustom(row, col, pattern) {
	const {content} = this.internal;
	const {drawMode = (oldVal, newVal) => newVal} = this.external;
	
	const [prows, pcols] = [pattern.length, pattern[0].length];
	pattern.flatMap(patternRow => patternRow).forEach((newVal, i) => {
	    const [prow, pcol] = [Math.floor(i/pcols), i % pcols];
	    const oldVal = content[row + prow][col + pcol];
	    content[row + prow][col + pcol] = drawMode(oldVal, newVal);
	});
	
	return this;
    }
    draw(row, col, patternKey) {
	const {patterns} = this.internal;
	
	this.drawCustom(row, col, patterns[patternKey]);
	
	return this;
    }
    orient(coordFunc) {
	const {content, nrows, ncols} = this.internal;
	const gridPoints = ({
	    get: () => {
		const points = [];
		for (let row = 0; row < nrows; row++) {
		    for (let col = 0; col < ncols; col++) {
			points.push([row, col]);
		    }
		}
		return points;
	    },
	}).get();
	
	const newGridPoints = gridPoints.map(([row, col]) => coordFunc(row, col));
	const new_nrows = Math.max(...newGridPoints.map(([row, col]) => row)) + 1;
	const new_ncols = Math.max(...newGridPoints.map(([row, col]) => col)) + 1;	
	const newContent = new Array(new_nrows).fill(null).map(_ => new Array(new_ncols).fill(0));
	gridPoints.forEach(([row, col], i) => {
	    const [newRow, newCol] = newGridPoints[i];
	    newContent[newRow][newCol] = content[row][col];
	});

	this.internal.content = newContent;
	
	return this;
    }
    get() {
	const {content} = this.internal;
	return content;
    }
};
// const content = new MakePattern(5, 3)
//       .set({drawMode: (x, y) => Number(x+y > 0)})
//       .draw(0, 0, '7')
//       .orient((row, col) => [col, row])
//       .get();
// console.log(content)

export class LevelClassic {
    constructor(scene) {
	this.external = {scene};
	this.internal = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
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
    // -------------------------------------------------------------------------
    async run() {
	this.precompute();
	await this.makeBoard();
	await this.makeButtons();
	if ('back' === await this.start()) { return await this.cleanup(true); };
	if ('back' === await this.shuffle()) { return await this.cleanup(true); };
	await timeout(500);
	await this.eyeOpen();
	if ('back' === await this.solve()) { return await this.cleanup(true); };
	await timeout(500);
	await this.eyeClose();
	this.remove();
	await timeout(500);
	await this.reward();
	await this.cleanup();
	return this;
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
    async twist(row, col, angle) {
	const {balls, pointsXY, nrows, ncols} = this.internal;
	
	if (({
	    isOnEdge: () => {
		const horizontal = Math.abs(col - Math.floor(ncols/2)) === Math.floor(ncols/2);
		const vertical = Math.abs(row - Math.floor(nrows/2)) === Math.floor(nrows/2);
		return horizontal || vertical;
	    },
	}).isOnEdge()) { return; }

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
	return this;
    }
    async shuffle(num=250, delay=1) {
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
		this.twist(row, col, angle);
	    }
	    resolve('shuffled');
	});
	const p_back = new Promise(resolve => {
	    backButton.on('pointerup', () => { abort = true; resolve('back'); });
	});
	
	const result = await Promise.race([p_shuffle, p_back]);
	
	return result;
    }
    async solve() {
	const {sensors, nrows, ncols, backButton} = this.internal;
	let solved = false;
	
	const p_wins = sensors.map((sensor, i) => new Promise(resolve => {
	    const [row, col] = [Math.floor(i/ncols), i % ncols];
	    sensor.setInteractive();
	    sensor.on('pointerdown', async () => {
		if (solved) { return; }
		const angle = await Promise.race([
		    new Promise(resolve => setTimeout(() => resolve(-2), 200)),
		    new Promise(resolve => sensor.on('pointerup', () => resolve(2))),
		]);
		this.twist(row, col, angle);
		if (this.isSolved()) { solved = true; resolve('solved'); }
	    });
	}));
	const p_back = new Promise(resolve => {
	    backButton.on('pointerup', () => resolve('back'));
	});
	
	const result = await Promise.race([...p_wins, p_back]);
	sensors.forEach(sensor => sensor.disableInteractive());
	return result;
    }
    async remove() {
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
    async start() {
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
    async reward() {
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
	    x: 1.2*width,
	    duration: 1000,
	    ease: 'Quint.easeIn',
	});	

	this.internal = {...this.internal, rewardImage, rewardText, submitText};
	return this;
    }
    async cleanup(animate=false) {
	const targets = [
	    ...this.internal.hints,
	    ...this.internal.balls,
	    ...this.internal.sensors,
	    ...['rewardImage', 'rewardText', 'submitText',
		'startButton', 'backButton', 'eyeButton',]
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
