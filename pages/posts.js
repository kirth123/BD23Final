import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import {  Typography } from "@mui/material";

function StackOverflowPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography variant="h6" color="text.primary">
        Top Stack Overflow Posts
      </Typography>
      <Dashboard>
        <div>
          <h1>Top Stack Overflow Posts</h1>
          <ul>
            {posts.map((post) => (
              <li key={post._id}>
                <h2>Score: {post.Score}</h2>
                <div dangerouslySetInnerHTML={{ __html: post.Body }}></div>
              </li>
            ))}
          </ul>
        </div>
      </Dashboard>
    </>
  );
}

export default StackOverflowPostsPage;
