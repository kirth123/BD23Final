import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final");

        // Part 1: Finding the top 10 tags
        const topTagsPipeline = [
            { "$unwind": "$Tags" },
            { "$group": { "_id": "$Tags", "count": { "$sum": 1 } } },
            { "$sort": { "count": -1 } },
            { "$limit": 5 }
        ];

        const topTagsResult = await db
            .collection("StackOverflowPostsSample")
            .aggregate(topTagsPipeline)
            .toArray();

        const topTagsList = topTagsResult.map(tag => tag._id);

        // Part 2: Performing trend analysis on the top tags
        const trendAnalysisPipeline = [
            { "$match": { "Tags": { "$in": topTagsList } } },
            { "$unwind": "$Tags" },
            { "$match": { "Tags": { "$in": topTagsList } } },
            { "$project": {
                "year": { "$year": { "$toDate": "$CreationDate" } },
                "month": { "$month": { "$toDate": "$CreationDate" } },
                "tags": "$Tags"
            }},
            { "$group": {
                "_id": {
                    "year": "$year",
                    "month": "$month",
                    "tag": "$tags"
                },
                "count": { "$sum": 1 }
            }},
            { "$sort": { "_id.year": 1, "_id.month": 1, "count": -1 } }
        ];

        const trendAnalysis = await db
            .collection("StackOverflowPostsSample")
            .aggregate(trendAnalysisPipeline)
            .toArray();

        res.json({ topTags: topTagsList, trendAnalysis });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
