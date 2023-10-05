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
        $("#" + this.id).attr("data-status", 0);
    } else {
        this.setAttribute("class", "alive");
        $("#" + this.id).attr("data-status", 1);
    }
}

function setButtonActions() {
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonAction;
}

function startButtonAction() {
    if (isPlaying) {
        isPlaying = false;
        clearTimeout(timer);
    } else {
        isPlaying = true;
        playTheGame();
    }
}

function playTheGame() {
    startGeneration();

    if (isPlaying) {
        timer = setTimeout(playTheGame, reproductionTime);
    }
}

function startGeneration() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            startNeighborGeneration(i, j);
        }
    }

    refreshGrid();
}

function startNeighborGeneration(row, col) {
    $.ajax({
        url: 'api/GameOfLife/StartGame',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: { row: row, col: col, rows: rows, columns: cols},
        success: function (result) {
            var neighborsCount = result;
            if ($("#"+ row + "-" + col).data("status") == 1) {
                if (neighborsCount < 2) {
                    $("#" + row + "-" + col).data("status", 0);
                } else if (neighborsCount == 2 || neighborsCount == 3) {
                    $("#" + row + "-" + col).data("status", 1);
                } else if (neighborsCount > 3) {
                    $("#" + row + "-" + col).data("status", 0);
                }
            } else if ($("#" + row + "-" + col).data("status") == 0) {
                if (neighborsCount == 3) {
                    $("#" + row + "-" + col).data("status", 1);
                }
            }
        },
    });
}

function refreshGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var gridCell = document.getElementById(i + "-" + j);
            if ($("#" + i + "-" + j).data("status") == 0) {
                gridCell.setAttribute("class", "dead");
            } else {
                gridCell.setAttribute("class", "alive");
            }
        }
    }
}

window.onload = initializeComponents;