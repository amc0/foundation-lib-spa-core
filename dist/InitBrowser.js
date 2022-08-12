import ReactDOM from 'react-dom';
import React from 'react';
import CmsSite from './Components/CmsSite';
import EpiContext from './Spa';
import ComponentPreLoader from './Loaders/ComponentPreLoader';
import DefaultServiceContainer from './Core/DefaultServiceContainer';
import { setBaseClassName } from './Util/StylingUtils';
import { CacheProvider } from '@emotion/react';
import { createMuiCache, muiCache } from './InitServer';
export function InitBrowser(config, containerId, serviceContainer) {
    try {
        if ((__INITIAL_DATA__ === null || __INITIAL_DATA__ === void 0 ? void 0 : __INITIAL_DATA__.status) === 'loading') {
            __INITIAL_DATA__.onReady = () => _doInitBrowser(config, containerId, serviceContainer);
            return;
        }
    }
    catch (e) {
        // Ignore on purpose
    }
    return _doInitBrowser(config, containerId, serviceContainer);
}
function _doInitBrowser(config, containerId, serviceContainer) {
    EpiContext.init(config, serviceContainer || new DefaultServiceContainer());
    setBaseClassName('MO');
    const app = (React.createElement(CacheProvider, { value: muiCache !== null && muiCache !== void 0 ? muiCache : createMuiCache() },
        React.createElement(CmsSite, { context: EpiContext })));
    const container = document.getElementById(containerId ? containerId : 'epi-page-container');
    if (container && container.childElementCount > 0) {
        const components = EpiContext.config().preLoadComponents || [];
        if (EpiContext.isDebugActive())
            console.info('Hydrating existing render, Stage 1. Preloading components ...', components);
        const loader = EpiContext.componentLoader();
        ComponentPreLoader.load(components, loader).finally(() => {
            if (EpiContext.isDebugActive())
                console.info('Hydrating existing render, Stage 2. Hydration ...');
            ReactDOM.hydrate(app, container);
        });
    }
    else {
        if (EpiContext.isDebugActive())
            console.info('Building new application');
        ReactDOM.render(app, container);
    }
}
export default InitBrowser;
//# sourceMappingURL=InitBrowser.js.map