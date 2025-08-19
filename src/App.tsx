import "./styles.css";
import React, { useState, useMemo } from "react";
import { useEvents } from "./hooks";
import {
  Grid,
  GridColumn,
  GridCellProps,
  GridColumnReorderEvent,
  GridColumnProps,
} from "@progress/kendo-react-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import "@progress/kendo-theme-default/dist/all.css";
import { AddEventForm } from "./addEventForm";

const App: React.FC = () => {
  const { loading, error, events, handleAddEvent, handleDeleteEvent } =
    useEvents();

  const [sort, setSort] = useState<SortDescriptor[]>([
    { field: "company", dir: "asc" },
  ]);

  // Define the columns with custom rendering outside the state
  const fixedColumns = useMemo<GridColumnProps[]>(
    () => [
      { field: "name", title: "Event Name", width: "250px" },
      { field: "company", title: "Company", width: "200px" },
      { field: "description", title: "Description" },
    ],
    []
  );

  // Define the column that needs the custom cell renderer
  const actionColumn: GridColumnProps = {
    field: "actions",
    title: "Actions",
    width: "120px",
    cells: (props: GridCellProps) => (
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
  };

  const [reorderableColumns, setReorderableColumns] =
    useState<GridColumnProps[]>(fixedColumns);

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
        data={orderBy(events, sort)}
        sortable={true}
        sort={sort}
        onSortChange={(e) => setSort(e.sort)}
        reorderable={true}
        onColumnReorder={handleColumnReorder}
      >
        {/* Render the reorderable columns */}
        {reorderableColumns.map((col) => (
          <GridColumn {...col} key={col.field} />
        ))}
        {/* Render the actions column separately */}
        <GridColumn {...actionColumn} />
      </Grid>
    </div>
  );
};

export default App;
