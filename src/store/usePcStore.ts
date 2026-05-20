import {create} from 'zustand'

interface Peca {
    id: string
    nome : string
    categoria: string 
    preco: number
    soquete?: string 
    consumo_watts?: number
    tipo_ram?: string
}

interface PcStore{
    cpuSelecionada: Peca | null
    placaMaeSelecionada: Peca | null
    ramSelecionada: Peca | null
    gpuSelecionada: Peca | null
    fonteSelecionada: Peca | null
    armazenamentoSelecionado: Peca | null

    setCpu: (pecaEscolhida: Peca) => void
    setPlacaMae: (pecaEscolhida: Peca) => void
    setRam: (pecaEscolhida: Peca) => void
    setGpu: (pecaEscolhida: Peca) => void
    setFonte: (pecaEscolhida: Peca) => void
    setArmazenamento: (pecaEscolhida: Peca) => void

    removerCpu: () => void
    removerPlacaMae: () => void
    removerRam: () => void
    removerGpu: () => void
    removerFonte: () => void
    removerArmazenamento: () => void
}

export const usePcStore = create<PcStore>((set) =>({
    cpuSelecionada: null,
    placaMaeSelecionada: null,
    ramSelecionada: null,
    gpuSelecionada: null,
    fonteSelecionada: null,
    armazenamentoSelecionado: null,

    setCpu: (pecaEscolhida) => set({cpuSelecionada: pecaEscolhida}),
    setPlacaMae: (pecaEscolhida) => set({placaMaeSelecionada: pecaEscolhida}),
    setRam: (pecaEscolhida) => set({ramSelecionada: pecaEscolhida}),
    setGpu: (pecaEscolhida) => set({gpuSelecionada: pecaEscolhida}),
    setFonte: (pecaEscolhida) => set({fonteSelecionada: pecaEscolhida}),
    setArmazenamento: (pecaEscolhida) => set({armazenamentoSelecionado: pecaEscolhida}),

    removerCpu: () => set({cpuSelecionada: null}),
    removerPlacaMae: () => set({placaMaeSelecionada: null}),
    removerRam: () => set({ramSelecionada: null}),
    removerGpu: () => set({gpuSelecionada: null}),
    removerFonte: () => set({fonteSelecionada: null}),
    removerArmazenamento: () => set({armazenamentoSelecionado: null})
}))