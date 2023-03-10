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

let gameStarted = 0;
let gameOver = 0;
let wDown = false;
let sDown = false;
let aDown = false;
let dDown = false;
let maxBlocks = 13;
let blockWidthNow = 100;
let blocks = [];
let bonuses = [];
let balls = [];
let bullets = [];
let makeBlock = 2;
let hits = 0;
let currentHits = 0;
let newLineNow = 0;
let maxYNow = 0;
let movementControl = 1;
let newRowOfBlockEvery = 50;

player = new Player(cw * .5 - 75, ch - 50);
gun = new Gun();
balls[0] = new Ball(cw / 2, ch - 50);


function start() {
	clear();
	renderBackground();

	if (movementControl === 1) {
		mouse();
	} else if (movementControl === 2) {
		checkKeyboardStatus();
	}
	checkPlayersBounds();
	checkBallBounds();
	checkBulletBounds();
	checkPlayers_BallCollision();
	checkBlocks_BallCollision();
	checkBonuse_PlayerCollision();
	checkBlock_BulletCollision();
	movePlayers();
	moveBall();
	renderPlayers();
	renderBall();
	renderRowOfBlocks();
	bulletMovement();
	c.save();
	heartCounter.innerText = player.health;

	if (bonuses.length > 0) {
		bonuses.forEach(function (el) {
			el.y += 2;
			el.draw();
		});
	}

	if (maxYNow >= player.y - 20) {
		gameOver = 1;
	}

	for (let i = 0; i < blocks.length; i++) {
		blocks[i].render();
	}
	if (gameOver === 0) {
		requestAnimationFrame(start);
	} else if (gameOver === 1 && player.health <= 0) {
		console.log("gameOver")
		document.getElementById("gameOverMenu").style.display = "block";
		document.getElementById("gameOverScore").innerText = hits;
	} else if (gameOver === 2) {
		gameOver = 1;
		setTimeout(function () {
			gameOver = 0;
			reset();
			requestAnimationFrame(start);
		}, 2000);
	}
}

function unpause() {
	gameOver = 0
	menuPause.style.display = "none";
	start();
}

function pause() {
	gameOver = 1
	menuPause.style.display = "block";
}

function renderBlocks() {
	newRowOfBlockEvery = 10;
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
	if (currentHits >= newRowOfBlockEvery) {
		let sumWidth = 0;
		sumWidth += blocks[0].width;
		newLineNow = 1;
		let xCur = 0;
		let yCur = 0;
		blockWidthNow *= .8;
		let counter = Math.round(cw / blockWidthNow);
		for (let ball of balls) {
			ball.y += 21
		}

		blocks.reduce(function (sum, el) {
			el.y += 25
		})
		blocks.push(new Block(xCur, yCur, 20, blockWidthNow));
		let prevBlock = blocks[blocks.length - 1];
		while (counter) {
			xCur += prevBlock.width + 5;
			blocks.push(new Block(xCur, yCur, 20, blockWidthNow));
			sumWidth += 105;
			counter--;
		}
		maxYNow += 25;
		currentHits = 0;
	}
}

function reset() {
	player.x = cw * .5;
	player.y = ch - 50;
	balls[0] = new Ball(cw / 2, ch - 50);
}

function movePlayers() {
	player.x += player.xVel;
}

function mouse() {
	canvas.addEventListener("mouseenter", function () {
		document.body.style.cursor = "none";
	});
	canvas.addEventListener("mouseleave", function () {
		document.body.style.cursor = "pointer";
	});
	canvas.addEventListener("mousemove", function (e) {
		if (((player.x + player.width / 2) / e.clientX) < 1) {
			player.x += player.maxSpeed;
		} else if (((player.x + player.width / 2) / e.clientX) === 1) {
			player.x = player.x;
		} else {
			player.x -= player.maxSpeed;
		}
	});
	canvas.addEventListener("click", function (e) {
		gun.x1 = player.x + 5;
		gun.y1 = player.y + (player.height / 2);
		gun.x2 = player.x + player.width - 5;
		gun.y2 = player.y + (player.height / 2);
		gun.fire();
	});
}

function checkBonuse_PlayerCollision() {
	for (const bon of bonuses) {
		let xDir = (bon.x > player.x) ? -1 : 1;
		if (between(bon.y + bon.size, player.y, player.y + player.height)
			&& between(bon.x + (xDir * bon.size), player.x, player.x + player.width)) {
			if (bon instanceof Heart) {
				bonuses.splice(bonuses.indexOf(bon), 1);
				player.health++;
			} else if (bon instanceof GetLarge) {
				bonuses.splice(bonuses.indexOf(bon), 1);
				player.width *= 1.15;
			} else if (bon instanceof GetSmall) {
				bonuses.splice(bonuses.indexOf(bon), 1);
				player.width *= .85;
			} else if (bon instanceof TribleBall) {
				bonuses.splice(bonuses.indexOf(bon), 1);
				balls.reduce(function (prev, ball) {
					let prevBall = new Ball(ball.x - 20, ball.y);
					prevBall.xVel += 3;
					prevBall.yVel = ball.yVel;
					prevBall.y = Math.abs(prevBall.y);
					let nextBall = new Ball(ball.x + 20, ball.y);
					nextBall.xVel -= 3;
					nextBall.yVel = ball.yVel;
					nextBall.y = Math.abs(nextBall.y);
					balls.push(prevBall);
					balls.push(nextBall);
				}, 0);
			}
		}
	}
}

function checkBlocks_BallCollision() {
	for (let i = 0; i < blocks.length; i++) {
		for (let g = 0; g < balls.length; g++) {
			let yDir = (balls[g].y >= blocks[i]?.y) ? -1 : 1;
			let xDir = (balls[g].x >= blocks[i]?.x) ? -1 : 1;
			if (between(balls[g].y + (yDir * balls[g].size), blocks[i].y, blocks[i].y + blocks[i].height)
				&& between(balls[g].x + (xDir * balls[g].size), blocks[i].x, blocks[i].x + blocks[i].width)
			) {
				if (blocks[i] instanceof Block) {
					currentHits++;
					hits++;
					if (
						between(balls[g].y + (yDir * balls[g].size), blocks[i].y, blocks[i].y + blocks[i].height)
						&&
						(balls[g].x > blocks[i].x + blocks[i].width || balls[g].x < blocks[i].x)
					) {
						balls[g].xVel *= -1;
						balls[g].y = blocks[i].y + blocks[i].height + 1;
					} else {
						balls[g].yVel *= -1;
					}
					blocks[i].health--;
					if (blocks[i].health <= 0) {
						if (between(Math.floor(Math.random() * 30), 5, 10)) {
							let xBonuse = blocks[i].x + blocks[i].width / 2
							let yBonuse = blocks[i].y + blocks[i].height / 2
							let bonuse;
							let randBonType = Math.floor(Math.random() * 4);
							if (randBonType === 0) {
								bonuse = new Heart(xBonuse, yBonuse);
							} else if (randBonType === 1) {
								bonuse = new GetLarge(xBonuse, yBonuse);
							} else if (randBonType === 2) {
								bonuse = new GetSmall(xBonuse, yBonuse);
							} else if (randBonType === 3) {
								bonuse = new TribleBall(xBonuse, yBonuse);
							}
							bonuse.draw();
							bonuses.push(bonuse);
						}
						blocks.splice(i, 1);
					}
				}
			}
		}
	}
}

function checkPlayers_BallCollision() {
	for (let g = 0; g < blocks.length; g++) {
		for (let i = 0; i < balls.length; i++) {
			let yDir = (balls[i].y > player.y) ? -1 : 1;
			let xDir = (balls[i].x > player.x) ? -1 : 1;
			if (between(balls[i].y + (yDir * balls[i].size), player.y, player.y + player.height)
				&& between(balls[i].x + (xDir * balls[i].size), player.x, player.x + player.width)
			) {
				if (player instanceof Player) {
					xMinOrPos = balls[i].x < (player.x + player.width / 2) ? -1 : balls[i].x > (player.x + player.width / 2) ? 1 : 0;
					xDirBall = ((player.x + player.width / 2) / balls[i].x) / 2;
					if (xMinOrPos > 0) {
						balls[i].xVel = (((xMinOrPos) * (balls[i].x - (player.width / 2 + player.x)) / player.width)) * balls[i].xspeed;

					} else {
						balls[i].xVel = ((xMinOrPos) * Math.abs(((balls[i].x - player.x) / player.width) - 1) + .5) * balls[i].xspeed;
					}
					balls[i].yVel = -1 * balls[i].speed;
				}
			}
		}
	}
}

function checkBlock_BulletCollision() {
	for (let i = 0; i < blocks.length; i++) {
		for (let g = 0; g < bullets.length; g++) {
			if (between(bullets[g].y, blocks[i].y, blocks[i].y + blocks[i].height)
				&& between(bullets[g].x, blocks[i].x, blocks[i].x + blocks[i].width)
			) {
				if (blocks[i] instanceof Block) { 
					blocks[i].health--;
					currentHits++;
					bullets.splice(g,1);
					if (blocks[i].health <= 0) {
						blocks.splice(i, 1);
					}
				}
			}
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
	for (let i = 0; i < balls.length; i++) {
		if (balls[i].xVel !== 0) {
			if (balls[i].xVel > 0) {
				if (balls[i].xVel < 0) balls[i].xVel = 0;
			} else {
				if (balls[i].xVel > 0) balls[i].xVel = 0;
			}
		}
		if (balls[i].yVel !== 0) {
			if (balls[i].yVel > 0) {
				if (balls[i].yVel < 0) balls[i].yVel = 0;
			} else {
				if (balls[i].yVel > 0) balls[i].yVel = 0;
			}
		}
		balls[i].x += balls[i].xVel;
		balls[i].y += balls[i].yVel;
	}
}

function checkBallBounds() {
	for (let i = 0; i < balls.length; i++) {
		if (balls[i].y + balls[i].size >= canvas.height) {
			if (player.health <= 0 && balls.length < 2) {
				gameOver = 1;
			} else if (balls.length < 2) {
				gameOver = 2;
				player.health--;
			} else {
				balls.splice(i, 1);
			}
		}
	}
}

function checkBulletBounds() {
	for (let i = 0; i < bullets.length; i++) {
		if (bullets[i].y >= canvas.height) {
			bullets.splice(i, 1);
		}
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
	for (let i = 0; i < balls.length; i++) {
		if (balls[i].x + balls[i].size > canvas.width) {
			balls[i].x = canvas.width - balls[i].size;
			balls[i].xVel *= -1;
		}

		if (balls[i].x - balls[i].size < 0) {
			balls[i].x = 0 + balls[i].size;
			balls[i].xVel *= -1;
		}
		if (balls[i].y + balls[i].size > canvas.height) {
			balls[i].y = canvas.height - balls[i].size;
			balls[i].yVel *= -1;
		}
		if (balls[i].y - balls[i].size < 0) {
			balls[i].y = 0 + balls[i].size;
			balls[i].yVel *= -1;
		}
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

	for (let i = 0; i < balls.length; i++) {
		balls[i].draw();
	}
}

function renderPlayers() {
	player.render();
}

function renderBackground() {
	// let img = new Image();
	// img.src = "images/background.jpg";
	// c.save();
	// c.beginPath();
	// c.drawImage(img, 0, 0,canvas.width,canvas.height);
	// c.closePath();
	// c.restore();

	c.save();
	c.fillStyle = "#66aa66";
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.strokeStyle = "rgba(255,255,255,0.6)";
	c.restore();
}

function clear() {
	c.clearRect(0, 0, canvas.width, canvas.height);
}
