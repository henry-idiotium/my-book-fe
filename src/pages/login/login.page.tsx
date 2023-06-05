import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useSelector } from '@/hooks';
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} from '@/stores/auth/auth-api';
import { selectAuth } from '@/stores/auth/auth.slice';
import { LoginForm, loginFormZod } from '@/types';

/* eslint-disable-next-line */
export interface LoginProps {}

export function Login(props: LoginProps) {
  const { user, token } = useSelector(selectAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormZod),
  });

  const [login, { isSuccess }] = useLoginMutation();
  const [logout] = useLogoutMutation();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    await login(data);
  };

  useEffect(() => {
    if (isSuccess && token) {
      const from = String(location.state?.from?.pathname ?? '/');

      console.log('navigate to /home');

      navigate(from, { replace: true });
    }
  }, [isSuccess, token]);

  return (
    <>
      <button onClick={() => console.log(user)}>clg user|</button>
      <button onClick={() => logout(undefined)}>logout</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="Email"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-2 text-xs italic text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Password"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-2 text-xs italic text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
        <hr />
        <div>
          <a href="#">Forgot Password?</a>
        </div>
      </form>
    </>
  );
}

export default Login;
