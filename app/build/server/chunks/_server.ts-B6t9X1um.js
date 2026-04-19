import { b as private_env } from './shared-server-DaWdgxVh.js';

async function GET({ params, url, fetch }) {
  const path = params.path;
  const query = url.search;
  const response = await fetch(`${private_env.API_PATH}/${path}${query}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}

export { GET };
//# sourceMappingURL=_server.ts-B6t9X1um.js.map
