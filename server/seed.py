import sys
import os
import argparse

# Add the server directory to sys.path so 'app' can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from app.core.database import engine
from app.models.user import User
from app.core.security import get_password_hash

def seed_admin(email: str, password: str, name: str):
    with Session(engine) as session:
        # Check if user already exists
        statement = select(User).where(User.email == email)
        existing_user = session.exec(statement).first()

        if existing_user:
            print(f"User with email '{email}' already exists.")
            if not existing_user.is_admin:
                print(f"Promoting '{email}' to admin...")
                existing_user.is_admin = True
                session.add(existing_user)
                session.commit()
                print("User promoted successfully.")
            else:
                print("User is already an admin.")
            
            # Optionally update password if provided differently, but let's keep it simple
            return

        print(f"Creating new admin user...")
        user = User(
            name=name,
            email=email,
            hashed_password=get_password_hash(password),
            is_active=True,
            is_admin=True
        )
        session.add(user)
        session.commit()
        print("✅ Admin created successfully!")
        print(f"   Email: {email}")
        print(f"   Password: {password}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed an admin user into the database.")
    parser.add_argument("--email", type=str, default="admin@3sila.ai", help="Admin email address")
    parser.add_argument("--password", type=str, default="adminpassword123", help="Admin password")
    parser.add_argument("--name", type=str, default="Super Admin", help="Admin display name")
    
    args = parser.parse_args()
    
    print("Starting seeder...")
    seed_admin(args.email, args.password, args.name)
    print("Done.")
