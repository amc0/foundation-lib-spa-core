import createCache, { EmotionCache } from '@emotion/cache';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

export function setBaseClassName(prefix: string): void {
  return ClassNameGenerator.configure((componentName: string) => `${prefix}-${componentName}`);
}

export function createMuiCache(): EmotionCache {
  const muiCache = createCache({
    key: 'mui',
    prepend: true,
  });

  return muiCache;
}
