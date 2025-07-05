"use strict";

//element variables
let taskField = document.querySelector(".task-field");
let addBtn = document.querySelector("#addBtn");


// data variables

    let months = {0 : "Jan" , 1 : "Feb" , 2 : "Mar" , 3 : "Apr" , 4 : "May" , 5 : "June" , 6 : "July", 
                  7 : "Aug" , 8 : "Sep" , 9 : "Oct" , 10 : "Nov" , 11 : "Dec" };
    let dateObj = new Date();
    let currentDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    
// task-data Object

let taskDataObj = new Object();


// adding task method

let addTask = (event) => {
{

    // validating empty values
    if(taskField.value.trim() === ""){
        alert("Field should not be empty");
        return;
    }

    
    let taskItem = `<div id="task-items" class="taskItems-container">
                        <input type="text" id="task-data"  value="${taskField.value}" disabled>
                        <div id="action-container" class="action-items">
                                <button class="edit-btn" >
                                    <span class="material-symbols-outlined">
                                    edit
                                    </span>
                                </button>
                                <button class="delete-btn">
                                    <span class="material-symbols-outlined">
                                    delete
                                    </span>
                                </button>
                                <input type="checkbox" id="task-completed">
                        </div>
                    </div>`;


    let taskContainer = document.querySelector(".task-div");
    console.log(taskContainer);

    if(taskContainer.children.length == 0){
    //    let dateObj = new Date();
    //    let currentDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
       let dateElement = `<span id="date" class="date-item">${currentDate}</span>`;
       let taskItemsDiv = `<div id="task-container" class="task-main-container"> </div>`;

       taskContainer.innerHTML = `${dateElement}${taskItemsDiv}`;

       document.querySelector(".task-main-container").innerHTML = taskItem;
       
       // add task-data Object

    //    taskDataObj[currentDate] = [taskField.value];
    taskDataObj[currentDate] = [{data : taskField.value, status : "pending"}];
      
       
    }else{
       taskContainer.querySelector("#task-container").insertAdjacentHTML("beforeend",taskItem);
       taskDataObj[currentDate].push({data : taskField.value, status : "pending"});
    }
    

    taskField.value = "";
    
    // addHover classList
    hoverButton(document.querySelectorAll(".action-items > button span"))

    localStorage.setItem("taskDataObj",JSON.stringify(taskDataObj));

}
}

// navigating enter key for adding task
taskField.addEventListener("keydown",(event)=>{
   if(event.key == "Enter"){
     addTask();
   }
});


// adding task 
addBtn.addEventListener("click",addTask);



// perform delete & edit using event delegation

let taskDiv = document.querySelector(".task-div");


taskDiv.addEventListener("click",(event) => {


    // console.log(event.target.parentElement.classList.contains("delete-btn"));


    // delete action

    if(event.target.parentElement.classList.contains("delete-btn")){
        let currentTaskItem = event.target.closest(".taskItems-container");
        let taskContainer = currentTaskItem.parentElement;

        // remove data from obj

        console.log(Array.from(taskContainer.children).indexOf(currentTaskItem));

        let currentTaskIndex = Array.from(taskContainer.children).indexOf(currentTaskItem);

        taskDataObj[currentDate].splice(currentTaskIndex,1);



        // remove the task Item

        currentTaskItem.remove();

        // if all tasks deleted - entire div is removed 
        // along with date element 
        if(taskContainer.children.length == 0){
            taskContainer.previousElementSibling.remove(); // date element
            taskContainer.remove();
        }
        else{

            // if delete btn clicked after edit btn - 
            // disable field set active

            disableFields(taskContainer);
        }


        console.log(taskDataObj);

        localStorage.setItem("taskDataObj",JSON.stringify(taskDataObj));
        
    }


    // edit action

    if(event.target.parentElement.classList.contains("edit-btn")){
        // console.log(event.target.closest(".taskItems-container").children[0]);
        let currentTask = event.target.closest(".taskItems-container").children[0];

        currentTask.removeAttribute("disabled");
        currentTask.focus();
        currentTask.classList.add("edit-state");

        // moving the focus pointer to the end 
        let currentVal = currentTask?.value;
        currentTask.value = "";
        currentTask.value = currentVal;
        // console.log(currentVal);

        // editing data
        
        let enterEvent = function(e) {

            console.log(e);
            if(e.key == "Enter"){

                let currentTaskIndex = Array.from(currentTask.parentElement.parentElement.children).indexOf(currentTask.parentElement);
                taskDataObj[currentDate].splice(currentTaskIndex,1,{data : currentTask.value, status : "pending"})

                let currentContainer = currentTask.closest(".task-main-container");

                 disableFields(currentContainer);
            }

            localStorage.setItem("taskDataObj",JSON.stringify(taskDataObj));
            
        }
        

        // console.log(currentTask.dataset.listenerAdded);

        if(!currentTask.dataset.listenerAdded) {
            currentTask.addEventListener("keydown",enterEvent);
            currentTask.dataset.listenerAdded = true;
        }

        

         let currentContainer = currentTask.closest(".task-main-container");

         disableFields(currentContainer, currentTask);


        localStorage.setItem("taskDataObj",JSON.stringify(taskDataObj));
    }


    // task completed action

    if(event.target.id == "task-completed") {

        let actionBtns = event.target.parentElement.querySelectorAll("button");
        let currentTaskItem = event.target.closest(".taskItems-container").children[0];

        // update data object using index
        let allTaskItems = Array.from(event.target.closest(".task-main-container").children);
        let currentItem = event.target.closest(".taskItems-container");
        let currentItemIndex = allTaskItems.indexOf(currentItem);

        if(event.target.checked == true)
        {
        //    let actionBtns = event.target.parentElement.querySelectorAll("button");
               currentTaskItem.classList.add("task-done");
               actionBtns.forEach((btn) => {
               btn.setAttribute("disabled", true)
           });

           // update status in data Object

          taskDataObj[currentDate][currentItemIndex].status = "completed";
        //   console.log(taskDataObj[currentDate][currentItemIndex].status);
        //   console.log(currentItem);
          console.log(taskDataObj);

          

        }else{
            // let actionBtns = event.target.parentElement.querySelectorAll("button");
               currentTaskItem.classList.remove("task-done")
               actionBtns.forEach((btn) => {
               btn.removeAttribute("disabled")
           })

           taskDataObj[currentDate][currentItemIndex].status = "pending";
        }



        // disable selected edit state
         let currentContainer = currentTaskItem.closest(".task-main-container");

         disableFields(currentContainer);


         // add hover event for action buttons
         hoverButton(document.querySelectorAll(".action-items > button span"));

         localStorage.setItem("taskDataObj",JSON.stringify(taskDataObj));
    }

})

// disabling task item fields after edit done
let disableFields = (container,currentField) => {
    
    let allTasks = container?.querySelectorAll("#task-data");

    allTasks.forEach((item) => {

        if(item != currentField)
        {
          item.setAttribute("disabled",true);
          item.classList.remove("edit-state");
        }
       
    })
}


// create task Items on page reload using localstorage

document.addEventListener("DOMContentLoaded",(e) => {

    // localStorage.clear();
   let existingTaskData = JSON.parse(localStorage.getItem("taskDataObj"));

    
    console.log(existingTaskData)

    if(existingTaskData) {

        let dates = Object.keys(existingTaskData);

        if(dates.length != 0){
            // dates.forEach((date) => {
            //     dummyData[date].forEach(addingEachTask());
            // })

            for (let taskData of existingTaskData[currentDate]) {
                addingEachTask(taskData, currentDate);
            }
        }
    }
    
    
})


let addingEachTask = (taskData, dateInfo) => {

    
   
    let taskItem = `<div id="task-items" class="taskItems-container">
                        <input type="text" id="task-data"  value="${taskData["data"]}" disabled>
                        <div id="action-container" class="action-items">
                                <button class="edit-btn" >
                                    <span class="material-symbols-outlined">
                                    edit
                                    </span>
                                </button>
                                <button class="delete-btn">
                                    <span class="material-symbols-outlined">
                                    delete
                                    </span>
                                </button>
                                <input type="checkbox" id="task-completed">
                        </div>
                    </div>`;

    if(taskData["status"] == "completed"){
        taskItem = `<div id="task-items" class="taskItems-container">
                        <input type="text" class="task-done id="task-data" value="${taskData["data"]}" disabled>
                        <div id="action-container" class="action-items">
                                <button class="edit-btn" disabled>
                                    <span class="material-symbols-outlined">
                                    edit
                                    </span>
                                </button>
                                <button class="delete-btn" disabled>
                                    <span class="material-symbols-outlined">
                                    delete
                                    </span>
                                </button>
                                <input type="checkbox" id="task-completed" checked>
                        </div>
                    </div>`;
    }


    let taskContainer = document.querySelector(".task-div");
    console.log(taskContainer);

    if(taskContainer.children.length == 0){
    
       let dateElement = `<span id="date" class="date-item">${dateInfo}</span>`;
       let taskItemsDiv = `<div id="task-container" class="task-main-container"> </div>`;

       taskContainer.innerHTML = `${dateElement}${taskItemsDiv}`;

       document.querySelector(".task-main-container").innerHTML = taskItem;
       
       // add task-data Object

       taskDataObj[dateInfo] = [{data: taskData["data"], status : taskData["status"]}];
      
       
    }else{
       taskContainer.querySelector("#task-container").insertAdjacentHTML("beforeend",taskItem);
       taskDataObj[dateInfo].push({data: taskData["data"], status : taskData["status"]});
    }


}

setTimeout(() => {
    console.log(document.querySelectorAll(".action-items > button"));

    let actionButtons = document.querySelectorAll(".action-items > button span");

    hoverButton(actionButtons);

},100)


let hoverButton = (btnsList) => {
    btnsList.forEach((btn) => {

        
            console.log("coming inside")
            btn.addEventListener("mouseover",() => {
                console.log("mouseover")
                if(!btn.parentElement.disabled){
                    btn.classList.add("btn-highlight");
                }
               
            })

            btn.addEventListener("mouseout",() => {
                 console.log("mouseout")
                 if(!btn.parentElement.disabled){
                    btn.classList.remove("btn-highlight");
                 }     
            })
        
           
    })
}

