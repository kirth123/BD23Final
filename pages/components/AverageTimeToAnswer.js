import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function AverageTimeToAnswer() {
  const [averageTime, setAverageTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/runQueries');
        const data = await response.json();

        if (data && data.length > 0) {
          setAverageTime(data[0].averageTimeToAnswer);
        }
      } catch (error) {
        console.error('Error fetching average time to answer:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Title>Average Time to Answer</Title>
      {averageTime ? (
        <>
          <Typography component="p" variant="h4">
            {averageTime.toFixed(2)} hours
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            Average response time
          </Typography>
        </>
      ) : (
        <Typography component="p">
          Loading...
        </Typography>
      )}
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View details
        </Link>
      </div>
    </React.Fragment>
  );
}
