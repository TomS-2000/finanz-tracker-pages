## Einleitung

Dieses Projekt entstand im Rahmen der Modulleistung Clientseitige Webanwendungen.
Der Finanz-Tracker bietet eine einfache Möglichkeit, Einnahmen und Ausgaben zu erfassen, zu verwalten und übersichtlich darzustellen. Ziel war es, Webtechnologien einzusetzen, um eine interaktive und nutzerfreundliche Anwendung zu entwickeln, die grundlegende Funktionen wie Dateneingabe, Filterung, Visualisierung und Übersichten unterstützt.

Zentrale Voraussetzung für die Modulleistung war die Entwicklung eines Vue-Projekts, das vollständig clientseitig läuft und als Single-Page-Applikation (SPA) umgesetzt ist.

## Wichtiger Hinweis
Diese Version des Finanz-Trackers enthält bereits Beispiel­daten zur Veranschaulichung. Wer diese nicht nutzen möchte, kann sie derzeit in der Datei src/state.ts löschen oder anpassen.

#### Was müsste verändert werden für eine Anwendung ohne Beispieldaten in state.ts?
- Zeile 44 - totalAmount : 0
- Zeile 45 - nextFinanceId : 1
- Zeile 53 - categories : []
- Zeile 62 - isVisibleDayList : []
- Zeile 74 - isVisibleMonthList: []
- Zeile 81 - isVisibleYearList: []
- Zeile 86 - finances: []


## Inhalt
Der Finanz-Tracker bietet eine Vielzahl an Funktionen zur Verwaltung und Visualisierung persönlicher Finanzen.  

### Dashboard  
- Übersicht mit Diagrammen (Linien- und Kreisdiagramm) zu Einnahmen, Ausgaben und Kontostand  
- Filter nach Monat und Jahr sowie Ein-/Ausblenden einzelner Datenreihen  
- Tabs für Transaktionen (aktuelle Einnahmen, Ausgaben, nächste Transaktionen) und Benachrichtigungen  
- Verlinkungen zu Detailseiten und Vollbild-Ansichten der Diagramme  

### Finanzen-Seite  
- Liste aller Einnahmen und Ausgaben, sortiert nach neuesten Transaktionen  
- Umfangreiche Filtermöglichkeiten (Datum, Betrag, Kategorien, Suchfeld)  
- Ein- und Ausklappen nach Tag, Monat oder Jahr  
- Schnelles Bearbeiten und Anlegen neuer Transaktionen über ein Formular  
- Verlinkung jeder Transaktion zur Detailseite mit weiteren Infos und Löschoption  

### Finanz-Formular  
- Formular zum Anlegen und Bearbeiten von Transaktionen  
- Unterstützung für Kategorien mit Farbanpassung, Erstellung und Löschung  
- Wiederkehrende Finanzen (täglich, wöchentlich, monatlich, jährlich)  
- Benachrichtigungen mit Datum und individuellem Text  
- Mehrere Preise pro Eintrag möglich  
- *(Beta)* Kassenbon-Erkennung mit Artikelimport (funktioniert aktuell (einigermaßen) nur für bestimmte Kassenbons)  
- Validierung der wichtigsten Felder  

### Finanz-Detail-Seite  
- Detailansicht einer Transaktion mit Bearbeitungs- und Löschfunktion  

### Einstellungen  
- Theme-Anpassung (Dark/Light Mode)  
- Sprache (Deutsch/Englisch)  
- Anpassung des aktuellen Kontostands  

### Navigation (Sidebar/Menüleiste)  
- Feste und ausklappbare Navigationsleiste  
- Zugriff auf alle Hauptseiten der Anwendung  

### Sonstiges  
- „Not Found“-Seite für ungültige Routen oder gelöschte Transaktionen  
- Responsive Design (auch mobil nutzbar)  
- Speicherung aller Daten im `localStorage`  
- Icons und Animationen für ein modernes UI  


## Projekt Setup

### Yarn
```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```


## Installierte Bibliotheken / Frameworks

Tailwind CSS:
```sh
yarn add tailwindcss @tailwindcss/vite
```
vue-router:
```sh
yarn add vue-router@4 
```
TesseractJS:
```sh
yarn add tesseract.js
```
Lucide (Icons):
```sh
yarn add lucide-vue-next
```
Pinia:
```sh
yarn add pinia
```
Plugin für automatischen localStorage Sync:
```sh
yarn add pinia-plugin-persistedstate
```
vue-i18n (Translations):
```sh
yarn add vue-i18n
```
Chart.js
```sh
yarn add vue-chartjs chart.js
```

Alle:
```sh
yarn add tailwindcss @tailwindcss/vite vue-router@4 tesseract.js lucide-vue-next pinia pinia-plugin-persistedstate vue-i18n vue-chartjs chart.js
```


