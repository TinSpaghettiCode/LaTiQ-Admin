import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.error('Please fill in both fields.'); // Display error message
      return;
    }

    // Wrap the login logic in a promise
    toast.promise(
      (async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (data.succeeded) {
          // Store the tokens and user info in local storage or state
          localStorage.setItem('accessToken', data.result.accessToken);
          localStorage.setItem('refreshToken', data.result.refreshToken);
          localStorage.setItem('userEmail', data.result.email);

          // Show success toast
          console.log('Login successful:', data.result);
          login();
          router.push('/pages/manage-movies'); // Redirect to home page
        } else {
          throw new Error(
            'Đăng nhập thất bại, kiểm tra lại tài khoản và mật khẩu.'
          ); // Throw error for toast
        }
      })(),
      {
        loading: <b>Đang đăng nhập...</b>,
        success: <b>Đăng nhập thành công!</b>,
        error: <b>Tên đăng nhập hoặc mật khẩu sai!</b>,
      }
    );
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleLogin}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Đăng nhập</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Nhập email và mật khẩu của bạn để tiếp tục
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            ref={emailRef}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input id="password" type="password" required ref={passwordRef} />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
