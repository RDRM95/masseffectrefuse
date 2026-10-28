import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';
import {loadFonts} from './fonts';

loadFonts();
registerRoot(RemotionRoot);
