import clientPromise from "../../lib/mongodb";


export default async (req, res) => {
    console.log("API endpoint hit");
  try {
    const client = await clientPromise;
    const db = client.db("final");
    console.log("Connected to database");
    // Fetch a random question
    const randomQuestionAggregate = await db
      .collection("StackOverflowPostsSample")
      .aggregate([{ $match: { PostTypeId: "1" } }, { $sample: { size: 1 } }])
      .toArray();

    if (randomQuestionAggregate.length === 0) {
      res.status(404).json({ message: "No question found" });
      return;
    }

    const randomQuestion = randomQuestionAggregate[0];
    const randomQuestionTagSet = getTagSet(randomQuestion.Tags);

    // Fetch other questions
    const otherQuestionsCursor = db.collection("StackOverflowPostsSample")
      .find({ PostTypeId: "1", _id: { $ne: randomQuestion._id } });
    
    const otherQuestions = await otherQuestionsCursor.toArray();

    // Calculate Jaccard similarity for tags
    const similarityScores = otherQuestions.map(question => {
      const questionTagSet = getTagSet(question.Tags);
      const jaccardSim = jaccardSimilarity(randomQuestionTagSet, questionTagSet);
      return {
        ...question,
        similarityScore: jaccardSim
      };
    });

    // Filter based on a threshold
    const similarityThreshold = 0.3;
    const filteredSimilarityScores = similarityScores
      .filter(question => question.similarityScore >= similarityThreshold);

    // Sort by similarity score
    const sortedQuestions = filteredSimilarityScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10);

    res.json(sortedQuestions.map(question => ({
      id: question._id,
      similarityScore: question.similarityScore,
      body: question.Body,
      tags: question.Tags
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

function getTagSet(tags) {
  if (Array.isArray(tags)) {
    return new Set(tags);
  }
  if (typeof tags === 'string') {
    return new Set(tags.match(/<([^>]+)>/g) || []);
  }
  return new Set();
}

function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}