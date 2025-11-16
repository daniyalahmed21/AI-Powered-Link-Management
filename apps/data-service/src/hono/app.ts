import { getLink } from '@repo/data-ops/queries/links';
import {Hono } from 'hono';

export const app = new Hono<{Bindings:Env}>();

app.get('/:id', async (c) => {
    let id  = c.req.param("id") ;
    const linkInfo = await getLink(id);
    if (!linkInfo) {
        return c.text('Link not found', 404);
    }
    return c.json({ linkInfo });
});