import './UI';
import { registerInitFunction } from './init';
import { ActionPanel } from './UI/Components/ActionPanel';
import styles from './UI/baseCSS.css';

registerInitFunction('background', () => {});
registerInitFunction('action', function () {
    document.body.appendChild(new ActionPanel());

    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
});
