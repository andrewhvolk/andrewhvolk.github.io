/* Section 5.3 geometry and offline angle explorer. No external dependencies. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.ReferenceAngleExplorer = api; api.bind(document); }
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const nearZero = x => Math.abs(x) < 1e-12 ? 0 : x;
  function geometry(degrees) {
    const t = ((degrees % 360) + 360) % 360;
    const a = t * Math.PI / 180;
    const x = nearZero(Math.cos(a)), y = nearZero(Math.sin(a));
    const axis = t % 90 === 0;
    const anchor = t < 90 ? 0 : t < 270 ? 180 : 360;
    const quadrant = axis ? null : ['I', 'II', 'III', 'IV'][Math.floor(t / 90)];
    return {degrees, normalized:t, x, y, quadrant,
      axis:axis ? ({0:'positive x-axis',90:'positive y-axis',180:'negative x-axis',270:'negative y-axis'})[t] : null,
      reference:axis ? null : Math.abs(t-anchor), anchor,
      sin:y, cos:x, tan:x === 0 ? null : y/x,
      csc:y === 0 ? null : 1/y, sec:x === 0 ? null : 1/x, cot:y === 0 ? null : x/y};
  }
  function radians(degrees) {
    if (!degrees) return '0';
    const gcd=(a,b)=>b?gcd(b,a%b):a;
    const g=gcd(Math.abs(degrees),180), n=degrees/g, d=180/g;
    return `${n===1?'':n===-1?'−':n<0?'−'+Math.abs(n):n}π${d===1?'':'/'+d}`;
  }
  const at=(r,a)=>[250+r*Math.cos(a*Math.PI/180),230-r*Math.sin(a*Math.PI/180)];
  function arc(r,start,end,grow=0) {
    const count=Math.max(12,Math.ceil(Math.abs(end-start)/3));
    return Array.from({length:count+1},(_,i)=>{
      const f=i/count;return at(r+grow*f,start+(end-start)*f).map(v=>v.toFixed(3)).join(',');
    }).join(' ');
  }
  const sign=v=>v===null?'undefined':v===0?'zero':v>0?'positive':'negative';
  function bind(doc) {
    doc.querySelectorAll('[data-reference-angle-explorer]').forEach(panel=>{
      const slider=panel.querySelector('input[type=range]');
      const reveal=panel.querySelector('[data-explorer-reveal]');
      const results=panel.querySelector('[data-explorer-results]');
      const svg=panel.querySelector('svg');
      const initial=Number(slider.value); let shown=false;
      const prefix=panel.id;
      function draw() {
        const m=geometry(Number(slider.value));
        panel.dataset.degrees=String(m.degrees);
        panel.querySelector('output').textContent=`θ = ${m.degrees}° = ${radians(m.degrees)} rad`;
        const p=at(165,m.normalized);
        svg.setAttribute('aria-label',`Angle ${m.degrees} degrees from the positive x-axis. ${shown?(m.axis||'Quadrant '+m.quadrant)+'. '+(m.reference===null?'No acute reference angle.':'Reference angle '+m.reference+' degrees.'):'Predict the reference angle and signs, then reveal the reasoning.'}`);
        svg.innerHTML=`<defs><marker id="${prefix}-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#075ea8"/></marker></defs>
          <line x1="40" y1="230" x2="460" y2="230" stroke="#94a3b8" stroke-width="2"/>
          <line x1="250" y1="30" x2="250" y2="430" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="250" cy="230" r="165" fill="none" stroke="#cbd5e1" stroke-width="2"/>
          <text x="455" y="215">x</text><text x="263" y="35">y</text>
          <text x="418" y="256">1</text><text x="66" y="256">−1</text>
          <line x1="250" y1="230" x2="445" y2="230" stroke="#075ea8" stroke-width="4"/>
          <polyline data-rotation points="${arc(54,0,m.degrees,Math.abs(m.degrees)>360?24:0)}" fill="none" stroke="#075ea8" stroke-width="4" marker-end="url(#${prefix}-blue)"/>
          <line x1="250" y1="230" x2="${p[0]}" y2="${p[1]}" stroke="#087f8c" stroke-width="5"/>
          <circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#087f8c"/>
          ${shown&&m.reference!==null?`<polyline data-reference points="${arc(112,m.anchor,m.normalized)}" fill="none" stroke="#c45a0a" stroke-width="5"/><text x="${at(138,(m.anchor+m.normalized)/2)[0]}" y="${at(138,(m.anchor+m.normalized)/2)[1]}" fill="#c45a0a">α</text>`:''}
          <text x="35" y="472" class="explorer-legend">Blue: θ from +x. Orange: α to the x-axis.</text>`;
        results.textContent=`${m.axis||'Quadrant '+m.quadrant}. ${m.reference===null?'An axis angle has no acute reference angle.':`Reference angle α = ${m.reference}° = ${radians(m.reference)} rad.`} Sine: ${sign(m.sin)}. Cosine: ${sign(m.cos)}. Tangent: ${sign(m.tan)}.`;
        results.hidden=!shown;
        reveal.textContent=shown?'Hide reasoning':'Show reasoning';
        reveal.setAttribute('aria-expanded',String(shown));
      }
      slider.addEventListener('input',()=>{shown=false;draw();});
      panel.querySelectorAll('[data-angle-preset]').forEach(button=>button.addEventListener('click',()=>{
        slider.value=button.dataset.anglePreset;shown=false;draw();
      }));
      reveal.addEventListener('click',()=>{shown=!shown;draw();});
      panel.closest('section').addEventListener('math130:reset',()=>{slider.value=initial;shown=false;draw();});
      draw();
    });
  }
  return {geometry,radians,bind};
});
