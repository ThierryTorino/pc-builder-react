import { useEffect, useState } from 'react'
import './App.css'
import { PainelDeSelecao } from './components/PainelDeSelecao'
import { ResumoLateral } from './components/ResumoLateral'
import { supabase } from './supabase'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  const [pecas, setPecas] = useState<any[]>([])

  async function buscarPecas(){
    const {data} = await supabase.from('componentes').select('*')
    if(data){
      setPecas(data)
    }
  }
  
  useEffect(() =>{
    buscarPecas()
  }, [])
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        
        <PainelDeSelecao pecasBanco={pecas} />
        <ResumoLateral />
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </div>
  )
}

export default App
