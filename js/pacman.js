function Pacman(x, y, radius, vel, gridL, gridC){
    this.x = x;
    this.y = y;
    this.radius = radius;

    //Norte: 0, Leste: 1, Sul: 3, Oeste: 4
    //(Sentido horário)
    this.facing = 2;

    this.vel = {
        x: vel,
        y: 0
    };
    
    //time to open/close mouth
    this.ttom = 0;
    this.mouthopen = true;

    //Coordenadas no maze
    this.gridL = gridL; 
    this.gridC = gridC; 

    //só para checar colisão com muro
    this.factor1 = 1;
    this.factor2 = 1;
    
    //Variável que armazena informações do próximo move
    this.nextmove = {
        velx: vel, 
        vely: 0, 
        fac: 2, 
        fact1: 0, 
        fact2: 1
    };

    this.prevX = 0;
    this.prevY = 0;
    
    this.prevFacing = this.facing;

    this.update = function(){
        this.draw();

        // Comandos para Open/Close mouth 
        if(this.ttom > 8){
            this.mouthopen = !this.mouthopen;
            this.ttom = 0;
        }
        this.ttom ++;

        // É necessário mudar de direção nas coordenadas certas. Caso contrário, ele não entra direito nos espaços.

        // Os valores de prevX e prevY são somados a cada update. Se esses valores são iguais a vel (que é o size de um murinho, significa que são x e y exatos para mudar de direção)
        if(Math.abs(this.prevX) >= vel || Math.abs(this.prevY) >= vel){
            
            //update coordenadas de Linha
            if (this.vel.y !== 0){
                this.vel.y > 0 ? this.gridL ++ : this.gridL --;
            } 

            //update coordenadas de Coluna
            if (this.vel.x !== 0){
                this.vel.x > 0 ? this.gridC ++ : this.gridC --;
            }

            //Fazer o movimento guardado no this.nextmove
            this.makemove(this.nextmove)

            //Zerar os valores
            this.prevX = 0;
            this.prevY = 0;
        }

                
        //Movimento do pacman
        this.x += this.vel.x/PACVEL; 
        this.y += this.vel.y/PACVEL;

        //Somar valores de prev
        this.prevX += this.vel.x/PACVEL; 
        this.prevY += this.vel.y/PACVEL; 


        //Saída pela portinha esquerda
        if ( this.x + this.radius <= 0){
            this.x = canvas.width - this.radius; 
            this.gridC = BLOCKSWIDTH;
        }
        
        //Saída pela portinha direita
        if ( this.x - this.radius >= canvas.width){
            this.x = this.radius;
            this.gridC = -1;
        }

          
        //Checar colisão com muros por meio de coordenadas.
        //Usando o 'maze', é possível identificar uma colisão somando 1 ou -1 nos valores de Linha (factor1) ou Coluna (factor2) 

        //maze[?][1] => colisão direita  
        //maze[?][-1] => colisão esquerda  
        //maze[-1][?] => colisão cima  
        //maze[1][?] => colisão baixo  
 
        if (maze[this.gridL + this.factor1][this.gridC + this.factor2] === 1){
            this.vel.x = 0;
            this.vel.y = 0;

            this.x = this.gridC * WALLSIZE + this.radius;
            // TO FIX: pacman não centraliza quando bate no muro. Aumentar o valor de x melhora um pouco.
            if(this.facing === 2) this.x += Math.floor(WALLSIZE/8.3);

            this.y = this.gridL * WALLSIZE + this.radius;
            //TO FIX
            if(this.facing === 3) this.y += Math.floor(WALLSIZE/8.3);

            // Update dos valores de prevFacing com o current facing. Isso permite que o player mova o pacman depois de zerados os valores da velocidade 
            this.prevFacing = this.facing;

            if(this.nextmove.fac !== this.prevFacing ){
                this.makemove(this.nextmove);
            } 
        }   
    }

    
    // Dadas da variável, executa movimento
    this.makemove = (nextmove) => {
        this.vel.x = nextmove.velx;
        this.vel.y = nextmove.vely;
        this.facing = nextmove.fac;
        this.factor1 = nextmove.fact1;
        this.factor2 = nextmove.fact2;
    }

    //Armazena comandos do teclado em uma variável
    this.keyMove = (keyCode) => {

        switch(keyCode){
            case 39:
                //right
                this.nextmove = {
                    velx: vel, 
                    vely: 0, 
                    fac: 2, 
                    fact1: 0, 
                    fact2: 1
                };
                break;
            
            case 37:
                //left
                this.nextmove = {
                    velx: -vel, 
                    vely: 0, 
                    fac: 4, 
                    fact1: 0, 
                    fact2: -1
                };
                break;
                
            case 38:
                //up
                this.nextmove = {
                    velx: 0, 
                    vely: -vel, 
                    fac: 1, 
                    fact1: -1, 
                    fact2: 0
                };
                break;

            case 40:
                //down
                this.nextmove = {
                    velx: 0, 
                    vely: vel, 
                    fac: 3, 
                    fact1: 1, 
                    fact2: 0
                };
                break;
            
        }
    }
    
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = PACCOLOR;

        if (this.mouthopen){
            if (this.facing === 2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, (Math.PI/4), (1.25 * Math.PI), false);
                ctx.fill();

                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, (3*Math.PI/4), (1.75 * Math.PI) , false);
                ctx.fill();

            } else if(this.facing === 4){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(Math.PI/4), -1*(5 * Math.PI/4), false);
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(3*Math.PI/4), -1*(1.75 * Math.PI) , false);
                ctx.fill();
            } else if (this.facing === 1){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(Math.PI/4), -1*(5 * Math.PI/4), false);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, (Math.PI/4), (5 * Math.PI/4), false);
                ctx.fill();
            } else {
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, -1*(3*Math.PI/4), -1*(1.75 * Math.PI) , false);
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius,(3*Math.PI/4), (1.75 * Math.PI) , false);
                ctx.fill();
            }

            
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();

        }
        ctx.closePath();
    }
}