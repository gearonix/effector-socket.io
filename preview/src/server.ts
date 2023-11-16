import http              from 'http'
import axios             from 'axios'
import { AxiosResponse } from 'axios'
import cors              from 'cors'
import express           from 'express'
import { Server }        from 'socket.io'
import { v4 }            from 'uuid'

import { Message }       from './shared/interfaces.ts'
import { Post }          from './shared/interfaces.ts'

const corsConfig = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: 'http://localhost:3000'
}

const app = express()
const server = new http.Server(app)

const io = new Server(server, {
  cors: corsConfig
})

app.use(cors(corsConfig))

// eslint-disable-next-line
const messages: Message[] = []

export interface IncomingMessage {
  payload: Pick<Message, 'message'>
}

io.on('connection', (socket) => {
  socket.on('namespace.send-message', async ({ payload }: IncomingMessage) => {
    messages.push({
      id: v4(),
      message: payload.message
    })

    socket.emit('namespace.message-sent', {
      payload: messages,
      timestamp: new Date().getTime()
    })
  })

  socket.on('namespace.fetch-posts', async () => {
    // const posts = await axios.get<Post[]>(
    //   'https://jsonplaceholder.typicode.com/posts'
    // )
    //
    // console.log(posts)

    const posts: Post[] = [
      {
        body: 'hbody',
        id: 2,
        title: 'hello',
        userId: 1
      }
    ]

    socket.emit('namespace.posts-received', {
      payload: posts.slice(0, 10),
      timestamp: new Date().getTime()
    })
  })
})

server.listen(6868)
