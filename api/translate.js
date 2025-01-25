if(process.env.NODE_ENV !== 'produciton'){
  (async ()=>{
    const dotenv = await import('dotenv');
    dotenv.config();
  })()
}
export default async function handler(req, resp) {
  if(req.method !== 'POST'){
    return resp.status(405).json({error:'Method Not Allow'});
  }
  const {text, target} = req.body;

  if(!text || !target){
    return resp.status(400).json({error:'Missing text or language'});
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API;
  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  try{
    const response = await fetch(apiUrl,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        target,
        format: 'text'
      })
    });

    if(!response.ok){
      const errorText = await response.text();
      return resp.status(response.status).json({error:errorText});
    }
    const data = await response.json();
    resp.status(200).json(data);
  }catch(error){
    console.log('Error in API call: ', error);
    resp.status(500).json({error:'Internal Server'})
  }
}