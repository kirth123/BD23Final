import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final"); // Replace with your actual database name

        // Define the pipeline for aggregating the most popular tags
        const popularTagsPipeline = [
            { "$match": { "PostTypeId": "1" } }, // Filter for questions
            { "$unwind": "$Tags" },
            { "$group": {
                "_id": "$Tags",
                "count": { "$sum": 1 }
            }},
            { "$sort": { "count": -1 } },
            { "$limit": 10 }
        ];

        // Execute the aggregation pipeline
        const popularTags = await db
            .collection("StackOverflowPostsSample") // Replace with your actual collection name
            .aggregate(popularTagsPipeline)
            .toArray();

        res.json(popularTags);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
