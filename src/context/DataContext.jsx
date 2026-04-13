// frontend/src/context/DataContext.jsx
// ✅ Context and hooks only - No constants
// Imports constants from separate file

import React, { createContext } from "react";
import { SAMPLE_CAS_EVENTS } from "./constants.js";

// ✅ Create DataContext
const DataContext = createContext();

// ✅ DataProvider Component - Wraps your App
// This version uses STATIC data from SAMPLE_CAS_EVENTS
// When you add a backend, simply replace the setState logic with API calls
export const DataProvider = ({ children }) => {
  // Initialize with static sample data - NO API CALLS
  const [events, setEvents] = React.useState([]);
  const [casEvents, setCasEvents] = React.useState(SAMPLE_CAS_EVENTS);

  // ✅ OPTIONAL: Uncomment below when you have a backend
  // This will fetch from your backend instead of using static data
  /*
  React.useEffect(() => {
    const fetchCasEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cas-events");
        if (response.ok) {
          const data = await response.json();
          setCasEvents(data);
        }
      } catch (error) {
        console.log("Backend not available, using static data");
        // Falls back to SAMPLE_CAS_EVENTS
      }
    };
    fetchCasEvents();
  }, []);
  */

  // Optional: Simulate data updates locally (without server)
  // Uncomment if you want attendee counts to change every 30 seconds
  /*
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCasEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === "cas-001"
            ? { ...event, attendees: Math.floor(Math.random() * 900) + 700 }
            : event
        )
      );
    }, 30000);
    return () => clearInterval(timer);
  }, []);
  */

  return (
    <DataContext.Provider value={{ events, casEvents, setEvents, setCasEvents }}>
      {children}
    </DataContext.Provider>
  );
};

// ✅ useData Hook - Use this in your components
export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

// Export DataContext as default
export default DataContext;