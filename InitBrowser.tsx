import ReactDOM from 'react-dom';
import React from 'react';
import CmsSite from './Components/CmsSite';
import AppConfig from './AppConfig';
import EpiContext from './Spa';
import ComponentPreLoader, { IComponentPreloadList } from './Loaders/ComponentPreLoader';
import IServiceContainer from './Core/IServiceContainer';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import ServerContextType from './ServerSideRendering/ServerContext';

import { setBaseClassName } from './Util/StylingUtils';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

declare let __INITIAL_DATA__: ServerContextType;
let muiCache: EmotionCache | undefined = undefined;

export function InitBrowser(config: AppConfig, containerId?: string, serviceContainer?: IServiceContainer): void {
  try {
    if (__INITIAL_DATA__?.status === 'loading') {
      __INITIAL_DATA__.onReady = () => _doInitBrowser(config, containerId, serviceContainer);
      return;
    }
  } catch (e) {
    // Ignore on purpose
  }
  return _doInitBrowser(config, containerId, serviceContainer);
}

export function createMuiCache(): EmotionCache {
  return (muiCache = createCache({
    key: 'mo',
    prepend: true,
  }));
}

function _doInitBrowser(config: AppConfig, containerId?: string, serviceContainer?: IServiceContainer): void {
  EpiContext.init(config, serviceContainer || new DefaultServiceContainer());

  setBaseClassName('MO');

  const app = (
    <CacheProvider value={muiCache ?? createMuiCache()}>
      <CmsSite context={EpiContext} />
    </CacheProvider>
  );

  const container = document.getElementById(containerId ? containerId : 'epi-page-container');
  if (container && container.childElementCount > 0) {
    const components: IComponentPreloadList = EpiContext.config().preLoadComponents || [];
    if (EpiContext.isDebugActive())
      console.info('Hydrating existing render, Stage 1. Preloading components ...', components);
    const loader = EpiContext.componentLoader();
    ComponentPreLoader.load(components, loader).finally(() => {
      if (EpiContext.isDebugActive()) console.info('Hydrating existing render, Stage 2. Hydration ...');

      ReactDOM.hydrate(app, container);
    });
  } else {
    if (EpiContext.isDebugActive()) console.info('Building new application');
    ReactDOM.render(app, container);
  }
}

export default InitBrowser;
