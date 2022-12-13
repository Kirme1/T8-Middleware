const WebSocket = require("ws")

var assert = require('assert');
describe('MQTT', function () {
    describe('#send()', function () {
        it('should return hello if mqtt and WebSocket is working', function () {

            const result = mqtest()
            setTimeout(() => {
                let resultString = ''
                let expectedResult = 'hello'
                try {
                    resultString = result[0].data
                } catch (e) {
                    console.log(e)
                }

                assert.equal(resultString, expectedResult)
            }, 100)

            function mqtest() {
            const ws = new WebSocket('ws://localhost:8082')
            const message = []
            ws.onopen = () => {
            ws.send(JSON.stringify({ id: 'test', request: 'test', url: 'url', data: 'hello', authenticated: true }))
            }
            ws.onmessage = function (event) {
            message.push(JSON.parse(event.data))
            ws.close()
            }
            return message
            }
        })
    })
})