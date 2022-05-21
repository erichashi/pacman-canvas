//html elements
const gHTMLElements = {
    "startbtn": document.querySelector('.btn'),
    "scoretext": document.getElementById('scoretext'),
    "recordtext": document.getElementById('recordtext'),
    "lifecontainer": document.querySelector('.life-container'),
    "centercontainer": document.querySelector('.center-text-container'),
}

//Mapa do jogo eh uma matriz. Confira a funcao drawMaze()
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    [9, 9, 9, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 9, 9, 9],
    [9, 9, 9, 1, 0, 1, 0, 1, 9, 9, 9, 9, 1, 0, 1, 0, 1, 9, 9, 9],
    [1, 1, 1, 1, 0, 1, 0, 1, 9, 9, 9, 9, 1, 0, 1, 0, 1, 1, 1, 1], 
    [0, 0, 0, 0, 0, 0, 0, 1, 2, 9, 9, 2, 1, 0, 0, 0, 0, 0, 0, 0], 
    [1, 1, 1, 1, 0, 1, 0, 1, 9, 9, 9, 9, 1, 0, 1, 0, 1, 1, 1, 1], 
    [9, 9, 9, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 9, 9, 9],
    [9, 9, 9, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 9, 9, 9],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 5, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 5, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const BLOCKSHEIGHT = maze.length;
const BLOCKSWIDTH = maze[0].length;



//nao alterar
const WALLSIZE = 26;
const GHOSTSIZE = 24; 
const PACSIZE = 24; 
const PACVEL = 16;
const GHOSTVEL = 16;

const TIMETOBEGINFOLLOW = 480; // 8seg
const POWERTIME = 300; // 5seg
const NUMLIFES = 3;

// const NUMPPTS = 4 //getQuantityFromMaze(5);
// const NUMPTS = getQuantityFromMaze(0);
