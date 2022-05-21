class GhostReturningState extends BaseState {
    constructor() {super()}

    enter(ghost){
        this.ghost = ghost;

        this.ghost.ttm = GHOSTVEL/2;

        this.ghost.scared = false;     
        this.ghost.returning = true;

        this.ghost.updatePath(this.ghost.initialL, this.ghost.initialC);
        
        this.ghost.x = this.ghost.gridC * WALLSIZE;
        this.ghost.y = this.ghost.gridL * WALLSIZE;
        this.ghost.ttcp = 0;
        this.ghost.ttw = 0;
        this.ghost.execute();


    }
    
    update(){
        
        // Se chegou no destino OU ta na hora de trocar o destino
        if (this.ghost.grid[this.ghost.gridL][this.ghost.gridC] === GOAL || this.ghost.ttcp > TIMETOBEGINFOLLOW){
            this.ghost.ttcp = 0;
            //Valores aleatórios no Powertime

            this.ghost.state.change('following', this.ghost);


        }

    }



}