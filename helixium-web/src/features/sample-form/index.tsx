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
import { Card, Flex, Text } from "@chakra-ui/react";
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
      <Flex flexDir={"column"} margin={4} gap={2}>
        <Card.Root>
          <Card.Header>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              Form State
            </Text>
          </Card.Header>
          <Card.Body>
            <Text>
              {formState.firstName} {formState.lastName}
            </Text>
            <Text>{formState.email}</Text>
            <Text>{formState.phoneNumber}</Text>
            <Text>{formState.address}</Text>
            <Text>{formState.city}</Text>
            <Text>{catState.name}</Text>
          </Card.Body>
          <Card.Footer />
        </Card.Root>
      </Flex>
    </Flex>
  );
};

export default SampleForm;
