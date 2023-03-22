import { useEffect, useState } from 'react'

/*
http://localhost:3000/https://webaverse.github.io/procgen-assets/avatars/male-procgen.vrm
*/

/**
 * Base
 *
 * @type {import('next').NextPage}
 */
export default function Home() {
  const [baseUrl, setBaseUrl] = useState( '' )

  useEffect(() => {
    setBaseUrl( window.location.href )
  }, [])

  return <pre>{baseUrl}URL_TO_COMPILE</pre>
}