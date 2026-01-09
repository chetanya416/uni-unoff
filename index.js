const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/uniunoff', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Serve default login page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'index (3).html'));
});

// Login Schema & Model
const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  loginDate: {
    type: Date,
    default: Date.now
  }
});
const Login = mongoose.model('Login', loginSchema);

// Student Schema & Model
const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  department: String,
  email: String
});
const Student = mongoose.model('Student', studentSchema);

// Login endpoint
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const newLogin = new Login({ username, password });

//   try {
//     await newLogin.save();
//     res.status(200).send('Login saved to MongoDB');
//   } catch (err) {
//     console.error("❌ Error saving login:", err);
//     res.status(500).send('Failed to save login');
//   }
// });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the same username and password already exist
    const existingLogin = await Login.findOne({ username, password });

    if (existingLogin) {
      return res.status(200).send('Login already exists in MongoDB');
    }

    // If not found, create and save new login
    const newLogin = new Login({ username, password });
    await newLogin.save();
    res.status(201).send('Login saved to MongoDB');
  } catch (err) {
    console.error("❌ Error saving login:", err);
    res.status(500).send('Failed to save login');
  }
});


// API to get all students (READ)
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).send('Failed to fetch students');
  }
});

// Optional APIs for future use
// CREATE
app.post('/students', async (req, res) => {
  const { name, rollNumber, department, email } = req.body;
  try {
    const newStudent = new Student({ name, rollNumber, department, email });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// UPDATE
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updated = await Student.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated', student: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
