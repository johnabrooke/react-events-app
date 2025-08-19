import { Event } from "./event";

const API_URL = "https://rf-json-server.herokuapp.com/events-5/";

// Sends a POST request to the API to create a new event
export const addEvent = async (
  eventData: Omit<Event, "id">
): Promise<Event> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to create event on the server.");
  }

  return response.json(); // The server returns the new event, including the new ID
};

// Fetch all events
export const getEvents = async (): Promise<Event[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    // Let the caller handle the error.
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: Event[] = await response.json();

  return data;
};

// Update existing event
export const updateEvent = async (event: Event): Promise<Event> => {
  const response = await fetch(`${API_URL}${event.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Failed to update event on the server.");
  }

  return response.json(); // The server returns the updated event
};

// This function sends a DELETE request to remove an event by its ID
export const deleteEvent = async (eventId: number): Promise<void> => {
  const response = await fetch(`${API_URL}${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete the event on the server.");
  }
  // A successful DELETE request does not return any content
};
