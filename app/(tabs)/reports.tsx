import { type Href, Redirect } from "expo-router";

const MAP_ROUTE = "/(tabs)/map" as Href;

export default function ReportsRoute() {
  return <Redirect href={MAP_ROUTE} />;
}