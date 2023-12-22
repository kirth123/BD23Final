import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final"); // Replace with your actual database name

        // Define the pipeline for aggregating the most popular tags
        const popularTagsPipeline = [
            { "$limit": 10000 }, // Limit the number of documents for processing
            { "$match": { "PostTypeId": 1 } }, // Filter for questions
            { "$unwind": "$Tags" }, // Unwind the Tags array
            { "$group": {
                "_id": "$Tags",
                "count": { "$sum": 1 }
            }},
            { "$sort": { "count": -1 } },
            { "$limit": 10 } // Limit the number of tags returned
        ];
        
        // Assuming 'StackOverflowPosts' is your collection name
        const popularTags = await db
            .collection("StackOverflowPosts")
            .aggregate(popularTagsPipeline)
            .toArray();

        res.json(popularTags);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
