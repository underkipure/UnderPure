import React from "react";
import { Section, Field, Input, TextArea } from "./ContactFormPrimitives";

export default function ContactClientServicesSection({ clientServices, update }) {
  const cs = clientServices || {};

  return (
    <Section title="Client Services Section">
      <div className="space-y-4">
        <Field label="Section Title">
          <Input
            value={cs.title || ""}
            onChange={(v) =>
              update({ clientServices: { ...cs, title: v } })
            }
            placeholder="e.g. client services"
          />
        </Field>
        <Field label="Intro Paragraph">
          <TextArea
            value={cs.introText || ""}
            onChange={(v) =>
              update({ clientServices: { ...cs, introText: v } })
            }
            placeholder="e.g. UnderPure's Client Services team would be happy to assist you..."
          />
        </Field>
        <Field label="Availability / Hours Text">
          <Input
            value={cs.hoursText || ""}
            onChange={(v) =>
              update({ clientServices: { ...cs, hoursText: v } })
            }
            placeholder="e.g. UnderPure Client Services representatives are available Monday through Friday, 10AM-6PM EST."
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Chat Info Text">
            <Input
              value={cs.chatText || ""}
              onChange={(v) =>
                update({ clientServices: { ...cs, chatText: v } })
              }
              placeholder="e.g. See Chat icon in lower right hand corner"
            />
          </Field>
          <Field label="Email Address">
            <Input
              value={cs.email || ""}
              onChange={(v) =>
                update({ clientServices: { ...cs, email: v } })
              }
              placeholder="e.g. hello@underpure.com"
            />
          </Field>
          <Field label="Call or Text / WhatsApp Number">
            <Input
              value={cs.phone || ""}
              onChange={(v) =>
                update({ clientServices: { ...cs, phone: v } })
              }
              placeholder="e.g. +92 300 0000000"
            />
          </Field>
        </div>
      </div>
    </Section>
  );
}
