const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();
const bcrypt = require('bcrypt');
const connection = require('./db');


// Use the secret key from the environment variables
const secretKey = process.env.SECRET_KEY;

// Function to check if a string contains < or >
function containsInvalidChars(str) {
  return /<|>/.test(str);
}

// Registration
exports.isAlreadyPresent=(req,res)=>{
  const {email} = req.body;
  
  if(!email || email==''){
    res.status(400).json({message:'Email is required!'})
  }
  else
  {
    connection.query(
      `
      select * from alumni_data where email=?
      `,[email],(err,al)=>{
        if(err) console.log(err);
        else if(al.length>0){
          res.status(404).json({message:'User already Exists!',alumni:1})
        }
        else{
          connection.query(
            `
              select * from users where email = ?
            `,[email],(err,exists)=>{
              console.log(exists.length)
              if(err) console.log(err);
              else if(exists.length>0){
                connection.query(`
                  select 
                    pd.name, 
                    pd.contact, 
                    b.branch_id, 
                    s.stud_clg_id 
                  from students as s
                  left join student_personalDetails pd on pd.stud_id = s.uid
                  left join branch as b on b.branch_id = s.branch_id
                  where s.uid = ?
                `,[exists[0].uid],(err,data)=>{
                  if(err){
                    console.log(err);
                  }
                  else{
                    const {password, email } = exists[0]
                    const { name, contact, branch_id, stud_clg_id } = data[0]
      
                    connection.query('INSERT INTO alumni_data (email, name, contact, branch, collegeId, password) values (?,?,?,?,?,?)', [email, name, contact, branch_id, stud_clg_id, password], (error,done) => {
                      if (error) {
                        console.log(error);
      
                        return res.status(500).json({ message: 'Database error' });
                      }
      
                      res.status(200).json({ alumni:1,message: 'Registration successful' });
                    });
                  }
                })
              }
              else{
                res.status(200).json({alumni:0})
              }
            }
          )
        }
      }
    )
    
  }
}

exports.register = (req, res) => {
  console.log('Called');
  const { email, name, contact, branch, batch, password, collegeId, confirmPassword } = req.body;
  console.log(req.body);
  // Validate input data
  if (
    !email ||
    !name ||
    !contact ||
    !branch ||
    !batch ||
    !password ||
    !confirmPassword ||
    !collegeId ||
    containsInvalidChars(email) ||
    containsInvalidChars(name) ||
    containsInvalidChars(contact) ||
    containsInvalidChars(branch) ||
    containsInvalidChars(batch) ||
    containsInvalidChars(password) ||
    containsInvalidChars(confirmPassword) ||
    containsInvalidChars(collegeId)
  ) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Check if email already exists
  bcrypt.hash(password, 10, (hashError, password) => {
    if (hashError) {
      console.error('Password hashing failed:', hashError);
      return res.status(500).json({ message: 'Registration failed' });
    }
    connection.query('SELECT * FROM alumni_data WHERE collegeId = ? or email=?', [collegeId, email], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        console.log(error);

        return res.status(400).json({ message: 'College ID or Email already registered' });
      }

      // If collegeId is unique, insert the new user into the database
      const newUser = { email, name, contact, branch, batch, collegeId, password };
      connection.query('INSERT INTO alumni_data SET ?', newUser, (error) => {
        if (error) {
          console.log(error);

          return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Registration successful' });
      });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate input data
  if (!email || !password || containsInvalidChars(email) || containsInvalidChars(password)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Check if the user exists
  connection.query('SELECT * FROM alumni_data WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Login failed:', error.message);
      return res.status(500).json({ message: 'Login failed' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password from the database
    bcrypt.compare(password, user.password, (compareError, passwordsMatch) => {
      if (compareError || !passwordsMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Passwords match; generate a JWT token and send it to the client
      const token = jwt.sign({ email: user.email, id:user.id }, secretKey, { expiresIn: '10h' });

      const androidToken = jwt.sign(
        { email: user.email },
        secretKey,
        { expiresIn: "30d" }
      );

      res.status(200).json({ 
        message: 'Login successful', 
        token: token,
        androidToken: androidToken });
    });
  });
};