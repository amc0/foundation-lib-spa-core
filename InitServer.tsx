// Set SSR
import getGlobal from './AppGlobal';

// Global Libraries && Poly-fills
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import React from 'react';
import { StaticRouterContext } from 'react-router';

// Episerver Libraries
import IServiceContainer from './Core/IServiceContainer';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import EpiSpaContext from './Spa';
import CmsSite from './Components/CmsSite';
import AppConfig from './AppConfig';
import createCache from '@emotion/cache';

export function createMyCache() {
  return createCache({ key: 'mo', prepend: true });
}

// Episerver SPA/PWA Server Side Rendering libs
import SSRResponse from './ServerSideRendering/Response';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';

export default function RenderServerSide(config: AppConfig, serviceContainer?: IServiceContainer): SSRResponse {
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

  const staticContext: StaticRouterContext = {};

  const body = ReactDOMServer.renderToString(
    <CacheProvider value={cache}>
      <CmsSite context={EpiSpaContext} staticContext={staticContext} />,
    </CacheProvider>,
  );
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
