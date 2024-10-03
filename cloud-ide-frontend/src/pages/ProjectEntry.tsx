import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code2, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/Axios";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectEntry() {
  const navigate = useNavigate();
  const createFormRef = useRef<HTMLFormElement | null>(null);
  const joinFormRef = useRef<HTMLFormElement | null>(null);
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(createFormRef.current as HTMLFormElement);
      const { projectName, projectType, description } = Object.fromEntries(
        formData.entries()
      );
      console.log(projectName, projectType, description);
      const { data } = await axiosInstance.post(`/playground`, {
        projectName: projectName as string,
        projectType: projectType as string,
        description: description as string,
      });
      navigate(`/playground/${data._id}`);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleJoinProject = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(joinFormRef.current as HTMLFormElement);
    const { projectId } = Object.fromEntries(formData.entries());
    navigate(`/playground/${projectId}`);
  };

  // const handleJoinRoom = useCallback(
  //   (data: { email: string; roomId: string }) => {
  //     const { roomId } = data;
  //     navigate(`/room/${roomId}`);
  //   },
  //   [navigate]
  // );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Code2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to CloudIDE
          </CardTitle>
          <CardDescription className="text-center">
            Create a new project or join an existing one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Project</TabsTrigger>
              <TabsTrigger value="join">Join Project</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <form ref={createFormRef} onSubmit={handleCreateProject}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select required name="projectType">
                      <SelectTrigger id="project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Application</SelectItem>
                        <SelectItem value="mobile">Mobile App</SelectItem>
                        <SelectItem value="desktop">
                          Desktop Application
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter project description"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Create Project
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="join">
              <form ref={joinFormRef} onSubmit={handleJoinProject}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project ID</Label>
                    <Input
                      id="projectId"
                      name="projectId"
                      placeholder="Enter project ID"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Users className="mr-2 h-4 w-4" /> Join Project
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
