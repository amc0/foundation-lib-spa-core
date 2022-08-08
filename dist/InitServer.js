// Set SSR
import getGlobal from './AppGlobal';
// Global Libraries && Poly-fills
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import React from 'react';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import EpiSpaContext from './Spa';
import CmsSite from './Components/CmsSite';
import { setBaseClassName } from './Util/StylingUtils';
import { extractCritical } from '@emotion/server';
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
    const classPrefix = 'MO';
    // const emotionCache = createCache({ key: 'css' });
    // const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(emotionCache);
    setBaseClassName(classPrefix);
    const staticContext = {};
    // const body = ReactDOMServer.renderToString(
    //   <CacheProvider value={emotionCache}>
    //     <CmsSite context={EpiSpaContext} staticContext={staticContext} />
    //   </CacheProvider>,
    // );
    const { html, ids, css } = extractCritical(renderToString(React.createElement(CmsSite, { context: EpiSpaContext, staticContext: staticContext })));
    // const emotionChunks = extractCriticalToChunks(body);
    // const emotionCss = constructStyleTagsFromChunks(emotionChunks);
    const meta = Helmet.renderStatic();
    return {
        Body: html,
        HtmlAttributes: meta.htmlAttributes.toString(),
        Title: meta.title.toString(),
        Meta: meta.meta.toString(),
        Link: meta.link.toString(),
        Script: meta.script.toString(),
        Style: css,
        BodyAttributes: meta.bodyAttributes.toString(),
    };
}
//# sourceMappingURL=InitServer.js.map