import React from "react";
import { Section, Field, Input, Toggle } from "./FormControls";

const SmsBannerEditor = ({ fd, update }) => {
  return (
    <Section title="SMS Banner">
      <Toggle
        enabled={fd.smsBannerEnabled}
        onChange={(v) => update({ smsBannerEnabled: v })}
        label={fd.smsBannerEnabled ? "Banner Visible" : "Banner Hidden"}
      />
      <Field label="Heading Text">
        <Input
          value={fd.smsBannerHeading}
          onChange={(v) => update({ smsBannerHeading: v })}
        />
      </Field>
      <Field label="Middle Paragraph (Subtext)">
        <textarea
          value={fd.smsBannerSubtext || ""}
          onChange={(e) => update({ smsBannerSubtext: e.target.value })}
          rows={3}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans leading-relaxed"
        />
      </Field>
      <Field label="Bottom Paragraph (Legal Disclaimer)">
        <textarea
          value={fd.smsBannerDisclaimer || ""}
          onChange={(e) => update({ smsBannerDisclaimer: e.target.value })}
          rows={4}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans leading-relaxed"
        />
      </Field>
    </Section>
  );
};

export default SmsBannerEditor;
