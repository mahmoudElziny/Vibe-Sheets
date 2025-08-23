import React from 'react';

const CurrentDate = () => {
  // Get current date
  const currentDate = new Date();
  
  // Format options
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  // Format date string
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
  // Get appropriate emoji based on day of week
  const getDayEmoji = () => {
    const day = currentDate.getDay();
    const emojis = ['🎉', '😊', '🌟', '🚀', '🌈', '🎯', '🎨']; // Sunday to Saturday
    return emojis[day];
  };

  // Get season/time of day emoji
  const getTimeEmoji = () => {
    const hour = currentDate.getHours();
    if (hour >= 6 && hour < 12) return '☀️'; // Morning
    if (hour >= 12 && hour < 18) return '🌤️'; // Afternoon
    if (hour >= 18 && hour < 22) return '🌙'; // Evening
    return '🌙'; // Night
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xl">{getTimeEmoji()}</span>
      <span className="text-sm text-gray-600 font-medium hidden md:block">
        {formattedDate}
      </span>
      <span className="text-xl">{getDayEmoji()}</span>
    </div>
  );
};

export default CurrentDate;