"use strict";

var score = 0,
    gear = 1,
    player = [],
    playerMove = 0,
    playerSwitch = 1,
    obstacles = [],
    lanes = [],
    running = false,
    crashed = false,
    canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    scoreCount = document.getElementById("stats--score"),
    gearCount = document.getElementById("stats--gear"),
    crashNotice = document.getElementById("notice--crash"),
    data = new Data();

const cleanWindow = () => {
    context.clearRect(0, 0, data.canvas.width, data.canvas.height);
};
const makeLanes = () => {
    let diff = data.canvas.height - data.lane.height,
        injections = [[data.lane.llane, diff, data.lane.width, data.lane.height],
                [data.lane.rlane, diff, data.lane.width, data.lane.heihgt]];

    while (diff >= 0) {
        lanes.push(injections);
        diff -= data.lane.distance;
    }
};
const generatePlayer = () => {
    player = [data.pc.position.x, data.pc.position.y, data.pc.width, data.pc.height];
};
const generateNPC = () => {
    let density = 0;
    while(density < (Math.random() < 0.5 ? 1: 2)) {
        let spawnPoint = data.positions[Math.floor(Math.random() * 3)],
            obstacle = [spawnPoint, data.npc.height * -1];

        if (obstacles.length > 0) {
            if (spawnPoint === obstacles[obstacles.length - 1][1]) {
                density--;
            } else {
                obstacles.push(obstacle);
            } 
        } else {
            obstacles.push(obstacle);
        }
        density++;
    }
};
const drawPlayer = () => {
    if ((playerSwitch > 0 && playerSwitch < 3) && playerMove > 0) {
        if (playerSwitch === 1) {
            if (playerMove > player[0]) {
                player[0] = playerMove;
                playerMove = 0;
                playerSwitch = 0;
            } else 
                player[0] -= data.pc.switch;
        } else {
            if(playerMove < player[0]) {
                player[0] = playerMove;
                playerMove = 0;
                playerSwitch = 0;
            } else 
            player[0] += data.pc.switch;
        }
    }
    context.drawImage(data.pc.design, ...player);
};
const drawNPC = () => {
    let remove = false;
    obstacles.forEach((obstacle, index) => {
        if (data.canvas.height < obstacle[1]) {
            remove = index;
        } else
            obstacle[1] += data.speed;
        
        context.drawImage(data.npc.design, ...obstacle, data.npc.width, data.npc.height);
    });

    if (obstacles[obstacles.length -1][1] > data.npc.distance)
        generateNPC();
    
    if (remove) 
        obstacles.splice(remove, 1);
};
const drawLanes = () => {
    let remove = false,
        injections = [[data.lane.llane, (data.lane.height * -1), data.lane.width, data.lane.height],
                [data.lane.rlane, (data.lane.height * -1), data.lane.width, data.lane.height]];
    context.fillStyle = data.lane.color;

    lanes.forEach((lane, index) => {
        context.fillRect(...lane[0]);
        context.fillRect(...lane[1]);

        if (lane[0][1] > data.canvas.height) {
            remove = index;
        } else {
            lane[0][1] += data.speed;
            lane[1][1] += data.speed;
        }
    });

    if (lanes[lanes.length -1][0][1] > data.lane.distance - data.lane.height)
        lanes.push(injections);

    if (remove)
        lanes.splice(remove, 1);
};
const scoreCounter = () => {
    score += (data.speed / 5) - 1;
    scoreCount.innerHTML = score;
};
const crashSensor = () => {
    obstacles.forEach((obstacle, index) => {
        let collison = (data.flag + player[0] <= data.npc.width + obstacle[0])
                    && (data.pc.width + player[0] - data.flag >= obstacle[0])
                    && (data.flag + player[1] <= obstacle[1] + data.npc.height)
                    && (data.npc.height + player[1] - data.flag >= obstacle[1]);
        if (collison) {
            crashed = true;
            running = false;
            crashNotice.classList.remove("disable");
        }
    });
};
const draw = callback => {
    setTimeout(() => {
        requestAnimationFrame(draw);
        if (!crashed && running) {
            cleanWindow();
            drawLanes();
            drawPlayer();
            drawNPC();
            crashSensor();
            scoreCounter();
            
        }
    }, 1000 / data.fps);
};
const initiate = () => {
    crashed = false;
    score = 0;
    gear = 1;
    data.speed = 10;
    playerMove = 0;
    playerSwitch = 0;
    lanes = [];
    player = [];
    obstacles = [];
    gearCount.innerHTML = gear;
    makeLanes();
    generatePlayer();
    generateNPC();
    cleanWindow();
};

window.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        if (!running) {
            running = true;
            crashNotice.classList.add("disable");

            initiate();
        }
    }

    if (event.keyCode === 38) {
        if (data.speed < 30) {
            gear += 1;
            gearCount.innerHTML = gear;
            data.speed += 5;
        }
    }

    if (event.keyCode === 40) {
        if (data.speed > 10) {
            gear -= 1;
            gearCount.innerHTML = gear;
            data.speed -= 5;
        }
    }

    if ( playerMove <= 0 && playerSwitch <= 0) {
        if (event.keyCode === 37) {
            if (player[0] == data.positions[1]) {
                playerMove = data.positions[0];
                playerSwitch = 1;
            } else if (player[0] === data.positions[2]) {
                playerMove = data.positions[1];
                playerSwitch = 1;
            }
        } else if (event.keyCode === 39) {
            if (player[0] == data.positions[0]) {
                playerMove = data.positions[1];
                playerSwitch = 2;
            } else if (player[0] === data.positions[1]) {
                playerMove = data.positions[2];
                playerSwitch = 2;
            }
        }
    }
});

draw();