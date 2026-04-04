import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes";

export default [
  layout("routes/unauthorized/layout.tsx", [
    route("auth-callback", "routes/unauthorized/auth-callback.tsx"),
    route("login", "routes/unauthorized/login.tsx")
  ]),
  layout("routes/authorized/layout.tsx", [index("routes/authorized/home.tsx")])
] satisfies RouteConfig;
