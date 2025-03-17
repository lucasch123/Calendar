// Get today's date and initialize the calendar state
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;

// Debugging output
console.log("Initializing calendar:", { currentMonth, currentYear });

// Refreshes the calendar header to display the correct month & year
function refreshCalendarHeader() {
    console.log("Updating header to display:", currentMonth, currentYear);
    const monthYearElement = document.getElementById("currentMonthYear");
    monthYearElement.innerText = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
}

// Draws the calendar grid based on the current month & year
function drawCalendarTable() {
    refreshCalendarHeader();

    console.log("Rendering calendar for:", { currentMonth, currentYear });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarElement = document.getElementById("calendar");

    let calendarHTML = "<table><tr>";
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate weekday headers
    for (let day of weekDays) {
        calendarHTML += `<th>${day}</th>`;
    }
    calendarHTML += "</tr><tr>";

    // Add empty cells before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarHTML += "<td></td>";
    }

    // Populate the calendar with days
    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDayOfMonth + day - 1) % 7 === 0) {
            calendarHTML += "</tr><tr>"; // Start a new row for each week
        }
        calendarHTML += `<td class="clickable" onclick="selectDay(${day}, event)">${day}</td>`;
    }

    // Fill in remaining empty cells 
    let remainingCells = (7 - ((firstDayOfMonth + daysInMonth) % 7));
    if (remainingCells === 7) remainingCells = 0; 

    for (let i = 0; i < remainingCells; i++) {
        calendarHTML += "<td></td>";
    }

    calendarHTML += "</tr></table>";

    // Render the table
    calendarElement.innerHTML = calendarHTML;
}

// Moves to the previous or next month
function shiftMonth(direction) {
    console.log(`Changing month: ${direction > 0 ? "Next" : "Previous"}`);
    currentMonth += direction;

    // Handle year transitions manually 
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    drawCalendarTable();
}

// Highlights the selected day
function selectDay(day, event) {
    console.log("Selected day:", day);
    selectedDate = day;

    // Remove the 'selected' class from all date cells
    document.querySelectorAll(".clickable").forEach(cell => {
        cell.classList.remove("selected");
    });

    // Highlight the clicked cell
    event.target.classList.add("selected");
}

// Adds a task for the selected date
function createTask() {
    const taskInput = document.getElementById("taskDescription");
    const taskCategory = document.getElementById("taskCategory").value;
    const taskText = taskInput.value.trim();

    // Prevent empty task submission
    if (!selectedDate) {
        alert("Please select a date before adding a task.");
        console.warn("User tried adding a task without selecting a date.");
        return;
    }

    if (taskText === "") {
        alert(" Task description cannot be empty.");
        console.warn("User tried adding an empty task.");
        return;
    }

    console.log(`Adding task: ${taskText} (Category: ${taskCategory})`);

    // Create the task element
    const taskElement = document.createElement("div");
    taskElement.className = `task ${taskCategory}`;
    taskElement.innerHTML = `<strong>${selectedDate}:</strong> ${taskText}`;

    // Append to the task list
    document.getElementById("taskList").appendChild(taskElement);

    // Clear the input field
    taskInput.value = "";
}

// Initialize the calendar when the page loads
window.addEventListener("load", () => {
    console.log("Page loaded. Rendering calendar...");
    drawCalendarTable();
});

// Attach event listeners to buttons
document.getElementById("prevMonthBtn").addEventListener("click", () => shiftMonth(-1));
document.getElementById("nextMonthBtn").addEventListener("click", () => shiftMonth(1));
document.getElementById("addTaskBtn").addEventListener("click", createTask);
