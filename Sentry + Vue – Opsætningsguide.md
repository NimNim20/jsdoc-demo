# Sentry + Vue – Opsætningsguide

## 1. Opret Sentry-konto

Gå til [sentry.io](https://sentry.io) og opret en gratis konto. Under oprettelsen:

1. Vælg **Create a new organization**
2. Klik **Create Project**
3. Vælg **Vue** som platform
4. Giv projektet et navn
5. Kopiér den **DSN** du får – du skal bruge den om lidt

---

## 2. Installer Sentry i dit Vue-projekt

```bash
npm install @sentry/vue
```

---

## 3. Opsæt Sentry i main.js

Åbn `src/main.js` og ret den til følgende. Bemærk at `App` skal importeres og at `createApp` skal kaldes med `App` – ikke `app`:

```javascript
import { createApp } from "vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
import App from "./App.vue";

const app = createApp(App);

Sentry.init({
    app,
    dsn: "din-dsn-her",
    sendDefaultPii: true,
    enableLogs: true
});

app.config.errorHandler = (err, instance, info) => {
    Sentry.captureException(err, {
        extra: {
            componentInfo: info
        }
    })
}

app.use(router);
app.mount("#app");
```

`errorHandler` fungerer som et sikkerhedsnet for alle fejl der opstår i Vue-komponenter. Når en fejl ikke bliver fanget lokalt, bobler den op til denne handler som sender den til Sentry med information om hvor i Vue's livscyklus fejlen opstod.

---

## 4. Introducér en bevidst fejl

Åbn `src/App.vue`. Husk at importere Sentry øverst i `<script setup>` – ellers kan du ikke bruge det i komponenten:

```vue
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import * as Sentry from '@sentry/vue'

function triggerError() {
  throw new Error("Dette er en testfejl fra Vue!")
}

function fetchUserData(userId) {
  console.log("fetchUserData kaldt med:", userId)
  if (!userId) {
    Sentry.captureMessage("fetchUserData kaldt uden userId", "warning")
    return null
  }
  // ... hent data
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <button @click="triggerError">Kast en fejl</button>
      <button @click="fetchUserData(null)">Fetch user data</button>
    </div>
  </header>

  <RouterView />
</template>
```

Bemærk at knappen kalder `fetchUserData(null)` og ikke bare `fetchUserData` – ellers sender Vue et click-event objekt som argument i stedet for `null`, og funktionen går aldrig ind i `if (!userId)` blokken.

---

## 5. Kør projektet og test

```bash
npm run dev
```

Klik på knapperne og gå derefter ind i dit Sentry-dashboard. Efter 10-30 sekunder skulle fejlene dukke op under **Issues**.

Klik på en fejl og se hvad Sentry viser:

- Stack trace der peger præcist på fejllinjen
- Tidspunkt
- Browser og OS
- Antal gange den er opstået

---

## 6. Vigtige ting at vide om Sentry

**Deduplication** – Sentry sender som standard kun den samme fejl én gang per session for ikke at spamme dit dashboard. Hvis du vil teste den samme fejl igen skal du enten:

- Åbne et nyt inkognito-vindue
- Eller ændre fejlbeskeden så Sentry opfatter det som en ny fejl

**Archive vs. Resolved** – i Sentry kan du håndtere issues på to måder:
- **Resolved** – brug dette når du har rettet fejlen i koden
- **Archive** – brug dette til fejl du aldrig vil se igen, fx fra gamle versioner. Vær forsigtig med **Archive forever** da den så aldrig vises igen selv hvis fejlen opstår igen

**Finde arkiverede issues** – gå til **Issues** og skift filteret øverst til **All Issues** for at se både aktive og arkiverede.

---

## 7. Opsæt email-alert

I Sentry-dashboardet:

1. Gå til **Alerts** → **Create Alert**
2. Vælg **Issues**
3. Sæt betingelsen til **A new issue is created**
4. Under actions vælg **Send an email to** og indtast din email
5. Klik **Save Rule**

Nu får du en email hver gang en ny fejl opstår i din applikation.

---

## Opsummering

Du har nu sat op:

- Automatisk fejlfangst via `errorHandler` der sender alle Vue-fejl til Sentry
- Manuel fejlrapportering med `captureException` og `captureMessage`
- Email-alerts når nye fejl opstår

Forskellen på de to måder at sende til Sentry er at `captureException` bruges til rigtige fejl der er kastet, mens `captureMessage` bruges når noget er galt men der ikke er en egentlig exception – fx ugyldige input eller uventede tilstande i applikationen.