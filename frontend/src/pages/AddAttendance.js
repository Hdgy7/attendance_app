import React, { useState } from 'react';
import axios from '../api/axios';

function AddAttendance() {
  const [form, setForm] = useState({
    emp_id: '',
    date: '',
    in_time: '',
    out_time: '',
    code: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/attendance/add', form);
      alert('Attendance recorded!');
      setForm({ emp_id: '', date: '', in_time: '', out_time: '', code: '' });
    } catch (err) {
      alert('Error saving attendance');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Attendance</h3>
      <input name="emp_id" placeholder="Employee ID" onChange={handleChange} value={form.emp_id} required />
      <input name="date" type="date" onChange={handleChange} value={form.date} required />
      <input name="in_time" type="time" onChange={handleChange} value={form.in_time} required />
      <input name="out_time" type="time" onChange={handleChange} value={form.out_time} required />
      <input name="code" placeholder="Code (e.g., pl, wo)" onChange={handleChange} value={form.code} />
      <button type="submit">Save Attendance</button>
    </form>
  );
}

export default AddAttendance;
