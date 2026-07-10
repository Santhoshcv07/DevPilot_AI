from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
fromcore.config import settings

# 1. Create the Engine (The Telephone Line)
# We feed it the secret database_url from our Pydantic settings.
engine = create_engine(settings.database_url)

# 2. Create the Session (The Phone Call Factory)
# autocommit=False: We want to manually confirm changes before saving them.
# autoflush=False: We don't want to prematurely push data before it's ready.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Create the Base (The Blueprint)
# All of our future database models will inherit from this class.
Base = declarative_base()

# 4. Dependency Injection: The Database Session Generator
def get_db():
    """
    Creates a new database session for a single request and 
    closes it when the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()