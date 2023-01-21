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