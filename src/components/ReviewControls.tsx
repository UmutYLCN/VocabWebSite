type Props = {
  onAnswer: (quality: 0|1|2|3|4|5) => void
}

export default function ReviewControls({ onAnswer }: Props) {
  const btn = 'px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-90'
  return (
    <div className="flex flex-wrap gap-2">
      <button className={btn} onClick={() => onAnswer(1)}>Again</button>
      <button className={btn} onClick={() => onAnswer(3)}>Hard</button>
      <button className={btn} onClick={() => onAnswer(4)}>Good</button>
      <button className={btn} onClick={() => onAnswer(5)}>Easy</button>
    </div>
  )
}
