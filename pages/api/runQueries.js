import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("final");
        const col = db.collection("StackOverflowPostsSample");

        const completePipeline = [
            {
                "$match": {
                    "PostTypeId": "1",
                    "AcceptedAnswerId": { "$exists": true, "$ne": "" }
                }
            },
            {
                "$lookup": {
                    "from": 'StackOverflowPostsSample', // Ensure this is the correct name of the answers collection
                    "localField": "AcceptedAnswerId",
                    "foreignField": "Id",
                    "as": "acceptedAnswer"
                }
            },
            { "$unwind": "$acceptedAnswer" },
            { 
                "$project": {
                    "timeToAnswer": {
                        "$subtract": [
                            { "$toDate": "$acceptedAnswer.CreationDate" },
                            { "$toDate": "$CreationDate" }
                        ]
                    },
                    "question": "$$ROOT",
                    "answer": "$acceptedAnswer"
                }
            },
            { 
                "$group": {
                    "_id": null,
                    "averageTimeToAnswer": { "$avg": "$timeToAnswer" }
                }
            }
        ];

        const finalResult = await col.aggregate(completePipeline).toArray();
        res.status(200).json(finalResult);
    } catch (e) {
        console.error("Error running queries:", e);
        res.status(500).send("Internal Server Error");
    }
}
