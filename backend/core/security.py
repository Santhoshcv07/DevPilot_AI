from passlib.context import CryptContext
from datetime import datetime, timedelta # NEW IMPORT
import jwt # NEW IMPORT
fromcore.config import settings # NEW IMPORT

# 1. Initialize the CryptContext using the bcrypt algorithm
# deprecated="auto" tells passlib to automatically upgrade old hashes if the algorithm gets updated in the future.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Takes a plain text password and returns a securely salted bcrypt hash.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Takes a plain text password, hashes it, and compares it to the hash in the database.
    Returns True if they match, False if they don't.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Creates a JWT access token with the given data and expiration.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt