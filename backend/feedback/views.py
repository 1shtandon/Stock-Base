from fastapi import Request, Response, FastAPI

from decorators import normal_user_required, login_required
from feedback.feedback import FeedbackManager
from feedback.models import FeedbackModel


def initialize_views(app: FastAPI) -> None:
    app.post("/feedback/")(create_feedback)
    app.get("/feedback/")(get_feedbacks)


@normal_user_required
def create_feedback(request: Request, response: Response, feedback_model: FeedbackModel):
    feedback = FeedbackManager.create_feedback(
        user=request.user,
        title=feedback_model.title,
        message=feedback_model.message,
    )
    return {"feedback": feedback}


@login_required
def get_feedbacks(request: Request, response: Response):
    if request.user.is_admin:
        feedbacks = FeedbackManager.get_feedback_list()
    else:
        feedbacks = FeedbackManager.get_feedback_list(user=request.user)
    return {"feedbacks": [feedback for feedback in feedbacks]}
