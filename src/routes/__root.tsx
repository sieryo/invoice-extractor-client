import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { FullscreenLoader } from "@/components/FullScreenLoader";


export const Route = createRootRoute({
  component: () => (
    <>
      {/* <Header /> */}

      <Outlet />
      <FullscreenLoader />

      <TanStackRouterDevtools />
    </>
  ),
});
