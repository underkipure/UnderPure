import React from "react";

export default function LovelistPopupsSettings({ d, update }) {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">
        Popups
      </h3>
      <div className="space-y-6">
        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">
            Guest Popup
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={d.guestPopup?.title || ""}
                onChange={(e) =>
                  update({
                    guestPopup: { ...d.guestPopup, title: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Subtitle 1
              </label>
              <input
                type="text"
                value={d.guestPopup?.subtitle1 || ""}
                onChange={(e) =>
                  update({
                    guestPopup: { ...d.guestPopup, subtitle1: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Subtitle 2
              </label>
              <input
                type="text"
                value={d.guestPopup?.subtitle2 || ""}
                onChange={(e) =>
                  update({
                    guestPopup: { ...d.guestPopup, subtitle2: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={d.guestPopup?.buttonText || ""}
                onChange={(e) =>
                  update({
                    guestPopup: { ...d.guestPopup, buttonText: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              />
            </div>
          </div>
        </div>

        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">
            Share Popup (Guest)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={d.sharePopup?.title || ""}
                onChange={(e) =>
                  update({
                    sharePopup: { ...d.sharePopup, title: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Subtitle 1
              </label>
              <input
                type="text"
                value={d.sharePopup?.subtitle1 || ""}
                onChange={(e) =>
                  update({
                    sharePopup: {
                      ...d.sharePopup,
                      subtitle1: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Subtitle 2
              </label>
              <input
                type="text"
                value={d.sharePopup?.subtitle2 || ""}
                onChange={(e) =>
                  update({
                    sharePopup: {
                      ...d.sharePopup,
                      subtitle2: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={d.sharePopup?.buttonText || ""}
                onChange={(e) =>
                  update({
                    sharePopup: {
                      ...d.sharePopup,
                      buttonText: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              />
            </div>
          </div>
        </div>

        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">
            Email Share Popup
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={d.emailShare?.title || ""}
                onChange={(e) =>
                  update({
                    emailShare: { ...d.emailShare, title: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Sender Label
              </label>
              <input
                type="text"
                value={d.emailShare?.senderLabel || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      senderLabel: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Sender Placeholder
              </label>
              <input
                type="text"
                value={d.emailShare?.senderPlaceholder || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      senderPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Recipient Label
              </label>
              <input
                type="text"
                value={d.emailShare?.recipientLabel || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      recipientLabel: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Recipient Placeholder
              </label>
              <input
                type="text"
                value={d.emailShare?.recipientPlaceholder || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      recipientPlaceholder: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Message Label
              </label>
              <input
                type="text"
                value={d.emailShare?.messageLabel || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      messageLabel: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Message Default
              </label>
              <input
                type="text"
                value={d.emailShare?.messageDefault || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      messageDefault: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Required Text Hint
              </label>
              <input
                type="text"
                value={d.emailShare?.requiredText || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      requiredText: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Share Button Text
              </label>
              <input
                type="text"
                value={d.emailShare?.buttonText || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      buttonText: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Or Share Via Text
              </label>
              <input
                type="text"
                value={d.emailShare?.orShareVia || ""}
                onChange={(e) =>
                  update({
                    emailShare: {
                      ...d.emailShare,
                      orShareVia: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Copy Link Text
              </label>
              <input
                type="text"
                value={d.emailShare?.copyLink || ""}
                onChange={(e) =>
                  update({
                    emailShare: { ...d.emailShare, copyLink: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Facebook Text
              </label>
              <input
                type="text"
                value={d.emailShare?.facebook || ""}
                onChange={(e) =>
                  update({
                    emailShare: { ...d.emailShare, facebook: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Twitter Text
              </label>
              <input
                type="text"
                value={d.emailShare?.twitter || ""}
                onChange={(e) =>
                  update({
                    emailShare: { ...d.emailShare, twitter: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
