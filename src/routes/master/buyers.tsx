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

// const fetchBuyers = async () => {
//   const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/buyers`);

//   const normalized = res.data.map((item: any) => normalizeObject(item));
//   console.log(normalized);
// };

function RouteComponent() {
  // useEffect(() => {
  //   fetchBuyers();
  // }, []);
  return <div>Hello "/master/buyers"!</div>;
}
