import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DarkModeProvider } from "./context/DarkModeContext";
import Layout from "./ui/Layout";
import EventPage from "./ui/EventPage";
import FighterPage from "./ui/FighterPage";
import NotFound from "./ui/NotFound";

// /                  → next upcoming card
// /results           → most recent results
// /events/:eventId   → any event, upcoming or past (shareable link)
// /fighters/:fighterId → fighter profile, career stats and UFC fight history
function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<EventPage defaultTab="upcoming" />} />
            <Route path="results" element={<EventPage defaultTab="results" />} />
            <Route path="events/:eventId" element={<EventPage />} />
            <Route path="fighters/:fighterId" element={<FighterPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
