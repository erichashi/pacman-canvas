class KillPacmanState extends BaseState {
    constructor(){
        super();
    }

    enter(params){
        this.ghosts = params.ghosts;
        this.pacman = params.pacman;
        this.score = params.score;
        this.numlifes = params.numlifes;

        this.points = params.points;
        this.powerpoints = params.powerpoints;
        this.powertime = params.powertime;
        this.ttpt = params.ttpt;

        this.timer = 0;

    }

    update(){
        this.points.forEach(point => point.render());
        this.powerpoints.forEach(powerpoint => powerpoint.render());
        this.ghosts.forEach(ghost => ghost.render());
        this.pacman.render();

        this.timer ++;
        if(this.timer >= 120){

            if(this.numlifes <= 0){
            
                gStateMachine.change('gameover', {
                    score: this.score
                });

            } else {

                gStateMachine.change('restartafterdie', {
                    score: this.score,

                    numlifes: this.numlifes,

                    points: this.points, 
                    powerpoints: this.powerpoints, 
                    numpts: this.numpts, 
                    numppts: this.numppts, 

                    pacman: this.pacman,
                    ghosts: this.ghosts,
                });

            }

        }
    }
}