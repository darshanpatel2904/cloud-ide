import Loader from "@/components/ui/loader";
import {
  useState,
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";

type LoadingContextProviderProps = {
  children: ReactNode;
};

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export default function LoadingContextProvider({
  children,
}: LoadingContextProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <Loader />}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);

  if (context === null) {
    throw new Error(
      "useLoadingContext must be used within an LoadingContextProvider"
    );
  }

  return context;
}
