import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("vehicles", "routes/vehicles.tsx"),
  route("vehicles/:id", "routes/vehicle-detail.tsx"),
  route("service", "routes/service.tsx"),
  route("fuel", "routes/fuel.tsx"),
  route("analytics", "routes/analytics.tsx"),
  route("profile", "routes/profile.tsx"),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
