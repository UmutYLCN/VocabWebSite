type Props = {
  front: string
  back: string
  showBack?: boolean
}

export default function Flashcard({ front, back, showBack }: Props) {
  return (
    <div className="border rounded p-6 bg-white dark:bg-gray-900 shadow-sm">
      <div className="text-center">
        <div className="text-lg">{front}</div>
        {showBack && <div className="mt-4 text-gray-700 dark:text-gray-300">{back}</div>}
      </div>
    </div>
  )
}
