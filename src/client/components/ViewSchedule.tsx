import React from 'react';

const flightSchedule = [
  { flight: 'FL123', date: 'Apr 10', time: '08:00 AM', destination: 'JFK', aircraft: 'A320', gate: '12A' },
  { flight: 'FL456', date: 'Apr 12', time: '02:30 PM', destination: 'LAX', aircraft: 'B737', gate: '7C' },
  { flight: 'FL789', date: 'Apr 14', time: '06:00 AM', destination: 'ORD', aircraft: 'A321', gate: '19B' },
  { flight: 'FL321', date: 'Apr 16', time: '09:45 AM', destination: 'MIA', aircraft: 'B757', gate: '2D' },
  { flight: 'FL654', date: 'Apr 18', time: '07:15 AM', destination: 'ATL', aircraft: 'B777', gate: '5B' },
  { flight: 'FL876', date: 'Apr 19', time: '03:20 PM', destination: 'DEN', aircraft: 'A319', gate: '6C' },
  { flight: 'FL900', date: 'Apr 20', time: '10:00 AM', destination: 'SEA', aircraft: 'A320', gate: '8D' },
  { flight: 'FL111', date: 'Apr 22', time: '12:10 PM', destination: 'LAS', aircraft: 'B737', gate: '3E' },
  { flight: 'FL222', date: 'Apr 24', time: '09:00 AM', destination: 'PHX', aircraft: 'A321', gate: '9F' },
  { flight: 'FL333', date: 'Apr 25', time: '11:30 AM', destination: 'BOS', aircraft: 'B757', gate: '1A' },
];

const ViewSchedule: React.FC = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Flight Schedule</h2>
      <div style={styles.boardWrapper}>
        <table style={styles.board}>
          <thead>
            <tr>
              <th style={styles.th}>TIME</th>
              <th style={styles.th}>DESTINATION</th>
              <th style={styles.th}>FLIGHT</th>
              <th style={styles.th}>AIRCRAFT</th>
              <th style={styles.th}>GATE</th>
              <th style={styles.th}>REMARK</th>
            </tr>
          </thead>
          <tbody>
            {flightSchedule.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.time}</td>
                <td style={styles.td}>{item.destination}</td>
                <td style={styles.td}>{item.flight}</td>
                <td style={styles.td}>{item.aircraft}</td>
                <td style={styles.td}>{item.gate}</td>
                <td style={{ ...styles.td, ...styles.remark }}>ON TIME</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'monospace',
    padding: '2rem 1rem',
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#ffeb3b',
    marginBottom: '2rem',
  },
  boardWrapper: {
    width: '95%',
    maxWidth: '1200px',
    backgroundColor: '#111',
    border: '2px solid #444',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  },
  board: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1.1rem',
    letterSpacing: '1px',
  },
  th: {
    backgroundColor: '#222',
    color: '#ffeb3b',
    padding: '0.75rem',
    border: '1px solid #555',
    textAlign: 'left',
  },
  td: {
    padding: '0.6rem 0.75rem',
    border: '1px solid #333',
    color: '#fff',
    textAlign: 'left',
  },
  remark: {
    color: '#76ff03',
    fontWeight: 600,
  },
};

export default ViewSchedule;