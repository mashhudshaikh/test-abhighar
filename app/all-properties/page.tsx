import { getAllProperties } from "@/lib/properties";
import { getAllLocalities } from "@/lib/localities-data";
import AllPropertiesClient from "./AllPropertiesClient";

export default async function AllPropertiesPage() {
  const [properties, localities] = await Promise.all([
    getAllProperties(),
    getAllLocalities(),
  ]);
  return <AllPropertiesClient properties={properties} localities={localities} />;
}