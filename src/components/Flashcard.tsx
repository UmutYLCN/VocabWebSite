type Props = {
  front: string
  back: string
  showBack?: boolean
}

export default function Flashcard({ front, back, showBack }: Props) {
  return (
    <div className="glass p-8">
      <div className="text-center">
        <div className="text-xl tracking-wide">{front}</div>
        {showBack && <div className="mt-4 text-red-300">{back}</div>}
      </div>
    </div>
  )
}
