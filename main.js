// Sources/Citation: Erik Onarheim, Hopson, Numberphile, The Coding Train
// Jin Byoun, HW 2

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Plug in getRandomInt(2) for the isAlive paramter when creating new Cells for a random experience
function Cell(isAlive, x, y, neighbors) {
    this.isAlive = isAlive;  
    this.x = x;
    this.y = y;
    this.neighbors = neighbors;
};

// draws the cells
function draw(squareSize, squareNumber) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, squareNumber * squareSize, squareNumber * squareSize);
    for (var i = 0; i < squareNumber; i++) {
        for (var j = 0; j < squareNumber; j++) {
            if (grid[i][j].isAlive === 1) { // draw rectangles black if alive
                ctx.fillStyle = 'black';
                ctx.fillRect(i * squareSize,j * squareSize, squareSize, squareSize);
            } else {
                ctx.fillStyle = 'white';
                ctx.fillRect(i * squareSize,j * squareSize, squareSize, squareSize);
            }
        }
    }

    // draws the lines of squares
    ctx.fillStyle = 'yellow';
    for (var i = 0; i < squareNumber; i++) { // draw along rows
        ctx.beginPath();
        ctx.moveTo(0, i * squareSize);
        ctx.lineTo(squareNumber * squareSize, i * squareSize);
        ctx.stroke();
    }
    
    for (var i = 0; i < squareNumber; i++) { // draw along columns
        ctx.beginPath();
        ctx.moveTo(i * squareSize, 0);
        ctx.lineTo(i * squareSize, squareNumber * squareSize);
        ctx.stroke();   
    }
    
}

function update(squareSize, squareNumber) {
    
    for (var i = 0; i < squareNumber; i++) { // i is column
        for (var j = 0; j < squareNumber; j++) { // j is row
            grid[i][j].neighbors = 0;
            grid2[i][j].neighbors = 0;
            // checking each neighbor with specific edge case to not go out of array
            if (i - 1 >= 0 && j - 1 >= 0) { // upper left
                if (grid[i - 1][j - 1].isAlive === 1) { // counts neighbors
                    grid[i][j].neighbors++;
                } 
            }
            if (j - 1 >= 0) { // top
                if (grid[i][j - 1].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 
            if (i + 1 < squareNumber && j - 1 >= 0) { // upper right
                if (grid[i + 1][j - 1].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 
            if (i - 1 >= 0) { // left
                if (grid[i - 1][j].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 
            if (i + 1 < squareNumber) { // right
                if (grid[i + 1][j].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 
            if (i - 1 >= 0 && j + 1 < squareNumber) { // bottom left
                if (grid[i - 1][j + 1].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 
            if (j + 1 < squareNumber) { // bottom 
                if (grid[i][j + 1].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 
            if (j + 1 < squareNumber && i + 1 < squareNumber) { // bottom right
                if (grid[i + 1][j + 1].isAlive === 1) {
                    grid[i][j].neighbors++;
                } 
            } 

            // Game of Life rules
            if (grid[i][j].neighbors > 3 && grid[i][j].isAlive === 1 || grid[i][j].neighbors < 2 && grid[i][j].isAlive === 1) { // if neighbors more than 3 or less than 2 die
                grid2[i][j].isAlive = 0;
            } else if (grid[i][j].neighbors === 3 && grid[i][j].isAlive === 0 || grid[i][j].neighbors === 3 && grid[i][j].isAlive === 1 || grid[i][j].neighbors === 2 && grid[i][j].isAlive === 1) { // if neighbors is three live
                grid2[i][j].isAlive = 1;
            } 
        }
    }

    // copy grid2 into grid1 to draw original
    for (var i = 0; i < squareNumber; i++) {
        for (var j = 0; j < squareNumber; j++) {
            grid[i][j] = new Cell(grid2[i][j].isAlive, i, j, grid[i][j].neighbors);
        }
    }
    
    
}

// Handle mouse events
function setup(c) {
    var mouseDown = false;
    var handleClick = function(event){
        var x = event.pageX - c.offsetLeft;
        var y = event.pageY - c.offsetTop;
        var i = Math.floor(y / 20);
        var j = Math.floor(x / 20);
        if (grid[j][i].isAlive === 1) {
            grid[j][i].isAlive = 0;
        } else {
            grid[j][i].isAlive = 1;
        }        
        return;
    };

    c.addEventListener('mousedown', function(event){
        mouseDown = true;
        handleClick(event);
        draw(squareSize,squareNumber);
    });

    c.addEventListener('mouseup', function(event){
        mouseDown = false;
    });

    c.addEventListener('keydown', function(event){
        if (event.keyCode === 13) {
            start = true;
            console.log("Starting Game of Life");
        } else if (event.keyCode === 80) {
            start = false;
            console.log("Pausing Game of Life");
        } else if (event.keyCode === 83) { 
            socket.emit("save", { studentname: "Jin Byoun", statename: "Grid", data: grid});
            console.log("saved");
        } else if (event.keyCode === 76) {
            socket.emit("load", { studentname: "Jin Byoun", statename: "Grid"});
            console.log("loaded");
        }
    });

}



// "Main" portion

var socket = io.connect("http://24.16.255.56:8888");

socket.on("load", function (data) {
    for (var i = 0; i < squareNumber; i++) {
        for (var j = 0; j < squareNumber; j++) {
            grid[i][j] = new Cell(data.data[i][j].isAlive, i, j, data.data[i][j].neighbors);
        }
    }
    console.log("drawn after loaded");
    draw(squareSize, squareNumber);
});

var c = document.getElementById("game");
var ctx = c.getContext("2d");
// size of canvas
var viewWidth = c.width = 2000;
var viewHeight = c.height = 2000;
// size of square
var squareSize = 20;
var squareNumber = 100;
    
// setting 2d array of 1d array
var grid = [];
for (var i = 0; i < squareNumber; i++) {
    grid[i] = [];
    for (var j = 0; j < squareNumber; j++) {
        grid[i][j] = new Cell(0, i, j, 0);
    }
}

// refactor to create the arrays by number of cells we want

// Creating second grid to copy off of
var grid2 = [];
for (var i = 0; i < squareNumber; i++) {
    grid2[i] = [];
    for (var j = 0; j < squareNumber; j++) {
        grid2[i][j] = new Cell(0, i, j, 0);
    }
}

// State/Pattern examples
// Glider
grid[2][2].isAlive = 1;
grid[3][3].isAlive = 1;
grid[1][4].isAlive = 1;
grid[2][4].isAlive = 1;
grid[3][4].isAlive = 1;

// Block
grid[8][2].isAlive = 1;
grid[9][2].isAlive = 1;
grid[8][3].isAlive = 1;
grid[9][3].isAlive = 1;

// Blinker
grid[12][2].isAlive = 1;
grid[13][2].isAlive = 1;
grid[14][2].isAlive = 1;

// Lightweight Space Ship
grid[70][30].isAlive = 1;
grid[71][30].isAlive = 1;
grid[72][30].isAlive = 1;
grid[70][31].isAlive = 1;
grid[71][32].isAlive = 1;

var start = false;
draw(squareSize,squareNumber);
setup(c);

setInterval(function(){
    if (start === true) {
        update(squareSize, squareNumber);
        draw(squareSize, squareNumber);
    }   
}, 60);




