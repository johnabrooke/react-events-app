import "./styles.css";
import React, { useState, useMemo } from "react";
import { useEvents } from "./hooks";
import {
  Grid,
  GridColumn as GridColumn,
  GridCellProps,
  GridColumnReorderEvent,
  GridColumnProps,
} from "@progress/kendo-react-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import "@progress/kendo-theme-default/dist/all.css";
import { AddEventForm } from "./addEventForm";

const App: React.FC = () => {
  // Get data from events array
  const { loading, error, events, handleAddEvent, handleDeleteEvent } =
    useEvents();

  const [sort, setSort] = useState<SortDescriptor[]>([
    { field: "company", dir: "asc" }, // Set initial sort by company
  ]);

  // Define the columns configuration inside a useMemo hook.
  const columnsConfig = useMemo<GridColumnProps[]>(
    () => [
      { field: "name", title: "Event Name", width: "250px" },
      { field: "company", title: "Company", width: "200px" },
      { field: "description", title: "Description" },
      {
        field: "actions",
        title: "Actions",
        width: "120px",
        // Define the cell renderer as an inline arrow function.
        // It receives the cell props directly from the Grid.
        cell: (props: GridCellProps) => (
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
        ),
      },
    ],
    [handleDeleteEvent] // The columns config will only be recalculated if handleDeleteEvent changes.
  );

  // Define columns in an array of PROPS objects and manage them in state
  // This is required for the `reorderable` prop to work correctly.
  const [reorderableColumns, setReorderableColumns] =
    useState<GridColumnProps[]>(columnsConfig);

  const handleColumnReorder = (e: GridColumnReorderEvent) => {
    setReorderableColumns(e.columns);
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
        {reorderableColumns.map((col, idx) => (
          <GridColumn {...col} key={idx} />
        ))}
      </Grid>
    </div>
  );
};

export default App;
