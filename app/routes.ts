import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/graphql", "routes/api.graphql.ts"),
] satisfies RouteConfig;
