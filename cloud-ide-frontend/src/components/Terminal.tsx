import { useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import { AttachAddon } from "@xterm/addon-attach";
import { FitAddon } from "@xterm/addon-fit";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const { playground } = usePlaygroundContext();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const termRef = useRef<XTerminal | null>(null);

  useEffect(() => {
    if (!playground?.containerId) return;

    const wsClient = new WebSocket(
      `ws://localhost:4000?containerId=${playground.containerId}`
    );

    wsClient.onopen = () => {
      console.log("WebSocket connected");
    };

    wsClient.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsClient.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(wsClient);

    return () => {
      wsClient.close();
    };
  }, [playground?.containerId]);

  useEffect(() => {
    if (!ws || !terminalRef.current) return;

    const term = new XTerminal({
      theme: {
        background: "#001e4821",
        foreground: "#f0f0f0",
      },
      cursorBlink: true,
    });

    termRef.current = term;
    term.open(terminalRef.current);

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();

    ws.onopen = () => {
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon);
    };

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup terminal and WebSocket when the component unmounts
      window.removeEventListener("resize", handleResize);
      term.dispose();
      ws.close();
    };
  }, [ws]);

  return (
    <div className="size-full bg-gray-700">
      <div ref={terminalRef} className="size-full" id="terminal-container" />
    </div>
  );
}
