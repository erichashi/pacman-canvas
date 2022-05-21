class GhostScaredState extends BaseState {
    constructor() {super()}

    enter(ghost){
        this.ghost = ghost;
        this.ghost.ttm = GHOSTVEL*3;

        this.ghost.scared = true;     
        this.ghost.returning = false;

        let c = randomCoordinates();        
        this.ghost.updatePath(c[0], c[1]);

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
            let c = randomCoordinates();
            this.ghost.updatePath(c[0], c[1]);
        
        }


        //efeitos de blink e scared
        if(gStateMachine.current.ttpt < POWERTIME/2){
            //50% of time: normal ghost
            this.ghost.curimg = gImages['scaredghost'];

        } else {
            //Last 50%: Blinks effect
            
            //Comandos para blink
            this.ghost.ttb ++;
            if(this.ghost.ttb > 25){
                this.ghost.curimg = gImages['scaredghost'];
            } else {
                this.ghost.curimg = gImages['scaredghostwhite'];
            }
            if(this.ghost.ttb > 50) this.ghost.ttb = 0;
        }

    }



}