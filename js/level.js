class Level {
    static one() {
        if (makeBlock == 2) {
            let x = 0;
            let y = 0;
            for (let i = 0; i < 10; i++) {
                for (let g = 0; g < 10; g++) {
                    if (g == 0 || g == 9 || i == 0 || i == 9) {
                        blocks.push(new Block(x, y, 20, 50));
                        x += 51;
                    } else {
                        x += 51;
                    }
                }
                x = 0;
                y += 21;
            }
            makeBlock = 0;
        }
    }

    static two() {
        if (makeBlock == 2) {
            let x = 0;
            let y = 0;
            for (let i = 0; i < 10; i++) {
                for (let g = i; g < 10; g++) {
                    blocks.push(new Block(x, y, 20, 50));
                    x += 51;
                }
                x = 0;
                y += 21;
            }
            x = canvas.width;
            y = 0;
            for (let i = 0; i < 10; i++) {
                for (let g = i; g < 10; g++) {
                    blocks.push(new Block(x, y, 20, 50));
                    x -= 51;
                }
                x = canvas.width;
                y += 21;
            }
            makeBlock = 0;
        }
    }
}