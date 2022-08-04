import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';
export function setBaseClassName(prefix) {
    return ClassNameGenerator.configure((componentName) => `${prefix}-${componentName}`);
}
//# sourceMappingURL=StylingUtils.js.map