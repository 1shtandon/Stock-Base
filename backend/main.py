from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from auth import user_manager
from auth.session import Session
from auth.user import UsernameAlreadyExists, EmailAlreadyExists
from decorators import login_required
from middlware import initialize_middleware
from models import UserRegisterModel, LoginModel, LoginResponse
from feedback.views import initialize_views as feedback_initialize_views
from stock.views import initialize_views as stock_initialize_views

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return Response(status_code=302, headers={"Location": "/docs"})


@app.get('/user/')
@login_required
async def user(request: Request, response: Response):
    return {
        "username": request.user.username,
        "email": request.user.email,
        "isAdmin": request.user.is_admin,
    }


@app.post("/admin/login/")
def admin_login(request: Request, login_data: LoginModel, response: Response):
    _user = user_manager.authenticate_user(login_data.username, login_data.password, admin=True)
    if not _user:
        response.status_code = 401
        return {"message": "Invalid credentials"}
    session_key = Session.create_session(_user)
    request.is_authorized = True
    response.set_cookie(key="session_key", value=session_key)
    return LoginResponse(
        access_token=session_key,
        username=_user.username,
        email=_user.email,
        isAdmin=_user.is_admin,
    )


@app.post("/login/")
def login(request: Request, login_data: LoginModel, response: Response):
    _user = user_manager.authenticate_user(login_data.username, login_data.password)
    if not _user:
        response.status_code = 401
        return {"message": "Invalid credentials"}
    session_key = Session.create_session(_user)
    request.is_authorized = True
    response.set_cookie(key="session_key", value=session_key)
    return LoginResponse(
        access_token=session_key,
        username=_user.username,
        email=_user.email,
        isAdmin=_user.is_admin,
    )


@app.post("/logout/")
async def logout(request: Request, response: Response):
    request.is_authorized = False
    session_key = request.cookies.get("session_key")
    Session.clear_session(session_key)
    response.delete_cookie(key="session_key")
    return {"message": "Logout successful"}


@app.post("/register/")
async def register(register_user: UserRegisterModel, response: Response, request: Request):
    try:
        _user = user_manager.create_user(
            username=register_user.username,
            password=register_user.password,
            email=register_user.email,
            first_name=register_user.first_name,
            last_name=register_user.last_name,
            age=register_user.age,
        )
        request.is_authorized = True
        session_key = Session.create_session(_user)
        response.set_cookie(key="session_key", value=session_key)
        return LoginResponse(
            access_token=session_key,
            username=_user.username,
            email=_user.email,
            isAdmin=_user.is_admin,
        )
    except UsernameAlreadyExists:
        response.status_code = 400
        return {"message": "Username already exists"}
    except EmailAlreadyExists:
        response.status_code = 400
        return {"message": "Email already exists"}


feedback_initialize_views(app)
stock_initialize_views(app)

initialize_middleware(app)

if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
