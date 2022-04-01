import React from 'react'
import { PopulatedMessage } from '../models'
import MessageItem from './messageItem'

interface MessagesContainerProps {
    messages: PopulatedMessage[]
}

function MessagesContainer({ messages }: MessagesContainerProps) {
    return (

        (messages) && <div id='messagesContainer' className='messagesContainer'>
            {messages.map(function (message: PopulatedMessage, index: number) {
                return <MessageItem key={message.id} message={message} messages={messages} index={index} />
            })}
        </div>
    )
}

export default MessagesContainer