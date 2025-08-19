import { useState, useEffect } from "react";
import { Event } from "./event";
import { getEvents, addEvent, updateEvent, deleteEvent } from "./eventService";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleAddEvent = async (eventData: Omit<Event, "id">) => {
    try {
      const newEventFromServer = await addEvent(eventData);
      // Add the new event to the existing state
      setEvents((prevEvents) => [...prevEvents, newEventFromServer]);
    } catch (error) {
      console.error("Failed to add event:", error);
      // set an error state here to show the user
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const updatedEventFromServer = await updateEvent(updatedEvent);
      // Update the event in the local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEventFromServer : event
        )
      );
    } catch (error) {
      console.error("Failed to update event:", error);
      // You might want to set an error state here to show the user
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      // Remove the event from the local state for an instant UI update
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  // Return the raw events and status. The component will handle sorting.
  return {
    loading,
    error,
    events,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  };
};
