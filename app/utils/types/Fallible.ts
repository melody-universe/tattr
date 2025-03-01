export type Fallible<Result extends object> =
  | (Result & { isSuccess: true })
  | { error: unknown; isSuccess: false };
