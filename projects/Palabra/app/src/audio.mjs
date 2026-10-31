export function voiceReadiness(voices,loaded,preferred='auto'){
 const spanish=voices.filter(v=>/^es[-_]/i.test(v.lang));
 const voice=spanish.find(v=>v.voiceURI===preferred)||spanish[0]||null;
 return {voice,spanish,status:voice?`${preferred!=='auto'&&voice.voiceURI!==preferred?'Selected voice unavailable; using ':''}${voice.name} · ${voice.lang}${voice.localService===false?' · may need internet':''}`:loaded?'No Spanish voice is available. Use the labeled text fallback.':'Spanish voices are loading…',fallback:preferred!=='auto'&&!!voice&&voice.voiceURI!==preferred};
}
