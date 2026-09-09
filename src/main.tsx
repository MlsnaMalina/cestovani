import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './style.css';
class Boundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<main className="fatal"><h1>Plán se nepodařilo otevřít</h1><p>Zkuste stránku obnovit. Uložený plán zůstává v tomto prohlížeči.</p><button onClick={()=>window.location.reload()}>Obnovit stránku</button></main>:this.props.children;}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>);
