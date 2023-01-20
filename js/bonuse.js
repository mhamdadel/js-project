class Heart {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 25;
		this.src = "images/heart.png";
		this.img = new Image();
		this.img.src = this.src;
		this.img.height = this.size;
		this.img.width = this.size;
	}

	draw() {
		c.save();
		c.beginPath();
		c.drawImage(this.img, this.x, this.y);
		c.closePath();
		c.restore();
	}
}

class GetLarge {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 20;
	}

	draw() {
		c.save();
		c.beginPath();
		c.fillStyle = "white";
		c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		c.fill();
		c.closePath();
		c.restore();

		c.save();
		c.beginPath();
		c.font = "16px Verdana";
		c.fillStyle = "black";
		c.fillText("<->", this.x - this.size / 1.3, this.y + this.size / 4);
		c.closePath();
		c.restore();
	}
}

class GetSmall {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 20;
	}

	draw() {
		c.save();
		c.beginPath();
		c.fillStyle = "white";
		c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		c.fill();
		c.closePath();
		c.restore();

		c.save();
		c.beginPath();
		c.font = "16px Verdana";
		c.fillStyle = "black";
		c.fillText(">-<", this.x - this.size / 1.3, this.y + this.size / 4);
		c.closePath();
		c.restore();
	}
}