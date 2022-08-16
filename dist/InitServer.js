// Set SSR
import getGlobal from './AppGlobal';
// Global Libraries && Poly-fills
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import React from 'react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import EpiSpaContext from './Spa';
import CmsSite from './Components/CmsSite';
import { getTssDefaultEmotionCache } from 'tss-react';
export let muiCache = undefined;
export function createMuiCache() {
    return (muiCache = createCache({
        key: 'mo',
        prepend: true,
    }));
}
export default function RenderServerSide(config, serviceContainer) {
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
    const muiCache = createMuiCache();
    const emotionServers = [createMuiCache(), getTssDefaultEmotionCache({ doReset: true })].map(createEmotionServer);
    const staticContext = {};
    const body = renderToString(React.createElement(CmsSite, { context: EpiSpaContext, staticContext: staticContext }));
    const styles = emotionServers
        .map(({ extractCriticalToChunks, constructStyleTagsFromChunks }) => constructStyleTagsFromChunks(extractCriticalToChunks(body)))
        .join('');
    const meta = Helmet.renderStatic();
    return {
        Body: body.toString(),
        HtmlAttributes: meta.htmlAttributes.toString(),
        Title: meta.title.toString(),
        Meta: meta.meta.toString(),
        Link: meta.link.toString(),
        Script: meta.script.toString(),
        Style: styles,
        BodyAttributes: meta.bodyAttributes.toString(),
    };
}
//# sourceMappingURL=InitServer.js.map