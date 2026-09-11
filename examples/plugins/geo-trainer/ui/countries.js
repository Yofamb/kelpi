/**
 * A small curated set of GeoGuessr "tells" — the visual cues (driving side, road markings,
 * poles/bollards, plates, terrain) that identify a country from street-level imagery.
 *
 * Written from scratch for this example: no text is copied from Plonkit, the GeoGuessr wiki,
 * or any other source — these facts are common knowledge among the game's community, but the
 * expression here is original, to stay clear of that wiki's own copyright.
 *
 * `region` groups countries the game deliberately confuses with each other (e.g. Kenya /
 * Tanzania / Uganda), so multiple-choice distractors are drawn from genuinely similar-looking
 * neighbors rather than random unrelated countries — that's what makes this a *trainer* rather
 * than trivia.
 */
export const COUNTRIES = [
    { code: 'NO', name: 'Norway', region: 'nordic', tell: 'Drives on the right; many rural roads have no painted centerline at all, relying on white reflector posts instead.' },
    { code: 'SE', name: 'Sweden', region: 'nordic', tell: 'Drives on the right; a distinctive white-on-blue road sign font, and frequent moose-crossing warning signs.' },
    { code: 'FI', name: 'Finland', region: 'nordic', tell: "Drives on the right; bus stops use a yellow diamond sign, unlike neighboring Sweden's blue rectangle." },
    { code: 'DK', name: 'Denmark', region: 'nordic', tell: 'Drives on the right; flat farmland, red-brick houses, and a dedicated cycle path beside nearly every road.' },
    { code: 'IS', name: 'Iceland', region: 'nordic', tell: 'Drives on the right; single-lane roads, treeless volcanic terrain, and yellow poles marking road edges for snow season.' },

    { code: 'EE', name: 'Estonia', region: 'baltic', tell: 'Drives on the right; EU blue-and-yellow plates, birch forest, and Soviet-era apartment blocks outside the capital.' },
    { code: 'LV', name: 'Latvia', region: 'baltic', tell: "Drives on the right; similar coverage-car look to its neighbors — watch for Latvian-language shop signage." },
    { code: 'LT', name: 'Lithuania', region: 'baltic', tell: 'Drives on the right; EU plates, flat pine forest, and roadside Catholic shrines.' },

    { code: 'KE', name: 'Kenya', region: 'east-africa', tell: 'Drives on the left; red laterite dirt roads, matatu vans with painted slogans, and hand-painted speed bump warnings.' },
    { code: 'TZ', name: 'Tanzania', region: 'east-africa', tell: "Drives on the left; terrain like Kenya's — look for Swahili shop names and dala-dala minibuses." },
    { code: 'UG', name: 'Uganda', region: 'east-africa', tell: 'Drives on the left; boda-boda motorbike taxis everywhere, and the same deep-red dirt road color as its neighbors.' },
    { code: 'ET', name: 'Ethiopia', region: 'east-africa', tell: "Drives on the RIGHT, unlike its neighbors; blue-and-white Bajaj three-wheelers and Ge'ez script on signage." },

    { code: 'FR', name: 'France', region: 'west-europe', tell: 'Drives on the right; white-and-red departmental road markers, and plane trees lining rural routes.' },
    { code: 'DE', name: 'Germany', region: 'west-europe', tell: 'Drives on the right; yellow town-boundary signs, and immaculately maintained asphalt with visible patch repairs.' },
    { code: 'NL', name: 'Netherlands', region: 'west-europe', tell: 'Drives on the right; separated red-asphalt cycle paths everywhere, and dead-flat, canal-lined farmland.' },
    { code: 'BE', name: 'Belgium', region: 'west-europe', tell: 'Drives on the right; rural roads are still cobblestone in places, unlike neighboring France.' },

    { code: 'ES', name: 'Spain', region: 'iberia', tell: 'Drives on the right; white guardrails, brown highway exit signage, and dry scrubland in the interior.' },
    { code: 'PT', name: 'Portugal', region: 'iberia', tell: "Drives on the right; terrain like Spain's, but with distinctive diamond-shaped yellow warning signs." },

    { code: 'BR', name: 'Brazil', region: 'latin-america', tell: 'Drives on the right; Mercosur white plates (or older yellow ones), and favela rooftops on hillsides near cities.' },
    { code: 'AR', name: 'Argentina', region: 'latin-america', tell: 'Drives on the right; wide Pampas grassland, blue-and-white road signage, and eucalyptus windbreaks around farms.' },
    { code: 'CL', name: 'Chile', region: 'latin-america', tell: 'Drives on the right; a narrow strip between Andes and Pacific, visible in the landscape almost everywhere.' },
    { code: 'PE', name: 'Peru', region: 'latin-america', tell: 'Drives on the right; three-wheeled mototaxis, and dramatic elevation change from coastal desert to Andean towns.' },
    { code: 'CO', name: 'Colombia', region: 'latin-america', tell: 'Drives on the right; yellow speed-bump warning signs, and motorcycles dominate rural traffic.' },

    { code: 'IN', name: 'India', region: 'south-asia', tell: 'Drives on the left; yellow-and-black striped km markers, and dense traffic mixing rickshaws, trucks and cattle.' },
    { code: 'BD', name: 'Bangladesh', region: 'south-asia', tell: "Drives on the left; flatter than India, with green rice paddies and standing water visible almost everywhere." },
    { code: 'LK', name: 'Sri Lanka', region: 'south-asia', tell: 'Drives on the left; tropical palm-lined roads and small tuk-tuks with yellow plates.' },

    { code: 'TH', name: 'Thailand', region: 'se-asia', tell: 'Drives on the left; yellow plates on private cars, and thick bundles of power/telecom cable on wooden poles.' },
    { code: 'VN', name: 'Vietnam', region: 'se-asia', tell: "Drives on the right; dense clusters of scooters at every intersection, and narrow, tall 'tube houses' lining roads." },
    { code: 'PH', name: 'Philippines', region: 'se-asia', tell: 'Drives on the right; colorful jeepneys, and utility poles strung with dense tangles of cabling.' },
    { code: 'ID', name: 'Indonesia', region: 'se-asia', tell: 'Drives on the left; motorbikes dominate traffic, and warung roadside food stalls with corrugated-metal roofs.' },

    { code: 'AU', name: 'Australia', region: 'oceania', tell: 'Drives on the left; wide, flat, sun-bleached roads, and yellow diamond warning signs for kangaroos.' },
    { code: 'NZ', name: 'New Zealand', region: 'oceania', tell: 'Drives on the left; narrow winding roads, dense green hills, and single-lane bridges shared with rail or oncoming traffic.' },

    { code: 'US', name: 'United States', region: 'north-america', tell: 'Drives on the right; white dashed centerlines are common, and mailboxes on posts line rural roads.' },
    { code: 'CA', name: 'Canada', region: 'north-america', tell: 'Drives on the right; bilingual French/English signage in Quebec, and wide gravel shoulders elsewhere.' },

    { code: 'JP', name: 'Japan', region: 'east-asia', tell: 'Drives on the left; yellow-and-black edge markers, narrow roads with no shoulder, and blue hexagonal signage.' },
    { code: 'KR', name: 'South Korea', region: 'east-asia', tell: 'Drives on the right; blue signage shaped like Japan’s but in Hangul, and dense apartment towers visible from rural roads.' },
    { code: 'TW', name: 'Taiwan', region: 'east-asia', tell: 'Drives on the right; scooters parked in dense rows, and traditional (not simplified) Chinese characters on signage.' },

    { code: 'TR', name: 'Turkey', region: 'middle-east', tell: 'Drives on the right; white bollards with red reflective tops, and a mix of Mediterranean and Central Asian terrain.' },
    { code: 'JO', name: 'Jordan', region: 'middle-east', tell: 'Drives on the right; pale desert terrain, Arabic-first signage, and white rectangular km-marker posts.' }
];

export const flagEmoji = (code) =>
    String.fromCodePoint(...[...code.toUpperCase()].map((letter) => 127397 + letter.charCodeAt(0)));

/**
 * Full-colour flag artwork, bundled same-origin under `ui/flags/` (from the MIT-licensed
 * https://github.com/lipis/flag-icons — see `ui/flags/LICENSE-flag-icons.txt`) rather than
 * fetched from a CDN at runtime: the daemon serves every plugin view under a CSP of
 * `img-src 'self' data:; connect-src 'none'` (`packages/daemon/src/plugins/http.ts`), so a
 * cross-origin `<img src>` or `fetch` to an external host is refused outright, by design.
 */
export const flagSrc = (code) => `flags/${code.toLowerCase()}.svg`;
