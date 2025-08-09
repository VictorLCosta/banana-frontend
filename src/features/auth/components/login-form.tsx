import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "@/models";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const { register, handleSubmit, formState: { isDirty } } 
    = useForm<LoginCredentials>({ defaultValues: { email: "", password: "" } });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erro ao autenticar');
    }
  };

  return (
    <div className="relative flex flex-col justify-center text-center">
      <div className="flex flex-col items-center mb-8">
        <h2 className="select-none text-4xl font-bold tracking-wider">Welcome back!</h2>
        <p className="select-none text-lg font-semibold">It sure is great to see you again.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          className="input validator input-lg w-full rounded-2xl"
          required
          placeholder="Email"
          {...register('email')}
        />
        <input
          type="password"
          className="input validator input-lg w-full rounded-2xl"
          required
          placeholder="Password"
          {...register('password')}
        />

        <input disabled={!isDirty} type="submit" className="btn btn-lg rounded-2xl bg-black text-white w-full" />
      </form>
      <p className="mt-5">Email: admin@gmail.com Password: teste1</p>
    </div>
  )
}
