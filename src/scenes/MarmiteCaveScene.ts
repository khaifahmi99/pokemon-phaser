import { Types } from "phaser";
import { Scene } from "~/constant";

export default class MarmiteCaveScene extends Phaser.Scene {
  private hero!: Types.Physics.Arcade.SpriteWithDynamicBody;
  private velocity: number = 192;
  private frameRate: number = 16;

  constructor() {
		super('Marmite Cave')
	}

  preload() {
    this.load.image('base_tiles', 'assets/Outside.png');
    this.load.tilemapTiledJSON('cave', 'assets/cave.json');

    this.load.spritesheet('hero', 'assets/ash.png', {
        frameWidth: 32,
        frameHeight: 48,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'cave' });
    const tileset = map.addTilesetImage('Outside', 'base_tiles');

    const ground = map.createLayer('Ground', tileset);
    const landscape = map.createLayer('Landscape', tileset);
    const wall = map.createLayer('Walls', tileset);

    this.hero = this.physics.add.sprite(960, 2400, 'hero').setScale(1);

    this.cameras.main.startFollow(this.hero, true);
    this.cameras.main.setFollowOffset(-this.hero.width, -this.hero.height);

    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    this.hero.setCollideWorldBounds(true);

    this.anims.create({
      key: 'idle_right',
      frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 5 }),
      frameRate: this.frameRate * 0.6,
    });

    this.anims.create({
        key: 'idle_up',
        frames: this.anims.generateFrameNumbers('hero', { start: 6, end: 11 }),
        frameRate: this.frameRate * 0.6,
    });

    this.anims.create({
        key: 'idle_left',
        frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 17 }),
        frameRate: this.frameRate * 0.6,
    });

    this.anims.create({
        key: 'idle_down',
        frames: this.anims.generateFrameNumbers('hero', { start: 18, end: 23 }),
        frameRate: this.frameRate * 0.6,
    });


    this.anims.create({
        key: 'run_right',
        frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 29 }),
        frameRate: this.frameRate,
    });

    this.anims.create({
        key: 'run_up',
        frames: this.anims.generateFrameNumbers('hero', { start: 30, end: 35 }),
        frameRate: this.frameRate,
    });

    this.anims.create({
        key: 'run_left',
        frames: this.anims.generateFrameNumbers('hero', { start: 36, end: 41 }),
        frameRate: this.frameRate,
    });

    this.anims.create({
        key: 'run_down',
        frames: this.anims.generateFrameNumbers('hero', { start: 42, end: 47 }),
        frameRate: this.frameRate,
    });

    this.physics.add.collider(this.hero, wall);
    wall.setCollisionBetween(0, 9999);

    const doors = map.getObjectLayer('Doors');
    doors.objects.forEach(door => {
        const obj = this.add.rectangle(door.x! + (door.width!/2), door.y! - (door.height!/2), door.width, door.height, 0xff0000, 0);
        this.physics.world.enable(obj, 1);

        this.physics.add.collider(this.hero, obj, () => {
          if (door.name === 'Exit') {
            this.scene.start('hello-world', { from: Scene.Cave });
          }
        })
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        this.hero.setVelocity(-this.velocity, 0);
        this.hero.play('run_left', true);
    } else if (cursors.right.isDown) {
        this.hero.setVelocity(this.velocity, 0);
        this.hero.play('run_right', true);
    } else if (cursors.up.isDown) {
        this.hero.setVelocity(0, -this.velocity);
        this.hero.play('run_up', true);
    } else if (cursors.down.isDown) {
        this.hero.setVelocity(0, this.velocity);
        this.hero.play('run_down', true);
    } else {
        this.hero.setVelocity(0, 0);
        this.hero.play('idle_down', true);
    }
  }

}