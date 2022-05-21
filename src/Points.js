class Point {
    constructor(gridL, gridC){

        this.gridL = gridL;
        this.gridC = gridC;
        
        this.x = (this.gridC * WALLSIZE) + (WALLSIZE/2);
        this.y = (this.gridL * WALLSIZE) + (WALLSIZE/2);
        
        this.radius = Math.floor(WALLSIZE/10);
        
    }    

    render() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    };
}

class PowerPoint extends Point{
    constructor(gridL, gridC){
        super(gridL, gridC)
        this.radius = Math.floor(WALLSIZE/5);
        this.ttb = 5;
    }
    update(){
        // this.ttb ++;
        // if(this.ttb >= t){
        //     this.ttb = 0;
        //     ctx.fillStyle === "#ffffff" ? ctx.fillStyle = "#000000" : ctx.fillStyle = '#ffffff';
        // }
        this.render();
    }
};
