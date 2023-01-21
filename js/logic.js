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
		if (player.health <= 0) {
			gameOver = 1;
		}
		player.health--;
	}
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
			}else if (bon instanceof TribleBall){
                balls.reduce( function(prev, ball) {
					console.log(ball);
					let prevBall = new Ball(ball.x - 20, ball.y);
					let nextBall = new Ball(ball.x + 20, ball.y);
					prevBall.xVel += 3;
					prevBall.y = Math.abs(prevBall.y);
					nextBall.xVel -= 3;
					nextBall.y = Math.abs(nextBall.y);
					balls.push(prevBall);
					balls.push(prevBall);
				});
            }
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
						if (between(Math.floor(Math.random() * 30), 5, 10)) {
							let xBonuse = blocks[i].x + blocks[i].width / 2
							let yBonuse = blocks[i].y + blocks[i].height / 2
							let bonuse;
							let randBonType = Math.floor(Math.random() * 4);
							if(randBonType === 0){
								bonuse = new Heart(xBonuse, yBonuse);
							}else if(randBonType === 1) {
								bonuse = new GetLarge(xBonuse, yBonuse);
							}else if(randBonType === 2){
								bonuse = new GetSmall(xBonuse, yBonuse);
							}else if (randBonType === 3){
								bonuse = new TribleBall(xBonuse, yBonuse);
							}
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