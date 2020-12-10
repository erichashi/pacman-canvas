document.addEventListener('keydown', e =>{
    if(e.keyCode == 32 && !preventspace){
        pause = !pause;
        update();
    } else {
        pacman.keyMove(e.keyCode);
    }
})

document.addEventListener('resize', () => { 
    canvas.height = body.clientHeight/1.345;
    WALLSIZE = (canvas.height)/BLOCKSHEIGHT;
    canvas.width = WALLSIZE * BLOCKSWIDTH;
    // update();
})


https://stackoverflow.com/questions/53192433/how-to-detect-swipe-in-javascript

document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
let initialX = null;
let initialY = null;

function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};

function moveTouch(e) {
    if (initialX === null) {
        return;
    }

    if (initialY === null) {
        return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // sliding horizontally
        if (diffX > 0) {
            // swiped left
            // console.log("swiped left");
            pacman.keyMove(37);
        } else {
            // swiped right
            // console.log("swiped right");
            pacman.keyMove(39);
        }  
    } else {
        // sliding vertically
        if (diffY > 0) {
            // swiped up
            // console.log("swiped up");
            pacman.keyMove(38);
        } else {
            // swiped down
            // console.log("swiped down");
            pacman.keyMove(40);
        }  
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
};