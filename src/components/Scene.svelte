<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import { Unused, type Layer, type LayerCake } from "../types/layer.d";

    function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    let colors: Record<string, string | Record<string, string>> = {
        gender: {
            male: "#0000FF",
            female: "#FFC0CB",
            nonBinary: "#FFFF00",
            agender: "#32CD32",
        },
        pronounType: {
            preferred: "#FF6961",
            meh: "#FFBF61",
            last: "#F8FF61",
        },
        presentation: {
            male: "#61FFE8",
            female: "#FF61B8",
            androgynous: "#F061FF",
            agender: "#61FF81",
        },
        bigenderOption: "#FF61FF",
        otherPronouns: "#AFEEEE",
    };

    function colorAverage(hexes: string[]) {
        let averageRgb = [0, 0, 0];

        for (const hex of hexes) {
            const value = parseInt(hex.slice(1), 16);
            averageRgb[0] += value >> 16;
            averageRgb[1] += (value >> 8) & 0xff;
            averageRgb[2] += value & 0xff;
        }

        averageRgb = averageRgb.map((value) =>
            Math.round(value / hexes.length),
        );
        return `#${((averageRgb[0] << 16) | (averageRgb[1] << 8) | averageRgb[2]).toString(16).padStart(6, "0")}`;
    }

    function isUsed(layer: Layer) {
        return layer.usesPronoun || layer.presentation;
    }

    let {
        layerCake = {
            male: Unused,
            female: Unused,
            nonBinary: Unused,
            agender: Unused,
            usesOtherPronouns: false
        },
        pronouns = $bindable([]),
    }: {
        layerCake: LayerCake & { [key: string]: Layer | boolean };
        pronouns: [string, string][]
    } = $props();

    function generatePronouns(): [string, string][] {
        let precedenceSorted = Object.keys(layerCake)
            .filter((key) => key !== "usesOtherPronouns" && (layerCake[key] as Layer).usesPronoun)
            .sort((a, b) => {
                return (layerCake[a] as Layer).preference - (layerCake[b] as Layer).preference;
            });

        let bigenderGenders = Object.keys(layerCake)
            .filter((key) => key !== "usesOtherPronouns" && (layerCake[key] as Layer).bigenderOption);
        
        const pronounsStereotypical: Record<string, string[]> = {
            male: ["he", "him", "his"],
            female: ["she", "her", "hers"],
            nonBinary: ["they", "them", "theirs"],
            agender: ["they", "them", "theirs"],
        };

        const g = colors.gender as Record<string, string>;

        let cameFirst = "";
        precedenceSorted = precedenceSorted.map((x) => {
            if (x !== "agender" && x !== "nonBinary") return x;
            if (cameFirst !== "") {
                return undefined;
            }
            cameFirst = x;
            return x;
        }).filter(x => x !== undefined);

        let value: [string, string][] = [];
        if (bigenderGenders.length === 0) {
            if (precedenceSorted.length === 0) {
                value = value.concat(["they", "them", "theirs"].map((x) => [x, g["agender"]]));
            } else if (precedenceSorted.length === 1) {
                value = value.concat(pronounsStereotypical[precedenceSorted[0]].map((x) => [x, g[precedenceSorted[0]]]));
            } else {
                let outputPronouns: [string, string][] = [];

                for (const key of precedenceSorted) {
                    if (layerCake[key] === Unused) continue;
                    outputPronouns.push([pronounsStereotypical[key][0], g[key]]);
                }

                value = value.concat(outputPronouns.slice(0, 3));
            }
        } else {
            precedenceSorted = precedenceSorted.filter((x) => !bigenderGenders.includes(x));

            let outputPronouns: [string, string][] = [];

            for (const key of precedenceSorted) {
                if (!isUsed(layerCake[key] as Layer)) continue;
                outputPronouns.push([pronounsStereotypical[key][0], g[key]]);
            }

            let cameFirst = "";
            bigenderGenders = bigenderGenders.map((x) => {
                if (x !== "agender" && x !== "nonBinary") return x;
                if (cameFirst !== "") {
                    return undefined;
                }
                cameFirst = x;
                return x;
            }).filter(x => x !== undefined);

            for (const key of bigenderGenders) {
                outputPronouns.push(["+" + pronounsStereotypical[key][0], g[key]]);
            }

            value = value.concat(outputPronouns.slice(0, 3));
            
        }

        if (layerCake.usesOtherPronouns) {
            value.push(["etc.", "#000000"]);
        }

        return value;
    }

    $effect(() => {
        layerCake = {
            ...layerCake,
        };

        pronouns = generatePronouns();
    });

    const { renderer } = useThrelte();

    useTask(() => {
        renderer.setClearColor(0xffffff);
        renderer.setSize(800, 500);
    });
</script>

<!--
    The layer cake is organized as follows:
    - The top level (height 1, depth to match pronoun options) keys indicate if properties of a gender identity are used
    - The second level (height) represents if a pronoun is used
    - The third level (height) represents if another pronoun is used, which applies throughout the entire layer cake
    - The fourth level (height) represents if the presentation is used
    - The fifth level (height) represents if it is used in a bigender/genderfluid/flux manner
-->

<T.PerspectiveCamera
    aspect={1}
    fov={50}
    near={0.1}
    far={100}
    position={[-3, 5, 7]}
    rotation={[-0.4, -0.4, 0]}
    makeDefault
/>

<T.Mesh position.y={0.5}>
    {#if layerCake}
        <T.Mesh position={[0, 0, 0]}>
            <T.Mesh position={[1.5, 1.5, -2]} visible={layerCake.usesOtherPronouns!}>
                <T.BoxGeometry args={[4, 4, 1]} />
                <T.MeshBasicMaterial
                    color={colors.otherPronouns as string}
                />
            </T.Mesh>
            {#each Object.keys(layerCake).slice(0, -1) as layer, i}
                <T.Mesh position={[i, 0, 0]}>
                    <T.Mesh position={[0, 0, 0]} visible={isUsed(layerCake[layer] as Layer)}>
                        <T.BoxGeometry args={[1, 1, 3]} />
                        <T.MeshBasicMaterial
                            color={Object.values(colors.gender)[i]}
                        />
                    </T.Mesh>
                    {#if (layerCake[layer] as Layer).usesPronoun}
                        <T.Mesh position={[0, 1, 4 - clamp((layerCake[layer] as Layer).preference + 3, 3, 5)]}>
                            <T.BoxGeometry width={1} height={1} depth={1} />
                            <T.MeshBasicMaterial
                                color={Object.values(colors.pronounType)[clamp((layerCake[layer] as Layer).preference, 0, 2)]}
                            />
                        </T.Mesh>
                    {/if}
                    <T.Mesh position={[0, 2, 0]} visible={(layerCake[layer] as Layer).presentation}>
                        <T.BoxGeometry args={[1, 1, 3]} />
                        <T.MeshBasicMaterial
                            color={Object.values(colors.presentation)[i]}
                        />
                    </T.Mesh>
                    <T.Mesh position={[0, 3, 0]} visible={(layerCake[layer] as Layer).bigenderOption}>
                        <T.BoxGeometry args={[1, 1, 3]} />
                        <T.MeshBasicMaterial
                            color={colors.bigenderOption as string}
                        />
                    </T.Mesh>
                </T.Mesh>
            {/each}
        </T.Mesh>
    {/if}
</T.Mesh>