import React from 'react';

const TimePicker = ({ value, onChange, className, ...props }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  const [hour, minute] = (value || '').split(':');

  const handleTimeChange = (newHour, newMinute) => {
    if (newHour && newMinute) {
      const timeValue = `${newHour}:${newMinute}`;
      onChange(timeValue);
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <select
        value={hour || ''}
        onChange={(e) => handleTimeChange(e.target.value, minute || '00')}
        className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">HH</option>
        {hours.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="self-center">:</span>
      <select
        value={minute || ''}
        onChange={(e) => handleTimeChange(hour || '00', e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">MM</option>
        {minutes.filter((_, i) => i % 5 === 0).map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;