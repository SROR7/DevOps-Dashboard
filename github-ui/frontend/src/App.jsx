import { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./index.css";

function App() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="app">
      <div className="app-layout">
        <Sidebar
          activeItem={activeItem}
          onNavigate={setActiveItem}
        />

        <main className="main">
          <section className="content">
            <h1>{activeItem}</h1>
            <p>
              Manage your DevOps infrastructure and
              development workflow.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;