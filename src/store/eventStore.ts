import { create } from 'zustand';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: Date;
}

interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Omit<Event, 'id'>>) => void;
  deleteEvent: (id: string) => void;
}

// Helper function to convert Date objects to ISO strings for localStorage
const serializeEvent = (event: Event) => ({
  ...event,
  date: event.date.toISOString(),
});

// Helper function to convert ISO strings back to Date objects
const deserializeEvent = (event: any): Event => ({
  ...event,
  date: new Date(event.date),
});

// Load events from localStorage on initial load
const loadEventsFromLocalStorage = (): Event[] => {
  try {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      return parsedEvents.map(deserializeEvent);
    }
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
  }
  return [];
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: loadEventsFromLocalStorage(),
  addEvent: (event) => set((state) => {
    const newEvents = [...state.events, { ...event, id: crypto.randomUUID() }];
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents.map(serializeEvent)));
    return { events: newEvents };
  }),
  updateEvent: (id, event) => set((state) => {
    const newEvents = state.events.map((e) => 
      e.id === id ? { ...e, ...event } : e
    );
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents.map(serializeEvent)));
    return { events: newEvents };
  }),
  deleteEvent: (id) => set((state) => {
    const newEvents = state.events.filter((e) => e.id !== id);
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents.map(serializeEvent)));
    return { events: newEvents };
  }),
})); 