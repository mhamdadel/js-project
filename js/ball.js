class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.xspeed = 14;
        this.xVel = 0;
        this.yVel = 0;
        this.decel = 0.04;
        this.size = 5;
        this.cooldown = 0;
    }

    draw() {
        c.save();
        c.beginPath();
        c.fillStyle = "red";
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.closePath();
        c.restore();
    }
}