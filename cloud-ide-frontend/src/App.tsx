import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import ProjectEntry from "@/pages/ProjectEntry";
import Playground from "@/pages/Playground";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AllProjects from "@/pages/AllProjects";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/project-entry" element={<ProjectEntry />} />
        <Route path="/playground/:id" element={<Playground />} />
        <Route path="/projects" element={<AllProjects />} />
      </Route>
    </Routes>
  );
}
