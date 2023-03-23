import { useEffect, useState } from 'react'

/*
http://localhost:3000/https://webaverse.github.io/procgen-assets/avatars/male-procgen.vrm
*/

const Home = () => {
  const [baseUrl, setBaseUrl] = useState( '' )

  useEffect(() => {
    setBaseUrl( window.location.href )
  }, [])

  return <pre>{baseUrl}URL_TO_COMPILE</pre>
}

export const Index = () => {
  return <Home />
}
