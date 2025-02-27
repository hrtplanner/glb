<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./components/Scene.svelte";
    import { Unused, type Layer, type LayerCake } from "./types/layer.d";
    import TogglableDrag from "./components/TogglableDrag.svelte";
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import Togglable from "./components/Togglable.svelte";
    import Modal from "svelte-simple-modal";
    import Preview from "./tutorial/Preview.svelte";

    type LC = LayerCake & { [key: string]: Layer | boolean };

    let layerCake = $state<LC>({
        male: Unused,
        female: Unused,
        nonBinary: Unused,
        agender: Unused,
        usesOtherPronouns: false,
        usesAnyPronouns: false,
    });

    const languagePronouns = [
        "I feel in some way masculine.",
        "I feel in some way feminine.",
        "I feel I'm another gender outside of the male/female binary.",
        "I feel entirely dissociated from the male/female binary, or that I do not have a gender.",
    ];

    let pronouns: Writable<[number, string, boolean][]> = writable([
        [0, languagePronouns[0], false],
        [1, languagePronouns[1], false],
        [2, languagePronouns[2], false],
        [3, languagePronouns[3], false],
    ]);

    pronouns.subscribe((value) => {
        layerCake = {
            ...layerCake,
            male: {
                ...layerCake.male,
                usesPronoun: value.find((x) => x[0] === 0)![2],
                preference: value.findIndex((x) => x[0] === 0),
            },
            female: {
                ...layerCake.female,
                usesPronoun: value.find((x) => x[0] === 1)![2],
                preference: value.findIndex((x) => x[0] === 1),
            },
            nonBinary: {
                ...layerCake.nonBinary,
                usesPronoun: value.find((x) => x[0] === 2)![2],
                preference: value.findIndex((x) => x[0] === 2),
            },
            agender: {
                ...layerCake.agender,
                usesPronoun: value.find((x) => x[0] === 3)![2],
                preference: value.findIndex((x) => x[0] === 3),
            },
        };
    });

    const languageOther = [
        "I use any other pronouns.",
        "I use another specific set of pronouns, such as neopronouns.",
    ];

    const otherPronouns: Writable<[number, string, boolean][]> = writable([
        [0, languageOther[0], false],
        [1, languageOther[1], false],
    ]);

    otherPronouns.subscribe((value) => {
        layerCake = {
            ...layerCake,
            usesOtherPronouns: value.find((x) => x[0] === 0)![2],
            usesAnyPronouns: value.find((x) => x[0] === 1)![2],
        };
    });

    const languageBigender = [
        "On different occasions, I feel more-or-less masculine.",
        "On different occasions, I feel more-or-less feminine.",
        "On different occasions, I feel more-or-less a gender outside of the male/female binary.",
        "On different occasions, I feel more-or-less a gender unrelated to the male/female binary.",
    ];

    const bigender: Writable<[number, string, boolean][]> = writable([
        [0, languageBigender[0], false],
        [1, languageBigender[1], false],
        [2, languageBigender[2], false],
        [3, languageBigender[3], false],
    ]);

    bigender.subscribe((value) => {
        layerCake = {
            ...layerCake,
            male: {
                ...layerCake.male,
                bigenderOption: value.find((x) => x[0] === 0)![2],
            },
            female: {
                ...layerCake.female,
                bigenderOption: value.find((x) => x[0] === 1)![2],
            },
            nonBinary: {
                ...layerCake.nonBinary,
                bigenderOption: value.find((x) => x[0] === 2)![2],
            },
            agender: {
                ...layerCake.agender,
                bigenderOption: value.find((x) => x[0] === 3)![2],
            },
        };
    });

    let genPronouns: [string, string][] = $state([]);

    const languagePresentation = [
        "I may present in a way that is identifiably masculine.",
        "I may present in a way that is identifiably feminine.",
        "I may appear androgynous, where I present as a mix of both masculine/feminine properties.",
        "I may appear gender-neutral, where I present in a fashion that is unrelated to the gender binary or is unidentifiable.",
    ];

    const presentation: Writable<[number, string, boolean][]> = writable([
        [0, languagePresentation[0], false],
        [1, languagePresentation[1], false],
        [2, languagePresentation[2], false],
        [3, languagePresentation[3], false],
    ]);

    presentation.subscribe((value) => {
        layerCake = {
            ...layerCake,
            male: {
                ...layerCake.male,
                presentation: value.find((x) => x[0] === 0)![2],
            },
            female: {
                ...layerCake.female,
                presentation: value.find((x) => x[0] === 1)![2],
            },
            nonBinary: {
                ...layerCake.nonBinary,
                presentation: value.find((x) => x[0] === 2)![2],
            },
            agender: {
                ...layerCake.agender,
                presentation: value.find((x) => x[0] === 3)![2],
            },
        };
    });

    let isMobile = $state(window.innerWidth < 800);

    window.addEventListener("resize", () => {
        isMobile = window.innerWidth < 800;
    });

    function verifySettingsIntegrity(settings: string): boolean {
        try {
            if (settings.length !== 4) {
                return false;
            }

            const decoded = atob(settings);

            if (decoded.length !== 3) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    function encodeSettings() {
        let packed = 0;
        let bitPos = 0;

        for (const key in layerCake) {
            if (key === "usesOtherPronouns" || key === "usesAnyPronouns")
                continue;
            const layer = layerCake[key] as Layer;

            if (layer.usesPronoun) packed |= 1 << bitPos;
            bitPos++;

            if (layer.presentation) packed |= 1 << bitPos;
            bitPos++;

            packed |= (layer.preference & 3) << bitPos;
            bitPos += 2;

            if (layer.bigenderOption) packed |= 1 << bitPos;
            bitPos++;
        }

        if (layerCake.usesOtherPronouns) packed |= 1 << bitPos;
        bitPos++;
        if (layerCake.usesAnyPronouns) packed |= 1 << bitPos;

        return btoa(
            String.fromCharCode(
                packed & 0xff,
                (packed >> 8) & 0xff,
                (packed >> 16) & 0xff,
            ),
        );
    }

    function decodeSettings(str: string) {
        try {
            const decoded = atob(str);

            let packed =
                decoded.charCodeAt(0) |
                (decoded.charCodeAt(1) << 8) |
                (decoded.charCodeAt(2) << 16);

            let bitPos = 0;

            for (const key in layerCake) {
                if (key === "usesOtherPronouns" || key === "usesAnyPronouns")
                    continue;
                const layer = layerCake[key] as Layer;

                layer.usesPronoun = !!(packed & (1 << bitPos));
                bitPos++;

                layer.presentation = !!(packed & (1 << bitPos));
                bitPos++;

                layer.preference = (packed >> bitPos) & 3;
                bitPos += 2;

                layer.bigenderOption = !!(packed & (1 << bitPos));
                bitPos++;

                layerCake[key] = layer;
            }
            layerCake.usesOtherPronouns = !!(packed & (1 << bitPos));
            bitPos++;
            layerCake.usesAnyPronouns = !!(packed & (1 << bitPos));
            updateStores();
        } catch (e) {
            window.location.hash = "";
            decodeSettings(btoa("\0\0\0"));
        }
    }

    function updateStores() {
        pronouns.update((value) => {
            let val = value.map((x) => {
                x[2] = (
                    Object.values(layerCake)[x[0] as number] as Layer
                ).usesPronoun;
                return x;
            });
            val.sort((a, b) => {
                return (
                    (Object.values(layerCake)[a[0] as number] as Layer)
                        .preference -
                    (Object.values(layerCake)[b[0] as number] as Layer)
                        .preference
                );
            });
            return val;
        });

        presentation.update((value) => {
            let val = value.map((x) => {
                x[2] =
                    (Object.values(layerCake)[x[0] as number] as Layer)
                        .presentation || false;
                return x;
            });
            return val;
        });

        bigender.update((value) => {
            let val = value.map((x) => {
                x[2] =
                    (Object.values(layerCake)[x[0] as number] as Layer)
                        .bigenderOption || false;
                return x;
            });
            return val;
        });

        otherPronouns.update((value) => {
            value[0][2] = layerCake.usesOtherPronouns || false;
            value[1][2] = layerCake.usesAnyPronouns || false;
            return value;
        });
    }

    onMount(() => {
        const hash = window.location.hash;
        const settings = hash.slice(1);
        if (settings) {
            if (verifySettingsIntegrity(settings)) decodeSettings(settings);
            else {
                window.location.hash = "";
                decodeSettings("00000000000000000");
            }
        }
    });

    $effect(() => {
        window.location.hash = encodeSettings();
    });
</script>

{#if isMobile}
    <main class="mobile">
        <div class="canvas_wrapper mobile">
            <Canvas>
                <Scene
                    layerCake={layerCake || {
                        male: Unused,
                        female: Unused,
                        nonBinary: Unused,
                        agender: Unused,
                        usesOtherPronouns: false,
                        usesAnyPronouns: false,
                    }}
                    bind:pronouns={genPronouns}
                    isMobile
                />
            </Canvas>
        </div>

        <div class="mobile_questionnaire">
            <div class="overflow">
                <h1>Gender Lego Bricks</h1>

                <Modal><Preview /></Modal>

                <h3>~ <i>Stereotypical pronouns</i></h3>
                <div class="pronouns_display mobile">
                    {#each genPronouns as [pronoun, color], i}
                        <span style="color: {color}; -webkit-text-stroke: 0.5px black;">{pronoun}</span>
                        {#if i !== genPronouns.length - 1}
                            <span class="separator">/</span>
                        {/if}
                    {/each}
                </div>

                <div class="question_section mobile">
                    <h3>
                        Which of the following do you identify with
                        most-to-least?
                    </h3>
                    <TogglableDrag options={pronouns} isMobile />
                </div>

                <div class="question_section mobile">
                    <h3>Do you identify with any of the following?</h3>
                    <Togglable options={bigender} isMobile />
                </div>

                <div class="question_section mobile">
                    <h3>Do you use any other pronouns?</h3>
                    <Togglable options={otherPronouns} />
                </div>

                <div class="question_section mobile">
                    <h3>How do you present (appear)?</h3>
                    <Togglable options={presentation} isMobile />
                </div>
            </div>
        </div>
    </main>

    <style scoped>
        html,
        body {
            overflow-x: hidden;
            overflow-y: scroll;
        }

        h1,
        h3 {
            font-family: "DM Serif Text", serif;
        }

        main {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            flex-direction: column;
        }

        .mobile {
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto;
        }

        .pronouns_display {
            font-family: "DM Serif Text", serif;
            display: block;
            margin-bottom: 50px;
            padding: 3px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: #c0c0c0;
            padding-left: 10px;
            box-sizing: border-box;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
            width: 100%;
        }

        .separator {
            color: #000;
            font-weight: bolder;
            font-family: "Roboto Flex", sans-serif;
        }

        .canvas_wrapper {
            pointer-events: none;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
        }

        .canvas_wrapper canvas {
            position: absolute;
            left: 50%;
            transform: translateX(-40%);
        }

        .mobile_questionnaire {
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            top: 300px;
            left: 0;
            padding: 20px;
            padding-bottom: 100px;
            background-color: #f0f0f0;
            box-sizing: border-box;
            overflow-y: auto;
            height: calc(100vh - 200px);
        }

        .overflow {
            overflow-y: scroll;
            width: 100%;
            max-height: 100%;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .overflow::-webkit-scrollbar {
            display: none;
            visibility: hidden;
        }

        .question_section {
            width: 100%;
        }
    </style>
{:else}
    <main>
        <div class="canvas_wrapper">
            <Canvas>
                <Scene
                    layerCake={layerCake || {
                        male: Unused,
                        female: Unused,
                        nonBinary: Unused,
                        agender: Unused,
                        usesOtherPronouns: false,
                        usesAnyPronouns: false,
                    }}
                    bind:pronouns={genPronouns}
                    isMobile={false}
                />
            </Canvas>
        </div>

        <div class="questionnaire_wrapper">
            <h1>
                <div class="hrtplanner_square" title="hrtplanner"></div>
                 Gender Lego Bricks
            </h1>
            <Modal><Preview /></Modal>
            <div class="overflow">
                <h3>~ <i>Stereotypical pronouns</i></h3>
                <div class="pronouns_display">
                    {#each genPronouns as [pronoun, color], i}
                        <span style="color: {color}; -webkit-text-stroke: 0.5px black;">{pronoun}</span>
                        {#if i !== genPronouns.length - 1}
                            <span class="separator">/</span>
                        {/if}
                    {/each}
                </div>

                <div class="question_section">
                    <h3>
                        Which of the following do you identify with
                        most-to-least?
                    </h3>
                    <div class="scrollable">
                        <TogglableDrag options={pronouns} />
                    </div>
                </div>

                <div class="question_section">
                    <h3>Do you identify with any of the following?</h3>

                    <div class="scrollable">
                        <Togglable options={bigender} />
                    </div>
                </div>

                <div class="question_section">
                    <h3>Do you use any other pronouns?</h3>
                    <div class="scrollable">
                        <Togglable options={otherPronouns} />
                    </div>
                </div>

                <div class="question_section">
                    <h3>
                        What are the different ways you may present (appear)?
                    </h3>
                    <div class="scrollable">
                        <Togglable options={presentation} />
                    </div>
                </div>
            </div>
        </div>
    </main>

    <style scoped>
        h1,
        h3 {
            font-family: "DM Serif Text", serif;
        }

        main {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            flex-direction: row;
        }

        .hrtplanner_square {
            display: inline-flex;
            background: linear-gradient(to bottom, #9fe1fc, #f7cad3);
            border-radius: 5px;
            border: rgba(255, 255, 255, 0.1);
            width: 30px;
            height: 30px;
            margin-right: 5px;
            vertical-align: middle;
            align-self: center;
            transform: translateY(-10%);
        }

        .canvas_wrapper {
            width: 800px;
            height: 500px;
            transform: translateY(-50%);
            position: fixed;
            top: 50%;
            right: 0;
        }

        .questionnaire_wrapper {
            width: 50vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            padding: 20px;
            background-color: #f0f0f0;
            border-right: 2px solid #000;
        }

        .overflow {
            overflow-y: scroll;
            width: 100%;
            height: calc(100% - 100px);
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .overflow::-webkit-scrollbar {
            display: none;
            visibility: hidden;
        }

        .pronouns_display {
            font-family: "DM Serif Text", serif;
            display: flex;
            margin-bottom: 50px;
            padding: 3px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: #c0c0c0;
            padding-left: 10px;
            box-sizing: border-box;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        }

        .separator {
            color: #000;
            font-weight: bolder;
            font-family: "Roboto Flex", sans-serif;
        }

        .question_section {
            width: 100%;
        }

        .scrollable {
            overflow-x: hidden;
            overflow-y: scroll;
        }
    </style>
{/if}
