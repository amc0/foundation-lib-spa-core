import IServiceContainer from './Core/IServiceContainer';
import AppConfig from './AppConfig';
import SSRResponse from './ServerSideRendering/Response';
import { EmotionCache } from '@emotion/react';
export declare let muiCache: EmotionCache | undefined;
export declare function createMuiCache(): EmotionCache;
export default function RenderServerSide(config: AppConfig, serviceContainer?: IServiceContainer): SSRResponse;
