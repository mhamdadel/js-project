class Player {
	x;
	y;
	size = 20;
	xVel = 0;
	yVel = 0;
	score = 0;
	accel = .5;
	decel = .5;
	maxSpeed = 10;
    width = 150;
    height = 20;
    health = 2;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    render() {
        c.fillRect(this.x, this.y, this.width, this.height);
    }
}
