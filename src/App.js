import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Menu, Space } from "antd";
import "../node_modules/antd/dist/antd.css";
import Urna from "./Containers/Urna/Urna";
import Dashboard from "./Containers/Dashboard/Dashboard";
import Candidates from "./Containers/Candidates/Candidates";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Menu mode="horizontal">
          <Menu.Item key="vote"><Link to="/">Votar</Link></Menu.Item>
          <Menu.Item key="candidate"><Link to="/candidatos">Candidatos</Link></Menu.Item>
          <Menu.Item key="Dashboard"><Link to="/dashboard">Dashboard</Link></Menu.Item>
      </Menu>
      
        <Switch>
          {/* <Route exact path="/person/:id" component={} />*/}

          <Route exact path="/" component={Urna} />
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/candidatos" component={Candidates}/>
        </Switch>
      </BrowserRouter>{" "}
    </div>
  );
}

export default App;
