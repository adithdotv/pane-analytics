from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS
from database import create_tables
from routers import auth, collect, sites, stats


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sites.router)
app.include_router(collect.router)
app.include_router(stats.router)
