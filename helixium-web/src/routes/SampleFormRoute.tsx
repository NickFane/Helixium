import SampleForm from "@/features/sample-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/SampleFormRoute")({
  component: SampleFormRoute,
});

function SampleFormRoute() {
  return <SampleForm />;
}

export default SampleFormRoute;
