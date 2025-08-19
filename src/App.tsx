import "./styles.css";
import React, { useState } from "react";
import { useEvents } from "./hooks";
import {
  Grid,
  GridColumn as GridColumn,
  GridCellProps,
  GridColumnReorderEvent,
} from "@progress/kendo-react-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import "@progress/kendo-theme-default/dist/all.css";
import { AddEventForm } from "./addEventForm";
import { EventModal } from "./EventModal";
import { Event } from "./event";

const App: React.FC = () => {
  // Get data from events array
  const {
    loading,
    error,
    events,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  } = useEvents();

  const [sort, setSort] = useState<SortDescriptor[]>([
    { field: "company", dir: "asc" }, // Set initial sort by company
  ]);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal with event details
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Create a simple cell renderer function
  const ActionCell = (props: GridCellProps) => {
    return (
      <td className={props.className}>
        <div className="action-buttons">
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-info"
            onClick={() => handleViewEvent(props.dataItem)}
            title="View event details"
          >
            View
          </button>
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${props.dataItem.name}"?`
                )
              ) {
                handleDeleteEvent(props.dataItem.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </td>
    );
  };

  // Define columns as JSX elements directly instead of using state
  const handleColumnReorder = (e: GridColumnReorderEvent) => {
    // You can handle column reordering here if needed
    console.log("Columns reordered:", e.columns);
  };

  if (loading) return <div>⏳ Loading events...</div>;
  if (error) return <div style={{ color: "red" }}>❌ Error: {error}</div>;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Events</h1>

      <AddEventForm onAddEvent={handleAddEvent} />

      <Grid
        // Pass the sorted data to the grid. orderBy performs the sorting.
        data={orderBy(events, sort)}
        // Enable the built-in sorting UI (clickable headers)
        sortable={true}
        // Tell the Grid what the current sort state is
        sort={sort}
        // Update our state when the user clicks a column to sort
        onSortChange={(e) => setSort(e.sort)}
        // The order of columns can be changed
        reorderable={true}
        // Add the reorder handler
        onColumnReorder={handleColumnReorder}
      >
        <GridColumn field="name" title="Event Name" width="250px" />
        <GridColumn field="company" title="Company" width="200px" />
        <GridColumn field="description" title="Description" />
        <GridColumn
          field="actions"
          title="Actions"
          width="120px"
          cells={{
            data: ActionCell,
          }}
        />
      </Grid>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleUpdateEvent}
      />
    </div>
  );
};

export default App;
