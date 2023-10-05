var rows = 50;
var cols = 100;

var isPlaying = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var generationSpeed = 100;

function initializeComponents() {
    createGameTable();
    setButtonActions();
}

function createGameTable() {
    var gameContainer = $("#gameContainer");
    if (!gameContainer) {
        alert("Cannot create table. gameContainer div does not exist!");
    }
    var table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var gridCell = document.createElement("td");
            gridCell.setAttribute("id", i + "-" + j);
            gridCell.setAttribute("class", "dead");
            gridCell.onclick = setCellState;
            tr.appendChild(gridCell);
        }
        table.appendChild(tr);
    }
    gameContainer.append(table);
}

function setCellState() {
    var rowCol = this.id.split("-");
    var row = rowCol[0];
    var col = rowCol[1];

    var cellClass = this.getAttribute("class");
    if (cellClass.indexOf("alive") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "alive");
        grid[row][col] = 1;
    }
}

function setButtonActions() {
    var startButton = document.getElementById('start');
    startButton.onclick = startTheGame;
}

function startTheGame() {

    if (!isPlaying) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                startNeighborGeneration(i, j);
            }
        }

        timer = setTimeout(startTheGame, generationSpeed);

        isPlaying = true;
    }
}

function startNeighborGeneration(row, col) {
    $.ajax({
        url: 'api/GameOfLife/StartGame',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: { row: row, col: col, rows: rows, columns: cols},
        success: function (result) {
            grid = result;
            refreshGrid();
        },
    });

    isPlaying = false;
}

function refreshGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var gridCell = document.getElementById(i + "-" + j);
            if (grid[i][j] == 0) {
                gridCell.setAttribute("class", "dead");
            } else {
                gridCell.setAttribute("class", "alive");
            }
        }
    }
}

window.onload = initializeComponents;