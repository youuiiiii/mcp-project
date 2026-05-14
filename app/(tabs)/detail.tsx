import { type Href, Redirect } from "expo-router";

const HOME_ROUTE = "/(tabs)" as Href;

export default function DetailRoute() {
  return <Redirect href={HOME_ROUTE} />;
}