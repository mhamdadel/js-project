

class Block {
    static counter = 0;
    colors = ["#FFF", "#FF0000", "#00FF00", "#0000FF", "#000"];
    health;
    height;
    width;
    cooldown;

    constructor(x = 0, y = 0, height = 10, width = 50) {
        Block.counter++;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.health = Math.ceil(Math.random()*this.colors.length);
    }

    render() {
        c.save();
        c.fillStyle = this.colors[this.health - 1];
        c.fillRect(this.x, this.y, this.width, this.height);
        c.restore();
    }
}
