import React, { useEffect, useState } from "react";
import { ReactFlow, Background, Handle } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

function EventNode({ data }) {
  const style = {
    backgroundColor: data.color,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #222",
    textAlign: "center",
    width: "100px",
  };

  return (
    <div style={style}>
      {data.label}
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
}

const API_BASE = "http://localhost:3000/events";

function EventItem({ event, onUpdate, onDelete }) {
  const [title, setTitle] = useState(event.title);

  useEffect(() => {
    setTitle(event.title);
  }, [event.title]);

  return (
    <li key={event.id} style={{ marginBottom: "10px" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => onUpdate(event.id, title)}
        style={{ marginLeft: "5px" }}
      >
        Update
      </button>
      <button onClick={() => onDelete(event.id)} style={{ marginLeft: "5px" }}>
        Delete
      </button>
    </li>
  );
}

function TripPage() {
  const [events, setEvents] = useState([]);

  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const nodes = events.map((event) => ({
    id: event.id,
    type: "eventNode",
    data: { label: event.title, color: event.color },
    position: event.position,
  }));

  const edges = events.slice(0, events.length - 1).map((event, index) => ({
    id: `e-${event.id}-${events[index + 1].id}`,
    source: event.id,
    target: events[index + 1].id,
    type: "default",
    markerEnd: { type: "arrowclosed" },
  }));

  const addEvent = async () => {
    const newPosition =
      events.length > 0
        ? {
            x: events[events.length - 1].position.x + 150,
            y: events[events.length - 1].position.y,
          }
        : { x: 50, y: 50 };

    const newEvent = {
      title: `New Event`,
      description: "",
      position: newPosition,
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const created = await res.json();
      setEvents([...events, created]);
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  const updateEvent = async (id, newTitle) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, title: newTitle } : event
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const newEvents = events.filter((event) => event.id !== id);
      setEvents(newEvents);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{ height: 300, border: "1px solid black", borderRadius: "8px" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ eventNode: EventNode }}
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>

      <div>
        <h2>Event List</h2>
        <button onClick={addEvent}>Add Event</button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onUpdate={updateEvent}
              onDelete={deleteEvent}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TripPage;
