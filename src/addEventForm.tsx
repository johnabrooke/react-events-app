import React, { useState } from "react";
import { Event } from "./event";

type AddEventFormProps = {
  onAddEvent: (event: Omit<Event, "id">) => void;
};

export const AddEventForm: React.FC<AddEventFormProps> = ({ onAddEvent }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [color, setColor] = useState("red");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !description || !color) {
      alert("Name, Company, Description, and Color are required.");
      return;
    }

    // Create a new event object, adding default values for fields not in the form
    const newEvent: Omit<Event, "id"> = {
      name,
      description,
      company,
      color,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      isActive: true,
      email: "",
      phone: "",
      address: "",
      image: "",
      createdOn: "",
    };

    onAddEvent(newEvent);

    // Clear the form for the next entry
    setName("");
    setDescription("");
    setCompany("");
    setColor("red");
  };

  // Basic styling for the form
  const formStyle: React.CSSProperties = {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };
  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "calc(100% - 10px)",
    padding: "8px",
    marginBottom: "10px",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Add New Event</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Color (e.g., red, #FF5733)"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={inputStyle}
      />
      <button type="submit">Add Event</button>
    </form>
  );
};
