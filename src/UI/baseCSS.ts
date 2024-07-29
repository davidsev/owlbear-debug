import { unsafeCSS } from 'lit';
import baseStyle from './baseCSS.css';

export function baseCSS (css?: string) {
    return [
        unsafeCSS(baseStyle + (css ? '\n' + css : '')),
    ];
}
