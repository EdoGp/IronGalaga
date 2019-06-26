let theGame;
let ctx;
let background = new Image();
background.src = './images/background.gif';

class Game {
	constructor(score, lives, level = 1) {
		this.ship = new Ship(lives);
		this.invaders = [];
		this.invadersBullets = [];
		this.score = score;
		this.level = level;
		this.createLevel(level);
	}
	addInvader(x, y, invader = 'enemy1') {
		let newInvader = new Invader(x, y, invader);
		return newInvader;
	}

	createLevel(level) {
		let xCoord = 56;
		let invaderRow = [];
		switch (level) {
			case 1:
				for (let x = 0; x < 10; x++) {
					invaderRow.push(this.addInvader(xCoord + x * 26, 55, 'enemy1'));
				}
				this.invaders.push(invaderRow);
				break;
			case 2:
				for (let x = 0; x < 10; x++) {
					invaderRow.push(this.addInvader(xCoord + x * 26, 55, 'enemy2'));
				}
				this.invaders.push(invaderRow);
				break;
			case 3:
				let invaderRow2 = [];
				for (let x = 0; x < 10; x++) {
					invaderRow.push(this.addInvader(xCoord + x * 26, 55, 'enemy1'));
				}
				for (let x = 0; x < 10; x++) {
					invaderRow2.push(this.addInvader(xCoord + x * 26, 79, 'enemy2'));
				}
				this.invaders.push(invaderRow);
				this.invaders.push(invaderRow2);
				break;
			case 0:
				break;
			default:
				for (let x = 0; x < 7; x++) {
					this.addInvader(xCoord + x * 26, 55, 'enemy1');
				}
				break;
		}
	}

	moveInvaders() {
		setInterval(() => {
			this.invaders.forEach((row) => {
				row.forEach((invader) => {
					invader.move();
				});
			});
		}, 1000);
	}

	changeInvadersDirection() {
		if (this.invaders.length > 0 && this.invaders[0].length > 0) {
			for (let i = 0; i < this.invaders.length; i++) {
				if (this.invaders[i][0].x < 10) {
					for (let j = 0; j < this.invaders[i].length; j++) {
						this.invaders[i][j].direction = 'right';
						this.invaders[i][j].y += 20;
						this.invaders[i][j].x += 5;
					}
				} else if (this.invaders[i][this.invaders[i].length - 1].x > 560) {
					for (let j = 0; j < this.invaders[i].length; j++) {
						this.invaders[i][j].direction = 'left';
						this.invaders[i][j].y += 20;
						this.invaders[i][j].x -= 5;
					}
				}
			}
		}
	}
}

class Bullet {
	constructor(x, y, direction, bulletImage) {
		this.image = this.imageCreator(`./images/${bulletImage}.png`);
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.height = 15;
		this.width = 10;
	}
	imageCreator(imageUrl) {
		let img = new Image(imageUrl, this.x, this.y, this.width, this.height);
		img.src = imageUrl;
		return img;
	}
	move() {
		setInterval(() => {
			if (this.direction === 'up') {
				this.y -= 25;
			} else if (this.direction === 'down') {
				this.y += 25;
			}
		}, 500);
	}
	draw() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class Ship {
	constructor(lives) {
		this.image = this.imageCreator('./images/galaga.png');
		this.lives = lives;
		this.bullets = [];
		this.x = 300;
		this.y = 568;
		this.height = 32;
		this.width = 32;
		this.canShoot = true;
		this.respawn = false;
	}
	move(direction) {
		switch (direction) {
			case 'ArrowUp':
				this.y -= 7;
				break;
			case 'ArrowDown':
				this.y += 7;
				break;
			case 'ArrowLeft':
				this.x -= 7;
				break;
			case 'ArrowRight':
				this.x += 7;
				break;
		}
		if (this.x > 568) {
			this.x = 568;
		}
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.y > 568) {
			this.y = 568;
		}
		if (this.y < 478) {
			this.y = 478;
		}
	}

	imageCreator(imageUrl) {
		let img = new Image();
		img.src = imageUrl;
		return img;
	}

	shoot() {
		if (this.canShoot) {
			let newBullet = new Bullet(this.x + 14, this.y - 6, 'up', 'bullet');
			newBullet.move();
			this.bullets.push(newBullet);
			newBullet.draw();
			this.canShoot = false;
			setTimeout(() => {
				this.canShoot = true;
			}, 1500);
		}
	}

	shotDown() {
		let dmgShip = this.imageCreator('./images/explosion.png');
		let startingPoint = 0;
		setInterval(() => {
			setInterval(() => {
				ctx.drawImage(
					dmgShip,
					startingPoint,
					0,
					32,
					32,
					this.x,
					this.y,
					32,
					32,
				);
			}, 50);
			startingPoint += 32;
		}, 700);
	}

	// shield() {}

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}
}

class Invader {
	constructor(x, y, imageUrl) {
		this.image = this.imageCreator(`./images/${imageUrl}.png`);
		this.bullets = [];
		this.x = x;
		this.y = y;
		this.height = 24;
		this.width = 24;
		this.direction = 'left';
	}
	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}
	move() {
		if (this.direction === 'left') {
			this.x -= 25;
		} else if (this.direction === 'right') {
			this.x += 25;
		}
		if (this.x > 568) {
			this.x = 568;
		}
		if (this.x < 0) {
			this.x = 0;
		}
	}

	destroy() {
		this.image = this.imageCreator(`./images/${imageUrl}.png`);
	}
	shoot() {
		let invaderBullet = new Bullet(
			this.x,
			this.y + 24,
			'down',
			'bulletInvader',
		);
		invaderBullet.move();
		return invaderBullet;
	}

	imageCreator(imageUrl) {
		let img = new Image();
		img.src = imageUrl;
		return img;
	}
}

window.onload = function() {
	ctx = document.getElementById('game-board').getContext('2d');
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, 600, 600);
	ctx.fill();

	document.getElementById('start-button').onclick = function() {
		theGame = new Game(0, 3, 3);
		animate();
		invaderShoot();
	};

	document.onkeydown = function(e) {
		let directions = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
		if (directions.includes(e.key)) {
			theGame.ship.move(e.key);
		}
		if (e.key === ' ') {
			theGame.ship.shoot();
		}
	};

	function animate() {
		theGame.moveInvaders();
		setInterval(() => {
			ctx.clearRect(0, 0, 600, 600);
			drawElements();
			checkCollisionShipBullets();
			checkCollisionInvadersBullets();
			checkLives();
			checkLevel();
			checkShipBullets();
			theGame.changeInvadersDirection();
		}, 1);
	}

	function checkLives() {
		if (theGame.ship.lives === 0) {
			theGame = new Game(theGame.score, 0, 0);
		}
	}

	function checkLevel() {
		if (theGame.invaders.length > 0 && theGame.invaders[0].length === 0) {
			theGame = new Game(theGame.score, theGame.ship.lives, theGame.level + 1);
			theGame.moveInvaders();
		}
	}

	function invaderShoot() {
		setInterval(() => {
			if (theGame.invaders.length > 0) {
				if (theGame.invaders.length === 1) {
					if (
						Math.floor(Math.random() * theGame.invaders[0].length) % 2 ===
						0
					) {
						let randomInvader = Math.floor(
							Math.random() * theGame.invaders[0].length,
						);
						theGame.invadersBullets.push(
							theGame.invaders[0][randomInvader].shoot(),
						);
					}
				} else if (theGame.invaders.length > 1) {
					for (let i = 0; i < theGame.invaders.length; i++) {
						for (let j = 0; j < theGame.invaders[i].length; j++) {
							if (
								Math.floor(Math.random() * theGame.invaders[0].length) % 5 ===
								0
							) {
								let randomInvader = Math.floor(
									Math.random() * theGame.invaders[i].length,
								);
								theGame.invadersBullets.push(
									theGame.invaders[i][randomInvader - 1].shoot(),
								);
							}
						}
					}
				}
			}
		}, 2000);
	}

	function drawElements() {
		drawInvaders();
		drawShip();
		drawBullets();
		drawHUD();
	}

	function drawInvaders() {
		theGame.invaders.forEach((row) => {
			row.forEach((invader) => {
				invader.draw();
			});
		});
	}

	function drawHUD() {
		ctx.textAlign = 'left';
		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText(`Score: ${theGame.score}`, 5, 25);
		ctx.fillText(`Lives: ${theGame.ship.lives}`, 5, 50);
		ctx.fillText(`IronGalaga`, 495, 25);
		ctx.fillStyle = 'black';
	}

	function drawBullets() {
		theGame.ship.bullets.forEach((bullet) => {
			bullet.draw();
		});
		theGame.invadersBullets.forEach((bullet) => {
			bullet.draw();
		});
	}

	function drawShip() {
		theGame.ship.draw();
	}

	function checkCollisionShipBullets() {
		theGame.ship.bullets.forEach((bullet, bulletsIndex) => {
			theGame.invaders.forEach((row, rowIndex) => {
				row.forEach((invader, invadersIndex) => {
					if (
						bullet.x < invader.x + invader.width &&
						bullet.x + bullet.width > invader.x &&
						bullet.y < invader.y + invader.height &&
						bullet.y + bullet.height > invader.y
					) {
						theGame.ship.bullets.splice(bulletsIndex, 1);
						theGame.invaders[rowIndex].splice(invadersIndex, 1);
						theGame.score += 10;
					}
				});
			});
		});
	}

	function checkCollisionInvadersBullets() {
		theGame.invadersBullets.forEach((bullet, index) => {
			if (
				bullet.x < theGame.ship.x + theGame.ship.width &&
				bullet.x + bullet.width > theGame.ship.x &&
				bullet.y < theGame.ship.y + theGame.ship.height &&
				bullet.y + bullet.height > theGame.ship.y
			) {
				theGame.invadersBullets.splice(index, 1);
				if (!theGame.ship.respawn) {
					theGame.ship.lives -= 1;
					theGame.ship.respawn = true;
					theGame.ship.canShoot = false;
					theGame.ship.shotDown();
					setTimeout(() => {
						theGame.ship.respawn = false;
						theGame.ship.canShoot = true;
						theGame = new Game(
							theGame.score,
							theGame.ship.lives,
							theGame.level,
						);
						theGame.moveInvaders();
					}, 2400);
				}
			}
		});
	}

	function checkShipBullets() {
		theGame.ship.bullets = theGame.ship.bullets.filter((bullet) => {
			return bullet.y < 600 && bullet.y > 0;
		});
	}
};
