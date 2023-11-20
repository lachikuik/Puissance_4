let numberRow = 7;
let numberColumns = 6;
let maxTurn = numberRow*numberColumns;
let search;
let player1 = "orange";
let player2 = "purple";
let turn = 1; 
let board = document.getElementById("board");
let title = document.getElementById("title");
let error = document.getElementById("error");
let player = player1;
let victory = {name : "", value : false};
let score1 = 0;
let score2 = 0;
document.getElementById("score1").innerHTML = `${player1} : ${score1}`;
document.getElementById("score2").innerHTML = `${player2} : ${score2}`;
const history = [];
let undoButton = document.getElementById("undo");


function tableCreate() {
    renderBoardTable = document.createElement('table');
    for (let i = 0; i < numberRow; i++) {
        let tr = renderBoardTable.insertRow();
        tr.id =  "R"+i;
        for (let j = 0; j < numberColumns; j++) {
            let td = tr.insertCell();
            td.id = "R"+i+"C"+j;
            td.appendChild(document.createTextNode(`y = ${i}/ x = ${j}`));
            td.style.border = '1px solid black';
        }
    }
    title.innerText = `Tour du joueur ${player1}, tour ${turn}.`
    board.appendChild(renderBoardTable);
  }

  newGame();

  function newGame(){
    tableCreate();
    createEvent();
}

function createEvent(){
    for (let i=0; i < numberRow; i++){
        for (let j=0; j<numberColumns; j++){
            let caseElt = document.getElementById("R"+i+"C"+j);
            caseElt.addEventListener('click',clickEvent);
        };
    };
}

function checkBot(id){
    let columnPick = Number(id.charAt(3));
    let rowPick = Number (id.charAt(1));
    let play = document.getElementById(id);
    if (rowPick < numberRow - 1){
        rowPick++ ;
        cell = document.getElementById(`R${rowPick}C${columnPick}`);
        id = cell.id;
        checkBot(id);
    } else if (rowPick === numberRow - 1 && play.style.backgroundColor != player1 && play.style.backgroundColor != player2){
        play.style.backgroundColor = player;   
        checkWin(id); 
    } else {
        color(id);
    }
}

function color(id){
    let columnPick = Number(id.charAt(3));
    let rowPick = Number (id.charAt(1));
    let play = document.getElementById(id);
    if (play.style.backgroundColor != player1 && play.style.backgroundColor != player2){
        play.style.backgroundColor = player;  
        checkWin(id);
    } else {
        if (rowPick > 0){
            rowPick-- ;
            let cell = document.getElementById(`R${rowPick}C${columnPick}`);
            id = cell.id;
            color(id);
        } else {
            turn --;
            error.innerHTML = "Choisissez une colonne non remplie";
        }
    }
}

function checkDirection(id, goToFirstJeton, goToNextJeton) {
    let countLine = 0;
    let columnPick = Number(id.charAt(3));
    let rowPick = Number (id.charAt(1));
    if (columnPick < numberColumns && rowPick < numberRow){
        let cell = document.getElementById(`R${rowPick}C${columnPick}`);
        let coord = goToFirstJeton(columnPick, rowPick);
        rowPick = coord.rowPick;
        columnPick = coord.columnPick;
        nextCell = document.getElementById(`R${rowPick}C${columnPick}`);
        if (nextCell != null && nextCell.style.backgroundColor === player){
            return checkDirection(nextCell.id, goToFirstJeton, goToNextJeton);
        } else {
            let coord = goToNextJeton(columnPick, rowPick);
            rowPick = coord.rowPick;
            columnPick = coord.columnPick;
            while (columnPick <= numberColumns && rowPick <= numberRow){
                if (countLine === 4) {
                    return countLine;
                }
                cell = document.getElementById(`R${rowPick}C${columnPick}`);
                if (cell != null){
                    if (cell.style.backgroundColor === player){
                        let coord = goToNextJeton(columnPick, rowPick);
                        rowPick = coord.rowPick;
                        columnPick = coord.columnPick;
                        countLine++;
                    } else {
                        return countLine;
                    }  
                } else {
                    return countLine;
                }   
            }  
        }
    }
}

function checkWin(id){
    history.push(id);
    let line = checkDirection(id,
        (columnPick, rowPick) => { return { rowPick: rowPick, columnPick: columnPick-1 }; },
        (columnPick, rowPick) => { return { rowPick: rowPick, columnPick: columnPick+1 }; });
    let column = checkDirection(id,
        (columnPick, rowPick) => { return { rowPick: rowPick+1, columnPick: columnPick }; },
        (columnPick, rowPick) => { return { rowPick: rowPick-1, columnPick: columnPick }; });
    let diagonal = checkDirection(id,
        (columnPick, rowPick) => {return { rowPick: rowPick+1, columnPick: columnPick-1 }; },
        (columnPick, rowPick) => {return { rowPick: rowPick-1, columnPick: columnPick+1 }; });
    let antiDiagonal = checkDirection(id,
        (columnPick, rowPick) => {return { rowPick: rowPick-1, columnPick: columnPick-1 }; },
        (columnPick, rowPick) => {return { rowPick: rowPick+1, columnPick: columnPick+1 }; });
    if (line > 3 || column > 3 || diagonal > 3 || antiDiagonal > 3){
        victory = {name : player, value : true};
    }
    if (victory.value === true){
        window.alert(`Le joueur ${player} l'emporte`)
        if (player === player1){
            score1++
        } else {
            score2++
        }
        document.getElementById("score1").innerHTML = `${player1} : ${score1}`;
        document.getElementById("score2").innerHTML = `${player2} : ${score2}`;
        victory.value = false;
        for (let i = 0; i < numberRow; i++) {
            for (let j = 0; j < numberColumns; j++) {
                let cell = document.getElementById("R"+i+"C"+j);
                cell.style.backgroundColor="";
            }
        }
        turn = 0;
    }
    if (turn === maxTurn){
        window.alert(`Egalité`)
        for (let i = 0; i < numberRow; i++) {
            for (let j = 0; j < numberColumns; j++) {
                let cell = document.getElementById("R"+i+"C"+j);
                cell.style.backgroundColor="";
            }
        }
        turn = 0;
    }
}


function clickEvent(){
    id = this.id;
    checkBot(id);
    turn++ ;
    if (turn % 2 != 0){
        player = player1;
    } else {
        player = player2;
    }
    title.innerText = `Tour du joueur ${player}, tour ${turn}.`;
}

undoButton.onclick = function () {
    let lastEvent = history.slice(-1);
    let lastPlay = document.getElementById(lastEvent);
    lastPlay.style.backgroundColor = "";
    turn--;
    history.pop()
    if (turn % 2 != 0){
        player = player1;
    } else {
        player = player2;
    }
    title.innerText = `Tour du joueur ${player}, tour ${turn}.`;
}
