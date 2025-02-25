function addRow(tableId) {
    let tableBody = document.getElementById(tableId);
    let rowCount = tableBody.rows.length + 1;
    let newRow = tableBody.insertRow();

    let cellIndex = newRow.insertCell(0);
    let cellScore = newRow.insertCell(1);
    let cellItems = newRow.insertCell(2);
    let cellOverall = newRow.insertCell(3);
    let cellDelete = newRow.insertCell(4);

    cellIndex.textContent = rowCount;

    let scoreInput = document.createElement("input");
    scoreInput.type = "number";
    scoreInput.className = "score-input";
    scoreInput.min = "0";
    scoreInput.addEventListener("input", function () {
        calculateOverall(newRow, tableId);
    });

    let itemsInput = document.createElement("input");
    itemsInput.type = "number";
    itemsInput.className = "items-input";
    itemsInput.min = "1";
    itemsInput.addEventListener("input", function () {
        calculateOverall(newRow, tableId);
    });

    cellScore.appendChild(scoreInput);
    cellItems.appendChild(itemsInput);
    cellOverall.className = "overall";
    cellOverall.textContent = "-";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function () {
        deleteRow(this, tableId);
    };

    cellDelete.appendChild(deleteButton);
    updateDeleteColumnVisibility(tableId);
}

function calculateOverall(row, tableId) {
    let scoreInput = row.cells[1].querySelector("input");
    let itemsInput = row.cells[2].querySelector("input");
    let overallCell = row.cells[3];

    let score = parseFloat(scoreInput.value);
    let items = parseFloat(itemsInput.value);

    if (score > items) {
        overallCell.textContent = "Invalid Input";
        overallCell.style.color = "red";
        return;
    } else {
        overallCell.style.color = "black";
    }

    if (!isNaN(score) && !isNaN(items) && items > 0) {
        let overall = (score / items).toFixed(2);
        overallCell.textContent = overall;
    } else {
        overallCell.textContent = "-";
    }

    calculateActualGrade(tableId);
}

function calculateFinalGrade() {
    let quizGrade = document.getElementById("table1-grade").textContent.replace("Overall Grade: ", "").replace("%", "");
    let taskGrade = document.getElementById("table2-grade").textContent.replace("Overall Grade: ", "").replace("%", "");
    let examGrade = document.getElementById("table3-grade").textContent.replace("Overall Grade: ", "").replace("%", "");

    quizGrade = quizGrade !== "-" ? parseFloat(quizGrade) : 0;
    taskGrade = taskGrade !== "-" ? parseFloat(taskGrade) : 0;
    examGrade = examGrade !== "-" ? parseFloat(examGrade) : 0;

    document.getElementById("final-quiz-grade").textContent = quizGrade.toFixed(2) + "%";
    document.getElementById("final-task-grade").textContent = taskGrade.toFixed(2) + "%";
    document.getElementById("final-exam-grade").textContent = examGrade.toFixed(2) + "%";

    let finalGrade = (quizGrade + taskGrade + examGrade).toFixed(2);

    document.getElementById("final-grade").textContent = finalGrade + "%";
}

function calculateActualGrade(tableId) {
    let tableBody = document.getElementById(tableId);
    let rows = tableBody.getElementsByTagName("tr");
    let totalOverall = 0;
    let count = 0;

    for (let row of rows) {
        let overallCell = row.cells[3].textContent;
        if (overallCell !== "-") {
            totalOverall += parseFloat(overallCell);
            count++;
        }
    }

    let weight = tableId === "table1-body" ? 0.2 : (tableId === "table2-body" ? 0.3 : (tableId === "table3-body" ? 0.5 : 0));
    let finalGrade = count > 0 ? ((totalOverall / count) * weight * 100).toFixed(2) + "%" : "-";

    let gradeDisplay = document.getElementById(tableId.replace("-body", "-grade"));

    if (gradeDisplay) {
        gradeDisplay.textContent = "Overall Grade: " + finalGrade;
    }

    calculateFinalGrade();
}


function deleteRow(button, tableId) {
    let tableBody = document.getElementById(tableId);
    let row = button.parentNode.parentNode;
    tableBody.removeChild(row);
    updateRowNumbers(tableBody);
    updateDeleteColumnVisibility(tableId);
    calculateActualGrade(tableId);
}

function updateRowNumbers(tableBody) {
    let rows = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].textContent = i + 1;
    }
}

function updateDeleteColumnVisibility(tableId) {
    let table = document.getElementById(tableId).closest("table");
    let deleteHeader = table.querySelector(".delete-header");
    let deleteButtons = table.querySelectorAll(".delete-btn");

    if (deleteButtons.length > 0) {
        deleteHeader.style.display = "table-cell";
        deleteButtons.forEach(btn => btn.style.display = "inline-block");
    } else {
        deleteHeader.style.display = "none";
        deleteButtons.forEach(btn => btn.style.display = "none");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".score-input, .items-input").forEach(input => {
        input.addEventListener("input", function () {
            let row = this.closest("tr");
            let tableId = row.closest("tbody").id;
            calculateOverall(row, tableId);
        });
    });
});
