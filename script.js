// Javscript!

var unit = Math.floor(window.innerWidth / 96) * 4;
document.body.style.setProperty("--unit", unit + "px");
document.body.style.setProperty("--pixel", unit / 12 + "px");

var B = document.getElementById("BackgroundCanvas");
B.width = unit * 18;
B.height = unit * 12;
var bctx = B.getContext("2d");
var M = document.getElementById("MovementCanvas");
M.width = unit * 18;
M.height = unit * 12;
var mctx = M.getContext("2d");

var frame = 0; // counts every frame
var gameStep = 0; // counts every time we want to animate
var speed = 12; // relates frame to gameStep; speed of animation loop.

var gold = new Image();
gold.src = "images/Gold.png";

//ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
/*
var avatar = {
    img: new Image(),
    coor: [0, 0],
    speed: 24,
    action: 0,
    move: function () {
        // use this.action and this.coor to move
    },
    keyPress: function (event) {

    }
}*/








var avatar = {
    img: new Image(),
    action: 0, // 0-rest 1-left 2-up 3-right 4-down
    dir: 1, // 1-right 0-left
    keys: [0, 0, 0, 0], // [left up right down]
    coor: [5, 5],
    speed: 24, // frames per unit
    init: function () {
        this.img.src = "images/CavemanTileset.png";
    },
    move: function (value) {
        // make him move based on this.action and this.dir
        /*
        if (this.keys[0] == this.keys[1] == this.keys[2] == this.keys[3]) {
            this.action = 0;
        } else {
            for (var i = 0; i < 4; i++) {
                if (this.keys[i]) this.action = i + 1;
            }
        }
        if (this.action == 1 || this.action == 3) {
            this.coor[0] += (this.action - 2) / this.speed;
        } else if (this.action == 2 || this.action == 4) {
            this.coor[1] += (this.action - 3) / this.speed;
        }
        */
        if (this.keys[0] && this.keys[2]) this.action = 0;
        else if (this.keys[0]) {
            this.dir = 0;
            this.action = 1;
        } else if (this.keys[2]) {
            this.dir = 1;
            this.action = 3;
        } else if (this.keys[1]) {
            this.action = 2;
        } else if (this.keys[3]) {
            this.action = 4;
        } else this.action = 0;
        if (this.keys[1]) this.action = 2;
        if (this.action == 1 || this.action == 3) {
            this.coor[0] += (this.dir * 2 - 1) / this.speed;
        } else if (this.action == 2 || this.action == 4) {
            this.coor[1] += (this.action - 3) / this.speed;
        }
        mctx.drawImage(this.img, 96 * (value % 4), 96 * this.dir, 96, 96, unit * this.coor[0], unit * this.coor[1], unit, unit);
    },
    keyPress: function (num, value) {
        if (num >= 0 && num < 4) this.keys[num] = value;
        //if (num == -5) this.keys[1] = value; // space button for up
    }
}
document.addEventListener("keydown", function (event) {
    avatar.keyPress(event.keyCode - 37, 1);
    //alert(event.keyCode);
});
document.addEventListener("keyup", function (event) {
    avatar.keyPress(event.keyCode - 37, 0);
});
avatar.init();

var map = {
    levels: [],
    currentLevel: 0,
    inPlay: false,
    draw: function () {
        var array = this.levels[this.currentLevel];
        for (var y = 0; y < array.length; y++) {
            for (var x = 0; x < array[0].length; x++) {
                switch (array[y][x]) {
                    case 0:
                        break;
                    case 1:
                        console.log(x, y);
                        bctx.drawImage(gold, 0, 0, 96, 96, unit * x, unit * y, unit, unit);
                        break;
                    case 2:
                        avatar.coor = [x, y];
                        break;
                }
            }
        }
    },
    addLevel: function (array) {
        this.levels.push(array);
    },
    endLevel: function () {
        bctx.clearRect(0, 0, this.levels[this.currentLevel][0].length, this.levels[this.currentLevel].length);
        this.inPlay = false;
    },
    startLevel: function (index) {
        this.currentLevel = index;
        this.draw();
        this.inPlay = true;
    }
}

map.addLevel([
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
]);

function animate() {
    frame++;
    mctx.clearRect(0, 0, unit * 18, unit * 12);
    avatar.move(gameStep);
    if (!(frame % speed)) {
        gameStep++;
    }
    requestAnimationFrame(animate);
}

avatar.img.onload = function () {
    animate();
    map.startLevel(0);
}