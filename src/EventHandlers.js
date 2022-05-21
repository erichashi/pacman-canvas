function wasPressed(key){
    return keysPressed[key];
}

document.addEventListener('keydown', e =>{
    if(e.keyCode === 32 && e.ctrlKey){
        pause = !pause;
        update();
    } 

    keysPressed[e.code] = true;

})


//https://stackoverflow.com/questions/53192433/how-to-detect-swipe-in-javascript
let initialX = null;
let initialY = null;

document.addEventListener("touchstart", e => {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}, false);

document.addEventListener("touchmove", e => {
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
            keysPressed['ArrowLeft'] = true;
        } else {
            // swiped right
            keysPressed['ArrowRight'] = true;
        }  
    } else {
        // sliding vertically
        if (diffY > 0) {
            // swiped up
            keysPressed['ArrowUp'] = true;
        } else {
            // swiped down
            keysPressed['ArrowDown'] = true;
        }  
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
}, false);