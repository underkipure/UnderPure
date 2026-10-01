import React from "react";
import { Section, Field } from "./ReturnsFormPrimitives";

export default function ReturnsBoutiqueSection({ data, onUpdate }) {
  return (
    <Section title="Boutique Returns">
      <Field label="Section Heading">
        <input
          type="text"
          value={data.boutiqueReturnsHeading || ""}
          onChange={(e) => onUpdate({ boutiqueReturnsHeading: e.target.value })}
          placeholder="BOUTIQUE RETURNS"
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans uppercase tracking-wider"
        />
      </Field>
      <Field label="Boutique Returns Text (Supports line breaks)">
        <textarea
          rows={4}
          value={data.boutiqueReturnsText || ""}
          onChange={(e) => onUpdate({ boutiqueReturnsText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none font-sans"
        />
      </Field>
    </Section>
  );
}
