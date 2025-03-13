import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { addToast, removeToast } from '@redux/Slice/toastSlice';
import { defaultLoginValues, loginSchema } from '@schema/auth/loginSchema';
import loginbackground from "@assets/banners/login-background.svg";
import { Link, useNavigate } from 'react-router-dom';
import { loginFailure, loginSuccess } from '@redux/Slice/UserSlice';
import apiService from '@service/apiService';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useSelector((state) => state.toast);
  const { token } = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: defaultLoginValues
  });

  useEffect(() => {
    // Navigate when login is successful and token exists
    if (token) navigate("/");
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      dispatch(removeToast());

      const response = await apiService.login(data);
      if (response?.token) {
        dispatch(loginSuccess({ user: response.data, token: response.token }));
        dispatch(addToast({ message: 'Login successful!', type: 'success' }));
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed!';
      dispatch(loginFailure('Network error! Please try again.'));
      dispatch(addToast({ message: errorMessage, type: 'error' }));
    }
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5">
              <div className="p-5">
                <h6 className="h6 mb-4 text-start"><strong>Sign In</strong></h6>
                <p className="small">Please Login to Continue Your Account</p>
                <form onSubmit={handleSubmit(onSubmit)} className="user">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      placeholder="Email Address"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      placeholder="Password"
                      {...register('password')}
                    />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    <Link className="small nav-link" to="/forgetpassword">Forgot Password?</Link>
                  </div>

                  <button type="submit" className="btn button-style-one w-100 text-center">
                    Login
                  </button>

                  {toast?.message && (
                    <p className={toast?.type === "error" ? "text-danger" : "text-success"}>
                      {toast.message}
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="col-lg-7">
              <img src={loginbackground} alt="Login Background" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
