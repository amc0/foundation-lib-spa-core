import IServiceContainer from './Core/IServiceContainer';
import AppConfig from './AppConfig';
export declare function createMyCache(): import("@emotion/utils").EmotionCache;
import SSRResponse from './ServerSideRendering/Response';
export default function RenderServerSide(config: AppConfig, serviceContainer?: IServiceContainer): SSRResponse;
