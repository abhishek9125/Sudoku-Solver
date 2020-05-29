var arr = [[], [], [], [], [], [], [], [], []]
var temp = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {           //Assign ID to each from left to right
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);

    }
}

function initializeTemp(temp) {             // Initialize all cells with false i.e. No value is present
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            temp[i][j] = false;
        }
    }
}


function setTemp(board, temp) {             // Set true for those random cells which contain some value from XMLRequest
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                temp[i][j] = true;
            }
        }
    }
}


function setColor(temp) {                        // Set Red color for those cells which contain some value from XMLRequest
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (temp[i][j] == true) {
                arr[i][j].style.color = "#DC3545";
            }
        }
    }
}

function resetColor() {                         //This function set Green Color for those cells for which we calculate values                   
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

var board = [[], [], [], [], [], [], [], [], []]        //Empty Board with an array containing 9 row arrays 


let button = document.getElementById('generate-sudoku')     
let solve = document.getElementById('solve')

console.log(arr)
function changeBoard(board) {           //Function to change the Board: Making Numbers Appear
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {

                arr[i][j].innerText = board[i][j]
            }

            else
                arr[i][j].innerText = ''
        }
    }
}


button.onclick = function () {              //XMLRequest made
    var xhrRequest = new XMLHttpRequest()
    console.log(xhrRequest);
    xhrRequest.onload = function () {       //XMLRequest function called below
        var response = JSON.parse(xhrRequest.response)  //Stores the board recieved from API call as response
        console.log(response)
        initializeTemp(temp)        //Initialize all cells with False Values(0 Values)
        resetColor()                //Set color of all cells to green

        board = response.board          //Save the board recieved from API Call to board in this file
        setTemp(board, temp)            //Set true values for all those cells which contain some number 
        setColor(temp)                  //Set red colour for those cells which have some values
        changeBoard(board)              //Change value of innerText to generate numbers
    }
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')  // API Call to get random cells for random number generation for sudoku
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    xhrRequest.send()   //Calls the above onload function
}

function isSafe(board,r,c,n){

    for(var i=0;i<9;i++){
        if(board[i][c]==n || board[r][i]==n){       //Check same value across row and column
            return false;
        }
    }
    sx = r - r%3;       //Finds the starting position of respective grids of 3*3
    sy = c - c%3;
    for(var x=sx;x<sx+3;x++){
        for(var y=sy;y<sy+3;y++){
            if(board[x][y]==n){
                return false;
            }
        }
    }
    return true;
}

function solveSudokuHelper(board,r,c){
    if(r==9){
        changeBoard(board);             //Shows the Sudoku will final output result
        return true;
    }
    if(c==9){                           
        return solveSudokuHelper(board,r+1,0);          //Move to next row
    }
    if(board[r][c]!=0){
        return solveSudokuHelper(board,r,c+1);          //Board Position already filled
    }

    for(var i=1;i<=9;i++){
        if(isSafe(board,r,c,i)){                        //Check for all numbers on all cell
            board[r][c] = i;
            var success = solveSudokuHelper(board,r,c+1);
            if(success==true){                          
                return true;
            }
            board[r][c] = 0;
        }
    }
    return false;
}

function solveSudoku(board){
    solveSudokuHelper(board,0,0);
}


solve.onclick = function (){
    solveSudoku(board)
}