import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final"); // Replace with your actual database name

        // User participation aggregation pipeline
        const userParticipationPipeline = [
            {
                "$group": {
                    "_id": "$OwnerUserId",
                    "questionsAsked": {
                        "$sum": {"$cond": [{"$eq": ["$PostTypeId", "1"]}, 1, 0]}
                    },
                    "answersGiven": {
                        "$sum": {"$cond": [{"$eq": ["$PostTypeId", "2"]}, 1, 0]}
                    }
                }
            },
            {
                "$sort": {"questionsAsked": -1, "answersGiven": -1}
            },
            {
                "$limit": 10
            }
        ];

        // Execute the aggregation pipeline
        const activeUsers = await db
            .collection("StackOverflowPostsSample") // Replace with your actual collection name
            .aggregate(userParticipationPipeline)
            .toArray();

        res.json(activeUsers);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
