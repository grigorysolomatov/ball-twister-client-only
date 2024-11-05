import { createGame } from './js/wrap-phaser.js';
import { StateTree } from './js/tools/state.js';
import { gameContent } from './js/game-content/game-content.js';

async function main() {
    await new Promise(resolve => WebFont.load({
	google: {
	    families: ['Gochi Hand']
	},
	active: resolve,
    }));
    
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
