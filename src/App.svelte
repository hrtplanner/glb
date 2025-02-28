<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./components/Scene.svelte";
    import { Unused, type Layer, type LayerCake } from "./types/layer.d";
    import TogglableDrag from "./components/TogglableDrag.svelte";
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import Togglable from "./components/Togglable.svelte";
    import Modal from "./tutorial/Modal.svelte";
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
        "I may appear androgynous; I may present as a mix of both masculine/feminine properties.",
        "I may appear gender-neutral; I may present in a fashion that is unrelated to the gender binary or is unidentifiable.",
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

<Modal>
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

                    <Preview />

                    <h3>~ <i>Stereotypical pronouns</i></h3>
                    <div class="pronouns_display mobile">
                        {#each genPronouns as [pronoun, color], i}
                            <span style="color: {color};">{pronoun}</span>
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

        <style global>
            .canvas_wrapper.mobile,
            .canvas_wrapper.mobile div {
                max-width: 360px;
                transform: translateY(15%) translateX(-7%);
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

                <Preview />

                <div class="overflow">
                    <h3>~ <i>Stereotypical pronouns</i></h3>
                    <div class="pronouns_display">
                        {#each genPronouns as [pronoun, color], i}
                            <span style="color: {color};">{pronoun}</span>
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
                            What are the different ways you may present
                            (appear)?
                        </h3>
                        <div class="scrollable">
                            <Togglable options={presentation} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    {/if}

    <style>
        h1,
        h3 {
            font-family: var(--font-primary);
            margin-bottom: var(--spacing-md);
            color: var(--color-fg);
        }

        main {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
        }

        main.mobile {
            flex-direction: column;
        }

        .canvas_wrapper {
            position: fixed;
            pointer-events: none;
        }

        .canvas_wrapper.mobile {
            max-width: 360px;
            max-height: 360px;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            left: 0;
        }

        .canvas_wrapper:not(.mobile) {
            width: 800px;
            height: 500px;
            transform: translateY(-50%);
            top: 50%;
            right: 0;
        }

        .canvas_wrapper.mobile {
            position: absolute;
            left: 50%;
            transform: translateX(-40%);
        }

        .questionnaire_wrapper,
        .mobile_questionnaire {
            background-color: var(--color-bg-main);
            padding: var(--spacing-lg);
            box-sizing: border-box;
            position: fixed;
            box-shadow: var(--shadow-md);
            transition: var(--transition-standard);
            overflow-x: hidden;
        }

        .questionnaire_wrapper {
            width: 50vw;
            height: 100vh;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            border-right: 1px solid var(--color-border);
        }

        .mobile_questionnaire {
            width: calc(100vw - 10px);
            bottom: 20px;
            left: 0;
            height: calc(100vh - 320px);
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: var(--radius-md);
            border: 1.2px solid var(--color-border);
            box-shadow: var(--shadow-md);
            transform: translateX(5px);
        }

        .overflow {
            overflow-x: hidden;
            overflow-y: auto;
            width: 100%;
            scrollbar-width: none;
            -ms-overflow-style: none;
            border-radius: var(--radius-sm);
        }

        .questionnaire_wrapper .overflow {
            height: calc(100% - 100px);
        }

        .mobile_questionnaire .overflow {
            max-height: 100%;
        }

        .overflow::-webkit-scrollbar,
        .scrollable::-webkit-scrollbar {
            display: none;
        }

        .pronouns_display {
            font-family: var(--font-primary);
            margin-bottom: var(--spacing-xl);
            padding: var(--spacing-sm) var(--spacing-md);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            background-color: var(--color-bg-secondary);
            box-sizing: border-box;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
            transition: var(--transition-standard);
        }

        .pronouns_display:not(.mobile) {
            display: flex;
        }

        .pronouns_display.mobile {
            display: block;
            width: 100%;
        }

        .pronouns_display span {
            transition: var(--transition-standard);
        }

        .separator {
            color: var(--color-fg);
            font-weight: bold;
            font-family: var(--font-secondary);
            margin: 0 var(--spacing-xs);
        }

        .question_section {
            width: 100%;
            margin-bottom: var(--spacing-lg);
            padding-bottom: var(--spacing-md);
            border-bottom: 1px solid var(--color-border);
        }

        .scrollable {
            overflow-x: hidden;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            border-radius: var(--radius-sm);
            padding: var(--spacing-xs);
        }

        .hrtplanner_square {
            display: inline-flex;
            background: linear-gradient(
                to bottom,
                var(--color-accent),
                var(--color-accent-secondary)
            );
            border-radius: var(--radius-sm);
            width: 30px;
            height: 30px;
            margin-right: var(--spacing-sm);
            vertical-align: middle;
            align-self: center;
            transform: translateY(-10%);
            box-shadow: var(--shadow-sm);
            transition: var(--transition-standard);
        }

        .hrtplanner_square:hover {
            transform: translateY(-10%) scale(1.05);
            box-shadow: var(--shadow-md);
        }
    </style>
</Modal>
