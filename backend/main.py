from fastapi import FastAPI, Request, Response

from auth import user_manager
from auth.session import Session
from auth.user import UsernameAlreadyExists, EmailAlreadyExists
from middlware import initialize_middleware
from models import UserRegisterModel, LoginModel
from feedback.views import initialize_views as feedback_initialize_views
from stock.views import initialize_views as stock_initialize_views

app = FastAPI()


@app.get("/")
async def home():
    return Response(status_code=302, headers={"Location": "/docs"})


@app.post("/admin/login")
def admin_login(request: Request, login_data: LoginModel, response: Response):
    user = user_manager.authenticate_user(login_data.username, login_data.password, admin=True)
    if not user:
        response.status_code = 401
        return {"message": "Invalid credentials"}
    session_key = Session.create_session(user)
    request.is_authorized = True
    response.set_cookie(key="session_key", value=session_key)
    return {"message": "Login successful"}


@app.post("/login")
def login(request: Request, login_data: LoginModel, response: Response):
    user = user_manager.authenticate_user(login_data.username, login_data.password)
    if not user:
        response.status_code = 401
        return {"message": "Invalid credentials"}
    session_key = Session.create_session(user)
    request.is_authorized = True
    response.set_cookie(key="session_key", value=session_key)
    return {"message": "Login successful"}


@app.post("/logout")
async def logout(request: Request, response: Response):
    request.is_authorized = False
    session_key = request.cookies.get("session_key")
    Session.clear_session(session_key)
    response.delete_cookie(key="session_key")
    return {"message": "Logout successful"}


@app.post("/register")
async def register(register_user: UserRegisterModel, response: Response, request: Request):
    try:
        user = user_manager.create_user(
            username=register_user.username,
            password=register_user.password,
            email=register_user.email,
            first_name=register_user.first_name,
            last_name=register_user.last_name,
            age=register_user.age,
        )
        request.is_authorized = True
        session_key = Session.create_session(user)
        response.set_cookie(key="session_key", value=session_key)
        return {"message": "User created successfully"}
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