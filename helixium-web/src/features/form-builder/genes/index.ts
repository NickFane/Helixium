import { geneAlleleAtomFamily, geneRegistryAtom, getAllGenesValuesAtom, getGeneValueByIdAtom } from './atoms';

// Export gene components from their dedicated folders
export { FullNameGene } from "./fullname";

// Export atoms and utilities for external access
export {
    geneAlleleAtomFamily,
    geneRegistryAtom,
    registerGeneAtom,
    getAllGenesValuesAtom,
    getGeneValueByIdAtom,
    type GeneId,
    type AlleleValue,
} from "./atoms";

// Gene registry utilities for external components
export const GeneRegistry = {
    /**
     * Get the value of a specific gene by ID
     * Usage: const value = store.get(GeneRegistry.getValueById(geneId));
     */
    getValueById: (geneId: string) => getGeneValueByIdAtom(geneId),

    /**
     * Get the allele atom for a specific gene ID
     * Usage: const [value, setValue] = useAtom(GeneRegistry.getAlleleAtom(geneId));
     */
    getAlleleAtom: (geneId: string) => geneAlleleAtomFamily(geneId),

    /**
     * Get all active gene values
     * Usage: const allValues = store.get(GeneRegistry.getAllValues());
     */
    getAllValues: () => getAllGenesValuesAtom,

    /**
     * Get all registered gene IDs
     * Usage: const geneIds = store.get(GeneRegistry.getRegisteredIds());
     */
    getRegisteredIds: () => geneRegistryAtom,
};
