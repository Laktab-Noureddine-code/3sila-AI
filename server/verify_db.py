import sqlite3
import os

db_path = "database.db"

if not os.path.exists(db_path):
    print(f"Database file {db_path} not found. Server might still be starting up.")
else:
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(history)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"History Table Columns: {columns}")
        
        if "original_text" in columns:
            print("SUCCESS: 'original_text' column found.")
        else:
            print("FAILURE: 'original_text' column MISSING. Delete database.db and restart server.")
            
        conn.close()
    except Exception as e:
        print(f"Error checking database: {e}")
