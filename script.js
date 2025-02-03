// Convierte el estado en una cadena única para comparaciones
function encodeState(env) {
    return `${env.position}|${env.roomA}|${env.roomB}`;
}

// Objeto para rastrear estados visitados
let stateHistory = {};

// Definimos el número total de estados posibles
const MAX_STATES = 8;

// Lógica del agente reflexivo
function decideAction(position, condition) {
    if (condition === "SUCIO") return "LIMPIO";
    return position === "A" ? "DERECHA" : "IZQUIERDA";
}

// Función que ensucia una habitación con probabilidad controlada
function mayDirtyRoom(env) {
    const isBothClean = env.roomA === "LIMPIO" && env.roomB === "LIMPIO";
    const chance = isBothClean ? 0.7 : 0.3;

    if (Math.random() < chance) {
        const roomToDirty = Math.random() < 0.5 ? "roomA" : "roomB";
        if (env[roomToDirty] === "LIMPIO") {
            env[roomToDirty] = "SUCIO";
            document.getElementById("log").innerHTML += `<br><span style="color:red;">⚠️ Room ${roomToDirty === "roomA" ? "A" : "B"} is now SUCIO!</span>`;
        }
    }
}

// Ejecuta la simulación
function runSimulation(env) {
    let prevStateCount = Object.keys(stateHistory).length;
    let currentState = encodeState(env);
    stateHistory[currentState] = true;
    
    let newStateCount = Object.keys(stateHistory).length;

    if (newStateCount > prevStateCount) {
        document.getElementById("log").innerHTML += `<br><b>🌍 New state visited: ${currentState} (${newStateCount})</b>`;
    }

    let currentLocation = env.position;
    let currentCondition = currentLocation === "A" ? env.roomA : env.roomB;
    let action = decideAction(currentLocation, currentCondition);

    document.getElementById("log").innerHTML += `<br>📌 Position: ${currentLocation} | Action: ${action} | Other Room: ${(currentLocation === "A" ? env.roomB : env.roomA)}`;

    // Ejecuta la acción seleccionada
    if (action === "LIMPIO") {
        if (currentLocation === "A") env.roomA = "LIMPIO";
        else env.roomB = "LIMPIO";
    } else if (action === "DERECHA") {
        env.position = "B";
    } else if (action === "IZQUIERDA") {
        env.position = "A";
    }

    // Si se mueve, hay posibilidad de ensuciar una habitación
    if (action.includes("MOVIMIENTO")) {
        mayDirtyRoom(env);
    }

    // Verifica si se visitaron todos los estados
    if (newStateCount === MAX_STATES) {
        document.getElementById("log").innerHTML += "<br>✅ All possible states have been visited!";
        
        // Última limpieza si es necesario
        if (env.roomA === "SUCIO" || env.roomB === "SUCIO") {
            setTimeout(() => runSimulation(env), 2000);
        } else {
            document.getElementById("log").innerHTML += "<br>🏆 Cleaning completed!";
            return;
        }
    } else {
        setTimeout(() => runSimulation(env), 2000);
    }
}

// Iniciar la simulación con un estado inicial
let environment = { position: "A", roomA: "SUCIO", roomB: "SUCIO" };
runSimulation(environment);
