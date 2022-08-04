import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

export function setBaseClassName(prefix: string): void {
  return ClassNameGenerator.configure((componentName: string) => `${prefix}-${componentName}`);
}
