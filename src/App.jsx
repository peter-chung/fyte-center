// import "flowbite";
import { DarkModeProvider } from "./context/DarkModeContext";
import Layout from "./ui/Layout";
import Test from "./ui/Test";

function App() {
  return (
    <DarkModeProvider>
      <Layout />
    </DarkModeProvider>
  );
}

export default App;
