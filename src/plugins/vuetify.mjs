// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { pl, zhHant } from "vuetify/locale";

import "vuetify/styles";

const vuetify = createVuetify({
  locale: {
    locale: "zhHant",
    fallback: "sv",
    messages: { zhHant, pl },
  },
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: localStorage.getItem("theme") || "light",
  },
  defaults: {
    VCard: {
      variant: "tonal",
    },
  },
});

export default vuetify;
