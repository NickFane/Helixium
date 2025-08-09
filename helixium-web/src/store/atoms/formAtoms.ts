import { atom } from "jotai";

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