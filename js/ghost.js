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