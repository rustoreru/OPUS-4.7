import { fetch as undiciFetch, ProxyAgent } from "undici";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

const dispatcher = process.env.HTTP_PROXY
  ? new ProxyAgent(process.env.HTTP_PROXY)
  : undefined;

export interface HttpOptions {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string | URLSearchParams;
  timeout?: number;
}

export async function http(url: string, opts: HttpOptions = {}): Promise<{
  status: number;
  text: string;
  headers: Record<string, string>;
  url: string;
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 15000);
  try {
    const resp = await undiciFetch(url, {
      method: opts.method ?? "GET",
      headers: {
        "user-agent": UA,
        "accept-language": "ru-RU,ru;q=0.9,en;q=0.8",
        ...opts.headers,
      },
      body: opts.body,
      redirect: "follow",
      signal: controller.signal,
      dispatcher,
    });
    const text = await resp.text();
    const headers: Record<string, string> = {};
    resp.headers.forEach((v, k) => {
      headers[k] = v;
    });
    return { status: resp.status, text, headers, url: resp.url };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Strip query-string entirely from a URL when building error messages so
 * that secrets passed as query params (e.g. Alloha token, KP API key) never
 * leak through `String(error)` to clients.
 */
export function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split("?")[0] ?? url;
  }
}

export async function httpJson<T = unknown>(
  url: string,
  opts: HttpOptions = {},
): Promise<T> {
  const r = await http(url, opts);
  if (r.status >= 400) {
    throw new Error(
      `${sanitizeUrl(url)} → HTTP ${r.status}: ${r.text.slice(0, 200)}`,
    );
  }
  return JSON.parse(r.text) as T;
}
