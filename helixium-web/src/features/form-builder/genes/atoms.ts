import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

/**
 * Allele (answer value) atom family for genes
 * This allows external components to access gene values by ID
 * Usage: const alleleAtom = geneAlleleAtomFamily(geneId);
 */
export const geneAlleleAtomFamily = atomFamily((_geneId: string) =>
  atom<string>("")
);

/**
 * Gene registry atom to track all active genes
 * This helps external components discover what genes are available
 */
export const geneRegistryAtom = atom<Set<string>>(new Set<string>());

/**
 * Helper function to register a gene in the registry
 */
export const registerGeneAtom = atom(null, (get, set, geneId: string) => {
  const currentRegistry = get(geneRegistryAtom);
  const newRegistry = new Set(currentRegistry);
  newRegistry.add(geneId);
  set(geneRegistryAtom, newRegistry);
});

/**
 * Helper function to get all gene values
 * This allows external components to collect all alleles at once
 */
export const getAllGenesValuesAtom = atom((get) => {
  const registry = get(geneRegistryAtom);
  const values: Record<string, string> = {};
  
  registry.forEach((geneId) => {
    const alleleAtom = geneAlleleAtomFamily(geneId);
    values[geneId] = get(alleleAtom);
  });
  
  return values;
});

/**
 * Helper function to get a specific gene value by ID
 * Usage: const value = get(getGeneValueByIdAtom(geneId));
 */
export const getGeneValueByIdAtom = (geneId: string) => 
  atom((get) => {
    const alleleAtom = geneAlleleAtomFamily(geneId);
    return get(alleleAtom);
  });

// Export types for external use
export type GeneId = string;
export type AlleleValue = string;
