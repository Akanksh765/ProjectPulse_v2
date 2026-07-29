/*=========================================================
            Timeline Engine
=========================================================*/

function calculateTimeline() {

    if (Project.tasks.length === 0)
        return;

    const starts = Project.tasks.map(t => t.startDate);

    const ends = Project.tasks.map(t => t.endDate);

    Gantt.startDate = minDate(starts);

    Gantt.endDate = maxDate(ends);

    Gantt.totalDays =
        differenceInDays(
            Gantt.startDate,
            Gantt.endDate
        ) + 1;

}