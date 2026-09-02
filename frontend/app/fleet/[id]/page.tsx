import { AylaAppClient } from '../../../components/AylaAppClient';

export default async function AircraftDetailWithParamRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <AylaAppClient initialView="aircraft-detail" initialAircraftId={resolvedParams.id} />;
}
