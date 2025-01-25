const voiceSelect = document.querySelector('#voiceSelect')
const playButton = document.querySelector('#playButton')
const textInput = document.querySelector('textarea')
const languageSelect = document.querySelector('#languageSelect')

const languages =[
  {code:'en',name:'English'},
  {code:'zh-CN',name:'Chinese(Simplified)'},
  {code:'ja',name:'Japanese'},
  {code:'es',name:'Spanish'},
]

//教程的方法
languages.forEach(({code, name})=>{
  const option = document.createElement('option');
  option.value = code;
  option.text = name;
  languageSelect.appendChild(option);
})


//Load available voices 
let voices =[];
const loadVoices = () => {
  voices = speechSynthesis.getVoices()
  voiceSelect.innerHTML = voices
    .map((voice, index)=>`<option value = "${index}">${voice.name} 
    (${voice.lang})</option>`)
    .join('');
}

//Trigger Loading Voice
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

//Translate funciton
const translateText = async (text,targetLanguage) => {
  try{
    const result = await fetch('http://localhost:3000/api/translate',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        target: targetLanguage
      })
    })
    if(!result.ok){
      throw new Error(`Error ${result.status}: ${await result.text()}`)
    }
    const data = await result.json();
    console.log(data.data);
    return data.data.translations[0].translatedText;
  }catch(error){
    console.error('Translate Error',error);
    alert('translation faild!!');
    return text;
  }
}

const playText = (text ,voiceIndex) =>{
  const utterance = new SpeechSynthesisUtterance(text);
  if(voices[voiceSelect.value]){
    utterance.voice = voices[voiceSelect.value]
  }
  speechSynthesis.speak(utterance);
}

//Paly TTS
playButton.addEventListener('click',async()=>{
  const text = textInput.value.trim();
  const targetLanguage = languageSelect.value;
  const selectedVoiceIndex =voiceSelect.value;

  if(!text){
    alert('input something');
    return;
  }
  try{
    const translatedText = await translateText(text, targetLanguage);
    playText(translatedText, selectedVoiceIndex);
  }catch(error){
    console.error('error during process',error);
    alert('An error')
  }
})