import React from "react";
import { Section, Field, Input } from "./FormControls";

const HeaderHelpEditor = ({ fd, update }) => {
  return (
    <Section title="Header Help Dropdown">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Chat Button Text">
          <Input
            value={fd.headerHelp?.chatText || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), chatText: v },
              })
            }
            placeholder="e.g. Let's chat!"
          />
        </Field>
        <Field label="Call / Text Phone Number">
          <Input
            value={fd.headerHelp?.phone || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), phone: v },
              })
            }
            placeholder="e.g. +923228483029"
          />
        </Field>
        <Field label="Contact Email Address">
          <Input
            value={fd.headerHelp?.email || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), email: v },
              })
            }
            placeholder="e.g. underpure18@gmail.com"
          />
        </Field>
        <Field label="Returns Link Text">
          <Input
            value={fd.headerHelp?.returnsText || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), returnsText: v },
              })
            }
            placeholder="e.g. Returns center"
          />
        </Field>
        <Field label="Returns Link URL">
          <Input
            value={fd.headerHelp?.returnsLink || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), returnsLink: v },
              })
            }
            placeholder="e.g. /returns"
          />
        </Field>
        <Field label="FAQ / Help Link Text">
          <Input
            value={fd.headerHelp?.faqText || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), faqText: v },
              })
            }
            placeholder="e.g. FAQ"
          />
        </Field>
        <Field label="FAQ / Help Link URL">
          <Input
            value={fd.headerHelp?.faqLink || ""}
            onChange={(v) =>
              update({
                headerHelp: { ...(fd.headerHelp || {}), faqLink: v },
              })
            }
            placeholder="e.g. /faqs"
          />
        </Field>
      </div>
    </Section>
  );
};

export default HeaderHelpEditor;
