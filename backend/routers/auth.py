from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User, UserRole
from backend.schemas.auth import (
    UserRegister,
    UserLogin,
    Token,
    UserResponse,
    RegisterResponse,
)
from backend.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
)
from backend.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post(
    "/register", response_model=RegisterResponse, status_code=status.HTTP_200_OK
)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if username already exists
        existing_user = (
            db.query(User).filter(User.username == user_data.username).first()
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )

        # Create new user
        try:
            # Debug: Check what we're receiving
            print(
                f"Registration attempt - Username: {user_data.username}, Password type: {type(user_data.password)}, Password length: {len(user_data.password) if user_data.password else 0}"
            )
            if user_data.password:
                password_bytes = user_data.password.encode("utf-8")
                print(f"Password bytes length: {len(password_bytes)}")

            hashed_password = get_password_hash(user_data.password)
        except Exception as e:
            print(f"Password hashing error: {e}")
            import traceback

            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing password: {str(e)}",
            )

        new_user = User(
            username=user_data.username,
            password_hash=hashed_password,
            role=user_data.role,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return RegisterResponse(
            message="User registered successfully", user_id=new_user.id
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}",
        )


@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get JWT token - returns JSONResponse directly"""
    print(f"=== LOGIN REQUEST START === Username: {user_data.username}")
    
    try:
        # Find user
        user = db.query(User).filter(User.username == user_data.username).first()
        if not user:
            print(f"Login failed: User {user_data.username} not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

        # Verify password
        try:
            if not verify_password(user_data.password, user.password_hash):
                print(f"Login failed: Invalid password for {user_data.username}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                )
        except HTTPException:
            raise
        except Exception as e:
            print(f"Password verification exception: {e}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

        # Create access token
        access_token = create_access_token(data={"sub": user.username})

        # Ensure role is a string value (UserRole enum has .value attribute)
        role_value = user.role.value if hasattr(user.role, 'value') else str(user.role)
        
        # Create response dict
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": role_value
            }
        }
        
        print(f"Login successful for {user.username} (id: {user.id}), role: {role_value}")
        print(f"Response data: {response_data}")
        print("=== LOGIN REQUEST END ===")
        
        # Return JSONResponse directly to ensure proper serialization
        return JSONResponse(content=response_data, status_code=200)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in login: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return UserResponse(
        id=current_user.id, username=current_user.username, role=current_user.role.value
    )
