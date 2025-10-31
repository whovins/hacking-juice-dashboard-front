import { Button } from '../../ui/Button'

// ACK 버튼 자리표시자. 나중에 mutate 연결.
export default function AlertAckButton({ id }: { id: string }) {
  return <Button onClick={() => alert(`ACK ${id}`)}>ACK</Button>
}
