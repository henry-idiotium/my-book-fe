import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { useLocation, useSelector } from '@/hooks';
import { useLoginMutation } from '@/stores/auth/auth.api';
import { selectAuth } from '@/stores/auth/auth.slice';

import styles from './login.page.module.scss';
import { LoginForm, loginFormZod } from './types';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useSelector(selectAuth);

  const [login, { isSuccess, isError, isLoading }] = useLoginMutation();

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
    await login(data);
  };

  // return (
  //     <Form.Root className="w-64" onSubmit={handleSubmit(onSubmit)}>
  //       <Form.Field name="email" className="mb-[10px] grid">
  //         <div className="flex items-baseline justify-between">
  //           <Form.Label className={styles.formInputLabel}>Email</Form.Label>

  //           {errors.email ? (
  //             <div className={styles.formInputMessage}>
  //               {errors.email.message}
  //             </div>
  //           ) : null}
  //         </div>

  //         <Form.Control asChild>
  //           <input
  //             {...register('email')}
  //             required
  //             type="email"
  //             className={styles.formInput}
  //           />
  //         </Form.Control>
  //       </Form.Field>

  //       <Form.Submit asChild>
  //         <Button type="submit" className="h-12 w-32">
  //           Submit
  //         </Button>
  //       </Form.Submit>
  //     </Form.Root>
  // );

  return (
    <form className="w-64" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>
          <label htmlFor="email" className={styles.formInputLabel}>
            Email
          </label>

          {errors.email && <p className={styles.formInputMessage}>{errors.email.message}</p>}
        </div>

        <input
          id="email"
          placeholder="Email"
          type="email"
          {...register('email')}
          className={styles.formInput}
        />
      </div>

      <div>
        <div>
          <label htmlFor="password" className={styles.formInputLabel}>
            Password
          </label>

          {errors.password && <p className={styles.formInputMessage}>{errors.password.message}</p>}
        </div>

        <input
          id="password"
          placeholder="Password"
          type="password"
          {...register('password')}
          className={styles.formInput}
        />
      </div>

      <Button type="submit" className="my-6 w-32">
        Login
      </Button>
    </form>
  );
}

export default Login;
