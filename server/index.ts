import Koa from 'koa'
import Router from 'koa2-router'
import next from 'next'

const port = parseInt(process.env.PORT || '', 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/', async (ctx, next) => {
    await app.render(ctx.req, ctx.res, '/', ctx.query)
    await next()
  })

  router.all('(.*)', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
    // ctx.res.statusCode
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router)
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})