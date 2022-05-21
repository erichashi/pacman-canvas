class GhostFollowingState extends BaseState {
    constructor() {super()}

    enter(ghost){
        this.ghost = ghost;
        this.ghost.ttm = GHOSTVEL;

        this.ghost.scared = false;     
        this.ghost.returning = false;

        try{
            this.ghost.updatePath(gStateMachine.current.pacman.gridL, gStateMachine.current.pacman.gridC);  
        } catch(e){}

        this.ghost.x = this.ghost.gridC * WALLSIZE;
        this.ghost.y = this.ghost.gridL * WALLSIZE;
        this.ghost.ttcp = 0;
        this.ghost.ttw = 0;
        try {
            this.ghost.execute();
        } catch (error) {}


    }
    
    update(){
        // Se chegou no destino OU ta na hora de trocar o destino
        if (this.ghost.grid[this.ghost.gridL][this.ghost.gridC] === GOAL || this.ghost.ttcp > TIMETOBEGINFOLLOW){
            this.ghost.ttcp = 0;

            //Coordenadas do pacman
            this.ghost.updatePath(gStateMachine.current.pacman.gridL, gStateMachine.current.pacman.gridC);

        }
    }
}