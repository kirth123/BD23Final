import clientPromise from "../../lib/mongodb";

export default async function mostPopularByViewCount(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("final"); 

    const PopularByViewCount = await db.collection("StackOverflowPostsSample") 
      .find(
        {
          ViewCount: { $exists: true },
          Body: { $exists: true },
          Title: { $exists: true },
          Tags: { $exists: true }
        },
        {
          projection: {
            Title: 1,
            Body: 1,
            Tags: 1,
            ViewCount: 1
          }
        }
      )
      .sort({ ViewCount: -1 })
      .collation({ locale: "en_US", numericOrdering: true })
      .limit(20)
      .toArray();

    res.status(200).json(PopularByViewCount);
  } catch (e) {
    console.error("Error in /api/PopularByViewCount:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
