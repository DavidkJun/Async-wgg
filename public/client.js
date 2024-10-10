const area = document.getElementById('area');
const columns = 5;
const rows = 6;

let wordGuesses, curRow, curCol;
let keyWord;

async function startGame() {
    document.getElementById('new-word-button').addEventListener('click', async () => {
        keyWord = await getNewWord();
        resetGameBoard();
        resetGameState();
        createGameBoard();
        console.log('Game refreshed with new word:', keyWord);
    });
}

function resetGameBoard() {
    area.innerHTML = '';
}

function resetGameState() {
    curRow = 1;
    curCol = 1;
    wordGuesses = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    };
}

startGame();

async function getNewWord() {
    try {
        const response = await fetch('http://localhost:3000/api/random-word');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const word = await response.text();
        console.log('Random word:', word);
        return word;
    } catch (error) {
        console.error('Failed to fetch random word:', error);
        return null;
    }
}

function createGameBoard() {
    let cellIndex = 1;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell_${cellIndex}`;
            cell.contentEditable = 'true';
            area.appendChild(cell);
            cell.addEventListener('keyup', inputRegister);
            cellIndex++;
        }
    }
}

function letterType(event) {
    const letter = event.key.toUpperCase();
    return new Promise((res, rej) => {
        if (letter.length === 1 && letter.match(/[A-Z]/i)) {
            res([letter, event.target]);
        } else {
            rej('Invalid Letter');
        }
    });
}

function updateGuessPosition() {
    if (curCol < columns) {
        curCol++;
    } else {
        checkLetters(wordGuesses, curRow);
        curRow++;
        curCol = 1;
    }
}

function updateGuess(letter, target) {
    wordGuesses[curRow].push(letter);
    target.innerText = letter;
}

function inputRegister(event) {
    letterType(event)
        .then(([letter, target]) => {
            updateGuess(letter, target);
            updateGuessPosition();
        })
        .catch(error => {
            console.error(error);
        });
}

function checkLetters(obj, curRow) {
    const startIndex = (curRow - 1) * columns + 1;
    let allCorrect = true;
    let wordToCheck = keyWord.split("");

    for (let i = 0; i < columns; i++) {
        const cell = document.getElementById(`cell_${startIndex + i}`);
        if (obj[curRow][i] === wordToCheck[i]) {
            cell.classList.add('correct');
        } else if (keyWord.includes(obj[curRow][i])) {
            cell.classList.add('partial');
            allCorrect = false;
        } else {
            cell.classList.add('none');
            allCorrect = false;
        }
    }

    if (allCorrect) {
        setTimeout(congratulatePlayer, 1000);
    }
}

const congratulatePlayer = () => {
    alert("You Won, Congratulations!!!");
};
