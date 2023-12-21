import clientPromise from "../../lib/mongodb";

export default async function activeHours(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("final"); // Replace with your actual database name

    const activityByHour = await db
      .collection("StackOverflowPosts") // Replace with your actual collection name
      .aggregate([
        {
          $limit: 500000, //take subset of data as collection is too large
        },
        {
          $group: {
            _id: {
              hour: "$HourOfDay",
              type: "$PostTypeId",
            },
            count: { $sum: 1 },
          },
        },
      ]).toArray();

    res.status(200).json(activityByHour);
  } catch (e) {
    console.error("Error in /api/activeHours:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
