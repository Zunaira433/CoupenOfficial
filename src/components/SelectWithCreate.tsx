"use client";

type Option = { id: string; name: string };

export default function SelectWithCreate({
  name,
  label,
  options,
  loading,
  required,
  defaultValue,
  createHref,
  createLabel
}: {
  name: string;
  label: string;
  options: Option[];
  loading: boolean;
  required?: boolean;
  defaultValue?: string;
  createHref: string;
  createLabel: string;
}) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "__create_new__") {
      window.open(createHref, "_blank");
      e.target.value = defaultValue || "";
    }
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        disabled={loading}
        defaultValue={defaultValue || ""}
        onChange={handleChange}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
      >
        <option value="" disabled>{loading ? "Loading…" : `Select ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
        <option value="__create_new__">+ {createLabel}</option>
      </select>
      <p className="text-xs text-gray-400 mt-1">
        Picking &quot;+ {createLabel}&quot; opens a new tab — come back here and refresh once you&apos;ve created it.
      </p>
    </div>
  );
}