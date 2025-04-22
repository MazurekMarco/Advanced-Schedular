import { useState } from 'react';
import { useThemeStore } from './store/themeStore';
import Calendar from './components/Calendar';
import AddEventModal from './components/AddEventModal';
import ToastProvider from './components/ToastProvider';

function App() {
  const { darkMode } = useThemeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: Date;
  } | undefined>(undefined);

  const handleDateSelect = (date: Date, event?: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: Date;
  }) => {
    setSelectedDate(date);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <ToastProvider>
        <Calendar onDateSelect={handleDateSelect} />
        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(undefined);
          }}
          selectedDate={selectedDate}
          event={selectedEvent}
        />
      </ToastProvider>
    </div>
  );
}

export default App;
