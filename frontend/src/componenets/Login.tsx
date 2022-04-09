import {useForm} from "react-hook-form";
import {StockBaseApi} from "../services/StockBaseApi";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: {isSubmitting, errors}
    } = useForm();

    const onSubmit = handleSubmit(
        ({email, password}) => {
            StockBaseApi.getInstance().login({
                email: email,
                password: password
            }).then(data => {
                if (data.success) {
                    window.location.href = "/";
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
                        <p>welcome to the stock base. Please log in to continue.</p>
                    </div>
                </div>
                <div className="right">
                    <h5>Login</h5>
                    <p>Don't have an account? <a href="/signup">Signup</a></p>
                    <form method="post" name="login" onSubmit={onSubmit}>
                        <div className="inputs">
                            <input {...register('email', {
                                required: 'Required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "invalid email address"
                                },
                            })} placeholder={"Email"} />
                            {errors.email && <p>{errors.email.message}</p>}
                            <br/>
                            <input {...register('password', {
                                required: 'Required',
                                minLength: {
                                    value: 8,
                                    message: 'Min length is 8'
                                },
                            })} placeholder={"Password"} />
                            {errors.password && <p>{errors.password.message}</p>}
                            <br/>
                        </div>
                        <br/><br/>
                        <div className="remember-me--forget-password">
                            <p>
                                <a href="/forget-password">forget password</a>
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

export default LoginForm;
