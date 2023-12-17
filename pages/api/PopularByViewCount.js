import clientPromise from "../../lib/mongodb";

export default async function mostPopularByViewCount(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("final");

    // Ensure an index on ViewCount for efficient sorting
    await db.collection("StackOverflowPosts").createIndex({ ViewCount: -1 });

    const popularByViewCount = await db.collection("StackOverflowPosts")
      .find(
        { ViewCount: { $exists: true } }, // Simplified query
        {
          projection: {
            Title: 1,
            Body: 1, // Consider storing summarized version
            Tags: 1,
            ViewCount: 1
          }
        }
      )
      .sort({ ViewCount: -1 })
      .limit(20)
      .toArray();
    console.log(popularByViewCount);
    const formattedData = popularByViewCount.map(doc => ({
      ...doc,
      Body: doc.Body.substring(0, 100) + '...',
      Tags: doc.Tags.join(', ')
    }));

    res.status(200).json(formattedData);
  } catch (e) {
    console.error("Error in /api/PopularByViewCount:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
