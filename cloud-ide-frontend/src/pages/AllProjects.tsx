import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, MoreVertical, Folder, Clock, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/Axios";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { useLoadingContext } from "@/contexts/LoadingContext";

type Project = {
  _id: string;
  projectName: string;
  description: string;
  lastUpdated: string;
  collaborators: number;
};
export default function AllProjects() {
  const editFormRef = useRef<HTMLFormElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const { setIsLoading } = useLoadingContext();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/playground");
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(editFormRef.current as HTMLFormElement);
    const { projectName, description } = Object.fromEntries(data.entries());

    const updatedProjects = projects.map((p) => {
      if (p._id === editingProject?._id) {
        return {
          ...p,
          projectName: projectName as string,
          description: description as string,
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setIsEditModalOpen(false);
    toast({
      title: "Project updated",
      description: "Your project has been successfully updated.",
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      // await axiosInstance.delete(`/playground/${projectId}`);

      const updatedProjects = projects.filter((p) => p._id !== projectId);
      setProjects(updatedProjects);
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description:
          "There was an error deleting the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MaxWidthWrapper className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-end pt-5">
        <Link to="/project-entry" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Link>
      </div>
      <main className="max-w-7xl mx-auto py-6">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{project.projectName}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleEditProject(project)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteProject(project._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    Last updated: {project.lastUpdated}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {project.collaborators} collaborator
                    {project.collaborators !== 1 ? "s" : ""}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    to={`/playground/${project._id}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full"
                    )}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Open Project
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form ref={editFormRef} onSubmit={handleUpdateProject}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="projectName" className="text-right">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  name="projectName"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MaxWidthWrapper>
  );
}
