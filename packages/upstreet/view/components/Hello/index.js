import m from 'mithril'


export const Hello = () => {
  return {
    view({ attrs, children }) {
      return m( '', [
        m( 'h1', { id: attrs.titleID }, 'Hello' ),
        children,
      ])
    }
  }
}
