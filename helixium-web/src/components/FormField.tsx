import { Input } from "@chakra-ui/react";
import { useAtom, type PrimitiveAtom } from "jotai";
import React from "react";

type Props = {
  placeholder: string;
  formValueAtom: PrimitiveAtom<string>;
};

const FormField = (props: Props) => {
  const [formValue, setFormValue] = useAtom(props.formValueAtom);

  return (
    <Input
      variant={"flushed"}
      placeholder={props.placeholder}
      value={formValue}
      onChange={(e) => setFormValue(e.target.value)}
    />
  );
};

export default FormField;
