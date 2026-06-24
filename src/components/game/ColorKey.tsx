export function ColorKey() {
  return (
    <div className="flex items-center justify-center gap-4 px-3 py-2 rounded-2xl bg-white/70 border border-[#E8E4DF]">
      <div className="flex items-center gap-1.5">
        <div
          className="w-5 h-5 rounded-md border-2"
          style={{
            background: 'var(--tile-correct)',
            borderColor: 'var(--tile-correct-border)',
          }}
        />
        <span className="text-[11px] font-semibold text-[#4A5568]">Right place</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="w-5 h-5 rounded-md border-2"
          style={{
            background: 'var(--tile-present)',
            borderColor: 'var(--tile-present-border)',
          }}
        />
        <span className="text-[11px] font-semibold text-[#4A5568]">Wrong place</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="w-5 h-5 rounded-md border-2"
          style={{
            background: 'var(--tile-absent)',
            borderColor: 'var(--tile-absent-border, #CFD8DC)',
          }}
        />
        <span className="text-[11px] font-semibold text-[#4A5568]">Not in word</span>
      </div>
    </div>
  )
}
