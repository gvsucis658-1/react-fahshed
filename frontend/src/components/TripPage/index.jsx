import React, { useState } from "react";
import { ReactFlow, addEdge, Background, Handle } from "@xyflow/react";
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

function TripPage() {
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Event 1",
      description: "Description for Event 1",
      position: { x: 50, y: 50 },
      color: getRandomColor(),
    },
  ]);

  const nodes = events.map((event) => ({
    id: event.id,
    type: "eventNode",
    data: { label: event.title, color: event.color },
    position: event.position,
  }));

  const [edges, setEdges] = useState([]);

  const addEvent = () => {
    // Calculate newId using the last event's id if available.
    const newId =
      events.length > 0
        ? (Number(events[events.length - 1].id) + 1).toString()
        : "1";

    const newPosition =
      events.length > 0
        ? {
            x: events[events.length - 1].position.x + 150,
            y: events[events.length - 1].position.y,
          }
        : { x: 50, y: 50 };

    const newEvent = {
      id: newId,
      title: `Event ${newId}`,
      description: "",
      position: newPosition,
      color: getRandomColor(),
    };

    let newEdge = null;
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      newEdge = {
        id: `e-${lastEvent.id}-${newId}`,
        source: lastEvent.id,
        target: newId,
        type: "default",
        // style: { stroke: "#222", strokeWidth: 2 },
        markerEnd: {
          type: "arrowclosed",
          // color: "#222",
          // width: 15,
          // height: 15,
        },
      };
    }

    setEvents([...events, newEvent]);
    if (newEdge) {
      setEdges([...edges, newEdge]);
    }
  };

  const updateEvent = (id, newTitle) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, title: newTitle } : event
    );
    setEvents(updatedEvents);
  };

  const deleteEvent = (id) => {
    const index = events.findIndex((event) => event.id === id);
    const newEvents = events.filter((event) => event.id !== id);
    let newEdges = edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );

    if (index > 0 && index < events.length - 1) {
      const prevEvent = events[index - 1];
      const nextEvent = events[index + 1];
      const newEdge = {
        id: `e-${prevEvent.id}-${nextEvent.id}`,
        source: prevEvent.id,
        target: nextEvent.id,
        type: "default",
        // style: { stroke: "#222", strokeWidth: 2 },
        markerEnd: {
          type: "arrowclosed",
          // color: "#222",
          // width: 15,
          // height: 15,
        },
      };
      newEdges = [...newEdges, newEdge];
    }

    setEvents(newEvents);
    setEdges(newEdges);
  };

  return (
    <div>
      <div style={{ height: 200 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ eventNode: EventNode }}
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>

      <div style={{ padding: "10px" }}>
        <h2>Event List</h2>
        <button onClick={addEvent}>Add Event</button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: "10px" }}>
              <input
                type="text"
                value={event.title}
                onChange={(e) => updateEvent(event.id, e.target.value)}
              />
              <button
                onClick={() => deleteEvent(event.id)}
                style={{ marginLeft: "5px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TripPage;
