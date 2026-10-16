import { NotFoundState } from "../_components/not-found-state";

/** notFound() of the public pages, e.g. an unknown captcha: inside the site's own header and footer. */
export default function SiteNotFound() {
  return (
    // Room above for the W behind the code, which would otherwise slip under the sticky header.
    <div className="grid place-items-center overflow-x-clip px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-24">
      <NotFoundState />
    </div>
  );
}
