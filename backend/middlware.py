from typing import Awaitable, Callable

from fastapi import Request, FastAPI, Response

from auth.session import Session
from auth.user import User


async def authenticate(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    session_key = request.cookies.get("session_key")
    if session_key is None:
        return await call_next(request)
    user = Session.get_session(session_key)
    if user is None:
        return await call_next(request)
    request.scope["user"] = user
    return await call_next(request)


def initialize_middleware(app: FastAPI):
    app.middleware("http")(authenticate)
