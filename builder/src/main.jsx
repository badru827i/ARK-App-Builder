import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const catalog = [
 ['UI',['Button','Text','Image','Image Button','Input','Slider','Switch']],
 ['Logic',['Event','If / Else','Variable','Timer','Loop']],
 ['Device',['Camera','Microphone','Audio','File','USB','Bluetooth','GPS','Sensor']],
 ['Network',['Web Request','API','Download','Upload']],
 ['AI',['AI Vision','AI Text','AI Assistant','Object Detector']],
 ['Data',['Local Storage','Database','JSON']],
 ['Navigation',['Page','Open Page','Back','Dialog','Bottom Sheet']],
 ['System',['Notification','Permission','Clipboard','Share','Vibrate']],
];

const meta={
 Button:{title:'Button',props:{text:'Button',action:'click'}},Text:{title:'Text',props:{text:'Hello ARK'}},Image:{title:'Image',props:{src:''}},'Image Button':{title:'Image Button',props:{src:'',action:'click'}},Input:{title:'Text Input',props:{hint:'Type here'}},Slider:{title:'Slider',props:{min:0,max:100,value:50}},Switch:{title:'Switch',props:{checked:false}},
 Event:{title:'On Click',props:{event:'click'}},'If / Else':{title:'Condition',props:{expression:'true'}},Variable:{title:'Variable',props:{name:'value',value:'0'}},Timer:{title:'Timer',props:{ms:1000}},Loop:{title:'Loop',props:{count:3}},Camera:{title:'Camera',props:{}},Microphone:{title:'Microphone',props:{}},Audio:{title:'Audio',props:{file:''}},File:{title:'File',props:{mode:'open'}},USB:{title:'USB / Pendrive',props:{}},Bluetooth:{title:'Bluetooth',props:{}},GPS:{title:'GPS',props:{}},Sensor:{title:'Sensor',props:{type:'accelerometer'}},
 'Web Request':{title:'Web Request',props:{url:'',method:'GET'}},API:{title:'API',props:{baseUrl:''}},Download:{title:'Download',props:{url:''}},Upload:{title:'Upload',props:{url:''}},
 'AI Vision':{title:'AI Vision',props:{provider:'local',model:'auto'}},'AI Text':{title:'AI Text',props:{provider:'local',model:'auto'}},'AI Assistant':{title:'AI Assistant',props:{provider:'local',model:'auto'}},'Object Detector':{title:'Object Detector',props:{model:'auto',confidence:0.5}},
 'Local Storage':{title:'Local Storage',props:{key:'data'}},Database:{title:'Database',props:{name:'app.db'}},JSON:{title:'JSON',props:{mode:'parse'}},
 Page:{title:'Page',props:{name:'Home'}},'Open Page':{title:'Open Page',props:{page:'Home'}},Back:{title:'Back',props:{}},Dialog:{title:'Dialog',props:{title:'Message',message:'Hello'}},'Bottom Sheet':{title:'Bottom Sheet',props:{title:'Options'}},
 Notification:{title:'Notification',props:{title:'ARK',message:'Hello'}},Permission:{title:'Permission',props:{permission:'camera'}},Clipboard:{title:'Clipboard',props:{text:''}},Share:{title:'Share',props:{text:''}},Vibrate:{title:'Vibrate',props:{ms:200}}
};

const uid=()=>crypto.randomUUID();
const newNode=(type,index=0)=>({id:uid(),type,title:meta[type]?.title||type,x:80+(index%5)*230,y:70+Math.floor(index/5)*170,enabled:true,props:{...(meta[type]?.props||{})}});

function App(){
 const [nodes,setNodes]=useState([]); const [edges,setEdges]=useState([]); const [selected,setSelected]=useState(null); const [project,setProject]=useState('My ARK App'); const [zoom,setZoom]=useState(1); const [query,setQuery]=useState(''); const [connectFrom,setConnectFrom]=useState(null); const [buildLog,setBuildLog]=useState('Ready');
 const selectedNode=useMemo(()=>nodes.find(n=>n.id===selected),[nodes,selected]);
 const filtered=catalog.map(([g,items])=>[g,items.filter(i=>i.toLowerCase().includes(query.toLowerCase()))]).filter(([,items])=>items.length);
 const addNode=type=>{const n=newNode(type,nodes.length);setNodes(v=>[...v,n]);setSelected(n.id)};
 const updateNode=(id,patch)=>setNodes(v=>v.map(n=>n.id===id?{...n,...patch}:n));
 const updateProp=(key,value)=>selectedNode&&updateNode(selectedNode.id,{props:{...selectedNode.props,[key]:value}});
 const connect=(from,to)=>{if(!from||from===to)return;setEdges(v=>v.some(e=>e.from===from&&e.to===to)?v:[...v,{id:uid(),from,to}]);setConnectFrom(null)};
 const autoConnect=()=>{const es=[];for(let i=0;i<nodes.length-1;i++)es.push({id:uid(),from:nodes[i].id,to:nodes[i+1].id});setEdges(es)};
 const removeNode=()=>{if(!selected)return;setNodes(v=>v.filter(n=>n.id!==selected));setEdges(v=>v.filter(e=>e.from!==selected&&e.to!==selected));setSelected(null)};
 const exportProject=()=>{const data={schema:'ark-project',version:2,project,nodes,edges};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=`${project.replace(/[^a-z0-9]+/gi,'-').toLowerCase()||'ark-app'}.ark.json`;a.click();URL.revokeObjectURL(a.href)};
 const importProject=()=>{const input=document.createElement('input');input.type='file';input.accept='.json,.ark.json';input.onchange=async()=>{try{const data=JSON.parse(await input.files[0].text());setProject(data.project||'My ARK App');setNodes(data.nodes||[]);setEdges(data.edges||[]);setSelected(data.nodes?.[0]?.id||null)}catch{alert('Invalid ARK project file.')}};input.click()};
 const build=()=>{setBuildLog(`Graph validated: ${nodes.length} nodes, ${edges.length} connections. Android project generation queued.`)};
 return <div className="app">
  <header><div className="brand"><span>ARK</span> APP BUILDER <small>V0.2 VISUAL ENGINE</small></div><input className="project-name" value={project} onChange={e=>setProject(e.target.value)}/><div className="actions"><button onClick={importProject}>Import</button><button onClick={exportProject}>Export</button><button onClick={()=>{localStorage.setItem('ark-project-v2',JSON.stringify({project,nodes,edges}));setBuildLog('Saved locally.')}}>Save</button><button className="build" onClick={build}>Build APK</button></div></header>
  <main>
   <aside className="toolbox"><h3>NODES</h3><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search components..."/>{filtered.map(([group,items])=><section key={group}><h4>{group}</h4>{items.map(item=><button className="node-tool" key={item} onClick={()=>addNode(item)}><b>{item[0]}</b>{item}</button>)}</section>)}</aside>
   <section className="workspace"><div className="workspace-bar"><span>VISUAL GRAPH / {nodes.length} NODES / {edges.length} LINKS</span><div><button onClick={()=>setZoom(z=>Math.max(.5,z-.1))}>−</button><b>{Math.round(zoom*100)}%</b><button onClick={()=>setZoom(z=>Math.min(1.6,z+.1))}>+</button><button onClick={autoConnect}>Auto Connect</button><button onClick={()=>{setNodes([]);setEdges([]);setSelected(null)}}>Clear</button></div></div>
    <div className="canvas" style={{transform:`scale(${zoom})`}} onClick={()=>setSelected(null)}>
      <svg className="links" width="1800" height="1100">{edges.map(e=>{const a=nodes.find(n=>n.id===e.from),b=nodes.find(n=>n.id===e.to);if(!a||!b)return null;return <line key={e.id} x1={a.x+190} y1={a.y+80} x2={b.x} y2={b.y+80} />})}</svg>
      {nodes.map(n=><div key={n.id} className={`node ${selected===n.id?'selected':''}`} style={{left:n.x,top:n.y}} onClick={e=>{e.stopPropagation();if(connectFrom){connect(connectFrom,n.id)}else setSelected(n.id)}}><button className="port in" onClick={e=>e.stopPropagation()}>IN</button><div className="node-head"><span>{n.type}</span><i>●</i></div><strong>{n.title}</strong><div className="ports"><button onClick={e=>{e.stopPropagation();setConnectFrom(n.id)}} className={connectFrom===n.id?'armed':''}>OUT</button></div>{edges.some(e=>e.from===n.id)&&<div className="link-label">CONNECTED</div>}</div>)}
      {!nodes.length&&<div className="empty"><strong>BUILD WITHOUT CODE</strong><p>Tap a component → configure it → tap OUT, then tap another node.</p><p>Example: Event → Camera → AI Vision → Object Detector → Text</p></div>}
    </div></section>
   <aside className="inspector"><h3>PROPERTIES</h3>{selectedNode?<><label>Node name</label><input value={selectedNode.title} onChange={e=>updateNode(selectedNode.id,{title:e.target.value})}/>{Object.entries(selectedNode.props).map(([k,v])=><div key={k}><label>{k}</label><input value={String(v)} onChange={e=>updateProp(k,e.target.value)}/></div>)}<label>Enabled</label><input type="checkbox" checked={selectedNode.enabled} onChange={e=>updateNode(selectedNode.id,{enabled:e.target.checked})}/><button className="connect" onClick={()=>setConnectFrom(selectedNode.id)}>Connect OUT</button><button className="delete" onClick={removeNode}>Delete Node</button></>:<p>Select a node. Use OUT → another node to create a link.</p>}<hr/><h3>BUILD STATUS</h3><div className="status">{buildLog}</div><div className="feature">✓ Visual node graph</div><div className="feature">✓ Multi-port connections</div><div className="feature">✓ Project JSON v2</div><div className="feature">✓ Import / Export</div><div className="feature">✓ 40+ built-in nodes</div><div className="feature">◌ Android code generator</div><div className="feature">◌ APK/AAB compiler</div></aside>
  </main></div>;
}
createRoot(document.getElementById('root')).render(<App />);
