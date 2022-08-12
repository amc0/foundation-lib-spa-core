import AppConfig from './AppConfig';
import IServiceContainer from './Core/IServiceContainer';
import { EmotionCache } from '@emotion/cache';
export declare function InitBrowser(config: AppConfig, containerId?: string, serviceContainer?: IServiceContainer): void;
export declare function createMuiCache(): EmotionCache;
export default InitBrowser;
