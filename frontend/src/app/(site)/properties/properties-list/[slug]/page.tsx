import AdvanceSearch from "@/app/components/property-list/search";

type PageProps = {
  params: { location: string };
};

export default function Page({ params }: PageProps) {
  const location = decodeURIComponent(params.location);

  return (
    <AdvanceSearch initialLocation={location} />
  );
}