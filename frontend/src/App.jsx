import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Scraper from "./pages/Scraper";
import CurrentData from "./pages/CurrentData";
import ChangeHistory from "./pages/ChangeHistory";
import Analytics from "./pages/Analytics";

import { ScraperProvider } from "./ScraperContext";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ScraperProvider>

        <div className="app-shell">

          <Navbar />

          <main className="page-container">

            <Routes>

              {/* Dashboard */}
              <Route
                path="/"
                element={<Dashboard />}
              />

              {/* Scraper */}
              <Route
                path="/scraper"
                element={<Scraper />}
              />

              {/* Current Data */}
              <Route
                path="/data"
                element={<CurrentData />}
              />

              {/* Change History */}
              <Route
                path="/history"
                element={<ChangeHistory />}
              />

              {/* Analytics */}
              <Route
                path="/analytics"
                element={<Analytics />}
              />

              {/* Unknown URL */}
              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

          </main>

        </div>

      </ScraperProvider>
    </BrowserRouter>
  );
}

export default App;