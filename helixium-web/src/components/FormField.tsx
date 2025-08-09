import { Input } from "@chakra-ui/react";
import { useAtom, type WritableAtom, type PrimitiveAtom } from "jotai";

type Props = {
  placeholder: string;
  /*
   * The formValueAtom is a Jotai atom that contains the value of the form field.
   * It can be a primitive atom or a writable atom.
   * The primitive atom is used to store the value of the form field.
   * The writable atom is used to store the value of the form field and to update the value of the form field.
   * The interface is a bit messy because of a PoC with what kind of atoms we can use.
   */
  formValueAtom:
    | PrimitiveAtom<string>
    | WritableAtom<string | unknown, [unknown], void>;
};

const FormField = (props: Props) => {
  const [formValue, setFormValue] = useAtom(props.formValueAtom);

  return (
    <Input
      variant={"flushed"}
      placeholder={props.placeholder}
      value={formValue as string}
      onChange={(e) => setFormValue(e.target.value)}
    />
  );
};

export default FormField;
