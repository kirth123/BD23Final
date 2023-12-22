import React, { useState, useEffect } from "react";
import SimilarSuggestions from "./components/SimilarSuggestions";
import Dashboard from "./components/Dashboard";

const TopSimilarQuestions = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analyze");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); 
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Dashboard>
        {data ? (
          <SimilarSuggestions result={data} />
        ) : (
          <div>Loading...</div> 
        )}
      </Dashboard>
    </>
  );
};

export default TopSimilarQuestions;
