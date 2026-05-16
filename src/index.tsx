import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/reset.css';
import './style.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(<App />);

serviceWorker.unregister();
