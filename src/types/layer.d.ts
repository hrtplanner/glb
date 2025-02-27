export interface Layer {
    presentation?: boolean;
    usesPronoun: boolean;
    bigenderOption?: boolean;
    preference: number;
}

export interface LayerCake {
    male: Layer;
    female: Layer;
    nonBinary: Layer;
    agender: Layer;
    usesOtherPronouns?: boolean;
    usesAnyPronouns?: boolean;
}

export const Unused: Layer = {
    usesPronoun: false,
    presentation: false,
    preference: 0,
    bigenderOption: false
};