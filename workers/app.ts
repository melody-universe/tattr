import { getLoadContext } from "load-context";
import { createRequestHandler } from "react-router";

export default {
  fetch(request, env, ctx): Promise<Response> {
    const loadContext = getLoadContext({
      context: { cloudflare: { ctx, env } },
      request,
    });
    return requestHandler(request, loadContext);
  },
} satisfies ExportedHandler<CloudflareEnvironment>;

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router at build time
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);
