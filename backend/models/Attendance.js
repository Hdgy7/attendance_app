 // Assuming you are using a database connectionrequire('../config/db');
require('../config/db');


// Example method to get attendance by employee ID
const findByEmployeeId = (employeeId, callback) => {
  const query = 'SELECT * FROM attendance WHERE employee_id = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Example method to calculate overtime for an employee
const calculateOvertime = (employeeId, callback) => {
  const query = 'SELECT * FROM attendance WHERE employee_id = ? AND overtime > 0';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Example method to calculate absences for an employee
const calculateAbsences = (employeeId, callback) => {
  const query = 'SELECT * FROM attendance WHERE employee_id = ? AND present = 0';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  findByEmployeeId,
  calculateOvertime,
  calculateAbsences
};
