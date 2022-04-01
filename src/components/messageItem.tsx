import React from 'react'
import { PopulatedMessage } from '../models'
import statics from '../Statics/statics'


interface MessageItemProps {
    message: PopulatedMessage
    index: number
    messages: PopulatedMessage[]
}

function MessageItem({ message, index, messages }: MessageItemProps) {

    const isConnectedUser = message.sender._id === statics.connectedUser._id;
    let chatContentStyles = {}
    let chatBoxClassName = isConnectedUser ? "chat-content-right" : "chat-content"


    if (messages[index + 1]?.sender._id === message.sender._id) {
        chatContentStyles = {
            marginLeft: "54px",
            marginBottom: "2px"
        }
    }

    if (isConnectedUser) {
        chatContentStyles = {
            marginBottom: "2px"
        }
    }

    const POSITION = (isConnectedUser) ? "Right" : "Left";
    //firstMessage
    if ((messages[index + 1]?.sender._id === message.sender._id) && (messages[index - 1]?.sender._id !== message.sender._id)) {
        chatBoxClassName += " first" + POSITION + "Message"
    }
    //middleMessage
    if ((messages[index + 1]?.sender._id === message.sender._id) && (messages[index - 1]?.sender._id === message.sender._id)) {
        chatBoxClassName += " middle" + POSITION + "Message"
    }
    //lastMessage
    if ((messages[index - 1]?.sender._id === message.sender._id) && (messages[index + 1]?.sender._id !== message.sender._id)) {
        chatBoxClassName += " last" + POSITION + "Message"
    }

    function showReactionContainer(): void {
        (document.getElementById("reaction-" + message.id) as HTMLElement).style.display = "block";
    }

    function hideReactionContainer(): void {
        (document.getElementById("reaction-" + message.id) as HTMLElement).style.display = "none";
    }


    return (
        <div onMouseEnter={() => showReactionContainer()} onMouseLeave={() => hideReactionContainer()} className={(isConnectedUser) ? "message-container MCRight" : "message-container"}>
            <div className='message-row'>
                {(message.sender._id !== statics.connectedUser._id)
                    && (messages[index + 1]?.sender._id !== message.sender._id)
                    && < img className='message-img' src={statics.baseUploadsURL + message.sender.avatar} alt="avatar" />}

                <div style={(isConnectedUser) ? { flexDirection: "row-reverse" } : {}} className='d-flex'>
                    <div style={chatContentStyles} className={chatBoxClassName}>
                        {message.message}
                    </div>

                    
                    <div id={"reaction-" + message.id} className='reactions-container'>
                        <button className='reaction-btn'>
                            <img className='reaction-img' src="./assets/img/emoji.png" alt="emoji" />    
                        </button> 
                    </div>
                </div>



            </div>
        </div>
    )
}

export default MessageItem