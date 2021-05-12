import React, { useState, useEffect } from 'react';
import StringUtils from '../Util/StringUtils';
import { useEpiserver, useIContentRepository, useServiceContainer, useServerSideRendering } from '../Hooks/Context';
import { ContentLinkService } from '../Models/ContentLink';
import { DefaultServices } from '../Core/IServiceContainer';
import { Spinner } from '../Components/Spinner';
import { useLocation } from 'react-router';
const safeLanguageId = (ref, branch = '##', def = '') => {
    try {
        return ref ? ContentLinkService.createLanguageId(ref, branch, true) : def;
    }
    catch (e) {
        return def;
    }
};
function EpiComponent(props) {
    // Get Hooks & Services
    const ctx = useEpiserver();
    const ssr = useServerSideRendering();
    const repo = useIContentRepository();
    // Get convenience variables from services
    const debug = ctx.isDebugActive();
    const lang = ctx.Language;
    // Get identifiers from props
    const initialContent = () => {
        if (!props.expandedValue)
            return ssr.getIContent(props.contentLink);
        const expandedId = safeLanguageId(props.expandedValue, lang);
        const linkId = safeLanguageId(props.contentLink, lang);
        return expandedId === linkId ? props.expandedValue : ssr.getIContent(props.contentLink);
    };
    const [iContent, setIContent] = useState(initialContent);
    // Make sure the right iContent has been assigned and will be kept in sync
    useEffect(() => {
        let isCancelled = false;
        const linkId = safeLanguageId(props.contentLink, lang);
        // Define listeners to ensure content changes affect the component
        const onContentPatched = (item, newValue) => {
            const itemApiId = safeLanguageId(newValue, lang);
            if (linkId === itemApiId) {
                if (debug)
                    console.debug('EpiComponent / onContentPatched - Updating iContent', itemApiId);
                setIContent(newValue);
            }
        };
        const onContentUpdated = (item) => {
            const itemApiId = safeLanguageId(item, lang);
            if (linkId === itemApiId) {
                if (debug)
                    console.debug('EpiComponent / onContentUpdated - Updating iContent', itemApiId);
                setIContent(item);
            }
        };
        // Bind listeners and load content
        repo.addListener("afterPatch", onContentPatched);
        repo.addListener("afterUpdate", onContentUpdated);
        repo.load(props.contentLink).then(x => { if (!isCancelled)
            setIContent(x); });
        // Cancel effect and remove listeners
        return () => {
            isCancelled = true;
            repo.removeListener("afterPatch", onContentPatched);
            repo.removeListener("afterUpdate", onContentUpdated);
        };
    }, [props.contentLink, repo, debug, lang]);
    if (!iContent)
        return React.createElement(Spinner, null);
    return React.createElement(IContentRenderer, { data: iContent, contentType: props.contentType, actionName: props.actionName, actionData: props.actionData });
}
EpiComponent.displayName = "Optimizely CMS: ContentLink IContent resolver";
export const IContentRenderer = (props) => {
    const context = useEpiserver();
    const path = useLocation().pathname;
    const componentLoader = useServiceContainer().getService(DefaultServices.ComponentLoader);
    const componentName = buildComponentName(props.data, props.contentType);
    const [componentAvailable, setComponentAvailable] = useState(componentLoader.isPreLoaded(componentName));
    useEffect(() => {
        let isCancelled = false;
        componentLoader.LoadType(componentName).then(component => {
            if (isCancelled)
                return;
            setComponentAvailable(component ? true : false);
        });
        return () => { isCancelled = true; };
    }, [componentName, componentLoader]);
    if (!componentAvailable)
        return React.createElement(Spinner, null);
    const IContentComponent = componentLoader.getPreLoadedType(componentName, false);
    if (!IContentComponent)
        return React.createElement(Spinner, null);
    return React.createElement(EpiComponentErrorBoundary, { componentName: componentName || "Error resolving component" },
        React.createElement(IContentComponent, Object.assign({}, Object.assign(Object.assign({}, props), { context, contentLink: props.data.contentLink, path: props.path || path }))));
};
IContentRenderer.displayName = "Optimizely CMS: IContent renderer";
export default EpiComponent;
//#region Internal methods for the Episerver CMS Component
/**
 * Create the name of the React Component to load for this EpiComponent
 *
 * @param item The IContent to be presented by this EpiComponent
 */
const buildComponentName = (item, contentType) => {
    const context = contentType || '';
    const iContentType = (item === null || item === void 0 ? void 0 : item.contentType) || ['Error', 'ContentNotPresent'];
    let baseName = iContentType.map((s) => StringUtils.SafeModelName(s)).join('/');
    if (context && context !== iContentType[0]) {
        baseName = context + '/' + baseName;
    }
    return `app/Components/${baseName}`;
};
class EpiComponentErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error('EpiComponent caught error', error, errorInfo);
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return React.createElement("div", { className: "alert alert-danger" },
                "Uncaught error in ",
                React.createElement("span", null, this.props.componentName));
        }
        return this.props.children;
    }
}
EpiComponentErrorBoundary.displayName = "Optimizely CMS: IContent Error Boundary";
//#endregion
//# sourceMappingURL=EpiComponent.js.map