import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import axiosInstance from "@/lib/Axios";

type ProjectItem = {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: ProjectItem[];
};

export default function ProjectTree() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [projectStructure, setProjectStructure] = useState<ProjectItem[]>([]);
  const location = useLocation();
  const playgroundId = location.pathname.split("/")[2];
  const { setSelectedFilePath, socket } = usePlaygroundContext();

  useEffect(() => {
    (async () => {
      if (!playgroundId) return;
      try {
        const { data } = await axiosInstance.get(
          `/playground/files/${playgroundId}`
        );
        setProjectStructure(data);
      } catch (error) {
        console.error("Error fetching project structure:", error);
        setProjectStructure([]);
      }
    })();
  }, [playgroundId]);

  const toggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders((prev) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(folderPath)) {
        updatedSet.delete(folderPath);
      } else {
        updatedSet.add(folderPath);
      }
      return updatedSet;
    });
  }, []);

  const renderTree = useCallback(
    (items: ProjectItem[], level = 0, parentPath = ""): JSX.Element[] => {
      return items.map((item) => {
        const currentPath = `${parentPath}/${item.name}`;
        const isFolderExpanded = expandedFolders.has(currentPath);

        return (
          <div key={currentPath} style={{ marginLeft: level * 16 }}>
            {item.type === "folder" ? (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  onClick={() => toggleFolder(currentPath)}
                >
                  {isFolderExpanded ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                  <Folder className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
                {isFolderExpanded &&
                  item.children &&
                  renderTree(item.children, level + 1, currentPath)}
              </div>
            ) : (
              <Button
                onClick={() => {
                  setSelectedFilePath(item.path);
                  socket?.emit("file:selected", {
                    room: playgroundId,
                    path: item.path,
                  });
                }}
                variant="ghost"
                className="w-full justify-start p-2"
              >
                <File className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            )}
          </div>
        );
      });
    },
    [expandedFolders, toggleFolder, setSelectedFilePath, socket, playgroundId]
  );

  const projectTree = useMemo(
    () => renderTree(projectStructure),
    [renderTree, projectStructure]
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-2">{projectTree}</div>
    </ScrollArea>
  );
}
