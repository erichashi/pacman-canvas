function Point(x, y, gridL, gridC){
    this.x = x;
    this.y = y;
    this.radius = WALLSIZE/10;

    this.gridL = gridL;
    this.gridC = gridC;


    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x+(WALLSIZE/2), this.y+(WALLSIZE/2), this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    };
}

function PowerPoint(x, y, gridL, gridC){
    this.x = x;
    this.y = y;

    this.gridL = gridL;
    this.gridC = gridC;

    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x+(WALLSIZE/2), this.y+(WALLSIZE/2), WALLSIZE/5, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    };  
}
