/*=========================================================
    ProjectPulse V2
    Excel Import Engine
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("excelFile");

    if (input) {
        input.addEventListener("change", loadWorkbook);
    }

});


/*=========================================================
    Load Workbook
==========================================================*/

function loadWorkbook(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const workbook = XLSX.read(e.target.result, {
                type: "binary"
            });

            console.log("Workbook Loaded");
            console.log(workbook.SheetNames);

            let sheetName = "";

            if (workbook.SheetNames.includes("Project_Data")) {

                sheetName = "Project_Data";

            } else {

                sheetName = workbook.SheetNames[0];

            }

            console.log("Using Sheet :", sheetName);

            const worksheet = workbook.Sheets[sheetName];

            parseWorksheet(worksheet);

        }

        catch (error) {

            console.error(error);

            alert("Unable to read Excel File.");

        }

    };

    reader.readAsBinaryString(file);

}


/*=========================================================
    Parse Worksheet
==========================================================*/

function parseWorksheet(sheet) {

    const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: ""
    });

    console.table(rows);

    Project.tasks = [];

    rows.forEach(row => {

        const task = createTask(row);

        if (task != null) {

            Project.tasks.push(task);

        }

    });

    console.table(Project.tasks);

    validateTasks();

    runScheduler();

    updateDashboard();

    if (typeof drawGantt === "function") {

        drawGantt();

    }

}


/*=========================================================
    Create Task Object
==========================================================*/

function createTask(row) {

    if (!row.ID)
        return null;

    return {

        id: Number(row.ID),

        activity: row.Activity || "",

        startDate: excelDateToJSDate(row["Start Date"]),

        duration: Number(row.Duration || 0),

        endDate: excelDateToJSDate(row["End Date"]),

        dependencies: parseDependencies(row["Depends On"]),

        owner: row.Owner || "",

        status: row.Status || "Not Started",

        progress: Number(row.Progress || 0),

        priority: row.Priority || "Medium"

    };

}


/*=========================================================
    Dependency Parser
==========================================================*/

function parseDependencies(value) {

    if (
        value === "" ||
        value === "-" ||
        value == null
    ) {

        return [];

    }

    return value
        .toString()
        .split(",")
        .map(x => Number(x.trim()))
        .filter(x => !isNaN(x));

}


/*=========================================================
    Validate Tasks
==========================================================*/

function validateTasks() {

    Project.tasks.forEach(task => {

        if (!(task.startDate instanceof Date)) {

            task.startDate = new Date();

        }

        if (!(task.endDate instanceof Date)) {

            task.endDate = addWeeks(
                task.startDate,
                task.duration
            );

        }

        if (task.duration <= 0) {

            task.duration = 1;

        }

        if (task.progress < 0)
            task.progress = 0;

        if (task.progress > 100)
            task.progress = 100;

    });

}


/*=========================================================
    Refresh Data
==========================================================*/

function refreshProject() {

    runScheduler();

    updateDashboard();

    if (typeof drawGantt === "function") {

        drawGantt();

    }

}


/*=========================================================
    Debug
==========================================================*/

function printProject() {

    console.table(Project.tasks);

}
