import FormField from "@/components/FormField";
import {
  addressAtom,
  cityAtom,
  emailAtom,
  firstNameAtom,
  phoneNumberAtom,
  formAtom,
  lastNameAtom,
  catDetailsAtom,
  catName,
} from "@/store/atoms/formAtoms";
import { Card, Field, Flex, Separator, Text } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

const SampleForm = () => {
  const formState = useAtomValue(formAtom);
  const catState = useAtomValue(catDetailsAtom);
  return (
    <Flex margin={4} flexDir={"column"} gap={2}>
      <Flex flexDir={"column"} gap={2}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          A sample form to test with
        </Text>
        <FormField
          placeholder="Enter your name"
          formValueAtom={firstNameAtom}
        />
        <FormField
          placeholder="Enter your last name"
          formValueAtom={lastNameAtom}
        />
        <FormField placeholder="Enter your email" formValueAtom={emailAtom} />
        <FormField
          placeholder="Enter your phone number"
          formValueAtom={phoneNumberAtom}
        />
        <FormField
          placeholder="Enter your address"
          formValueAtom={addressAtom}
        />
        <FormField placeholder="Enter your city" formValueAtom={cityAtom} />
        <FormField
          placeholder="Enter your cat's name"
          formValueAtom={catName}
        />
      </Flex>
      <Flex flexDir={"column"} margin={4} gap={2} marginTop={12}>
        <Card.Root>
          <Card.Header>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              Form State
            </Text>
          </Card.Header>
          <Card.Body>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Text>
                {formState.firstName} {formState.lastName}
              </Text>
            </Field.Root>
            <Separator size={"md"} />
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Text>{formState.email}</Text>
            </Field.Root>
            <Separator size={"md"} />

            <Field.Root>
              <Field.Label>Phone Number</Field.Label>
              <Text>{formState.phoneNumber}</Text>
            </Field.Root>
            <Separator size={"md"} />

            <Field.Root>
              <Field.Label>Address</Field.Label>
              <Text>{formState.address}</Text>
            </Field.Root>
            <Separator size={"md"} />

            <Field.Root>
              <Field.Label>City</Field.Label>
              <Text>{formState.city}</Text>
            </Field.Root>
            <Separator size={"md"} />

            <Field.Root>
              <Field.Label>Cat Name</Field.Label>
              <Text>{catState.name}</Text>
            </Field.Root>
          </Card.Body>
          <Card.Footer />
        </Card.Root>
      </Flex>
    </Flex>
  );
};

export default SampleForm;
