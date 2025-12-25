"""
Database seeding script to populate initial data for demo purposes.
This creates default admin user and pre-populates 3 curriculum files.
"""
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models.user import User, UserRole
from backend.models.curriculum import Curriculum
from backend.models.preferences import Preferences
from backend.services.curriculum_parser import parse_markdown_keywords
from backend.utils.security import get_password_hash
from pathlib import Path
import os
import json

# Get project root directory (parent of backend directory)
PROJECT_ROOT = Path(__file__).parent.parent.absolute()


def seed_database():
    """Seed the database with initial data"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Get all admin users
        admin_users = db.query(User).filter(User.role == UserRole.ADMIN).all()
        
        # Create default test accounts
        test_accounts = [
            ("admin_test", "admin123", UserRole.ADMIN),
            ("user_test", "user123", UserRole.STUDENT),
        ]
        
        for username, password, role in test_accounts:
            existing = db.query(User).filter(User.username == username).first()
            if not existing:
                test_user = User(
                    username=username,
                    password_hash=get_password_hash(password),
                    role=role
                )
                db.add(test_user)
                print(f"Created test account: {username} / {password} (Role: {role.value})")
        
        # Create default admin user if no admins exist (for backward compatibility)
        if not admin_users:
            default_admin = User(
                username="demo_admin",
                password_hash=get_password_hash("demo123"),
                role=UserRole.ADMIN
            )
            db.add(default_admin)
            print("Created default admin user: demo_admin / demo123")
        
        # Commit all new users
        db.commit()
        
        # Refresh admin_users list after commit
        admin_users = db.query(User).filter(User.role == UserRole.ADMIN).all()
        
        # Read and seed curriculum files
        curriculum_files = [
            ("english_vocabulary_curriculum.md", "英语词汇学习"),
            ("chinese_idioms_curriculum.md", "中国成语学习"),
            ("chinese_poetry_curriculum.md", "中国古诗学习")
        ]
        
        # Try to find curriculum files in multiple locations (using absolute paths)
        possible_paths = [
            PROJECT_ROOT / "manual_test" / "curriculum",
            PROJECT_ROOT / "frontend" / "public",
            PROJECT_ROOT / "backend" / "uploads" / "curriculum",  # In case files were already uploaded
        ]
        
        # Old default curricula to remove (replaced by new ones)
        old_default_curricula = [
            "language_arts_curriculum.md",
            "social_studies_curriculum.md",
            "mathematics_curriculum.md",
            "science_curriculum.md",
            "computer_science_curriculum.md"
        ]
        
        # First, remove old default curricula for all admin users (always do this)
        for admin_user in admin_users:
            old_curricula = db.query(Curriculum).filter(
                Curriculum.user_id == admin_user.id,
                Curriculum.filename.in_(old_default_curricula)
            ).all()
            
            if old_curricula:
                for old_curriculum in old_curricula:
                    # Delete the file if it exists
                    if old_curriculum.file_path and os.path.exists(old_curriculum.file_path):
                        try:
                            os.remove(old_curriculum.file_path)
                        except Exception as e:
                            print(f"Warning: Could not delete file {old_curriculum.file_path}: {e}")
                    db.delete(old_curriculum)
                    print(f"Removed old curriculum: {old_curriculum.filename} for {admin_user.username}")
                
                if old_curricula:
                    db.commit()
        
        # Seed curricula for each admin user that doesn't have any
        for admin_user in admin_users:
            # Check if this admin already has the new curricula
            existing_count = db.query(Curriculum).filter(
                Curriculum.user_id == admin_user.id
            ).count()
            
            if existing_count >= 3:
                print(f"Admin {admin_user.username} already has {existing_count} curricula. Skipping.")
                continue
            
            curricula_added = 0
            for filename, display_name in curriculum_files:
                # Skip if we already have enough for this user
                if curricula_added >= 3:
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
                upload_dir = PROJECT_ROOT / "backend" / "uploads" / "curriculum"
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
        
        # Seed default preferences for admin users (always update to new default)
        default_preferences_files = [
            ("default_preferences_children_language.json", "儿童语言学习偏好")
        ]
        
        # Old default preference files to replace
        old_default_preferences = [
            "default_preferences_business.json",
            "default_preferences_language.json",
            "default_preferences_early_childhood.json"
        ]
        
        # Try to find preference files
        preferences_paths = [
            PROJECT_ROOT / "manual_test" / "preferences",
        ]
        
        # Load the new default preference data
        preferences_data = None
        selected_file = None
        
        for filename, display_name in default_preferences_files:
            for base_path in preferences_paths:
                full_path = base_path / filename
                if full_path.exists():
                    try:
                        with open(full_path, 'r', encoding='utf-8') as f:
                            preferences_data = json.load(f)
                        selected_file = display_name
                        break
                    except Exception as e:
                        print(f"Warning: Could not read {filename}: {e}")
                        continue
            
            if preferences_data:
                break
        
        if not preferences_data:
            print("Warning: Could not find new default preference file. Skipping preference seeding.")
        else:
            # Update preferences for all admin users
            for admin_user in admin_users:
                # Check if this admin already has preferences
                existing_preferences = db.query(Preferences).filter(
                    Preferences.user_id == admin_user.id
                ).first()
                
                if existing_preferences:
                    # Update existing preferences with new default
                    existing_preferences.focus_areas = preferences_data.get("focus_areas", [])
                    existing_preferences.keywords = preferences_data.get("keywords", [])
                    existing_preferences.subject_preferences = preferences_data.get("subject_preferences", [])
                    db.commit()
                    print(f"Updated preferences ({selected_file}) for {admin_user.username}")
                else:
                    # Create new preferences record
                    new_preferences = Preferences(
                        user_id=admin_user.id,
                        focus_areas=preferences_data.get("focus_areas", []),
                        keywords=preferences_data.get("keywords", []),
                        subject_preferences=preferences_data.get("subject_preferences", [])
                    )
                    
                    db.add(new_preferences)
                    db.commit()
                    db.refresh(new_preferences)
                    print(f"Added default preferences ({selected_file}) for {admin_user.username}")
        
        print("Database seeding complete.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

