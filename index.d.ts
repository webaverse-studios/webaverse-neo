declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

declare module '*.module.scss' {
  const content: { [key: string]: any }
  export = content
}
