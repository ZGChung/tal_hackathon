"""
Database seeding script to populate initial data for demo purposes.
This creates default admin user and pre-populates 2 curriculum files.
"""
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models.user import User, UserRole
from backend.models.curriculum import Curriculum
from backend.services.curriculum_parser import parse_markdown_keywords
from backend.utils.security import get_password_hash
from pathlib import Path
import os


def seed_database():
    """Seed the database with initial data"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Get all admin users
        admin_users = db.query(User).filter(User.role == UserRole.ADMIN).all()
        
        # Create default admin user if no admins exist
        if not admin_users:
            default_admin = User(
                username="demo_admin",
                password_hash=get_password_hash("demo123"),
                role=UserRole.ADMIN
            )
            db.add(default_admin)
            db.commit()
            db.refresh(default_admin)
            admin_users = [default_admin]
            print("Created default admin user: demo_admin / demo123")
        
        # Read and seed curriculum files
        curriculum_files = [
            ("language_arts_curriculum.md", "Language Arts Curriculum"),
            ("social_studies_curriculum.md", "Social Studies Curriculum")
        ]
        
        # Try to find curriculum files in multiple locations
        possible_paths = [
            Path("manual_test/curriculum"),
            Path("frontend/public"),
            Path("../manual_test/curriculum"),
        ]
        
        # Seed curricula for each admin user that doesn't have any
        for admin_user in admin_users:
            # Check if this admin already has curricula
            existing_count = db.query(Curriculum).filter(
                Curriculum.user_id == admin_user.id
            ).count()
            
            if existing_count >= 2:
                print(f"Admin {admin_user.username} already has {existing_count} curricula. Skipping.")
                continue
            
            curricula_added = 0
            for filename, display_name in curriculum_files:
                # Skip if we already have enough for this user
                if curricula_added >= 2:
                    break
                    
                content = None
                file_path = None
                
                # Try to find the file
                for base_path in possible_paths:
                    full_path = base_path / filename
                    if full_path.exists():
                        with open(full_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        file_path = str(full_path)
                        break
                
                if not content:
                    print(f"Warning: Could not find {filename}, skipping...")
                    continue
                
                # Check if this curriculum already exists for this user
                existing = db.query(Curriculum).filter(
                    Curriculum.filename == filename,
                    Curriculum.user_id == admin_user.id
                ).first()
                
                if existing:
                    print(f"Curriculum {filename} already exists for {admin_user.username}, skipping...")
                    continue
                
                # Parse keywords
                keywords = parse_markdown_keywords(content)
                
                # Save file to uploads directory (with user-specific naming to avoid conflicts)
                upload_dir = Path("backend/uploads/curriculum")
                upload_dir.mkdir(parents=True, exist_ok=True)
                saved_filename = f"{admin_user.id}_{filename}"
                saved_file_path = upload_dir / saved_filename
                with open(saved_file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                # Create curriculum record
                curriculum = Curriculum(
                    user_id=admin_user.id,
                    filename=filename,  # Keep original filename for display
                    file_path=str(saved_file_path),
                    keywords=keywords
                )
                
                db.add(curriculum)
                curricula_added += 1
                print(f"Added curriculum: {display_name} for {admin_user.username} with {len(keywords)} keywords")
            
            if curricula_added > 0:
                db.commit()
                print(f"Seeded {curricula_added} curricula for admin {admin_user.username}")
        
        print("Database seeding complete.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

