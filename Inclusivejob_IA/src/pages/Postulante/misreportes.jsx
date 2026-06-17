import { useEffect, useState } from 'react';

import {
MapPin,
} from 'lucide-react';

import PortalLayout from '../../assets/Componentes/Portal/PortalLayout';

import {
postulantTheme as t,
} from '../../assets/Componentes/Portal/portalTheme';

import {
postulantNav,
} from '../../assets/Componentes/Portal/navItems';



const MOCK_USER = {
nombre:'Luis',
rol:'Postulante',
};



function Card({ children }) {
return (

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



function SectionHead({ title }) {

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

const[
reportes,
setReportes
]=
useState([]);

const[
loading,
setLoading
]=
useState(true);



useEffect(()=>{

cargarReportes();

},[]);



async function cargarReportes(){

try{

const res=
await fetch(
'http://localhost/inclusijob_back/back-inclusiveJob/Modelo/Postulante/reportes.php'
);

const data=
await res.json();

if(
data.ok
){

setReportes(
data.data
);

}

}
catch(error){

console.log(
error
);

}
finally{

setLoading(
false
);

}

}



return(

<PortalLayout
theme={t}
navItems={postulantNav}
user={MOCK_USER}
pageTitle="Reportes realizados"
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

{/* HERO */}

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

Seguimiento de reportes

</p>

<h1
style={{
margin:0,
fontSize:'44px',
fontWeight:800,
}}
>

Reportes realizados

</h1>

<p
style={{
marginTop:'16px',
maxWidth:'700px',
lineHeight:1.6,
}}
>

Consulta los reportes que realizaste sobre vacantes.

</p>

</div>



<Card>

  <SectionHead
    title="Mis reportes"
  />

  {

    loading

    ?

    <div
      style={{
        padding: '30px',
      }}
    >
      Cargando reportes...
    </div>

    :

    reportes.length === 0

    ?

    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        color: t.textMuted,
        fontSize: '15px',
      }}
    >
      Sin reportes realizados
    </div>

    :

    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >

      {

        reportes.map(
          (
            r,
            i
          ) => (

            <li

              key={
                r.id
              }

              style={{

                padding: '22px',

                borderBottom:

                  i <
                  reportes.length - 1

                    ?

                    `1px solid ${t.border}`

                    :

                    'none',

              }}

            >

              <div
                style={{

                  display: 'flex',

                  justifyContent: 'space-between',

                  alignItems: 'center',

                  gap: '20px',

                }}
              >

                <div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: '18px',
                      color: t.textPrimary,
                    }}
                  >
                    {r.vacante}
                  </h3>


                  <div
                    style={{

                      display: 'flex',

                      alignItems: 'center',

                      gap: '10px',

                      marginTop: '10px',

                      color: t.textMuted,

                    }}

                  >

                    <MapPin
                      size={14}
                    />

                    {r.modalidad}

                    •

                    {

                      new Date(
                        r.fecha
                      )

                      .toLocaleDateString(
                        'es-MX',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )

                    }

                  </div>

                </div>


                <button
                  onClick={() => {

                    console.log(
                      r.motivo
                    );

                  }}

                  style={{

                    padding:
                      '8px 14px',

                    border:
                      `1px solid ${t.border}`,

                    background:
                      '#fff',

                    borderRadius:
                      '10px',

                    cursor:
                      'pointer',

                    fontWeight:
                      600,

                    color:
                      t.accent,

                  }}

                >

                  Ver motivo

                </button>

              </div>

            </li>

          )

        )

      }

    </ul>

  }

</Card>

</div>

</PortalLayout>

);

}