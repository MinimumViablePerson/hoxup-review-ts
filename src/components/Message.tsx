import { MessageType } from '../types'

type Props = {
  message: MessageType
  outgoing: boolean
}

function Message ({ message, outgoing }: Props) {
  return (
    <li className={outgoing ? 'outgoing' : 'incoming'}>
      <p>{message.messageText}</p>
    </li>
  )
}

export default Message
