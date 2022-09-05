// Set SSR
import getGlobal from './AppGlobal';
// Global Libraries && Poly-fills
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import React from 'react';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import EpiSpaContext from './Spa';
import CmsSite from './Components/CmsSite';
import createCache from '@emotion/cache';
export function createMyCache() {
    return createCache({ key: 'mo', prepend: true });
}
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
export default function RenderServerSide(config, serviceContainer) {
    const cache = createMyCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    // Update context
    const ctx = getGlobal();
    ctx.epi = ctx.epi || {};
    ctx.epi.isServerSideRendering = true;
    // Initialize Episerver Context, for Server Side Rendering
    serviceContainer = serviceContainer || new DefaultServiceContainer();
    config.enableSpinner = false;
    config.noAjax = true;
    config.enableDebug = true;
    EpiSpaContext.init(config, serviceContainer, true);
    const staticContext = {};
    const body = ReactDOMServer.renderToString(React.createElement(CacheProvider, { value: cache },
        React.createElement(CmsSite, { context: EpiSpaContext, staticContext: staticContext }),
        ","));
    const meta = Helmet.renderStatic();
    const emotionChunks = extractCriticalToChunks(body);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);
    return {
        Body: body,
        HtmlAttributes: meta.htmlAttributes.toString(),
        Title: meta.title.toString(),
        Meta: meta.meta.toString(),
        Link: meta.link.toString(),
        Script: meta.script.toString(),
        Style: emotionCss,
        BodyAttributes: meta.bodyAttributes.toString(),
    };
}
//# sourceMappingURL=InitServer.js.map