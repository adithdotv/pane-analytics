from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, collect, sites, stats

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sites.router)
app.include_router(collect.router)
app.include_router(stats.router)
