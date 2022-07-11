import Layout from './layout'

import { useParams } from 'react-router-dom'
import SendIcon from './setIcon'
import { useEffect, useState, useRef } from 'react'

export default function ChatPage() {

    const [messages, setMessages] = useState([])
    const [isConnectionOpen, setConnectionOpen] = useState(false)
    let messageBody = useRef('')
    const { username } = useParams()

    let ws = useRef()

    const sendMessage = () => {
        //console.log('Sending, ', username, messageBody.value)
        if (messageBody) {
            ws.current.send(
                JSON.stringify({
                    sender: username,
                    body: messageBody.value
                })
            );
            messageBody.value = ''
        }
    }

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8080")

        ws.current.onopen = event => {
            alert("Connection opened.")
            console.log("Connection opened.")
            setConnectionOpen(true)
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // alert(data.sender + ',' + data.body + ',' + data.sentAt)
            setMessages(_messages => [..._messages, data])
        }

        return () => {
            alert('Connection Closed...')
            console.log("Cleaning up...")
            ws.current.close()
        };

    }, []);

    const scrollTarget = useRef(null)

    useEffect(() => {
        if (scrollTarget.current) {
            scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages.length])


    return (
        <Layout>
            <div id='chat-view-container' className="flex flex-col w-1/2">

                <footer className='w-1/2'>
                    <p>
                        <span className='font-bold'>{username}</span>
                    </p>
                    <div className='flex flex-row'>
                        <input
                            id="message"
                            type="text"
                            clasName="w-full border-2 border-gray-200 focus:outline-non rounded-mdp-2 hover:border-purple-400"
                            placeholder='type your message here...'
                            ref={x => messageBody = x} requireds
                        />
                        <button
                            aria-label='Send'
                            onClick={sendMessage}
                            className="m-3"
                            disabled={!isConnectionOpen}
                        >{SendIcon}</button>
                    </div>
                </footer>
                {
                    messages.map((message, index) => (
                        <div key={index} className={`my-3 rounded py-3 w-1/2 text-white 
                        ${message.sender === username ? "self-end bg-purple-600" : "bg-blue-600"
                            }`}>
                            <div className="flex items-center">
                                <div className='ml-11'>
                                    <div className='flex flex-row'>
                                        <div className='text-sm font-medium leading-5 text-gray-900'>
                                            {message.sender} :
                                        </div>
                                        <div className='ml-2'>
                                            <div className='text-sm font-bold leading-5 text-gray-900'>
                                                {
                                                    new Date(message.sentAt).toLocaleTimeString(undefined, {
                                                        timeStyle: "short"
                                                    })}{""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-3 text-sm font-semibold leading-5'>
                                        {message.body}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div ref={scrollTarget} />
            </div>

        </Layout>
    )
}
