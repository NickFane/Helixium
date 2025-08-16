import FormBuilder from "@/features/form-builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form-builder/")({
  component: FormBuilderIndex,
});

function FormBuilderIndex() {
  return <FormBuilder />;
}

export default FormBuilderIndex;
