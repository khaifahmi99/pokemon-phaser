import Phaser, { Types } from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
    private hero!: Types.Physics.Arcade.SpriteWithDynamicBody;
    private velocity: number = 200;
    private frameRate: number = 16;

	constructor() {
		super('hello-world')
	}

    preload() {
        this.load.image('base_tiles', 'assets/Outside.png');
        this.load.tilemapTiledJSON('tilemap', 'assets/level_1.json');

        this.load.spritesheet('hero', 'assets/ash.png', {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'tilemap' });
        const tileset = map.addTilesetImage('Outside', 'base_tiles');

        const ground = map.createLayer('Ground', tileset);
        const landscape = map.createLayer('Landscape', tileset);
        const mountain = map.createLayer('mountain', tileset);
        const lake = map.createLayer('lake', tileset);
        const grass = map.createLayer('Grass', tileset);
        const walls = map.createLayer('Wall', tileset);
        const item = map.createLayer('item', tileset);
        const buildingLow = map.createLayer('Building Low', tileset);
        const treeTrunk = map.createLayer('tree trunk', tileset);
        
        // Note: Order is importatnt here, hero must be created before high-rise object (tree tops, high buildings)
        // This will make sure that the high-rise object will cover the hero; looks more realistic
        this.hero = this.physics.add.sprite(2750, 1800, 'hero').setScale(1);

        const treeTop = map.createLayer('tree top', tileset);
        const buildingHigh = map.createLayer('Building High', tileset);

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
        
        map.setCollisionBetween(0, 999, true, false, 'tree trunk')

        this.hero.play({ key: 'idle_down', repeat: -1 });

        this.cameras.main.startFollow(this.hero, true);
        this.cameras.main.setFollowOffset(-this.hero.width, -this.hero.height);

        this.physics.add.collider(this.hero, treeTrunk);
        this.physics.add.collider(this.hero, buildingLow);
        this.physics.add.collider(this.hero, mountain);
        this.physics.add.collider(this.hero, lake);
        this.physics.add.collider(this.hero, landscape);
        this.physics.add.collider(this.hero, walls);

        treeTrunk.setCollisionBetween(0, 9999);
        buildingLow.setCollisionBetween(0, 9999);
        mountain.setCollisionBetween(0, 9999);
        lake.setCollisionBetween(0, 9999);
        walls.setCollisionBetween(0, 9999);

        const signPostObjects = map.getObjectLayer('SignPost');
        signPostObjects.objects.forEach(signPost => {
            const obj = this.add.rectangle(signPost.x! + (signPost.width!/2), signPost.y! - (signPost.height!/2), signPost.width, signPost.height, 0xff0000, 0.4);

            this.physics.world.enable(obj, 1);
            this.physics.add.collider(this.hero, obj, () => {
                console.log(signPost.name);
            });
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