class Ship {
	// constructor(dmg, imageUrl, lives, weapon) {
	constructor() {
		// this.dmg = dmg;
		this.image = this.imageCreator('./images/galaga.png');
		this.lives = 3;
		// this.weaponType = weapon;
		this.x = 300;
		this.y = 568;
		this.height = 32;
		this.width = 32;
	}
	move(direction) {
		switch (direction) {
			case 'ArrowUp':
				console.log('Moving ship up');
				break;
			case 'ArrowDown':
				console.log('Moving ship down');
				break;
			case 'ArrowLeft':
				console.log('Moving ship left');
				break;
			case 'ArrowRight':
				console.log('Moving ship right');
				break;
		}
	}
	imageCreator(imageUrl) {
		let img = new Image();
		img.src = imageUrl;
		return img;
	}
	shoot() {}
	// shield() {}
	draw() {
		console.log(this.image);
		// ctx.drawImage(this.image, this.x, this.y);
	}
}
