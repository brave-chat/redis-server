import datetime

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    responses,
)
from fastapi.encoders import jsonable_encoder

from deta import Deta
from app.auth.crud import find_existed_user
from app.auth.schemas import UserSchema
from app.models import User
from app.users import crud as user_crud
from app.users.schemas import PersonalInfo, UpdateStatus, UserObjectSchema
from app.utils import jwt_util
from app.config import Settings

router = APIRouter(prefix="/api/v1")


# initialize with a project key
deta = Deta(Settings().DETA_PROJECT_KEY)

# create and use as many Drives as you want!
profile_images = deta.Drive("profile-images")
sent_images = deta.Drive("sent-images")


@router.get("/user/profile", response_model=UserSchema)
async def get_user_profile(
    currentUser: UserObjectSchema = Depends(jwt_util.get_current_active_user),
):
    """
    Get user profile info given a token provided in a request header.
    """
    results = {
        "token": None,
        "user": UserObjectSchema(**jsonable_encoder(currentUser)),
        "status_code": 200,
        "message": "Welcome to this blazingly fast chat app.",
    }
    return results


@router.put("/user/profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    currentUser: UserObjectSchema = Depends(jwt_util.get_current_active_user),
):
    try:
        file_name = "user/" + str(currentUser.pk) + "/" + "profile.png"
        ret_file_name = profile_images.put(file_name, file.file)
        user = await find_existed_user(email=currentUser.email)
        await user.update(profile_picture=currentUser.pk)
        return {
            "status_code": 200,
            "message": "You profile picture has been uploaded successfully!",
            "profile_image": ret_file_name,
        }

    except Exception as e:
        return {"status_code": 400, "message": str(e)}


@router.get("/user/profile/{name}")
async def get_profile_image(name: str):
    try:
        img = profile_images.get(f"user/{name}/profile.png")
        return responses.StreamingResponse(
            img.iter_chunks(), media_type="image/png"
        )
    except Exception as e:
        return {"status_code": 400, "message": str(e)}


@router.get("/user/{user_pk}/{uuid_val}")
async def get_sent_user_image(user_pk: str, uuid_val: str):
    try:
        img = sent_images.get(f"/user/{user_pk}/{uuid_val}")
        return responses.StreamingResponse(
            img.iter_chunks(), media_type="image/png"
        )
    except Exception as e:
        return {"status_code": 400, "message": str(e)}


@router.put("/user/profile")
async def upload_personal_information(
    personal_info: PersonalInfo,
    currentUser: UserObjectSchema = Depends(jwt_util.get_current_active_user),
):
    currentUser.first_name = personal_info.first_name
    currentUser.last_name = personal_info.last_name
    currentUser.bio = personal_info.bio
    currentUser.phone_number = personal_info.phone_number
    await currentUser.save()
    return {
        "status_code": 200,
        "message": "Your personal information has been updated successfully!",
    }


@router.get("/user/logout")
async def logout(
    token: str = Depends(jwt_util.get_token_user),
    currentUser: User = Depends(jwt_util.get_current_active_user),
):
    await user_crud.set_black_list(currentUser.pk, token)
    return {"status": 200, "message": "Good Bye!"}

@router.put("/user")
async def update_user_status(
    request: UpdateStatus,
    currentUser=Depends(jwt_util.get_current_active_user),
):
    user = await find_existed_user(email=currentUser.email)
    await user.update(
        chat_status=request.chat_status.lower(),
        modified_date=datetime.datetime.utcnow(),
    )
    return {
        "status_code": 200,
        "message": "Status has been updated successfully!",
    }


@router.get("/users/all/get")
async def get_all_users(currentUser=Depends(jwt_util.get_current_active_user)):
    return await User.find().all()
