'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.replace('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
      return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} className="w-full rounded-md border p-2" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" {...register('password')} className="w-full rounded-md border p-2" />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <button type="submit" className="w-full rounded-md bg-primary py-2 text-primary-foreground">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
