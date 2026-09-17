// Base de dados de capitais e pontos turísticos
// Valores em BRL (R$) - estimativas de ingresso/passeio por pessoa

export const destinos = {
  "Brasília, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    moedaLocal: "BRL",
    coords: { lat: -15.7942, lng: -47.8822 },
    pontosTuristicos: [
      { nome: "Catedral de Brasília", valor: 0, categoria: "Religioso" },
      { nome: "Congresso Nacional (visita guiada)", valor: 0, categoria: "Histórico" },
      { nome: "Memorial JK", valor: 10, categoria: "Museu" },
      { nome: "Torre de TV", valor: 0, categoria: "Mirante" },
      { nome: "Palácio da Alvorada (visita)", valor: 0, categoria: "Histórico" },
      { nome: "Parque da Cidade", valor: 0, categoria: "Natureza" },
    ],
  },
  "Rio de Janeiro, Brasil": {
    pais: "Brasil",
    bandeira: "🇧🇷",
    moedaLocal: "BRL",
    coords: { lat: -22.9068, lng: -43.1729 },
    pontosTuristicos: [
      { nome: "Cristo Redentor (trem)", valor: 175, categoria: "Mirante" },
      { nome: "Pão de Açúcar (bondinho)", valor: 185, categoria: "Mirante" },
      { nome: "Praia de Copacabana", valor: 0, categoria: "Praia" },
      { nome: "Praia de Ipanema", valor: 0, categoria: "Praia" },
      { nome: "Maracanã (tour)", valor: 80, categoria: "Esporte" },
      { nome: "Jardim Botânico", valor: 75, categoria: "Natureza" },
      { nome: "Escadaria Selarón", valor: 0, categoria: "Cultural" },
    ],
  },
  "São Paulo, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -23.5505, lng: -46.6333 },
    pontosTuristicos: [
      { nome: "MASP", valor: 50, categoria: "Museu" },
      { nome: "Parque Ibirapuera", valor: 0, categoria: "Natureza" },
      { nome: "Avenida Paulista", valor: 0, categoria: "Cultural" },
      { nome: "Mercadão Municipal", valor: 0, categoria: "Gastronomia" },
      { nome: "Pinacoteca", valor: 25, categoria: "Museu" },
      { nome: "Beco do Batman", valor: 0, categoria: "Cultural" },
    ],
  },
  "Salvador, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -12.9714, lng: -38.5014 },
    pontosTuristicos: [
      { nome: "Pelourinho", valor: 0, categoria: "Histórico" },
      { nome: "Elevador Lacerda", valor: 0.15, categoria: "Histórico" },
      { nome: "Igreja de São Francisco", valor: 15, categoria: "Religioso" },
      { nome: "Farol da Barra", valor: 15, categoria: "Mirante" },
      { nome: "Mercado Modelo", valor: 0, categoria: "Cultural" },
      { nome: "Praia do Porto da Barra", valor: 0, categoria: "Praia" },
    ],
  },
  "Manaus, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -3.119, lng: -60.0217 },
    pontosTuristicos: [
      { nome: "Teatro Amazonas", valor: 20, categoria: "Cultural" },
      { nome: "Encontro das Águas (passeio)", valor: 200, categoria: "Natureza" },
      { nome: "Mercado Adolpho Lisboa", valor: 0, categoria: "Cultural" },
      { nome: "Praia da Ponta Negra", valor: 0, categoria: "Praia" },
      { nome: "Museu da Amazônia (MUSA)", valor: 30, categoria: "Museu" },
    ],
  },
  "Recife, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -8.0476, lng: -34.877 },
    pontosTuristicos: [
      { nome: "Marco Zero", valor: 0, categoria: "Histórico" },
      { nome: "Instituto Ricardo Brennand", valor: 30, categoria: "Museu" },
      { nome: "Praia de Boa Viagem", valor: 0, categoria: "Praia" },
      { nome: "Olinda (passeio)", valor: 0, categoria: "Histórico" },
      { nome: "Oficina Cerâmica Brennand", valor: 30, categoria: "Cultural" },
    ],
  },
  "Fortaleza, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -3.7172, lng: -38.5433 },
    pontosTuristicos: [
      { nome: "Praia do Futuro", valor: 0, categoria: "Praia" },
      { nome: "Mercado Central", valor: 0, categoria: "Cultural" },
      { nome: "Beach Park (Aquiraz)", valor: 380, categoria: "Diversão" },
      { nome: "Centro Dragão do Mar", valor: 0, categoria: "Cultural" },
      { nome: "Praia de Iracema", valor: 0, categoria: "Praia" },
    ],
  },
  "Belo Horizonte, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -19.9167, lng: -43.9345 },
    pontosTuristicos: [
      { nome: "Praça da Liberdade", valor: 0, categoria: "Cultural" },
      { nome: "Mercado Central", valor: 0, categoria: "Gastronomia" },
      { nome: "Inhotim (Brumadinho)", valor: 70, categoria: "Museu" },
      { nome: "Mirante das Mangabeiras", valor: 0, categoria: "Mirante" },
      { nome: "Igreja da Pampulha", valor: 5, categoria: "Religioso" },
    ],
  },
  "Curitiba, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -25.4284, lng: -49.2733 },
    pontosTuristicos: [
      { nome: "Jardim Botânico", valor: 0, categoria: "Natureza" },
      { nome: "Museu Oscar Niemeyer", valor: 30, categoria: "Museu" },
      { nome: "Ópera de Arame", valor: 0, categoria: "Cultural" },
      { nome: "Trem para Morretes", valor: 270, categoria: "Passeio" },
      { nome: "Parque Tanguá", valor: 0, categoria: "Natureza" },
    ],
  },
  "Porto Alegre, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -30.0346, lng: -51.2177 },
    pontosTuristicos: [
      { nome: "Mercado Público", valor: 0, categoria: "Gastronomia" },
      { nome: "Parque Farroupilha (Redenção)", valor: 0, categoria: "Natureza" },
      { nome: "Fundação Iberê Camargo", valor: 20, categoria: "Museu" },
      { nome: "Usina do Gasômetro (pôr do sol)", valor: 0, categoria: "Mirante" },
      { nome: "Catedral Metropolitana", valor: 0, categoria: "Religioso" },
    ],
  },
  "Paris, França": {
    pais: "França", bandeira: "🇫🇷", moedaLocal: "EUR",
    coords: { lat: 48.8566, lng: 2.3522 },
    pontosTuristicos: [
      { nome: "Torre Eiffel (topo)", valor: 165, categoria: "Mirante" },
      { nome: "Museu do Louvre", valor: 120, categoria: "Museu" },
      { nome: "Arco do Triunfo", valor: 90, categoria: "Histórico" },
      { nome: "Catedral de Notre-Dame", valor: 0, categoria: "Religioso" },
      { nome: "Disneyland Paris", valor: 480, categoria: "Diversão" },
      { nome: "Palácio de Versalhes", valor: 130, categoria: "Histórico" },
      { nome: "Cruzeiro pelo Sena", valor: 90, categoria: "Passeio" },
    ],
  },
  "Londres, Reino Unido": {
    pais: "Reino Unido", bandeira: "🇬🇧", moedaLocal: "GBP",
    coords: { lat: 51.5074, lng: -0.1278 },
    pontosTuristicos: [
      { nome: "London Eye", valor: 230, categoria: "Mirante" },
      { nome: "Torre de Londres", valor: 240, categoria: "Histórico" },
      { nome: "Museu Britânico", valor: 0, categoria: "Museu" },
      { nome: "Big Ben (externo)", valor: 0, categoria: "Histórico" },
      { nome: "Buckingham Palace (tour)", valor: 230, categoria: "Histórico" },
      { nome: "Estúdios Harry Potter", valor: 380, categoria: "Diversão" },
    ],
  },
  "Roma, Itália": {
    pais: "Itália", bandeira: "🇮🇹", moedaLocal: "EUR",
    coords: { lat: 41.9028, lng: 12.4964 },
    pontosTuristicos: [
      { nome: "Coliseu", valor: 110, categoria: "Histórico" },
      { nome: "Vaticano (Museus + Capela Sistina)", valor: 200, categoria: "Religioso" },
      { nome: "Fontana di Trevi", valor: 0, categoria: "Histórico" },
      { nome: "Fórum Romano", valor: 100, categoria: "Histórico" },
      { nome: "Panteão", valor: 30, categoria: "Histórico" },
      { nome: "Basílica de São Pedro", valor: 0, categoria: "Religioso" },
    ],
  },
  "Madri, Espanha": {
    pais: "Espanha", bandeira: "🇪🇸", moedaLocal: "EUR",
    coords: { lat: 40.4168, lng: -3.7038 },
    pontosTuristicos: [
      { nome: "Museu do Prado", valor: 90, categoria: "Museu" },
      { nome: "Palácio Real", valor: 90, categoria: "Histórico" },
      { nome: "Estádio Santiago Bernabéu (tour)", valor: 220, categoria: "Esporte" },
      { nome: "Parque do Retiro", valor: 0, categoria: "Natureza" },
      { nome: "Plaza Mayor", valor: 0, categoria: "Cultural" },
      { nome: "Mercado de San Miguel", valor: 0, categoria: "Gastronomia" },
    ],
  },
  "Lisboa, Portugal": {
    pais: "Portugal", bandeira: "🇵🇹", moedaLocal: "EUR",
    coords: { lat: 38.7223, lng: -9.1393 },
    pontosTuristicos: [
      { nome: "Torre de Belém", valor: 50, categoria: "Histórico" },
      { nome: "Mosteiro dos Jerônimos", valor: 75, categoria: "Religioso" },
      { nome: "Castelo de São Jorge", valor: 90, categoria: "Histórico" },
      { nome: "Bondinho 28", valor: 20, categoria: "Passeio" },
      { nome: "Oceanário de Lisboa", valor: 140, categoria: "Diversão" },
      { nome: "Sintra (bate-volta)", valor: 250, categoria: "Passeio" },
    ],
  },
  "Tóquio, Japão": {
    pais: "Japão", bandeira: "🇯🇵", moedaLocal: "JPY",
    coords: { lat: 35.6762, lng: 139.6503 },
    pontosTuristicos: [
      { nome: "Torre de Tóquio", valor: 90, categoria: "Mirante" },
      { nome: "Templo Senso-ji (Asakusa)", valor: 0, categoria: "Religioso" },
      { nome: "Tokyo DisneySea", valor: 380, categoria: "Diversão" },
      { nome: "Cruzamento de Shibuya", valor: 0, categoria: "Cultural" },
      { nome: "Palácio Imperial (jardins)", valor: 0, categoria: "Histórico" },
      { nome: "Tour por Akihabara", valor: 250, categoria: "Cultural" },
    ],
  },
  "Nova York, EUA": {
    pais: "Estados Unidos", bandeira: "🇺🇸", moedaLocal: "USD",
    coords: { lat: 40.7128, lng: -74.006 },
    pontosTuristicos: [
      { nome: "Estátua da Liberdade (ferry)", valor: 130, categoria: "Histórico" },
      { nome: "Empire State Building", valor: 240, categoria: "Mirante" },
      { nome: "Top of the Rock", valor: 220, categoria: "Mirante" },
      { nome: "Central Park", valor: 0, categoria: "Natureza" },
      { nome: "Times Square", valor: 0, categoria: "Cultural" },
      { nome: "MoMA", valor: 160, categoria: "Museu" },
      { nome: "Memorial 11 de Setembro", valor: 160, categoria: "Histórico" },
    ],
  },
  "Buenos Aires, Argentina": {
    pais: "Argentina", bandeira: "🇦🇷", moedaLocal: "ARS",
    coords: { lat: -34.6037, lng: -58.3816 },
    pontosTuristicos: [
      { nome: "Caminito (La Boca)", valor: 0, categoria: "Cultural" },
      { nome: "Casa Rosada (tour)", valor: 0, categoria: "Histórico" },
      { nome: "Cemitério da Recoleta", valor: 50, categoria: "Histórico" },
      { nome: "Show de Tango com Jantar", valor: 450, categoria: "Cultural" },
      { nome: "Estádio La Bombonera (tour)", valor: 180, categoria: "Esporte" },
      { nome: "Teatro Colón (visita)", valor: 90, categoria: "Cultural" },
    ],
  },
  "Berlim, Alemanha": {
    pais: "Alemanha", bandeira: "🇩🇪", moedaLocal: "EUR",
    coords: { lat: 52.52, lng: 13.405 },
    pontosTuristicos: [
      { nome: "Portão de Brandemburgo", valor: 0, categoria: "Histórico" },
      { nome: "Muro de Berlim (East Side Gallery)", valor: 0, categoria: "Histórico" },
      { nome: "Reichstag (cúpula)", valor: 0, categoria: "Histórico" },
      { nome: "Ilha dos Museus", valor: 130, categoria: "Museu" },
      { nome: "Checkpoint Charlie (museu)", valor: 100, categoria: "Histórico" },
    ],
  },
  "Amsterdã, Holanda": {
    pais: "Holanda", bandeira: "🇳🇱", moedaLocal: "EUR",
    coords: { lat: 52.3676, lng: 4.9041 },
    pontosTuristicos: [
      { nome: "Casa de Anne Frank", valor: 90, categoria: "Histórico" },
      { nome: "Museu Van Gogh", valor: 130, categoria: "Museu" },
      { nome: "Rijksmuseum", valor: 130, categoria: "Museu" },
      { nome: "Cruzeiro pelos canais", valor: 100, categoria: "Passeio" },
      { nome: "Vondelpark", valor: 0, categoria: "Natureza" },
    ],
  },
  "Cairo, Egito": {
    pais: "Egito", bandeira: "🇪🇬", moedaLocal: "USD",
    coords: { lat: 30.0444, lng: 31.2357 },
    pontosTuristicos: [
      { nome: "Pirâmides de Gizé", valor: 80, categoria: "Histórico" },
      { nome: "Esfinge", valor: 0, categoria: "Histórico" },
      { nome: "Museu Egípcio", valor: 100, categoria: "Museu" },
      { nome: "Passeio de camelo", valor: 70, categoria: "Passeio" },
      { nome: "Bazar Khan El-Khalili", valor: 0, categoria: "Cultural" },
    ],
  },
  "Sydney, Austrália": {
    pais: "Austrália", bandeira: "🇦🇺", moedaLocal: "AUD",
    coords: { lat: -33.8688, lng: 151.2093 },
    pontosTuristicos: [
      { nome: "Sydney Opera House (tour)", valor: 160, categoria: "Cultural" },
      { nome: "Sydney Harbour Bridge Climb", valor: 1100, categoria: "Aventura" },
      { nome: "Bondi Beach", valor: 0, categoria: "Praia" },
      { nome: "Taronga Zoo", valor: 230, categoria: "Natureza" },
      { nome: "Blue Mountains (passeio)", valor: 600, categoria: "Natureza" },
    ],
  },
  "Cidade do México, México": {
    pais: "México", bandeira: "🇲🇽", moedaLocal: "MXN",
    coords: { lat: 19.4326, lng: -99.1332 },
    pontosTuristicos: [
      { nome: "Teotihuacán (pirâmides)", valor: 50, categoria: "Histórico" },
      { nome: "Zócalo (centro histórico)", valor: 0, categoria: "Histórico" },
      { nome: "Museu Frida Kahlo", valor: 90, categoria: "Museu" },
      { nome: "Xochimilco (passeio de barco)", valor: 200, categoria: "Passeio" },
      { nome: "Castelo de Chapultepec", valor: 30, categoria: "Histórico" },
    ],
  },
  "Dubai, Emirados Árabes": {
    pais: "Emirados Árabes", bandeira: "🇦🇪", moedaLocal: "USD",
    coords: { lat: 25.2048, lng: 55.2708 },
    pontosTuristicos: [
      { nome: "Burj Khalifa (124º andar)", valor: 280, categoria: "Mirante" },
      { nome: "Safári no deserto", valor: 350, categoria: "Aventura" },
      { nome: "Dubai Mall + Aquário", valor: 250, categoria: "Diversão" },
      { nome: "Palm Jumeirah (monorail)", valor: 100, categoria: "Passeio" },
      { nome: "Mesquita Jumeirah (tour)", valor: 150, categoria: "Religioso" },
    ],
  },
  "Atenas, Grécia": {
    pais: "Grécia", bandeira: "🇬🇷", moedaLocal: "EUR",
    coords: { lat: 37.9838, lng: 23.7275 },
    pontosTuristicos: [
      { nome: "Acrópole + Parthenon", valor: 130, categoria: "Histórico" },
      { nome: "Museu da Acrópole", valor: 80, categoria: "Museu" },
      { nome: "Plaka (bairro antigo)", valor: 0, categoria: "Cultural" },
      { nome: "Templo de Zeus Olímpico", valor: 50, categoria: "Histórico" },
      { nome: "Bate-volta a Delfos", valor: 600, categoria: "Passeio" },
    ],
  },
  "Florianópolis, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -27.5954, lng: -48.5480 },
    pontosTuristicos: [
      { nome: "Praia de Jurerê", valor: 0, categoria: "Praia" },
      { nome: "Praia da Joaquina", valor: 0, categoria: "Praia" },
      { nome: "Lagoa da Conceição", valor: 0, categoria: "Natureza" },
      { nome: "Mercado Público", valor: 0, categoria: "Cultural" },
      { nome: "Ponte Hercílio Luz (mirante)", valor: 0, categoria: "Mirante" },
      { nome: "Ilha do Campeche (passeio)", valor: 180, categoria: "Passeio" },
    ],
  },
  "Foz do Iguaçu, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -25.5469, lng: -54.5882 },
    pontosTuristicos: [
      { nome: "Cataratas do Iguaçu (lado brasileiro)", valor: 110, categoria: "Natureza" },
      { nome: "Cataratas do Iguaçu (lado argentino)", valor: 250, categoria: "Natureza" },
      { nome: "Parque das Aves", valor: 90, categoria: "Natureza" },
      { nome: "Usina de Itaipu (tour panorâmico)", valor: 80, categoria: "Histórico" },
      { nome: "Marco das Três Fronteiras", valor: 95, categoria: "Mirante" },
      { nome: "Templo Budista", valor: 0, categoria: "Religioso" },
      { nome: "Macuco Safari (bote)", valor: 380, categoria: "Aventura" },
    ],
  },
  "Gramado, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -29.3788, lng: -50.8769 },
    pontosTuristicos: [
      { nome: "Mini Mundo", valor: 65, categoria: "Diversão" },
      { nome: "Snowland", valor: 250, categoria: "Diversão" },
      { nome: "Lago Negro", valor: 0, categoria: "Natureza" },
      { nome: "Rua Coberta", valor: 0, categoria: "Cultural" },
      { nome: "Catedral de Pedra", valor: 0, categoria: "Religioso" },
      { nome: "Mundo a Vapor", valor: 70, categoria: "Diversão" },
    ],
  },
  "Fernando de Noronha, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -3.8576, lng: -32.4297 },
    pontosTuristicos: [
      { nome: "Baía do Sancho", valor: 0, categoria: "Praia" },
      { nome: "Praia do Leão", valor: 0, categoria: "Praia" },
      { nome: "Praia da Atalaia (mergulho)", valor: 50, categoria: "Aventura" },
      { nome: "Mirante dos Golfinhos", valor: 0, categoria: "Mirante" },
      { nome: "Ilha Tour de barco", valor: 380, categoria: "Passeio" },
      { nome: "Taxa de preservação ambiental (TPA)", valor: 95, categoria: "Outro" },
    ],
  },
  "Belém, Brasil": {
    pais: "Brasil", bandeira: "🇧🇷", moedaLocal: "BRL",
    coords: { lat: -1.4554, lng: -48.4898 },
    pontosTuristicos: [
      { nome: "Ver-o-Peso (mercado)", valor: 0, categoria: "Cultural" },
      { nome: "Estação das Docas", valor: 0, categoria: "Cultural" },
      { nome: "Basílica de Nazaré", valor: 0, categoria: "Religioso" },
      { nome: "Mangal das Garças", valor: 12, categoria: "Natureza" },
      { nome: "Museu Paraense Emílio Goeldi", valor: 6, categoria: "Museu" },
      { nome: "Ilha do Combu (passeio)", valor: 250, categoria: "Passeio" },
    ],
  },
  "Cancún, México": {
    pais: "México", bandeira: "🇲🇽", moedaLocal: "MXN",
    coords: { lat: 21.1619, lng: -86.8515 },
    pontosTuristicos: [
      { nome: "Praia Delfines", valor: 0, categoria: "Praia" },
      { nome: "Chichén Itzá (bate-volta)", valor: 1800, categoria: "Histórico" },
      { nome: "Tulum (ruínas + praia)", valor: 600, categoria: "Histórico" },
      { nome: "Cenote Ik Kil", valor: 200, categoria: "Natureza" },
      { nome: "Isla Mujeres (catamarã)", valor: 1200, categoria: "Passeio" },
      { nome: "Xcaret Park", valor: 2200, categoria: "Diversão" },
    ],
  },
  "Lima, Peru": {
    pais: "Peru", bandeira: "🇵🇪", moedaLocal: "PEN",
    coords: { lat: -12.0464, lng: -77.0428 },
    pontosTuristicos: [
      { nome: "Miraflores e Larcomar", valor: 0, categoria: "Cultural" },
      { nome: "Plaza de Armas", valor: 0, categoria: "Histórico" },
      { nome: "Museu Larco", valor: 60, categoria: "Museu" },
      { nome: "Bairro de Barranco", valor: 0, categoria: "Cultural" },
      { nome: "Huaca Pucllana", valor: 25, categoria: "Histórico" },
      { nome: "Machu Picchu (bate-volta via Cusco)", valor: 800, categoria: "Histórico" },
    ],
  },
  "Santiago, Chile": {
    pais: "Chile", bandeira: "🇨🇱", moedaLocal: "CLP",
    coords: { lat: -33.4489, lng: -70.6693 },
    pontosTuristicos: [
      { nome: "Cerro San Cristóbal", valor: 4000, categoria: "Mirante" },
      { nome: "Sky Costanera (mirante)", valor: 12000, categoria: "Mirante" },
      { nome: "La Moneda", valor: 0, categoria: "Histórico" },
      { nome: "Mercado Central", valor: 0, categoria: "Gastronomia" },
      { nome: "Bairro Bellavista", valor: 0, categoria: "Cultural" },
      { nome: "Valparaíso (bate-volta)", valor: 30000, categoria: "Passeio" },
      { nome: "Vinícolas do Maipo", valor: 50000, categoria: "Gastronomia" },
    ],
  },
  "Havana, Cuba": {
    pais: "Cuba", bandeira: "🇨🇺", moedaLocal: "USD",
    coords: { lat: 23.1136, lng: -82.3666 },
    pontosTuristicos: [
      { nome: "Habana Vieja (centro histórico)", valor: 0, categoria: "Histórico" },
      { nome: "Plaza de la Catedral", valor: 0, categoria: "Religioso" },
      { nome: "Malecón", valor: 0, categoria: "Mirante" },
      { nome: "El Floridita (mojito do Hemingway)", valor: 30, categoria: "Gastronomia" },
      { nome: "Passeio de carro antigo", valor: 250, categoria: "Passeio" },
      { nome: "Castillo del Morro", valor: 30, categoria: "Histórico" },
    ],
  },
  "Miami, EUA": {
    pais: "Estados Unidos", bandeira: "🇺🇸", moedaLocal: "USD",
    coords: { lat: 25.7617, lng: -80.1918 },
    pontosTuristicos: [
      { nome: "South Beach", valor: 0, categoria: "Praia" },
      { nome: "Wynwood Walls", valor: 60, categoria: "Cultural" },
      { nome: "Little Havana", valor: 0, categoria: "Cultural" },
      { nome: "Everglades (passeio)", valor: 380, categoria: "Natureza" },
      { nome: "Bayside Marketplace", valor: 0, categoria: "Gastronomia" },
      { nome: "Outlets de Sawgrass", valor: 0, categoria: "Cultural" },
    ],
  },
  "Barcelona, Espanha": {
    pais: "Espanha", bandeira: "🇪🇸", moedaLocal: "EUR",
    coords: { lat: 41.3851, lng: 2.1734 },
    pontosTuristicos: [
      { nome: "Sagrada Família", valor: 220, categoria: "Religioso" },
      { nome: "Park Güell", valor: 100, categoria: "Cultural" },
      { nome: "La Rambla", valor: 0, categoria: "Cultural" },
      { nome: "Casa Batlló", valor: 250, categoria: "Histórico" },
      { nome: "Bairro Gótico", valor: 0, categoria: "Histórico" },
      { nome: "Praia da Barceloneta", valor: 0, categoria: "Praia" },
      { nome: "Camp Nou (tour)", valor: 200, categoria: "Esporte" },
    ],
  },
  "Praga, Tchéquia": {
    pais: "Tchéquia", bandeira: "🇨🇿", moedaLocal: "CZK",
    coords: { lat: 50.0755, lng: 14.4378 },
    pontosTuristicos: [
      { nome: "Ponte Carlos", valor: 0, categoria: "Histórico" },
      { nome: "Castelo de Praga", valor: 1100, categoria: "Histórico" },
      { nome: "Relógio Astronômico", valor: 0, categoria: "Histórico" },
      { nome: "Bairro Judeu", valor: 1500, categoria: "Histórico" },
      { nome: "Petřín (mirante)", valor: 320, categoria: "Mirante" },
      { nome: "Cruzeiro pelo Vltava", valor: 1200, categoria: "Passeio" },
    ],
  },
  "Viena, Áustria": {
    pais: "Áustria", bandeira: "🇦🇹", moedaLocal: "EUR",
    coords: { lat: 48.2082, lng: 16.3738 },
    pontosTuristicos: [
      { nome: "Palácio de Schönbrunn", valor: 140, categoria: "Histórico" },
      { nome: "Catedral de Santo Estêvão", valor: 0, categoria: "Religioso" },
      { nome: "Belvedere", valor: 130, categoria: "Museu" },
      { nome: "Ópera Estatal (tour)", valor: 85, categoria: "Cultural" },
      { nome: "Prater (roda gigante)", valor: 70, categoria: "Diversão" },
      { nome: "Naschmarkt", valor: 0, categoria: "Gastronomia" },
    ],
  },
  "Bangkok, Tailândia": {
    pais: "Tailândia", bandeira: "🇹🇭", moedaLocal: "THB",
    coords: { lat: 13.7563, lng: 100.5018 },
    pontosTuristicos: [
      { nome: "Grand Palace", valor: 500, categoria: "Histórico" },
      { nome: "Wat Pho (Buda Reclinado)", valor: 300, categoria: "Religioso" },
      { nome: "Wat Arun", valor: 200, categoria: "Religioso" },
      { nome: "Mercado Flutuante de Damnoen Saduak", valor: 1500, categoria: "Cultural" },
      { nome: "Khaosan Road", valor: 0, categoria: "Cultural" },
      { nome: "Chatuchak Weekend Market", valor: 0, categoria: "Gastronomia" },
      { nome: "Massagem tailandesa tradicional", valor: 400, categoria: "Outro" },
    ],
  },
  "Seul, Coreia do Sul": {
    pais: "Coreia do Sul", bandeira: "🇰🇷", moedaLocal: "KRW",
    coords: { lat: 37.5665, lng: 126.9780 },
    pontosTuristicos: [
      { nome: "Palácio Gyeongbokgung", valor: 3000, categoria: "Histórico" },
      { nome: "Vila Hanok de Bukchon", valor: 0, categoria: "Cultural" },
      { nome: "N Seoul Tower", valor: 16000, categoria: "Mirante" },
      { nome: "Mercado de Myeongdong", valor: 0, categoria: "Gastronomia" },
      { nome: "Bairro Gangnam", valor: 0, categoria: "Cultural" },
      { nome: "DMZ (zona desmilitarizada, bate-volta)", valor: 100000, categoria: "Histórico" },
    ],
  },
}

export const listaDestinos = Object.keys(destinos).sort()

export const categorias = [
  "Histórico", "Museu", "Religioso", "Mirante", "Natureza", "Praia",
  "Cultural", "Gastronomia", "Diversão", "Esporte", "Aventura", "Passeio", "Outro",
]

export function formatarBRL(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
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
      dataFormatada: atual.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      diaSemana: atual.toLocaleDateString("pt-BR", { weekday: "short" }),
    })
    atual.setDate(atual.getDate() + 1)
    numero++
  }
  return dias
}

// ============ MOEDAS ============

export const moedas = [
  { codigo: "BRL", simbolo: "R$",  nome: "Real" },
  { codigo: "USD", simbolo: "US$", nome: "Dólar Americano" },
  { codigo: "EUR", simbolo: "€",   nome: "Euro" },
  { codigo: "GBP", simbolo: "£",   nome: "Libra Esterlina" },
  { codigo: "JPY", simbolo: "¥",   nome: "Iene Japonês" },
  { codigo: "ARS", simbolo: "AR$", nome: "Peso Argentino" },
  { codigo: "CHF", simbolo: "CHF", nome: "Franco Suíço" },
  { codigo: "AUD", simbolo: "A$",  nome: "Dólar Australiano" },
  { codigo: "MXN", simbolo: "MX$", nome: "Peso Mexicano" },
  { codigo: "CZK", simbolo: "Kč",  nome: "Coroa Tcheca" },
  { codigo: "THB", simbolo: "฿",   nome: "Baht Tailandês" },
  { codigo: "KRW", simbolo: "₩",   nome: "Won Sul-Coreano" },
  { codigo: "PEN", simbolo: "S/",  nome: "Sol Peruano" },
  { codigo: "CLP", simbolo: "CL$", nome: "Peso Chileno" },
]

// cotacoes = { USD: 5.5, EUR: 6.0, ... } -> taxa em BRL por 1 unidade da moeda
export function converterParaBRL(valor, moeda, cotacoes) {
  const v = Number(valor) || 0
  if (!moeda || moeda === "BRL") return v
  const taxa = cotacoes?.[moeda]
  return v * (taxa || 1)
}

// Converte entre quaisquer duas moedas (passando por BRL como pivô)
export function converterEntreMoedas(valor, deMoeda, paraMoeda, cotacoes) {
  const v = Number(valor) || 0
  if (!v) return 0
  if (deMoeda === paraMoeda) return v
  // Primeiro pra BRL
  const valorEmBRL = deMoeda === "BRL" ? v : v * (cotacoes?.[deMoeda] || 1)
  // Depois pra moeda destino
  if (paraMoeda === "BRL") return valorEmBRL
  const taxaDestino = cotacoes?.[paraMoeda]
  if (!taxaDestino) return valorEmBRL // fallback: mantém em BRL
  return valorEmBRL / taxaDestino
}

export function formatarMoeda(valor, moeda = "BRL") {
  const v = Number(valor) || 0
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency", currency: moeda || "BRL",
    }).format(v)
  } catch {
    const m = moedas.find((mm) => mm.codigo === moeda)
    return `${m?.simbolo || moeda} ${v.toFixed(2)}`
  }
}

// ============ TEMPLATES DE CHECKLIST ============
export const templatesChecklist = {
  "Básico": [
    "Documento de identidade",
    "Cartão de crédito",
    "Dinheiro em espécie",
    "Carregador de celular",
    "Fones de ouvido",
    "Escova de dentes e pasta",
    "Remédios de uso contínuo",
    "Pijama",
    "Roupa íntima",
  ],
  "Praia": [
    "Protetor solar",
    "Óculos de sol",
    "Chinelo",
    "Biquíni / sunga",
    "Toalha de praia",
    "Boné ou chapéu",
    "Repelente",
    "Sandália para água",
  ],
  "Frio": [
    "Casaco pesado",
    "Luvas",
    "Gorro",
    "Cachecol",
    "Meias térmicas",
    "Botas impermeáveis",
    "Hidratante labial",
    "Hidratante para mãos",
  ],
  "Internacional": [
    "Passaporte (válido por 6+ meses)",
    "Visto (se necessário)",
    "Adaptador de tomada",
    "Dinheiro em moeda local",
    "Seguro viagem",
    "Cópia digital dos documentos",
    "Carteira de vacinação",
    "Chip internacional ou eSIM",
  ],
  "Trabalho": [
    "Notebook + carregador",
    "Mouse",
    "Crachá",
    "Roupa social",
    "Sapato social",
    "Bloco de anotações",
    "Caneta",
  ],
}
