import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup
    .string()
    .min(6, "At least 6 chars")
    .required("Password required"),
});

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.signUp(data);
    if (error) toast.error(error.message);
    else {
      toast.success("Registration successful! Check your email.");
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="w-full mb-2 border p-2 rounded"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full mb-2 border p-2 rounded"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded mt-2"
        >
          Register
        </button>

        <p className="mt-2 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
