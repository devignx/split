from fastapi import FastAPI

app = FastAPI()

HOST = "127.0.0.1"

@app.get("/")
def read_root():
    return f"Access docs page through http://localhost:8000/docs"


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=8000, reload=True)
