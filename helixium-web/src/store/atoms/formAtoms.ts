import { atom, type WritableAtom } from "jotai";
import { focusAtom } from 'jotai-optics';

export const firstNameAtom = atom("");
export const lastNameAtom = atom("");
export const emailAtom = atom("");
export const phoneNumberAtom = atom("");
export const addressAtom = atom("");
export const cityAtom = atom("");

export const formAtom = atom((get) => ({
    firstName: get(firstNameAtom),
    lastName: get(lastNameAtom),
    email: get(emailAtom),
    phoneNumber: get(phoneNumberAtom),
    address: get(addressAtom),
    city: get(cityAtom),
}));

const catDetails = {
    name: "Whiskers",
    age: 2,
    breed: "Siamese",
    color: "White",
    gender: "Male",
    weight: 10,
    height: 10,
    length: 10,
};

export const catDetailsAtom = atom(catDetails);
export const catName = focusAtom(catDetailsAtom, (optic) => optic.prop("name")) as WritableAtom<string, unknown[], void>;
