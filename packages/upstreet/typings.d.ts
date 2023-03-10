declare module '*.glb'
declare module '*.vrm'

declare module '*.scss'

declare module '@soulofmischief/js-utils' {
  export function throttle(
    /** Throttle Function */
    func: Function,
    /** Milliseconds */
    wait?: number,
    options?: {
      leading: boolean
      trailing: boolean
    }
  ): () => any
}
