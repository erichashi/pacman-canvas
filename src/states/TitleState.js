class TitleState extends BaseState {

    constructor(){
        super();

        this.numlifes =  NUMLIFES;
        this.score =  0;

        this.points =  [];
        this.powerpoints =  [];

        this.ghosts = [];     
    
        ctx.fillStyle = "white";

        maze.forEach((row, rowindex) => {
            row.forEach((cell, colindex) => {
    
                if (cell === 0) this.points.push(new Point(rowindex, colindex));
                
                else 
                
                if (cell === 5) this.powerpoints.push(new PowerPoint(rowindex, colindex));
              
                else if (cell === 6) 
                    
                    this.pacman = new Pacman(rowindex, colindex)
                

                else if (cell === 2) this.ghosts.push(new Ghost(rowindex, colindex))
                     
            });
        });
    
        //Cria coordenadas de 'Goal' iniciais aleatórias
        this.ghosts.forEach(ghost => {
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

        // this.pacman.render();
        this.ghosts.forEach(ghost => ghost.render())
        this.points.forEach(point => point.render())
        this.powerpoints.forEach(point => point.render())

    }

    //start() function direto no botao PLAY no html
    start(){

        gSounds['start-music'].play();

        gSounds['start-music'].onended = () => {
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

        }

        // if(wasClicked()){
            // pause = false;

            // gHTMLElements['startbtn'].style.opacity = '.3';
            // gHTMLElements['startbtn'].disabled = true;
            // gHTMLElements['centercontainer'].style.display = 'none'


            // gStateMachine.change('play', {
            //     ghosts: this.ghosts,
            //     pacman: this.pacman,
            //     points: this.points,
            //     powerpoints: this.powerpoints,
            //     score: this.score,
            //     numlifes: this.numlifes,
            //     powertime: false,
            //     ttpt: 0
            // });       
            // update(); 

        // }
    }

}

