// NoteDisplay.js

import React, { useState, useEffect } from "react";
import "./NoteDisplay.css";

interface NoteDisplayProps {
  note: string;
}
const NoteDisplay = ({ note }: NoteDisplayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Watch for changes in the "note" prop
  useEffect(() => {
    if (note) {
      // Show the NoteDisplay
      setIsVisible(true);

      // Hide the NoteDisplay after 6 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      return () => {
        clearTimeout(timer); // Clear the timer if component unmounts or "note" changes
      };
    }
  }, [note]);

  return (
    <div className={`note-display ${isVisible ? "visible" : ""}`}>{note}</div>
  );
};

export default NoteDisplay;
