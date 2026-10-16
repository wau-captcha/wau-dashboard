import { NotFoundState } from "../_components/not-found-state";

/** notFound() of the admin console, e.g. an unknown user: inside the console's own header. */
export default function AdminNotFound() {
  return (
    // Room above for the W behind the code, which would otherwise slip under the header.
    <div className="grid place-items-center overflow-x-clip pt-32 pb-16 sm:pt-40">
      <NotFoundState />
    </div>
  );
}
