class RestartAfterDieState extends BaseState {
    constructor(){
        super();
    }

    enter(params) {

        this.score = params.score; 
        this.numlifes = params.numlifes; 
        
        this.points =  params.points; 
        this.powerpoints = params.powerpoints; 

        this.pacman = params.pacman; 
        this.pacman.defaultValues();
        
        this.ghosts = params.ghosts; 
        //Cria coordenadas de 'Goal' iniciais aleatórias
        this.ghosts.forEach(ghost => {
            ghost.defaultValues(ghost.initialL, ghost.initialC);
            let x = randomCoordinates();
            ghost.updatePath(x[0], x[1]);
        })

        gHTMLElements['startbtn'].style.opacity = '1';
        gHTMLElements['startbtn'].disabled = false;
    
        gHTMLElements['scoretext'].innerHTML = this.score;
    
        gHTMLElements['centercontainer'].style.color = 'yellow';
        gHTMLElements['centercontainer'].style.display = 'block'
        gHTMLElements['centercontainer'].innerHTML = 'ready';
    
        //icones pacman marcando vida
        gHTMLElements['lifecontainer'].innerHTML = "";
        for (let i = 0; i < this.numlifes; i++) {
            let pacicon = document.createElement('img');
            pacicon.height = PACSIZE;
            pacicon.src = "assets/img/pacman/right.png"
            gHTMLElements['lifecontainer'].append(pacicon)
        };
    }

    update() {
        //isso basicamente roda 1 vez
        pause = true;

        this.pacman.render();
        this.ghosts.forEach(ghost => ghost.render())
        this.points.forEach(point => point.render())
        this.powerpoints.forEach(point => point.render())

    }

    start(){

        // if(wasClicked()){
            pause = false;

            gHTMLElements['startbtn'].style.opacity = '.3';
            gHTMLElements['startbtn'].disabled = true;
            gHTMLElements['centercontainer'].style.display = 'none'

            gStateMachine.change('play', {
                ghosts: this.ghosts,
                pacman: this.pacman,
                points: this.points,
                powerpoints: this.powerpoints,
                score: this.score,
                numlifes: this.numlifes,
                powertime: false,
                ttpt: 0
            });       
            update(); 

        // }
    }


}