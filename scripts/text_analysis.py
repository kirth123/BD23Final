import pymongo
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
import nltk
import json


# Connect to MongoDB
client = MongoClient('mongodb+srv://hp2577:900626@final-cluster.uucno.mongodb.net')
db = client.final
sample_col = db['StackOverflowPostsSample']

# Function to clean and tokenize text
def clean_tokenize(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word.isalpha()]
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    return tokens

# Function to calculate Jaccard similarity
def jaccard_similarity(list1, list2):
    set1, set2 = set(list1), set(list2)
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    return len(intersection) / len(union) if len(union) != 0 else 0

# Fetch a random question
random_question = sample_col.aggregate([
    {"$match": {"PostTypeId": 1}},
    {"$sample": {"size": 1}}
]).next()

# Preprocess the body of the random question
random_question_body = ' '.join(clean_tokenize(random_question['Body']))

# Use the tags directly since they are already an array
random_question_tags = random_question['Tags']

# Fetch other questions for comparison
other_questions = list(sample_col.find({
    "PostTypeId": 1,
    "Id": {"$ne": random_question['Id']}
}))

# Prepare corpus for TF-IDF
corpus = [random_question_body] + [' '.join(clean_tokenize(question['Body'])) for question in other_questions]

# Calculate TF-IDF vectors
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(corpus)

# Calculate cosine similarity
cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

# Combine cosine similarity with Jaccard similarity for tags
combined_scores = []
for cosine_sim, question in zip(cosine_similarities, other_questions):
    question_tags = question['Tags']
    jaccard_sim = jaccard_similarity(random_question_tags, question_tags)
    combined_score = (cosine_sim + jaccard_sim) / 2
    combined_scores.append((combined_score, question))

# Sort by combined score and get top 5
top_similar = sorted(combined_scores, key=lambda x: x[0], reverse=True)[:5]

# Prepare the results in a structured JSON format
results = {
    "randomlySelectedQuestion": {
        "id": random_question['Id'],
        "tags": random_question['Tags'],
        "body": random_question['Title']
    },
    "topSimilarQuestions": [
        {
            "id": question['Id'],
            "similarity": score,
            "tags": question['Tags'],
            "body": question['Title']
        } for score, question in top_similar
    ]
}

# Output the results as JSON
print(json.dumps(results))
