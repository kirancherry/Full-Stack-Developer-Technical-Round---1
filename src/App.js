import logo from './logo.svg';
import './App.css';
import Sidebar from './sidebar/Sidebar'
import AddScenario from './Routes/AddScenario';
import AddVehicle from './Routes/AddVehicle';
import AllScenarios from './Routes/AllScenarios';
import Home from './Routes/Home1';
import 'bootstrap/dist/css/bootstrap.min.css';
// In your main JavaScript file (index.js or App.js)
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";







const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/Scenario/add", name: "AddScenario", component: AddScenario },
  { path: "/scenarios", name: "AllScenarios", component: AllScenarios },
  { path: "/Vehicle/add", name: "AddVehicle", component: AddVehicle },


  
];






function App() {
  return (
<Router>
      <Routes>
        {routes.map(
          ({ path, name, component: Component, excludeFromSidebar }) => (
            <Route
              key={path}
              path={path}
              element={
                excludeFromSidebar ? (
                  <Component />
                ) : (
                  <div className="app-container">
                    <Sidebar routes={routes} />
                    <div className="content" >
                      <Component />
                    </div>
                  </div>
                )
              }
            />
          )
        )}
      </Routes>
    </Router>
  );
}

export default App;
