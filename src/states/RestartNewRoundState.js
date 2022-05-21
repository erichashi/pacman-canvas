class RestartNewRoundState extends BaseState {
    constructor(){
        super();
        this.ttr = 0;
    }

    enter(params){
        this.score = params.score;
        this.numlifes = params.numlifes;
        this.pacman = params.pacman;
        this.ghosts = params.ghosts;

        this.points = [];
        this.powerpoints = [];
        
    }

    update(){
        this.pacman.render();

        this.ttr++;
        if(this.ttr >= 90) {
            
            //reiniciar apenas os pontos 
            maze.forEach((row, rowindex) => {
                row.forEach((cell, colindex) => {
        
                    if (cell === 0) this.points.push(new Point(rowindex, colindex));
                    
                    else if (cell === 5) this.powerpoints.push(new PowerPoint(rowindex, colindex));
                                           
                });
            });

            //nao morreu, mas vai reiniciar os valores menos o score
            gStateMachine.change('restartafterdie', {
                score: this.score,
                numlifes: this.numlifes,

                points: this.points,
                powerpoints: this.powerpoints,

                pacman: this.pacman,
                ghosts: this.ghosts
            })

        };

        
    }
}