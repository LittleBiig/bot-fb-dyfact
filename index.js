//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48




 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = process.env.FB_PAGE_ACCESS_TOKEN


// index
app.get('/', function (req, res) {
	res.send('Voici le bot Facebook du duo Dyfact')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
		res.send('Error : wrong token')

})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging

	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "object : " + req.body.page)
			sendText(sender, "entry[0].id : " + req.body.entry[0].id)
			sendText(sender, "entry[0].time : " + req.body.entry[0].time)

			sendText(sender, "entry[0].messaging[0].sender.id : " + req.body.entry[0].messaging[0].sender.id)
			sendText(sender, "entry[0].messaging[0].recipient.id : " + req.body.entry[0].messaging[0].recipient.id)
			sendText(sender, "entry[0].messaging[0].timestamp : " + req.body.entry[0].messaging[0].timestamp)
			sendText(sender, "entry[0].messaging[0].message.mid : " + req.body.entry[0].messaging[0].message.mid)
			sendText(sender, "entry[0].messaging[0].seq : " + req.body.entry[0].messaging[0].message.seq)
			sendText(sender, "entry[0].messaging[0].message.txt : " + req.body.entry[0].messaging[0].message.text)
				console.log("welcome to chatbot")
        decideMessage(sender, text)
				// continue


			// sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			decideMessage(sender, text)
			continue
		}
	}
	res.sendStatus(200)
})



function decideMessage(sender, text1){
  let text = text1.toLowerCase()
  if (text.includes("looking good")){
    sendImageMessage(sender)

  } else if (text.includes("lift me up")){
    sendGenericMessage(sender)
  } else {
      sendText(sender, "Mon son préféré de Dyfact est And Go!")
      sendButtonMessage(sender, "Quel est ton son préféré?")
  }
}


function sendText(sender, text) {
	let messageData = { text:text }
  sendRequest(sender, messageData)

}


function sendButtonMessage(sender,text) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "button",
        "text": text,
				"buttons": [
          {
						"type": "postback",
						// "image_url": "https://yt3.ggpht.com/-VOVCXk9mSZ4/AAAAAAAAAAI/AAAAAAAAAAA/Wby2Wp0Cz3g/s900-c-k-no-mo-rj-c0xffffff/photo.jpg",
						"title": "Looking Good",
            "payload": "looking good",
					}, {
						"type": "postback",
						"title": "Lift Me Up",
						"payload": "lift me up",
					}],
				}
			}
		}

  sendRequest(sender, messageData)
}

function sendImageMessage(sender){
  let messageData = {
    "attachment":{
      "type":"image",
      "payload":{
        "url":"https://i.ytimg.com/vi/yg7nypb4yok/maxresdefault.jpg"
      }
    }
  }
  sendRequest(sender, messageData)
}

function sendGenericMessage(sender){
    let messageData = {"attachment":{
          "type":"template",
          "payload":{
                "template_type":"generic",
                "elements":[
                   {
                    "title":"Lift Me Up",
                    "image_url":"https://i.ytimg.com/vi/lp7094imyHk/maxresdefault.jpg",
                    "subtitle":"Dyfact",
                    // "default_action": {
                    //   "type": "web_url",
                    //   "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                    //   "messenger_extensions": true,
                    //   "webview_height_ratio": "tall",
                    //   "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                    // },
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://www.youtube.com/watch?v=lp7094imyHk",
                        "title":"Ecouter"
                      }
                    ]
                  }
                ]
            }
}
    }
    sendRequest(sender, messageData)
}


function sendRequest(sender, messageData){

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })

}


// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
