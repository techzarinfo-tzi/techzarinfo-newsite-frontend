"use client";

import GlassSelect, { fold } from "@/components/common/GlassSelect";

// Frosted-glass country picker (the Contact Us form's Country field, and the careers form's phone
// code). Searchable by name, dialling code or ISO code. The dropdown itself is the shared
// GlassSelect; this only supplies the country rows (flag, name, dialling code).
//
// `compact` shows just the flag and dialling code in the field, for a phone number's code picker.

const getKey = (c) => c.code;
const getLabel = (c) => c.name;
const getTitle = (c) => `${c.name} (${c.dial})`;

const filter = (c, q) => {
  const code = q.replace(/^\+/, "");
  return fold(c.name).includes(q) || c.dial.slice(1).startsWith(code) || c.code.toLowerCase() === q;
};

const Flag = ({ country }) =>
  country.Flag ? <country.Flag className="cs-flag" aria-hidden="true" /> : <span className="cs-flag" aria-hidden="true" />;

const renderOption = (c) => (
  <>
    <Flag country={c} />
    <span className="cs-name">{c.name}</span>
    <span className="cs-dial">{c.dial}</span>
  </>
);

const renderFull = renderOption;

const renderCompact = (c) => (
  <>
    <Flag country={c} />
    <span className="cs-dial cs-dial-compact">{c.dial}</span>
  </>
);

export default function CountrySelect({
  id,
  name,
  countries,
  value,
  onChange,
  required,
  disabled,
  compact = false,
  triggerClassName,
  placeholder = "Country",
}) {
  return (
    <GlassSelect
      id={id}
      name={name}
      options={countries}
      value={value}
      onChange={onChange}
      getKey={getKey}
      getLabel={getLabel}
      getTitle={getTitle}
      renderValue={compact ? renderCompact : renderFull}
      renderOption={renderOption}
      filter={filter}
      placeholder={placeholder}
      invalidPlaceholder="Please select your country"
      searchLabel="Search country or dialling code"
      searchPlaceholder="Search country or code"
      listLabel="Countries"
      emptyText="No matching countries"
      loadingText="Loading countries…"
      triggerClassName={triggerClassName}
      required={required}
      disabled={disabled}
    />
  );
}
