from pydantic import BaseModel


class LoginResponse(BaseModel):
    access_token: str
    username: str
    email: str
    isAdmin: bool


class LoginModel(BaseModel):
    username: str
    password: str


class UserRegisterModel(BaseModel):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str
    age: int

    def __str__(self):
        return f'{self.username}'
