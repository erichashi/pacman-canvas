class StateMachine{

    constructor(states){
        this.empty = {
            render: () => {},
            update: () => {},
            enter: () => {},
            exit: () => {},
        }
        this.states = states ? states : {};
        this.current = this.empty;
    }
    
    change(stateName, enterParams){
        this.current.exit();
        this.current = this.states[stateName]();
        this.current.enter(enterParams);
    }

    update() {
        this.current.update();
    }
}