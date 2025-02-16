import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/maps", "routes/maps.tsx"),
  route("/tokens", "routes/tokens.tsx"),
] satisfies RouteConfig;
