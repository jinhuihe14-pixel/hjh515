import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useInspectionStore } from "@/stores/useInspectionStore";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inspection from "@/pages/Inspection";
import Weighing from "@/pages/Weighing";
import Violations from "@/pages/Violations";
import Warnings from "@/pages/Warnings";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Layout from "@/components/layout/Layout";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const recalculateAllWarnings = useInspectionStore((s) => s.recalculateAllWarnings);

  useEffect(() => {
    recalculateAllWarnings();
  }, [recalculateAllWarnings]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="weighing" element={<Weighing />} />
          <Route path="violations" element={<Violations />} />
          <Route path="warnings" element={<Warnings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
