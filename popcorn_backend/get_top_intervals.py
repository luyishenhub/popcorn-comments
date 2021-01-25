import random
from math import floor
from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from cockroachdb.sqlalchemy import run_transaction

import flask


Base = declarative_base()



class Engagement(Base):
    """The Engagement class corresponds to the "engagements" database table.
    """
    __tablename__ = 'engagements'
    start = Column(Integer, primary_key=True)
    end = Column(Integer)
    views = Column(Integer)


# Create an engine to communicate with the database. The
# "cockroachdb://" prefix for the engine URL indicates that we are
# connecting to CockroachDB using the 'cockroachdb' dialect.
# For more information, see
# https://github.com/cockroachdb/sqlalchemy-cockroachdb.

engine = create_engine(
    # For cockroach demo:
    'cockroachdb://abc:password@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/second-weasel-275.bank?sslmode=require',
    echo=True                   # Log SQL queries to stdout
)

# # Automatically create the "engagements" table based on the Engagement class.
# Base.metadata.create_all(engine)


# # Populate Table with Random values
# def create_random_engagements(sess, num):
#     new_engagements = []
#     num = 0
#     while num < 100:
#         new_start = num
#         new_interval = floor(random.random()*20)
#         new_end = min(new_start + new_interval, 99)
#         new_engagements.append(
#             Engagement(
#                 start=new_start,
#                 end = new_end,
#                 views=floor(random.random()*1000000)
#             )
#         )
#         num = new_end + 1
#     sess.add_all(new_engagements)

# run_transaction(sessionmaker(bind=engine),
#                 lambda s: create_random_engagements(s, 100))

def getInterval(session):
    source = session.query(Engagement).order_by(Engagement.views.desc()).limit(3)
    results = []
    for s in source:
        results.append((s.start, s.end))

    results.sort(key = lambda x: x[0])
    return results

def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """

    results = run_transaction(sessionmaker(bind=engine), getInterval)

    request_json = request.get_json()

    response = flask.jsonify({'intervals': results})
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET')

    return response

