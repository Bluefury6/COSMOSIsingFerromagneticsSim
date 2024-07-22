let n = 35;
let T = 1
let J = 1;
let mode = true;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let width, height;

// if (screen.width >= screen.height) {
//     width = screen.height*0.7;
//     height = screen.height*0.7;
// } else {
//     width = screen.width*0.7;
//     height = screen.width*0.7;
// }

width = window.innerHeight;
height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let uWidth = width / n;

ctx.fillStyle = "rgb(0,0,0)";
let grid = [];
for (let i = 0; i < n; i++) {
    let subArr = [];
    for (let j = 0; j < n; j++) {
        let spin = Math.round(2*Math.random() - 1);
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
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, 100000, 100000)
    ctx.fillStyle = "rgb(0,0,0)";
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!mode) {
                let spin = grid[j][i];
                if (spin == -1) {
                    ctx.fillRect(j*uWidth, i*uWidth, uWidth + 1, uWidth + 1);
                }
            } else {
                let pos = {x: j, y: i};
                let energyEpsilon = 4*J*getSpin(pos)*(
                    getSpin(addPos(pos, {x: 1, y: 0})) + 
                    getSpin(addPos(pos, {x: -1, y: 0})) + 
                    getSpin(addPos(pos, {x: 0, y: 1})) + 
                    getSpin(addPos(pos, {x: 0, y: -1}))
                );
                if (energyEpsilon < 0) {
                    ctx.fillStyle = `rgb(${-20*(energyEpsilon)}, 0, 0)`;
                } else {
                    ctx.fillStyle = `rgb(0, 0, ${20*(energyEpsilon)})`;
                }
                ctx.fillRect(j*uWidth, i*uWidth, uWidth + 1, uWidth + 1);
            }
        }
    }
}

let num = 0;
// metropole-hastings algorithm
const play = () => {
    let AlgorithmLoop = setInterval(() => {
        mode = document.getElementById('showenergies').checked;
        T = document.getElementById('temp').value;
        J = document.getElementById('J').value;

        let pos = {x: Math.round((n - 1)*Math.random()), y: Math.round((n - 1)*Math.random())};
        let energyEpsilon = 4*J*getSpin(pos)*(
            getSpin(addPos(pos, {x: 1, y: 0})) + 
            getSpin(addPos(pos, {x: -1, y: 0})) + 
            getSpin(addPos(pos, {x: 0, y: 1})) + 
            getSpin(addPos(pos, {x: 0, y: -1}))
        );
    
        if (energyEpsilon < 0) {
            grid[pos["y"]][pos["x"]] *= -1;
        } else {
            if (Math.random() < 2.71**(-(energyEpsilon / T))) {
                grid[pos["y"]][pos["x"]] *= -1;
            }
        }
    
        displayGrid();
        
        num++;
        //console.log(num);
    }, 0)
}

displayGrid();
