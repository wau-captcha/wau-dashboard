import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getI18n } from "@/lib/i18n/server";
import { getStatus } from "@/lib/status";
import { Prose } from "../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.trust.status.metaTitle, description: t.trust.status.metaDescription };
}

/** Whether each service answers its /healthz, checked from this server at most every 30 seconds. */
export default async function StatusPage() {
  const [{ t, format }, report] = await Promise.all([getI18n(), getStatus()]);
  const text = t.trust.status;

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={text.title} description={text.description} />
      <Alert tone={report.up ? "positive" : "negative"} title={report.up ? text.allUp : text.someDown}>
        {text.checkedAt(format.dateTime(report.checkedAt))}
      </Alert>
      <Table aria-label={text.tableLabel}>
        <TableHeader>
          <TableRow>
            <TableHead>{text.service}</TableHead>
            <TableHead>{text.state}</TableHead>
            <TableHead className="text-right">{text.responseTime}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.services.map((service) => (
            <TableRow key={service.name}>
              <TableCell className="whitespace-normal">{text.services[service.name]}</TableCell>
              <TableCell>
                <Badge tone={service.up ? "positive" : "negative"} dot>
                  {service.up ? text.operational : text.down}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {service.responseMs === null ? "—" : text.ms(format.number(service.responseMs))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Prose>{text.honesty}</Prose>
      <a href="/status.json" className="justify-self-start text-body text-link hover:text-link-hover">
        {text.json}: /status.json
      </a>
    </div>
  );
}
