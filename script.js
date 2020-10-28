// Javscript!

var unit = Math.floor(window.innerWidth / 120) * 6;
document.body.style.setProperty("--unit", unit + "px");
document.body.style.setProperty("--pixel", unit / 12 + "px");

var B = document.getElementById("BackgroundCanvas");
var bctx = B.getContext("2d");
var M = document.getElementById("MovementCanvas");
var mctx = M.getContext("2d");

var frame = 0; // counts every frame
var gameStep = 0; // counts every time we want to animate
var speed = 12; // relates frame to gameStep; speed of animation loop.

var gold = new Image();
gold.src = "images/Gold.png";

//ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)

var avatar = {
    img: new Image(),
    action: 0, // 0-vibe 1-left 2-up 3-right 4-down
    dir: 1, // 1-right 0-left
    keys: [0, 0, 0, 0], // [left up right down]
    coor: [1, 11],
    speed: 24, // frames per unit
    moving: false, // so he only can move if he's moved a whole unit
    distance: 0, // how much of the unit he's moved
    init: function () {
        this.img.src = "images/CavemanTileset.png";
    },
    draw: function () {
        mctx.drawImage(this.img, 96 * (gameStep % 4), 96 * this.dir, 96, 96, unit * this.coor[0], unit * this.coor[1], unit, unit);
    },
    move: function () {
        // below statement is for checking direction
        if (!this.moving) {
            this.coor[0] = Math.round(this.coor[0]);
            this.coor[1] = Math.round(this.coor[1]);
            if (this.keys.reduce((f, r) => f + r, 0) !== 1) {
                this.action = 0; // if (not exactly 1 key is pressed)
            } else if (this.keys[0]) {

                // HERE WE WRAP THE BELOW CODE IN IF STATEMENTS THAT
                // WON'T ALLOW THE AVATAR TO MOVE OFF SCREEN OR INTO BLOCKS.

                if (this.coor[0] > 0) { // so it doesn't throw errors when we try to access -1 index
                    if (map.levels[map.currentLevel][this.coor[1]][this.coor[0] - 1] == 0) {
                        this.dir = 0; // I need 'dir' because I only have two animations
                        this.action = 1;
                        this.moving = true;
                    }
                }

                // Do the same (physics logic) for the next 3 directions.

            } else if (this.keys[2]) {
                if (this.coor[0] < map.width - 1) { // so it doesn't throw errors when we try to access non-existent index
                    if (map.levels[map.currentLevel][this.coor[1]][this.coor[0] + 1] == 0) {
                        this.dir = 1;
                        this.action = 3;
                        this.moving = true;
                    }
                }
            } else if (this.keys[1]) {
                this.action = 2;
                this.moving = true;
            } else if (this.keys[3]) {
                this.action = 4;
                this.moving = true;
            }
        }
        // below statements are to make the character actually move
        if (this.action == 1 || this.action == 3) {
            this.coor[0] += (this.dir * 2 - 1) / this.speed;
            this.distance++;
        } else if (this.action == 2 || this.action == 4) {
            this.coor[1] += (this.action - 3) / this.speed;
            this.distance++;
        }
        // below statement is for
        if (this.distance == this.speed) {
            this.moving = false;
            // below code is to make sure he ends exactly on a unit.
            // Not required unless you see problems with him being off-grid.
            this.coor[0] = Math.round(this.coor[0]);
            this.coor[1] = Math.round(this.coor[1]);
            this.distance = 0;
        }
        this.draw();
    },
    keyPress: function (num, value) {
        if (num >= 0 && num < 4) this.keys[num] = value;
        if (num == -5) this.keys[1] = value;
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
    width: 20,
    height: 9,
    levels: [],
    currentLevel: 0,
    inPlay: false,
    draw: function () {
        var array = this.levels[this.currentLevel];
        // loop through every value of the level
        for (var y = 0; y < array.length; y++) {
            for (var x = 0; x < array[0].length; x++) {
                // do something for each different value
                switch (array[y][x]) { // switch == fancy if statement XD
                    case 0:
                        break;
                    case 1:
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
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
]);

function animate() {
    frame++;
    mctx.clearRect(0, 0, unit * map.width, unit * map.height);
    avatar.move(); // decided not to pass 'gameStep' since it's global anyway.
    if (!(frame % speed)) {
        gameStep++;
    }
    requestAnimationFrame(animate);
}

avatar.img.onload = function () {
    B.width = unit * map.width;
    B.height = unit * map.height;
    M.width = unit * map.width;
    M.height = unit * map.height;
    animate();
    map.startLevel(0);
}