import {useForm} from "react-hook-form";
import {StockBaseApi} from "../services/StockBaseApi";

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: {isSubmitting, errors}
    } = useForm();

    const onSubmit = handleSubmit(
        ({email, password}) => {
            StockBaseApi.getInstance().login({
                username: email,
                password: password
            }).then(data => {
                if (data.success) {
                    window.location.href = "/";
                } else {
                    setError("data", {
                        type: "server",
                        message: 'Invalid email or password'
                    });
                    return false;
                }
            });
        }
    );

    return (
        <>
            <div className="box-form">
                <div className="left">
                    <div className="overlay">
                        <h1>Stock Base</h1>
                        <p>Welcome to the stock base. Please log in to continue.</p>
                    </div>
                </div>
                <div className="right">
                    <h5>Login</h5>
                    <p>Don't have an account? <a href="/signup">Signup</a></p>
                    <form method="post" name="login" onSubmit={onSubmit}>
                        <div className="inputs">
                            <p className="error">{errors.data && errors.data.message}</p>
                            <input {...register('email', {
                                required: 'Required',
                                pattern: {
                                    value: /^[A-Za-z0-9@_.-]{5,}$/i,
                                    message: "Invalid email address or password"
                                },
                            })} placeholder={"Email or Username"} />
                            <p className="error">{errors.email && errors.email.message}</p>
                            <br/>
                            <input {...register('password', {
                                required: 'Required',
                                minLength: {
                                    value: 8,
                                    message: 'Min length is 8'
                                },
                            })} placeholder={"Password"} type={"password"} />
                            <p className="error">{errors.password && errors.password.message}</p>
                            <br/>
                        </div>
                        <br/><br/>
                        <div className="remember-me--forget-password">
                            <p>
                                <a href="/forget-password">Forget password</a>
                            </p>
                        </div>
                        <br/>
                        <button type="submit" disabled={isSubmitting}>Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
