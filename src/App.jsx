import { DarkModeProvider } from "./context/DarkModeContext";
import Layout from "./ui/Layout";
import "flowbite";

function App() {
  return (
    <DarkModeProvider>
      <Layout />
    </DarkModeProvider>
  );
}

export default App;
