import React, { useState } from 'react';

const ReportIssueForm: React.FC = () => {
  const [form, setForm] = useState({
    pilotName: '',
    pilotId: '',
    flightNumber: '',
    priority: 'Normal',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Issue reported:', form);
    alert('Issue submitted successfully!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Report an Issue</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="pilotName" placeholder="Pilot Name" value={form.pilotName} onChange={handleChange} style={styles.input} required />
        <input type="text" name="pilotId" placeholder="Pilot ID" value={form.pilotId} onChange={handleChange} style={styles.input} required />
        <input type="text" name="flightNumber" placeholder="Flight Number" value={form.flightNumber} onChange={handleChange} style={styles.input} required />

        <label style={styles.label}>Priority:</label>
        <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>

        <textarea name="description" placeholder="Describe the issue" value={form.description} onChange={handleChange} style={styles.textarea} required />

        <button type="submit" style={styles.button}>Submit Issue</button>
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
    backgroundColor: '#e3f2fd',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#1e3a8a',
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
    marginTop: '1rem',
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
    backgroundColor: '#1e88e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default ReportIssueForm;