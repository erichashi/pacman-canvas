class PlayState extends BaseState {

    constructor(){
        super();
    }

    enter(params){
        this.ghosts = params.ghosts;
        this.pacman = params.pacman;
        
        this.points = params.points;
        this.powerpoints = params.powerpoints;

        this.score = params.score;

        this.numlifes = params.numlifes;

        this.powertime = params.powertime ;
        this.ttpt = params.ttpt ;

        gSounds['ambient'].play();

    }


    //diferenças entre numpts e NUMPTS garante que quando morto, o jogo reinicie com os pontos no mapa salvos.

    //Os pontos vão diminuindo na medida que a array 'points' vai diminuindo
    //E como renderMaze() só coloca pontos no mapa se numpts <= NUMPTS, o init() não vai dezenhar novos pontos porque numpts é > que NUMPTS

    update(){
        this.pacman.update();

        // Se powertime: retransform() cada ghost quando acaba
        if(this.powertime){
            this.ttpt++;
            if (this.ttpt >= POWERTIME){
                this.powertime = false;
                this.ttpt = 0;

                gSounds['ambient-fright'].pause();
                gSounds['ambient'].play();

                this.ghosts.forEach(ghost => {
                    if(!ghost.returning) ghost.state.change('following', ghost)
                });
            };
        };


        //POINTS: se comido, desaparece, incrementa score e diminui noteatedpoints
        ctx.fillStyle = "white";
        for (let i = this.points.length - 1; i >= 0; i--) {
            const pt = this.points[i];
            
            pt.render();
        
            if (sameCoordinates(this.pacman.gridL, this.pacman.gridC, pt.gridL, pt.gridC)){
                this.points.splice(i, 1);
                this.score += 10;
                gHTMLElements['scoretext'].innerHTML = this.score;
            };
        }


        //POWERPOINTS: powertime=true, retrosform() cada ghost
        for (let i = this.powerpoints.length - 1; i >= 0; i--) {
            const ppt = this.powerpoints[i];
            
            ppt.update();
    
            if (sameCoordinates(this.pacman.gridL, this.pacman.gridC, ppt.gridL, ppt.gridC)){
                this.powertime = true;
                this.ttpt = 0;

                gSounds['ambient'].pause();
                gSounds['ambient-fright'].play();

                this.ghosts.forEach(ghost => {
                    ghost.state.change('scared', ghost)
                });

                this.powerpoints.splice(i, 1);
            };
        }


        // //GHOST: se touchPacman(), volta pra casa OU game over. 
        this.ghosts.forEach((ghost) => {

            if(

                touchPacman(this.pacman.x, this.pacman.y, ghost.x, ghost.y) && !ghost.returning
                
                ){

                if(ghost.scared) { //pacman eat

                    this.score+=200;  
                    gHTMLElements['scoretext'].innerHTML = this.score;
                    // writeTextCanvas(200, ghost.x, ghost.y, 'white', WALLSIZE/2.5);

                    gStateMachine.change('killGhost', {
                        gkilled: ghost,
                        ghosts: this.ghosts,
                        pacman: this.pacman,
                        points: this.points, 
                        powerpoints: this.powerpoints,
                        score: this.score,
                        numlifes: this.numlifes,
                        powertime: true,
                        ttpt: this.ttpt
                    });
                    

                } else { // pacman was killed 
                    this.numlifes--;

                    gSounds['ambient'].pause();

                    gStateMachine.change('killPacman', {
                        ghosts: this.ghosts,
                        pacman: this.pacman,
                        points: this.points, 
                        powerpoints: this.powerpoints,
                        score: this.score,
                        numlifes: this.numlifes,
                        powertime: true,
                        ttpt: this.ttpt
                    });
                    
                };
            };

            ghost.update();    
        });

        // complete map
        if(this.points.length + this.powerpoints.length <= 0){
            gSounds['ambient-fright'].pause();
            gSounds['ambient'].pause();

            gStateMachine.change('restartnewround', {
                score: this.score,
                numlifes: this.numlifes,
                pacman: this.pacman,
                ghosts: this.ghosts,
            });
        }

    };
};
