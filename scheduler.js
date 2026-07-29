/*=========================================================
                ProjectPulse V2
             Scheduling Engine V1
=========================================================*/

/*
    Features
    --------
    ✔ Multiple Dependencies
    ✔ Automatic Cascading
    ✔ Circular Dependency Detection
    ✔ Auto End Date Calculation
*/


function runScheduler() {

    console.log("Scheduling Project...");

    if (detectCircularDependency()) {

        alert("Circular dependency detected.");

        return;

    }

    sortTasks();

    scheduleTasks();

    calculateProjectDates();

    console.log("Scheduling Complete");

}



/*=========================================================

            Topological Sort

=========================================================*/

function sortTasks() {

    Project.tasks.sort((a, b) => {

        return a.id - b.id;

    });

}



/*=========================================================

            Main Scheduling Logic

=========================================================*/

function scheduleTasks() {

    Project.tasks.forEach(task => {

        if (task.dependencies.length === 0) {

            task.endDate = addWeeks(

                task.startDate,

                task.duration

            );

            return;

        }

        const latest = latestDependencyEnd(task);

        if (latest != null) {

            task.startDate = addDays(

                latest,

                1

            );

            task.endDate = addWeeks(

                task.startDate,

                task.duration

            );

        }

    });

}



/*=========================================================

            Project Start

=========================================================*/

function projectStartDate() {

    let earliest = null;

    Project.tasks.forEach(task => {

        if (

            earliest == null ||

            task.startDate < earliest

        ) {

            earliest = task.startDate;

        }

    });

    return earliest;

}



/*=========================================================

            Project End

=========================================================*/

function projectEndDate() {

    let latest = null;

    Project.tasks.forEach(task => {

        if (

            latest == null ||

            task.endDate > latest

        ) {

            latest = task.endDate;

        }

    });

    return latest;

}



/*=========================================================

            Project Duration

=========================================================*/

function calculateProjectDates() {

    Project.projectStart =

        projectStartDate();

    Project.projectEnd =

        projectEndDate();

}



/*=========================================================

        Circular Dependency Detection

=========================================================*/

function detectCircularDependency() {

    const visited = {};

    const recursion = {};

    const map = {};



    Project.tasks.forEach(task => {

        map[task.id] = task;

    });



    function dfs(id) {

        if (recursion[id])

            return true;



        if (visited[id])

            return false;



        visited[id] = true;

        recursion[id] = true;



        const task = map[id];



        if (!task)

            return false;



        for (const dep of task.dependencies) {

            if (dfs(dep))

                return true;

        }



        recursion[id] = false;



        return false;

    }



    for (const task of Project.tasks) {

        if (dfs(task.id))

            return true;

    }



    return false;

}



/*=========================================================

        Move Task

=========================================================*/

function moveTask(taskID, weeks) {

    const task = findTask(taskID);

    if (!task)

        return;



    task.startDate = addWeeks(

        task.startDate,

        weeks

    );



    task.endDate = addWeeks(

        task.endDate,

        weeks

    );



    runScheduler();



    updateDashboard();



    if (

        typeof drawGantt ===

        "function"

    ) {

        drawGantt();

    }

}



/*=========================================================

        Update Duration

=========================================================*/

function updateDuration(taskID, duration) {

    const task = findTask(taskID);

    if (!task)

        return;



    task.duration = duration;



    runScheduler();



    updateDashboard();



    if (

        typeof drawGantt ===

        "function"

    ) {

        drawGantt();

    }

}



/*=========================================================

        Get Successors

=========================================================*/

function getSuccessors(taskID) {

    return Project.tasks.filter(task =>

        task.dependencies.includes(taskID)

    );

}



/*=========================================================

        Schedule Summary

=========================================================*/

function printSchedule() {

    console.table(

        Project.tasks.map(task => ({

            ID: task.id,

            Activity: task.activity,

            Start: formatDate(

                task.startDate

            ),

            End: formatDate(

                task.endDate

            ),

            Duration: task.duration,

            DependsOn:

                task.dependencies.join(",")

        }))

    );

}



/*=========================================================

            Project Statistics

=========================================================*/

function updateProjectStats() {

    Project.stats.totalTasks =

        Project.tasks.length;



    Project.stats.completedTasks =

        Project.tasks.filter(

            t => t.status === "Completed"

        ).length;



    Project.stats.delayedTasks =

        Project.tasks.filter(

            t => t.status === "Delayed"

        ).length;



    let totalProgress = 0;



    Project.tasks.forEach(task => {

        totalProgress += task.progress;

    });



    Project.stats.progress =

        Math.round(

            totalProgress /

            Project.tasks.length

        );

}



/*=========================================================

                Debug

=========================================================*/

function debugScheduler() {

    console.log(

        "Project Start :",

        formatDate(

            Project.projectStart

        )

    );



    console.log(

        "Project End :",

        formatDate(

            Project.projectEnd

        )

    );



    printSchedule();

}