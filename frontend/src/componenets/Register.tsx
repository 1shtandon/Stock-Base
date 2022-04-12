import {useForm} from "react-hook-form";
import {StockBaseApi} from "../services/StockBaseApi";

const Register = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: {isSubmitting, errors}
    } = useForm();

    const onSubmit = handleSubmit(
        ({email, password, password_confirmation, first_name, last_name, username, age}) => {
            if (password !== password_confirmation) {
                setError("password_confirmation", {
                    type: "manual",
                    message: "Passwords do not match"
                });
                return;
            }
            StockBaseApi.getInstance().register({
                username: username,
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                age: age
            }).then(data => {
                if (data.success) {
                    window.location.href = "/";
                } else {
                    console.log(data.error);
                    setError("data", {
                        type: "server",
                        message: 'error'
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
                        <p>Welcome to the stock base. Please register in to continue.</p>
                    </div>
                </div>
                <div className="right">
                    <h5>Login</h5>
                    <p>Already have an account? <a href={"/login"}>Login</a></p>
                    <form method="post" name="login" onSubmit={onSubmit}>
                        <div className="inputs">
                            <p className="error">{errors.data && errors.data.message} </p>
                            <input {...register('username', {
                                required: 'Username is required',
                                minLength: {
                                    value: 5,
                                    message: 'Username must be at least 3 characters'
                                },
                            })} placeholder="Username"/>
                            <p className="error">{errors.username && errors.username.message} </p>
                            <br/>
                            <input {...register('email', {
                                required: 'Required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Invalid email address'
                                },
                            })} placeholder={"Email"} type={"email"}/>
                            <p className="error">{errors.email && errors.email.message} </p>
                            <br/>
                            <input {...register('password', {
                                required: 'Required',
                                minLength: {
                                    value: 8,
                                    message: 'Min length is 8'
                                },
                            })} placeholder={"Password"} type={"password"} />
                            <p className="error">{errors.password && errors.password.message} </p>
                            <br/>
                            <input {...register('password_confirmation', {
                                required: 'Required',
                                minLength: {
                                    value: 8,
                                    message: 'Min length is 8'
                                },
                            })} placeholder={"Confirm Password"} type={"password"}/>
                            <p className="error">{errors.password_confirmation && errors.password_confirmation.message} </p>
                            <br/>
                            <input {...register('first_name', {
                                required: 'Required',
                                minLength: {
                                    value: 3,
                                    message: 'Min length is 3'
                                },
                            })} placeholder={"First Name"}/>
                            <p className="error">{errors.first_name && errors.first_name.message} </p>
                            <br/>
                            <input {...register('last_name', {
                                required: 'Required',
                                minLength: {
                                    value: 3,
                                    message: 'Min length is 3'
                                },
                            })} placeholder={"Last Name"}/>
                            <p className="error">{errors.last_name && errors.last_name.message} </p>
                            <br/>
                            <input {...register('age', {
                                required: 'Required',
                                min: {
                                    value: 8,
                                    message: 'Must be 18 or older'
                                },
                            })} placeholder={"Age"} type={"number"}/>
                            <p className="error">{errors.age && errors.age.message} </p>
                        </div>
                        <br/><br/>
                        <button type="submit" disabled={isSubmitting}>Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
