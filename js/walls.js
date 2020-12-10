function Wall(x, y ,width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.size = height;

    
    this.draw = (color) =>{
        ctx.beginPath();
        this.color = color;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.fill();
        ctx.closePath();
    };
}