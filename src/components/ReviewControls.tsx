type Props = {
  onAnswer: (quality: 0|1|2|3|4|5) => void
}

export default function ReviewControls({ onAnswer }: Props) {
  const btn = 'btn-ghost'
  return (
    <div className="flex flex-wrap gap-3 glass p-3">
      <button className={btn} onClick={() => onAnswer(1)}>Again</button>
      <button className={btn} onClick={() => onAnswer(3)}>Hard</button>
      <button className="btn-primary" onClick={() => onAnswer(4)}>Good</button>
      <button className="btn bg-red-600/80 hover:bg-red-600 text-white" onClick={() => onAnswer(5)}>Easy</button>
    </div>
  )
}
