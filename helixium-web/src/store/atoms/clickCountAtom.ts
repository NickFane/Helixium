import { atom } from 'jotai'
import { atomWithReducer } from 'jotai/utils';


export const clickCountDisplayAtom = atom((get) => {
    const clickCount = get(clickCountReducerAtom);
    return `Click count: ${clickCount}`;
});

export const clickCountReducer = (prev: number, action: { type: string }) => {
    if (action.type === 'increment') {
        return prev + 1;
    }
    if (action.type === 'decrement') {
        return prev - 1;
    }
    return prev;
}

export const clickCountReducerAtom = atomWithReducer(0, clickCountReducer);