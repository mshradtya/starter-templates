import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider, theme } from "antd";
import "./index.css";

const antdThemeConfig = {
  // algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#eb2d42",
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider theme={antdThemeConfig}>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </ConfigProvider>
);
