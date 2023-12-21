import React, { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import Dashboard from "./components/Dashboard";
import { Typography } from "@mui/material";

const DifficultQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/difficultQuestions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Dashboard>
        <DataTable data={questions} title="Difficult Questions" />
      </Dashboard>
    </>
  );
};

export default DifficultQuestions;
