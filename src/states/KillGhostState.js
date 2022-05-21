class KillGhostState extends BaseState {
    constructor(){
        super();
    }

    enter(params){
        this.gkilled = params.gkilled;


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

        writeTextCanvas(200, this.gkilled.x, this.gkilled.y, 'white', WALLSIZE/2.5);

        this.timer ++;
        if(this.timer >= 90){

            // this.gkilled.retransform(this.gkilled.initialL, this.gkilled.initialC, false, true);
            this.gkilled.state.change('returning', this.gkilled);

            gStateMachine.change('play', {
                ghosts: this.ghosts,
                pacman: this.pacman,
                points: this.points,
                powerpoints: this.powerpoints,
                score: this.score,
                numlifes: this.numlifes,
                powertime: this.powertime,
                ttpt: this.ttpt
            })
        }
    }
}