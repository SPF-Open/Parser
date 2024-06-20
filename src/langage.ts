export enum Lang {
  FR = "FR",
  NL = "NL",
  DE = "DE",
}

export const lang: Record<Lang, any> = {
  [Lang.FR]: {
    short: "FR",
    locale: "fr-FR",
    extended: "Français",
    MCQ: "QCM",
    toString: () => "Français",
  },
  [Lang.NL]: {
    short: "NL",
    locale: "nl-BE",
    extended: "Nederlands",
    MCQ: "MKV",
    toString: () => "Nederlands",
  },
  [Lang.DE]: {
    short: "DE",
    locale: "de-DE",
    extended: "Deutsch",
    MCQ: "MCF",
    toString: () => "Deutsch",
  },
}
