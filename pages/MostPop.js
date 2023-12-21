import * as React from "react";
import { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./components/Title";
import Dashboard from "./components/Dashboard";
import {  Typography } from "@mui/material";

// Function to create a row data
function createData(id, title, viewCount, body, tags) {
  return { id, title, viewCount, body, tags };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function MostPop() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/PopularByViewCount"); // Adjust API endpoint as needed
        const data = await response.json();

        // Formatting the data
        const formattedData = data.map((item, index) => {
          // Convert Tags to string if it's an array
          const tagsString = Array.isArray(item.Tags)
            ? item.Tags.join(", ")
            : item.Tags;
          return createData(
            index,
            item.Title,
            item.ViewCount,
            item.Body,
            tagsString
          );
        });
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Dashboard>
        <Title>Popular Questions</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">View Count</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Excerpt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell align="right">{row.viewCount}</TableCell>
                <TableCell>{row.tags}</TableCell>
                <TableCell
                  dangerouslySetInnerHTML={{
                    __html: row.body.substring(0, 100) + "...",
                  }}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
          See more questions
        </Link>
      </Dashboard>
    </React.Fragment>
  );
}
