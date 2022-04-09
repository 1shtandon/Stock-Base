from pydantic import BaseModel


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


