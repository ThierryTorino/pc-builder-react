import { usePcStore } from "../store/usePcStore";
import { supabase } from "../supabase";
import {toast} from 'react-toastify'


export const ResumoLateral = () =>{

    const cpu = usePcStore((e) => e.cpuSelecionada)
    const placa_mae = usePcStore((e) => e.placaMaeSelecionada)
    const ram = usePcStore((e) => e.ramSelecionada)
    const gpu = usePcStore((e) => e.gpuSelecionada)
    const armazenamento = usePcStore((e) => e.armazenamentoSelecionado)
    const fonte = usePcStore((e) => e.fonteSelecionada)

    const removerCpu = usePcStore((state) => state.removerCpu)
    const removerPlacaMae = usePcStore((state) => state.removerPlacaMae)
    const removerRam = usePcStore((state) => state.removerRam)
    const removerGpu = usePcStore((state) => state.removerGpu)
    const removerArmazenamento = usePcStore((state) => state.removerArmazenamento)
    const removerFonte = usePcStore((state) => state.removerFonte)

    const placaMaeSelecionada = usePcStore((state) => state.placaMaeSelecionada)
    const cpuSelecionada = usePcStore((state) => state.cpuSelecionada)
    const gpuSelecionada = usePcStore((state) => state.gpuSelecionada)
    const ramSelecionada = usePcStore((state) => state.ramSelecionada)
    const armazenamentoSelecionada = usePcStore((state) => state.armazenamentoSelecionado)
    const fonteSelecionada = usePcStore((state) => state.fonteSelecionada)

    const precoTotal = (cpu?.preco || 0) + (placa_mae?.preco || 0) + (ram?.preco || 0) + (gpu?.preco || 0) + (armazenamento?.preco || 0) + (fonte?.preco || 0)

     const consumoWatts = (cpuSelecionada?.consumo_watts || 0) + (placaMaeSelecionada?.consumo_watts || 0) + (gpuSelecionada?.consumo_watts || 0) + (ramSelecionada?.consumo_watts || 0) + (armazenamentoSelecionada?.consumo_watts || 0) + (fonteSelecionada?.consumo_watts || 0)
    
     const handleSalvarSetup  = async () =>{
      if (!cpu || !placa_mae) {
          toast.warning("Escolha pelo menos um processador e uma placa-mãe para salvar!");
          return;
        }

      const {error} = await supabase
      .from('setups_salvos')
      .insert([
        {
        cpu_id: cpu?.id,
        gpu_id: gpu?.id,
        placa_mae_id: placa_mae?.id,
        ram_id: ram?.id,
        armazenamento_id: armazenamento?.id,
        fonte_id: fonte?.id,
        preco_total: precoTotal
        },
      ])

      if (error) {
            console.error("Erro do Supabase:", error.message);
            toast.error("Ocorreu um erro ao salvar seu setup.");
            return;
        }

        toast.success("Setup finalizado e salvo com sucesso! 🎉");
    }

    return (
    <aside className="w-80 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col h-fit sticky top-10">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
        Seu Setup
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        <ItemResumo titulo="Processador" peca={cpu} onRemove={removerCpu}/>
        <ItemResumo titulo="Placa-Mãe" peca={placa_mae} onRemove={removerPlacaMae}/>
        <ItemResumo titulo="Memória RAM" peca={ram} onRemove={removerRam}/>
        <ItemResumo titulo="Placa de Vídeo" peca={gpu} onRemove={removerGpu}/>
        <ItemResumo titulo="Armazenamento" peca={armazenamento} onRemove={removerArmazenamento}/>
        <ItemResumo titulo="Fonte" peca={fonte} onRemove={removerFonte}/>
      </div>

      <div className="flex justify-between items-end">
          <span className="text-gray-400 font-medium text-sm">Consumo Estimado</span>
          <span className="text-lg font-bold text-yellow-500">
            {consumoWatts} W
          </span>
        </div>
      <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-end">
        <span className="text-gray-400 font-medium">Total Estimado</span>
        <span className="text-2xl font-bold text-green-400">
          R$ {precoTotal.toFixed(2)}
        </span>
      </div>
      
      <button 
        onClick={handleSalvarSetup}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Finalizar Setup
      </button>
    </aside>
  );
};

const ItemResumo = ({ titulo, peca, onRemove }: { titulo: string; peca: any; onRemove: () => void }) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {titulo}
      </span>
      
      {peca ? (

        
        <div className="flex justify-between items-start bg-gray-900/50 p-2 rounded border border-gray-700/50">
          <span className="text-sm text-gray-200 line-clamp-2 pr-2">{peca.nome}</span>
          <span className="text-sm font-bold text-green-400 whitespace-nowrap">
            R$ {peca.preco}
          </span>
          <button className="text-red-500 hover:text-red-400 font-bold text-lg transition-colors" onClick={onRemove}>X</button>
        </div>
      ) : (
        <div className="bg-gray-800 p-2 rounded border border-dashed border-gray-600 flex items-center justify-center">
          <span className="text-sm text-gray-500 italic">Nenhuma peça escolhida</span>
        </div>
      )}
    </div>
  );
}