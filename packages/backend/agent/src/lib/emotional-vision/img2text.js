export const describe = async (imageBase64) => {
  const response = await fetch(
    'https://stable-diffusion.webaverse.com/sdapi/v1/interrogate',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        model: 'clip',
      }),
    }
  )
  const data = await response.json()
  console.log('data', data)
  return data.caption
}
