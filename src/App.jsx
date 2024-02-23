import { DarkModeProvider } from "./context/DarkModeContext";
import Layout from "./ui/Layout";

function App() {
  return (
    <DarkModeProvider>
      <Layout />
    </DarkModeProvider>
  );
}

export default App;
