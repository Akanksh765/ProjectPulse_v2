/*=========================================================
                ProjectPulse V2
                dashboard.js
=========================================================*/


/*=========================================================
                Dashboard Refresh
=========================================================*/

function updateDashboard() {

    updateKPIs();

    updateTaskTable();

}


/*=========================================================
                KPI Cards
=========================================================*/

function updateKPIs() {

    const totalTasks = Project.tasks.length;

    const completedTasks = Project.tasks.filter(
        t => t.status === "Completed"
    ).length;

    const delayedTasks = Project.tasks.filter(
        t => t.status === "Delayed"
    ).length;

    const progress = totalTasks === 0
        ? 0
        : Math.round(

            Project.tasks.reduce(

                (sum, task) =>

                sum + task.progress,

                0

            ) / totalTasks

        );

    const health = calculateHealth();


    document.getElementById("totalTasks").textContent =
        totalTasks;

    document.getElementById("projectProgress").textContent =
        progress + "%";

    document.getElementById("delayedTasks").textContent =
        delayedTasks;

    document.getElementById("projectHealth").textContent =
        health + "%";


    if (Project.projectEnd) {

        document.getElementById("projectFinish").textContent =
            formatDate(Project.projectEnd);

    }

}


/*=========================================================
                Health Calculation
=========================================================*/

function calculateHealth() {

    if (Project.tasks.length === 0)
        return 100;

    let score = 100;

    Project.tasks.forEach(task => {

        if (task.status === "Delayed")
            score -= 5;

        if (task.priority === "High" &&
            task.status === "Delayed")
            score -= 3;

    });

    if (score < 0)
        score = 0;

    return score;

}


/*=========================================================
                Task Table
=========================================================*/

function updateTaskTable() {

    const tbody =
        document.getElementById("taskTable");

    tbody.innerHTML = "";

    Project.tasks.forEach(task => {

        tbody.innerHTML += `

        <tr>

            <td>${task.id}</td>

            <td>${task.activity}</td>

            <td>${task.owner}</td>

            <td>

                <span class="${statusClass(task.status)}">

                    ${task.status}

                </span>

            </td>

            <td>

                ${task.progress}%

            </td>

            <td>

                ${formatDate(task.startDate)}

            </td>

            <td>

                ${formatDate(task.endDate)}

            </td>

            <td>

                ${task.duration} Week(s)

            </td>

        </tr>

        `;

    });

}


/*=========================================================
            Status CSS Classes
=========================================================*/

function statusClass(status) {

    switch (status) {

        case "Completed":

            return "statusCompleted";

        case "In Progress":

            return "statusProgress";

        case "Delayed":

            return "statusDelayed";

        default:

            return "statusNotStarted";

    }

}


/*=========================================================
            Dashboard Summary
=========================================================*/

function dashboardSummary() {

    console.log("--------------------------------");

    console.log("Project Dashboard");

    console.log("--------------------------------");

    console.log(

        "Tasks :",

        Project.tasks.length

    );

    console.log(

        "Project Finish :",

        formatDate(Project.projectEnd)

    );

    console.log(

        "Health :",

        calculateHealth() + "%"

    );

    console.log(

        "Progress :",

        document.getElementById("projectProgress").textContent

    );

}


/*=========================================================
            Refresh Everything
=========================================================*/

function refreshDashboard() {

    updateDashboard();

    if (typeof drawGantt === "function") {

        drawGantt();

    }

}


/*=========================================================
            Project Statistics
=========================================================*/

function getProjectStatistics() {

    return {

        totalTasks:

            Project.tasks.length,

        completed:

            Project.tasks.filter(

                t => t.status === "Completed"

            ).length,

        delayed:

            Project.tasks.filter(

                t => t.status === "Delayed"

            ).length,

        inProgress:

            Project.tasks.filter(

                t => t.status === "In Progress"

            ).length,

        notStarted:

            Project.tasks.filter(

                t => t.status === "Not Started"

            ).length,

        projectStart:

            Project.projectStart,

        projectEnd:

            Project.projectEnd

    };

}


/*=========================================================
            Debug
=========================================================*/

function debugDashboard() {

    console.table(

        getProjectStatistics()

    );

}