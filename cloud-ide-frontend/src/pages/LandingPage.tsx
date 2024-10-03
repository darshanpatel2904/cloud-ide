import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Users, Video, Youtube } from "lucide-react";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <MaxWidthWrapper>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Collaborate, Code, and Stream with CloudIDE
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The ultimate cloud-based IDE with real-time collaboration,
                  integrated video calls, and YouTube Live streaming.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/projects" className={buttonVariants({ size: "lg" })}>
                  Get Started
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <MaxWidthWrapper>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Code2 className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Cloud-based IDE</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Code from anywhere, anytime. Your development environment,
                  always at your fingertips.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Work together seamlessly with your team. Edit, debug, and
                  review code in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Video className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">
                  Integrated Video Calls
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Discuss your code face-to-face without leaving your IDE.
                  Built-in video calls for efficient communication.
                </p>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <MaxWidthWrapper>
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Stream Your Coding Sessions Live
                </h2>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                  Share your knowledge, teach coding, or showcase your projects
                  with our seamless YouTube Live integration.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-primary" />
                    One-click YouTube Live streaming
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-primary" />
                    Interactive chat with your audience
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-primary" />
                    Screen sharing and multi-camera support
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden">
                  <img
                    alt="YouTube Live Demo"
                    className="object-cover"
                    src="/placeholder.svg?height=400&width=600"
                    style={{
                      aspectRatio: "600/400",
                      objectFit: "cover",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="h-16 w-16 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <MaxWidthWrapper>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Coding Experience?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of developers who are already using CloudIDE to
                  code, collaborate, and create amazing things.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free 14-day trial. No credit card required.
                </p>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
      </main>
    </div>
  );
}
