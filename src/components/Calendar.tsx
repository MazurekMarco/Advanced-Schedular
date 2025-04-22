import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { format, addMonths, getDaysInMonth, startOfMonth, getDay, isSameDay, addWeeks, addDays } from 'date-fns';
import { useEventStore } from '../store/eventStore';
import { useThemeStore } from '../store/themeStore';
import ViewSelector from './ViewSelector';
import WeekView from './WeekView';
import DayView from './DayView';
import ThemeToggle from './ThemeToggle';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: Date;
}

interface CalendarProps {
  date?: Date;
  onDateSelect?: (date: Date, event?: CalendarEvent) => void;
}

type ViewType = 'month' | 'week' | 'day';

const Calendar: React.FC<CalendarProps> = ({ 
  date: propDate = new Date(),
  onDateSelect 
}) => {
  const [date, setDate] = useState(propDate);
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const { darkMode } = useThemeStore();
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const events = useEventStore((state) => state.events);
  
  // Set initial view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView('day');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMonthDetails = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDayOfMonth = startOfMonth(date);
    const startingDay = (getDay(firstDayOfMonth) + 6) % 7; // Shift Sunday (0) to 6, Monday (1) to 0, etc.
    const totalDaysNeeded = startingDay + daysInMonth;
    const totalWeeks = Math.ceil(totalDaysNeeded / 7);
    
    return {
      daysInMonth,
      startingDay,
      totalWeeks
    };
  };

  const changeDate = (increment: number) => {
    switch (currentView) {
      case 'month':
        setDate(addMonths(date, increment));
        break;
      case 'week':
        setDate(addWeeks(date, increment));
        break;
      case 'day':
        setDate(addDays(date, increment));
        break;
    }
  };

  const { daysInMonth, startingDay, totalWeeks } = getMonthDetails(date);
  const today = new Date();
  
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (day: number) => {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
    return events.filter(event => isSameDay(event.date, currentDate));
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(date.getFullYear(), date.getMonth(), day);
    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDateSelect) {
      onDateSelect(event.date, event);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const monthDetails = getMonthDetails(date);
    const totalCells = 42; // 6 weeks * 7 days to ensure we always have enough cells

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < monthDetails.startingDay; i++) {
      days.push(
        <div 
          key={`empty-start-${i}`} 
          className={`p-2 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/30'}`}
          aria-hidden="true" 
        />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= monthDetails.daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      
      days.push(
        <div
          key={`day-${day}`}
          className={`p-2 relative transition-all duration-200 cursor-pointer ${
            darkMode
              ? isToday(day)
                ? 'bg-blue-900/30'
                : 'hover:bg-gray-800/70'
              : isToday(day)
                ? 'bg-blue-50'
                : 'hover:bg-gray-50/80'
          }`}
          role="gridcell"
          aria-label={format(new Date(date.getFullYear(), date.getMonth(), day), 'PPPP')}
          onClick={() => handleDayClick(day)}
        >
          <span className={`text-sm ${
            isToday(day) 
              ? 'flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white' 
              : darkMode
                ? 'text-gray-300'
                : 'text-gray-700'
          }`}>
            {day}
          </span>
          {dayEvents.length > 0 && (
            <div className="mt-1 space-y-1">
              {dayEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  className={`text-xs px-2 py-1 rounded truncate cursor-pointer ${
                    darkMode
                      ? 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/50'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Add empty cells for remaining days to complete the grid
    const remainingDays = totalCells - (monthDetails.startingDay + monthDetails.daysInMonth);
    for (let i = 0; i < remainingDays; i++) {
      days.push(
        <div 
          key={`empty-end-${i}`} 
          className={`p-2 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/30'}`}
          aria-hidden="true" 
        />
      );
    }

    return days;
  };

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return (
          <div className="flex-1 grid grid-cols-7 grid-rows-[auto_repeat(6,1fr)] h-full">
            {weekdays.map((day) => (
              <div
                key={day}
                className={`p-2 text-center font-semibold ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-50 text-gray-600'
                }`}
                role="columnheader"
              >
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        );
      case 'week':
        return <WeekView currentDate={date} onEventClick={handleEventClick} />;
      case 'day':
        return <DayView currentDate={date} onEventClick={handleEventClick} />;
    }
  };

  return (
    <div className={`fixed inset-0 flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-4 md:p-6 border-b ${
        darkMode 
          ? 'border-gray-800 bg-gray-900' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => changeDate(-1)}
            className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className={`text-lg md:text-xl font-semibold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {format(date, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => changeDate(1)}
            className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default Calendar; 