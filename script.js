class VacuumWorld {
    constructor() {
        this.states = ["A", "SUCIO", "SUCIO"];
        this.visitedStates = new Set();
        this.TOTAL_STATES = 8;
        this.logger = new Logger();
    }

    getStateString() {
        return this.states.join(',');
    }

    getCurrentRoomState() {
        return this.states[0] === "A" ? this.states[1] : this.states[2];
    }

    getOtherRoomState() {
        return this.states[0] === "A" ? this.states[2] : this.states[1];
    }

    isComplete() {
        return this.visitedStates.size === this.TOTAL_STATES && 
               this.states[1] === "LIMPIO" && 
               this.states[2] === "LIMPIO";
    }

    areBothRoomsClean() {
        return this.states[1] === "LIMPIO" && this.states[2] === "LIMPIO";
    }

    registerState() {
        const previousSize = this.visitedStates.size;
        const currentState = this.getStateString();
        this.visitedStates.add(currentState);
        
        if (this.visitedStates.size > previousSize) {
            this.logger.logNewState(currentState, this.visitedStates.size);
        }
    }
}

class VacuumAgent {
    determineAction(location, state) {
        if (state === "SUCIO") return "LIMPIAR";
        if (location === "A") return "DERECHA";
        return "IZQUIERDA";
    }

    executeAction(action, world) {
        switch(action) {
            case "LIMPIAR":
                if (world.states[0] === "A") {
                    world.states[1] = "LIMPIO";
                } else {
                    world.states[2] = "LIMPIO";
                }
                break;
            case "DERECHA":
                world.states[0] = "B";
                this.randomlyDirty(world);
                break;
            case "IZQUIERDA":
                world.states[0] = "A";
                this.randomlyDirty(world);
                break;
        }
    }

    randomlyDirty(world) {
        const probability = world.areBothRoomsClean() ? 0.7 : 0.3;
        
        if (Math.random() < probability) {
            const roomIndex = Math.random() < 0.5 ? 1 : 2;
            if (world.states[roomIndex] === "LIMPIO") {
                world.states[roomIndex] = "SUCIO";
            }
        }
    }
}

class Logger {
    logNewState(state, count) {
        this.appendToLog(`<br><b><i>Nuevo estado #${count} visitado: ${state}</i></b>`);
    }

    logAction(location, action, otherRoomState) {
        this.appendToLog(`<br>Ubicación: ${location} , Acción: ${action} , Otro Estado de la habitación: ${otherRoomState}`);
    }

    logCompletion() {
        this.appendToLog("<br><b><i>Todos los estados han sido Visitados!</i></b>");
    }

    logCleaningComplete() {
        this.appendToLog("<br><b><i>Limpieza Completada!</i></b>");
    }

    appendToLog(message) {
        document.getElementById("log").innerHTML += message;
    }
}

class Simulation {
    constructor() {
        this.world = new VacuumWorld();
        this.agent = new VacuumAgent();
    }

    run() {
        this.world.registerState();

        const location = this.world.states[0];
        const currentState = this.world.getCurrentRoomState();
        const action = this.agent.determineAction(location, currentState);

        this.world.logger.logAction(
            location, 
            action, 
            this.world.getOtherRoomState()
        );

        this.agent.executeAction(action, this.world);

        if (this.world.visitedStates.size === this.world.TOTAL_STATES) {
            this.world.logger.logCompletion();
            
            if (!this.world.isComplete()) {
                setTimeout(() => this.run(), 2000);
            } else {
                this.world.logger.logCleaningComplete();
            }
        } else {
            setTimeout(() => this.run(), 2000);
        }
    }
}

// Iniciar la simulación
const simulation = new Simulation();
simulation.run();