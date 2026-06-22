import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
MapPin,
Eye,
X,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';

import {
postulantTheme as t,
} from '../../assets/Componentes/Portal/portalTheme';

import {
postulantNav,
} from '../../assets/Componentes/Portal/navItems';



const MOCK_USER={
nombre:'Luis',
rol:'Postulante',
};



const ESTADO_STYLE={

revisando:{
bg:'#fef3c7',
text:'#92400e',
border:'#fde68a',
},

aceptado:{
bg:'#dcfce7',
text:'#166534',
border:'#86efac',
},

rechazado:{
bg:'#fee2e2',
text:'#991b1b',
border:'#fca5a5',
},

};



function Badge({estado}){

const s=

ESTADO_STYLE[
estado?.toLowerCase()
]

||

ESTADO_STYLE.revisando;

return(

<span
style={{
padding:'7px 14px',
borderRadius:'999px',
background:s.bg,
color:s.text,
border:`1px solid ${s.border}`,
fontSize:'12px',
fontWeight:700,
}}
>

{estado}

</span>

);

}



function Card({children}){

return(

<div
style={{
background:'#fff',
border:`1px solid ${t.border}`,
borderRadius:'18px',
overflow:'hidden',
boxShadow:'0 2px 8px rgba(15,23,41,.05)',
}}
>

{children}

</div>

);

}



function SectionHead({title}){

return(

<div
style={{
padding:'18px 22px',
borderBottom:`1px solid ${t.border}`,
}}
>

<h2
style={{
margin:0,
fontSize:'16px',
fontWeight:700,
color:t.textPrimary,
}}
>

{title}

</h2>

</div>

);

}



export default function PostulanteDashboard(){

const navigate=
useNavigate();

const[
postulaciones,
setPostulaciones
]=
useState([]);

const[
loading,
setLoading
]=
useState(true);

const[
busqueda,
setBusqueda
]=
useState('');



useEffect(()=>{

cargarPostulaciones();

},[]);



async function cargarPostulaciones(){

try{

const res=
await fetch(
'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/postulaciones.php'
);

const data=
await res.json();

if(
data.ok
){

setPostulaciones(
data.data
);

}

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

}



const postulacionesFiltradas=

postulaciones.filter((p)=>{

const texto=`

${p.vacante||''}

${p.modalidad||''}

${p.estado||''}

${p.fecha||''}

`

.toLowerCase();

return texto.includes(
busqueda.toLowerCase()
);

});



return(

<PortalLayout
theme={t}
navItems={postulantNav}
user={MOCK_USER}
pageTitle="Mis postulaciones"
>

<div
style={{
maxWidth:'1400px',
margin:'0 auto',
display:'flex',
flexDirection:'column',
gap:'24px',
}}
>

<div
style={{
borderRadius:'24px',
padding:'40px',
color:'#fff',
background:
'linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#0ea5e9 100%)',
minHeight:'220px',
display:'flex',
justifyContent:'center',
flexDirection:'column',
}}
>

<p
style={{
margin:'0 0 8px',
opacity:.85,
}}
>

Seguimiento de procesos

</p>

<h1
style={{
margin:0,
fontSize:'44px',
fontWeight:800,
}}
>

Estado de tus postulaciones

</h1>

<p
style={{
marginTop:'16px',
maxWidth:'700px',
lineHeight:1.6,
}}
>

Consulta el avance de cada solicitud.

</p>

</div>



<Card>

<SectionHead
title="Mis postulaciones"
/>



<div
style={{
padding:'20px 22px',
borderBottom:`1px solid ${t.border}`,
}}
>

<input

value={busqueda}

onChange={
(e)=>
setBusqueda(
e.target.value
)
}

placeholder="Buscar vacante, ubicación o estado..."

style={{

width:'100%',

padding:'12px 16px',

border:`1px solid ${t.border}`,

borderRadius:'12px',

outline:'none',

fontSize:'14px',

background:'#fff',

color:t.textPrimary,

}}

>

</input>

</div>



{

loading

?

<div
style={{
padding:'30px',
}}
>

Cargando postulaciones...

</div>

:

postulacionesFiltradas.length===0

?

<div
style={{
padding:'40px',
textAlign:'center',
color:t.textMuted,
}}
>

{

busqueda

?

'No se encontraron postulaciones'

:

'No tienes postulaciones'

}

</div>

:

<div
style={{
overflowX:'auto',
}}
>

<table
style={{
width:'100%',
borderCollapse:'collapse',
}}
>

<thead>

<tr>

{

[
'VACANTE',
'UBICACIÓN',
'ESTADO',
'FECHA',
'ACCIONES',
]

.map((h)=>(

<th
key={h}
style={{
padding:'18px 22px',
textAlign:'left',
fontSize:'13px',
fontWeight:600,
letterSpacing:'1px',
color:t.textMuted,
borderBottom:`1px solid ${t.border}`,
}}
>

{h}

</th>

))

}

</tr>

</thead>



<tbody>

{

postulacionesFiltradas.map(

(
p,
i
)=>(

<tr
key={p.id}
style={{
borderBottom:

i<
postulacionesFiltradas.length-1

?

`1px solid ${t.border}`

:

'none',
}}
>

<td style={{padding:'22px'}}>

<div
style={{
fontWeight:600,
fontSize:'18px',
color:t.textPrimary,
}}
>

{p.vacante}

</div>

</td>



<td style={{padding:'22px'}}>

<div
style={{
display:'flex',
alignItems:'center',
gap:'10px',
color:t.textMuted,
}}
>

<MapPin size={14}/>

{p.modalidad}

</div>

</td>



<td style={{padding:'22px'}}>

<Badge
estado={p.estado}
/>

</td>



<td
style={{
padding:'22px',
whiteSpace:'nowrap',
}}
>

{

new Date(
p.fecha
)

.toLocaleDateString(
'es-MX',
{
day:'numeric',
month:'short',
year:'numeric',
}

)

}

</td>



<td style={{padding:'22px'}}>

<div
style={{
display:'flex',
gap:'8px',
}}
>

<button

onClick={()=>
navigate(
`/vacantes/${p.id_vacante}`
)
}

style={{
width:'40px',
height:'40px',
border:`1px solid ${t.border}`,
background:'#fff',
borderRadius:'10px',
cursor:'pointer',
}}

>

<Eye
size={16}
color={t.accent}
/>

</button>



<button

onClick={()=>
console.log(
'Despostular',
p.id
)
}

style={{
width:'40px',
height:'40px',
border:'1px solid #fecaca',
background:'#fff5f5',
borderRadius:'10px',
cursor:'pointer',
}}

>

<X
size={16}
color='#dc2626'
/>

</button>

</div>

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

}

</Card>

</div>

</PortalLayout>

);

}
