import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProjectTree from "@/components/ProjectTree";
import Terminal from "@/components/Terminal";
import CodeEditor from "@/components/CodeEditor";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import { io, Socket } from "socket.io-client";
import VideoCall from "@/components/VideoCall";
import axiosInstance from "@/lib/Axios";
import { useAuthContext } from "@/contexts/AuthContext";

const Output = () => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h3 className="font-semibold mb-2">Console Output</h3>
        <pre className="text-sm">
          {`> App started
> Listening on port 3000
> Connected to database
> User authenticated: john@example.com
> API request: GET /api/users
> Response sent: 200 OK`}
        </pre>
      </div>
    </ScrollArea>
  );
};

export default function ResponsiveWorkspace() {
  const location = useLocation();
  const playgroundId = location.pathname.split("/")[2];
  const { setPlayground, setSocket } = usePlaygroundContext();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!playgroundId || !user) return;

    const fetchPlaygroundData = async () => {
      try {
        const { data } = await axiosInstance.get(`/playground/${playgroundId}`);
        const socket: Socket = io("http://localhost:4001");
        setSocket(socket);
        socket.emit("room:join", {
          email: user?.email,
          room: "66f13f6eb5e2e95cd09ac250",
        });
        setPlayground(data);

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error("Error fetching playground data:", error);
      }
    };

    fetchPlaygroundData();
  }, [playgroundId, setPlayground, setSocket, user]);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ProjectTree />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <ScrollArea className="h-full">
                <CodeEditor />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
              <Terminal />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20}>
          <Output />
        </ResizablePanel>
      </ResizablePanelGroup>
      <VideoCall />
    </div>
  );
}
