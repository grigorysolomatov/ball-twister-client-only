import { timeout } from './tools/async.js';

export class Counter {
    constructor() {
	this.external = {};
	this.internal = {};
    }
    set(dict) {
	this.external = {...this.external, ...dict};
	return this;
    }
    getValue() {
	const {value} = this.internal;
	return value;
    }
    // -------------------------------------------------------------------------
    async create() {
	const {scene, image, value, x, y, size} = this.external;
	const icon = scene.newSprite(x, y, image).setDisplaySize(size, size).setTint();
	const text = scene.newText(x, y-size, value).setScale(0.8).setOrigin(0.5).setAlpha(0);	
	text.baseScale = text.scale;
	
	await icon.tween({
	    scale: {from: 0, to: icon.scale},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	await text.tween({
	    alpha: {from: 0, to: 1},
	    duration: 500,
	    ease: 'Cubic.easeOut',
	});
	Object.assign(this.internal, {icon, text, value});
	return this;
    }
    async add(delta) {
	const {scene, size} = this.external;
	const {icon, text, value} = this.internal;

	const deltaString = (delta > 0)? `+${Math.abs(delta)}` : `-${Math.abs(delta)}`;
	const deltaText = scene.newText(text.x, text.y-size, deltaString)
	      .setScale(text.baseScale).setOrigin(0.5).setTint(0xffff00);

	const newValue = value + delta; Object.assign(this.internal, {value: newValue});

	await timeout(200);
	text.setText(newValue);
	
	text.tween({
	    scale: {from: 1.5*text.scale, to: text.baseScale},
	    duration: 1000,
	    ease: 'Cubic.easeOut',
	});	
	deltaText.tween({
	    alpha: 0,
	    duration: 1000,
	    ease: 'Cubic.easeOut',
	    onComplete: () => deltaText.destroy(),
	});
	
	return this;
    }
    getEntities() {
	const {icon, text} = this.internal;
	return [icon, text];
    }
}
