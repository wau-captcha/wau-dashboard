import { redirect } from "next/navigation";

/** The dashboard starts at the overview; the proxy sends signed-out visitors to /login. */
export default function HomePage() {
  redirect("/overview");
}
