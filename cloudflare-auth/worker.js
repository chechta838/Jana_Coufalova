/**
 * Přihlášení do administrace (Decap CMS) přes GitHub – Cloudflare Worker.
 * Nahrazuje přihlašování, které jinak zajišťuje Netlify.
 *
 * Proměnné (Worker → Settings → Variables and Secrets):
 *   GITHUB_CLIENT_ID      – Client ID z GitHub OAuth aplikace
 *   GITHUB_CLIENT_SECRET  – Client secret (uložit jako Secret)
 *   ALLOWED_ORIGINS       – adresy webu oddělené čárkou,
 *                           např. https://jrc-consult.pages.dev,https://jrcconsult.cz
 *
 * Cesty:
 *   /auth      – přesměruje na přihlášení na GitHubu
 *   /callback  – GitHub sem vrátí kód, Worker ho vymění za token a předá ho administraci
 */

const STATE_COOKIE = 'decap_oauth_state';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/auth') return startLogin(url, env);
        if (url.pathname === '/callback') return finishLogin(request, url, env);

        return new Response('JRC Consult – přihlašovací služba administrace.', {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    },
};

function startLogin(url, env) {
    if (url.searchParams.get('provider') && url.searchParams.get('provider') !== 'github') {
        return text('Nepodporovaný poskytovatel přihlášení.', 400);
    }

    const state = crypto.randomUUID();
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authorize.searchParams.set('redirect_uri', `${url.origin}/callback`);
    authorize.searchParams.set('scope', url.searchParams.get('scope') || 'repo');
    authorize.searchParams.set('state', state);

    return new Response(null, {
        status: 302,
        headers: {
            Location: authorize.toString(),
            'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
        },
    });
}

async function finishLogin(request, url, env) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookieState = readCookie(request, STATE_COOKIE);

    if (!code || !state || state !== cookieState) {
        return reply(env, 'error', { message: 'Přihlášení vypršelo nebo bylo neplatné. Zkuste to prosím znovu.' });
    }

    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'jrc-cms-auth' },
        body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: `${url.origin}/callback`,
        }),
    });
    const data = await res.json().catch(() => ({}));

    if (!data.access_token) {
        return reply(env, 'error', { message: data.error_description || 'GitHub nevrátil přístupový token.' });
    }

    return reply(env, 'success', { token: data.access_token, provider: 'github' });
}

/** Stránka v přihlašovacím okně: předá výsledek administraci (jen povoleným adresám) a zavře se. */
function reply(env, status, content) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const message = `authorization:github:${status}:${JSON.stringify(content)}`;

    const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>Přihlášení</title></head>
<body><p>${status === 'success' ? 'Přihlášeno, okno se zavře…' : 'Přihlášení se nezdařilo.'}</p>
<script>
(function () {
    var allowed = ${JSON.stringify(allowed)};
    var message = ${JSON.stringify(message)};
    function receive(e) {
        if (allowed.indexOf(e.origin) === -1) return;
        window.opener.postMessage(message, e.origin);
        window.removeEventListener('message', receive, false);
        setTimeout(function () { window.close(); }, 300);
    }
    window.addEventListener('message', receive, false);
    if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Set-Cookie': `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
        },
    });
}

function readCookie(request, name) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
    return match ? match.slice(name.length + 1) : null;
}

function text(body, status) {
    return new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
