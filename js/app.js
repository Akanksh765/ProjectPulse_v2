/*=========================================================
                ProjectPulse V2
                  app.js
=========================================================*/

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {

    renderSidebar();

    renderDashboard();

    attachEvents();

}


/*=========================================================
                Sidebar
=========================================================*/

function renderSidebar() {

    document.getElementById("sidebar").innerHTML = `

    <div class="sidebar">

        <div class="logo">

            <i class="fa-solid fa-diagram-project"></i>

            <span>ProjectPulse</span>

        </div>

        <div class="menu">

            <div class="menuItem active">
                <i class="fa-solid fa-chart-line"></i>
                Dashboard
            </div>

            <div class="menuItem">
                <i class="fa-solid fa-list-check"></i>
                Tasks
            </div>

            <div class="menuItem">
                <i class="fa-solid fa-calendar-days"></i>
                Gantt
            </div>

            <div class="menuItem">
                <i class="fa-solid fa-chart-pie"></i>
                Analytics
            </div>

            <div class="menuItem">
                <i class="fa-solid fa-triangle-exclamation"></i>
                Risks
            </div>

            <div class="menuItem">
                <i class="fa-solid fa-file-export"></i>
                Reports
            </div>

        </div>

        <div class="profile">

            <div class="avatar">

                PP

            </div>

            <div class="userInfo">

                <span>Project Manager</span>

                <span>ProjectPulse V2</span>

            </div>

        </div>

    </div>

    `;

}


/*=========================================================
                Dashboard Layout
=========================================================*/

function renderDashboard() {

    document.getElementById("dashboard").innerHTML = `

<div class="dashboard">

    <div class="header">

        <h1>Project Dashboard</h1>

        <div class="actions">

            <input
                type="text"
                class="searchBox"
                id="searchBox"
                placeholder="Search Activity...">

            <label
                class="uploadBtn"
                for="excelFile">

                <i class="fa-solid fa-upload"></i>

                Upload Excel

            </label>

            <input
                type="file"
                id="excelFile"
                accept=".xlsx,.xls">

        </div>

    </div>


    <div class="cards">

        <div class="card">

            <div class="cardTitle">

                Total Tasks

            </div>

            <div
                class="cardValue"
                id="totalTasks">

                0

            </div>

        </div>


        <div class="card">

            <div class="cardTitle">

                Progress

            </div>

            <div
                class="cardValue"
                id="projectProgress">

                0%

            </div>

        </div>


        <div class="card">

            <div class="cardTitle">

                Delayed Tasks

            </div>

            <div
                class="cardValue"
                id="delayedTasks">

                0

            </div>

        </div>


        <div class="card">

            <div class="cardTitle">

                Project Health

            </div>

            <div
                class="cardValue"
                id="projectHealth">

                100%

            </div>

        </div>


        <div class="card">

            <div class="cardTitle">

                Project Finish

            </div>

            <div
                class="cardValue"
                id="projectFinish">

                --

            </div>

        </div>

    </div>


    <div class="tableContainer">

        <h3 class="sectionTitle">

            Project Tasks

        </h3>

        <table class="projectTable">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Activity</th>

                    <th>Owner</th>

                    <th>Status</th>

                    <th>Progress</th>

                    <th>Start</th>

                    <th>Finish</th>

                    <th>Duration</th>

                </tr>

            </thead>

            <tbody id="taskTable">

            </tbody>

        </table>

    </div>


    <div class="ganttContainer">

        <div
            style="display:flex;
                   justify-content:space-between;
                   align-items:center;">

            <h3>

                Project Timeline

            </h3>

            <select id="zoomLevel">

                <option value="day">Day</option>

                <option value="week" selected>Week</option>

                <option value="month">Month</option>

            </select>

        </div>

        <br>

        <div class="ganttContainer">

    <div
        style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:15px;
        ">

        <h3>Project Timeline</h3>

        <select id="zoomLevel">

            <option value="day">Day</option>

            <option value="week" selected>Week</option>

            <option value="month">Month</option>

        </select>

    </div>

    <div id="ganttContainer">

        <canvas id="ganttCanvas"></canvas>

    </div>

</div>

    </div>

</div>

`;

}


/*=========================================================
            Event Listeners
=========================================================*/

function attachEvents() {

    const search = document.getElementById("searchBox");

    if (search) {

        search.addEventListener("keyup", function () {

            filterTasks(this.value);

        });

    }


    const zoom = document.getElementById("zoomLevel");

    if (zoom) {

        zoom.addEventListener("change", function () {

            if (typeof drawGantt === "function") {

                drawGantt();

            }

        });

    }

}


/*=========================================================
                Search
=========================================================*/

function filterTasks(keyword) {

    keyword = keyword.toLowerCase();

    const rows = document.querySelectorAll("#taskTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)

                ? ""

                : "none";

    });

}
