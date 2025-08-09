import SampleForm from "@/features/sample-form";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/SampleFormRoute")({
  component: SampleFormRoute,
});

function SampleFormRoute() {
  return <SampleForm />;
}

export default SampleFormRoute;
