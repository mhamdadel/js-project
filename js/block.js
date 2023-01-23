

class Block {
    static counter = 0;
    colors = ["#FFF", "#FF0000", "#00FF00", "#0000FF", "#000"];
    imgSrc = "images/";
    srcs = [
        this.imgSrc+"block1.png",
        this.imgSrc+"block2.png", 
        this.imgSrc+"block3.png", 
        this.imgSrc+"block4.png", 
        this.imgSrc+"block5.png"
    ];
    health;
    height;
    width;
    cooldown;
	constructor(x = 0, y = 0, height = 10, width = 50)  {
        Block.counter++;
		this.x = x;
		this.y = y;
        this.height = height;
        this.width = width;
		this.img = new Image();
		this.img.height = this.height;
		this.img.width = this.width;
        this.health = Math.ceil(Math.random()*this.srcs.length);
	}

	render() {
		this.img.src = this.srcs[this.health - 1];
		c.save();
		c.beginPath();
		c.drawImage(this.img, this.x, this.y,this.width,this.height);
		c.closePath();
		c.restore();
	}
}

// function renderRowOfBlocks() {
// 	if (currentHits >= 2) {
// 		let sumWidth = 0;
// 		newLineNow = 1;
// 		let xCur = 0;
// 		let yCur = 0;
// 		let counter = maxBlocks;
// 		balls.reduce(function (sum, el) {
// 			el.y += 21
// 		})
// 		blocks.reduce(function (sum, el) {
// 			el.y += 21
// 		})
// 		blocks.push(new Block(0, 0, 20, 75));
// 		sumWidth += blocks[blocks.length - 1].width;
// 		for (let i = 0; i < maxBlocks * 2; i++) {
// 			prevBlock = blocks[blocks.length + i - 1];
// 			console.log(prevBlock)
// 			if (prevBlock) {
// 				sumWidth += prevBlock.width;
// 				console.log(sumWidth);
// 				if (sumWidth + blocks[blocks.length + i  - 1].width + 1 < canvas.width) {
// 					xCur += prevBlock.width + 1;
// 				} else {
// 					xCur = 0;
// 					sumWidth = 0;
// 					yCur += prevBlock.height + 1;
// 				}
// 				blocks[i] = new Block(xCur, yCur, prevBlock.height, 75);
// 				sumWidth += blocks[i].width;
// 			}
// 		}
// 		currentHits = 0;
// 		maxYNow = yCur;
// 	}
// }