import * as Flags from "country-flag-icons/react/3x2";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

// Every country/territory libphonenumber-js knows (ISO 3166 codes) with its international calling
// code and flag, sorted by English name. Imported lazily by ContactUsSection: the full flag set is
// too heavy to ship with every page.
const names = new Intl.DisplayNames(["en"], { type: "region" });

export const countries = getCountries()
  .map((code) => ({
    code,
    name: names.of(code) || code,
    dial: `+${getCountryCallingCode(code)}`,
    Flag: Flags[code],
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "en"));
