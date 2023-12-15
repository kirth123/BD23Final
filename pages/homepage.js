import React, { useState, useEffect } from 'react';
import ThemeRiverChart from './ThemeRiverChart'; // Adjust this import based on your file structure

function HomePage() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/posts');
            const data = await response.json();
            setChartData(transformData(data));
        }
    
        fetchData();
    }, []);
    

    // A function to transform your API data to the format required by the ThemeRiver chart
    function transformData(rawData) {
        const transformedData = [];
    
        rawData.forEach(post => {
            const creationDate = new Date(post.CreationDate).toLocaleDateString();
            const score = parseInt(post.Score, 10);
            transformedData.push([creationDate, score, post.Score]);
        });
    
        return transformedData;
    }
    

    return (
        <div>
            <h1>ThemeRiver Chart</h1>
            <ThemeRiverChart data={chartData} />
        </div>
    );
}

export default HomePage;
