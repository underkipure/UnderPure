import React from "react";
import { Section, Field } from "./ReturnsFormPrimitives";

export default function ReturnsEuWithdrawalSection({ data, onUpdate }) {
  return (
    <Section title="EU/EFTA Right of Withdrawal">
      <Field label="Section Heading">
        <input
          type="text"
          value={data.euWithdrawalHeading || ""}
          onChange={(e) => onUpdate({ euWithdrawalHeading: e.target.value })}
          placeholder="EU/EFTA RIGHT OF WITHDRAWAL"
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans uppercase tracking-wider"
        />
      </Field>
      <Field label="Withdrawal Policy Text (Supports line breaks)">
        <textarea
          rows={10}
          value={data.euWithdrawalText || ""}
          onChange={(e) => onUpdate({ euWithdrawalText: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none font-sans"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Field label="Withdrawal Action Link Text">
          <input
            type="text"
            value={data.withdrawalLinkText || ""}
            onChange={(e) => onUpdate({ withdrawalLinkText: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
          />
        </Field>
        <Field label="Withdrawal Action Link URL">
          <input
            type="text"
            value={data.withdrawalLinkUrl || ""}
            onChange={(e) => onUpdate({ withdrawalLinkUrl: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
          />
        </Field>
      </div>

      <div className="border-t border-black/10 pt-4 mt-4 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Model Withdrawal Form Paragraph & Link
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Paragraph Prefix Text">
            <input
              type="text"
              value={data.withdrawalFormNotePrefix ?? ""}
              onChange={(e) => onUpdate({ withdrawalFormNotePrefix: e.target.value })}
              placeholder="EU Model Withdrawal Form can be accessed at this"
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
            />
          </Field>
          <Field label="Form Link Text">
            <input
              type="text"
              value={data.withdrawalFormLinkText ?? ""}
              onChange={(e) => onUpdate({ withdrawalFormLinkText: e.target.value })}
              placeholder="link"
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
            />
          </Field>
          <Field label="Form Link URL">
            <input
              type="text"
              value={data.withdrawalFormLink ?? ""}
              onChange={(e) => onUpdate({ withdrawalFormLink: e.target.value })}
              placeholder="https://... or #"
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
            />
          </Field>
          <Field label="Paragraph Suffix Text">
            <input
              type="text"
              value={data.withdrawalFormNoteSuffix ?? ""}
              onChange={(e) => onUpdate({ withdrawalFormNoteSuffix: e.target.value })}
              placeholder="and can be completed and returned to us only if you wish to withdraw from the contract."
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
            />
          </Field>
        </div>
      </div>
    </Section>
  );
}
