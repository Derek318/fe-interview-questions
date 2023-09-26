import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ToyRequest from "./components/Weather/Weather";
import Dropdown from "./components/Dropdown/Dropdown";
// import Piano from "./components/Piano/Piano";
import { fruitOptions } from "./constants";
import { Piano } from "./components/Piano/Piano";
import Interview2 from "./components/Interview2/Interview2";
import Paint from "./components/old/Paint/Paint";

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link
                draggable={false}
                style={{ userSelect: "none" }}
                to="/weather"
              >
                Interview0
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link
                draggable={false}
                style={{ userSelect: "none" }}
                to="/dropdown"
              >
                Dropdown
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link
                draggable={false}
                style={{ userSelect: "none" }}
                to="/interview1"
              >
                Interview 1
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link
                draggable={false}
                style={{ userSelect: "none" }}
                to="/interview2"
              >
                Interview 2
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/weather" element={<ToyRequest />} />
            <Route
              path="/dropdown"
              element={<Dropdown options={fruitOptions} multiple />}
            />
            <Route path="/interview1" element={<Piano />} />
            <Route path="/interview2" element={<Paint />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
