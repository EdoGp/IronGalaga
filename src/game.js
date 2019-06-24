let theGame;
let ctx;
let background = new Image();
background.src = './images/background.gif';

class Game {
	constructor() {
		this.ship = new Ship();
		this.invaders = [];
		this.invadersBullets = [];
		this.score = 0;
	}
	addInvader(x, y, invader = 'enemy1') {
		let newInvader = new Invader(x, y, invader);
		newInvader.move();
		this.invaders.push(newInvader);
	}
}

class Bullet {
	constructor(x, y, direction, bulletImage) {
		this.image = this.imageCreator(`./images/${bulletImage}.png`);
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.height = 10;
		this.width = 5;
	}
	imageCreator(imageUrl) {
		let img = new Image();
		img.src = imageUrl;
		return img;
	}
	move() {
		setInterval(() => {
			if (this.direction === 'up') {
				this.y -= 23;
			} else if (this.direction === 'down') {
				this.y += 23;
			}
		}, 500);
	}
	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}
}

class Ship {
	constructor() {
		this.image = this.imageCreator('./images/galaga.png');
		this.lives = 3;
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
			}, 500);
		}
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
	}
	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}
	move() {
		let direction = 'left';
		setInterval(() => {
			if (direction === 'left') {
				this.x -= 10;
			} else if (direction === 'right') {
				this.x += 10;
			}
			if (this.x > 568) {
				this.x = 568;
				this.y += 35;
				direction = 'left';
			}
			if (this.x < 0) {
				this.x = 0;
				this.y += 35;
				direction = 'right';
			}
			if (this.y > 568) {
				this.y = 10;
			}
		}, 1000);
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
		theGame = new Game();
		theGame.addInvader(265, 55);
		theGame.addInvader(300, 55);
		theGame.addInvader(335, 55);
		theGame.addInvader(370, 55);
		theGame.addInvader(405, 55);
		theGame.addInvader(440, 55);
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
		setInterval(() => {
			ctx.clearRect(0, 0, 600, 600);
			drawElements();
			checkCollisionShipBullets();
			checkShipBullets();
			checkCollisionInvadersBullets();
		}, 50);
	}

	function invaderShoot() {
		setInterval(() => {
			if (Math.floor(Math.random() * theGame.invaders.length) === 3) {
				let randomInvader = Math.floor(Math.random() * theGame.invaders.length);
				theGame.invadersBullets.push(theGame.invaders[randomInvader].shoot());
			}
		}, 3000);
	}

	function drawElements() {
		drawInvaders();
		drawShip();
		drawBullets();
		drawHUD();
	}

	function drawInvaders() {
		theGame.invaders.forEach((invader) => {
			invader.draw();
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
			theGame.invaders.forEach((invader, invadersIndex) => {
				if (
					bullet.x < invader.x + invader.width &&
					bullet.x + bullet.width > invader.x &&
					bullet.y < invader.y + invader.height &&
					bullet.y + bullet.height > invader.y
				) {
					theGame.ship.bullets.splice(bulletsIndex, 1);
					theGame.invaders.splice(invadersIndex, 1);
					theGame.score += 10;
				}
			});
		});
	}

	function checkCollisionInvadersBullets() {
		theGame.invadersBullets.forEach((bullet) => {
			if (
				bullet.x < theGame.ship.x + theGame.ship.width &&
				bullet.x + bullet.width > theGame.ship.x &&
				bullet.y < theGame.ship.y + theGame.ship.height &&
				bullet.y + bullet.height > theGame.ship.y
			) {
				if (!theGame.ship.respawn) {
					theGame.ship.lives -= 1;
					theGame.ship.respawn = true;
					theGame.ship.canShoot = false;
					setTimeout(() => {
						theGame.ship.respawn = false;
						theGame.ship.canShoot = true;
					}, 1500);
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
