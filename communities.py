import pymongo
from IPython.display import display
from pymongo import MongoClient
import pandas as pd
from dotenv import dotenv_values

config = dotenv_values(".env")


# setup mongo connection
client = MongoClient('mongodb+srv://' + config['MONGO_USER'] + ':' + config['MONGO_PASS'] + '@final-cluster.uucno.mongodb.net')
db = client.final
col = db.StackOverflowPosts

# Aggregation pipeline - count of each tag
pipeline = [
    {
        "$match": {
            "Tags": {"$exists": True, "$type": "string"}
        }
    },
    {
        "$addFields": {
            "TagsArray": {
                "$split": [
                    {"$substrCP": ["$Tags", 1, {"$subtract": [{"$strLenCP": "$Tags"}, 2]}]},
                    "><"
                ]
            }
        }
    },
    {"$unwind": "$TagsArray"},
    {
        "$group": {
            "_id": "$TagsArray",
            "count": {"$sum": 1}
        }
    },
    {"$sort": {"count": -1}},
    {"$limit": 1000}
]

# Execute the aggregation query
docs = list(col.aggregate(pipeline))


# pretty display the resulting docs using pandas
df = pd.DataFrame(docs)
display(df)