# Welcome to our children check-in app ! 👋

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

   For IOS

   ```bash
   npm run ios
   ```

   ## Test-user

   Dere kan finne test bruker info inne på kunngjøringer på scrumwise, eller opprett en ny bruker i firebase

   ## GitHub pull rutiner

   skal dere måtte lage en ny branch kjør:

   ```bash
   git checkout "deres branch navn"
   ```

   ```bash
   git remote add upstream https://github.com/petteraas52-ux/Surat.git
   ```

   Deretter hver gang dere skal hente nyeste endringer

   ```bash
   git checkout "deres branch navn"
   ```

   ```bash
   git fetch upstream
   ```

   ```bash
   git merge upstream/main
   ```

   ## GitHub merge rutiner

   1. Gå inn på stage changes tabben på venstre siden av VSCODE

   2. Trykk på + tegnet ved "Changes". Når denne blir hovret over skal det stå stage all changes

   3. Deretter commit deres endringer til branchen deres

   4. Gå inn på github, på start siden av våres prosjekt vil dere nå se en create merge request knapp som er grønn

   5. Gå inn på den grønne knappet, skriv en kommentar på hva requesten er og opprett den, Da er alt i boks! ikke godkjenn requesten selv
