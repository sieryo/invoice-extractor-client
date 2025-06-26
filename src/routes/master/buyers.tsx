import { createFileRoute } from "@tanstack/react-router";

export type Buyers = {
  nama: string,
  email: string,
  nitku: string,
  npwp_15_digit: string,
  npwp_16_digit: string,
}

export const Route = createFileRoute("/master/buyers")({
  component: RouteComponent,
});

function RouteComponent() {
  // useEffect(() => {
  //   fetchBuyers();
  // }, []);
  return <div>Hello "/master/buyers"!</div>;
}
