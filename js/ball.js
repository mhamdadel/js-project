class Ball {
    constructor(x,y){
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
}