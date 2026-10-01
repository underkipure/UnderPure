import React from "react";
import { Section, Field } from "./ReturnsFormPrimitives";

export default function ReturnsPolicyContentSection({ data, onUpdate }) {
  return (
    <Section title="Returns Policy Content">
      <Field label="Introduction Text (Supports line breaks)">
        <textarea
          rows={10}
          value={data.introText || ""}
          onChange={(e) => onUpdate({ introText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none font-sans"
        />
      </Field>
      <Field label="Bold Policy Text">
        <input
          type="text"
          value={data.boldPolicy1 || ""}
          onChange={(e) => onUpdate({ boldPolicy1: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
        />
      </Field>
      <Field label="Final Sale Text">
        <input
          type="text"
          value={data.finalSaleText || ""}
          onChange={(e) => onUpdate({ finalSaleText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
        />
      </Field>
      <Field label="Fee Policy Text (Supports line breaks)">
        <textarea
          rows={5}
          value={data.feeText || ""}
          onChange={(e) => onUpdate({ feeText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none font-sans"
        />
      </Field>
      <Field label="Outside Returns Systems Text">
        <input
          type="text"
          value={data.outsideReturnsText || ""}
          onChange={(e) => onUpdate({ outsideReturnsText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
        />
      </Field>
      <Field label="No Web Returns In-Store Text">
        <input
          type="text"
          value={data.noStoreReturnsText || ""}
          onChange={(e) => onUpdate({ noStoreReturnsText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
        />
      </Field>
    </Section>
  );
}
