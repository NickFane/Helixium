import FormBuilder from "@/features/form-builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form-builder")({
  component: FormBuilderRoute,
});

function FormBuilderRoute() {
  return <FormBuilder />;
}

export default FormBuilderRoute;

