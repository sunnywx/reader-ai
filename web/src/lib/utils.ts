import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatSize=(bytes: number)=> {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// export const useDebounceFn = (callback: any, delay: number) => {
//   const fn=useCallback(
//     debounce(callback, delay, {trailing: true}), [callback, delay]
//   )
//   return fn
// };

// return full url with local proxy server
export const proxyUrl=(slug: string)=> {
  let prefix=process.env.NEXT_PUBLIC_PROXY_URL || 'http://127.0.0.1:3001'
  if(prefix.endsWith('/')){
    prefix=prefix.slice(0, -1)
  }
  return [prefix, slug].join('/')
}