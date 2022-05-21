//Generic helpers

function getQuantityFromMaze(n){
    let count=0;
    maze.forEach((row, i) => {
        row.forEach((column, j) => {
            if (maze[i][j] === n) count++;
        });
    })
    return count;
}
function randomIntFromRange(min,max){
    return Math.floor(Math.random()*(max-min+1) + min);
}
function writeTextCanvas(text, x, y, color, size){
    ctx.font = `${size}px Verdana`;
    ctx.fillStyle = color;
    ctx.fillText(`${text}`, x, y); 
    ctx.fill();
}



//Helper functions in updates

function touchPacman(pacx, pacy, ghostx, ghosty) {
    return (
        pacy + PACSIZE >= ghosty &&
        pacy <= ghosty + GHOSTSIZE &&
        pacx <= ghostx + GHOSTSIZE &&
        pacx + PACSIZE >= ghostx
        );
}

function sameCoordinates(aL, aC, bL, bC){
    //Return true if coordinates are the same
    return  (aL === bL && aC === bC )
}


// function drawMaze() {
    
//     //Cria o mapa GUI de acordo com os números do maze

//     //0: Point
//     //1: Wall
//     //2: Ghost
//     //5: Power Point
//     //6: Pacman
//     //7: Texto ('Ready')
//     //Resto: blank

//     ctx.fillStyle = "white";

//     maze.forEach((row, rowindex) => {
//       row.forEach((cell, colindex) => {

//         // let width = WALLSIZE;
//         // let height = WALLSIZE;

    
//         if (cell === 0){
//             //diferenças entre numpts e NUMPTS garante que quando morto, o jogo reinicie com os pontos no mapa salvos.

//             //No início da rodada, numpts === NUMPTS
//             //Os pontos vão diminuindo na medida que a array 'points' vai diminuindo

//             if(numpts <= NUMPTS){
//                 points.push(new Point(rowindex, colindex));
//                 numpts++;
//             }
//         } else if (cell === 5){

            
//             if(numppts <= NUMPPTS){
//                 powerpoints.push(new PowerPoint(rowindex, colindex));
//                 numppts++;
//             }
            
//         }
//         else if (cell === 6) pacman = new Pacman(rowindex, colindex);
//         else if (cell === 2) ghosts.push(new Ghost(rowindex, colindex))
         

//       });
//     });
// }
