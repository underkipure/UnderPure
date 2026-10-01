import React from "react";
import { Section, Field, Input } from "./FormControls";

const ContactInfoEditor = ({
  fd,
  update,
  globalContactEmail,
  setGlobalContactEmail,
  globalContactPhone,
  setGlobalContactPhone,
}) => {
  return (
    <Section title="Footer Column 2: Contact Us">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Field label="Section / Column Title">
          <Input
            value={fd.contactTitle !== undefined ? fd.contactTitle : "CONTACT US"}
            onChange={(v) => update({ contactTitle: v })}
            placeholder="CONTACT US"
          />
        </Field>
        <Field label="Service Hours">
          <Input
            value={fd.contactServiceHours !== undefined ? fd.contactServiceHours : "9:00 AM to 5:00 PM"}
            onChange={(v) => update({ contactServiceHours: v })}
            placeholder="e.g. 9:00 AM to 5:00 PM"
          />
        </Field>
        <Field label="Returns Link Text">
          <Input
            value={fd.contactReturnsText !== undefined ? fd.contactReturnsText : "Returns Center"}
            onChange={(v) => update({ contactReturnsText: v })}
            placeholder="Returns Center"
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Email Address">
          <Input
            value={globalContactEmail || ""}
            onChange={setGlobalContactEmail}
            placeholder="hello@underpure.com"
          />
        </Field>
        <Field label="Phone / WhatsApp Number">
          <Input
            value={globalContactPhone || ""}
            onChange={setGlobalContactPhone}
            placeholder="+92 317 7470775"
          />
        </Field>
        <Field label="Returns Link URL">
          <Input
            value={fd.contactReturnsLink !== undefined ? fd.contactReturnsLink : "/returns"}
            onChange={(v) => update({ contactReturnsLink: v })}
            placeholder="/returns"
          />
        </Field>
      </div>
    </Section>
  );
};

export default ContactInfoEditor;
