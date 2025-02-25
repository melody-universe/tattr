export type Failable<Result extends object> =
  | (Result & { isSuccess: true })
  | { error: unknown; isSuccess: false };
