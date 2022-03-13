import Phaser from 'phaser'
import { GridEngine } from 'grid-engine'

import HelloWorldScene from './scenes/HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	width: 1400,
	height: 750,
	physics: {
		default: 'arcade',
	},
	scene: [HelloWorldScene],
	plugins: {
		scene: [{
			key: 'gridEngine',
			plugin: GridEngine,
			mapping: 'gridEngine',
			start: true,
		}]
	}
}

export default new Phaser.Game(config)
