import {
  useState,
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";

type PlaygroundContextProviderProps = {
  children: ReactNode;
};

type PlaygroundType = {
  _id: string;
  projectName: string;
  projectType: string;
  containerId: string;
};

type PlaygroundContextType = {
  selectedFilePath: string;
  setSelectedFilePath: Dispatch<SetStateAction<string>>;
  playground: PlaygroundType | null;
  setPlayground: Dispatch<SetStateAction<PlaygroundType | null>>;
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
};

export const PlaygroundContext = createContext<PlaygroundContextType | null>(
  null
);

export default function PlaygroundContextProvider({
  children,
}: PlaygroundContextProviderProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [playground, setPlayground] = useState<PlaygroundType | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  return (
    <PlaygroundContext.Provider
      value={{
        selectedFilePath,
        setSelectedFilePath,
        playground,
        setPlayground,
        socket,
        setSocket,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlaygroundContext() {
  const context = useContext(PlaygroundContext);

  if (context === null) {
    throw new Error(
      "usePlaygroundContext must be used within an PlaygroundContextProvider"
    );
  }

  return context;
}
