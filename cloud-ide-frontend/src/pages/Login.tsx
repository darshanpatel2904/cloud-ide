import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2, Github } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/Axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLoadingContext } from "@/contexts/LoadingContext";

export default function Login() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const { setIsLoading } = useLoadingContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(formRef.current as HTMLFormElement);
    const { email, password } = Object.fromEntries(data.entries());
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      setUser(data.user);
      navigate("/projects");
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Code2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back to CloudIDE
          </CardTitle>
          <CardDescription className="text-center">
            Login to your account to continue coding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </div>
          </form>
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
