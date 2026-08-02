/*==================================================
 ProjectPulse V2
 Project Data Model
===================================================*/

const Project = {

    name: "ProjectPulse",

    version: "2.0",

    tasks: [],

    settings: {

        zoom: "week",

        workWeek: 5,

        autoSchedule: true,

        showWeekends: false

    },

    stats: {

        totalTasks: 0,

        completedTasks: 0,

        delayedTasks: 0,

        progress: 0,

        projectHealth: 100

    }

};
