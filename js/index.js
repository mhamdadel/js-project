let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ch = canvas.height;
let cw = canvas.width;
let c = canvas.getContext("2d");
let out = document.getElementById("out");
let err = document.getElementById("err");
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
let makeBlock = 2;
let hits = 0;
let currentHits = 0;
let newLineNow = 0;

function start() {
	clear();
	renderBackground();
	checkKeyboardStatus();
	checkPlayersBounds();
	checkBallBounds();
	checkPlayers_BallCollision();
	movePlayers();
	moveBall();
	renderPlayers();
	renderBall();
	renderBlocks();
	renderRowOfBlocks();


	for (let i = 0; i < blocks.length; i++) {
		blocks[i].render();
	}
	if (gameOver == 0) {
		requestAnimationFrame(start);
	}
}

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.speed = 10;
	this.xspeed = 14;
	this.xVel = 0;
	this.yVel = 0;
	this.decel = 0.04;
	this.size = 10;
	this.cooldown = 0;
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
		blocks.reduce(function(sum,el){
			el.y += 25
		})
		while (counter){
			xCur += prevBlock.width + 5;
			blocks.push(new Block(xCur, yCur, 20, 100));
			sumWidth += 105;
			counter--;
		}
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

function checkPlayers_BallCollision() {
	for (let i = 0; i < blocks.length; i++) {
		let yDir = (ball.y > blocks[i].y) ? -1 : 1;
		let xDir = (ball.x > blocks[i].x) ? -1 : 1;
		if (between(ball.y + (yDir * ball.size), blocks[i].y, blocks[i].y + blocks[i].height)
			&& between(ball.x + (xDir * ball.size), blocks[i].x, blocks[i].x + blocks[i].width)
		) {
			if (!ball.cooldown) {
				if (blocks[i] instanceof Block) {
					if(ball.y > blocks[i].y){
						ball.y = blocks[i].y + blocks[i].height +  .2;
					}else{
						ball.y = blocks[i].y - .2;
					}
					currentHits++;
					hits++;
					ball.xVel *= -1;
					ball.yVel *= -1;
					blocks[i].health--;
					if (blocks[i].health <= 0) {
						blocks.splice(i, 1);
					}
				}
			} else {
				ball.cooldown = 26;
			}
		}
	}

	let yDir = (ball.y > player.y) ? -1 : 1;
	let xDir = (ball.x > player.x) ? -1 : 1;
	//console.log(`between(${ball.x} + (${xDir} * ${ball.size}), ${player.x}, ${player.x} + ${player.width})`)
	if (between(ball.y + (yDir * ball.size), player.y, player.y + player.height)
		&& between(ball.x + (xDir * ball.size), player.x, player.x + player.width)
	) {
		if (player instanceof Player) {
			xMinOrPos = ball.x < (player.x + player.width / 2) ? -1 : ball.x > (player.x + player.width / 2) ? 1 : 0;
			xDirBall = ((player.x + player.width / 2) / ball.x) / 2;
			//ball.xVel = ( (xMinOrPos) * (((ball.x + ball.size/2) % (player.x + player.width/2)) /5 )) ;
			if (xMinOrPos > 0) {
				ball.xVel = (((xMinOrPos) * (ball.x - (player.width / 2 + player.x)) / player.width)) * ball.xspeed;
			} else if (xMinOrPos < 0) {
				ball.xVel = ((xMinOrPos) * Math.abs(((ball.x - player.x) / player.width) - 1) + .5) * ball.xspeed;
			}
			// console.log(Math.abs(((ball.x - player.x) / player.width)-1))
			// console.log((ball.x - (player.width/2 + player.x)) / player.width)
			//console.log(( (xMinOrPos) * (ball.x / (player.x + player.width /2)) % 1 ) * ball.xspeed);
			// console.log(( (xMinOrPos) * (((ball.x + ball.size/2) / (player.x + player.width/2) ) % 1) ) * ball.xspeed)

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
		gameOver = 1;
	}
}

function checkPlayersBounds() {
	if (player.x + player.width > canvas.width) {
		player.x = canvas.width - player.width;
		player.xVel *= -0.5;
	}
	if (player.x - player.size < 0) {
		player.x = 0 + player.size;
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
	if (wDown) {
		if (player.yVel > -player.maxSpeed) {
			player.yVel -= player.accel;
		} else {
			player.yVel = -player.maxSpeed;
		}
	} else {
		if (player.yVel < 0) {
			player.yVel += player.decel;
			if (player.yVel > 0) player.yVel = 0;
		}
	}
	if (sDown) {
		if (player.yVel < player.maxSpeed) {
			player.yVel += player.accel;
		} else {
			player.yVel = player.maxSpeed;
		}
	} else {
		if (player.yVel > 0) {
			player.yVel -= player.decel;
			if (player.yVel < 0) player.yVel = 0;
		}
	}
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
