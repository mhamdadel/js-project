class Bullet {
    static yVel = 10;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 9;
        this.size = 5;
        this.cooldown = 0;
    }
}

function bulletMovement() {

    if (bullets.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].y -= Bullet.yVel;

            c.save();
            c.beginPath();
            c.fillStyle = "red";
            c.fillRect(bullets[i].x, bullets[i].y, 3, 9);
            c.fill();
            c.closePath();
            c.restore();
        }
    }
}