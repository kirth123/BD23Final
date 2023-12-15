import React, { useState, useEffect } from 'react';

function StackOverflowPostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/posts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
            setLoading(false);
        }

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Top Stack Overflow Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post._id}>
                        <h2>Score: {post.Score}</h2>
                        <div dangerouslySetInnerHTML={{ __html: post.Body }}></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StackOverflowPostsPage;
