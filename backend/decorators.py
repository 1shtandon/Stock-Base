from collections.abc import Coroutine
from functools import wraps
from typing import Callable

from fastapi import Request, Response


def login_required(func: Callable):
    @wraps(func)
    async def wrapped(request: Request, response: Response, *args, **kwargs):
        if request.scope.get("user", None) is None:
            response.status_code = 401
            return {"message": "Login required"}
        response = func(request=request, response=response, *args, **kwargs)
        if isinstance(response, Coroutine):
            return await response
        return response

    return wrapped


def normal_user_required(func: Callable):
    @wraps(func)
    async def wrapped(request: Request, response: Response, *args, **kwargs):
        if (user := request.scope.get("user", None)) is None:
            response.status_code = 401
            return {"message": "Login required"}
        if user.is_admin:
            response.status_code = 403
            return {"message": "Normal User required"}
        response = func(request=request, response=response, *args, **kwargs)
        if isinstance(response, Coroutine):
            return await response
        return response

    return wrapped


def admin_required(func: Callable):
    @wraps(func)
    async def wrapped(request: Request, response: Response, *args, **kwargs):
        if (user := request.scope.get("user", None)) is None:
            response.status_code = 401
            return {"message": "Login required"}
        if not user.is_admin:
            response.status_code = 403
            return {"message": "Admin required"}
        response = func(request=request, response=response, *args, **kwargs)
        if isinstance(response, Coroutine):
            return await response
        return response

    return wrapped
