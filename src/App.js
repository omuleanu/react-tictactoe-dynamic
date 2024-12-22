import { useState } from 'react';

function Square({ value, onSquareClick, className }) {
    return <button type="button" className={`square ${className}`}
        onClick={onSquareClick}>
        {value}</button>;
}

function calculateWinner(squares, squaresPerRow) {
    const rowCount = squares.length / squaresPerRow;

    function rangeEqual(indexes) {
        return squares[indexes[0]] && indexes.every(indx => squares[indx] == squares[indexes[0]]);
    }

    for (let i = 0; i < squares.length; i++) {
        const x = i % squaresPerRow;
        const y = i / squaresPerRow;

        const horiz = [i, i + 1, i + 2];
        const vertical = [i, i + squaresPerRow, i + squaresPerRow * 2];
        const diagonalRB = [i, i + squaresPerRow + 1, i + squaresPerRow * 2 + 2];
        const diagonalLB = [i, i + squaresPerRow - 1, i + squaresPerRow * 2 - 2];

        // --- horizontal
        if (x < squaresPerRow - 2 && rangeEqual(horiz)) {
            return horiz;
        }

        // | vertical
        if (y < rowCount - 2 && rangeEqual(vertical)) {
            return vertical;
        }

        // \ diagonal right bottom
        if (x < squaresPerRow - 2 && y < rowCount - 2 && rangeEqual(diagonalRB)) {
            return diagonalRB;
        }

        // / diagonal left bottom
        if (x > 1 && y < rowCount - 2 && rangeEqual(diagonalLB)) {
            return diagonalLB;
        }
    }

    return;
}

function Board({ handleClick, squares, winnerIndexes, squaresPerRow }) {
    const rows = [];
    for (let i = 0; i < squares.length; i += squaresPerRow) {
        rows.push(squares.slice(i, i + squaresPerRow));
    }

    return (<div>
        {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
                {row.map((square, colIndex) => {
                    const squareIndex = rowIndex * squaresPerRow + colIndex;
                    const className = winnerIndexes && winnerIndexes.includes(squareIndex) ? 'greenSquare' : '';

                    return <Square className={className} key={squareIndex} value={square} onSquareClick={() => handleClick(squareIndex)} />
                })}
            </div>
        ))}
    </div>);
}

export default function Game() {
    const [boardHeight, setBoardHeight] = useState(6);
    const [boardWidth, setBoardWidth] = useState(5);
    const marks = ["X", "O", "A"];

    const [markIndex, setMarkIndex] = useState(0);
    const [history, setHistory] = useState([Array(boardHeight * boardWidth).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];
    const [squaresPerRow, setSquaresPerRow] = useState(boardWidth);

    function handleClick(i) {
        if (currentSquares[i] || calculateWinner(currentSquares, squaresPerRow)) return;

        const nextSquares = currentSquares.slice();
        nextSquares[i] = marks[markIndex];

        setMarkIndex(nextMarkIndex());
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);

        setCurrentMove(nextHistory.length - 1);
    }

    function nextMarkIndex() {
        return markIndex < marks.length - 1 ? markIndex + 1 : 0;
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        setMarkIndex(nextMove % marks.length);
    }

    const moves = history.map((_, moveIndex) => {
        let description;
        if (moveIndex > 0) {
            description = 'Go to move #' + moveIndex;
        } else {
            description = 'Go to game start';
        }
        return (            
            <button key={moveIndex} type="button" onClick={() => jumpTo(moveIndex)}>{description}</button>
        );
    });

    const winnerIndexes = calculateWinner(currentSquares, squaresPerRow);
    let status;
    if (winnerIndexes) {
        status = 'You\'re winner: ' + currentSquares[winnerIndexes[0]];
    } else {
        status = 'Next player: ' + marks[markIndex];
    }

    const handleInputChange = (event, setFunc) => {
        const value = event.target.value;
        if (!isNaN(value) && value >= 0) {
            setFunc(Number(value));
        }
    };

    const restart = () => {
        setMarkIndex(0);
        setHistory([Array(boardHeight * boardWidth).fill(null)]);
        setCurrentMove(0);
        setSquaresPerRow(boardWidth);
    };

    return (
        <div className="game">
            <div className="status">{status}</div>
            <div className="game-cont">
                <div className="game-board">
                    <Board winnerIndexes={winnerIndexes} squares={currentSquares} handleClick={handleClick} squaresPerRow={squaresPerRow} />
                </div>
                <div className="game-info">
                    {moves}
                </div>
            </div>
            <div className="settings">
                <label htmlFor="board-height">Board Height</label>
                <input type="number" id="board-height" value={boardHeight} onChange={e => handleInputChange(e, setBoardHeight)} />                
            </div>
            <div className="settings">
                <label htmlFor="board-width">Board Width</label>
                <input type="number" id="board-width" value={boardWidth} onChange={e => handleInputChange(e, setBoardWidth)} />
            </div>

            <div className="settings">
                <button type="button" onClick={restart}> Restart </button>
            </div>
        </div>
    );
}