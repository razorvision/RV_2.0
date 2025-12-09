# FastAPI Patterns

Patterns, best practices, and common gotchas for building APIs with FastAPI.

## Quick Start

### Prerequisites

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install fastapi uvicorn[standard] sqlalchemy alembic pydantic-settings
```

### Minimal App

```python
# main.py
from fastapi import FastAPI

app = FastAPI(
    title="My API",
    description="API description",
    version="1.0.0",
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Run Development Server

```bash
uvicorn main:app --reload --port 8000
```

## Project Structure

```
my-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings and configuration
│   ├── dependencies.py      # Shared dependencies
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # API dependencies (auth, db)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py    # Main v1 router
│   │       └── endpoints/
│   │           ├── users.py
│   │           ├── items.py
│   │           └── auth.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py      # JWT, password hashing
│   │   └── exceptions.py    # Custom exceptions
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # SQLAlchemy models
│   │   └── item.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py          # Pydantic schemas
│   │   └── item.py
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── base.py          # Base CRUD class
│   │   ├── user.py
│   │   └── item.py
│   └── db/
│       ├── __init__.py
│       ├── session.py       # Database session
│       └── init_db.py       # Database initialization
├── alembic/                 # Database migrations
│   ├── versions/
│   └── env.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   └── api/
│       └── test_users.py
├── alembic.ini
├── pyproject.toml
├── requirements.txt
└── .env
```

## Configuration

### Settings with Pydantic

```python
# app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    app_name: str = "My API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str
    database_pool_size: int = 5

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    backend_cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

### Environment File

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
SECRET_KEY=your-super-secret-key-here
DEBUG=true
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

## Database (SQLAlchemy)

### Session Management

```python
# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_size=settings.database_pool_size,
    pool_pre_ping=True,  # Verify connections before use
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Models

```python
# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### CRUD Operations

```python
# app/crud/base.py
from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: int) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_data = obj_in.model_dump()
        db_obj = self.model(**obj_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType
    ) -> ModelType:
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
```

```python
# app/crud/user.py
from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(
        self, db: Session, *, email: str, password: str
    ) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

user = CRUDUser(User)
```

## Schemas (Pydantic)

```python
# app/schemas/user.py
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None

# Properties to return via API
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Properties stored in DB
class UserInDB(UserResponse):
    hashed_password: str
```

## API Endpoints

### Router Setup

```python
# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1.endpoints import users, items, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
```

### User Endpoints

```python
# app/api/v1/endpoints/users.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud import user as crud_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve users."""
    users = crud_user.user.get_multi(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
):
    """Create new user."""
    user = crud_user.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists.",
        )
    user = crud_user.user.create(db, obj_in=user_in)
    return user

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_active_user),
):
    """Get current user."""
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
):
    """Update current user."""
    user = crud_user.user.update(db, db_obj=current_user, obj_in=user_in)
    return user
```

## Authentication

### Security Utilities

```python
# app/core/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm
    )
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### Auth Dependencies

```python
# app/api/deps.py
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.config import settings
from app.crud import user as crud_user
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_prefix}/auth/login")

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud_user.user.get(db, id=int(user_id))
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user
```

### Auth Endpoints

```python
# app/api/v1/endpoints/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.crud import user as crud_user
from app.core.security import create_access_token
from app.config import settings
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """OAuth2 compatible token login."""
    user = crud_user.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
```

## Error Handling

### Custom Exceptions

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class BadRequestException(HTTPException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
```

### Global Exception Handler

```python
# app/main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

app = FastAPI()

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error occurred"},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )
```

## Middleware

### CORS

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Request Logging

```python
# app/main.py
import time
import logging
from fastapi import Request

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    logger.info(
        f"{request.method} {request.url.path} "
        f"completed in {process_time:.3f}s "
        f"status={response.status_code}"
    )
    return response
```

## Database Migrations (Alembic)

### Setup

```bash
# Initialize Alembic
alembic init alembic

# Edit alembic/env.py to use your models and database URL
```

```python
# alembic/env.py
from app.db.session import Base
from app.config import settings
from app.models import user, item  # Import all models

target_metadata = Base.metadata

def get_url():
    return settings.database_url
```

### Commands

```bash
# Create migration
alembic revision --autogenerate -m "Add users table"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current version
alembic current

# Show migration history
alembic history
```

## Testing

### Fixtures

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.session import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
```

### Test Example

```python
# tests/api/test_users.py
def test_create_user(client):
    response = client.post(
        "/api/v1/users/",
        json={"email": "test@example.com", "password": "testpassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_create_user_existing_email(client, db):
    # Create user first
    client.post(
        "/api/v1/users/",
        json={"email": "test@example.com", "password": "testpassword123"},
    )
    # Try to create duplicate
    response = client.post(
        "/api/v1/users/",
        json={"email": "test@example.com", "password": "testpassword123"},
    )
    assert response.status_code == 400
```

## Common Gotchas

### 1. Async Database Sessions

```python
# For async SQLAlchemy (SQLAlchemy 2.0+)
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

async_engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://")
)
AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
```

### 2. Background Tasks

```python
from fastapi import BackgroundTasks

@router.post("/email")
async def send_email(
    email: str,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(send_email_task, email)
    return {"message": "Email queued"}

def send_email_task(email: str):
    # Long-running task
    pass
```

### 3. File Uploads

```python
from fastapi import File, UploadFile

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    # Process file
    return {"filename": file.filename, "size": len(contents)}
```

### 4. Response Models with Relationships

```python
# Use Config.from_attributes = True for ORM models
class UserWithItems(UserResponse):
    items: List[ItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
```

## Commands Reference

```bash
# Development
uvicorn app.main:app --reload                    # Start dev server
uvicorn app.main:app --reload --port 8000        # Custom port

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production mode
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Database
alembic upgrade head                              # Apply migrations
alembic revision --autogenerate -m "message"     # Create migration
alembic downgrade -1                              # Rollback

# Testing
pytest                                            # Run all tests
pytest -v                                         # Verbose
pytest --cov=app                                  # With coverage

# Linting
ruff check .                                      # Run linter
ruff format .                                     # Format code
mypy app                                          # Type checking
```

## Related Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

---

**Last Updated:** 2024-12-08
