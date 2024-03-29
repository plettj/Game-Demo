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
var speed = 8; // relates frame to gameStep; speed of animation loop.

//ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)

var avatar = {
    img: new Image(),
    action: 0, // 0-vibe 1-left 2-up 3-right 4-down
    keys: [0, 0, 0, 0], // [left up right down]
    coor: [1, 11],
    speed: 16, // frames per unit
    moving: false, // so he only can move if he's moved a whole unit
    distance: 0, // how much of the unit he's moved
    init: function () {
        this.img.src = "images/Dude Tileseeet.png";
    },
    draw: function () {
        mctx.drawImage(this.img, 96 * (gameStep % 4), 96 * this.action, 96, 96, unit * this.coor[0], unit * this.coor[1], unit, unit);
    },
    move: function () {
        // below statement is for checking direction
        if (!this.moving) {
            this.coor[0] = Math.round(this.coor[0]);
            this.coor[1] = Math.round(this.coor[1]);
            if (this.keys.reduce((f, r) => f + r, 0) !== 1) {
                this.action = 0; // if (not exactly 1 key is pressed)
            } else if (this.keys[0]) {
                if (this.coor[0] > 0) { // so it doesn't throw errors when we try to access -1 index
                    if (map.levels[map.currentLevel][this.coor[1]][this.coor[0] - 1] !== 1) { // collision logic
                        this.action = 1;
                        this.moving = true;
                    }
                }
                // Do the same (physics logic) for the next 3 directions.
            } else if (this.keys[2]) {
                if (this.coor[0] < map.width - 1) {
                    if (map.levels[map.currentLevel][this.coor[1]][this.coor[0] + 1] !== 1) {
                        this.action = 3;
                        this.moving = true;
                    }
                }
            } else if (this.keys[1]) {
                if (this.coor[1] > 0) {
                    if (map.levels[map.currentLevel][this.coor[1] - 1][this.coor[0]] !== 1) {
                        this.action = 2;
                        this.moving = true;
                    }
                }
            } else if (this.keys[3]) {
                if (this.coor[1] < map.height - 1) {
                    if (map.levels[map.currentLevel][this.coor[1] + 1][this.coor[0]] !== 1) {
                        this.action = 4;
                        this.moving = true;
                    }
                }
            }
        }
        // below statements are to make the character actually move
        if (this.action == 1 || this.action == 3) {
            this.coor[0] += (this.action - 2) / this.speed;
            this.distance++;
        } else if (this.action == 2 || this.action == 4) {
            this.coor[1] += (this.action - 3) / this.speed;
            this.distance++;
        }
        this.draw();
        // below statement is for always moving by one unit
        if (this.distance == this.speed) {
            this.moving = false;
            this.action = 0; // need this otherwise bugs happen
            // below code is to make sure he ends exactly on a unit.
            // Not required unless you see problems with him being off-grid.
            this.coor[0] = Math.round(this.coor[0]);
            this.coor[1] = Math.round(this.coor[1]);
            if (map.currentLevel < map.levels.length - 1) {
                if (map.levels[map.currentLevel][this.coor[1]][this.coor[0]] == 3) {
                    map.endLevel();
                    map.startLevel(map.currentLevel + 1);
                }
            }
            this.distance = 0;
        }
    },
    keyPress: function (num, value) {
        if (!map.pause) {
            if (num >= 0 && num < 4) this.keys[num] = value;
            if (num == -5) this.keys[1] = value;
        }
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
    pause: true,
    tiles: new Image(),
    init: function () {
        this.tiles.src = "images/Crap Tileset.png";
    },
    draw: function () {
        var array = this.levels[this.currentLevel];
        // loop through every value of the level
        for (var y = 0; y < array.length; y++) {
            for (var x = 0; x < array[0].length; x++) {
                // do something for each different value
                switch (array[y][x]) { // switch == fancy if statement XD
                    case 0:
                        break;
                    case 1: // block
                        bctx.drawImage(this.tiles, 0, 0, 96, 96, unit * x, unit * y, unit, unit);
                        break;
                    case 2: // avatar location
                        avatar.coor = [x, y];
                        break;
                    case 3: // goal
                        bctx.drawImage(this.tiles, 96, 0, 96, 96, unit * x, unit * y, unit, unit);
                        break;
                    case 4: // left
                    case 5: // up
                    case 6: // right
                    case 7: //down
                        bctx.drawImage(this.tiles, 96 * (array[y][x] - 4), 96, 96, 96, unit * x, unit * y, unit, unit);
                        break;
                }
            }
        }
    },
    addLevel: function (array) {
        this.levels.push(array);
    },
    endLevel: function () {
        bctx.clearRect(0, 0, this.width * unit, this.height * unit);
        avatar.action = 0;
        avatar.moving = false;
        avatar.distance = 0;
        this.pause = true;
    },
    startLevel: function (index) {
        this.currentLevel = index;
        this.draw();
        this.pause = false;
    }
}
map.init();
map.addLevel([
    [1, 6, 0, 7, 1, 0, 0, 0, 0, 4, 1, 6, 0, 7, 1, 6, 0, 0, 0, 7],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 1, 6, 0, 0, 0, 0, 0, 5, 1, 0, 1, 0, 1, 5, 0, 4, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [2, 5, 0, 7, 1, 6, 0, 6, 0, 0, 0, 5, 1, 6, 0, 0, 0, 5, 1, 0],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 7, 0, 4, 1, 0, 1, 0, 1, 6, 0, 7, 0, 5, 1, 0, 0, 4, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [1, 6, 0, 0, 0, 5, 1, 6, 0, 5, 1, 6, 0, 0, 0, 0, 0, 5, 1, 3]
]);
map.addLevel([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 7, 0, 0, 0, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]);
map.addLevel([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]);

var menus = {
    levelMenu: document.getElementById("LevelMenu"),
    levels: document.getElementById("Levels"),
    pauseButton: document.getElementById("Pause"),
    pause: function (level = -1) {
        if (level == -1) { // pause
            this.levelMenu.style.display = "block";
            this.pauseButton.style.display = "none";
            map.pause = true;
        } else { // play
            this.levelMenu.style.display = "none";
            this.pauseButton.style.display = "block";
            console.log(level);
            if (level == map.currentLevel) {
                map.pause = false;
            } else {
                map.endLevel();
                map.startLevel(level);
            }
        }
    }
}
document.addEventListener("click", function (event) {
    if (map.pause) {
        if (event.target !== menus.levelMenu && !menus.levelMenu.contains(event.target)) {
            menus.pause(map.currentLevel);
        } else if (event.target.nodeName == "TD") { // level button
            menus.pause(parseInt(event.target.innerHTML) - 1);
        }
    } else {
        if (event.target == menus.pauseButton) {
            menus.pause();
        }
    }
});

function makeLevelButtons() {
    var row = document.createElement("tr");
    for (var l = 0; l < map.levels.length; l++) {
        var button = document.createElement("td");
        var number = document.createTextNode((l + 1));
        button.appendChild(number);
        row.appendChild(button);
    }
    menus.levels.appendChild(row);
}

function animate() {
    if (!map.pause) {
        frame++;
        mctx.clearRect(0, 0, unit * map.width, unit * map.height);
        avatar.move(); // decided not to pass 'gameStep' since it's global anyway.
        if (!(frame % speed)) {
            gameStep++;
        }
    }
    requestAnimationFrame(animate);
}

map.tiles.onload = function () {
    makeLevelButtons();
    B.width = unit * map.width;
    B.height = unit * map.height;
    M.width = unit * map.width;
    M.height = unit * map.height;
    animate();
    map.startLevel(0);
}