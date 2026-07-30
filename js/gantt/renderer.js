/*=========================================================
            Canvas Renderer
=========================================================*/

function renderGantt() {

    const ctx = Gantt.ctx;

    ctx.clearRect(
        0,
        0,
        Gantt.canvas.width,
        Gantt.canvas.height
    );

    drawBackground();

    drawHeader();

    drawGrid();

}

function drawBackground() {

    const ctx = Gantt.ctx;

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(

        0,

        0,

        Gantt.canvas.width,

        Gantt.canvas.height

    );

}
function drawHeader() {

    const ctx = Gantt.ctx;

    ctx.fillStyle = "#f4f4f4";

    ctx.fillRect(

        0,

        0,

        Gantt.canvas.width,

        Gantt.headerHeight

    );

}

function drawGrid() {

    const ctx = Gantt.ctx;

    ctx.strokeStyle = "#e0e0e0";

    for (

        let d = 0;

        d <= Gantt.totalDays;

        d++

    ) {

        const x =

            Gantt.activityWidth +

            d * Gantt.dayWidth;

        ctx.beginPath();

        ctx.moveTo(

            x,

            Gantt.headerHeight

        );

        ctx.lineTo(

            x,

            Gantt.canvas.height

        );

        ctx.stroke();

    }

}
