
const websocket = require('ws')

const server = new websocket.Server({ port: 8080 },
    () => { console.log('NodeJs Server started on port 8080') }
);

const users = new Set();

function sendMessage(message) {
    users.forEach(user => {
        user.ws.send(JSON.stringify(message))
    })
}

server.on('connection', ws => {
    console.log('React Client connected to server....')
    console.log('***********************************')
    // console.log(ws)
    console.log('***********************************')
    const userRef = { ws }

    users.add(userRef)
    
    ws.on('message', message => {
        console.log('On message: ', message)
        try {
            const data = JSON.parse(message);
            if (
                typeof data.sender !== 'string' ||
                typeof data.body !== 'string'
            ) {
                console.error('Invalid Message');
                return;
            }
            const messageToSend = {
                sender: data.sender,
                body: data.body,
                sentAt: Date.now()
            }
            sendMessage(messageToSend)
        } catch (e) {
            console.error('Error passing message!', e)
        }
    })

    ws.on('close', (code,reason)=>{
        console.log(`Connection Closed: ${code} ${reason}`)
        users.delete(userRef);
    })
})



