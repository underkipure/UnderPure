import React from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailShareModal({
  isOpen,
  onClose,
  emailShareConfig = {},
  shareSender,
  setShareSender,
  shareRecipient,
  setShareRecipient,
  shareMessage,
  setShareMessage
}) {
  if (!isOpen) return null;

  const handleShareListEmail = () => {
    if (!shareRecipient || !shareRecipient.trim()) {
      toast.error('Please enter a valid recipient email address.');
      return;
    }
    const sender = shareSender.trim() || 'A friend';
    const msg = shareMessage.trim() || emailShareConfig.messageDefault || 'Hi lover. Check out my lovelist.';
    const subject = encodeURIComponent(`${sender} shared their UnderPure Lovelist with you!`);
    const body = encodeURIComponent(`${msg}\n\nView the Lovelist here: ${window.location.origin}/lovelist`);

    window.location.href = `mailto:${shareRecipient.trim()}?subject=${subject}&body=${body}`;
    toast.success('Opening email client to send your Lovelist!');
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lovelist link copied to clipboard!');
  };

  const handleFacebookShare = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareMessage.trim() || emailShareConfig.messageDefault || 'Check out my favorite items on UnderPure!');
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-[525px] relative shadow-2xl animate-in fade-in zoom-in duration-200 p-8 sm:p-14 pt-10 sm:pt-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 text-gray-500 hover:text-black transition-colors"
          title="Close"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div className="mb-4 mt-2">
          <h3 className="text-[16px] font-bold text-[#4a4f5c] tracking-wide">
            {emailShareConfig.title || 'Share your Lovelist via email'}
          </h3>
        </div>

        {/* Form */}
        <div>
          <div className="mb-3">
            <label className="block text-[11px] text-gray-800 mb-1 tracking-[0.01em]">
              {emailShareConfig.senderLabel || 'Your Name'}
            </label>
            <input
              type="text"
              value={shareSender}
              onChange={(e) => setShareSender(e.target.value)}
              placeholder={emailShareConfig.senderPlaceholder || 'Enter your name'}
              className="w-full border border-gray-200 px-2 py-1 text-[12px] outline-none focus:border-black placeholder-gray-400"
            />
          </div>

          <div className="mb-3">
            <label className="block text-[11px] text-gray-800 mb-1">
              {emailShareConfig.recipientLabel || 'Recipient Email'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={shareRecipient}
              onChange={(e) => setShareRecipient(e.target.value)}
              placeholder={emailShareConfig.recipientPlaceholder || 'Enter recipient email'}
              className="w-full border border-gray-200 px-2 py-1 text-[13px] outline-none focus:border-black placeholder-gray-400"
            />
          </div>

          <div className="mb-2">
            <label className="block text-[11px] text-gray-800 mb-1">
              {emailShareConfig.messageLabel || 'Message'}
            </label>
            <textarea
              rows="3"
              value={shareMessage || emailShareConfig.messageDefault || ''}
              onChange={(e) => setShareMessage(e.target.value)}
              className="w-full border border-gray-200 p-2 text-[13px] outline-none focus:border-black text-[#4a4f5c] resize-none"
            ></textarea>
          </div>

          <p className="text-[11px] text-gray-800 mb-12 mt-1">
            {emailShareConfig.requiredText || '* Indicates a required field'}
          </p>

          <div className="flex justify-end mb-6">
            <button
              onClick={handleShareListEmail}
              disabled={!shareRecipient.trim()}
              className={`text-white font-bold text-[13px] px-6 py-2 tracking-widest uppercase transition-colors ${
                shareRecipient.trim()
                  ? 'bg-[#4a4f5c] hover:bg-[#33363f] cursor-pointer'
                  : 'bg-[#e5e5e5] cursor-not-allowed'
              }`}
            >
              {emailShareConfig.buttonText || 'SEND EMAIL'}
            </button>
          </div>

          <div className="border-t border-gray-300 pt-5">
            <p className="text-[13px] font-bold text-[#4a4f5c] mb-4">
              {emailShareConfig.orShareVia || 'Or share via'}
            </p>
            <div className="flex items-center justify-between gap-8">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-[12px] font-bold text-[#4a4f5c] hover:opacity-70 transition-opacity"
              >
                <LinkIcon size={16} />
                {emailShareConfig.copyLink || 'Copy Link'}
              </button>
              <button
                onClick={handleFacebookShare}
                className="flex items-center gap-1.5 text-[12px] font-bold text-[#4a4f5c] hover:opacity-70 transition-opacity"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                {emailShareConfig.facebook || 'Facebook'}
              </button>
              <button
                onClick={handleTwitterShare}
                className="flex items-center gap-1.5 text-[12px] font-bold text-[#4a4f5c] hover:opacity-70 transition-opacity"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
                <span className="hidden sm:inline">
                  {emailShareConfig.twitter || 'Twitter'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
