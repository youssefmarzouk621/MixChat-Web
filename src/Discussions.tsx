import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MessagesContainer from './components/messagesContainer';
import Navbar from './components/navbar';

import './css/chat-application.css'
import { Conversation, Discussion, MessageType, PopulatedMessage, User } from './models';

import statics from "./Statics/statics"

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-type": "application/json",
  },
});

function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [msgs, setMsgs] = useState<PopulatedMessage[]>([])

  const [activeDiscussion, setActiveDiscussion] = useState<Discussion>();
  const [activeConversationIndex, setActiveConversationIndex] = useState<number>(0)
  const [friend, setFriend] = useState<User>();

  const [isEmpty, setIsEmpty] = useState<boolean>(true)



  function getUnseenMessages(messages: PopulatedMessage[], connected: string): number {
    var count: number = 0;
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.seen === "false" && (message.sender._id !== connected)) {
        count++;
      }
    }

    return count;
  }


  function scrollToBottom() {
    setTimeout(function () {
      document.getElementById("messagesContainer")!.scrollTop = document.getElementById("messagesContainer")!.scrollHeight;
    }, 1)
  }





  useEffect(() => {

    function processDiscussions(data: any): Discussion[] {
      const discus: Discussion[] = [];
      Object.entries(data).forEach(entry => {
        const [key, value] = entry;

        const user: string = key;
        const populatedmessages: any = value;

        let messages: PopulatedMessage[] = [];

        populatedmessages.forEach((message: any) => {
          const populatedMessage: PopulatedMessage = {
            id: message._id,
            createdAt: message.createdAt,
            discussionId: message.discussionId,
            message: message.message,
            sender: message.sender,
            receiver: message.receiver,
            seen: message.seen,
            type: message.type,
            messageType: (statics.connectedUser._id === message.sender._id) ? MessageType.sent : MessageType.received
          }
          messages.push(populatedMessage);
        })

        messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const discu: Discussion = { user: user, messages: messages }
        discus.push(discu);

      });
      return discus;
    }

    function processConversations(data: Discussion[]): Conversation[] {
      const convos: Conversation[] = [];
      data.forEach((discu) => {
        const firstMessage = discu.messages[0];
        const lastMessage = discu.messages[discu.messages.length - 1];

        var friend: User = firstMessage.sender;
        if (firstMessage.sender._id === statics.connectedUser._id) {
          friend = firstMessage.receiver;
        }

        const unseenMessages: number = getUnseenMessages(discu.messages, statics.connectedUser._id);
        const displayedMessage: string = lastMessage.sender._id === statics.connectedUser._id ? "Vous :" + lastMessage.message : lastMessage.message;

        convos.push({
          userId: friend._id,
          avatar: friend.avatar,
          username: friend.firstName + " " + friend.lastName,
          message: displayedMessage + " · " + new Date(lastMessage.createdAt).getHours() + ":" + new Date(lastMessage.createdAt).getMinutes(),
        })
      })

      return convos;
    }

    const getConversations = async () => {
      const res = await apiClient.post('/chat/getConversations/', {
        sender: statics.connectedUser._id
      });

      const discus = processDiscussions(res.data);
      const convos = processConversations(discus);


      setDiscussions(discus)
      setConversations(convos);

      //setup active messages
      if (discus.length !== 0) {
        setActiveDiscussion(discus[0])
        setMsgs(discus[0].messages);

        if (discus[0].messages.length !== 0) {
          if (discus[0].messages[0].sender._id === statics.connectedUser._id) {
            setFriend(discus[0].messages[0].receiver);
          } else {
            setFriend(discus[0].messages[0].sender);
          }
        }
        scrollToBottom()
      }

    }






    getConversations()

  }, [])



  function handleDisplayMessages(index: number): void {
    setActiveConversationIndex(index);
    setActiveDiscussion(discussions[index])
    const newMessages = discussions[index].messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setMsgs(newMessages)



    if (discussions[index].messages.length !== 0) {
      if (discussions[index].messages[0].sender._id === statics.connectedUser._id) {
        setFriend(discussions[index].messages[0].receiver);
      } else {
        setFriend(discussions[index].messages[0].sender);
      }
    }

    scrollToBottom()


  }



  function GenerateObjectId(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }


  const handleSubmit = (event: any) => {
    event.preventDefault();

    const msg = (document.getElementById("MixchatInput") as HTMLInputElement).value;
    if (msg) {

      const newMessage: PopulatedMessage = {
        id: GenerateObjectId(),
        discussionId: GenerateObjectId(),
        createdAt: new Date().toISOString(),
        message: msg,
        messageType: MessageType.sent,
        sender: statics.connectedUser,
        receiver: friend!,
        seen: "false",
        type: "text"
      }

      setDiscussions((prevState) => {
        prevState[activeConversationIndex] = { ...prevState[activeConversationIndex], messages: [...prevState[activeConversationIndex].messages, newMessage] }
        return prevState;
      })

      setConversations((prevState) => {
        prevState[activeConversationIndex] = { ...prevState[activeConversationIndex], message: "Vous :" + msg + " · " + new Date().getHours() + ":" + new Date().getMinutes() }
        return prevState;
      })

      setMsgs(prevState => [...prevState, newMessage]);


      (document.getElementById("MixchatInput") as HTMLInputElement).value = "";
      scrollToBottom()


    }
  }

  return (
    <>
      <Navbar />




      <div className="d-flex">
        <div className="d-flex flex-column flex-shrink-0 p-3 Mixchat-sidenav">
          <span className="fs-4 discussionsText">Discussions</span>
          <input style={{ marginBottom: "10px", marginTop: "6px" }} className='Mixchat-search-input' type="text" placeholder='Rechercher dans Mixchat' />
          <ul className="nav nav-pills flex-column mb-auto discussions-list">
            {conversations.map(function (conversation: Conversation, index: number) {

              return <li onClick={() => handleDisplayMessages(index)} key={conversation.userId} className="nav-item">

                <div className={(activeDiscussion?.user === conversation.userId) ? 'discussionItem activeDiscussion' : 'discussionItem'}>
                  <img src={statics.baseUploadsURL + conversation.avatar} alt="avatar" />
                  <div className='discussionContent'>
                    <p className='discussionUsername'>{conversation.username}</p>
                    <p className='discussionMessage'>{conversation.message}</p>
                  </div>
                </div>
              </li>
            })}


          </ul>



        </div>



        <div className='mixchatContent'>
          {(friend) && <div className='activeFriend'>
            <div style={{ padding: "7px" }} className='d-flex'>
              <img src={statics.baseUploadsURL + friend?.avatar} alt="avatar" />
              <div style={{ marginLeft: "9px" }}>
                <p className='discussionUsername'>{friend?.firstName + " " + friend?.lastName}</p>
                <p className='discussionMessage'>En ligne</p>
              </div>
            </div>

          </div>}

          <MessagesContainer messages={msgs} />


          <div className='Mixchat-sendContainer'>

            <form autoComplete="off" onSubmit={handleSubmit}>
              <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
              <input onInput={(event: any) => {
                if (event.target.value === "") {
                  setIsEmpty(true);
                } else {
                  setIsEmpty(false);
                }
              }} id='MixchatInput' className='Mixchat-input' type='text' placeholder='Aa' />
              <button type='submit' className='Mixchat-sendBtn'>
                {(isEmpty)
                  ? <img className='send-message' src="./assets/img/like.png" alt="sendMessage" />
                  : <img className='send-message' src="./assets/img/send-message.png" alt="sendMessage" />}
              </button>
            </form>

          </div>

        </div>
      </div>





    </>
  );
}

export default Discussions;