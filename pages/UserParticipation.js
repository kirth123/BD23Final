import React, { useState, useEffect } from "react";
import DataTable from "./components/UserPartDataTable";
import Dashboard from "./components/Dashboard";
import {  Typography } from "@mui/material";

const UserParticipation = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/userParticipation");
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
        <DataTable data={questions} title="User Participations" />
      </Dashboard>
    </>
  );
};

export default UserParticipation;
