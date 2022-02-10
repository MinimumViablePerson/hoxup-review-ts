import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Conversation from '../components/Conversation'
import { ConversationType, User } from '../types'

type Props = {
  currentUser: User | null
  logOut: () => void
  users: User[]
  setModal: (newModal: string) => void
  modal: string
}

function Main ({ currentUser, logOut, users, setModal, modal }: Props) {
  const [conversations, setConversations] = useState<ConversationType[]>([])
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser === null) navigate('/')
  }, [currentUser, navigate])

  useEffect(() => {
    if (currentUser === null) return

    fetch(`http://localhost:4000/conversations?userId=${currentUser.id}`)
      .then(resp => resp.json())
      .then(conversations => setConversations(conversations))
  }, [currentUser])

  const usersIHaveNotTalkedToYet = users.filter(user => {
    // when do I want to keep this user?

    // don't show the currently logged in user
    if (currentUser && user.id === currentUser.id) return false

    // don't show any users in conversations
    // Is this user's id in the conversations?
    // Is it either in userId or participantId
    for (const conversation of conversations) {
      if (conversation.userId === user.id) return false
      if (conversation.participantId === user.id) return false
    }
    // at this point we know this user's id is not anywhere in the conversations
    // so we want to keep it
    return true
  })

  function createConversation (participantId: number) {
    if (currentUser === null) return

    fetch('http://localhost:4000/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUser.id,
        participantId: participantId
      })
    })
      .then(resp => resp.json())
      .then(newConversation => {
        setConversations([...conversations, newConversation])
        setModal('')
      })
  }

  if (currentUser === null) return <h1>Not signed in...</h1>

  return (
    <div className='main-wrapper'>
      <aside>
        {/* <!-- Side Header --> */}
        <header className='panel'>
          <img
            className='avatar'
            width='50'
            height='50'
            src={currentUser.avatar}
            alt=''
          />
          <h3>{currentUser.firstName}</h3>
          <button onClick={() => logOut()}>LOG OUT</button>
        </header>

        {/* <!-- Search form --> */}
        <form className='aside__search-container'>
          <input
            type='search'
            name='messagesSearch'
            placeholder='Search chats'
          />
        </form>

        <ul>
          <li>
            <button
              className='chat-button'
              onClick={() => {
                // display a "start-chat" modal ✅
                setModal('start-chat')
              }}
            >
              <div>
                <h3>+ Start a new Chat</h3>
              </div>
            </button>
          </li>

          {conversations.map(conversation => {
            // which id am I talking to
            const talkingToId =
              currentUser.id === conversation.userId
                ? conversation.participantId
                : conversation.userId

            // what are their details?
            const talkingToUser = users.find(user => user.id === talkingToId)
            if (talkingToUser === undefined) return null

            return (
              <li key={conversation.id}>
                <button
                  className='chat-button'
                  onClick={() => navigate(`/logged-in/${conversation.id}`)}
                >
                  <img
                    className='avatar'
                    height='50'
                    width='50'
                    alt=''
                    src={talkingToUser.avatar}
                  />
                  <div>
                    <h3>
                      {talkingToUser.firstName} {talkingToUser.lastName}
                    </h3>
                    <p>Last message</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* <!-- Main Chat Section --> */}

      {params.conversationId ? (
        <Conversation currentUser={currentUser} />
      ) : null}

      {modal === 'start-chat' ? (
        <div className='modal-wrapper'>
          <div className='modal'>
            <button className='close-modal' onClick={() => setModal('')}>
              X
            </button>
            <h1>Start chat</h1>
            {/* 
              this modal should display all users
              I have no conversations with yet ✅
            */}
            {usersIHaveNotTalkedToYet.length > 0 ? (
              <ul>
                {usersIHaveNotTalkedToYet.map(user => (
                  <li key={user.id}>
                    <button
                      className='chat-button'
                      onClick={() => {
                        // clicking on one of those users
                        // should start a conversation with them
                        // how do we start a conversation?
                        // - create a conversation on the server
                        // - update conversations state
                        createConversation(user.id)
                      }}
                    >
                      <img
                        className='avatar'
                        height='50'
                        width='50'
                        alt=''
                        src={user.avatar}
                      />
                      <div>
                        <h3>
                          {user.firstName} {user.lastName}
                        </h3>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new person to talk to</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Main
