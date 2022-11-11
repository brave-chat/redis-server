import datetime
from typing import Union

from pydantic import BaseModel


class RoomCreate(BaseModel):
    room_name: str
    description: str


class RoomCreateResult(BaseModel):
    room_name: str
    members: list[str]
    conversation: list[str]
    active: str
    creation_date: datetime.datetime


class RoomGetALL(BaseModel):
    room_name: str
    members: list[dict[str, Union[str, datetime.datetime]]]
    messages: list[dict[str, Union[str, datetime.datetime]]]
    active: str
    creation_date: datetime.datetime
