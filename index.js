const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');

const downghost = document.getElementById("down");
const upghost = document.getElementById("up");
const leftghost = document.getElementById("left");
const rightghost = document.getElementById("right");
const scaredghost = document.getElementById("scared");
const scaredghostwhite = document.getElementById("scaredwhite");

//Mapa do jogo é uma matriz. Confira a função drawMaze()
const maze = [
    [9,9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,9,9,9],
    [1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,1,1],
    [1,5, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,0,5,1],
    [1,0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0,1,0,1],
    [1,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,1],
    [1,0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0,1,0,1],
    [1,0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,0,0,1],
    [1,1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,1,1,1],
    [9,9, 1, 0, 0, 1, 9, 9, 9, 1, 0, 0,1,9,9],
    [9,9, 1, 0, 0, 1, 2, 9, 2, 1, 0, 0,1,9,9],
    [1,1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0,1,1,1],
    [0,0, 0, 0, 0, 0, 7, 6, 9, 0, 0, 0,0,0,0],
    [1,1, 1, 0, 1, 0, 9, 9, 9, 0, 1, 0,1,1,1],
    [9,9, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0,1,9,9],
    [9,9, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0,1,9,9],
    [1,1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,1,1,1],
    [1,0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,0,0,1],
    [1,0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1,1,0,1],
    [1,0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0,0,0,1],
    [1,0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1,0,0,1],
    [1,0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1,1,0,1],
    [1,5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,5,1],
    [1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,1,1],
    [9,9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,9,9,9],
];


// Set width and heights
canvas.height = body.clientHeight/1.345;

// CUIDADO: alteração desses valores pode resultar em bugs
const BLOCKSHEIGHT = maze.length;
const BLOCKSWIDTH = maze[0].length;

let WALLSIZE = (canvas.height)/BLOCKSHEIGHT;

// canvas.height = WALLSIZE * BLOCKSHEIGHT;
canvas.width = WALLSIZE * BLOCKSWIDTH;



const TIMETOBEGINFOLLOW = 500;
const POWERTIME = 200;

//Pacman is an arc
const PACSIZE =  WALLSIZE/2 - 2;
const PACVEL = 15;
const PACCOLOR =  '#ffcc00';

//Ghost is an image
const GHOSTSIZE = WALLSIZE ;


const NUMPPTS = 4 //getQuantityFromMaze(5);
const NUMPTS = getQuantityFromMaze(0);



let pause = true;
//preventpause em ocasiões onde o player não pode des-pausar
let preventpause = false;


//Generic helpers

function getQuantityFromMaze(n){
    let count=0;
    maze.forEach((row, i) => {
        row.forEach((column, j) => {
            if (maze[i][j] === n) count++;
        });
    })
    return count;
}

function randomIntFromRange(min,max){
    return Math.floor(Math.random()*(max-min+1) + min);
}

function writeTextCanvas(text, x, y, color, size){
    ctx.font = `${size}px Verdana`;
    ctx.fillStyle = color;
    ctx.fillText(`${text}`, x, y); 
}



//Helper functions in updates

function touchPacman(ghost) {

    if (pacman.y + pacman.radius >= ghost.y &&
        pacman.y - pacman.radius <= ghost.y + ghost.size &&
        pacman.x - pacman.radius <= ghost.x + ghost.size &&
        pacman.x + pacman.radius >= ghost.x){
            return true;
        }
    return false;
}

function touchPoint(point){
    //Return true if coordinates are the same
    if (pacman.gridL === point.gridL && pacman.gridC === point.gridC ){
        return true;
    }
    return false;


}

function drawMaze() {
    
    //Cria o mapa GUI de acordo com os números do maze

    //0: Point
    //1: Wall
    //2: Ghost
    //5: Power Point
    //6: Pacman
    //7: Texto ('Ready')
    //Resto: blank

    maze.forEach((row, rowindex) => {
      row.forEach((cell, colindex) => {

        let width = WALLSIZE;
        let height = WALLSIZE;

        let x = (canvas.width/2 - (width*BLOCKSWIDTH/2)) + width * colindex;
        let y = (canvas.height)/2 - (width*BLOCKSHEIGHT/2) + height * rowindex;

        if (cell === 1) {
            walls.push(new Wall(x, y, width, height));
        } else if (cell === 0){
            //diferenças entre numpts e NUMPTS garante que quando morto, o jogo reinicie com os pontos no mapa salvos.

            //No início da rodada, numpts === NUMPTS
            //Os pontos vão diminuindo na medida que a array 'points' vai diminuindo

            // if(numpts <= NUMPTS){
            //     points.push(new Point(x, y, rowindex, colindex));
            //     numpts++;
            // }
        } else if (cell === 5){
            if(numppts <= NUMPPTS){
                powerpoints.push(new PowerPoint(x, y, rowindex, colindex));
                numppts++;
            }
        } else if (cell === 6){
            pacman = new Pacman(Math.round(x + WALLSIZE/2), y + WALLSIZE/2, PACSIZE, WALLSIZE, rowindex, colindex);
        } else if (cell === 2){
            ghosts.push(new Ghost(
                x, y, GHOSTSIZE, WALLSIZE,
                {
                    up: upghost,
                    down: downghost,
                    left: leftghost,
                    right: rightghost,
                }, rowindex, colindex
            ))
        } else if (cell === 7){
            text = {x: x+Math.floor(WALLSIZE/3), y: y-Math.floor(WALLSIZE/3)};
        }

      });
    });
}


// Initialization
let walls;

//diferenças entre numpts e NUMPTS garante que quando morto, o jogo reinicie com os pontos no mapa salvos.

//Os pontos vão diminuindo na medida que a array 'points' vai diminuindo
//E como drawMaze() só coloca pontos no mapa se numpts <= NUMPTS, o init() não vai dezenhar novos pontos porque numpts é > que NUMPTS
let points = [];
let numpts = 0;
// por que noteatedpoints ao invés de points.length? Para o programa ficar mais leve 
let noteatedpoints = NUMPTS;

let powerpoints = [];
let numppts = 0;
let noteatedpowerpoints = NUMPPTS;


let pacman;
let ghosts;

//time to powertime
let ttpt = 0;
let powertime = false;


let score = 0;
let numlifes = 3;
//array lifes para desenhar os pacman no canto inferior
let lifes = [];

//Display do "Ready!" apenas
let text;

//Winround para iniciar a animação do muro piscando
let winround = false;
//blinkwalls para armazenar cada ++
let blinkwalls = 0;
//total de blinks
let blinks = 0;


//Restart functions
function restartAfterDie(){
    init();
    update(); 
}

function restartNewRound(){
    preventpause = true;
    winround = true;
    ghosts = [];    
    pacman.draw();
    if(blinks >= 4) {
        pause=true;

        points = [];
        numpts = 0;
        noteatedpoints = NUMPTS;

        powerpoints = [];
        numppts = 0;
        noteatedpowerpoints = NUMPPTS;

        init();
        update();
    };
    if(blinkwalls === 60) blinks ++;
    blinkwalls ++;
}

function restartAll(){
    numlifes = 3;
    score = 0;
    points = [];
    numpts = 0;
    noteatedpoints = NUMPTS;

    points = [];
    powerpoints = [];
    numppts = 0;
    noteatedpowerpoints = NUMPPTS;

    init();
    update();    
}

function init(){
    walls = [];

    ghosts = [];
    pacman=undefined;
    lifes = [];

    powertime = false;
    ttpt = 0;

    blinks = 0;
    blinkwalls = 0;
    
    preventpause = false;

    //mapa GUI
    drawMaze();

    //Desenho de pacman marcando vida
    for(let i = 0; i<numlifes; i++){
        lifes.push(new Pacman(10 + (i*20), canvas.height - (WALLSIZE/2.5), PACSIZE/2, undefined, undefined, undefined))
    }

    //Cria coordenadas de 'Goal' iniciais aleatórias
    ghosts.forEach(ghost => {
        let x = randomCoordinates();
        ghost.updatePath(x[0], x[1]);
    })
}

function update(){
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    //Se completou o mapa
    if (noteatedpoints + noteatedpowerpoints === 0){
        restartNewRound();
    } else {
        pacman.update();
    }

    //Se powertime: retransform() cada ghost quando acaba
    if(powertime){
        ttpt++;
        if (ttpt >= POWERTIME){
            powertime = false;
            ttpt = 0;
            ghosts.forEach(ghost => {
                if(!ghost.returning) ghost.retransform(pacman.gridL, pacman.gridC);
            });
        };
    };


    //WALLS
    walls.forEach(wall => {
        //Animação de blinks
        if(winround){
            if(blinkwalls >= 80){
                wall.draw('white');
            } else {
                wall.draw('blue');
            }
            if(blinkwalls >= 100) blinkwalls = 60;
        } 
        else wall.draw('blue')
    });


    //PAUSADO
    if(pause){
        writeTextCanvas('Ready!', text.x, text.y, 'yellow', WALLSIZE/1.4);   
    }

    //SCORE
    writeTextCanvas(score, 0, WALLSIZE, 'yellow', WALLSIZE/2.5);

    //LIFES
    for(let i=0;i<numlifes;i++) lifes[i].draw();
    
    
    //POINTS: se comido, desaparece, incrementa score e diminui noteatedpoints
    points.forEach((pt, ptindex) => {
        pt.draw();
        if (touchPoint(pt)){
            points.splice(ptindex, 1);
            noteatedpoints--;
            score+=10;
        };
    })

    //POWERPOINTS: powertime=true, retrosform() cada ghost
    powerpoints.forEach((ppt, pptindex) =>{
        ppt.draw();

        if (touchPoint(ppt)){
            powertime = true;
            ttpt = 0;
            ghosts.forEach(ghost => {
                let c = randomCoordinates();
                ghost.retransform(c[0], c[1], scared=true);
            });
            noteatedpowerpoints--;
            powerpoints.splice(pptindex, 1);
        };
    });

    //GHOST: se touchPacman(), volta pra casa OU game over. 
    ghosts.forEach((ghost) => {
        if(touchPacman(ghost) && !ghost.returning){
            if(ghost.scared){
                pause=true;

                writeTextCanvas(200, ghost.x, ghost.y, 'white', WALLSIZE/2.5);
                score+=200;  

                setTimeout(() => {
                    pause = false;
                    ghost.retransform(ghost.initialL, ghost.initialC, false, true);
                    update();
                }, 1500);

            } else {
                pause = true;
                preventpause = true;
                numlifes--;

                setTimeout(() => {
                    if(numlifes <= 0){
                        alert('You loose')
                        restartAll()
                    } else {
                        restartAfterDie();
                    }

                }, 2000);
            };
        };
        ghost.update();    
    });

    
    
    if(!pause){   
        requestAnimationFrame(update);
    };
}

restartAll();