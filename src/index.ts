import { init, registerInitFunction } from './init';
import { initBackground } from './background';
import './base.scss';
import { ActionPanel } from './ActionPanel';

(window as any).init = init;

registerInitFunction('background', initBackground);
registerInitFunction('action', ActionPanel.init);
