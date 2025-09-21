export default function BackgroundFX() {
  return (
    <div className="bgfx">
      {/* radial gradient texture layer */}
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(ellipse at top, rgba(239,35,60,0.08), transparent 60%), radial-gradient(ellipse at bottom, rgba(239,35,60,0.06), transparent 60%)' }} />
    </div>
  )
}

