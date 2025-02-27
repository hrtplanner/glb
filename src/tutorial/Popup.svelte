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
    <h1>Gender Lego Bricks Organization</h1>
    <p>I'm Allie, the developer of GLB. <a href="/#FLER" target="_blank">This is my brick</a>.</p>
    <p>GLB shows your gender identity as "bricks" that display different aspects of who you are.</p>
    <img src={Step1} title={language[0]} alt={language[0]} />
    <p>This example brick shows an agender identity that prefers agender pronouns, accepts any pronouns, and sometimes feels more masculine.</p>
    <i>Don't worry, though, it's simpler than it looks.</i>

    <h2>The Four Core Groups</h2>
    <p>Bricks are organized into four main groups: <i>masculine, feminine, non-binary and agender</i>.</p>
    <p>Masculine means male-adjacent, feminine means female-adjacent, non-binary means outside these two, and agender means "none of these."</p>

    <h3>Gender Identity (Base Layer)</h3>
    <p>The bottom layer shows your basic gender identity. This comes from your answers in the questionnaires.</p>
    <p>Choosing agender will automatically include non-binary too.</p>
    <p>This base layer also sets up your default pronouns.</p>
    <img src={Step2} title={language[1]} alt={language[1]} />

    <h3>Pronoun Order</h3>
    <p>The second layer shows which pronouns you prefer most.</p>
    <p>The order matters! For example, "they/he/she" means you prefer "they" first, "he" second, and "she" third.</p>
    <p>The order comes from how you arrange your gender identities in the first question.</p>
    <p>"Any" or "other" pronouns always go last if selected.</p>
    <img src={Step3} title={language[2]} alt={language[2]} />

    <h3>Gender Expression</h3>
    <p>The third layer shows how you present yourself to others.</p>
    <p>This comes from the fourth question in the survey.</p>
    <p>Your expression choices activate matching identity blocks in the base layer.</p>
    <p><b>You can mix expressions</b>: Mixed expressions show that your appearance has multiple properties of either, varies or fluctuates (similar to bigender identity).</p>
    <img src={Step4} title={language[3]} alt={language[3]} />

    <h3>Bigender Identity</h3>
    <p>The fourth layer shows if you have mixed or fluid gender identities.</p>
    <p>This comes from your answers to the second question.</p>
    <p>You can combine this with your base identity if you have both constant and fluid aspects.</p>
    <p>Bigender identities appear in your pronoun set with a "+" sign (like "she/they/+he").</p>
    <img src={Step5} title={language[4]} alt={language[4]} />

    <h2>Pronoun Options</h2>
    <p>The back layer (from the third question) shows if you use all pronouns, specific pronouns like neopronouns, or both.</p>
    <p>This layer covers the entire brick and has two parts: bottom section for all pronouns, top section for specific others.</p>
    <img src={Step6} title={language[5]} alt={language[5]} />

    <p style="margin: 30px;">I hope this helps you discover and share your gender identity!</p>
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