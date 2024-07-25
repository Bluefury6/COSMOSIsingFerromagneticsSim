let n = Number(document.getElementById("size").value);
let T = Number(document.getElementById('temp').value);
let J = Number(document.getElementById('J').value);
let B = Number(document.getElementById('B').value);
let mode = document.getElementById('showenergies').checked;
let grid = [];
let AlgorithmLoop;
let running = false;
let colorNormalization = Math.abs(255/(16*J));

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let width, height;

if (screen.width >= screen.height) {
    width = window.innerHeight;
    height = window.innerHeight;
    document.getElementById("site").style.setProperty('flex-direction', 'row');
} else {
    width = screen.width;
    height = screen.width
    document.getElementById("site").style.setProperty('flex-direction', 'column');
}

canvas.width = width;
canvas.height = height;

let uWidth = Math.floor(width / n);

ctx.fillStyle = "rgb(0,0,0)";
for (let i = 0; i < n; i++) {
    let subArr = [];
    for (let j = 0; j < n; j++) {
        let spin = Math.random() > 0.5 ? 1 : -1;
        subArr.push(spin);
    }
    grid.push(subArr);
}

const getSpin = (pos) => {
    try {
        return grid[(pos["y"] + n) % n][(pos["x"] + n) % n];
    } catch (e) {
        console.log(e, pos);
        return 0;
    }
}

const addPos = (pos, pos2) => {
    return {x: pos["x"] + pos2["x"], y: pos["y"] + pos2["y"]};
}

const displayGrid = () => {
    mode = document.getElementById('showenergies').checked;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, 100000, 100000)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!mode) {
                let spin = grid[j][i];
                if (spin == -1) {
                    ctx.fillStyle = "rgb(0,0,0)";
                } else {
                    ctx.fillStyle = "rgb(255,255,255)";
                }
                ctx.fillRect(i*uWidth, j*uWidth, uWidth + 1, uWidth + 1);
            } else {
                let pos = {x: i, y: j};
                let energyEpsilon = getEnergyEpsilon(pos);
                if (energyEpsilon < 0) {
                    ctx.fillStyle = `rgb(${-colorNormalization*(energyEpsilon)}, 0, 0)`;
                } else {
                    ctx.fillStyle = `rgb(0, 0, ${colorNormalization*(energyEpsilon)})`;
                }
                ctx.fillRect(i*uWidth, j*uWidth, uWidth + 1, uWidth + 1);
            }
        }
    }
}

// metropole-hastings algorithm
const togglePlay = () => {
    running = !running;
}

const reset = () => {
    running = false;
    n = Number(document.getElementById("size").value);
    uWidth = Math.floor(width / n);

    ctx.fillStyle = "rgb(0,0,0)";
    grid = [];
    for (let i = 0; i < n; i++) {
        let subArr = [];
        for (let j = 0; j < n; j++) {
            let spin = Math.random() > 0.5 ? 1 : -1;
            subArr.push(spin);
        }
        grid.push(subArr);
    }

    displayGrid();
}

const getEnergyEpsilon = (pos) => {
    return 4 * J * getSpin(pos) * (
        getSpin(addPos(pos, { x: 1, y: 0 })) +
        getSpin(addPos(pos, { x: -1, y: 0 })) +
        getSpin(addPos(pos, { x: 0, y: 1 })) +
        getSpin(addPos(pos, { x: 0, y: -1 }))
    ) + 
    2 * getSpin(pos) * B;
}

const displayPixel = (i, j) => {
    if (!mode) {
        let spin = grid[j][i];
        if (spin == -1) {
            ctx.fillStyle = "rgb(0,0,0)";
        } else {
            ctx.fillStyle = "rgb(255,255,255)";
        }
        ctx.fillRect(i*uWidth, j*uWidth, uWidth + 1, uWidth + 1);
    } else {
        for (let X = i - 1; X <= i + 1; X++) {
            for (let Y = j - 1; Y <= j + 1; Y++) {
                let pos = {x: X % n, y: Y % n};
                let energyEpsilon = getEnergyEpsilon(pos);
                if (energyEpsilon < 0) {
                    ctx.fillStyle = `rgb(${-colorNormalization*(energyEpsilon)}, 0, 0)`;
                } else {
                    ctx.fillStyle = `rgb(0, 0, ${colorNormalization*(energyEpsilon)})`;
                }
                ctx.fillRect((X % n)*uWidth, (Y % n)*uWidth, uWidth + 1, uWidth + 1);
            }
        }
    }
}

displayGrid();
AlgorithmLoop = setInterval(() => {
    T = Number(document.getElementById('temp').value);
    J = Number(document.getElementById('J').value);
    colorNormalization = Math.abs(255/(16*J));
    B = Number(document.getElementById('B').value);

    mode = document.getElementById('showenergies').checked;
    document.getElementById("JLabel").innerHTML = `Ferromagnetivity Constant J: ${J}`;
    document.getElementById("sizeLabel").innerHTML = `Substance Side Length: ${n}<br>(Updates on Reset)`;
    document.getElementById("tempLabel").innerHTML = `Substance Temperature: ${T} Kelvin`;
    document.getElementById("BLabel").innerHTML = `Magnetic Field Strength: ${B}`;

    if (running) {
        let pos = {x: Math.floor((n)*Math.random()), y: Math.floor((n)*Math.random())};
        let energyEpsilon = getEnergyEpsilon(pos);

        if (energyEpsilon < 0) {
            grid[pos["y"]][pos["x"]] *= -1;
            displayPixel(pos['x'], pos['y']);
        } else {
            if (Math.random() < Math.exp(-(energyEpsilon / T))) {
                grid[pos["y"]][pos["x"]] *= -1;
                displayPixel(pos['x'], pos['y']);
            }
        }
    }
    }, 0);
