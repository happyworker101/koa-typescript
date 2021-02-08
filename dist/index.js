"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa2_router_1 = __importDefault(require("koa2-router"));
const next_1 = __importDefault(require("next"));
const port = parseInt(process.env.PORT || '', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = new koa_1.default();
    const router = new koa2_router_1.default();
    router.get('/', async (ctx, next) => {
        await app.render(ctx.req, ctx.res, '/', ctx.query);
        await next();
    });
    router.all('(.*)', async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });
    server.use(router);
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
//# sourceMappingURL=index.js.map