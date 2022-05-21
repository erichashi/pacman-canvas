//Helper functions for ghosts
const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

const START = 5;
const GOAL = 6;
const VISITED = 7;
const EMPTY = 8;
const OBSTACLE = 9;
const UNKNOWN = 10;
const VALID = 11;
const INVALID = 12;
const BLOCKED = 13;



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
      status: START
    };
  
    // Initialize the queue with the start location already inside
    var queue = [location];
  
    // Loop through the grid searching for the goal
    while (queue.length > 0) {
      // Take the first location off the queue
      var currentLocation = queue.shift();
  
      // Explore North
      var newLocation = exploreInDirection(currentLocation, NORTH, grid);
      if (newLocation.status === GOAL) {
        return newLocation.path;
      } else if (newLocation.status === VALID) {
        queue.push(newLocation);
      }
  
      // Explore East
      var newLocation = exploreInDirection(currentLocation, EAST, grid);
      if (newLocation.status === GOAL) {
        return newLocation.path;
      } else if (newLocation.status === VALID) {
        queue.push(newLocation);
      }
  
      // Explore South
      var newLocation = exploreInDirection(currentLocation, SOUTH, grid);
      if (newLocation.status === GOAL) {
        return newLocation.path;
      } else if (newLocation.status === VALID) {
        queue.push(newLocation);
      }
  
      // Explore West
      var newLocation = exploreInDirection(currentLocation, WEST, grid);
      if (newLocation.status === GOAL) {
        return newLocation.path;
      } else if (newLocation.status === VALID) {
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
        return INVALID;
    } else if (grid[dft][dfl] === GOAL) {
        return GOAL;
    } else if (grid[dft][dfl] !== EMPTY) {
        // location is either an obstacle or has been visited
        return BLOCKED;
    } else {
        return VALID;
    }
};
function exploreInDirection(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    if (direction === NORTH) {
        dft -= 1;
    } else if (direction === EAST) {
        dfl += 1;
    } else if (direction === SOUTH) {
        dft += 1;
    } else if (direction === WEST) {
        dfl -= 1;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: UNKNOWN
    };
    newLocation.status = locationStatus(newLocation, grid);

    // If this new location is valid, mark it as VISITED
    if (newLocation.status === VALID) {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = VISITED;
    }

    return newLocation;
};
  

function buildVirtualMaze(){
    let grid = [];

    for (let i=0; i<BLOCKSHEIGHT; i++) {

        if(i === 0 || i === BLOCKSHEIGHT) {
            grid[i] = [OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE, OBSTACLE];
            continue;
        } 

        grid[i] = [];
        for (let j=0; j<BLOCKSWIDTH; j++) {

            if (maze[i][j] === 1) grid[i][j] = OBSTACLE;
            else grid[i][j] = EMPTY;
            
        }
    }

    return grid;

    // grid[xstart][ystart] = START;
    // grid[xgoal][ygoal] = GOAL;
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



class Ghost {

    constructor(gridL, gridC){

        //initial coordinates
        this.initialL = gridL;
        this.initialC = gridC;

        this.state = new StateMachine({
            'following': () => new GhostFollowingState(),
            'scared': () => new GhostScaredState(),
            'returning': () => new GhostReturningState(),
        })
        
        this.defaultValues(gridL, gridC);


    }

    defaultValues(gridL, gridC){
        
        this.gridL = gridL; 
        this.gridC = gridC;
     
        this.x = gridC*WALLSIZE;
        this.y = gridL*WALLSIZE;
    
        this.size = GHOSTSIZE;
    
        //Current Image to display
        this.curimg = gImages['leftghost'];
    
        this.vel = {
            x: 0,
            y: 0
        };
        
        //Cada fantasta tem seu próprio grid (mapa virtual). Isso permite que cada um tenha seu próprio START e GOAL
        this.grid = undefined;
        
        //time to walk
        this.ttw = 0;
    
        //time to change path
        this.ttcp = 0;
        
        //time to move
        this.ttm = 25;
    
        //time to blink
        this.ttb = 0;
    
        // Returning para casa inicial depois de comido
        this.returning = false;
    
        // Powertime
        this.scared = false;
    
        //this.path é criado no updatePath
        this.path = undefined;

        this.state.change('following', this)



    }

    update(){
        this.ttcp++;
        this.ttw ++;

        // Se está na hora de mudar a direção
        if(this.ttw >= this.ttm){
            this.ttw = 0;
            this.execute()
        }       
        
        //A cada ttcp, o fantasma cria um novo caminho baseado na localização do pacman.

        this.state.update();

        this.x += this.vel.x / this.ttm; 
        this.y += this.vel.y / this.ttm;

        this.render();

    }

    // Recebe novas coordenadas, cria um novo grid e estabelece um caminho (path)
    updatePath(goalL, goalC) {
        this.grid = buildVirtualMaze();
        this.grid[this.gridL][this.gridC] = START;
        this.grid[goalL][goalC] = GOAL;

        //Cria uma queue/array dos comandos para chegar no goal
        this.path = findShortestPath([this.gridL, this.gridC], this.grid);
    }

    // Dado direction, altera valores  
    makemove(direction){
        switch(direction){
            case NORTH:
                this.vel.x = 0;
                this.vel.y = -WALLSIZE;
                this.curimg = gImages['upghost'];
                //update coordenadas
                this.gridL--;
                break;
            case SOUTH:
                this.vel.x = 0;
                this.vel.y = WALLSIZE;
                this.curimg = gImages['downghost'];
                this.gridL++;
                break;
            case EAST:
                this.vel.x = WALLSIZE;
                this.vel.y = 0;
                this.curimg = gImages['rightghost'];
                this.gridC++;
                break;
            case WEST:
                this.vel.x = -WALLSIZE;
                this.vel.y = 0;
                this.curimg = gImages['leftghost'];
                this.gridC--;
                break;
        }
    };

    execute(){
        //Executa o primeiro comando do this.path
        this.makemove(this.path[0]);

        //Retira o primeiro comando to this.path
        try{
            this.path.splice(0, 1);
        } catch (e) {console.log('path error')}
        
    };

    //Usado (1)quando é comido, (2)quando fica scared e (3)quando sai do scared.
    //Cria nova rota e centraliza this.x/y no grid
    retransform(goalL, goalC, scared=false, returning=false) {      
        this.scared = scared;     
        this.returning = returning;
        this.updatePath(goalL, goalC);
        this.x = this.gridC * WALLSIZE;
        this.y = this.gridL * WALLSIZE;
        this.ttcp = 0;
        this.ttw = 0;
        this.execute();
    }

    render(){
        //this.scared: desenha scared ghost
        //Sem : desenha this.currentImage
     
        // if(this.scared){
        //     if(gStateMachine.current.ttpt < POWERTIME/2){
        //         //50% of time: normal ghost
        //         ctx.drawImage(gImages['scaredghost'], this.x, this.y, this.size, this.size)
        //     } else{
        //         //Last 50%: Blinks effect
                
        //         //Comandos para blink
        //         this.ttb ++;
        //         if(this.ttb > 25){
        //             ctx.drawImage(gImages['scaredghost'], this.x, this.y, this.size, this.size)
        //         } else {
        //             ctx.drawImage(gImages['scaredghostwhite'], this.x, this.y, this.size, this.size)
        //         }
        //         if(this.ttb > 50) this.ttb = 0;
        //     }


        // } else 

            ctx.drawImage(this.curimg, this.x, this.y, this.size, this.size);        
    }


    // handleEated(){
    //     pause=true;

    //     writeTextCanvas(200, this.x, this.y, 'white', WALLSIZE/2.5);
    //     score+=200;  
    //     scoretext.innerHTML = score;

    //     setTimeout(() => {
    //         pause = false;
    
    //         this.retransform(this.initialL, this.initialC, false, true);
    //         update();
    //     }, 1500);
    // }

       
    // handleKill(){
    //     pause = true;
    //     // numlifes--;

    //     setTimeout(() => {
    //         if(numlifes <= 0){

    //             gStateMachine.change('gameover');
    //             // gameover();

    //         } else {

    //             gStateMachine.change('title')
    //             // restartAfterDie();
    //         }

    //     }, 2000);
    // }

}