// Base de dados de capitais e pontos turisticos
// Valores em BRL (R$) - estimativas de ingresso/passeio por pessoa

export const destinos = {
  "Brasilia, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Catedral de Brasilia", valor: 0, categoria: "Religioso" },
      { nome: "Congresso Nacional (visita guiada)", valor: 0, categoria: "Historico" },
      { nome: "Memorial JK", valor: 10, categoria: "Museu" },
      { nome: "Torre de TV", valor: 0, categoria: "Mirante" },
      { nome: "Palacio da Alvorada (visita)", valor: 0, categoria: "Historico" },
      { nome: "Parque da Cidade", valor: 0, categoria: "Natureza" },
    ],
  },
  "Rio de Janeiro, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Cristo Redentor (trem)", valor: 175, categoria: "Mirante" },
      { nome: "Pao de Acucar (bondinho)", valor: 185, categoria: "Mirante" },
      { nome: "Praia de Copacabana", valor: 0, categoria: "Praia" },
      { nome: "Praia de Ipanema", valor: 0, categoria: "Praia" },
      { nome: "Maracana (tour)", valor: 80, categoria: "Esporte" },
      { nome: "Jardim Botanico", valor: 75, categoria: "Natureza" },
      { nome: "Escadaria Selaron", valor: 0, categoria: "Cultural" },
    ],
  },
  "Sao Paulo, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "MASP", valor: 50, categoria: "Museu" },
      { nome: "Parque Ibirapuera", valor: 0, categoria: "Natureza" },
      { nome: "Avenida Paulista", valor: 0, categoria: "Cultural" },
      { nome: "Mercadao Municipal", valor: 0, categoria: "Gastronomia" },
      { nome: "Pinacoteca", valor: 25, categoria: "Museu" },
      { nome: "Beco do Batman", valor: 0, categoria: "Cultural" },
    ],
  },
  "Salvador, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Pelourinho", valor: 0, categoria: "Historico" },
      { nome: "Elevador Lacerda", valor: 0.15, categoria: "Historico" },
      { nome: "Igreja de Sao Francisco", valor: 15, categoria: "Religioso" },
      { nome: "Farol da Barra", valor: 15, categoria: "Mirante" },
      { nome: "Mercado Modelo", valor: 0, categoria: "Cultural" },
      { nome: "Praia do Porto da Barra", valor: 0, categoria: "Praia" },
    ],
  },
  "Manaus, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Teatro Amazonas", valor: 20, categoria: "Cultural" },
      { nome: "Encontro das Aguas (passeio)", valor: 200, categoria: "Natureza" },
      { nome: "Mercado Adolpho Lisboa", valor: 0, categoria: "Cultural" },
      { nome: "Praia da Ponta Negra", valor: 0, categoria: "Praia" },
      { nome: "Museu da Amazonia (MUSA)", valor: 30, categoria: "Museu" },
    ],
  },
  "Recife, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Marco Zero", valor: 0, categoria: "Historico" },
      { nome: "Instituto Ricardo Brennand", valor: 30, categoria: "Museu" },
      { nome: "Praia de Boa Viagem", valor: 0, categoria: "Praia" },
      { nome: "Olinda (passeio)", valor: 0, categoria: "Historico" },
      { nome: "Oficina Ceramica Brennand", valor: 30, categoria: "Cultural" },
    ],
  },
  "Fortaleza, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Praia do Futuro", valor: 0, categoria: "Praia" },
      { nome: "Mercado Central", valor: 0, categoria: "Cultural" },
      { nome: "Beach Park (Aquiraz)", valor: 380, categoria: "Diversao" },
      { nome: "Centro Dragao do Mar", valor: 0, categoria: "Cultural" },
      { nome: "Praia de Iracema", valor: 0, categoria: "Praia" },
    ],
  },
  "Belo Horizonte, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Praca da Liberdade", valor: 0, categoria: "Cultural" },
      { nome: "Mercado Central", valor: 0, categoria: "Gastronomia" },
      { nome: "Inhotim (Brumadinho)", valor: 70, categoria: "Museu" },
      { nome: "Mirante das Mangabeiras", valor: 0, categoria: "Mirante" },
      { nome: "Igreja da Pampulha", valor: 5, categoria: "Religioso" },
    ],
  },
  "Curitiba, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Jardim Botanico", valor: 0, categoria: "Natureza" },
      { nome: "Museu Oscar Niemeyer", valor: 30, categoria: "Museu" },
      { nome: "Opera de Arame", valor: 0, categoria: "Cultural" },
      { nome: "Trem para Morretes", valor: 270, categoria: "Passeio" },
      { nome: "Parque Tangua", valor: 0, categoria: "Natureza" },
    ],
  },
  "Porto Alegre, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    pontosTuristicos: [
      { nome: "Mercado Publico", valor: 0, categoria: "Gastronomia" },
      { nome: "Parque Farroupilha (Redencao)", valor: 0, categoria: "Natureza" },
      { nome: "Fundacao Ibere Camargo", valor: 20, categoria: "Museu" },
      { nome: "Usina do Gasometro (por do sol)", valor: 0, categoria: "Mirante" },
      { nome: "Catedral Metropolitana", valor: 0, categoria: "Religioso" },
    ],
  },
  "Paris, Franca": {
    pais: "Franca",
    bandeira: "🇫🇷",
    pontosTuristicos: [
      { nome: "Torre Eiffel (topo)", valor: 165, categoria: "Mirante" },
      { nome: "Museu do Louvre", valor: 120, categoria: "Museu" },
      { nome: "Arco do Triunfo", valor: 90, categoria: "Historico" },
      { nome: "Catedral de Notre-Dame", valor: 0, categoria: "Religioso" },
      { nome: "Disneyland Paris", valor: 480, categoria: "Diversao" },
      { nome: "Palacio de Versalhes", valor: 130, categoria: "Historico" },
      { nome: "Cruzeiro pelo Sena", valor: 90, categoria: "Passeio" },
    ],
  },
  "Londres, Reino Unido": {
    pais: "Reino Unido",
    bandeira: "🇬🇧",
    pontosTuristicos: [
      { nome: "London Eye", valor: 230, categoria: "Mirante" },
      { nome: "Torre de Londres", valor: 240, categoria: "Historico" },
      { nome: "Museu Britanico", valor: 0, categoria: "Museu" },
      { nome: "Big Ben (externo)", valor: 0, categoria: "Historico" },
      { nome: "Buckingham Palace (tour)", valor: 230, categoria: "Historico" },
      { nome: "Estudios Harry Potter", valor: 380, categoria: "Diversao" },
    ],
  },
  "Roma, Italia": {
    pais: "Italia",
    bandeira: "🇮🇹",
    pontosTuristicos: [
      { nome: "Coliseu", valor: 110, categoria: "Historico" },
      { nome: "Vaticano (Museus + Capela Sistina)", valor: 200, categoria: "Religioso" },
      { nome: "Fontana di Trevi", valor: 0, categoria: "Historico" },
      { nome: "Forum Romano", valor: 100, categoria: "Historico" },
      { nome: "Panteao", valor: 30, categoria: "Historico" },
      { nome: "Basilica de Sao Pedro", valor: 0, categoria: "Religioso" },
    ],
  },
  "Madri, Espanha": {
    pais: "Espanha",
    bandeira: "🇪🇸",
    pontosTuristicos: [
      { nome: "Museu do Prado", valor: 90, categoria: "Museu" },
      { nome: "Palacio Real", valor: 90, categoria: "Historico" },
      { nome: "Estadio Santiago Bernabeu (tour)", valor: 220, categoria: "Esporte" },
      { nome: "Parque do Retiro", valor: 0, categoria: "Natureza" },
      { nome: "Plaza Mayor", valor: 0, categoria: "Cultural" },
      { nome: "Mercado de San Miguel", valor: 0, categoria: "Gastronomia" },
    ],
  },
  "Lisboa, Portugal": {
    pais: "Portugal",
    bandeira: "🇵🇹",
    pontosTuristicos: [
      { nome: "Torre de Belem", valor: 50, categoria: "Historico" },
      { nome: "Mosteiro dos Jeronimos", valor: 75, categoria: "Religioso" },
      { nome: "Castelo de Sao Jorge", valor: 90, categoria: "Historico" },
      { nome: "Bondinho 28", valor: 20, categoria: "Passeio" },
      { nome: "Oceanario de Lisboa", valor: 140, categoria: "Diversao" },
      { nome: "Sintra (bate-volta)", valor: 250, categoria: "Passeio" },
    ],
  },
  "Toquio, Japao": {
    pais: "Japao",
    bandeira: "🇯🇵",
    pontosTuristicos: [
      { nome: "Torre de Toquio", valor: 90, categoria: "Mirante" },
      { nome: "Templo Senso-ji (Asakusa)", valor: 0, categoria: "Religioso" },
      { nome: "Tokyo DisneySea", valor: 380, categoria: "Diversao" },
      { nome: "Cruzamento de Shibuya", valor: 0, categoria: "Cultural" },
      { nome: "Palacio Imperial (jardins)", valor: 0, categoria: "Historico" },
      { nome: "Tour por Akihabara", valor: 250, categoria: "Cultural" },
    ],
  },
  "Nova York, EUA": {
    pais: "Estados Unidos",
    bandeira: "🇺🇸",
    pontosTuristicos: [
      { nome: "Estatua da Liberdade (ferry)", valor: 130, categoria: "Historico" },
      { nome: "Empire State Building", valor: 240, categoria: "Mirante" },
      { nome: "Top of the Rock", valor: 220, categoria: "Mirante" },
      { nome: "Central Park", valor: 0, categoria: "Natureza" },
      { nome: "Times Square", valor: 0, categoria: "Cultural" },
      { nome: "MoMA", valor: 160, categoria: "Museu" },
      { nome: "Memorial 11 de Setembro", valor: 160, categoria: "Historico" },
    ],
  },
  "Buenos Aires, Argentina": {
    pais: "Argentina",
    bandeira: "🇦🇷",
    pontosTuristicos: [
      { nome: "Caminito (La Boca)", valor: 0, categoria: "Cultural" },
      { nome: "Casa Rosada (tour)", valor: 0, categoria: "Historico" },
      { nome: "Cemiterio da Recoleta", valor: 50, categoria: "Historico" },
      { nome: "Show de Tango com Jantar", valor: 450, categoria: "Cultural" },
      { nome: "Estadio La Bombonera (tour)", valor: 180, categoria: "Esporte" },
      { nome: "Teatro Colon (visita)", valor: 90, categoria: "Cultural" },
    ],
  },
  "Berlim, Alemanha": {
    pais: "Alemanha",
    bandeira: "🇩🇪",
    pontosTuristicos: [
      { nome: "Portao de Brandemburgo", valor: 0, categoria: "Historico" },
      { nome: "Muro de Berlim (East Side Gallery)", valor: 0, categoria: "Historico" },
      { nome: "Reichstag (cupula)", valor: 0, categoria: "Historico" },
      { nome: "Ilha dos Museus", valor: 130, categoria: "Museu" },
      { nome: "Checkpoint Charlie (museu)", valor: 100, categoria: "Historico" },
    ],
  },
  "Amsterda, Holanda": {
    pais: "Holanda",
    bandeira: "🇳🇱",
    pontosTuristicos: [
      { nome: "Casa de Anne Frank", valor: 90, categoria: "Historico" },
      { nome: "Museu Van Gogh", valor: 130, categoria: "Museu" },
      { nome: "Rijksmuseum", valor: 130, categoria: "Museu" },
      { nome: "Cruzeiro pelos canais", valor: 100, categoria: "Passeio" },
      { nome: "Vondelpark", valor: 0, categoria: "Natureza" },
    ],
  },
  "Cairo, Egito": {
    pais: "Egito",
    bandeira: "🇪🇬",
    pontosTuristicos: [
      { nome: "Piramides de Gize", valor: 80, categoria: "Historico" },
      { nome: "Esfinge", valor: 0, categoria: "Historico" },
      { nome: "Museu Egipcio", valor: 100, categoria: "Museu" },
      { nome: "Passeio de camelo", valor: 70, categoria: "Passeio" },
      { nome: "Bazar Khan El-Khalili", valor: 0, categoria: "Cultural" },
    ],
  },
  "Sydney, Australia": {
    pais: "Australia",
    bandeira: "🇦🇺",
    pontosTuristicos: [
      { nome: "Sydney Opera House (tour)", valor: 160, categoria: "Cultural" },
      { nome: "Sydney Harbour Bridge Climb", valor: 1100, categoria: "Aventura" },
      { nome: "Bondi Beach", valor: 0, categoria: "Praia" },
      { nome: "Taronga Zoo", valor: 230, categoria: "Natureza" },
      { nome: "Blue Mountains (passeio)", valor: 600, categoria: "Natureza" },
    ],
  },
  "Cidade do Mexico, Mexico": {
    pais: "Mexico",
    bandeira: "🇲🇽",
    pontosTuristicos: [
      { nome: "Teotihuacan (piramides)", valor: 50, categoria: "Historico" },
      { nome: "Zocalo (centro historico)", valor: 0, categoria: "Historico" },
      { nome: "Museu Frida Kahlo", valor: 90, categoria: "Museu" },
      { nome: "Xochimilco (passeio de barco)", valor: 200, categoria: "Passeio" },
      { nome: "Castelo de Chapultepec", valor: 30, categoria: "Historico" },
    ],
  },
  "Dubai, Emirados Arabes": {
    pais: "Emirados Arabes",
    bandeira: "🇦🇪",
    pontosTuristicos: [
      { nome: "Burj Khalifa (124 andar)", valor: 280, categoria: "Mirante" },
      { nome: "Safari no deserto", valor: 350, categoria: "Aventura" },
      { nome: "Dubai Mall + Aquario", valor: 250, categoria: "Diversao" },
      { nome: "Palm Jumeirah (monorail)", valor: 100, categoria: "Passeio" },
      { nome: "Mesquita Jumeirah (tour)", valor: 150, categoria: "Religioso" },
    ],
  },
  "Atenas, Grecia": {
    pais: "Grecia",
    bandeira: "🇬🇷",
    pontosTuristicos: [
      { nome: "Acropole + Parthenon", valor: 130, categoria: "Historico" },
      { nome: "Museu da Acropole", valor: 80, categoria: "Museu" },
      { nome: "Plaka (bairro antigo)", valor: 0, categoria: "Cultural" },
      { nome: "Templo de Zeus Olimpico", valor: 50, categoria: "Historico" },
      { nome: "Bate-volta a Delfos", valor: 600, categoria: "Passeio" },
    ],
  },
}

export const listaDestinos = Object.keys(destinos).sort()

export const categorias = [
  "Historico",
  "Museu",
  "Religioso",
  "Mirante",
  "Natureza",
  "Praia",
  "Cultural",
  "Gastronomia",
  "Diversao",
  "Esporte",
  "Aventura",
  "Passeio",
  "Outro",
]

export function formatarBRL(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0)
}

export function calcularDiasViagem(dataIda, dataVolta) {
  if (!dataIda || !dataVolta) return []

  const inicio = new Date(`${dataIda}T12:00:00`)
  const fim = new Date(`${dataVolta}T12:00:00`)
  if (isNaN(inicio) || isNaN(fim) || fim < inicio) return []

  const dias = []
  const atual = new Date(inicio)
  let numero = 1
  while (atual <= fim && numero <= 365) {
    dias.push({
      numero,
      iso: atual.toISOString().slice(0, 10),
      dataFormatada: atual.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      diaSemana: atual.toLocaleDateString("pt-BR", { weekday: "short" }),
    })
    atual.setDate(atual.getDate() + 1)
    numero++
  }
  return dias
}
