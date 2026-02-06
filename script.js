const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cx = canvas.width / 2;
const cy = canvas.height / 2;

let forces = [];

/* ---------- AXES ---------- */
function drawAxes() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(canvas.width, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, canvas.height);
    ctx.stroke();

    ctx.fillText("+X", canvas.width - 30, cy - 5);
    ctx.fillText("-X", 10, cy - 5);
    ctx.fillText("+Y", cx + 5, 15);
    ctx.fillText("-Y", cx + 5, canvas.height - 10);
}

function drawOrigin() {
    drawAxes();
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
}
drawOrigin();

/* ---------- ADD FORCE ---------- */
function addForce() {
    const F = Number(document.getElementById("force").value);
    const angle = Number(document.getElementById("angle").value);

    if (isNaN(F) || isNaN(angle)) {
        alert("Enter valid values");
        return;
    }

    const rad = angle * Math.PI / 180;
    const Fx = F * Math.cos(rad);
    const Fy = F * Math.sin(rad);

    forces.push({F, angle, Fx, Fy});
    updateAll();
}

/* ---------- UPDATE ---------- */
function updateAll() {
    updateTable();
    updateSteps();
    redraw();
}

/* ---------- TABLE ---------- */
function updateTable() {
    const table = document.getElementById("forceTable");
    table.innerHTML =
        `<tr><th>No</th><th>Force</th><th>Angle</th><th>Fx</th><th>Fy</th></tr>`;

    forces.forEach((f, i) => {
        table.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${f.F.toFixed(2)}</td>
            <td>${f.angle.toFixed(2)}</td>
            <td>${f.Fx.toFixed(2)}</td>
            <td>${f.Fy.toFixed(2)}</td>
        </tr>`;
    });
}

/* ---------- STEPS ---------- */
function updateSteps() {
    const steps = document.getElementById("steps");
    steps.innerHTML = "";

    forces.forEach((f, i) => {
        steps.innerHTML += `
        <p><b>Force ${i + 1}</b><br>
        Fx = ${f.F} cos(${f.angle}) = ${f.Fx.toFixed(2)} N<br>
        Fy = ${f.F} sin(${f.angle}) = ${f.Fy.toFixed(2)} N</p>`;
    });
}

/* ---------- DRAW ANGLE (NO OVERLAP) ---------- */
function drawAngle(angleDeg, index) {
    if (angleDeg === 0) return;

    const baseRadius = 30;
    const gap = 15;                   // distance between angle arcs
    const radius = baseRadius + index * gap;

    const end = angleDeg * Math.PI / 180;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, -end, angleDeg > 0);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    const mid = end / 2;
    const tx = cx + (radius + 8) * Math.cos(mid);
    const ty = cy - (radius + 8) * Math.sin(mid);

    ctx.fillStyle = "black";
    ctx.fillText(angleDeg + "°", tx, ty);
}

/* ---------- DRAW VECTOR ---------- */
function drawVector(Fx, Fy, color, label="") {
    const scale = 1;   // SMALL forces (textbook style)
    const x = cx + Fx * scale;
    const y = cy - Fy * scale;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    const ang = Math.atan2(cy - y, x - cx);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8 * Math.cos(ang - 0.3), y + 8 * Math.sin(ang - 0.3));
    ctx.lineTo(x - 8 * Math.cos(ang + 0.3), y + 8 * Math.sin(ang + 0.3));
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.fillText(label, x + 5, y + 5);
}

/* ---------- REDRAW ---------- */
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOrigin();

    let sumFx = 0, sumFy = 0;

    forces.forEach((f, i) => {
        drawVector(f.Fx, f.Fy, "red", f.F + "N");
        drawAngle(f.angle, i);        // NON-OVERLAPPING angles
        sumFx += f.Fx;
        sumFy += f.Fy;
    });

    drawVector(sumFx, sumFy, "blue", "R");

    const R = Math.sqrt(sumFx * sumFx + sumFy * sumFy);
    const theta = Math.atan2(sumFy, sumFx) * 180 / Math.PI;

    document.getElementById("result").innerHTML =
        `ΣFx = ${sumFx.toFixed(2)} N , ΣFy = ${sumFy.toFixed(2)} N<br>
         <b>Resultant = ${R.toFixed(2)} N</b><br>
         <b>Direction = ${theta.toFixed(2)}°</b>`;
}

/* ---------- CLEAR ---------- */
function clearAll() {
    forces = [];
    document.getElementById("steps").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    updateTable();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOrigin();
}
