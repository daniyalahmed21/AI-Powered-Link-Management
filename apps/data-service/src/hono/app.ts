import { getDestinationForCountry } from '@/helpers/route-ops';
import { getLink } from '@repo/data-ops/queries/links';
import { cloudflareInfoSchema } from '@repo/data-ops/zod-schema/links';
import {Hono } from 'hono';

export const app = new Hono<{Bindings:Env}>();

app.get('/:id', async (c) => {
    let id  = c.req.param("id") ;
    const linkInfo = await getLink(id);
    if (!linkInfo) {
        return c.text('Link not found', 404);
    }
    const cfHeaders = cloudflareInfoSchema.safeParse(c.req.raw.cf)
    if (!cfHeaders.success) {
        return c.text('Invalid Cloudflare headers', 400);
    }
    const headers = cfHeaders.data;
    const destinations = getDestinationForCountry(linkInfo, headers.country);
    return c.redirect(destinations);
});