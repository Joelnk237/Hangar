import AdvanceSearch from "@/app/components/property-list/search";
import { PageProps } from "@/app/types/property/filtertypes";


export default async  function Page({ params }: PageProps) {
  //const location = decodeURIComponent(params.slug);

  const { slug } = await params;

  return (
    <AdvanceSearch initialLocation={slug} />
  );
}