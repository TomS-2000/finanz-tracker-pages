<template>
    <div class="max-w-5xl mx-auto pb-4 p-6 bg-white dark:bg-gray-900 rounded-4xl shadow-2xl space-y-8">

        <h1 class="sm:text-5xl text-3xl font-bold text-center">Willkommen beim Finanz-Tracker</h1>

        <div class="text-lg">
            <p>
                <strong>Reminder:</strong> Die Anwendung war etwas umfangreich, es könnte möglich sein das einzelne kleine Bugs vorhanden sind, die ich beim manuellen Testen nicht gefunden habe. 
                Ich bitte dies zu entschuldigen, falls welche vorkommen.
            </p>
            <br>
            <p class="text-lg">
                Diese Seite steht nur in Deutsch zur Verfügung, da eh niemand diese Seite liest, der kein Deutsch kann.
            </p>
        </div>
        

        <div class="space-y-6">
            <!-- Was ist der Finanz Tracker? -->
            <section>
                <h2 class="sm:text-4xl text-2xl font-semibold mb-4">Was ist der Finanz Tracker?</h2>
                <p class="sm:text-xl ml-4">
                    Der Finanz Tracker hilft dir dabei, deine Einnahmen und Ausgaben einfach und übersichtlich zu verwalten.
                    Egal ob Haushaltsbudget, monatliche Fixkosten oder spontane Ausgaben - mit diesem Tool behältst du jederzeit den Überblick über deine Finanzen.
                </p>
            </section>

            <!-- Deine Daten gehören dir -->
            <section>
                <h2 class="sm:text-4xl text-2xl font-semibold mb-4">Deine Daten gehören dir</h2>
                <p class="sm:text-xl ml-4">
                    Deine Daten werden nicht an Dritte weitergegeben. Du hast jederzeit die volle Kontrolle über deine Einträge.
                    Sie werden im lokalen Speicher (localStorage) deines Browsers gespeichert.
                </p>
            </section>

            <!-- Was kann der Finanz Tracker? -->
            <section>
                <h2 class="sm:text-4xl text-2xl font-semibold mb-4">Was kann der Finanz Tracker?</h2>
                <ul class="sm:text-xl ml-6 list-disc space-y-1">
                    <li><strong>Einnahmen & Ausgaben erfassen:</strong> Trage neue Buchungen mit Titel, Betrag, Datum und Beschreibung ein.</li>
                    <li><strong>Kategorien & Farben:</strong> Organisiere deine Buchungen mit frei wählbaren Kategorien und Farben.</li>
                    <li><strong>Wiederkehrende Zahlungen:</strong> Markiere regelmäßige Ausgaben wie Miete oder Abos.</li>
                    <li><strong>Benachrichtigungen:</strong> Lass dich an anstehende Zahlungen erinnern - individuell einstellbar.</li>
                    <li><strong>Dashboard-Charts:</strong> Behalte deine Finanzen im Blick mit übersichtlichen Diagrammen.</li>
                </ul>
            </section>
        </div>

        <!-- Alle Funktionen aus dem Exposé -->
        <section>
            <h1 class="sm:text-4xl text-2xl font-bold mb-4"> Alle Funktionen der Webseite </h1>
            <p class="sm:text-lg text-base">Der Inhalt stammt aus meinen Exposé und ist ihr nochmals auf der Webseite aufgegliedert.</p>
        </section>

        <!-- Dashboard -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Dashboard</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Übersicht mehrerer wichtiger Finanz-Elemente.</li>
                <li><strong>Liniendiagramm:</strong> Kontostand, Einnahmen und Ausgaben mit Filter (Monat, Jahr), Linien ein-/ausblendbar.</li>
                <li><strong>Kreisdiagramm:</strong> Einnahmen/Ausgaben nach Kategorie, filterbar nach Art, Monat und Jahr, Kategorien ein-/ausblenden.</li>
                <li><strong>Kreisdiagramm:</strong> Bei mehreren Kategorien für eine Transaktion wird der Betrag gleichmäßig auf die Kategorien aufgeteilt.</li>
                <li>Beide Diagramme in voller Größe auf separater Seite abrufbar.</li>
                <li><strong>Transaktions-Tab:</strong> zeigt letzte Einnahme, letzte Ausgabe, nächste geplante Transaktion und aktuellen Kontostand.</li>
                <li><strong>Benachrichtigungs-Tab:</strong> listet alle Benachrichtigungen mit Löschoption.</li>
                <li>Tabs verlinken auf die Detailansicht der jeweiligen Transaktion.</li>
            </ul>
        </section>

        <!-- Finanzen-Seite -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Finanzen-Seite</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Liste aller Transaktionen (Einnahmen & Ausgaben), neueste oben.</li>
                <li>Filter:
                    <ul class="list-disc list-inside ml-6 space-y-1">
                        <li>Nach Datum: Tag, Monat, Jahr</li>
                        <li>Nach Betrag: von – bis</li>
                        <li>Nach Bezeichnung, Kategorie, Quelle, Beschreibung</li>
                    </ul>
                </li>
                <li>Anzeigen: Bezeichnung, Kategorie, Icons, Datum, Betrag, Unterpreise.</li>
                <li>Ein-/Ausklappen nach Tag, Monat oder Jahr.</li>
                <li>Schnellbearbeitung der Transaktionen per Button.</li>
                <li>Neue Transaktionen per eingeblendetem Formular.</li>
                <li>Verlinkung zur Detailansicht mit Bearbeiten & Löschen.</li>
            </ul>
        </section>

        <!-- Finanz-Formular -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Finanz-Formular</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Erstellen & Bearbeiten von Transaktionen.</li>
                <li>Felder: Bezeichnung, Betrag(e), Quelle, Kategorie, Datum, wiederkehrend, Beschreibung, Benachrichtigung.</li>
                <li>Kategorien über Dropdown:
                    <ul class="list-disc list-inside ml-6 space-y-1">
                        <li>Farbe anpassbar</li>
                        <li>Hinzufügen/Löschen von Kategorien</li>
                    </ul>
                </li>
                <li>Wiederkehrende Transaktionen: täglich, wöchentlich, monatlich, jährlich.</li>
                <li>Benachrichtigungen mit Datum & Text.</li>
                <li>Mehrere Preisbestandteile möglich.</li>
                <li><strong>Beta:</strong> Kassenzettel scannen und Artikel automatisch erkennen.</li>
                <li>Validierung und Pflichtfeld-Prüfung.</li>
            </ul>
        </section>

        <!-- Detailseite -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Finanz-Detailseite</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Alle Details einer Transaktion.</li>
                <li>Erreichbar über ID-Verlinkung.</li>
                <li>Bearbeitungs- & Löschfunktion.</li>
            </ul>
        </section>

        <!-- Einstellungen -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Einstellungen</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Dark Mode / Light Mode</li>
                <li>Sprache: Deutsch / Englisch</li>
                <li>Manuelle Anpassung des Kontostands</li>
            </ul>
        </section>

        <!-- Navigation -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Navigation</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Fixe Navigationsleiste mit Schnellzugriff.</li>
                <li>Zusätzliche Optionen über ausklappbares Menü.</li>
            </ul>
        </section>

        <!-- Fehlerseite -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Fehlerseite</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Angezeigt bei ungültigen Links oder gelöschten Transaktionen.</li>
            </ul>
        </section>

        <!-- Sonstiges -->
        <section>
            <h2 class="text-2xl font-semibold mb-4">Sonstiges</h2>
            <ul class="list-disc list-inside space-y-2">
                <li>Responsive Design - auch für Smartphone einigermaßen geeignet.</li>
                <li>Speicherung der Daten im <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">localStorage</code>.</li>
                <li>Icons für viele Buttons und Aktionen.</li>
                <li>Animationen und Übergänge bei UI-Elementen.</li>
            </ul>
        </section>
    </div>

    <div class="h-4"></div>
    
</template>
