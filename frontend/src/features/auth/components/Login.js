import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginUserAsync,
  selectError
} from '../authSlice';
import { useForm, SubmitHandler } from "react-hook-form"
import { Link, Navigate } from 'react-router-dom';
import { selectUserInfo } from '../../user/userSlice';
import logo from "../../../logo/logo_transparent.png";

export default function Login() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const error = useSelector(selectError);
  const user = useSelector(selectUserInfo);
  return (
    <div>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to="/"><img
            className="mx-auto h-20 w-20"
            src={logo}
            alt="Your Company"
          /></Link>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" noValidate onSubmit={handleSubmit((data)=>{
            dispatch(loginUserAsync({email: data.email,password: data.password}))
          })}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
              <input
                  id="email"
                  {...register("email",{required:"Email is required",pattern: {value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,message: "email is not valid"} })}
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
              <input
                  id="password"
                  {...register("password",{required:"password is required"})}
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
            {error && <p className="text-red-500">{error.message}</p>}
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
