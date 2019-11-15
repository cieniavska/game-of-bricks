let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;

const brickWidth = 80;
const brickHeight = 20;
const brickGap = 2;
const brickCols = 10;
const brickRows = 14;
let brickGrid = new Array(brickCols * brickRows);
let bricksLeft = 0;

const paddleWidth = 100;
const paddleThickness = 10;
const paddleDistfromEdge = 60;
let paddleX = 400;

let mouseX = 0;
let mouseY = 0;

function updateMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;

    mouseX = e.clientX - rect.left - root.scrollLeft;
    mouseY = e.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - paddleWidth / 2;
}

function brickReset() {
    bricksLeft = 0;
    for (let i = 0; i < brickCols * brickRows; i++) {
        brickGrid[i] = true;
        bricksLeft++;
    } // end of for each brick
}   // end of brickReset function

window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    const framesPerSecond = 30;
    this.setInterval(updateAll, 1000 / framesPerSecond);

    canvas.addEventListener("mousemove", updateMousePos);

    brickReset();
    ballReset();
}
function updateAll() {
    drawAll();
    moveAll();
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) { //left 
        ballSpeedX *= -1;
    }

    if (ballX > canvas.width) { //right
        ballSpeedX *= -1;
    }

    if (ballY < 0) { // top
        ballSpeedY *= -1;
    }

    if (ballY > canvas.height) { //botom 
        ballReset();
    }
}

function ballBrickHandling() {
    let ballBrickCol = Math.floor(ballX / brickWidth);
    let ballBrickRow = Math.floor(ballY / brickHeight);
    let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if (ballBrickCol >= 0 && ballBrickCol < brickCols &&
        ballBrickRow >= 0 && ballBrickRow < brickRows) {

        if (brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;

            let prevBallX = ballX - ballSpeedX;
            let prevBallY = ballY - ballSpeedY;

            let prevBrickCol = Math.floor(prevBallX / brickWidth);
            let prevBrickRow = Math.floor(prevBallY / brickHeight);

            let bothTestsFailed = true;
            if (prevBrickCol != ballBrickCol) {
                let adjBrickSide = rowColToArrayIndex(prevBrickCol,ballBrickRow);
                if (brickGrid[adjBrickSide] == false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }

            if (prevBrickRow != ballBrickRow) {
                let adjBrickTopBot = rowColToArrayIndex(ballBrickCol,prevBrickRow);
                if (brickGrid[adjBrickTopBot] == false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;

            }
        }
    }
}

function ballPaddleHandling() {
    let paddleTopEdgeY = canvas.height - paddleDistfromEdge;
    let paddleBottomEdgeY = paddleTopEdgeY + paddleThickness;

    let paddleLeftEdgeX = paddleX;
    let paddleRightEdgeX = paddleLeftEdgeX + paddleWidth;

    if (ballY > paddleTopEdgeY && //  below the top of paddle
        ballY < paddleBottomEdgeY && // above the bottom of paddle 
        ballX > paddleLeftEdgeX && // right of the left side of paddle
        ballX < paddleRightEdgeX) { // left of the right side of paddle

        ballSpeedY *= -1;

        let centerOfPaddleX = paddleX + paddleWidth / 2;
        let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * .35;
    }
}

function moveAll() {

    ballMove();
    ballBrickHandling();
    ballPaddleHandling();
}

function rowColToArrayIndex(col, row) {
    return col + brickCols * row;
}

function drawBricks() {
    for (let eachRow = 0; eachRow < brickRows; eachRow++) {
        for (let eachCol = 0; eachCol < brickCols; eachCol++) {

            let arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if (brickGrid[arrayIndex]) {
                colorRect(brickWidth * eachCol, brickHeight * eachRow, brickWidth - brickGap, brickHeight - brickGap, "grey");
            } // end of is this brick here
        } // end of for each brick
    } // end of for each row
} // end of drawBrick function

function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, "black"); //clear screen
    colorCircle(ballX, ballY, 10, "white"); // draw ball
    colorRect(paddleX, canvas.height - paddleDistfromEdge, paddleWidth, paddleThickness, "white");

    drawBricks();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}