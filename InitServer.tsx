// Set SSR
import getGlobal from './AppGlobal';

// Global Libraries && Poly-fills
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import React from 'react';
import { StaticRouterContext } from 'react-router';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';

// Episerver Libraries
import IServiceContainer from './Core/IServiceContainer';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import EpiSpaContext from './Spa';
import CmsSite from './Components/CmsSite';
import AppConfig from './AppConfig';

// Episerver SPA/PWA Server Side Rendering libs
import SSRResponse from './ServerSideRendering/Response';
import { setBaseClassName } from './Util/StylingUtils';
import { CacheProvider } from '@emotion/react';
import { getTssDefaultEmotionCache } from 'tss-react';

export default function RenderServerSide(config: AppConfig, serviceContainer?: IServiceContainer): SSRResponse {
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

  //const emotionCache = createCache({ key: 'css', prepend: true });

  const emotionServers = [
    // Every emotion cache used in the app should be provided.
    // Caches for MUI should use "prepend": true.
    // MUI cache should come first.
    //emotionCache,
    getTssDefaultEmotionCache({ doReset: true }),
  ].map(createEmotionServer);

  setBaseClassName('MO');

  const emotionCache = getTssDefaultEmotionCache({ doReset: true });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(emotionCache);
  const staticContext: StaticRouterContext = {};

  const body = renderToString(
    <CacheProvider value={emotionCache}>
      <CmsSite context={EpiSpaContext} staticContext={staticContext} />
    </CacheProvider>,
  );

  const styles = emotionServers
    .map(({ extractCriticalToChunks, constructStyleTagsFromChunks }) =>
      constructStyleTagsFromChunks(extractCriticalToChunks(body)),
    )
    .join('');

  const emotionChunks = extractCriticalToChunks(body);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);

  const meta = Helmet.renderStatic();

  return {
    Body: body.toString(),
    HtmlAttributes: meta.htmlAttributes.toString(),
    Title: meta.title.toString(),
    Meta: meta.meta.toString(),
    Link: meta.link.toString(),
    Script: meta.script.toString(),
    Style: emotionCss,
    BodyAttributes: meta.bodyAttributes.toString(),
  };
}
