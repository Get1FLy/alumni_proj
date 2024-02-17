const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const connection = require('./db');

exports.getUserByEmail = (req, res) => {
    // Check authentication (JWT token)
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Unauthorized - Missing or invalid token' });
      res.end();
    }
  
    const userEmail = req.user.email; // Extract the email from the JWT token
  
    // Select data for the user with the matching email from the database (excluding password)
    connection.query(
      'SELECT id, email, name, contact, branch, batch, collegeId FROM alumni_data WHERE email = ?',
      [userEmail],
      (error, results) => {
        if (error) {
          console.error('Error retrieving user data:', error.message);
          return res.status(500).json({ message: 'Error retrieving user data' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Send the user data to the client
        res.status(200).json(results[0]);
      }
    );
  };


  exports.getSingleFeeHeadsAmount = (req, res) => {
    // Check authentication (JWT token)
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Unauthorized - Missing or invalid token' });
      res.end()
    }
  
    const userEmail = req.user.email; // Extract the email from the JWT token
  
    // Select data for the user with the matching email from the database (excluding password)
    connection.query(
      'SELECT * FROM single_fee_amount left join fee_heads on single_fee_amount.fh_id = fee_heads.fh_id',
      (error, results) => {
        if (error) {
          console.error('Error retrieving user data:', error.message);
          return res.status(500).json({ message: 'Error retrieving user data' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Send the user data to the client
        res.status(200).json(results);
      }
    );
  };

  exports.getPaymentDetails = (req, res) => {
    // Check authentication (JWT token)
    const {id,collegeId} = req.body;
  
  
    // Select data for the user with the matching email from the database (excluding password)
    connection.query(
      'SELECT * FROM single_fee_amount left join fee_heads on single_fee_amount.fh_id = fee_heads.fh_id where sfh_id = ?',[id],
      (error, results) => {
        if (error) {
          console.error('Error retrieving user data:', error.message);
          return res.status(500).json({ message: 'Error retrieving user data' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        connection.query('select name, email, collegeId, contact, batch from alumni_data where collegeId = ?',[collegeId],(err,alumni)=>{
          if(err) console.log(err);
          else{
            return res.status(200).json({ 
              name:alumni[0].name,
              email:alumni[0].email,
              contact:alumni[0].contact,
              txnid:alumni[0].collegeId+alumni[0].batch+String(Math.floor(Math.random() * 1000)),
              amount:results[0].amount,
              Fh: results[0].head_name,
              collegeId:alumni[0].collegeId
             });
          }
        })
  
        
      }
    );
  };

exports.getUserId = (req, res) => {
  const userEmail = req.user.email; // Extract the email from the JWT token
  connection.query('select collegeId from alumni_data where email = ?', [userEmail], (err, alumni) => {
    if (err) console.log(err);
    else {
      return res.status(200).json({
        collegeId: alumni[0].collegeId
      });
    }
  })
};
