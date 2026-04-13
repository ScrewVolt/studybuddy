export default function MessageBubble({ content }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[72%] px-4 py-2.5 rounded-2xl rounded-br-sm text-[13px] leading-relaxed text-white"
        style={{ backgroundColor: '#4338CA' }}
      >
        {content}
      </div>
    </div>
  )
}