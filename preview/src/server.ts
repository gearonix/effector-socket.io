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

export interface IncomingMessage {
  payload: Pick<Message, 'message'>
}

io.on('connection', (socket) => {
  socket.on('namespace.send-message', async ({ payload }: IncomingMessage) => {
    const newMessage = {
      id: v4(),
      message: payload.message
    }

    socket.emit('namespace.message-sent', {
      payload: newMessage,
      timestamp: new Date().getTime()
    })
  })

  socket.on('namespace.get-posts', async () => {
    const posts = await axios.get<Post[]>(
      'https://jsonplaceholder.typicode.com/posts'
    )

    socket.emit('namespace.posts-received', {
      payload: posts.data.slice(0, 10),
      timestamp: new Date().getTime()
    })
  })
})

server.listen(6868)
