// src/components/Register.js

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegisterUserMutation } from '@redux/api/apiSlice';
import { defaulUsertValues, Userschema } from '@schema/auth/userSchema';
import { useDispatch } from 'react-redux';
import { addToast } from '@redux/Slice/toastSlice';

const Register = () => {
  const dispatch = useDispatch();
  const [registerUser, { isLoading, isError }] = useRegisterUserMutation();
  // Setup react-hook-form with yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(Userschema),
    defaultValues:defaulUsertValues
  });

  const onSubmit = async (data) => {
    try {
      const { repeatPassword, ...userData } = data;
      await registerUser(userData).unwrap();
      dispatch(addToast({ message: 'Registration successful!', type: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: 'Registration failed!', type: 'error' }));

    }
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="user">
                  {/* Name */}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      placeholder="Name"
                      {...register('name')}
                    />
                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      placeholder="Email Address"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      placeholder="Password"
                      {...register('password')}
                    />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                  </div>

                  {/* Repeat Password */}
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      placeholder="Repeat Password"
                      {...register('repeatPassword')}
                    />
                    {errors.repeatPassword && (
                      <p className="text-danger">{errors.repeatPassword.message}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="form-group">
                    <select {...register('role')} className="form-control form-control-user">
                      <option value="DISPATCHER">Dispatcher</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                    {errors.role && <p className="text-danger">{errors.role.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register Account'}
                  </button>
                  {isError && <p className="text-danger">Registration failed. Try again.</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
