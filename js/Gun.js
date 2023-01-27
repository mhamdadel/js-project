class Gun {
    cooldown = 2000;
    readyToFire = true;
    yVel = 14;
    x1 = player.x + 5;
    y1 = player.y + (player.height / 2);
    x2 = player.x + player.width - 5;
    y2 = player.y + (player.height / 2);

    fire() {
        if (this.readyToFire == true){
            this.readyToFire = false;
            bullets.push(new Bullet(this.x1,this.y1));
            bullets.push(new Bullet(this.x2,this.y2));
            setTimeout(() => this.readyToFire = true,this.cooldown);
        }
    }
}