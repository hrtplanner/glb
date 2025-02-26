<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./components/Scene.svelte";
    import { Unused, type Layer, type LayerCake } from "./types/layer.d";
    import TogglableDrag from "./components/TogglableDrag.svelte";
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import Togglable from "./components/Togglable.svelte";

    type LC = LayerCake & { [key: string]: Layer | boolean };

    let layerCake = $state<LC>({
        male: Unused,
        female: Unused,
        nonBinary: Unused,
        agender: Unused,
        usesOtherPronouns: false,
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
                preference: value.findIndex((x) => x[0] === 0)
            },
            female: {
                ...layerCake.female,
                usesPronoun: value.find((x) => x[0] === 1)![2],
                preference: value.findIndex((x) => x[0] === 1)
            },
            nonBinary: {
                ...layerCake.nonBinary,
                usesPronoun: value.find((x) => x[0] === 2)![2],
                preference: value.findIndex((x) => x[0] === 2)
            },
            agender: {
                ...layerCake.agender,
                usesPronoun: value.find((x) => x[0] === 3)![2],
                preference: value.findIndex((x) => x[0] === 3)
            },
        };
    });

    const languageOther = [
        "I use any (or a subset) of other pronouns."
    ];

    const otherPronouns: Writable<[number, string, boolean][]> = writable([
        [0, languageOther[0], false],
    ]);

    otherPronouns.subscribe((value) => {
        layerCake = {
            ...layerCake,
            usesOtherPronouns: value.find((x) => x[0] === 0)![2],
        };
    });

	const languageBigender = [
		"On different occasions, I feel more-or-less masculine.",
		"On different occasions, I feel more-or-less feminine.",
		"On different occasions, I feel more-or-less a gender outside of the male/female binary.",
		"On different occasions, I feel more-or-less a gender unrelated to the male/female binary."
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
        "I usually present in a way that is typically masculine.",
        "I usually present in a way that is typically feminine.",
        "I usually present in a way that is typically androgynous.",
        "I usually present in a way that is typically gender-neutral."
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

    let isMobile = window.innerWidth < 800;

    function encodeSettings() {
        let str = "";
        for (const key in layerCake) {
            if (key === "usesOtherPronouns") continue;
            const layer = layerCake[key] as Layer;
            str += layer.usesPronoun ? "1" : "0";
            str += layer.presentation ? "1" : "0";
            str += layer.preference.toString();
            str += layer.bigenderOption ? "1" : "0";
        }
        str += layerCake.usesOtherPronouns ? "1" : "0";
        return str;
    }

    function verifySettingsIntegrity(str: string) {
        if (str.length !== 17) return false;
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                if (str[i] !== "0" && str[i] !== "1") return false;
            } else if (i % 4 === 1) {
                if (str[i] !== "0" && str[i] !== "1") return false;
            } else if (i % 4 === 2) {
                if (str[i] !== "0" && str[i] !== "1" && str[i] !== "2" && str[i] !== "3") return false;
            } else if (i % 4 === 3) {
                if (str[i] !== "0" && str[i] !== "1") return false;
            }
        }
        if (str[16] !== "0" && str[16] !== "1") return false;
        return true;
    }

    function decodeSettings(str: string) {
        let i = 0;
        for (const key in layerCake) {
            if (key === "usesOtherPronouns") continue;
            const layer = layerCake[key] as Layer;
            layer.usesPronoun = str[i] === "1";
            layer.presentation = str[i + 1] === "1";
            layer.preference = parseInt(str[i + 2]);
            layer.bigenderOption = str[i + 3] === "1";
            layerCake[key] = layer;
            i += 4;
        }
        layerCake.usesOtherPronouns = str[i] === "1";

        pronouns.update((value) => {
            let val = value.map((x) => {
                x[2] = (Object.values(layerCake)[x[0] as number] as Layer).usesPronoun;
                return x;
            });
            val.sort((a, b) => {
                return (Object.values(layerCake)[a[0] as number] as Layer).preference - (Object.values(layerCake)[b[0] as number] as Layer).preference;
            });
            return val;
        });

		presentation.update((value) => {
			let val = value.map((x) => {
				x[2] = (Object.values(layerCake)[x[0] as number] as Layer).presentation || false;
				return x;
			});
			return val;
		});

		bigender.update((value) => {
			let val = value.map((x) => {
				x[2] = (Object.values(layerCake)[x[0] as number] as Layer).bigenderOption || false;
				return x;
			});
			return val;
		});

        otherPronouns.update((value) => {
            value[0][2] = layerCake.usesOtherPronouns || false;
            return value;
        });
    }

    onMount(() => {
        const hash = window.location.hash;
        const settings = hash.slice(1);
        if (settings) {
            if (verifySettingsIntegrity(settings))
                decodeSettings(settings);
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
    <h1>Sorry, this app is not available on mobile devices.</h1>
    <style>
        h1 {
            font-family: 'DM Serif Text', serif;
            text-align: center;
            margin-top: 20vh;
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
                    }}
                    bind:pronouns={genPronouns}
                />
            </Canvas>
        </div>

        <div class="questionnaire_wrapper">
            <h1>Gender Lego Bricks</h1>
            <div class="overflow">
				<h3>~ <i>You may want to try these pronouns:</i></h3>
                <div class="pronouns_display">
                    {#each genPronouns as [pronoun, color], i}
                        <span style="color: {color}">{pronoun}</span>
                        {#if i !== genPronouns.length - 1}
                            <span class="separator">/</span>
                        {/if}
                    {/each}
				</div>

                <div class="question_section">
                    <h3>Which of the following do you identify with most-to-least?</h3>
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
                    <h3>How do you present (appear)?</h3>
                    <div class="scrollable">
                        <Togglable options={presentation} oneOnly />
                    </div>
                </div>
            </div>
        </div>
    </main>

    <style scoped>
        h1, h3 {
            font-family: 'DM Serif Text', serif;
        }
        
        main {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            flex-direction: row;
        }
    
        .canvas_wrapper {
            width: 800px;
            height: 500px;
            transform: translateX(-10%) translateY(-50%);
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
            font-family: 'DM Serif Text', serif;
			display: flex;
			margin-bottom: 50px;
			padding: 3px;
			border: 1px solid rgba(0,0,0,0.1);pronouns_disp
			border-radius: 5px;
			background-color: #c0c0c0;
			padding-left: 10px;
			box-sizing: border-box;
			text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }

        .separator {
            color: #000;
            font-weight: bolder;
            font-family: 'Roboto Flex', sans-serif;
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