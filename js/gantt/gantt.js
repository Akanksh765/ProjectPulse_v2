function drawCustomGantt() {

    const container = document.getElementById("gantt");

    container.innerHTML = "";

    if(Project.tasks.length===0) return;

    //----------------------------------------------------
    // Find Project Start and End
    //----------------------------------------------------

    let minDate = new Date(Project.tasks[0].startDate);

    let maxDate = new Date(Project.tasks[0].endDate);

    Project.tasks.forEach(task=>{

        if(task.startDate < minDate)
            minDate = new Date(task.startDate);

        if(task.endDate > maxDate)
            maxDate = new Date(task.endDate);

    });

    //----------------------------------------------------
    // Number of days
    //----------------------------------------------------

    const dayWidth = 35;

    const totalDays = Math.ceil(

        (maxDate-minDate)/(1000*60*60*24)

    )+1;

    //----------------------------------------------------
    // Main Grid
    //----------------------------------------------------

    const table=document.createElement("table");

    table.className="ganttTable";

    //----------------------------------------------------
    // Header
    //----------------------------------------------------

    const thead=document.createElement("thead");

    const header=document.createElement("tr");

    const th=document.createElement("th");

    th.innerHTML="Task";

    header.appendChild(th);

    for(let i=0;i<totalDays;i++){

        const current=new Date(minDate);

        current.setDate(current.getDate()+i);

        const h=document.createElement("th");

        h.style.minWidth=dayWidth+"px";

        h.innerHTML=current.toLocaleDateString("en-GB",{

            day:"numeric",

            month:"short"

        });

        header.appendChild(h);

    }

    thead.appendChild(header);

    table.appendChild(thead);

    //----------------------------------------------------
    // Body
    //----------------------------------------------------

    const tbody=document.createElement("tbody");

    Project.tasks.forEach(task=>{

        const row=document.createElement("tr");

        //------------------------------------------------

        const taskCell=document.createElement("td");

        taskCell.className="taskName";

        taskCell.innerHTML=task.activity;

        row.appendChild(taskCell);

        //------------------------------------------------

        for(let d=0;d<totalDays;d++){

            const cell=document.createElement("td");

            cell.className="gridCell";

            row.appendChild(cell);

        }

        //------------------------------------------------

        const offset=Math.floor(

            (task.startDate-minDate)/(1000*60*60*24)

        );

        const duration=Math.floor(

            (task.endDate-task.startDate)/(1000*60*60*24)

        )+1;

        for(let i=0;i<duration;i++){

            const cell=row.children[offset+i+1];

            if(cell){

                cell.className="bar";

                cell.style.background="#4e8bd8";

            }

        }

        tbody.appendChild(row);

    });

    table.appendChild(tbody);

    container.appendChild(table);

}
