import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './global.scss';
import Home from './Home';
import { store } from './utils/store';

library.add(fas);
library.add(far);

window.electron.listenForRequestConfirmation();

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  </Provider>
);
