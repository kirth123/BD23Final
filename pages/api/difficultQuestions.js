import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final"); 

        // Assuming 'PostTypeId', 'Score', and 'ViewCount' are stored as strings in the collection
        const difficultQuestions = await db
            .collection("StackOverflowPostsSample") 
            .find({
                "PostTypeId": "1",  // '1' for questions
                "Score": {"$lte": "1"},  // Score as string
                "ViewCount": {"$gte": "1000"}  // ViewCount as string
            })
            .sort({ "ViewCount": -1 }) // Sorting by ViewCount in descending order
            .limit(3)
            .toArray();

        res.status(200).json(difficultQuestions);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
