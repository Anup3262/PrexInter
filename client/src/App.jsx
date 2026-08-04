import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import CreateInterview from "./pages/CreateInterview";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import ResumeInterview from "./pages/ResumeInterview";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/interviews/create"
          element={<CreateInterview />}
        />

        <Route
          path="/interviews/:id"
          element={<Interview />}
        />

        <Route
          path="/result/:id"
          element={<Result />}
        />

        <Route
          path="/resume-interview"
          element={<ResumeInterview />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;