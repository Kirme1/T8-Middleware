const WebSocket = require("ws")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")

const wss = new WebSocket.Server({ port: 8082 })

let count = 0
setInterval(() => {
    count = 0
}, 1000);
console.log("connected")

wss.on("connection", ws => {
    if (count < 10) {
        ws.on("message", mes => {
            console.log('aaoo got something')
            try {
                let clientMessage = mes.toString()
                clientMessage = JSON.parse(clientMessage)
                let link = ''
                if(clientMessage.authenticated === true) {
                    link = '/dentistimo/authenticated/' + clientMessage.id
                    console.log(link)
                } else if (clientMessage.authenticated === false){
                    link = '/dentistimo/unauthenticated/' + clientMessage.id 
                }
                console.log(clientMessage)
                client.publish(link, JSON.stringify(clientMessage), { qos: 1 })
                client.subscribe(link, { qos: 1 }, e => {
                    client.on('message', (topic, message) => {
                        try {
                            console.log('here-love1')
                            console.log(JSON.parse(message))
                            if (JSON.parse(message).id === clientMessage.id) {
                                if(JSON.parse(message)["response"] === "response") {
                                    console.log('here-love2')
                                    ws.send(message.toString())
                                    client.unsubscribe(topic)
                                } else if(JSON.parse(message).authenticated) {
                                    console.log('here-love3')
                                    let link2 = '/dentistimo/authenticated/' + JSON.parse(message).id
                                    client.publish(link2, message, { qos: 1 })
                                    client.subscribe(link2, { qos: 1 })
                                }
                            }
                        } catch (e) {
                            ws.send(JSON.stringify({ "Error": "Received bad data from the server." }))
                            client.unsubscribe(topic)
                        }
                    })
                })
            } catch (e) {
                ws.send(JSON.stringify({ "Error": "400 Bad Request. Requests must be sent as stringified Json." }))
            }
        })
        count++
    } else {
        ws.send(JSON.stringify({ "Error": "429 Too Many Requests. Please try again later." }))
    }
})