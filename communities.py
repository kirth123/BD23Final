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

# query - get top 1000 tags
docs = list(col.find({}).limit(20))

# pretty display the resulting docs using pandas
df = pd.DataFrame(docs)
display(df)