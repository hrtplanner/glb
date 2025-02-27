<script lang="ts">
    import Step1 from './assets/1.png';
    import Step2 from './assets/2.png';
    import Step3 from './assets/3.png';
    import Step4 from './assets/4.png';
    import Step5 from './assets/5.png';
    import Step6 from './assets/6.png';

    const language = [
        "Allie's brick",
        "Example for Gender Identity, with only the agender identity enabled",
        "Example for Pronoun Precedence, where agender is preferred, non-binary is second, and masculine pronouns are last",
        "Example for Gender Expression, where the user prefers a more agender identity",
        "Example for Bigender Identity, where the user has a constant masculine identity and a fluctuating feminine identity",
        "Example for Pronoun Options, where the user prefers all pronouns (bottom) and neopronouns (top)"
    ];
</script>

<div>
    <h1>GLB Organization</h1>
    <p>I'm Allie, the developer of GLB. <a href="/#FLER" target="_blank">This is my brick</a>.</p>
    <p>Gender identity specified via GLB are organized into "bricks," which visualize certain data.</p>
    <img src={Step1} title={language[0]} alt={language[0]} />
    <p>This brick, overall, represents an agender gender identity, preferring agender pronouns, accepting any other pronouns and fluctuating between a more masculine identity.</p>
    <i>But don't get overwhelmed, it's (mostly) simple.</i>

    <h2>Core Groups</h2>
    <p>The four main organizations of bricks are <i>masculine, feminine, non-binary and agender</i>.</p>
    <p>Masculine represents a male-adjacent gender identity, feminine represents a female-adjacent gender identity, non-binary represents an identity outside the two and agender represents "none-of-the-above."</p>

    <h3>Gender identity</h3>
    <p>Gender identity is the bottom-most, "base," layer of each core group. They are toggled on-and-off by both the gender expression/presentation and gender identity questionnaires.</p>
    <p>Enabling an agender gender identity from the first questionnaire will also enable the non-binary gender identity block in response.</p>
    <p>The "gender identity" block determines the "base" stereotypical pronouns, the pronoun of which will be enabled/disabled in response.</p>
    <img src={Step2} title={language[1]} alt={language[1]} />

    <h3>Pronoun precedence</h3>
    <p>Pronoun precedence is the second-most layer of each core group.</p>
    <p>Rearranging the order of gender identities present in the first question will affect the order of the "base" pronouns in the stereotypical pronouns generated.</p>
    <p>It will also change the precedence (depth from front-to-back) of the pronoun assigned to the gender identity.</p>
    <p>Pronoun precedence defines which pronouns you prefer, and in what order. For example, they/he/she defines that "they" is preferred, "he" is a good second, and "she" is just okay.</p>
    <p>Pronoun precedence does not apply to "any" or "other" pronouns, if selected. They will go last.</p>
    <img src={Step3} title={language[2]} alt={language[2]} />

    <h3>Gender expression</h3>
    <p>Gender expression is the third-most layer of each core group, which can be modified by the fourth question in the questionnaire.</p>
    <p>Enabling a gender expression will, in return, enable a base block of gender identity: NOT a pronoun, or obviously expressed identity. Enabling agender identity, however, will enable non-binary in the same fashion as the gender identity questionnaire.</p>
    <p>Gender expression describes how the user (you) presents themselves in appearance, which corresponds with the core group.</p>
    <p><b>These can be mixed.</b> Mixing gender expressions represents a fluctuating appearance, similar to bigender identity.</p>
    <img src={Step4} title={language[3]} alt={language[3]} />

    <h3>Bigender identity</h3>
    <p>Bigender identity is the fourth-most layer of each core group.</p>
    <p>Bigender identity represents a mixed (or even fluctuating) gender identity that may not specifically correspond with each identity.</p>
    <p>It is enabled by selecting one or more options in the second question. It may be combined with a base option if the user has a constant identity along with a mixed or fluctuating identity.</p>
    <p>It is not required, but it is an option for those who are bigender.</p>
    <p>Bigender identities come last in the stereotypical pronoun set, but are denoted with a "+" (plus sign) beforehand to show mixing or fluctuation between those and base identities.</p>
    <img src={Step5} title={language[4]} alt={language[4]} />

    <h2>Pronoun options</h2>
    <p>Belonging to the third question in the questionnaire, pronoun options give the user (you) a verbose method of expressing if they use all other pronouns, a specific set of other pronouns (such as neopronouns), none, or both.</p>
    <p>Pronoun options have the back-most layer, which covers the entire brick in width and height. The layer is split into two sections: bottom-most for all other pronouns, top-most for neopronouns or a specific other set.</p>
    <img src={Step6} title={language[5]} alt={language[5]} />

    <p style="margin-top: 30px;">I hope this is a useful tool for you when discovering or sharing your gender identity.</p>
</div>

<style scoped>
    img {
        width: 100%;
        max-width: 400px;
        display: block;
        margin: 0 auto;
    }

    h1, h2, h3, i {
        text-align: center;
        font-family: "DM Serif Text", serif;
    }

    p {
        text-align: center;
        font-family: "Roboto Flex", sans-serif;
    }

    a {
        color: #797979;
    }

    div *:not(div h1) {
        margin: 0;
        padding: 0;
    }


    h1, h2, h3 {
        margin-top: 20px !important;
    }

    div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
</style>