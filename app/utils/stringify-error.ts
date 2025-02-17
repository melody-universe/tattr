export function stringifyError(error: unknown): string {
  if (!import.meta.env.DEV) {
    return "An unexpected error occurred.";
  }

  if (error instanceof Error) {
    return [error.name, error.message, error.stack]
      .filter((_) => !!_)
      .join("\n");
  }

  if (typeof error === "string") {
    return error;
  }

  return `Error of unexpected type: ${typeof error}`;
}
