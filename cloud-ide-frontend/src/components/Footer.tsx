import { Link } from "react-router-dom";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <MaxWidthWrapper>
        <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} CloudIDE. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Privacy
            </Link>
          </nav>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
