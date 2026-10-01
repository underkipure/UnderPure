import React from 'react';
import { DIALOG_OPTIONS } from '../constants';

const CheckoutDialogsTab = ({
  formData,
  setFormData,
  selectedDialog,
  setSelectedDialog,
  globalContactEmail,
  globalContactPhone,
}) => {
  const currentDialogObj = DIALOG_OPTIONS.find(d => d.id === selectedDialog) || DIALOG_OPTIONS[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#fafafa] border border-black/10 p-4 rounded-lg flex flex-wrap gap-2 items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Select Dialog to Edit:</span>
        <div className="flex flex-wrap gap-2">
          {DIALOG_OPTIONS.map(dialog => (
            <button
              key={dialog.id}
              onClick={() => setSelectedDialog(dialog.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                selectedDialog === dialog.id 
                  ? 'bg-black text-white shadow' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
              }`}
            >
              {dialog.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-black/10 p-6 rounded-lg bg-white space-y-6">
        <div className="border-b border-black/10 pb-4 flex justify-between items-center">
          <h3 className="font-serif text-lg font-medium text-black">
            Editing: <span className="underline decoration-1 underline-offset-4">{currentDialogObj.name}</span>
          </h3>
          <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded font-mono">
            ID: {currentDialogObj.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Footer Link Text (Button Label)
            </label>
            <input 
              type="text" 
              value={formData[currentDialogObj.labelKey] || ''} 
              onChange={e => setFormData({...formData, [currentDialogObj.labelKey]: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder={currentDialogObj.name}
            />
            <p className="text-[11px] text-gray-400 mt-1">This text appears as the link at the bottom of the checkout page.</p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Dialog Popup Title (Header)
            </label>
            <input 
              type="text" 
              value={formData[currentDialogObj.titleKey] || ''} 
              onChange={e => setFormData({...formData, [currentDialogObj.titleKey]: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" 
              placeholder={currentDialogObj.name}
            />
            <p className="text-[11px] text-gray-400 mt-1">This heading is shown inside the popup modal window.</p>
          </div>
        </div>

        {selectedDialog === 'contact' ? (
          <div className="space-y-6 border-t border-black/10 pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black">Contact Popup Content</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Section Heading
                </label>
                <input 
                  type="text" 
                  value={formData.dialogContactHeading || ''} 
                  onChange={e => setFormData({...formData, dialogContactHeading: e.target.value})} 
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
                  placeholder="CONTACT US"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Customer Service Hours
                </label>
                <input 
                  type="text" 
                  value={formData.dialogContactServiceHours || ''} 
                  onChange={e => setFormData({...formData, dialogContactServiceHours: e.target.value})} 
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
                  placeholder="M-F, 10AM-6PM EST"
                />
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600">
              Note: Email and phone number shown in the Contact popup are automatically synced with your global Contact Settings (Email: {globalContactEmail || 'not set'}, Phone: {globalContactPhone || 'not set'}).
            </div>
          </div>
        ) : (
          <div className="space-y-6 border-t border-black/10 pt-6">
            {/* Section 1 */}
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-black/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Section 1 (Primary)</h4>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                  Heading / Subtitle
                </label>
                <input 
                  type="text" 
                  value={formData[currentDialogObj.heading1Key] || ''} 
                  onChange={e => setFormData({...formData, [currentDialogObj.heading1Key]: e.target.value})} 
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-medium bg-white" 
                  placeholder="e.g. Returns Policy or Shipping Info"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                  Paragraph / Body Text
                </label>
                <textarea 
                  rows={5}
                  value={formData[currentDialogObj.body1Key] || ''} 
                  onChange={e => setFormData({...formData, [currentDialogObj.body1Key]: e.target.value})} 
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black leading-relaxed bg-white font-sans" 
                  placeholder="Enter your paragraph text here..."
                />
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-black/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Section 2 (Optional)</h4>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                  Heading / Subtitle 2
                </label>
                <input 
                  type="text" 
                  value={formData[currentDialogObj.heading2Key] || ''} 
                  onChange={e => setFormData({...formData, [currentDialogObj.heading2Key]: e.target.value})} 
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-medium bg-white" 
                  placeholder="Optional second section heading..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                  Paragraph / Body Text 2
                </label>
                <textarea 
                  rows={5}
                  value={formData[currentDialogObj.body2Key] || ''} 
                  onChange={e => setFormData({...formData, [currentDialogObj.body2Key]: e.target.value})} 
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black leading-relaxed bg-white font-sans" 
                  placeholder="Optional second paragraph text..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutDialogsTab;
