const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let lastX = 0;
let lastY = 0;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 描画設定
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);
canvas.addEventListener("mousemove", (e) => {
    if (drawing) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        lastX = e.offsetX;
        lastY = e.offsetY;
    }else{
        return;
    }
});

// クリア関数
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("result").innerText = " ";
}

// flask上のデータやり取り
function submit() {
    const image = canvas.toDataURL("image/png");
    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ image: image })
    })
    .then(res => res.json())
    .then(data => {
        const resultArea = document.getElementById("result");
        const preds = data.prediction;

        let html = "<table><tr><th>数字</th><th>確率</th></tr>";
        preds.forEach((prob, i) => {
            html += `<tr><td>${i}</td><td>${(prob * 100).toFixed(2)}%</td></tr>`;
        });
        html += "</table>";

        resultArea.innerHTML = html;
    })
    .catch(err => console.error("Prediction error:", err));
}
