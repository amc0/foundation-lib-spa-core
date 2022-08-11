import createCache from '@emotion/cache';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';
export function setBaseClassName(prefix) {
    return ClassNameGenerator.configure((componentName) => `${prefix}-${componentName}`);
}
export function createMuiCache() {
    const muiCache = createCache({
        key: 'mui',
        prepend: true,
    });
    return muiCache;
}
//# sourceMappingURL=StylingUtils.js.map