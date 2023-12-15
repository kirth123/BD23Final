import clientPromise from "../../lib/mongodb";

export default async function activeHours(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("final"); // Replace with your actual database name

    const activityByHour = await db.collection("StackOverflowPostsSample") // Replace with your actual collection name
      .aggregate([
        {
          // Manually parse the string to date if it's in a recognized format
          $addFields: {
            convertedDate: {
              $dateFromString: {
                dateString: "$CreationDate",
                // Add 'format' option if your date format is different
                // format: "%Y-%m-%dT%H:%M:%S.%LZ" for example
              }
            }
          }
        },
        {
          $project: {
            hourOfDay: { $hour: "$convertedDate" }, // Extract the hour part of the date
            postType: "$PostTypeId" // Assuming '1' for question and '2' for answer
          }
        },
        {
          $group: {
            _id: { hour: "$hourOfDay", type: "$postType" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.hour": 1 }
        }
      ])
      .toArray();

    res.status(200).json(activityByHour);
  } catch (e) {
    console.error("Error in /api/activeHours:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
