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

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) toast.error(error.message);
    else {
      toast.success("Login successful!");
      navigate("/");
    }
  };

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-2xl shadow-lg w-96 text-gray-800"
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Login
      </h1>

      <input
        type="email"
        {...register("email")}
        placeholder="Email"
        className="w-full mb-3 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p className="text-red-500 text-sm">{errors.email?.message}</p>

      <input
        type="password"
        {...register("password")}
        placeholder="Password"
        className="w-full mb-3 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p className="text-red-500 text-sm">{errors.password?.message}</p>

      <button
        type="submit"
        className="w-full bg-[#4caf50] hover:bg-[#166534] text-white font-semibold py-3 rounded-lg transition duration-200"
      >
        Login
      </button>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-[#4caf50] hover:underline">
          Register
        </Link>
      </p>
    </form>
  </div>
);


}
