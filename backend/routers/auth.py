from fastapi import APIRouter, Depends, HTTPException, status
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


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get JWT token"""
    # Find user
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Verify password
    try:
        if not verify_password(user_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )
    except Exception as e:
        # Log the error for debugging
        print(f"Password verification exception: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.username})

    # Ensure role is a string value (UserRole enum has .value attribute)
    role_value = user.role.value
    
    # Create user response
    user_response = UserResponse(
        id=user.id,
        username=user.username,
        role=role_value
    )
    
    # Create token response as dict to ensure proper serialization
    try:
        user_response_dict = {
            "id": user.id,
            "username": user.username,
            "role": role_value
        }
        
        token_response_dict = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response_dict
        }
        
        # Debug logging
        print(f"Login successful for user: {user.username} (id: {user.id}), role: {role_value}")
        print(f"Token response dict: {token_response_dict}")
        
        # Return as dict - FastAPI will serialize it properly
        return token_response_dict
    except Exception as e:
        print(f"Error creating login response: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating login response: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return UserResponse(
        id=current_user.id, username=current_user.username, role=current_user.role.value
    )
