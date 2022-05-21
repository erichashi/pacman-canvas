const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const virtualHeight = 598;
const virtualWidth = 520;
let canvas_width;
let canvas_height;

let gImages = {};
let gSounds = {};
window.onload = () => {

    // Set width and heights
    canvas_width = document.querySelector('main').clientWidth;
    canvas_height = canvas_width * 1.14;

    canvas.width = virtualWidth;
    canvas.height = virtualHeight;

    canvas.style.width = `${canvas_width}px`;
    canvas.style.height = `${canvas_height}px`;


    preload({
        "downghost": "assets/img/ghost/down.png",
        "upghost": "assets/img/ghost/up.png",
        "leftghost": "assets/img/ghost/left.png",
        "rightghost": "assets/img/ghost/right.png",
        "scaredghost": "assets/img/ghost/scared.png",
        "scaredghostwhite": "assets/img/ghost/scaredwhite.png",
        "downpac": "assets/img/pacman/down.png",
        "uppac": "assets/img/pacman/up.png",
        "leftpac": "assets/img/pacman/left.png",
        "rightpac": "assets/img/pacman/right.png",
        "mcpac": "assets/img/pacman/close.png",
        "mazeimg": "assets/img/maze1.png"
    }, {
        "start-music": "assets/audio/start-music.mp3",
        "ambient": "assets/audio/ambient.mp3",
        "ambient-fright": "assets/audio/ambient-fright.mp3",
    } ,() => {
        create();
        update();

    })
}


function preload(imgfiles, audiofiles, callback){
    let val = 0;
    let goal = Object.keys(imgfiles).length + Object.keys(audiofiles).length; 

    Object.keys(imgfiles).forEach(imgkeys => {
        let img = new Image();
        img.src = imgfiles[imgkeys];
        gImages[imgkeys] = img;
        img.onload = () => {
            val++;
            if(val >= goal) callback();
        };
    });

    Object.keys(audiofiles).forEach(audiokeys => {
        let audio = new Audio(audiofiles[audiokeys]);
        gSounds[audiokeys] = audio;
        audio.volume = .3;
        val++;
        if(val >= goal) callback();
    });

}


let pause = true;
let gStateMachine;
let keysPressed = {};

function create(){

    if(!localStorage.getItem('recordpac')) localStorage.setItem('recordpac', 0);
    recordtext.innerHTML = localStorage.getItem('recordpac');

    gStateMachine = new StateMachine({
        'title': () => new TitleState(), //default
        'play': () => new PlayState(),

        'restartnewround': () => new RestartNewRoundState(),
        'restartafterdie': () => new RestartAfterDieState(),

        'killGhost': () => new KillGhostState(), //pequeno pause depois de morrer
        'killPacman': () => new KillPacmanState(), //pequeno pause depois de comer

        'gameover': () => new GameOverState(),

    });
    gStateMachine.change('title');
 
    gSounds['ambient'].loop = true;
    gSounds['ambient-fright'].loop = true;
    
}

function update(){
    ctx.drawImage(gImages['mazeimg'], 0, 0, canvas.width, canvas.height);
    
    gStateMachine.update();
    
    if(!pause) requestAnimationFrame(update);

    keysPressed = {};
}

//start button html
function start(){
    gStateMachine.current.start();
}