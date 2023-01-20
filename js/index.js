let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ch = canvas.height;
let cw = canvas.width;
let c = canvas.getContext("2d");
let out = document.getElementById("out");
let err = document.getElementById("err");
let heartCounter = document.getElementById("heartCounter");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

let init = requestAnimationFrame(start);
player = new Player(cw * .5 - 75, ch - 50);
ball = new Ball(cw / 2, ch - 58);
let gameOver = 0;
let wDown = false;
let sDown = false;
let aDown = false;
let dDown = false;
let maxBlocks = 13;
let blocks = [];
let bonuses = [];
let makeBlock = 2;
let hits = 0;
let currentHits = 0;
let newLineNow = 0;
let maxYNow = 0;

function start() {
	clear();
	renderBackground();
	checkKeyboardStatus();
	mouse();
	checkPlayersBounds();
	checkBallBounds();
	checkPlayers_BallCollision();
	checkBlocks_BallCollision();
	checkBonuse_PlayerCollision();
	movePlayers();
	moveBall();
	renderPlayers();
	renderBall();
	renderBlocks();
	renderRowOfBlocks();
	heartCounter.innerText = player.health;

	if(bonuses.length > 0){
		bonuses.forEach(function(el){
			el.y += 2;
			el.draw();
		});
	}

	if(maxYNow >= player.y - 20){
		gameOver = 1;
	}

	for (let i = 0; i < blocks.length; i++) {
		blocks[i].render();
	}
	if (gameOver == 0) {
		requestAnimationFrame(start);
	}else if (gameOver === 1){
		console.log("Game Over you loset")
	} 
}

function renderBlocks() {
	if (makeBlock == 2) {
		let sumWidth = 0;
		blocks[0] = new Block(0, 0, 20, 100);
		sumWidth += blocks[0].width;
		let xCur = 0;
		let yCur = 0;
		for (let i = 1; i < maxBlocks * 5; i++) {
			prevBlock = blocks[i - 1];
			if (prevBlock) {
				if (sumWidth + blocks[i - 1].width + 5 < canvas.width) {
					xCur += prevBlock.width + 5;
				} else {
					xCur = 0;
					sumWidth = 0;
					yCur += prevBlock.height + 5;
				}
				blocks[i] = new Block(xCur, yCur, prevBlock.height, prevBlock.width);
				sumWidth += blocks[i].width;
			}
		}
		maxYNow = yCur;
		makeBlock = 0;
	}
}

function renderRowOfBlocks() {
	if (currentHits >= 15) {
		let sumWidth = 0;
		sumWidth += blocks[0].width;
		newLineNow = 1;
		let xCur = 0;
		let yCur = 0;
		let counter = maxBlocks;
		ball.y += 25;
		blocks.reduce(function (sum, el) {
			el.y += 25
		})
		while (counter) {
			xCur += prevBlock.width + 5;
			blocks.push(new Block(xCur, yCur, 20, 100));
			sumWidth += 105;
			counter--;
		}
		maxYNow += 25;
		currentHits = 0;
	}
}

function reset() {

	let score1 = player.score;
	let out;

	player = new Player(cw * .4, ch - 50);

	ball = new Ball(cw / 2, ch / 2);

	wDown = false;
	sDown = false;
	aDown = false;
	dDown = false;
}

function movePlayers() {
	player.x += player.xVel;
}

class Heart {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 2;
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

function mouse() {
	canvas.addEventListener("mouseenter", function () {
		document.body.style.cursor = "none";
	});
	canvas.addEventListener("mouseleave", function () {
		document.body.style.cursor = "pointer";
	});
	canvas.addEventListener("mousemove", function (e) {
		if( ( (player.x + player.width / 2) / e.clientX) < 1 ){
			player.x += player.maxSpeed;
		}else if (( (player.x + player.width / 2) / e.clientX) === 1 ){
			player.x = player.x;
		}else{
			player.x -= player.maxSpeed;
		}
	});
}

function checkBonuse_PlayerCollision(){
	for (const bon of bonuses) {
		let yDir = (bon.y > player.y) ? -1 : 1;
		let xDir = (bon.x > player.x) ? -1 : 1;
		if (between(bon.y + (yDir * bon.size), player.y, player.y + player.height)
			&& between(bon.x + (xDir * bon.size), player.x, player.x + player.width) ) {
				bonuses.splice(bonuses.indexOf(bon),1);
				player.health++;
			} 
	}
}

function checkBlocks_BallCollision() {
	for (let i = 0; i < blocks.length; i++) {
		let yDir = (ball.y > blocks[i].y) ? -1 : 1;
		let xDir = (ball.x > blocks[i].x) ? -1 : 1;
		if (between(ball.y + (yDir * ball.size), blocks[i].y, blocks[i].y + blocks[i].height)
			&& between(ball.x + (xDir * ball.size), blocks[i].x, blocks[i].x + blocks[i].width)
		) {
			if (!ball.cooldown) {
				if (blocks[i] instanceof Block) {
					// if (ball.y > blocks[i].y) {
					// 	ball.y = blocks[i].y + blocks[i].height + .2;
					// } else {
					// 	ball.y = blocks[i].y - .2;
					// }
					currentHits++;
					hits++;
					ball.yVel *= -1;
					blocks[i].health--;
					if (blocks[i].health <= 0) {
						if( between(Math.floor(Math.random()*30), 5, 10) ){
							let xBonuse = blocks[i].x + blocks[i].width/2
							let yBonuse = blocks[i].y + blocks[i].height/2
							let bonuse = new Heart(xBonuse, yBonuse);
							bonuse.draw();
							bonuses.push(bonuse);
						}
						blocks.splice(i, 1);
					}
				}
			} else {
				ball.cooldown = 26;
			}
		}
	}

}

function checkPlayers_BallCollision() {
	let yDir = (ball.y > player.y) ? -1 : 1;
	let xDir = (ball.x > player.x) ? -1 : 1;
	if (between(ball.y + (yDir * ball.size), player.y, player.y + player.height)
		&& between(ball.x + (xDir * ball.size), player.x, player.x + player.width)
	) {
		if (player instanceof Player) {
			xMinOrPos = ball.x < (player.x + player.width / 2) ? -1 : ball.x > (player.x + player.width / 2) ? 1 : 0;
			xDirBall = ((player.x + player.width / 2) / ball.x) / 2;
			if (xMinOrPos > 0) {
				ball.xVel = (((xMinOrPos) * (ball.x - (player.width / 2 + player.x)) / player.width)) * ball.xspeed;
			} else if (xMinOrPos < 0) {
				ball.xVel = ((xMinOrPos) * Math.abs(((ball.x - player.x) / player.width) - 1) + .5) * ball.xspeed;
			}
			ball.yVel = -1 * ball.speed;
		}
	}
}

function between(value, cond1, cond2) {
	if (value >= cond1 && value <= cond2) {
		return true;
	} else {
		return false;
	}
}

function moveBall() {
	if (ball.xVel !== 0) {
		if (ball.xVel > 0) {
			if (ball.xVel < 0) ball.xVel = 0;
		} else {
			if (ball.xVel > 0) ball.xVel = 0;
		}
	}
	if (ball.yVel !== 0) {
		if (ball.yVel > 0) {
			if (ball.yVel < 0) ball.yVel = 0;
		} else {
			if (ball.yVel > 0) ball.yVel = 0;
		}
	}
	ball.x += ball.xVel;
	ball.y += ball.yVel;
}

function checkBallBounds() {
	if (ball.y + ball.size >= canvas.height) {
		if(player.health <= 0){
			gameOver = 1;
		}
		player.health--;
	}
}

function checkPlayersBounds() {
	if (player.x + player.width > canvas.width) {
		player.x = canvas.width - player.width;
		player.xVel *= -0.5;
	}

	if (player.x < 0) {
		player.x = 0;
		player.xVel *= -0.5;
	}
	
	if (player.y + player.size > canvas.height) {
		player.y = canvas.height - player.size;
		player.yVel *= -0.5;
	}
	if (player.y - player.size < 0) {
		player.y = 0 + player.size;
		player.yVel *= -0.5;
	}
	//ballllllllllllllllllllllllllll
	if (ball.x + ball.size > canvas.width) {
		ball.x = canvas.width - ball.size;
		ball.xVel *= -1;
	}

	if (ball.x - ball.size < 0) {
		ball.x = 0 + ball.size;
		ball.xVel *= -1;
	}
	if (ball.y + ball.size > canvas.height) {
		ball.y = canvas.height - ball.size;
		ball.yVel *= -1;
	}
	if (ball.y - ball.size < 0) {
		ball.y = 0 + ball.size;
		ball.yVel *= -1;
	}
}

function checkKeyboardStatus() {
	if (aDown) {
		if (player.xVel > -player.maxSpeed) {
			player.xVel -= player.accel;
		} else {
			player.xVel = -player.maxSpeed;
		}
	} else {
		if (player.xVel < 0) {
			player.xVel += player.decel;
			if (player.xVel > 0) player.xVel = 0;
		}
	}
	if (dDown) {
		if (player.xVel < player.maxSpeed) {
			player.xVel += player.accel;
		} else {
			player.xVel = player.maxSpeed;
		}
	} else {
		if (player.xVel > 0) {
			player.xVel -= player.decel;
			if (player.xVel < 0) player.xVel = 0;
		}
	}
}

document.onkeydown = function (e) {
	if (e.keyCode === 87) {
		wDown = true;
	}
	if (e.keyCode === 65) {
		aDown = true;
	}
	if (e.keyCode === 68) {
		dDown = true;
	}
	if (e.keyCode === 83) {
		sDown = true;
	}
}

document.onkeyup = function (e) {
	if (e.keyCode === 87) {
		wDown = false;
	}
	if (e.keyCode === 65) {
		aDown = false;
	}
	if (e.keyCode === 68) {
		dDown = false;
	}
	if (e.keyCode === 83) {
		sDown = false;
	}
}

function renderBall() {
	c.save();
	c.beginPath();
	c.fillStyle = "white";
	c.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
	c.fill();
	c.closePath();
	c.restore();
}

function renderPlayers() {
	player.render();
}

function renderBackground() {
	c.save();
	c.fillStyle = "#66aa66";
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.strokeStyle = "rgba(255,255,255,0.6)";
	c.restore();
}

function clear() {
	c.clearRect(0, 0, canvas.width, canvas.height);
}
