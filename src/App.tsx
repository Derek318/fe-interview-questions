import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ToyRequest from "./components/Weather/Weather";
import Dropdown from "./components/Dropdown/Dropdown";
import Snake from "./components/Snake/Snake";
import { fruitOptions } from "./constants";

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/weather">Weather</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/dropdown">Dropdown</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/snake">Snake</Link>
            </Menu.Item>
            {/* Add more menu items for other Mini-projects */}
          </Menu>
        </Header>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/weather" element={<ToyRequest />} />
            <Route
              path="/dropdown"
              element={<Dropdown options={fruitOptions} multiple />}
            />
            <Route path="/snake" element={<Snake />} />
            {/* Add more routes for other Mini-projects */}
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
