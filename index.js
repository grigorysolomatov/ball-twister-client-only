import { createGame } from './js/wrap-phaser.js';
import { StateTree } from './js/state-tree.js';
import { gameContent } from './js/game-content.js';
import { timeout } from './js/async.js';

async function main() {
    const game = createGame({
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#111111',
	type: Phaser.WEBGL,
    });
    const scene = await game.newScene('MainScene');
    // -------------------------------------------------------------------------
    new StateTree().set({
	root: gameContent,
	ctx: {scene},
    }).run('root');
}

await main();
