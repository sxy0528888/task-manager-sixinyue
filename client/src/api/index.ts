// 轻量请求封装（已脱离妙搭平台 client-toolkit，使用原生 fetch）
export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    let message = `请求失败（HTTP ${response.status}）`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* 忽略解析失败 */
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  try {
    return (await response.json()) as T;
  } catch {
    return undefined as T;
  }
}

export * as tasksApi from './tasks';

// 后续新增 API 时直接调用 request，例如：
// export async function getUserData(userId: string) {
//   return request(`/api/users/${userId}`);
// }
