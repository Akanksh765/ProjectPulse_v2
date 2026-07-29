/*==================================================
 Utility Functions
===================================================*/


/*------------------------------------------
 Convert Excel Serial Date
-------------------------------------------*/

function excelDateToJSDate(serial) {

    if (serial instanceof Date)
        return serial;

    if (typeof serial === "number") {

        return new Date(

            Math.round((serial - 25569) * 86400 * 1000)

        );

    }

    return new Date(serial);

}


/*------------------------------------------
 Add Days
-------------------------------------------*/

function addDays(date, days) {

    const d = new Date(date);

    d.setDate(d.getDate() + days);

    return d;

}


/*------------------------------------------
 Add Weeks
-------------------------------------------*/

function addWeeks(date, weeks) {

    return addDays(date, weeks * 7);

}


/*------------------------------------------
 Difference Between Dates
-------------------------------------------*/

function daysBetween(start, end) {

    return Math.floor(

        (end - start) /

        (1000 * 60 * 60 * 24)

    );

}


/*------------------------------------------
 Format Date
-------------------------------------------*/

function formatDate(date) {

    if (!(date instanceof Date))

        return "";

    if (isNaN(date))

        return "";

    return date.toLocaleDateString(

        "en-GB",

        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }

    );

}


/*------------------------------------------
 Deep Clone
-------------------------------------------*/

function clone(object) {

    return JSON.parse(

        JSON.stringify(object)

    );

}


/*------------------------------------------
 Find Task
-------------------------------------------*/

function findTask(id) {

    return Project.tasks.find(

        task => task.id === id

    );

}


/*------------------------------------------
 Get Latest Dependency End Date
-------------------------------------------*/

function latestDependencyEnd(task) {

    let latest = null;

    task.dependencies.forEach(depID => {

        const dependency = findTask(depID);

        if (!dependency)

            return;

        if (

            latest === null ||

            dependency.endDate > latest

        ) {

            latest = dependency.endDate;

        }

    });

    return latest;

}


/*------------------------------------------
 Random Color
-------------------------------------------*/

function randomColor() {

    const colors = [

        "#2563eb",

        "#16a34a",

        "#dc2626",

        "#f97316",

        "#7c3aed",

        "#0ea5e9"

    ];

    return colors[

        Math.floor(

            Math.random() *

            colors.length

        )

    ];

}


/*------------------------------------------
 Status Color
-------------------------------------------*/

function statusColor(status) {

    switch (status) {

        case "Completed":

            return "#22c55e";

        case "Delayed":

            return "#ef4444";

        case "In Progress":

            return "#2563eb";

        case "Critical":

            return "#f97316";

        default:

            return "#94a3b8";

    }

}


/*------------------------------------------
 Weekend Check
-------------------------------------------*/

function isWeekend(date) {

    return (

        date.getDay() === 0 ||

        date.getDay() === 6

    );

}


/*------------------------------------------
 Next Working Day
-------------------------------------------*/

function nextWorkingDay(date) {

    let d = new Date(date);

    while (isWeekend(d)) {

        d = addDays(d, 1);

    }

    return d;

}


/*------------------------------------------
 Console Banner
-------------------------------------------*/

function banner() {

    console.log(

        "%cProjectPulse V2 Loaded",

        "color:white;background:#2563eb;padding:8px;font-size:14px;border-radius:5px"

    );

}

banner();
/*=========================================================
            Gantt Date Utilities
=========================================================*/

function startOfDay(date) {

    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    return d;

}

function differenceInDays(start, end) {

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round(

        (startOfDay(end) - startOfDay(start)) / oneDay

    );

}

function minDate(dates) {

    return new Date(

        Math.min(...dates.map(d => d.getTime()))

    );

}

function maxDate(dates) {

    return new Date(

        Math.max(...dates.map(d => d.getTime()))

    );

}

function cloneDate(date) {

    return new Date(date.getTime());

}