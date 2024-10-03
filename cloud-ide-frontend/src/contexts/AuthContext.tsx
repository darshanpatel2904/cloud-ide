import {
  useState,
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/Axios";
import { useNavigate } from "react-router-dom";

type AuthContextProviderProps = {
  children: ReactNode;
};

type UserType = {
  _id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  handleLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          const { data } = await axiosInstance.get("/user/current-user");
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
}
