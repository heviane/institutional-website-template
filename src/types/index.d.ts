import "vitest";

declare module "vitest" {
  export interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
  export interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
