import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useCallback, useEffect, useState } from "react";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import { useDebouncedCallback } from "use-debounce";
import axiosInstance from "@/lib/Axios";

export default function CodeEditor() {
  const [code, setCode] = useState<string>("");
  const { selectedFilePath, socket, playground, setSelectedFilePath } =
    usePlaygroundContext();

  const debouncedHandleCodeChange = useDebouncedCallback((newCode: string) => {
    if (!socket || !playground) return;

    socket.emit("file:change", {
      room: playground._id,
      path: selectedFilePath,
      content: newCode,
    });
  }, 5000);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    debouncedHandleCodeChange(newCode);
  };

  useEffect(() => {
    if (!selectedFilePath) return;
    const fetchFileContent = async () => {
      try {
        const { data } = await axiosInstance.post("/playground/files/content", {
          filePath: selectedFilePath,
        });
        setCode(data);
      } catch (error) {
        console.error("Error fetching file content", error);
      }
    };

    fetchFileContent();
  }, [selectedFilePath]);

  const handleCodeChanged = useCallback((data: { content: string }) => {
    console.log("Code changed", data);
    setCode(data.content);
  }, []);

  const handleFileSelected = useCallback(
    (data: { path: string }) => {
      setSelectedFilePath(data.path);
    },
    [setSelectedFilePath]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("file:changed", handleCodeChanged);
    socket.on("file:selected", handleFileSelected);
    return () => {
      socket.off("file:changed", handleCodeChanged);
      socket.off("file:selected", handleFileSelected);
    };
  }, [handleCodeChanged, handleFileSelected, socket]);

  return (
    <AceEditor
      mode="javascript"
      theme="github"
      onChange={handleCodeChange}
      name="collaborative-editor"
      editorProps={{ $blockScrolling: true }}
      value={code}
      setOptions={{ useWorker: false }}
    />
  );
}
