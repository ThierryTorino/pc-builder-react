import { useState } from "react";
import { usePcStore } from "../store/usePcStore";
import {toast} from 'react-toastify'

interface Props{
    pecasBanco: any[]
}

export const PainelDeSelecao = ({pecasBanco}: Props) =>{

    const placaMaeSelecionada = usePcStore((state) => state.placaMaeSelecionada)
    const cpuSelecionada = usePcStore((state) => state.cpuSelecionada)
    const gpuSelecionada = usePcStore((state) => state.gpuSelecionada)
    const ramSelecionada = usePcStore((state) => state.ramSelecionada)
    const armazenamentoSelecionada = usePcStore((state) => state.armazenamentoSelecionado)
    const fonteSelecionada = usePcStore((state) => state.fonteSelecionada)

    const consumoWatts = (cpuSelecionada?.consumo_watts || 0) + (placaMaeSelecionada?.consumo_watts || 0) + (gpuSelecionada?.consumo_watts || 0) + (ramSelecionada?.consumo_watts || 0) + (armazenamentoSelecionada?.consumo_watts || 0) + (fonteSelecionada?.consumo_watts || 0)

    const setCpu = usePcStore((state) => state.setCpu)
    const setGpu = usePcStore((state) => state.setGpu)
    const setArmazenamento = usePcStore((state) => state.setArmazenamento)
    const setPlacaMae = usePcStore((state) => state.setPlacaMae)
    const setFonte = usePcStore((state) => state.setFonte)
    const setRam = usePcStore((state) => state.setRam)

    const [abaAtiva, setAbaAtiva] = useState("CPU")

    const pecasFiltradas = pecasBanco.filter((peca) =>{
        return peca.categoria === abaAtiva
    })

    console.log("Olha o que chegou no painel:", pecasBanco);

    const categorias = ["CPU", "GPU", "PLACA_MAE", "FONTE", "ARMAZENAMENTO", "RAM"]

    const handleAdicionarPeca = (peca: any) =>{
        if(peca.categoria === "CPU"){
            if(placaMaeSelecionada){
                if(peca.soquete !== placaMaeSelecionada.soquete){
                    toast.error('Atenção: O soquete do processador não encaixa aqui.')
                    return
                }
            }
            setCpu(peca)
        } else if (peca.categoria === "GPU"){
            setGpu(peca)
        } else if (peca.categoria === "PLACA_MAE"){
            if(cpuSelecionada){
                if(peca.soquete !== cpuSelecionada.soquete){
                    toast.error('Atenção: O soquete da placa mão não condiz com o processador.')
                    return
                }   
            }

            if(ramSelecionada){
                if(peca.tipo_ram !== ramSelecionada.tipo_ram){
                    toast.error("Placa mãe e memoria ram nao condizem!")
                    return
                }
            }
            setPlacaMae(peca)
        } else if (peca.categoria === "ARMAZENAMENTO"){
            setArmazenamento(peca)
        } else if (peca.categoria === "FONTE"){
            if(peca.potencia_fonte < consumoWatts){
                toast.warning("Essa fonte não aguenta seu setup!!")
                return
            }
            setFonte(peca)
        } else if (peca.categoria === "RAM"){
            if(placaMaeSelecionada){
                if(peca.tipo_ram !== placaMaeSelecionada.tipo_ram){
                    toast.error("Placa mae e memoria ram nao condizem")
                    return
                }
            }
            setRam(peca)
        }
    }

    const verificarAdicao = (peca: any) => {
        if(peca.categoria === "CPU") return cpuSelecionada?.id === peca.id
        if(peca.categoria === "GPU") return gpuSelecionada?.id === peca.id
        if(peca.categoria === "ARMAZENAMENTO") return armazenamentoSelecionada?.id === peca.id
        if(peca.categoria === "FONTE") return fonteSelecionada?.id === peca.id
        if(peca.categoria === "PLACA_MAE") return placaMaeSelecionada?.id === peca.id
        if(peca.categoria === "RAM") return ramSelecionada?.id === peca.id
        return false
    }

    return( 
        <div className="bg-gray-800 p-10 text-white flex-1">
            <h1 className="text-2xl font-bold mb-4">Painel de Peças</h1>
            
            <h2 className="text-blue-400 mb-4">Você está vendo: {abaAtiva}</h2>


            <div className="flex gap-4 mb-6">
                {categorias.map((categoria) =>(
                    <button key={categoria} className="t-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors" onClick={() => setAbaAtiva(categoria)}>{categoria}</button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {pecasFiltradas.map((peca) => (
                    <div 
                        key={peca.id} 
                        className="border border-gray-600 p-4 rounded-lg bg-gray-900 flex justify-between items-center">

                        <div>
                            <p className="font-bold text-lg">{peca.nome}</p>
                            <p className="text-green-400 font-medium">R$ {peca.preco}</p>
                            <div className="flex gap-2">
                            {peca.soquete && (
                                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700">
                                    Soquete: {peca.soquete}
                                </span>
                            )}
                            {peca.consumo_watts > 0 && (
                                <span className="bg-gray-800 text-yellow-500 text-xs px-2 py-1 rounded border border-gray-700">
                                    Consome: {peca.consumo_watts}W
                                </span>
                            )}
                            {peca.capacidade_watts && (
                                <span className="bg-gray-800 text-blue-400 text-xs px-2 py-1 rounded border border-gray-700">
                                    Entrega: {peca.capacidade_watts}W
                                </span>
                            )}
                            {peca.potencia_fonte && (
                                <span className="bg-gray-800 text-blue-400 text-xs px-2 py-1 rounded border border-gray-700">
                                    Entrega: {peca.potencia_fonte}W
                                </span>
                            )}
                        </div>
                        </div>

                        {(() =>{
                            const jaAdicionada = verificarAdicao(peca)

                            return(
                                <button onClick={() => handleAdicionarPeca(peca)}
                                    disabled={jaAdicionada}
                                    className={`font-bold py-2 px-6 rounded-lg transition-colors text-white 
                                    ${jaAdicionada 
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-500"
                                    }
                                `}>
                                    {jaAdicionada? "Adicionado" : "Adicionar"}
                                </button>
                            )
                        })()}
                    </div>
                ))}
            </div>            
        </div>
    )
}