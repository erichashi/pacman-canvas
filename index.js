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
//preventspace em ocasiões onde o player não pode des-pausar
let preventspace = false;

document.addEventListener('keydown', e =>{
    if(e.keyCode == 32 && !preventspace){
        pause = !pause;
        update();
    } else {
        pacman.keyMove(e.keyCode);
    }
})


document.addEventListener('resize', () => { 
    canvas.height = body.clientHeight/1.345;
    WALLSIZE = (canvas.height)/BLOCKSHEIGHT;
    canvas.width = WALLSIZE * BLOCKSWIDTH;
    // update();
})


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

//Helper functions for ghosts

//http://gregtrowbridge.com/a-basic-pathfinding-algorithm/
function findShortestPath(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];
  
    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    var location = {
      distanceFromTop: distanceFromTop,
      distanceFromLeft: distanceFromLeft,
      path: [],
      status: 'Start'
    };
  
    // Initialize the queue with the start location already inside
    var queue = [location];
  
    // Loop through the grid searching for the goal
    while (queue.length > 0) {
      // Take the first location off the queue
      var currentLocation = queue.shift();
  
      // Explore North
      var newLocation = exploreInDirection(currentLocation, 'North', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
  
      // Explore East
      var newLocation = exploreInDirection(currentLocation, 'East', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
  
      // Explore South
      var newLocation = exploreInDirection(currentLocation, 'South', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
  
      // Explore West
      var newLocation = exploreInDirection(currentLocation, 'West', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
    }
  
    // No valid path found
    return false;
  
};
function locationStatus(location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize) {

        // location is not on the grid--return false
        return 'Invalid';
    } else if (grid[dft][dfl] === 'Goal') {
        return 'Goal';
    } else if (grid[dft][dfl] !== 'Empty') {
        // location is either an obstacle or has been visited
        return 'Blocked';
    } else {
        return 'Valid';
    }
};
function exploreInDirection(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    if (direction === 'North') {
        dft -= 1;
    } else if (direction === 'East') {
        dfl += 1;
    } else if (direction === 'South') {
        dft += 1;
    } else if (direction === 'West') {
        dfl -= 1;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, grid);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }

    return newLocation;
};
  

function buildVirtualMaze(){
    let grid = [];

    for (let i=0; i<BLOCKSHEIGHT; i++) {
        grid[i] = [];
        for (let j=0; j<BLOCKSWIDTH; j++) {
            if (maze[i][j] === 1){
                grid[i][j] = 'Obstacle';
            } else {
                grid[i][j] = 'Empty';
            }
        }
    }

    return grid;

    // grid[xstart][ystart] = 'Start';
    // grid[xgoal][ygoal] = 'Goal';
}


function randomCoordinates(){
    let L = randomIntFromRange(0,BLOCKSHEIGHT-1);
    let C = randomIntFromRange(0,BLOCKSWIDTH-1)
    while(maze[L][C] !== 0){
        L = randomIntFromRange(0,BLOCKSHEIGHT-1);
        C = randomIntFromRange(0,BLOCKSWIDTH-1);
    }
    return [L, C];
}


// Objects
function Pacman(x, y, radius, vel, gridL, gridC){
    this.x = x;
    this.y = y;
    this.radius = radius;

    //Norte: 0, Leste: 1, Sul: 3, Oeste: 4
    //(Sentido horário)
    this.facing = 2;

    this.vel = {
        x: vel,
        y: 0
    };
    
    //time to open/close mouth
    this.ttom = 0;
    this.mouthopen = true;

    //Coordenadas no maze
    this.gridL = gridL; 
    this.gridC = gridC; 

    //só para checar colisão com muro
    this.factor1 = 1;
    this.factor2 = 1;
    
    //Variável que armazena informações do próximo move
    this.nextmove = {
        velx: vel, 
        vely: 0, 
        fac: 2, 
        fact1: 0, 
        fact2: 1
    };

    this.prevX = 0;
    this.prevY = 0;
    
    this.prevFacing = this.facing;

    this.update = function(){
        this.draw();

        // Comandos para Open/Close mouth 
        if(this.ttom > 8){
            this.mouthopen = !this.mouthopen;
            this.ttom = 0;
        }
        this.ttom ++;

        // É necessário mudar de direção nas coordenadas certas. Caso contrário, ele não entra direito nos espaços.

        // Os valores de prevX e prevY são somados a cada update. Se esses valores são iguais a vel (que é o size de um murinho, significa que são x e y exatos para mudar de direção)
        if(Math.abs(this.prevX) >= vel || Math.abs(this.prevY) >= vel){
            
            //update coordenadas de Linha
            if (this.vel.y !== 0){
                this.vel.y > 0 ? this.gridL ++ : this.gridL --;
            } 

            //update coordenadas de Coluna
            if (this.vel.x !== 0){
                this.vel.x > 0 ? this.gridC ++ : this.gridC --;
            }

            //Fazer o movimento guardado no this.nextmove
            this.makemove(this.nextmove)

            //Zerar os valores
            this.prevX = 0;
            this.prevY = 0;
        }

                
        //Movimento do pacman
        this.x += this.vel.x/PACVEL; 
        this.y += this.vel.y/PACVEL;

        //Somar valores de prev
        this.prevX += this.vel.x/PACVEL; 
        this.prevY += this.vel.y/PACVEL; 


        //Saída pela portinha esquerda
        if ( this.x + this.radius <= 0){
            this.x = canvas.width - this.radius; 
            this.gridC = BLOCKSWIDTH;
        }
        
        //Saída pela portinha direita
        if ( this.x - this.radius >= canvas.width){
            this.x = this.radius;
            this.gridC = -1;
        }

          
        //Checar colisão com muros por meio de coordenadas.
        //Usando o 'maze', é possível identificar uma colisão somando 1 ou -1 nos valores de Linha (factor1) ou Coluna (factor2) 

        //maze[?][1] => colisão direita  
        //maze[?][-1] => colisão esquerda  
        //maze[-1][?] => colisão cima  
        //maze[1][?] => colisão baixo  
 
        if (maze[this.gridL + this.factor1][this.gridC + this.factor2] === 1){
            this.vel.x = 0;
            this.vel.y = 0;

            this.x = this.gridC * WALLSIZE + this.radius;
            // TO FIX: pacman não centraliza quando bate no muro. Aumentar o valor de x melhora um pouco.
            if(this.facing === 2) this.x += Math.floor(WALLSIZE/8.3);

            this.y = this.gridL * WALLSIZE + this.radius;
            //TO FIX
            if(this.facing === 3) this.y += Math.floor(WALLSIZE/8.3);

            // Update dos valores de prevFacing com o current facing. Isso permite que o player mova o pacman depois de zerados os valores da velocidade 
            this.prevFacing = this.facing;

            if(this.nextmove.fac !== this.prevFacing ){
                this.makemove(this.nextmove);
            } 
        }   
    }

    
    // Dadas da variável, executa movimento
    this.makemove = (nextmove) => {
        this.vel.x = nextmove.velx;
        this.vel.y = nextmove.vely;
        this.facing = nextmove.fac;
        this.factor1 = nextmove.fact1;
        this.factor2 = nextmove.fact2;
    }

    //Armazena comandos do teclado em uma variável
    this.keyMove = (keyCode) => {

        switch(keyCode){
            case 39:
                //right
                this.nextmove = {
                    velx: vel, 
                    vely: 0, 
                    fac: 2, 
                    fact1: 0, 
                    fact2: 1
                };
                break;
            
            case 37:
                //left
                this.nextmove = {
                    velx: -vel, 
                    vely: 0, 
                    fac: 4, 
                    fact1: 0, 
                    fact2: -1
                };
                break;
                
            case 38:
                //up
                this.nextmove = {
                    velx: 0, 
                    vely: -vel, 
                    fac: 1, 
                    fact1: -1, 
                    fact2: 0
                };
                break;

            case 40:
                //down
                this.nextmove = {
                    velx: 0, 
                    vely: vel, 
                    fac: 3, 
                    fact1: 1, 
                    fact2: 0
                };
                break;
            
        }
    }
    
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = PACCOLOR;

        if (this.mouthopen){
            if (this.facing === 2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, (Math.PI/4), (1.25 * Math.PI), false);
                ctx.fill();

                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, (3*Math.PI/4), (1.75 * Math.PI) , false);
                ctx.fill();

            } else if(this.facing === 4){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(Math.PI/4), -1*(5 * Math.PI/4), false);
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(3*Math.PI/4), -1*(1.75 * Math.PI) , false);
                ctx.fill();
            } else if (this.facing === 1){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(Math.PI/4), -1*(5 * Math.PI/4), false);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, (Math.PI/4), (5 * Math.PI/4), false);
                ctx.fill();
            } else {
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(3*Math.PI/4), -1*(1.75 * Math.PI) , false);
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius,(3*Math.PI/4), (1.75 * Math.PI) , false);
                ctx.fill();
            }

            
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();

        }
        ctx.closePath();
    }
}


function Ghost(x, y, size, vel, images, gridL, gridC){
    this.x = x;
    this.y = y;
    this.size = size;
    this.images = images;

    //N-> 1, L->2, S->3, O->-4
    this.facing = 2;

    //Current Image to display
    this.curimage = this.images.left;

    this.vel = {
        x: 0,
        y: 0
    };

    //time to walk
    this.ttw = 0;

    //Coordinates
    this.gridL = gridL; 
    this.gridC = gridC;

    //Cada fantasta tem seu próprio grid (mapa virtual). Isso permite que cada um tenha seu próprio 'Start' e 'Goal'
    this.grid = undefined;

    //time to change path
    this.ttcp = 0;
    
    //time to move
    this.ttm = 25;

    //time to blink
    this.ttb = 0;

    //initial coordinates
    this.initialL = gridL;
    this.initialC = gridC;

    // Returning para casa inicial depois de comido
    this.returning = false;

    // Powertime
    this.scared = false;

    //this.path é criado no updatePath
    this.path = undefined;

    
    this.update = function(){
        this.ttcp++;
        this.ttw ++;

        //Com powertime: velocidade menor 
        //Sem powertime: velocidade maior 

        if(this.scared){
            this.ttm = 35; 
        } else if(this.returning) {
            this.ttm = 6;
        } else {
            this.ttm = 15;
        }


        // Se está na hora de mudar a direção
        if(this.ttw === this.ttm){
            this.ttw = 0;

            this.execute()
        }       
        
        
        //A cada ttcp, o fantasma cria um novo caminho baseado na localização do pacman.


        // Se chegou no destino OU ta na hora de trocar o destino
        if (this.grid[this.gridL][this.gridC] === "Goal" || this.ttcp > TIMETOBEGINFOLLOW){
            this.ttcp = 0;
            this.returning = false;

            if(this.scared) {
                //Valores aleatórios no Powertime
                let c = randomCoordinates();
                this.updatePath(c[0], c[1]);
            } else {
                //Coordenadas do pacman
                this.updatePath(pacman.gridL, pacman.gridC);
            };
        }

        this.x += this.vel.x / this.ttm; 
        this.y += this.vel.y / this.ttm;

        this.draw();
    }

    // Recebe novas coordenadas, cria um novo grid e estabelece um caminho (path)
    this.updatePath = (goalL, goalC) =>{
        this.grid = buildVirtualMaze();
        this.grid[this.gridL][this.gridC] = 'Start';
        this.grid[goalL][goalC] = 'Goal';

        //Cria uma queue/array dos comandos para chegar no goal
        this.path = findShortestPath([this.gridL, this.gridC], this.grid);
    }

    // Dado direction, altera valores  
    this.makemove = (direction) =>{
        switch(direction){
            case 'North':
                this.vel.x = 0;
                this.vel.y = -vel;
                // this.facing = 1;
                this.curimage = this.images.up;
                break;
            case 'South':
                this.vel.x = 0;
                this.vel.y = vel;
                // this.facing = 3;
                this.curimage = this.images.down;
                break;
            case 'East':
                this.vel.x = vel;
                this.vel.y = 0;
                // this.facing = 2;
                this.curimage = this.images.right;
                break;
            case 'West':
                this.vel.x = -vel;
                this.vel.y = 0;
                // this.facing = 4;
                this.curimage = this.images.left;
                break;
        }
    };

    this.execute = () => {
        //Executa o primeiro comando do this.path
        this.makemove(this.path[0]);

        //Retira o primeiro comando to this.path
        try{
            this.path.splice(0, 1);
        } catch (e) {console.log('path error')}
        
        //update das coordenadas
        if (this.vel.y !== 0){
            this.vel.y > 0 ? this.gridL ++ : this.gridL --;
        } 

        if (this.vel.x !== 0){
            this.vel.x > 0 ? this.gridC ++ : this.gridC --;
        }
    }

    //Usado (1)quando é comido, (2)quando fica scared e (3)quando sai do scared.
    //Cria nova rota e centraliza this.x/y no grid
    this.retransform = (goalL, goalC, scared=false, returning=false) => {      
        this.scared = scared;     
        this.returning = returning;
        this.updatePath(goalL, goalC);
        this.x = this.gridC * WALLSIZE;
        this.y = this.gridL * WALLSIZE;
        this.ttcp = 0;
        this.ttw = 0;
        this.execute();
    }

    this.draw = () => {
        //this.scared: desenha scared ghost
        //Sem : desenha this.currentImage
        ctx.beginPath();
        if(this.scared){
            if(ttpt < POWERTIME/2){
                //50% of time: normal ghost
                ctx.drawImage(scaredghost, this.x, this.y, this.size, this.size)
            } else{
                //Last 50%: Blinks effect
                
                //Comandos para blink
                this.ttb ++;
                if(this.ttb > 25){
                    ctx.drawImage(scaredghost, this.x, this.y, this.size, this.size)
                } else {
                    ctx.drawImage(scaredghostwhite, this.x, this.y, this.size, this.size)
                }
                if(this.ttb > 50) this.ttb = 0;
            }


        } else {
            ctx.drawImage(this.curimage, this.x, this.y, this.size, this.size);
        }
        ctx.closePath();
    }
}


function Wall(x, y ,width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.size = height;

    
    this.draw = (color) =>{
        ctx.beginPath();
        this.color = color;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.fill();
        ctx.closePath();
    };
}

function Point(x, y, gridL, gridC){
    this.x = x;
    this.y = y;
    this.radius = WALLSIZE/10;

    this.gridL = gridL;
    this.gridC = gridC;


    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x+(WALLSIZE/2), this.y+(WALLSIZE/2), this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    };
}

function PowerPoint(x, y, gridL, gridC){
    this.x = x;
    this.y = y;

    this.gridL = gridL;
    this.gridC = gridC;

    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x+(WALLSIZE/2), this.y+(WALLSIZE/2), WALLSIZE/5, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    };  
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
    preventspace = true;
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
    
    preventspace = false;

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
                preventspace = true;
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