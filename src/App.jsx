import { Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding/onboarding";

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}
