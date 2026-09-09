export interface CalculationResult<T> {
  value: T;
  asOf: string;
  method: string;
  assumptions: Record<string, string | number>;
  limitations: string[];
  computedAt: string;
}
