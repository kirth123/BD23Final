import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("final");

    // Assuming 'PostTypeId', 'Score', and 'ViewCount' are stored as strings in the collection
    const difficultQuestions = await db
      .collection("StackOverflowPostsSample") // Replace with your actual collection name
      .find({
        PostTypeId: 1, // 1 for questions, as an integer
        Score: { $lte: 1 }, // Score as an integer
        ViewCount: { $gte: 1000 }, // ViewCount as an integer
      })
      .sort({ ViewCount: -1 }) // Sorting by ViewCount in descending order
      .limit(3) // Limit to 3 documents
      .toArray();

    res.status(200).json(difficultQuestions);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
