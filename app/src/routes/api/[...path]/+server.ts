import { env } from '$env/dynamic/private';

export async function GET({ params, url, fetch }) {
  const path = params.path;
  const query = url.search;

  const response = await fetch(`${env.API_PATH}/${path}${query}`);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
