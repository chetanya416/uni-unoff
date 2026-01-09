let menuicn = document.querySelector(".menuicn"); 
let nav = document.querySelector(".navcontainer"); 

menuicn.addEventListener("click", () => { 
	nav.classList.toggle("navclose"); 
})
// Fetch and display all students
async function loadStudents() {
	try {
	  const res = await fetch('/students');
	  const students = await res.json();
	  const container = document.getElementById('student-db-container');
	  container.innerHTML = ''; // Clear previous content
  
	  students.forEach(student => {
		const div = document.createElement('div');
		div.className = 'student-entry';
		div.innerHTML = `
		  <p><strong>Name:</strong> <input type="text" value="${student.name}" id="name-${student._id}"/></p>
		  <p><strong>Roll No:</strong> <input type="text" value="${student.rollNumber}" id="roll-${student._id}"/></p>
		  <p><strong>Department:</strong> <input type="text" value="${student.department}" id="dept-${student._id}"/></p>
		  <button onclick="updateStudent('${student._id}')">Update</button>
		  <button onclick="deleteStudent('${student._id}')">Delete</button>
		  <hr/>
		`;
		container.appendChild(div);
	  });
	} catch (err) {
	  console.error('Error loading students:', err);
	}
  }
  
  // Delete a student
  async function deleteStudent(id) {
	try {
	  await fetch(`/students/${id}`, { method: 'DELETE' });
	  loadStudents(); // Refresh list
	} catch (err) {
	  console.error('Error deleting student:', err);
	}
  }
  
  // Update a student
  async function updateStudent(id) {
	const name = document.getElementById(`name-${id}`).value;
	const rollNumber = document.getElementById(`roll-${id}`).value;
	const department = document.getElementById(`dept-${id}`).value;
  
	try {
	  await fetch(`/students/${id}`, {
		method: 'PUT',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, rollNumber, department }),
	  });
	  loadStudents(); // Refresh list
	} catch (err) {
	  console.error('Error updating student:', err);
	}
  }
  
  // Call loadStudents when the student database tab is clicked
  document.querySelector('.option3').addEventListener('click', () => {
	document.querySelector('.main').innerHTML = `
	  <h2>Student Database</h2>
	  <div id="student-db-container"></div>
	`;
	loadStudents();
  });
  