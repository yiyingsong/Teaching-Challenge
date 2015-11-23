var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/clouds3.png');
    game.load.image('invis', 'assets/invis7.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('enemy', 'assets/baddie.png', 32, 32);
}

var player;
var platforms;
var cursors;
var bgtile;
var invis;
var ground;
var enemy;
var enemies;
var stars;
var star;
var score = 0;
var timer;
var timePassed = 0;
var lives = 3;
var scoreText;
var timeText;
var livesText;
var starSpawn;
var enemySpawn;
var flyingSpawn;
var done = false;
var inst1 = 'Avoid enemies and collect stars for points!';
var inst2 = 'Up Arrow to Jump.';

function create() {
    bgtile = game.add.tileSprite(0, 0, 800, 600, 'sky');
    game.world.setBounds(0, 0, 900, 600);

    invis = game.add.sprite(0, game.world.height - 300, 'invis');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();
    platforms.enableBody = true;
    ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    inst1 = game.add.text(300, 300, inst1, { fontSize: '20px', fill: '#000' });
    inst2 = game.add.text(300, 350, inst2, { fontSize: '20px', fill: '#000' });
    player = game.add.sprite(120, game.world.height - 150, 'dude');
    game.camera.follow(player);
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(invis);
    player.body.bounce.y = 0;
    player.body.gravity.y = 1200;
    player.body.collideWorldBounds = true;
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    stars = game.add.group();
    enemies = game.add.group();
    stars.enableBody = true;
    enemies.enableBody = true;
    invis.enableBody = true;
    timer = game.time.create(false);
    timer.loop(1000, updateCounter, this);
    timer.start();
    timeText = game.add.text(640, 16, 'Time: ' + timePassed, { fontSize: '32px', fill: '#000' });
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    livesText = game.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#000' });
    cursors = game.input.keyboard.createCursorKeys();
}

function updateCounter() {
    timePassed += 1;
    timeText.text = "Time: " + timePassed;

    starSpawn = Math.floor((Math.random() * 5) + 1);
    if (starSpawn == 1) {
        createStar();
    }

    enemySpawn = Math.floor((Math.random() * 3) + 1);
    if (enemySpawn == 1) {
        createEnemy();
    }

    flyingSpawn = Math.floor((Math.random() * 6) + 1);
    if (flyingSpawn == 1) {
        createFlying();
    }
}

function update() {
    bgtile.tilePosition.x -= 0.2;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    game.physics.arcade.overlap(invis, enemies, points, null, this);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, enemies, hurt, null, this);
    player.animations.play('right');
    if (cursors.up.isDown && player.body.touching.down)
    {
        clearIntro(inst1, inst2);
        player.body.velocity.y = -600;
    }

}

function createStar() {
    star = stars.create(810 + Math.floor((Math.random() * 80) + 1), 
            450 - Math.floor((Math.random() * 200) + 1), 'star');
    star.body.gravity.y = 50 + Math.floor((Math.random() * 250) + 1);
    star.body.bounce.y = 0.5 + Math.random() * 0.2;
    star.body.velocity.x = -200;
}

function createEnemy() {
    enemy = enemies.create(880, game.world.height - 95, 'enemy');
    enemy.body.velocity.x = -200;
    enemy.animations.add('left', [0, 1], 4, true);
    enemy.animations.play('left');
}

function createFlying() {
    enemy = enemies.create(880, game.world.height - 150, 'enemy');
    enemy.body.velocity.x = -130;
    enemy.animations.add('flying', [1], 4, true);
    enemy.animations.play('flying');
}

function collectStar (player, star) {
    star.kill();
    score += 50;
    scoreText.text = 'Score: ' + score;
}

function points(invis, enemy) {
    enemy.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function hurt(player, enemy)  {
        enemy.kill();
        lives -= 1;
        livesText.text = 'Lives: ' + lives;
        gameOver(lives);
}

function gameOver(lives) {
    if (lives == 0) {
        timer.destroy();
        player.kill();
        clearIntro(inst1, inst2);
        var newScore = score;
        scoreText.destroy();
        game.add.text(16, 16, 'Score: ' + newScore, { fontSize: '32px', fill: '#000' });      
        game.add.text(170, 250, 'Game Over', { fontSize: '80px', fill: '#000' });
        game.add.text(230, 350, 'Refresh page to play again', { fontSize: '24px', fill: '#000' });
        done = true;
    }
}

function clearIntro(inst1, inst2) {
    inst1.destroy();
    inst2.destroy();
}