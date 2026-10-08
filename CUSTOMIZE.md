# Dopasuj dashboard do swojego projektu

Wszystkie podstawowe ustawienia są w **`dashboard.config.js`**. Edytujesz plik, zapisujesz i odświeżasz stronę. Nadal wystarczą HTML, CSS i JavaScript — bez instalowania frameworka i bez budowania aplikacji.

## 1. Własna marka i profil

W obiekcie `brand` zmień `name`, `wordmark`, `workspace`, `title` i `exportPrefix`. Przykład:

```js
brand: {
  name: 'North',
  wordmark: 'north',
  workspace: 'North Studio',
  workspaceDescription: 'My business workspace',
  title: 'Project Analytics',
  description: 'Analytics for North Studio.',
  footer: 'Your business, in perspective.',
  exportPrefix: 'north',
},
```

Nazwa pojawi się w logo, tytule karty, profilu, stopce i eksportowanych raportach. Dane użytkownika ustawiasz w `profile`. Logo i favicon automatycznie korzystają z pierwszej litery marki.

## 2. Kolory i waluta

`theme.accent` ustawia domyślny akcent. `theme.palettes` określa dostępne kolory w Settings. Podawaj kolory jako sześciocyfrowy HEX, np. `#6684ad`. Neutralne kolory tła i obramowań znajdziesz na początku `styles.css`.

Zmień `storageKey` na własną nazwę, np. `north-accent-v1`. Wybór koloru zapisany przez użytkownika ma pierwszeństwo przed kolorem domyślnym. Nowy klucz pozwala rozpocząć z nowym motywem.

Polska waluta i format liczb:

```js
format: {
  locale: 'pl-PL',
  currency: 'PLN',
  currentYear: 2027,
  previousYear: 2026,
},
```

To zmienia format kwot, osi wykresu, tabel i walutę w CSV. Teksty interfejsu pozostają w wybranym przez Ciebie języku; formatowanie liczb ich nie tłumaczy.

## 3. Dane projektu

- `periods`: okresy, przychody, liczba klientów i zamówień, oszczędności oraz daty.
- `customers`: rekordy klientów i transakcji; opcjonalne `payment` zastępuje domyślną metodę płatności.
- `geography`: liczba krajów, lista regionów z kodami ISO i ich procentowe udziały.
- `activity`: dni, godziny, strefa czasowa i macierze liczby zamówień.
- `spending`: nazwy trzech kategorii, procenty postępu i zmiana oszczędności.
- `reports`: tytuły, opisy i daty raportów. `type: 'monthly'` eksportuje podsumowanie, a `type: 'customers'` listę klientów.

Teksty stron, metryk, paneli i bocznego komunikatu ustawisz przez `views` oraz `copy`. Pozostałe etykiety możesz zmieniać bezpośrednio w `index.html` i `app.js`.

### Flagi krajów

W regionach używaj `code`, np. `{ code: 'PL', name: 'Poland', share: 20 }`. Wielka Brytania ma kod `GB`. Flagi są pobierane jako obrazki z [FlagCDN](https://flagpedia.net/download/api), bez klucza API. `flagBaseUrl` zmienia źródło obrazków.

Gdy CDN nie odpowie, aplikacja próbuje lokalnej kopii z `assets/flags/`. Kopie US, GB, DE, JP i PL są dołączone. Dla kolejnego kraju dodaj plik `kod.png` oraz małymi literami jego kod do `localFlags`. Jeśli flaga nie jest dostępna z żadnego źródła, pojawi się dyskretny kod kraju, bez uszkodzonego obrazka.

`localFlagPath` określa katalog kopii. Flagi są materiałami z Flagpedia.net; informacja o źródle znajduje się w README. Szerokość paska odpowiada procentowi klientów, a wszystkie regiony mają ten sam kolor, żeby ułatwić porównanie.

### Rzeczywiste wartości na wykresie

Domyślnie aplikacja rozdziela przychód danego okresu według `revenueWeights`; to dane demonstracyjne. Aby wyświetlić własne liczby, dodaj do okresu:

```js
chartLabels: ['Week 1', 'Week 2', 'Week 3'],
chartPrefix: '',
chartDescription: 'Revenue by week',
chartCurrent: [1200, 1800, 2400],
chartPrevious: [1000, 1500, 1900],
```

Każda tablica powinna mieć tyle elementów co `chartLabels`. Wartości są nieujemnymi liczbami. Suma `chartCurrent` staje się przychodem w metryce i w CSV, więc wykres pozostaje zgodny z podsumowaniem. Pole `changes` zawiera własne procentowe zmiany metryk.

W `activity.current` każdy wiersz odpowiada godzinie, a każda kolumna dniowi. `activity.previous` przyjmuje macierz o takim samym rozmiarze. Jeśli zostawisz `null`, poprzedni tydzień jest symulowany.

## 4. Ukrywanie sekcji

```js
sections: {
  revenue: true,
  spending: false,
  geography: true,
  activity: true,
  transactions: false,
},
```

Wyłączone panele znikają z dashboardu. Wyłączenie transakcji na Overview nie wyłącza katalogu klientów.

Po podłączeniu własnych danych możesz ustawić `demo: false`, żeby ukryć oznaczenia przykładowych danych. Ten przełącznik nie dodaje backendu, logowania ani połączenia z API.

## 5. Wykorzystanie i publikacja

Kod dashboardu jest darmowy do używania, kopiowania, edycji, dostosowywania i rozpowszechniania w dowolnym celu. Nie ma ograniczenia do portfolio, opłaty ani obowiązku podpisu. Nie ma osobnego pliku licencji; informacja „Free to use, modify and redistribute” znajduje się w README. Obrazki flag zachowują warunki swojego źródła, wskazanego w README.

Do działającej strony potrzebujesz `index.html`, `styles.css`, `dashboard.config.js` i `app.js`. Folder `.tools` służy do lokalnego podglądu i testowania; nie jest wymagany do działania dashboardu. Instrukcja publikacji na GitHub Pages znajduje się w `README.md`.
