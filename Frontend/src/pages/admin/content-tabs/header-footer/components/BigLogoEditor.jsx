import React from "react";
import { Section, Field, Input, Toggle } from "./FormControls";

const BigLogoEditor = ({ fd, update }) => {
  return (
    <Section title="Large Logo / Brand Mark">
      <Toggle
        enabled={fd.bigLogoEnabled}
        onChange={(v) => update({ bigLogoEnabled: v })}
        label={fd.bigLogoEnabled ? "Big Logo Visible" : "Big Logo Hidden"}
      />
      <Field label="Logo Text">
        <Input
          value={fd.bigLogoText}
          onChange={(v) => update({ bigLogoText: v })}
          className="font-serif text-lg"
        />
      </Field>
    </Section>
  );
};

export default BigLogoEditor;
