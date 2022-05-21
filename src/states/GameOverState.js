class GameOverState extends BaseState{
    constructor(){
        super();
    
        gHTMLElements['lifecontainer'].innerHTML = "";
        
        gHTMLElements['startbtn'].style.opacity = '1';
        gHTMLElements['startbtn'].innerHTML = 'restart';
        gHTMLElements['startbtn'].disabled = false;
        
        gHTMLElements['centercontainer'].style.display = 'block';
        gHTMLElements['centercontainer'].style.color = 'red';
        gHTMLElements['centercontainer'].innerHTML = 'gameover';

    }

    enter(params){
        if(params.score > localStorage.getItem('recordpac')*1) localStorage.setItem('recordpac', params.score);
        gHTMLElements['recordtext'].innerHTML = localStorage.getItem('recordpac');
    }
    
    update(){
        pause = true;
    }

    start(){

        gHTMLElements['startbtn'].innerHTML = 'start',
        
        gStateMachine.change('title');        
        pause = false;
        update();
       
            

    };
}
