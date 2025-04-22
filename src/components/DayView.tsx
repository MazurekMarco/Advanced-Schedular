import React from 'react';
import { format, isSameDay } from 'date-fns';
import { useEventStore } from '../store/eventStore';
import { useThemeStore } from '../store/themeStore';

interface DayViewProps {
  currentDate: Date;
  onEventClick: (event: any, e: React.MouseEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, onEventClick }) => {
  const events = useEventStore((state) => state.events);
  const { darkMode } = useThemeStore();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);
      
      return isSameDay(eventDate, currentDate) && 
             eventStartHour <= hour && 
             eventEndHour >= hour;
    });
  };

  return (
    <div className={`flex-1 grid grid-cols-2 grid-rows-[auto_repeat(24,1fr)] h-full ${
      darkMode ? 'bg-[#0f1729] text-gray-300' : 'bg-white text-gray-900'
    }`}>
      {/* Time column */}
      <div className={`p-2 text-center font-semibold border-b border-r ${
        darkMode 
          ? 'bg-[#1a2234] text-gray-400 border-gray-700' 
          : 'bg-gray-50 text-gray-600 border-gray-200'
      }`}>
        Time
      </div>
      
      {/* Day header */}
      <div className={`p-2 text-center font-semibold border-b ${
        darkMode 
          ? 'bg-[#1a2234] text-gray-400 border-gray-700' 
          : 'bg-gray-50 text-gray-600 border-gray-200'
      }`}>
        <div className="text-sm">{format(currentDate, 'EEEE')}</div>
        <div className="text-lg">{format(currentDate, 'MMMM d, yyyy')}</div>
      </div>

      {/* Time slots */}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className={`p-2 text-right text-sm border-r ${
            darkMode 
              ? 'text-gray-500 border-gray-700' 
              : 'text-gray-500 border-gray-200'
          }`}>
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
          <div className={`border-b relative ${
            darkMode 
              ? 'border-gray-700' 
              : 'border-gray-200'
          }`}>
            {getEventsForHour(hour).map(event => (
              <div
                key={event.id}
                onClick={(e) => onEventClick(event, e)}
                className={`absolute left-0 right-0 px-2 py-1 m-1 rounded cursor-pointer ${
                  darkMode
                    ? 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/50'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
                style={{
                  top: '0.25rem',
                  bottom: '0.25rem'
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-xs truncate">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default DayView; 