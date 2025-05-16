const studentForm = document.getElementById("studentForm");

const tableBody = document.querySelector("#studentTable tbody");

let students = JSON.parse(localStorage.getItem("students")) || [];

// --------when we hit submit button ------------

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = studentForm.name.value.trim();
  const studentId = studentForm.studentId.value.trim();
  const email = studentForm.email.value.trim();
  const contact = studentForm.contact.value.trim();
  const newStudent = {
    name,
    studentId,
    email,
    contact,
  };

  //-----valid input---------
  if (!validInput(name, contact)) {
    return;
  }

  //-----------edit and duplicate student condition check-----
  if (editIndex === -1) {
    const duplicateStudent = students.some(
      (student) => student.studentId === studentId
    );
    if (duplicateStudent) {
      alert("Student with this ID already exist.");
      return;
    }
    students.push(newStudent);
  } else {
    const duplicateStudent = students.some(
      (student, index) => student.studentId === studentId && index !== editIndex
    );
    if (duplicateStudent) {
      alert("Another student with this id already exist.");
      return;
    }
    students[editIndex] = newStudent;
    editIndex = -1;
  }

  saveToLocalStorage();
  displayTable();
  studentForm.reset();
});
// ---------------function to save student data in local storage-------
function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}
// ------------function to show student on table -----------
function displayTable() {
  tableBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td>
            <button class="action edit-button" onClick="editStudent(${index})">Edit</button>
            <button class="action delete-button" onClick="deleteStudent(${index})">Delete</button>
        </td>
        `;
    tableBody.appendChild(row);
  });
}

// ----------delete functionality-----
function deleteStudent(index) {
  const deleteMessage = confirm(
    "Are you sure you want to delete this student?"
  );
  if (deleteMessage) {
    students.splice(index, 1);
    saveToLocalStorage();
    displayTable();
  }
}
displayTable();

// --------------edit functionality---
let editIndex = -1;
function editStudent(index) {
  const student = students[index];
  studentForm.name.value = student.name;
  studentForm.studentId.value = student.studentId;
  studentForm.email.value = student.email;
  studentForm.contact.value = student.contact;
  editIndex = index;
}
// ------------validation---------

function validInput(name, contact) {
  //student id and email is already validated from html itself thats why i havn't use here.
  if (!isNaN(name)) {
    alert("Name should only contain letters.");
    return false;
  }
  if (contact.length !== 10) {
    alert("Contact number must be 10 digits");
    return false;
  }
  return true;
}
