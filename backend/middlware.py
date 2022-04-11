from typing import Awaitable, Callable

from fastapi import Request, FastAPI, Response

from auth.session import Session, InvalidSession


async def authenticate(request: Request, call_next: Callable[[Request], Awaitable[Response]]):
    try:
        session_key = request.cookies.get("session_key")
        if session_key is None:
            session_key = request.headers.get("Authorization")
            if session_key is not None:
                session_key = session_key.split(" ")[1]
        if session_key is None:
            return await call_next(request)
        user = Session.get_session(session_key)
        if user is None:
            return await call_next(request)
        request.scope["user"] = user
        return await call_next(request)
    except InvalidSession:
        return Response('{"error":"Invalid session"}', headers={
            'content-type': 'application/json',
            'content-length': '27',
            'access-control-allow-credentials': 'true',
            'access-control-allow-origin': '*',
        }, status_code=401)


def initialize_middleware(app: FastAPI):
    app.middleware("http")(authenticate)
