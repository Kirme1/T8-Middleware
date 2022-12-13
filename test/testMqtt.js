function mqtest() {
    const ws = new WebSocket('ws://localhost:8082')
const message = []
ws.onopen = () => {
ws.send(JSON.stringify({ id: 'jf843fjwjj3dn', request: 'test', url: 'url', data: 'hello', authenticated: true }))
}
ws.onmessage = function (event) {
message.push(JSON.parse(event.data))
ws.close()
}
return message
}