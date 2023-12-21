import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final");

        // Aggregation pipeline
        const pipeline = [
            {"$match": {"Tags": {"$exists": true, "$ne": ""}}},  // Ensure Tags exists and is not empty
            {"$project": {
                "year": {"$year": {"$toDate": "$CreationDate"}},
                // Check if Tags is a string and process accordingly
                "tags": {
                    "$cond": {
                        "if": {"$eq": [{"$type": "$Tags"}, "string"]},
                        "then": {"$split": [{"$substrCP": ["$Tags", 1, {"$subtract": [{"$strLenCP": "$Tags"}, 2]}]}, "><"]},
                        "else": "$Tags"
                    }
                }
            }},
            {"$unwind": "$tags"},
            {"$group": {
                "_id": {
                    "year": "$year",
                    "tag": "$tags"
                },
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id.year": 1, "count": -1}}
        ];

        // Execute the aggregation
        const trends = await db
            .collection("StackOverflowPostsSample")
            .aggregate(pipeline)
            .limit(20) // Limit to the first 20 results
            .toArray();

        res.json(trends);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
