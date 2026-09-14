import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const catalog = [
  ['UI', ['Button', 'Text', 'Image', 'Image Button', 'Input', 'Slider', 'Switch']],
  ['Logic', ['Event', 'If / Else', 'Variable', 'Timer', 'Loop']],
  ['Device', ['Camera', 'Microphone', 'Audio', 'File', 'USB', 'Bluetooth', 'GPS', 'Sensor']],
  ['Network', ['Web Request', 'API', 'Download', 'Upload']],
  ['AI', ['AI Vision', 'AI Text', 'AI Assistant', 'Object Detector']],
  ['Data', ['Local Storage', 'Database', 'JSON']],
];

const defaults = {
  Button: 'Button', Text: 'Text', Image: 'Image', 'Image Button': 'Image Button', Input: 'Text input', Slider: 'Slider', Switch: 'Switch',
  Event: 'On Click', 'If / Else': 'Condition', Variable: 'Variable', Timer: 'Timer', Loop: 'Loop', Camera: 'Camera', Microphone: 'Microphone', Audio: 'Audio', File: 'File', USB: 'USB / Pendrive', Bluetooth: 'Bluetooth', GPS: 'GPS', Sensor: 'Sensor', 'Web Request': 'Web Request', API: 'API', Download: 'Download', Upload: 'Upload', 'AI Vision': 'AI Vision', 'AI Text': 'AI Text', 'AI Assistant': 'AI Assistant', 'Object Detector': 'Object Detector', 'Local Storage': 'Local Storage', Database: 'Database', JSON: 'JSON'
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [project, setProject] = useState('My ARK App');
  const [zoom, setZoom] = useState(1);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selected), [nodes, selected]);

  const addNode = type => {
    const node = { id: crypto.randomUUID(), type, title: defaults[type] || type, x: 120 + nodes.length * 28, y: 100 + nodes.length * 22, enabled: true };
    setNodes(v => [...v, node]);
    setSelected(node.id);
  };

  const connect = () => {
    if (nodes.length < 2) return;
    setNodes(v => v.map((n, i) => ({ ...n, next: i < v.length - 1 ? v[i + 1].id : null })));
  };

  const saveProject = () => {
    const data = { version: 1, project, nodes };
    localStorage.setItem('ark-app-project', JSON.stringify(data));
    alert('Project saved locally.');
  };

  const loadProject = () => {
    const raw = localStorage.getItem('ark-app-project');
    if (!raw) return alert('No saved project found.');
    const data = JSON.parse(raw);
    setProject(data.project || 'My ARK App');
    setNodes(data.nodes || []);
    setSelected(data.nodes?.[0]?.id || null);
  };

  return <div className="app">
    <header>
      <div className="brand"><span>ARK</span> APP BUILDER <small>FULL VISUAL ENGINE</small></div>
      <input className="project-name" value={project} onChange={e => setProject(e.target.value)} />
      <div className="actions"><button onClick={loadProject}>Open</button><button onClick={saveProject}>Save</button><button className="build" onClick={() => alert('Build pipeline will generate an Android project from this graph.')}>Build APK</button></div>
    </header>
    <main>
      <aside className="toolbox">
        <h3>COMPONENTS</h3>
        <input placeholder="Search nodes..." />
        {catalog.map(([group, items]) => <section key={group}><h4>{group}</h4>{items.map(item => <button className="node-tool" key={item} onClick={() => addNode(item)}><b>{item[0]}</b>{item}</button>)}</section>)}
      </aside>
      <section className="workspace">
        <div className="workspace-bar"><span>APP CANVAS / NODE GRAPH</span><div><button onClick={() => setZoom(z => Math.max(.5, z-.1))}>−</button><b>{Math.round(zoom*100)}%</b><button onClick={() => setZoom(z => Math.min(1.5, z+.1))}>+</button><button onClick={connect}>Auto Connect</button></div></div>
        <div className="canvas" style={{ transform: `scale(${zoom})` }}>
          {nodes.map((node, i) => <div className={`node ${selected === node.id ? 'selected' : ''}`} key={node.id} style={{ left: node.x, top: node.y }} onClick={() => setSelected(node.id)}>
            <div className="node-head">{node.type}<span>●</span></div><strong>{node.title}</strong><div className="ports"><i>IN</i><i>OUT</i></div>{node.next && <div className="link-label">→ connected</div>}
          </div>)}
          {!nodes.length && <div className="empty"><strong>Start building</strong><p>Pick a component on the left, then connect nodes together.</p><p>Example: Event → Camera → AI Vision → Show Result</p></div>}
        </div>
      </section>
      <aside className="inspector"><h3>PROPERTIES</h3>{selectedNode ? <><label>Node</label><input value={selectedNode.title} onChange={e => setNodes(v => v.map(n => n.id === selected ? {...n, title: e.target.value} : n))}/><label>Type</label><div className="value">{selectedNode.type}</div><label>Enabled</label><input type="checkbox" checked={selectedNode.enabled} onChange={e => setNodes(v => v.map(n => n.id === selected ? {...n, enabled: e.target.checked} : n))}/><button className="delete" onClick={() => {setNodes(v => v.filter(n => n.id !== selected));setSelected(null)}}>Delete Node</button></> : <p>Select a node to edit its settings.</p>}<hr/><h3>PROJECT</h3><div className="feature">✓ Visual UI</div><div className="feature">✓ Node Logic</div><div className="feature">✓ Local Save</div><div className="feature">◌ Android Generator</div><div className="feature">◌ AI App Generator</div><div className="feature">◌ APK Build</div></aside>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
