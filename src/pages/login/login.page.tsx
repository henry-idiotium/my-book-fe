import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { usePageMeta, useSelector } from '@/hooks';
import { useLoginMutation, useLogoutMutation } from '@/stores/auth/auth.api';
import { selectAuth } from '@/stores/auth/auth.slice';
import { LoginForm, loginFormZod } from '@/types';

export function Login() {
  usePageMeta({ title: 'Login', auth: { type: 'public' } });

  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = useSelector(selectAuth);

  const [login, { isSuccess, isError, isLoading }] = useLoginMutation();
  const [logout] = useLogoutMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginFormZod) });

  useEffect(() => {
    if (!isSuccess || !token) return;

    const from = String(location.state?.from?.pathname ?? '/');
    navigate(from, { replace: true });
  }, [isSuccess, token, isError, isLoading]);

  const onSubmit: SubmitHandler<LoginForm> = async (data, event) => {
    event?.preventDefault();
    await login(data);
  };

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
          <a href="/">Forgot Password?</a>
        </div>
      </form>
    </>
  );
}

export default Login;
