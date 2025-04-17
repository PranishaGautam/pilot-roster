import React, { useState } from 'react';

const RequestLeaveForm: React.FC = () => {
  const [form, setForm] = useState({
    pilotName: '',
    pilotId: '',
    leaveType: 'Annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Leave request submitted:', form);
    alert('Leave request submitted successfully!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Request Leave</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="pilotName" placeholder="Pilot Name" value={form.pilotName} onChange={handleChange} style={styles.input} required />
        <input type="text" name="pilotId" placeholder="Pilot ID" value={form.pilotId} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Leave Type:</label>
        <select name="leaveType" value={form.leaveType} onChange={handleChange} style={styles.input}>
          <option value="Annual">Annual Leave</option>
          <option value="Sick">Sick Leave</option>
          <option value="Emergency">Emergency Leave</option>
        </select>

        <label style={styles.label}>From Date:</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>To Date:</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={styles.input} required />

        <textarea name="reason" placeholder="Reason for Leave" value={form.reason} onChange={handleChange} style={styles.textarea} required />

        <button type="submit" style={styles.button}>Submit Request</button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: '#fef7e0',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#9c7300',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  label: {
    fontWeight: 500,
    marginTop: '0.5rem',
  },
  textarea: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minHeight: '100px',
  },
  button: {
    marginTop: '1rem',
    padding: '0.9rem',
    backgroundColor: '#f4b400',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default RequestLeaveForm;