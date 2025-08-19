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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

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
      createdOn: new Date().toISOString(),
    };

    onAddEvent(newEvent);

    // Clear the form for the next entry
    setName("");
    setDescription("");
    setCompany("");
    setColor("red");
    setEmail("");
    setPhone("");
    setAddress("");
    setImage("");
    setIsActive(true);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Add New Event</h2>

      <div className="form-row">
        <div className="form-col-half">
          <input
            type="text"
            placeholder="Event Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-col-half">
          <input
            type="text"
            placeholder="Company *"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>

      <textarea
        placeholder="Description *"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-textarea"
        required
      />

      <div className="form-row">
        <div className="form-col-half">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="form-input"
            title="Event Color"
          />
        </div>
        <div className="form-col-half">
          <div className="form-checkbox-container">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="isActive" className="form-checkbox-label">
              Active Event
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-col-half">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-col-half">
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="form-input"
      />

      <input
        type="url"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="form-input"
      />

      <button
        type="submit"
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
      >
        Add Event
      </button>
    </form>
  );
};
