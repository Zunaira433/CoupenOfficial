"use client";
import { useState } from "react";

const PRESETS = ["Buy Now", "Visit Site", "Custom"];

export default function CtaLinkField({
  linkName,
  labelName,
  title,
  defaultLink = "",
  defaultLabel = ""
}: {
  linkName: string;
  labelName: string;
  title: string;
  defaultLink?: string;
  defaultLabel?: string;
}) {
  const isPreset = PRESETS.slice(0, 2).includes(defaultLabel);
  const [preset, setPreset] = useState(defaultLabel && !isPreset ? "Custom" : defaultLabel || "Buy Now");
  const [customLabel, setCustomLabel] = useState(!isPreset ? defaultLabel : "");

  const finalLabel = preset === "Custom" ? customLabel : preset;

  return (
    <div className="space-y-2 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>

      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Link URL</label>
        <input
          name={linkName}
          type="url"
          defaultValue={defaultLink}
          placeholder="https://example.com/?ref=yourid"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Button Label</label>
        <select
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary mb-2"
        >
          {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {preset === "Custom" && (
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Enter custom button text"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        )}

        <input type="hidden" name={labelName} value={finalLabel} />
      </div>
    </div>
  );
}