import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#f5f5f7", card:"#fff", accent:"#0071e3", acH:"#0264c8",
  text:"#1d1d1f", sub:"#515154", muted:"#86868b",
  border:"rgba(0,0,0,0.09)", bL:"rgba(0,0,0,0.055)",
  inp:"#f5f5f7", seg:"rgba(118,118,128,0.16)", green:"#34c759", red:"#ff3b30",
};
const F = "-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif";
const M = "ui-monospace,'SF Mono',Menlo,monospace";

const IC = { up:"M8 11V3M5 6l3-3 3 3M2 13h12", dn:"M8 3v8M5 8l3 3 3-3M2 13h12",
  chk:"M2 8l4 4 8-8", plus:"M8 3v10M3 8h10", trash:"M3 4h10M6 4V2.5h4V4M5 4l.5 9h5L11 4",
  img:"M2 3h12v10H2zM2 10l3-3 3 3 2-2 3 3" };
const Ico = ({d,sz=14,sw=1.5}) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" fill="none" style={{display:"block",flexShrink:0}}>
    <path d={d} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const cmykToRgb=(c,m,y,k)=>({r:Math.round(255*(1-c/100)*(1-k/100)),g:Math.round(255*(1-m/100)*(1-k/100)),b:Math.round(255*(1-y/100)*(1-k/100))});
const rgbToHex=(r,g,b)=>"#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
const cmykHex=(c,m,y,k)=>{const{r,g,b}=cmykToRgb(c,m,y,k);return rgbToHex(r,g,b);};

const sc=(lines)=>lines.map(([x1,y1,x2,y2])=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b0b0b8" stroke-width="0.7" stroke-dasharray="4,2.5"/>`).join("");
const lb=(items)=>items.map(([x,y,t])=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="5" fill="#cccccc" font-family="system-ui" font-weight="600">${t}</text>`).join("");

const TPLS = [
  { id:"1", name:"Plantilla 1", sub:"Tuck-end", w:225, h:150,
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 150" width="225" height="150"><rect width="225" height="150" fill="white"/><path d="M35,0 H105 V25 H225 V125 H105 V150 H35 V125 H0 V25 Z" fill="#f8f8f8" stroke="#1a1a1a" stroke-width="1.2" stroke-linejoin="round"/>${sc([[35,0,35,150],[105,0,105,150],[140,25,140,125],[210,25,210,125],[0,25,225,25],[0,125,225,125]])}${lb([[17,75,"LADO"],[70,75,"FRENTE"],[122,75,"LADO"],[174,75,"REVERSO"]])}</svg>` },
  { id:"2", name:"Plantilla 2", sub:"Reverse tuck", w:225, h:150,
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 150" width="225" height="150"><rect width="225" height="150" fill="white"/><path d="M35,0 H105 V25 H225 V125 H210 V150 H140 V125 H0 V25 Z" fill="#f8f8f8" stroke="#1a1a1a" stroke-width="1.2" stroke-linejoin="round"/>${sc([[35,0,35,150],[105,0,105,150],[140,25,140,150],[210,25,210,125],[0,25,225,25],[0,125,225,125]])}${lb([[17,75,"LADO"],[70,75,"FRENTE"],[122,75,"LADO"],[174,75,"REVERSO"]])}</svg>` },
  { id:"3", name:"Plantilla 3", sub:"Bandeja cruz", w:240, h:180,
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180"><rect width="240" height="180" fill="white"/><path d="M40,0 H200 V40 H240 V140 H200 V180 H40 V140 H0 V40 Z" fill="#f8f8f8" stroke="#1a1a1a" stroke-width="1.2" stroke-linejoin="round"/>${sc([[40,0,40,180],[200,0,200,180],[0,40,240,40],[0,140,240,140]])}${lb([[120,90,"BASE"],[20,90,"LADO"],[220,90,"LADO"],[120,20,"TAPA"],[120,162,"FONDO"]])}</svg>` },
  { id:"4", name:"Plantilla 4", sub:"Caja almohada", w:180, h:260,
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 260" width="180" height="260"><rect width="180" height="260" fill="white"/><path d="M0,50 Q90,5 180,50 L180,210 Q90,255 0,210 Z" fill="#f8f8f8" stroke="#1a1a1a" stroke-width="1.2"/><line x1="90" y1="28" x2="90" y2="232" stroke="#b0b0b8" stroke-width="0.7" stroke-dasharray="4,2.5"/>${lb([[45,130,"PANEL A"],[135,130,"PANEL B"]])}</svg>` },
  { id:"5", name:"Plantilla 5", sub:"Hexagonal", w:300, h:160,
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="300" height="160"><rect width="300" height="160" fill="white"/><path d="M0,0 H50 V30 H100 V0 H150 V30 H200 V0 H250 V30 H300 V160 H250 V130 H200 V160 H150 V130 H100 V160 H50 V130 H0 Z" fill="#f8f8f8" stroke="#1a1a1a" stroke-width="1.2" stroke-linejoin="round"/>${sc([[50,0,50,160],[100,0,100,160],[150,0,150,160],[200,0,200,160],[250,0,250,160],[0,30,300,30],[0,130,300,130]])}${lb([[25,80,"P1"],[75,80,"P2"],[125,80,"P3"],[175,80,"P4"],[225,80,"P5"],[275,80,"P6"]])}</svg>` },
  { id:"persuade", name:"Persuade 33×46×12", sub:"Bolsa stamping", w:940, h:600,
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 600" width="940" height="600"><rect width="940" height="600" fill="white"/><path d="M0,0 H940 V600 H0 Z" fill="#f9f9f9" stroke="#1a1a1a" stroke-width="1.5"/><line x1="20" y1="0" x2="20" y2="600" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="80" y1="0" x2="80" y2="600" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="410" y1="0" x2="410" y2="600" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="470" y1="60" x2="470" y2="520" stroke="#999" stroke-width="0.6" stroke-dasharray="3,3"/><line x1="530" y1="0" x2="530" y2="600" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="860" y1="0" x2="860" y2="600" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="920" y1="0" x2="920" y2="600" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="0" y1="60" x2="940" y2="60" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="0" y1="520" x2="940" y2="520" stroke="#b0b0b8" stroke-width="0.8" stroke-dasharray="5,3"/><line x1="80" y1="520" x2="0" y2="600" stroke="#b0b0b8" stroke-width="0.7" stroke-dasharray="4,3"/><line x1="410" y1="520" x2="330" y2="600" stroke="#b0b0b8" stroke-width="0.7" stroke-dasharray="4,3"/><line x1="530" y1="520" x2="610" y2="600" stroke="#b0b0b8" stroke-width="0.7" stroke-dasharray="4,3"/><line x1="860" y1="520" x2="940" y2="600" stroke="#b0b0b8" stroke-width="0.7" stroke-dasharray="4,3"/><line x1="245" y1="0" x2="245" y2="60" stroke="#00c89a" stroke-width="0.7"/><line x1="695" y1="0" x2="695" y2="60" stroke="#00c89a" stroke-width="0.7"/><text x="245" y="305" text-anchor="middle" font-size="22" fill="#d0d0d0" font-family="system-ui" font-weight="700">FRENTE</text><text x="695" y="305" text-anchor="middle" font-size="22" fill="#d0d0d0" font-family="system-ui" font-weight="700">FONDO</text><text x="470" y="305" text-anchor="middle" font-size="12" fill="#cccccc" font-family="system-ui" font-weight="600">GUSSET</text><text x="50" y="305" text-anchor="middle" font-size="11" fill="#cccccc" font-family="system-ui" transform="rotate(-90,50,305)">LATERAL</text><text x="890" y="305" text-anchor="middle" font-size="11" fill="#cccccc" font-family="system-ui" transform="rotate(-90,890,305)">LATERAL</text></svg>` },
];

function svgToImg(svgStr, cb) {
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
  const img = new Image();
  img.onload = () => cb(img);
  img.onerror = () => console.error("svg load fail");
  img.src = url;
}

function removeBg(img, tol=40) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth||img.width; c.height = img.naturalHeight||img.height;
  const ctx = c.getContext("2d"); ctx.drawImage(img,0,0);
  const data = ctx.getImageData(0,0,c.width,c.height); const d = data.data;
  const corners=[[0,0],[c.width-1,0],[0,c.height-1],[c.width-1,c.height-1]];
  const s = corners.map(([x,y])=>{const i=(y*c.width+x)*4;return[d[i],d[i+1],d[i+2]];});
  const [bgR,bgG,bgB]=[0,1,2].map(i=>Math.round(s.reduce((a,v)=>a+v[i],0)/4));
  const visited=new Uint8Array(c.width*c.height);
  const queue=corners.map(([x,y])=>y*c.width+x);
  while(queue.length){
    const idx=queue.pop(); if(visited[idx])continue; visited[idx]=1;
    const pi=idx*4;
    if(Math.abs(d[pi]-bgR)+Math.abs(d[pi+1]-bgG)+Math.abs(d[pi+2]-bgB)>tol*3)continue;
    d[pi+3]=0;
    const x=idx%c.width, y=Math.floor(idx/c.width);
    if(x>0)queue.push(idx-1); if(x<c.width-1)queue.push(idx+1);
    if(y>0)queue.push(idx-c.width); if(y<c.height-1)queue.push(idx+c.width);
  }
  ctx.putImageData(data,0,0); return c.toDataURL("image/png");
}

const Label=({children})=><div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:8,fontFamily:F}}>{children}</div>;
const Divider=()=><div style={{height:1,background:C.bL,margin:"0 -20px 20px"}}/>;

function Seg({opts,val,onChange}){
  return <div style={{display:"flex",background:C.seg,borderRadius:9,padding:2}}>
    {opts.map(o=><button key={o.v} onClick={()=>onChange(o.v)} style={{flex:1,padding:"6px 8px",fontSize:12,fontWeight:500,fontFamily:F,border:"none",borderRadius:7,cursor:"pointer",transition:"all 0.13s",background:val===o.v?C.card:"transparent",color:val===o.v?C.text:C.muted,boxShadow:val===o.v?"0 1px 3px rgba(0,0,0,0.11)":"none"}}>{o.l}</button>)}
  </div>;
}

function NumField({label,value,onChange,placeholder,step="0.01"}){
  const [focus,setFocus]=useState(false);
  return <div>
    {label&&<div style={{fontSize:11,color:C.muted,marginBottom:4,fontFamily:F}}>{label}</div>}
    <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder??""} step={step} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{width:"100%",padding:"8px 10px",background:C.inp,border:`1.5px solid ${focus?C.accent:"transparent"}`,borderRadius:8,fontSize:13,fontFamily:M,color:C.text,outline:"none",MozAppearance:"textfield"}}/>
  </div>;
}

function Dropdown({options,value,onChange,placeholder}){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  const sel=options.filter(o=>!o.divider).find(o=>o.value===value);
  useEffect(()=>{const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};if(open)document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[open]);
  return <div ref={ref} style={{position:"relative",userSelect:"none"}}>
    <button onClick={()=>setOpen(v=>!v)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:C.inp,border:`1.5px solid ${open?C.accent:"transparent"}`,borderRadius:8,fontSize:13,fontFamily:F,cursor:"pointer",outline:"none",color:sel?C.text:C.muted}}>
      <span style={{display:"flex",alignItems:"center",gap:8,overflow:"hidden"}}>{sel?<><span style={{fontWeight:500,whiteSpace:"nowrap"}}>{sel.label}</span>{sel.sub&&<span style={{color:C.muted,fontSize:11,flexShrink:0}}>— {sel.sub}</span>}</>:placeholder}</span>
      <span style={{color:C.muted,display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform 0.18s",marginLeft:6}}>▾</span>
    </button>
    {open&&<div style={{position:"absolute",top:"calc(100% + 5px)",left:0,right:0,zIndex:400,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,0.13)",overflow:"hidden"}}>
      {options.map((o,i)=>{
        if(o.divider)return<div key={i} style={{height:1,background:C.bL,margin:"3px 0"}}/>;
        const isSel=o.value===value;
        return <div key={o.value} onClick={()=>{onChange(o.value);setOpen(false);}} style={{padding:"9px 12px",cursor:"pointer",fontSize:13,fontFamily:F,background:isSel?"#eff6ff":"transparent",color:isSel?C.accent:C.text}} onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=C.bg;}} onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=isSel?"#eff6ff":"transparent";}}>
          <span style={{fontWeight:isSel?600:400}}>{o.label}</span>{o.sub&&<span style={{color:C.muted,fontSize:11,marginLeft:6}}>{o.sub}</span>}
        </div>;
      })}
    </div>}
  </div>;
}

function CmykPicker({cmyk,onChange}){
  const ks=[["c","Cian","#00b4d8"],["m","Magenta","#e5007d"],["y","Amarillo","#d4a017"],["k","Negro","#555"]];
  const hex=cmykHex(cmyk.c,cmyk.m,cmyk.y,cmyk.k);
  return <div>
    {ks.map(([k,label,col])=><div key={k} style={{marginBottom:8}}>
      <div style={{fontSize:10,color:C.muted,marginBottom:3,fontFamily:F}}>{label} ({k.toUpperCase()})</div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <input type="range" min="0" max="100" value={cmyk[k]} onChange={e=>onChange({...cmyk,[k]:Number(e.target.value)})} style={{flex:1,accentColor:col,cursor:"pointer"}}/>
        <input type="number" min="0" max="100" value={cmyk[k]} onChange={e=>onChange({...cmyk,[k]:Math.min(100,Math.max(0,Number(e.target.value)||0))})} style={{width:40,padding:"4px 6px",background:C.inp,border:"none",borderRadius:6,fontSize:11,fontFamily:M,color:C.text,outline:"none",MozAppearance:"textfield",textAlign:"center"}}/>
      </div>
    </div>)}
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.bg,borderRadius:8,marginTop:6}}>
      <div style={{width:28,height:28,borderRadius:6,background:hex,border:"1px solid rgba(0,0,0,0.1)",flexShrink:0}}/>
      <div><div style={{fontSize:11,fontFamily:M,color:C.text,fontWeight:500}}>{hex.toUpperCase()}</div><div style={{fontSize:10,color:C.muted}}>C{cmyk.c} M{cmyk.m} Y{cmyk.y} K{cmyk.k}</div></div>
      <div style={{display:"flex",gap:5,marginLeft:"auto"}}>
        {[{l:"W",c:0,m:0,y:0,k:0},{l:"K",c:0,m:0,y:0,k:100},{l:"Kr",c:0,m:10,y:30,k:25}].map(pr=>(
          <button key={pr.l} onClick={()=>onChange(pr)} title={pr.l} style={{width:22,height:22,borderRadius:4,cursor:"pointer",border:"1px solid rgba(0,0,0,0.12)",background:cmykHex(pr.c,pr.m,pr.y,pr.k),fontSize:9,fontFamily:F,color:pr.k>50?"#fff":C.text}}>{pr.l}</button>
        ))}
      </div>
    </div>
  </div>;
}

/* Each layer: {id, img, src, name, natR, w, h, keepR, rot, bgRem, hMode, vMode, hMar, vMar, exX, exY} */
const newLayer = (id) => ({
  id, img:null, src:null, name:"", natR:2, w:60, h:30, keepR:true, rot:0, bgRem:false,
  hMode:"left", vMode:"top", hMar:10, vMar:10, exX:"", exY:"",
});

export default function App(){
  const [tplId,setTplId]=useState(null);
  const [tplImg,setTplImg]=useState(null);
  const [tplW,setTplW]=useState(210);
  const [tplH,setTplH]=useState(297);
  const [custImg,setCustImg]=useState(null);
  const [custName,setCustName]=useState("");
  const [showCustom,setShowCustom]=useState(false);

  const [layers,setLayers]=useState([newLayer(1)]);
  const [activeId,setActiveId]=useState(1);
  const [bgProc,setBgProc]=useState(false);

  const [unit,setUnit]=useState("mm");
  const [bgCmyk,setBgCmyk]=useState({c:0,m:0,y:0,k:0});
  const [showBg,setShowBg]=useState(false);
  const [coords,setCoords]=useState(null);

  const canvasRef=useRef(null);
  const areaRef=useRef(null);
  const [jsPdfReady,setJsPdfReady]=useState(false);

  // ---- Gemini AI Chat ----
  const [aiChat,setAiChat]=useState([]);
  const [aiInput,setAiInput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const aiChatEndRef=useRef(null);

  const GEMINI_KEY=import.meta.env.VITE_GEMINI_API_KEY;
  const SYSTEM_PROMPT=`Eres un asistente especializado en diseño de packaging con troqueles ABELLAPACK.
Tu trabajo es entender lo que el usuario quiere cambiar y ejecutarlo.

PARÁMETROS CONTROLABLES:
- Color de fondo CMYK: C/M/Y/K (0-100). Ej: "fondo azul" → C:100, M:50, Y:0, K:0
- Dimensiones: ancho/alto en mm. Ej: "hazlo 50mm más ancho"
- Rotación del logo: 0, 90, 180, -90 grados
- Posición del logo: izquierda/centro/derecha, arriba/centro/abajo
- Escala del logo: 0.5 a 3.0 (1.0 = 100%)
- Plantilla: "Tuck-end", "Reverse tuck", "Bandeja cruz", "Caja almohada", "Hexagonal"
- Fondo blanco del logo: quitar/mantener

RESPONDE SIEMPRE EN ESTE JSON + TEXTO:
{"cambios": {"bgCmyk": {"c": 100, "m": 0, "y": 100, "k": 0}, "tplW": 280, "tplH": 150, "layerRot": 45, "layerScale": 1.2, "tplId": "3"}, "mensaje": "He puesto fondo amarillo, ampliado a 280×150mm, girado 45° y seleccionado la Bandeja cruz"}

Si no entiendes, pregunta aclaraciones (sin JSON).
SIEMPRE confirma qué has cambiado.`;

  async function sendToGemini(){
    if(!aiInput.trim())return;
    if(!GEMINI_KEY){alert("⚠️ Falta API key (VITE_GEMINI_API_KEY en Railway)");return;}
    
    const newMsg={role:"user",text:aiInput};
    setAiChat(prev=>[...prev,newMsg]);
    setAiInput("");
    setAiLoading(true);

    try{
      const conv=aiChat.map(m=>`${m.role==="user"?"Usuario":"IA"}: ${m.text}`).join("\n")+"\nUsuario: "+aiInput;
      const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+GEMINI_KEY,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system_instruction:{parts:[{text:SYSTEM_PROMPT}]},
          contents:[{parts:[{text:conv}]}]
        })
      });
      if(!res.ok)throw new Error("Gemini API error: "+res.status);
      const data=await res.json();
      const aiResp=(data.candidates?.[0]?.content?.parts?.[0]?.text||"No entiendo").trim();
      
      // parse JSON from response
      let changes={};
      try{
        const match=aiResp.match(/\{[^{}]*"cambios"[^{}]*\}/);
        if(match)changes=JSON.parse(match[0]).cambios||{};
      }catch(e){console.log("no JSON found");}
      
      // apply changes
      if(changes.bgCmyk)setBgCmyk(changes.bgCmyk);
      if(changes.tplW)setTplDim("w",fromMM(changes.tplW));
      if(changes.tplH)setTplDim("h",fromMM(changes.tplH));
      if(changes.layerRot!==undefined&&active)updateLayer(active.id,{rot:changes.layerRot});
      if(changes.layerScale!==undefined&&active){
        const nW=Math.max(3,(active.natW||10)*changes.layerScale);
        const nH=Math.max(3,(active.natH||10)*changes.layerScale);
        updateLayer(active.id,{w:nW,h:nH});
      }
      if(changes.tplId){
        const found=TPLS.find(t=>t.id===changes.tplId);
        if(found)handleTplSelect(changes.tplId);
      }
      
      setAiChat(prev=>[...prev,{role:"ai",text:aiResp}]);
      setTimeout(()=>aiChatEndRef.current?.scrollIntoView({behavior:"smooth"}),100);
    }catch(err){
      console.error(err);
      setAiChat(prev=>[...prev,{role:"ai",text:"❌ Error: "+err.message}]);
    }
    setAiLoading(false);
  }

  useEffect(()=>{
    if(window.jspdf){setJsPdfReady(true);return;}
    const load=src=>new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=()=>{setJsPdfReady(true);res();};s.onerror=rej;document.head.appendChild(s);});
    load("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js").catch(()=>load("https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js")).catch(()=>{});
  },[]);

  const toMM=v=>unit==="cm"?v*10:v;
  const fromMM=v=>unit==="cm"?v/10:v;
  const dp=v=>parseFloat(fromMM(v).toFixed(unit==="cm"?3:2));

  const active=layers.find(l=>l.id===activeId)||layers[0];

  function updateLayer(id,patch){
    setLayers(ls=>ls.map(l=>l.id===id?{...l,...patch}:l));
  }

  function computeXY(layer){
    const {w:lW,h:lH,hMar:hM,vMar:vM,hMode,vMode,exX,exY}=layer;
    const x=exX!==""?toMM(parseFloat(exX)):hMode==="left"?hM:hMode==="center"?(tplW-lW)/2:tplW-lW-hM;
    const y=exY!==""?toMM(parseFloat(exY)):vMode==="top"?vM:vMode==="center"?(tplH-lH)/2:tplH-lH-vM;
    return{x,y};
  }

  // store a layer position as absolute mm (in display unit) so it never jumps
  function pinLayer(id,patch={}){
    const l=layers.find(x=>x.id===id); if(!l)return;
    const{x,y}=computeXY(l);
    updateLayer(id,{exX:String(+fromMM(x).toFixed(2)),exY:String(+fromMM(y).toFixed(2)),...patch});
  }

  // change template dimension WITHOUT moving placed logos
  function setTplDim(which,val){
    const v=toMM(parseFloat(val)||0);
    setLayers(ls=>ls.map(l=>{
      if(!l.img)return l;
      const{x,y}=computeXY(l);
      return{...l,exX:String(+fromMM(x).toFixed(2)),exY:String(+fromMM(y).toFixed(2))};
    }));
    which==="w"?setTplW(v):setTplH(v);
  }

  const viewRef=useRef({sc:1,RM:0});
  const dragRef=useRef(null);
  const [guides,setGuides]=useState([]);       // transient snap guides (pink)
  const [uGuides,setUGuides]=useState([]);      // user guides from rulers (cyan)
  const [hoverCur,setHoverCur]=useState("default");
  const RM=22; // ruler band thickness (px)

  // DRAW
  useEffect(()=>{
    const canvas=canvasRef.current,area=areaRef.current;
    if(!canvas||!area)return;
    const ctx=canvas.getContext("2d");
    const aw=area.clientWidth-64-RM,ah=area.clientHeight-64-RM;
    const sc=Math.min(aw/tplW,ah/tplH,6);
    const TW=Math.round(tplW*sc),TH=Math.round(tplH*sc);
    canvas.width=TW+RM;canvas.height=TH+RM;
    viewRef.current={sc,RM};

    // template background
    const{r,g,b}=cmykToRgb(bgCmyk.c,bgCmyk.m,bgCmyk.y,bgCmyk.k);
    ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(RM,RM,TW,TH);

    const src=tplImg||custImg;
    if(src)ctx.drawImage(src,RM,RM,TW,TH);
    else{
      ctx.strokeStyle="#d2d2d7";ctx.lineWidth=1.5;ctx.setLineDash([7,4]);
      ctx.strokeRect(RM+1,RM+1,TW-2,TH-2);ctx.setLineDash([]);
      ctx.fillStyle="#aeaeb2";ctx.font=`500 13px ${F}`;ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText("Selecciona o sube una plantilla",RM+TW/2,RM+TH/2);
    }

    // ---- user guides (cyan, draggable from rulers) ----
    const fmtU=v=>{const d=unit==="cm"?v/10:v;return(Number.isInteger(d)?String(d):d.toFixed(unit==="cm"?2:1))+(unit==="cm"?"":"");};
    uGuides.forEach(g=>{
      ctx.save();ctx.strokeStyle="#00b4d8";ctx.lineWidth=1;ctx.setLineDash([6,3]);
      ctx.beginPath();
      if(g.type==="v"){const gx=RM+g.pos*sc;ctx.moveTo(gx,RM);ctx.lineTo(gx,RM+TH);}
      else{const gy=RM+g.pos*sc;ctx.moveTo(RM,gy);ctx.lineTo(RM+TW,gy);}
      ctx.stroke();ctx.setLineDash([]);
      // distance label pill
      const txt=fmtU(g.pos)+" "+unit;ctx.font=`600 9px ${F}`;
      const tw=ctx.measureText(txt).width+10;
      ctx.fillStyle="#00b4d8";
      if(g.type==="v"){const gx=RM+g.pos*sc;ctx.fillRect(gx+2,RM+3,tw,13);ctx.fillStyle="#fff";ctx.textAlign="left";ctx.textBaseline="middle";ctx.fillText(txt,gx+7,RM+10);}
      else{const gy=RM+g.pos*sc;ctx.fillRect(RM+3,gy-15,tw,13);ctx.fillStyle="#fff";ctx.textAlign="left";ctx.textBaseline="middle";ctx.fillText(txt,RM+8,gy-8);}
      ctx.restore();
    });

    // ---- snap guides (under handles) ----
    if(guides.length){
      ctx.save();ctx.strokeStyle="#ff2d95";ctx.lineWidth=1;ctx.setLineDash([5,3]);
      guides.forEach(gd=>{
        ctx.beginPath();
        if(gd.type==="v"){const gx=RM+gd.pos*sc;ctx.moveTo(gx,RM);ctx.lineTo(gx,RM+TH);}
        else{const gy=RM+gd.pos*sc;ctx.moveTo(RM,gy);ctx.lineTo(RM+TW,gy);}
        ctx.stroke();
      });
      ctx.restore();
    }

    // ---- layers ----
    let activeCoords=null;
    layers.forEach(layer=>{
      if(!layer.img)return;
      const{x,y}=computeXY(layer);
      const px=RM+x*sc,py=RM+y*sc,pw=layer.w*sc,ph=layer.h*sc;
      ctx.save();
      ctx.translate(px+pw/2,py+ph/2);ctx.rotate(layer.rot*Math.PI/180);
      ctx.drawImage(layer.img,-pw/2,-ph/2,pw,ph);
      const isActive=layer.id===activeId;
      ctx.strokeStyle=isActive?C.accent:"rgba(0,113,227,0.35)";
      ctx.lineWidth=isActive?1.8:1.2;ctx.setLineDash(isActive?[]:[4,3]);
      ctx.strokeRect(-pw/2,-ph/2,pw,ph);
      if(isActive){
        ctx.setLineDash([]);const hs=9;
        [[-pw/2,-ph/2],[pw/2,-ph/2],[-pw/2,ph/2],[pw/2,ph/2]].forEach(([hx,hy])=>{
          ctx.fillStyle="#fff";ctx.fillRect(hx-hs/2,hy-hs/2,hs,hs);
          ctx.strokeStyle=C.accent;ctx.lineWidth=1.5;ctx.strokeRect(hx-hs/2,hy-hs/2,hs,hs);
        });
      }
      ctx.restore();
      if(isActive)activeCoords={x:fromMM(x).toFixed(2),y:fromMM(y).toFixed(2),w:fromMM(layer.w).toFixed(2),h:fromMM(layer.h).toFixed(2)};
    });

    // ---- rulers ----
    ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,RM);ctx.fillRect(0,0,RM,canvas.height);
    ctx.fillStyle="#fafafa";ctx.fillRect(0,0,RM,RM);
    ctx.strokeStyle="#e2e2e7";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,RM-0.5);ctx.lineTo(canvas.width,RM-0.5);ctx.moveTo(RM-0.5,0);ctx.lineTo(RM-0.5,canvas.height);ctx.stroke();

    const niceSteps=[1,2,5,10,20,25,50,100,200,500];
    let step=niceSteps[niceSteps.length-1];
    for(const s of niceSteps){if(s*sc>=9){step=s;break;}}
    const labelEvery=step*sc>=32?1:Math.ceil(32/(step*sc));
    ctx.fillStyle="#9a9aa0";ctx.font=`9px ${F}`;ctx.strokeStyle="#c8c8cd";ctx.lineWidth=1;
    const fmt=v=>{const d=unit==="cm"?v/10:v;return Number.isInteger(d)?String(d):d.toFixed(1);};
    // top
    ctx.textAlign="center";ctx.textBaseline="bottom";
    for(let mm=0,i=0;mm<=tplW+0.01;mm+=step,i++){
      const gx=RM+mm*sc;const big=i%labelEvery===0;
      ctx.beginPath();ctx.moveTo(gx,RM);ctx.lineTo(gx,big?RM-7:RM-4);ctx.stroke();
      if(big&&mm>0&&mm<tplW-step*0.4)ctx.fillText(fmt(mm),gx,RM-8);
    }
    // left
    ctx.textAlign="center";ctx.textBaseline="middle";
    for(let mm=0,i=0;mm<=tplH+0.01;mm+=step,i++){
      const gy=RM+mm*sc;const big=i%labelEvery===0;
      ctx.beginPath();ctx.moveTo(RM,gy);ctx.lineTo(big?RM-7:RM-4,gy);ctx.stroke();
      if(big&&mm>0&&mm<tplH-step*0.4){ctx.save();ctx.translate(RM-9,gy);ctx.rotate(-Math.PI/2);ctx.fillText(fmt(mm),0,0);ctx.restore();}
    }
    setCoords(activeCoords);
  },[tplImg,custImg,tplW,tplH,layers,activeId,unit,bgCmyk,guides,uGuides]);

  useEffect(()=>{const fn=()=>setTplW(w=>w);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);

  // ---- mouse interaction (drag + resize + snap) ----
  function evtMM(e){
    const canvas=canvasRef.current;const{sc,RM}=viewRef.current;
    const rect=canvas.getBoundingClientRect();
    const fx=canvas.width/rect.width,fy=canvas.height/rect.height;
    const px=(e.clientX-rect.left)*fx-RM,py=(e.clientY-rect.top)*fy-RM;
    return{mx:px/sc,my:py/sc};
  }
  // pointer -> active layer local frame (mm)
  function toLocal(layer,mx,my){
    const{x,y}=computeXY(layer);const cx=x+layer.w/2,cy=y+layer.h/2;
    const a=-layer.rot*Math.PI/180,dx=mx-cx,dy=my-cy;
    return{lx:dx*Math.cos(a)-dy*Math.sin(a),ly:dx*Math.sin(a)+dy*Math.cos(a),cx,cy};
  }
  const CORNERS=[[-1,-1],[1,-1],[-1,1],[1,1]]; // TL TR BL BR

  function hitTest(layer,mx,my){
    if(!layer||!layer.img)return null;
    const{sc}=viewRef.current;const hsMM=11/sc;
    const{lx,ly}=toLocal(layer,mx,my);
    for(let i=0;i<4;i++){const[sx,sy]=CORNERS[i];
      if(Math.abs(lx-sx*layer.w/2)<=hsMM&&Math.abs(ly-sy*layer.h/2)<=hsMM)return{mode:"resize",corner:i};
    }
    if(Math.abs(lx)<=layer.w/2&&Math.abs(ly)<=layer.h/2)return{mode:"move"};
    return null;
  }

  // raw pixel position within canvas (incl. ruler band)
  function evtRaw(e){
    const canvas=canvasRef.current;const rect=canvas.getBoundingClientRect();
    const fx=canvas.width/rect.width,fy=canvas.height/rect.height;
    return{rx:(e.clientX-rect.left)*fx,ry:(e.clientY-rect.top)*fy};
  }
  // hit test an existing user guide (returns its index or -1)
  function guideHit(mx,my){
    const{sc}=viewRef.current;const th=6/sc;
    for(let i=0;i<uGuides.length;i++){const g=uGuides[i];
      if(g.type==="v"&&Math.abs(mx-g.pos)<=th)return i;
      if(g.type==="h"&&Math.abs(my-g.pos)<=th)return i;
    }
    return -1;
  }

  function onDown(e){
    const{rx,ry}=evtRaw(e);const{mx,my}=evtMM(e);const{RM}=viewRef.current;
    // 1) drag a NEW guide out of a ruler band
    if(ry<RM&&rx>=RM){ // top ruler -> horizontal guide
      e.preventDefault();
      const g={id:Date.now(),type:"h",pos:Math.max(0,Math.min(tplH,my))};
      setUGuides(gs=>[...gs,g]);
      dragRef.current={mode:"guide-new",gid:g.id,gtype:"h"};
      window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);return;
    }
    if(rx<RM&&ry>=RM){ // left ruler -> vertical guide
      e.preventDefault();
      const g={id:Date.now(),type:"v",pos:Math.max(0,Math.min(tplW,mx))};
      setUGuides(gs=>[...gs,g]);
      dragRef.current={mode:"guide-new",gid:g.id,gtype:"v"};
      window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);return;
    }
    // 2) grab an existing guide
    const gi=guideHit(mx,my);
    if(gi>=0){
      e.preventDefault();const g=uGuides[gi];
      dragRef.current={mode:"guide-move",gid:g.id,gtype:g.type};
      window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);return;
    }
    // 3) layer move/resize
    const hit=hitTest(active,mx,my);
    if(!hit)return;
    e.preventDefault();
    const{x,y}=computeXY(active);
    dragRef.current={...hit,startMM:{mx,my},start:{x,y,w:active.w,h:active.h,rot:active.rot,natR:active.natR,keepR:active.keepR}};
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
  }

  function onMove(e){
    const d=dragRef.current;if(!d)return;
    const{mx,my}=evtMM(e);const{RM}=viewRef.current;const{rx,ry}=evtRaw(e);

    // ---- guide dragging ----
    if(d.mode==="guide-new"||d.mode==="guide-move"){
      const inRuler=d.gtype==="v"?rx<RM:ry<RM; // dragged back onto ruler => mark delete
      const pos=d.gtype==="v"?Math.max(0,Math.min(tplW,mx)):Math.max(0,Math.min(tplH,my));
      d.willDelete=inRuler;
      setUGuides(gs=>gs.map(g=>g.id===d.gid?{...g,pos}:g));
      return;
    }

    const st=d.start;
    if(d.mode==="move"){
      let nx=st.x+(mx-d.startMM.mx),ny=st.y+(my-d.startMM.my);
      const gl=[];
      if(st.rot===0){
        const th=7/viewRef.current.sc;
        const cx=nx+st.w/2,cy=ny+st.h/2;
        // built-in targets (edges + center) + user guides
        const gv=uGuides.filter(g=>g.type==="v").map(g=>g.pos);
        const gh=uGuides.filter(g=>g.type==="h").map(g=>g.pos);
        const vtargets=[{at:0,edge:nx},{at:tplW/2,edge:cx},{at:tplW,edge:nx+st.w},
          ...gv.flatMap(p=>[{at:p,edge:nx},{at:p,edge:cx},{at:p,edge:nx+st.w}])];
        for(const t of vtargets){if(Math.abs(t.edge-t.at)<th){nx+=(t.at-t.edge);gl.push({type:"v",pos:t.at});break;}}
        const cx2=nx+st.w/2;
        const htargets=[{at:0,edge:ny},{at:tplH/2,edge:ny+st.h/2},{at:tplH,edge:ny+st.h},
          ...gh.flatMap(p=>[{at:p,edge:ny},{at:p,edge:ny+st.h/2},{at:p,edge:ny+st.h}])];
        for(const t of htargets){if(Math.abs(t.edge-t.at)<th){ny+=(t.at-t.edge);gl.push({type:"h",pos:t.at});break;}}
      }
      setGuides(gl);
      updateLayer(active.id,{exX:String(+fromMM(nx).toFixed(2)),exY:String(+fromMM(ny).toFixed(2))});
    }else{
      const[sx,sy]=CORNERS[d.corner];
      const c0x=st.x+st.w/2,c0y=st.y+st.h/2;
      const a=st.rot*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a);
      const flx=-sx*st.w/2,fly=-sy*st.h/2;
      const anchorX=c0x+(flx*ca-fly*sa),anchorY=c0y+(flx*sa+fly*ca);
      const dx=mx-anchorX,dy=my-anchorY;
      const lx=dx*ca+dy*sa,ly=-dx*sa+dy*ca;
      let nw=Math.max(3,Math.abs(lx)),nh=Math.max(3,Math.abs(ly));
      if(st.keepR&&st.natR){nh=nw/st.natR;}
      const ncx=anchorX+( (sx*nw/2)*ca-(sy*nh/2)*sa );
      const ncy=anchorY+( (sx*nw/2)*sa+(sy*nh/2)*ca );
      const nx=ncx-nw/2,ny=ncy-nh/2;
      updateLayer(active.id,{w:nw,h:nh,exX:String(+fromMM(nx).toFixed(2)),exY:String(+fromMM(ny).toFixed(2))});
    }
  }

  function onUp(){
    const d=dragRef.current;
    if(d&&(d.mode==="guide-new"||d.mode==="guide-move")&&d.willDelete){
      setUGuides(gs=>gs.filter(g=>g.id!==d.gid));
    }
    dragRef.current=null;setGuides([]);
    window.removeEventListener("mousemove",onMove);
    window.removeEventListener("mouseup",onUp);
  }

  function onDbl(e){ // double-click a guide to delete it
    const{mx,my}=evtMM(e);const gi=guideHit(mx,my);
    if(gi>=0)setUGuides(gs=>gs.filter((_,i)=>i!==gi));
  }

  function onHover(e){
    if(dragRef.current)return;
    const{rx,ry}=evtRaw(e);const{mx,my}=evtMM(e);const{RM}=viewRef.current;
    if(ry<RM||rx<RM){setHoverCur(rx<RM&&ry<RM?"default":(ry<RM?"row-resize":"col-resize"));return;}
    if(guideHit(mx,my)>=0){const g=uGuides[guideHit(mx,my)];setHoverCur(g.type==="v"?"col-resize":"row-resize");return;}
    const hit=hitTest(active,mx,my);
    if(!hit){setHoverCur("default");return;}
    if(hit.mode==="move"){setHoverCur("move");return;}
    setHoverCur(hit.corner===0||hit.corner===3?"nwse-resize":"nesw-resize");
  }

  const OPTS=[...TPLS.map(t=>({value:t.id,label:t.name,sub:t.sub})),{divider:true},{value:"custom",label:"Nueva plantilla",sub:"Subir archivo"}];

  // make built-in templates transparent so the CMYK bg color shows through
  function prepTplSvg(svg){
    return svg
      .replace(/<rect[^>]*fill="white"[^>]*\/>/i,"")
      .replace(/fill="#f8f8f8"/g,'fill="none"')
      .replace(/fill="#f9f9f9"/g,'fill="none"');
  }

  function handleTplSelect(val){
    if(val==="custom"){setShowCustom(true);setTplId(null);setTplImg(null);return;}
    setShowCustom(false);setCustImg(null);
    const tpl=TPLS.find(t=>t.id===val);if(!tpl)return;
    setTplId(val);setTplW(tpl.w);setTplH(tpl.h);
    svgToImg(prepTplSvg(tpl.svg),img=>setTplImg(img));
  }

  function loadFile(e,cb){
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{const img=new Image();img.onload=()=>cb(img,ev.target.result,f.name);img.src=ev.target.result;};
    r.readAsDataURL(f);
  }

  function loadLayerImg(id,img,src,name){
    const r=img.naturalWidth/(img.naturalHeight||1);
    updateLayer(id,{img,src,name,natR:r,h:60/r,bgRem:false});
  }

  function handleRemoveBg(){
    if(!active.img||bgProc)return;setBgProc(true);
    setTimeout(()=>{
      try{const src=removeBg(active.img);const img=new Image();img.onload=()=>{updateLayer(active.id,{img,src,bgRem:true});};img.src=src;}catch(e){}
      setBgProc(false);
    },80);
  }

  function chW(v){const w=toMM(parseFloat(v)||0);updateLayer(active.id,active.keepR&&active.natR?{w,h:w/active.natR}:{w});}
  function chH(v){const h=toMM(parseFloat(v)||0);updateLayer(active.id,active.keepR&&active.natR?{h,w:h*active.natR}:{h});}

  function addLayer(){
    if(layers.length>=2)return;
    const id=Math.max(...layers.map(l=>l.id))+1;
    const nl=newLayer(id);nl.vMode="bottom";nl.h=20;nl.w=60;
    setLayers(ls=>[...ls,nl]);setActiveId(id);
  }
  function removeLayer(id){
    if(layers.length<=1)return;
    setLayers(ls=>{const nl=ls.filter(l=>l.id!==id);if(activeId===id)setActiveId(nl[0].id);return nl;});
  }

  function switchUnit(u){
    if(u===unit)return;
    setLayers(ls=>ls.map(l=>({...l,
      exX:l.exX!==""?((u==="cm"?toMM(parseFloat(l.exX))/10:toMM(parseFloat(l.exX)))).toFixed(2):"",
      exY:l.exY!==""?((u==="cm"?toMM(parseFloat(l.exY))/10:toMM(parseFloat(l.exY)))).toFixed(2):"",
    })));
    setUnit(u);
  }

  function doExport(){
    if(!window.jspdf){alert("Cargando librería PDF, espera 2 segundos.");return;}
    const{jsPDF}=window.jspdf;
    const PX=11.338;
    const hi=document.createElement("canvas");
    hi.width=Math.round(tplW*PX);hi.height=Math.round(tplH*PX);
    const hc=hi.getContext("2d");
    const{r,g,b}=cmykToRgb(bgCmyk.c,bgCmyk.m,bgCmyk.y,bgCmyk.k);
    hc.fillStyle=`rgb(${r},${g},${b})`;hc.fillRect(0,0,hi.width,hi.height);
    const src=tplImg||custImg;
    if(src)hc.drawImage(src,0,0,hi.width,hi.height);
    layers.forEach(layer=>{
      if(!layer.img)return;
      const{x,y}=computeXY(layer);
      const px=x*PX,py=y*PX,pw=layer.w*PX,ph=layer.h*PX;
      hc.save();hc.translate(px+pw/2,py+ph/2);hc.rotate(layer.rot*Math.PI/180);hc.drawImage(layer.img,-pw/2,-ph/2,pw,ph);hc.restore();
    });
    try{
      const pdf=new jsPDF({orientation:tplW>=tplH?"landscape":"portrait",unit:"mm",format:[tplW,tplH]});
      pdf.addImage(hi.toDataURL("image/png"),"PNG",0,0,tplW,tplH);
      const blob=pdf.output("blob");const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download="troquel-logo.pdf";
      document.body.appendChild(a);a.click();
      setTimeout(()=>{URL.revokeObjectURL(url);document.body.removeChild(a);},1000);
    }catch(e){
      hi.toBlob(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="troquel-logo.png";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);document.body.removeChild(a);},1000);},"image/png");
    }
  }

  function resetAll(){
    setTplId(null);setTplImg(null);setTplW(210);setTplH(297);
    setCustImg(null);setCustName("");setShowCustom(false);
    setLayers([newLayer(1)]);setActiveId(1);
    setUnit("mm");setBgCmyk({c:0,m:0,y:0,k:0});setShowBg(false);setCoords(null);setUGuides([]);setGuides([]);
  }

  const bgHex=cmykHex(bgCmyk.c,bgCmyk.m,bgCmyk.y,bgCmyk.k);

  return(
    <div style={{display:"grid",gridTemplateColumns:"262px 1fr 284px",height:"100vh",fontFamily:F,background:C.bg,overflow:"hidden"}}>

      {/* LEFT */}
      <div style={{background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.bL}`}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:0.5,marginBottom:3}}>ABELLAPACK</div>
              <div style={{fontSize:20,fontWeight:600,color:C.text,letterSpacing:-0.4,lineHeight:1.25}}>Logo sobre<br/>Troquel</div>
            </div>
            <button onClick={resetAll} title="Nuevo trabajo" style={{marginTop:4,padding:"5px 10px",background:"none",border:`1px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:F,color:C.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M13 3a7 7 0 11-9.9 9.9M3 7V3h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Nuevo
            </button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>

          {/* Template */}
          <div style={{marginBottom:20}}>
            <Label>Plantilla</Label>
            <select value={showCustom?"custom":(tplId||"")} onChange={e=>handleTplSelect(e.target.value)} style={{
              width:"100%",padding:"10px 12px",fontSize:13,fontFamily:F,
              borderRadius:8,border:"1.5px solid transparent",background:C.inp,
              color:(tplId||showCustom)?C.text:C.muted,cursor:"pointer",outline:"none",
              WebkitAppearance:"none",MozAppearance:"none",appearance:"none",
              backgroundImage:"url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%2386868b' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
              backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",backgroundSize:"14px",
              paddingRight:"32px"
            }}>
              <option value="" disabled>Seleccionar plantilla…</option>
              {TPLS.map(t=><option key={t.id} value={t.id}>{t.name} — {t.sub}</option>)}
              <option value="custom">+ Nueva plantilla (subir archivo)</option>
            </select>
            {showCustom&&(
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`1.5px dashed ${custImg?C.green:C.border}`,borderRadius:9,cursor:"pointer",background:custImg?"rgba(52,199,89,0.05)":"#fafafa",marginTop:10}}>
                <input type="file" accept=".png,.jpg,.jpeg,.svg" style={{display:"none"}} onChange={e=>loadFile(e,(img,src,name)=>{setCustImg(img);setCustName(name);})}/>
                <Ico d={custImg?IC.chk:IC.up} sz={14}/>
                <span style={{fontSize:13,fontWeight:500,color:custImg?C.green:C.text}}>{custImg?`✓ ${custName}`:"Subir plantilla…"}</span>
              </label>
            )}
          </div>

          <div style={{marginBottom:20}}>
            <Label>Dimensiones</Label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <NumField label={`Ancho (${unit})`} value={dp(tplW)} onChange={v=>setTplDim("w",v)}/>
              <NumField label={`Alto (${unit})`} value={dp(tplH)} onChange={v=>setTplDim("h",v)}/>
            </div>
          </div>

          <Divider/>

          {/* LAYERS */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <Label>Imágenes / Capas</Label>
            {layers.length<2&&(
              <button onClick={addLayer} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 9px",background:"#eff6ff",border:"none",borderRadius:6,fontSize:11,fontFamily:F,fontWeight:500,color:C.accent,cursor:"pointer"}}>
                <Ico d={IC.plus} sz={11}/>Añadir
              </button>
            )}
          </div>

          {/* Layer tabs */}
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
            {layers.map((l,i)=>(
              <div key={l.id} onClick={()=>setActiveId(l.id)} style={{
                display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,cursor:"pointer",
                border:`1.5px solid ${l.id===activeId?C.accent:C.border}`,
                background:l.id===activeId?"#eff6ff":C.card,transition:"all 0.14s"}}>
                <div style={{width:30,height:30,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
                  {l.src?<img src={l.src} style={{width:"100%",height:"100%",objectFit:"contain"}} alt=""/>:<span style={{color:C.muted}}><Ico d={IC.img} sz={14}/></span>}
                </div>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontSize:12,fontWeight:500,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {i===0?"Imagen 1 (Logo)":"Imagen 2"}
                  </div>
                  <div style={{fontSize:10,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {l.name||"Sin archivo"}
                  </div>
                </div>
                {layers.length>1&&(
                  <button onClick={e=>{e.stopPropagation();removeLayer(l.id);}} style={{padding:4,background:"none",border:"none",color:C.muted,cursor:"pointer",display:"flex",flexShrink:0}}
                    onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
                    <Ico d={IC.trash} sz={13}/>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active layer controls */}
          <div style={{background:C.bg,borderRadius:10,padding:14,marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:10,fontFamily:F}}>
              {layers.findIndex(l=>l.id===activeId)===0?"▸ EDITANDO: IMAGEN 1 (LOGO)":"▸ EDITANDO: IMAGEN 2"}
            </div>
            <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`1.5px dashed ${active.img?C.green:C.border}`,borderRadius:9,cursor:"pointer",background:active.img?"rgba(52,199,89,0.05)":C.card}}>
              <input type="file" accept=".svg,.png,.jpg,.jpeg" style={{display:"none"}} onChange={e=>loadFile(e,(img,src,name)=>loadLayerImg(active.id,img,src,name))}/>
              <Ico d={active.img?IC.chk:IC.up} sz={14}/>
              <span style={{fontSize:12,fontWeight:500,color:active.img?C.green:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {active.img?active.name:"Subir imagen — SVG · PNG · JPG"}
              </span>
            </label>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
              <NumField label={`Ancho (${unit})`} value={dp(active.w)} onChange={chW}/>
              <NumField label={`Alto (${unit})`} value={dp(active.h)} onChange={chH}/>
            </div>
            <label style={{display:"flex",alignItems:"center",gap:7,marginTop:10,cursor:"pointer",fontSize:12,color:C.muted}}>
              <input type="checkbox" checked={active.keepR} onChange={e=>updateLayer(active.id,{keepR:e.target.checked})} style={{accentColor:C.accent}}/>
              Mantener proporción
            </label>
            {active.img&&(
              <button onClick={handleRemoveBg} disabled={bgProc} style={{width:"100%",marginTop:10,padding:"8px",fontSize:12,fontWeight:500,fontFamily:F,background:active.bgRem?"rgba(52,199,89,0.08)":C.card,border:`1.5px solid ${active.bgRem?C.green:C.border}`,borderRadius:8,color:active.bgRem?C.green:C.sub,cursor:bgProc?"wait":"pointer"}}>
                {bgProc?"Procesando…":active.bgRem?"✓ Fondo eliminado":"Eliminar fondo blanco"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div ref={areaRef} style={{background:C.bg,backgroundImage:"radial-gradient(circle,rgba(0,0,0,0.08) 1px,transparent 1px)",backgroundSize:"20px 20px",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <canvas ref={canvasRef} onMouseDown={onDown} onMouseMove={onHover} onDoubleClick={onDbl} style={{boxShadow:"0 8px 40px rgba(0,0,0,0.11),0 2px 8px rgba(0,0,0,0.06)",borderRadius:2,cursor:hoverCur,touchAction:"none"}}/>
        {coords&&<div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(28,28,30,0.78)",backdropFilter:"blur(14px)",color:"#f5f5f7",fontFamily:M,fontSize:11,padding:"5px 16px",borderRadius:20,whiteSpace:"nowrap",pointerEvents:"none"}}>
          x {coords.x} · y {coords.y} · {coords.w}×{coords.h} {unit} · {active.rot}°
        </div>}
        <div style={{position:"absolute",top:14,left:14,display:"flex",gap:8,alignItems:"center"}}>
          <div style={{background:"rgba(28,28,30,0.7)",backdropFilter:"blur(14px)",color:"#d8d8dc",fontFamily:F,fontSize:10.5,padding:"5px 11px",borderRadius:8,pointerEvents:"none",lineHeight:1.4,maxWidth:230}}>
            Arrastra desde las reglas para crear guías · doble clic para borrarlas
          </div>
          {uGuides.length>0&&<button onClick={()=>setUGuides([])} style={{background:"rgba(28,28,30,0.7)",backdropFilter:"blur(14px)",color:"#fff",border:"none",fontFamily:F,fontSize:11,fontWeight:500,padding:"5px 11px",borderRadius:8,cursor:"pointer"}}>Limpiar guías ({uGuides.length})</button>}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{background:C.card,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"16px 20px 14px",borderBottom:`1px solid ${C.bL}`}}>
          <Label>Unidades</Label>
          <Seg opts={[{v:"mm",l:"mm"},{v:"cm",l:"cm"}]} val={unit} onChange={switchUnit}/>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>

          <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:14,fontFamily:F,padding:"8px 12px",background:"#eff6ff",borderRadius:8}}>
            Ajustando: {layers.findIndex(l=>l.id===activeId)===0?"Imagen 1 (Logo)":"Imagen 2"}
          </div>

          <div style={{marginBottom:20}}>
            <Label>Rotación</Label>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <input type="range" min="-180" max="180" value={active.rot} onChange={e=>updateLayer(active.id,{rot:Number(e.target.value)})} style={{flex:1,accentColor:C.accent,cursor:"pointer"}}/>
              <input type="number" min="-180" max="180" value={active.rot} onChange={e=>updateLayer(active.id,{rot:Math.max(-180,Math.min(180,Number(e.target.value)||0))})} style={{width:50,padding:"6px 8px",background:C.inp,border:"none",borderRadius:7,fontSize:12,fontFamily:M,color:C.text,outline:"none",MozAppearance:"textfield",textAlign:"center"}}/>
              <span style={{fontSize:11,color:C.muted}}>°</span>
            </div>
            <div style={{display:"flex",gap:5}}>
              {[0,90,180,-90].map(v=><button key={v} onClick={()=>updateLayer(active.id,{rot:v})} style={{flex:1,padding:"5px 4px",fontSize:11,fontFamily:F,fontWeight:500,background:active.rot===v?C.accent:C.bg,color:active.rot===v?"#fff":C.muted,border:"none",borderRadius:6,cursor:"pointer"}}>{v}°</button>)}
            </div>
          </div>

          <Divider/>

          <div style={{marginBottom:20}}>
            <Label>Posición Horizontal</Label>
            <Seg opts={[{v:"left",l:"◀ Izq."},{v:"center",l:"Centro"},{v:"right",l:"Der. ▶"}]} val={active.hMode} onChange={v=>updateLayer(active.id,{hMode:v,exX:""})}/>
            {active.hMode!=="center"&&<div style={{marginTop:10}}><NumField label={`${active.hMode==="left"?"Margen izquierdo":"Margen derecho"} (${unit})`} value={dp(active.hMar)} onChange={v=>updateLayer(active.id,{hMar:toMM(parseFloat(v)||0)})}/></div>}
          </div>

          <div style={{marginBottom:20}}>
            <Label>Posición Vertical</Label>
            <Seg opts={[{v:"top",l:"▲ Arr."},{v:"center",l:"Centro"},{v:"bottom",l:"Abj. ▼"}]} val={active.vMode} onChange={v=>updateLayer(active.id,{vMode:v,exY:""})}/>
            {active.vMode!=="center"&&<div style={{marginTop:10}}><NumField label={`${active.vMode==="top"?"Margen superior":"Margen inferior"} (${unit})`} value={dp(active.vMar)} onChange={v=>updateLayer(active.id,{vMar:toMM(parseFloat(v)||0)})}/></div>}
          </div>

          <div style={{marginBottom:20}}>
            <Label>Posición Exacta</Label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <NumField label={`X (${unit})`} value={active.exX} onChange={v=>updateLayer(active.id,{exX:v})} placeholder="auto"/>
              <NumField label={`Y (${unit})`} value={active.exY} onChange={v=>updateLayer(active.id,{exY:v})} placeholder="auto"/>
            </div>
            {(active.exX!==""||active.exY!=="")&&<button onClick={()=>updateLayer(active.id,{exX:"",exY:""})} style={{marginTop:8,background:"none",border:"none",color:C.accent,fontSize:12,cursor:"pointer",padding:0,fontFamily:F}}>↩ Limpiar</button>}
          </div>

          <Divider/>

          <div style={{marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <Label>Color fondo (CMYK)</Label>
              <button onClick={()=>setShowBg(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",background:"none",border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,fontFamily:F,color:C.sub,cursor:"pointer"}}>
                <div style={{width:11,height:11,borderRadius:3,background:bgHex,border:"1px solid rgba(0,0,0,0.12)"}}/>
                {showBg?"Cerrar":"Editar"}
              </button>
            </div>
            {showBg?<CmykPicker cmyk={bgCmyk} onChange={setBgCmyk}/>:(
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.bg,borderRadius:8}}>
                <div style={{width:26,height:26,borderRadius:5,background:bgHex,border:"1px solid rgba(0,0,0,0.1)",flexShrink:0}}/>
                <div><div style={{fontSize:11,fontFamily:M,color:C.text,fontWeight:500}}>{bgHex.toUpperCase()}</div><div style={{fontSize:10,color:C.muted}}>C{bgCmyk.c} M{bgCmyk.m} Y{bgCmyk.y} K{bgCmyk.k}</div></div>
              </div>
            )}
          </div>
        </div>

        <div style={{padding:"14px 20px 22px",borderTop:`1px solid ${C.bL}`}}>
          <button onClick={doExport} style={{width:"100%",padding:"13px",background:jsPdfReady?C.accent:C.muted,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,fontFamily:F,letterSpacing:-0.2,cursor:jsPdfReady?"pointer":"not-allowed",transition:"background 0.2s"}}>
            {jsPdfReady?"Exportar PDF":"Cargando…"}
          </button>
        </div>

        {/* GEMINI CHAT */}
        <div style={{display:"flex",flexDirection:"column",height:"280px",borderTop:`1px solid ${C.bL}`,background:C.bg}}>
          <div style={{flex:1,overflowY:"auto",padding:"12px 16px",fontSize:12,fontFamily:M,lineHeight:1.6}}>
            {aiChat.length===0&&<div style={{color:C.muted,fontStyle:"italic"}}>Cuéntale qué quieres cambiar (color, tamaño, rotación...)</div>}
            {aiChat.map((msg,i)=>(
              <div key={i} style={{marginBottom:10,textAlign:msg.role==="user"?"right":"left"}}>
                <div style={{display:"inline-block",maxWidth:"90%",padding:"8px 12px",background:msg.role==="user"?C.accent:"#e5e5e7",color:msg.role==="user"?"#fff":C.text,borderRadius:12,wordWrap:"break-word"}}>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiLoading&&<div style={{color:C.muted}}>⏳ Gemini está pensando...</div>}
            <div ref={aiChatEndRef}/>
          </div>
          <div style={{display:"flex",gap:8,padding:"10px 12px",borderTop:`1px solid ${C.bL}`,background:"#fff"}}>
            <input
              value={aiInput}
              onChange={e=>setAiInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendToGemini();}}}
              placeholder="Ej: fondo azul, hazlo más grande..."
              disabled={aiLoading}
              style={{flex:1,padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:F,fontWeight:500,outline:"none"}}
            />
            <button
              onClick={sendToGemini}
              disabled={aiLoading||!aiInput.trim()}
              style={{padding:"8px 14px",background:C.accent,color:"#fff",border:"none",borderRadius:8,fontSize:11,fontWeight:600,cursor:aiLoading||!aiInput.trim()?"not-allowed":"pointer",opacity:aiLoading||!aiInput.trim()?0.5:1}}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// Force build
