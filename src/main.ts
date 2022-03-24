import Phaser from 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

import HelloWorldScene from './scenes/HelloWorldScene'

export const HEIGHT = 750;
export const WIDTH = 1400;

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
	},
	scene: [HelloWorldScene],
	plugins: {
		scene: [{
			key: 'rexUI',
			plugin: UIPlugin,
			mapping: 'rexUI'
	}]
	}
}

export default new Phaser.Game(config)
