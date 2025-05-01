const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM employees WHERE email = ?', [email], callback);
  },
  findByEmpId: (empid, callback) => {
    db.query('SELECT * FROM employees WHERE emp_no = ?', [empid], callback);
  },
  getAttendanceByEmpId: (emp_id, callback) => {
    db.query('SELECT * FROM attendance WHERE emp_id = ?', [emp_id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO employees SET ?', data, callback);
  }
};

module.exports = User;