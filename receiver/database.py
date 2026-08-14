import psycopg2

from config import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER


def get_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
    )


def create_tables():
    """Idempotent schema setup, run on startup so every environment (local, CI, prod) stays in sync."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS sites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            name TEXT NOT NULL,
            site_key TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS pageviews (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            referrer TEXT,
            country TEXT,
            device_type TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            site_id INTEGER REFERENCES sites(id)
        );

        ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS site_id INTEGER REFERENCES sites(id);
    """)
    conn.commit()
    cur.close()
    conn.close()
