/*
 * @Author: liziwei01
 * @Date: 2022-09-20 01:44:14
 * @LastEditors: liziwei01
 * @LastEditTime: 2022-09-20 04:35:11
 * @Description: file content
 */
// import xmlhttprequest from "xmlhttprequest"

const boardSize = 15
const boardWidth = 470
const boardPadding = 25
const chessRadius = 15
const blackChess = "Black"
const whiteChess = "White"
const invalidInput = "Invalid Input"
const backendAddress = "localhost:8888"
const startGameRouter = "/startGame"
const checkWinnerRouter = "/checkWinner"
const getMethod = "GET"
const postMethod = "POST"

var steps = 0

main()

function main() {
	createChessBoard()
	listenChessBoard()
}

function createChessBoard() {
	var chessboard = document.getElementById("chessboard")
	var ctx = chessboard.getContext("2d")

	for(var i = 0; i < boardSize; i++) {
		ctx.moveTo(boardPadding + i * chessRadius * 2, boardPadding)
		ctx.lineTo(boardPadding + i * chessRadius * 2, boardWidth - boardPadding)
		ctx.stroke()
	}

	for(var i = 0; i < boardSize; i++) {
		ctx.moveTo(boardPadding, boardPadding + i * chessRadius*2)
		ctx.lineTo(boardWidth - boardPadding, boardPadding + i * chessRadius * 2)
		ctx.stroke()
	}
}

// listen on chessboard
function listenChessBoard() {
	var chessboard = document.getElementById("chessboard")
	chessboard.addEventListener("click", boardOnClick)
}

// if click happens, check its position and proceed to create a chess
function boardOnClick(event) {
	var event = event || window.event;
	// Distance Between Side Chess and Board Border
	const CBdis = boardPadding - chessRadius

	const pos = {
		x: event.offsetX,
		y: event.offsetY
	}

	const chessPosition = {
		x: Math.floor((pos.x - CBdis) / (chessRadius * 2)), 
		y: Math.floor((pos.y - CBdis) / (chessRadius * 2))
	}
	// outside board
	if (chessPosition.x < 0 || chessPosition.x > 14 || chessPosition.y < 0 || chessPosition.y > 14) {
		return
	}
	createChess(chessPosition)
}

// check whether the click is valid and proceed to draw a chess
function createChess(chessPosition) {
	// send chess position to backend and check if it is valid and if a winner appears
	const winner = checkWinner(chessPosition)
	if (winner == invalidInput) {
		return
	}
	// game ends
	if (winner != undefined) {
		return winnerAppears(winner)
	}
	// if it is valid, draw the chess on board
	steps++
	const chessColor = getChessColor(steps)
	drawChess(chessPosition, chessColor)
	whosTurn(chessColor)
}

function checkWinner(chessPosition) {
	var xml = new XMLHttpRequest()
	xml.open(postMethod, backendAddress + checkWinnerRouter)
	xml.setRequestHeader("Content-Type","text/html;charset=uft-8")
	xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"); 
	xml.send("chessX=" + chessPosition.x + "&chessY=" + chessPosition.y)
}

function winnerAppears(winner) {
	var chessboard = document.getElementById("chessboard")
	var turn = document.getElementById("turn")
	chessboard.removeEventListener("click", boardOnClick)
	turn.innerHTML = "<p id=\"turn\">" + winner + " Win</p>";
}

// check if it is black turn or white turn 
function getChessColor(steps) {
	var idx = steps % 2
	
	if (idx == 0) {
		return whiteChess
	}

	return blackChess
}

// draw a circle on canvas
function drawChess(chessPosition, chessColor) {
	var chessboard = document.getElementById("chessboard")
	var ctx = chessboard.getContext("2d")
	ctx.beginPath()
	ctx.arc(boardPadding + chessPosition.x * chessRadius * 2, boardPadding + chessPosition.y * chessRadius * 2, chessRadius, 0, 2 * Math.PI)
	ctx.closePath()
	ctx.fillStyle = chessColor;
    ctx.fill();
}

// who's turn?
function whosTurn(chessColor) {
	var turn = document.getElementById("turn")
	if (chessColor == blackChess) {
		chessColor = whiteChess
	} else {
		chessColor = blackChess
	}
	turn.innerHTML = "<p id=\"turn\">" + chessColor + " Turn</p>";
}