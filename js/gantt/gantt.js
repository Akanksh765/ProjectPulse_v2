function drawCustomGantt() {

    const container = document.getElementById("ganttContainer") || document.getElementById("gantt");

    if (!container) {
        console.warn("Gantt container not found (#ganttContainer or #gantt)");
        return;
    }

    container.innerHTML = "";

    if (Project.tasks.length === 0) return;

    //----------------------------------------------------
    // Find Project Start and End
    //----------------------------------------------------

    let minDate = new Date(Project.tasks[0].startDate);
    let maxDate = new Date(Project.tasks[0].endDate);

    Project.tasks.forEach(task => {
        if (task.startDate < minDate) minDate = new Date(task.startDate);
        if (task.endDate > maxDate) maxDate = new Date(task.endDate);
    });

    //----------------------------------------------------
    // Number of days
    //----------------------------------------------------

    const dayWidth = 35;
    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

    //----------------------------------------------------
    // Main Grid
    //----------------------------------------------------

    const table = document.createElement("table");
    table.className = "ganttTable";

    //----------------------------------------------------
    // Header - Dual row: Month / Week-Day
    //----------------------------------------------------

    const thead = document.createElement("thead");

    // Row 1: Month headers (spanning weeks)
    const monthRow = document.createElement("tr");
    monthRow.className = "ganttHeaderMonth";

    const monthTh = document.createElement("th");
    monthTh.innerHTML = "Task";
    monthRow.appendChild(monthTh);

    // Row 2: Day headers
    const dayRow = document.createElement("tr");
    dayRow.className = "ganttHeaderDay";

    const dayTh = document.createElement("th");
    dayTh.innerHTML = "";
    dayRow.appendChild(dayTh);

    let currentMonth = null;
    let monthStartCol = 1;
    let colIndex = 1;

    for (let i = 0; i < totalDays; i++) {
        const current = new Date(minDate);
        current.setDate(current.getDate() + i);

        const isWeekendDay = current.getDay() === 0 || current.getDay() === 6;

        // Day cell
        const h = document.createElement("th");
        h.style.minWidth = dayWidth + "px";
        h.innerHTML = current.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short"
        });
        h.title = current.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        if (isWeekendDay) h.classList.add("weekend");
        dayRow.appendChild(h);

        // Month tracking for row 1
        const monthKey = current.getFullYear() + "-" + current.getMonth();
        if (monthKey !== currentMonth) {
            // Close previous month span
            if (currentMonth !== null) {
                const span = monthRow.children[monthStartCol];
                if (span) span.colSpan = colIndex - monthStartCol;
            }
            currentMonth = monthKey;
            monthStartCol = colIndex;

            // Create new month header cell
            const monthCell = document.createElement("th");
            monthCell.innerHTML = current.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric"
            });
            monthCell.style.minWidth = dayWidth + "px";
            monthRow.appendChild(monthCell);
        }
        colIndex++;
    }
    // Close last month span
    if (currentMonth !== null) {
        const span = monthRow.children[monthStartCol];
        if (span) span.colSpan = colIndex - monthStartCol;
    }

    thead.appendChild(monthRow);
    thead.appendChild(dayRow);
    table.appendChild(thead);

    //----------------------------------------------------
    // Body
    //----------------------------------------------------

    const tbody = document.createElement("tbody");

    Project.tasks.forEach(task => {
        const row = document.createElement("tr");

        // Task name cell
        const taskCell = document.createElement("td");
        taskCell.className = "taskName";
        taskCell.innerHTML = task.activity;
        taskCell.title = `ID: ${task.id} | ${task.activity}`;
        row.appendChild(taskCell);

        // Grid cells
        for (let d = 0; d < totalDays; d++) {
            const cell = document.createElement("td");
            cell.className = "gridCell";
            const cellDate = new Date(minDate);
            cellDate.setDate(cellDate.getDate() + d);
            if (cellDate.getDay() === 0 || cellDate.getDay() === 6) {
                cell.classList.add("weekend");
            }
            row.appendChild(cell);
        }

        // Calculate bar position
        const offset = Math.floor((task.startDate - minDate) / (1000 * 60 * 60 * 24));
        const duration = Math.floor((task.endDate - task.startDate) / (1000 * 60 * 60 * 24)) + 1;

        // Create bar with progress
        const barContainer = document.createElement("div");
        barContainer.className = "ganttBarContainer";
        barContainer.style.cssText = `
            position: absolute;
            left: 0;
            width: ${duration * dayWidth}px;
            height: 22px;
            top: 10px;
            border-radius: 4px;
            overflow: hidden;
        `;

        // Status-based background color
        const status = task.status || "Not Started";
        barContainer.style.backgroundColor = statusColor(status);

        // Progress overlay
        if (task.progress && task.progress > 0) {
            const progressBar = document.createElement("div");
            progressBar.className = "ganttProgress";
            progressBar.style.cssText = `
                height: 100%;
                width: ${task.progress}%;
                background: rgba(255,255,255,0.3);
                border-radius: 4px 0 0 4px;
                transition: width 0.3s ease;
            `;
            if (task.progress === 100) {
                progressBar.style.borderRadius = "4px";
            }
            barContainer.appendChild(progressBar);
        }

        // Task label inside bar
        if (duration * dayWidth > 60) {
            const label = document.createElement("span");
            label.className = "ganttBarLabel";
            label.style.cssText = `
                position: absolute;
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
                color: white;
                font-size: 11px;
                font-weight: 500;
                white-space: nowrap;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                pointer-events: none;
            `;
            label.textContent = task.activity;
            barContainer.appendChild(label);
        }

        // Tooltip
        barContainer.title = `${task.activity}\n${formatDate(task.startDate)} - ${formatDate(task.endDate)}\nProgress: ${task.progress}%\nStatus: ${status}`;

        // Append bar to the first day cell of the task
        const firstCell = row.children[offset + 1];
        if (firstCell) {
            firstCell.style.position = "relative";
            firstCell.appendChild(barContainer);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    //----------------------------------------------------
    // Today Marker
    //----------------------------------------------------

    addTodayMarker(container, minDate, dayWidth, totalDays);
}

// Backward-compatible alias expected by callers
function drawGantt() {
    drawCustomGantt();
}

/*=========================================================
            Today Marker
=========================================================*/

function addTodayMarker(container, minDate, dayWidth, totalDays) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - min) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < totalDays) {
        const table = container.querySelector(".ganttTable");
        if (!table) return;

        const taskColWidth = table.rows[0].cells[0].offsetWidth;

        const marker = document.createElement("div");
        marker.className = "todayLine";
        marker.style.cssText = `
            position: absolute;
            left: ${taskColWidth + diffDays * dayWidth}px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #ef4444;
            z-index: 100;
            pointer-events: none;
        `;

        const tooltip = document.createElement("div");
        tooltip.style.cssText = `
            position: absolute;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            pointer-events: none;
        `;
        tooltip.textContent = "Today: " + today.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        marker.appendChild(tooltip);

        // Insert into the table header area
        table.style.position = "relative";
        table.appendChild(marker);
    }
}
