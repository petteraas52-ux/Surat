export const errorMessages = {

    general: {
        NETWORK: "Det oppstod en feil med tilkoblingen. Sjekk nettet og prøv igjen.",
        SERVER: "En feil oppstod på serveren. Prøv igjen.",
        UNKNOWN: "Noe gikk galt. Prøv igjen.",
    },

    auth: {
        INVALID_CREDENTIALS: "Feil e-post eller passord.",
        SESSION_EXPIRED: "Du brukte for lang tid på innloggingen. Logg inn på nytt.",
    },

    children: {
        CREATE_FAILED: "Kunne ikke opprette barn. Prøv igjen",
        UPDATE_FAILED: "Kunne ikke oppdatere informasjon om barnet. Prøv igjen.",
        LOAD_FAILED: "Kunne ikke hente barnelisten.",
    },

    parents: {
        CREATE_FAILED: "Kunne ikke opprette foresatt.",
        UPDATE_FAILED: "Kunne ikke oppdatere foresatt.",
        LOAD_FAILED: "Kunne ikke hente foresatt.",
    },

    events: {
        CREATE_FAILED: "Kunne ikke opprette arrangement.",
        LOAD_FAILED: "Kunne ikke hente arrangementer.",
    },

    image: {
        UPLOAD_FAILED: "Kunne ikke laste opp bilde. Prøv igjen",
        LOAD_FAILED: "Kunne ikke laste bildet.",
    },

    checkInOut: {
        ALREADY_CHECKED_IN: "Barnet er allerede sjekket inn.",
        NOT_CHECKED_IN: "Barnet er ikke sjekket inn,",
        NO_CHILD_SELECTED: "Velg et barn før du sjekker inn eller ut.",
    },

    absence: {
        CREATE_FAILED: "Kunne ikke registrere fravær.",
        LOAD_FAILED: "Kunne ikke hente fraværsoversikten.",
    },

    calendar: {
        LOAD_FAILED: "Kunne ikke hente kalenderen.",
    },

    guestLink: {
        NO_CHILD: "Ingen barn valgt.",
        MISSING_FIELDS: "Fyll inn navn og telefonnummer.",
        CREATE_FAILED: "Kunne ikke sende gjestelenken. Prøv igjen.",
    },

} as const;