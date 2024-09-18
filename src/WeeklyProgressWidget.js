import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WeeklyProgressWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekProgress, setWeekProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      setWeekProgress(calculateWeekProgress(now));
    };

    updateProgress(); // Initial calculation
    const timer = setInterval(updateProgress, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, [currentDate]); // Recalculate when currentDate changes

  const calculateWeekProgress = (date) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const totalWeekTime = endOfWeek - startOfWeek;
    const elapsedTime = date - startOfWeek;

    return Math.min(100, Math.max(0, (elapsedTime / totalWeekTime) * 100));
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const getDaysOfWeek = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - currentDay);

    return days.map((day, index) => {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + index);
      return {
        name: day,
        date: currentDate.getDate(),
        isCurrentDay: index === currentDay
      };
    });
  };

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  return (
    <div className="font-sans bg-green-50 p-4 rounded-lg shadow-md max-w-xs mx-auto border-2 border-green-800">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePreviousWeek} className="text-green-800 hover:text-green-900">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-green-800">Week {getWeekNumber(currentDate)}</h2>
        <button onClick={handleNextWeek} className="text-green-800 hover:text-green-900">
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="mb-4">
        {getDaysOfWeek(currentDate).map((day, index) => (
          <div 
            key={index} 
            className={`flex justify-between py-1 px-2 ${day.isCurrentDay ? 'bg-green-700 bg-opacity-20 rounded' : ''}`}
          >
            <span className={`${day.isCurrentDay ? 'font-bold text-green-800' : 'text-green-700'}`}>
              {day.name}
            </span>
            <span className={`${day.isCurrentDay ? 'font-bold text-green-800' : 'text-green-700'}`}>
              {day.date}
            </span>
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-800 bg-green-700 bg-opacity-20">
              Week Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-green-800">
              {weekProgress.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-700 bg-opacity-20">
          <div 
            style={{ width: `${weekProgress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-700"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressWidget;