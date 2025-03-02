export function assertIsDefined<TValue>(
  value: TValue,
): asserts value is Exclude<TValue, undefined> {
  if (value === undefined) {
    throw new Error("Encountered an unexpected undefined value");
  }
}
