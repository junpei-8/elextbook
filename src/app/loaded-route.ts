import { RootRouteKeys } from "./app-routing.module"

type LoadedRoute = {
  [name in RootRouteKeys]?: boolean
}

export const LOADED_ROUTE: LoadedRoute = {
  home: true,
  notFound: true
};
