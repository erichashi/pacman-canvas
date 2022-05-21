class Pacman{
    
    constructor(gridL, gridC){
        this.initialL = gridL;
        this.initialC = gridC;

        //tambem eh chamada no RestartAfterDie, por isso funcao separada
        this.defaultValues()
    }

    defaultValues(){
        this.gridL = this.initialL; 
        this.gridC = this.initialC; 
    
        this.x = this.gridC*WALLSIZE;
        this.y = this.gridL*WALLSIZE;
    
        this.size = PACSIZE;
    
        this.curimg = gImages['rightpac'];
    
        this.vel = {
            x: WALLSIZE,
            y: 0
        };
        
        //time to open/close mouth
        this.ttom = 0;
    
        //so para checar colisao com muro
        this.factor1 = 0;
        this.factor2 = 1;
        
        //Variável que armazena informacoes do proximo move
        this.nextmove = {
            velx: WALLSIZE, 
            vely: 0, 
            img: gImages['rightpac'], 
            fact1: 0, 
            fact2: 1
        };
    
        this.ttw = 0;

    }

    checkinput(){
        if(wasPressed('ArrowLeft')){
            this.nextmove = {
                velx: -WALLSIZE, 
                vely: 0, 
                img: gImages['leftpac'], 
                fact1: 0, 
                fact2: -1
            };
        } else

        if(wasPressed('ArrowRight')){
            this.nextmove = {
                velx: WALLSIZE, 
                vely: 0, 
                img: gImages['rightpac'], 
                // fac: 2, 
                fact1: 0, 
                fact2: 1
            };
        } else

        if(wasPressed('ArrowUp')){
            this.nextmove = {
                velx: 0, 
                vely: -WALLSIZE, 
                img: gImages['uppac'], 
                // fac: 1, 
                fact1: -1, 
                fact2: 0
            };
        } else

        if(wasPressed('ArrowDown')){
            this.nextmove = {
                velx: 0, 
                vely: WALLSIZE, 
                img: gImages['downpac'], 
                // fac: 3, 
                fact1: 1, 
                fact2: 0
            };
        }
    }

    update() {
        this.render();
        this.checkinput();

        // Comandos para Open/Close mouth 
        if(this.ttom > 8){
            this.curimg = gImages['mcpac'];
            this.ttom = 0;
        }
        this.ttom ++;

        // É necessário mudar de direção nas coordenadas certas. Caso contrário, ele não entra direito nos espaços.
        // this.ttw (time to walk) eh incrementado a cada update. passados PACVEL frames, ele pode virar.
        this.ttw ++;
        if(this.ttw >= PACVEL){
            // this.ttw = 0;

            // //update coordenadas de Linha
            if (this.vel.y !== 0){
                this.vel.y > 0 ? this.gridL ++ : this.gridL --;
            } 

            //update coordenadas de Coluna
            if (this.vel.x !== 0){
                this.vel.x > 0 ? this.gridC ++ : this.gridC --;
            }

            //Fazer o movimento guardado no this.nextmove
            this.makemove(this.nextmove)
            
        }

        // //Movimento do pacman
        this.x += this.vel.x/PACVEL; 
        this.y += this.vel.y/PACVEL;


        //Checar colisão com muros por meio de coordenadas.
        //Usando o 'maze', é possível identificar uma colisão somando 1 ou -1 nos valores de Linha (factor1) ou Coluna (factor2) 

        //maze[?][1] => colisão direita  
        //maze[?][-1] => colisão esquerda  
        //maze[-1][?] => colisão cima  
        //maze[1][?] => colisão baixo  
        if (maze[this.gridL + this.factor1][this.gridC + this.factor2] === 1){
            this.vel.x = 0;
            this.vel.y = 0;
            
            this.x = this.gridC * WALLSIZE;
            this.y = this.gridL * WALLSIZE;
            
            // chegagem dos valores de nextmove e current img. Isso permite que o player mova o pacman depois de zerados os valores da velocidade 
            if(this.nextmove.img !== this.curimg ){
                this.makemove(this.nextmove);
            }
        } 


        //Saída pela portinha esquerda
        if ( this.gridC < 0){
            this.gridC = BLOCKSWIDTH-1;
            this.x = this.gridC * WALLSIZE; 
            gStateMachine.current.ghosts.forEach(ghost => {
                let x = randomCoordinates();
                ghost.updatePath(x[0], x[1]);
            });
        }
        
        //Saída pela portinha direita
        if ( this.gridC > BLOCKSWIDTH){
            this.gridC = 0;
            this.x = this.gridC * WALLSIZE; 
            gStateMachine.current.ghosts.forEach(ghost => {
                let x = randomCoordinates();
                ghost.updatePath(x[0], x[1]);
            });
        }

          
        
    }

    // Dados da variável, executa movimento
    makemove(nextmove) {
        this.vel.x = nextmove.velx;
        this.vel.y = nextmove.vely;

        this.curimg = nextmove.img;
        this.factor1 = nextmove.fact1;
        this.factor2 = nextmove.fact2;

        this.ttw = 0;
    }
    
    render() {
        ctx.drawImage(this.curimg, this.x, this.y, this.size, this.size);
    }
}