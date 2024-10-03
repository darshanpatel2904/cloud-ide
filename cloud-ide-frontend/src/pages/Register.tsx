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
import { useRef } from "react";
import axiosInstance from "@/lib/Axios";

export default function Register() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(formRef.current as HTMLFormElement);
    const { username, email, password } = Object.fromEntries(data.entries());
    try {
      await axiosInstance.post("/user/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
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
            Create a CloudIDE Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to start coding in the cloud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                />
              </div>
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
                  placeholder="Create a password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
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
              <Github className="mr-2 h-4 w-4" /> Sign up with GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
