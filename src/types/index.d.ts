import "vitest";

declare module "vitest" {
  export interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  export interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

