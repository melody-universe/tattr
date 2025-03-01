export type Fallible<Result extends object> =
  | Failure
  | (Result & { isSuccess: true });

export type Failure = { error: unknown; isSuccess: false };
