export default function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'

  const sizeLabel = file.size < 1024 * 1024
    ? `${Math.round(file.size / 1024)}KB`
    : `${(file.size / (1024 * 1024)).toFixed(1)}MB`

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-2"
      style={{
        backgroundColor: '#EEF2FF',
        border: '0.5px solid #c7d2fe',
      }}
    >
      {/* Thumbnail or icon */}
      {isImage ? (
        <div
          className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
          style={{ border: '0.5px solid #c7d2fe' }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt="attachment"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#EEF2FF', border: '0.5px solid #c7d2fe' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke="#4338CA" strokeWidth="1.5">
            <path d="M4 2h7l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M11 2v4h4" />
            <path d="M6 9h6M6 12h4" />
          </svg>
        </div>
      )}

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div
          className="text-[12px] font-medium truncate"
          style={{ color: '#4338CA' }}
        >
          {file.name}
        </div>
        <div className="text-[11px]" style={{ color: '#818CF8' }}>
          {isPDF ? 'PDF document' : 'Image'} · {sizeLabel}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-80"
        style={{ backgroundColor: '#c7d2fe' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 2l6 6M8 2L2 8"
            stroke="#4338CA"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}