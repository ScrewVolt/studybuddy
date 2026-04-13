export default function MessageBubble({ content, attachmentPreview, attachmentName, attachmentType }) {
  const isPDF = attachmentType === 'application/pdf'

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] flex flex-col gap-1.5 items-end">

        {/* Attachment preview */}
        {attachmentPreview && (
          <div
            className="rounded-2xl rounded-br-sm overflow-hidden"
            style={{ border: '0.5px solid #c7d2fe' }}
          >
            <img
              src={attachmentPreview}
              alt="attachment"
              className="max-w-[240px] max-h-[180px] object-cover block"
            />
          </div>
        )}

        {/* PDF indicator */}
        {isPDF && attachmentName && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-2xl rounded-br-sm"
            style={{ backgroundColor: '#EEF2FF', border: '0.5px solid #c7d2fe' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              stroke="#4338CA" strokeWidth="1.5">
              <path d="M3 1h6l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" />
              <path d="M9 1v3h3" />
            </svg>
            <span className="text-[12px] font-medium" style={{ color: '#4338CA' }}>
              {attachmentName}
            </span>
          </div>
        )}

        {/* Text bubble */}
        {content && (
          <div
            className="px-4 py-2.5 rounded-2xl rounded-br-sm text-[13px] leading-relaxed text-white"
            style={{ backgroundColor: '#4338CA' }}
          >
            {content}
          </div>
        )}

      </div>
    </div>
  )
}