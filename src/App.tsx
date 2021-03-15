import { BrowserRouter, Route } from 'react-router-dom';

import MoodEngine from 'src/components/MoodEngine';

function App() {
  return (
    <BrowserRouter>
      <Route component={MoodEngine} path="/" />
    </BrowserRouter>
  );
}

export default App;
