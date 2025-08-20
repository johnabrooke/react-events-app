import React, { useState, useEffect } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Event } from "./event";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Event | null>(null);

  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      setFormData({ ...event });
      setIsEditing(false);
    }
  }, [event]);

  // Early return if no data
  if (!event || !isOpen || !formData) {
    return null;
  }

  const handleInputChange = (field: keyof Event, value: string | boolean) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = () => {
    if (formData) {
      // Validate required fields
      if (
        !formData.name?.trim() ||
        !formData.description?.trim() ||
        !formData.company?.trim() ||
        !formData.color?.trim()
      ) {
        alert("Name, Description, Company, and Color are required.");
        return;
      }

      // Validate email format if provided
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Validate image URL format if provided
      if (formData.image && !/^https?:\/\/.+/.test(formData.image)) {
        alert(
          "Please enter a valid image URL (must start with http:// or https://)."
        );
        return;
      }

      // Trim string values before saving
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        image: formData.image.trim(),
      };

      onSave(cleanedData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...event });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  const renderField = (
    label: string,
    field: keyof Event,
    type:
      | "text"
      | "textarea"
      | "email"
      | "tel"
      | "date"
      | "time"
      | "color"
      | "checkbox" = "text",
    required: boolean = false
  ) => {
    // Ensure formData is not null
    if (!formData) return null;

    const value = formData[field];
    const labelClass = required ? "field-label required" : "field-label";

    if (field === "id") {
      return (
        <div>
          <label className={labelClass}>{label}:</label>
          <div className="field-value">{value}</div>
        </div>
      );
    }

    if (!isEditing) {
      if (field === "isActive") {
        return (
          <div>
            <label className={labelClass}>{label}:</label>
            <div className="field-value">
              <input
                type="checkbox"
                checked={value as boolean}
                disabled={true}
                className="form-checkbox"
              />
              <span>{value ? "Active" : "Inactive"}</span>
            </div>
          </div>
        );
      }

      if (field === "color") {
        return (
          <div>
            <label className={labelClass}>{label}:</label>
            <div className="field-value">
              <span
                className="color-indicator"
                style={{ backgroundColor: (value as string) || "#ccc" }}
              ></span>
              {(value as string) || "Not specified"}
            </div>
          </div>
        );
      }

      if (field === "email" && value) {
        return (
          <div>
            <label className={labelClass}>{label}:</label>
            <div className="field-value">
              <a href={`mailto:${value}`}>{value as string}</a>
            </div>
          </div>
        );
      }

      if (field === "phone" && value) {
        return (
          <div>
            <label className={labelClass}>{label}:</label>
            <div className="field-value">
              <a href={`tel:${value}`}>{value as string}</a>
            </div>
          </div>
        );
      }

      if (field === "date") {
        return (
          <div>
            <label className={labelClass}>{label}:</label>
            <div className="field-value">{formatDate(value as string)}</div>
          </div>
        );
      }

      if (field === "createdOn") {
        return (
          <div>
            <label className={labelClass}>{label}:</label>
            <div className="field-value">
              {value ? formatDate(value as string) : "Not specified"}
            </div>
          </div>
        );
      }

      return (
        <div>
          <label className={labelClass}>{label}:</label>
          <div className="field-value">
            {(value as string) || "Not specified"}
          </div>
        </div>
      );
    }

    // Editing mode
    if (type === "checkbox") {
      return (
        <div className="form-checkbox-container">
          <input
            type="checkbox"
            id={field}
            checked={value as boolean}
            onChange={(e) => handleInputChange(field, e.target.checked)}
            className="form-checkbox"
          />
          <label htmlFor={field} className="form-checkbox-label">
            {label}
          </label>
        </div>
      );
    }

    if (type === "color") {
      return (
        <div>
          <label className={labelClass} htmlFor={field}>
            {label}:
          </label>
          <div className="color-picker-container">
            <input
              type="color"
              id={field}
              value={value as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="form-input"
            />
            <span
              className="color-preview"
              style={{ backgroundColor: value as string }}
            ></span>
            <span className="color-value">{value as string}</span>
          </div>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div>
          <label className={labelClass} htmlFor={field}>
            {label}:
          </label>
          <textarea
            id={field}
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="form-textarea"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      );
    }

    return (
      <div>
        <label className={labelClass} htmlFor={field}>
          {label}:
        </label>
        <input
          type={type}
          id={field}
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="form-input"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <Dialog
      title={`${isEditing ? "Edit" : "View"} Event: ${event.name}`}
      onClose={onClose}
      width={700}
      height="auto"
    >
      <div className="modal-container">
        {/* Basic Information */}
        <div className="field-group">
          <h3>Basic Information</h3>

          {renderField("ID", "id")}
          {renderField("Event Name", "name", "text", true)}
          {renderField("Company", "company", "text", true)}
          {renderField("Description", "description", "textarea", true)}
          {renderField("Color", "color", "color", true)}
          {renderField("Active Status", "isActive", "checkbox")}
        </div>

        {/* Schedule */}
        <div className="field-group">
          <h3>Schedule</h3>

          <div className="form-row">
            <div className="form-col-half">
              {renderField("Date", "date", "date")}
            </div>
            <div className="form-col-half">
              {renderField("Time", "time", "time")}
            </div>
          </div>

          {renderField("Created On", "createdOn")}
        </div>

        {/* Contact Information */}
        <div className="field-group">
          <h3>Contact Information</h3>

          {renderField("Email", "email", "email")}
          {renderField("Phone", "phone", "tel")}
          {renderField("Address", "address", "textarea")}
        </div>

        {/* Image */}
        <div className="field-group">
          <h3>Image</h3>

          {renderField("Image URL", "image")}

          {formData.image && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={formData.image}
                alt={`Image for ${formData.name}`}
                className="event-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <DialogActionsBar>
        <div className="button-group">
          {!isEditing ? (
            <>
              <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-info"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                onClick={onClose}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-success"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </DialogActionsBar>
    </Dialog>
  );
};
