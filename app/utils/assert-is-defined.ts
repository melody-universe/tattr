export function assertIsDefined<TValue>(
  value: TValue | undefined,
): asserts value is TValue {
  if (value === undefined) {
    throw new Error("Encountered an unexpected undefined value");
  }
}
