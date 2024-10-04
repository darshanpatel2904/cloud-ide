import { Link, useLocation } from "react-router-dom";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Code2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import UserAvatar from "@/components/UserAvtar";

export default function Navbar() {
  const location = useLocation();
  const { user, handleLogout } = useAuthContext();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link className="flex items-center justify-center" to="#">
            <Code2 className="h-6 w-6 mr-2" />
            <span className="font-bold">CloudIDE</span>
          </Link>
          <nav
            className={cn(
              "hidden",
              location.pathname === "/" && "md:flex gap-6"
            )}
          >
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="#"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="#"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="#"
            >
              Blog
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="#"
            >
              Contact
            </Link>
          </nav>
          {user ? (
            <UserAvatar
              name={user?.username}
              email={user?.email}
              imageUrl={user?.username}
              onLogout={handleLogout}
            />
          ) : (
            <Link
              to="/login"
              className={cn(buttonVariants(), "hidden md:inline-flex")}
            >
              Sign Up
            </Link>
          )}

          <Button variant="outline" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
