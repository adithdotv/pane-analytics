from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/collect")
async def collect(request: Request):
    data = await request.json()
    print("Received pageview:", data)
    return {"status": "ok"}