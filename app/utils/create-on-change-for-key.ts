import type { Dispatch, SetStateAction } from "react";

export function createOnChangeForKey<TValue, TKey extends keyof TValue>(
  onChangeForContainer: Dispatch<SetStateAction<TValue>>,
  key: TKey,
): Dispatch<SetStateAction<TValue[TKey]>> {
  return (action) => {
    onChangeForContainer((value) => ({
      ...value,
      [key]: action instanceof Function ? action(value[key]) : action,
    }));
  };
}
