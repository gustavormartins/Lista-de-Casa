import React, { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY_ITEMS = "casa_nova_bia_gustavo_items_v6";
const STORAGE_KEY_RAFFLE = "casa_nova_bia_gustavo_raffle_v2";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "3105";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const FALLBACK_IMG =
  "https://placehold.co/600x400/e2ddd9/4a5d23?text=Foto+do+Produto";

const itemSeeds = [
  { id: 1, category: "Limpeza", name: "Robô de Limpeza Mop Passa Pano Cleanel", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/4VYwLhY3ue", alternatives: ["Amazon: robô mop 40cm", "Mercado Livre: robô mop"], desc: "Robô mop para limpeza prática do piso sem esforço." },
  { id: 3, category: "Limpeza", name: "Aspirador Vertical WAP Silent Speed Max 3 em 1", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/Aspirador-de-P%C3%B3-Vertical-WAP-Silent-Speed-Max-3-em-1-1350W-Filtro-HEPA-Port%C3%A1til-220V-i.378521219.23898110103", alternatives: ["Amazon: aspirador WAP", "Magalu: aspirador vertical"], desc: "Aspirador vertical portátil 3 em 1 com filtro HEPA." },
  { id: 19, category: "Limpeza", name: "Balde Resistente com Alça 8,5L", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/balde-resistente-c-alca-85l-limpeza-lavanderia-flow-ou-cor-bege/p/MLB34384776", alternatives: ["Shopee: balde 10L", "Magalu: balde com bica"], desc: "Balde resistente para lavanderia e limpeza geral." },
  { id: 44, category: "Limpeza", name: "Kit de Limpeza — Rodo, Vassoura e Pá", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/325049083/21399299941", alternatives: ["Mercado Livre: kit limpeza", "Magalu: vassoura rodo"], desc: "Kit completo de limpeza com rodo, vassoura e pá do lixo." },
  { id: 45, category: "Limpeza", name: "Organizador de Produtos de Limpeza", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/333164875/19699297807", alternatives: ["Mercado Livre: organizador limpeza", "Magalu: suporte"], desc: "Suporte organizador para produtos e utensílios de limpeza." },
  { id: 52, category: "Limpeza", name: "Suporte de Parede para Vassouras e Rodos", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1108921353/22598647729", alternatives: ["Mercado Livre: suporte vassoura", "Magalu: rack limpeza"], desc: "Rack de parede para organizar vassouras e rodos sem ocupar espaço." },
  { id: 55, category: "Limpeza", name: "Organizador de Despensa — Caixas e Módulos", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/dp/B09963FWYX", alternatives: ["Shopee: caixa organizadora", "Mercado Livre: organizador"], desc: "Caixas organizadoras modulares para despensa e armários." },
  { id: 4, category: "Cozinha", name: "Jogo de Panelas Cerâmico Tuut Ecoglid 8 Peças Baunilha", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/jogo-de-panelas-cermico-triplo-induco-tuut-ecoglid-8-pecas-cor-baunilha/p/MLB58369191", alternatives: ["Amazon: kit panelas cerâmica", "Shopee: panelas baunilha"], desc: "Conjunto elegante de panelas cerâmicas triplo fundo cor baunilha." },
  { id: 6, category: "Cozinha", name: "Panela Elétrica de Arroz PE-43 127V", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/PANELA-EL%C2%90TRICA-ARROZ-PE-43-6X-127V/dp/B0BF5RSHHW", alternatives: ["Mondial: panela arroz", "Britânia: panela elétrica"], desc: "Panela elétrica de arroz prática com cuba antiaderente." },
  { id: 7, category: "Cozinha", name: "Panela Elétrica Redonda Mondial PE-28", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/El%C3%A9trica-Redonda-Mondial-PE-28-Vermelho/dp/B077T8KF3R", alternatives: ["Philco: panela elétrica", "Shopee: panela multiuso"], desc: "Panela elétrica redonda Mondial para receitas rápidas e práticas." },
  { id: 8, category: "Cozinha", name: "Panela de Pressão Digital Mondial Master", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Panela-Press%C3%A3o-Digital-Mondial-Master/dp/B07L8PWVW5", alternatives: ["Mercado Livre: pressão elétrica", "Magalu: panela pressão"], desc: "Panela de pressão digital Mondial para feijão e cozidos." },
  { id: 9, category: "Cozinha", name: "Espremedor Premium Mondial 127V Preto", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Espremedor-Premium-127V-Mondial-Preto/dp/B076FFGXKK", alternatives: ["Britânia: espremedor", "Philco: espremedor elétrico"], desc: "Espremedor elétrico Mondial para sucos frescos todo dia." },
  { id: 11, category: "Cozinha", name: "Liquidificador Philco / Britânia", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Liquidificador-Philco-BRITANIA-PORTATEIS-162465-8-1/dp/B076BL1265", alternatives: ["Arno: liquidificador", "Mondial: liquidificador"], desc: "Liquidificador potente para sucos, vitaminas e receitas." },
  { id: 12, category: "Cozinha", name: "Tostex de Ferro Fundido — Sanduicheira", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/tostex-ferro-fundido-sanduicheira-economiza-gas-ou-inducao/up/MLBU2512899366", alternatives: ["Shopee: tostex ferro", "Amazon: sanduicheira ferro"], desc: "Tostex de ferro fundido para fogão a gás ou indução." },
  { id: 13, category: "Cozinha", name: "Air Fryer Elgin Facilita Fry 3,5L Preta", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/fritadeira-air-fryer-elgin-facilita-fry-35-litros-potncia-1400w-cor-preta/p/MLB48958274", alternatives: ["Philips: air fryer 3L", "Mondial: air fryer 4L"], desc: "Fritadeira sem óleo Elgin 3,5L para refeições saudáveis." },
  { id: 14, category: "Cozinha", name: "Forno Elétrico Philco 65L Dupla Resistência PFE65", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/forno-eletrico-philco-65l-dupla-resistncia-pfe65/p/MLB47001375", alternatives: ["Britânia: forno elétrico", "Mondial: forno 60L"], desc: "Forno elétrico 65L Philco para assados e receitas no novo lar." },
  { id: 15, category: "Cozinha", name: "Cooktop por Indução 4 Bocas com Painel Tátil", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Cooktop-Indu%C3%A7%C3%A3o-Bocas-Painel-Eci04ep3/dp/B0FBPBS5L3", alternatives: ["Electrolux: cooktop indução", "Mercado Livre: cooktop 4 bocas"], desc: "Cooktop por indução 4 bocas moderno com painel tátil." },
  { id: 22, category: "Cozinha", name: "Depurador e Exaustor Suggar Slim 80cm Titanium", price: "A confirmar", store: "Magalu", link: "https://www.magazineluiza.com.br/depurador-e-exaustor-de-ar-suggar-slim-80cm-3-velocidades-titanium/divulgador/oferta/jdgb9ba9ff/ed/depu/", alternatives: ["Amazon: depurador Suggar", "Mercado Livre: exaustor 80cm"], desc: "Depurador Suggar Slim 80cm 3 velocidades estilo titanium." },
  { id: 25, category: "Cozinha", name: "Air Fryer Philips Walita Série 1000 6,2L com Timer", price: "A confirmar", store: "Magalu", link: "https://www.magazineluiza.com.br/air-fryer-philips-walita-serie-1000-na130-00-preta-com-timer-62l/divulgador/oferta/240412200/ep/efso/", alternatives: ["Elgin Facilita 3,5L", "Mondial 4L"], desc: "Air fryer grande Philips 6,2L com timer para família toda." },
  { id: 26, category: "Cozinha", name: "Churrasqueira Elétrica de Mesa Britânia BCQ10A 1500W", price: "A confirmar", store: "Magalu", link: "https://www.magazineluiza.com.br/churrasqueira-eletrica-de-mesa-britania-1500w-de-potencia-bcq10a/divulgador/oferta/240305900/fj/celt/", alternatives: ["Mondial: churrasqueira elétrica", "Shopee: grill elétrico"], desc: "Churrasqueira elétrica Britânia 1500W compacta para mesa." },
  { id: 28, category: "Cozinha", name: "Garrafa Térmica Jade Bege e Dourado Tuut Click 1L", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/Garrafa-T%C3%A9rmica-Jade-Bege-E-Dourado-Click-Tuut-1-Litro-Com-Design-Sofisticado-i.441825323.58207140649", alternatives: ["Mercado Livre: garrafa Tuut", "Amazon: garrafa 1L"], desc: "Garrafa térmica Tuut sofisticada para café e chá." },
  { id: 32, category: "Cozinha", name: "Lixeira para Cozinha com Pedal e Tampa", price: "A confirmar", store: "Mercado Livre", link: "https://meli.la/2KYuVHi", alternatives: ["Shopee: lixeira pedal inox", "Magalu: lixeira cozinha"], desc: "Lixeira prática com tampa e pedal para a cozinha." },
  { id: 34, category: "Cozinha", name: "Escorredor de Louça e Talheres", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/8pi6aVeLfj", alternatives: ["Amazon: escorredor inox", "Mercado Livre: secador louça"], desc: "Escorredor de louça com suporte para talheres e organização da pia." },
  { id: 35, category: "Cozinha", name: "Porta Condimentos e Temperos Giratório", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/4AwGr0wnux", alternatives: ["Amazon: porta temperos", "Mercado Livre: temperos lazy susan"], desc: "Organizador giratório para temperos e condimentos." },
  { id: 36, category: "Cozinha", name: "Cesta Fruteira e Organizador de Bancada", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/6fdbifpwg3", alternatives: ["Mercado Livre: fruteira aço", "Magalu: fruteira bancada"], desc: "Fruteira e organizador moderno para a bancada da cozinha." },
  { id: 47, category: "Cozinha", name: "Jogo de Facas e Utensílios de Cozinha", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1314243679/22798221710", alternatives: ["Tramontina: facas inox", "Mercado Livre: jogo facas"], desc: "Conjunto de facas e utensílios para a cozinha nova." },
  { id: 48, category: "Cozinha", name: "Tábua de Corte e Kit Utensílios", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1177903362/23194188550", alternatives: ["Shopee: tábua bambu", "Amazon: tábua vidro temperado"], desc: "Tábua de corte e utensílios essenciais para o dia a dia na cozinha." },
  { id: 62, category: "Cozinha", name: "Conjunto de Pegadores e Luvas de Forno Silicone", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1192714968/23693921882", alternatives: ["Amazon: luva silicone", "Mercado Livre: pegador forno"], desc: "Pegadores e luvas de silicone para proteger as mãos no fogão." },
  { id: 63, category: "Cozinha", name: "Organizador de Armário e Prateleira para Cozinha", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/364956871/40368614820", alternatives: ["Mercado Livre: prateleira aramado", "Amazon: organizador"], desc: "Organizador dobrável para armários e prateleiras da cozinha." },
  { id: 46, category: "Cozinha", name: "Pano de Prato e Toalhas de Cozinha", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/974102638/22398250062", alternatives: ["Amazon: pano prato", "Mercado Livre: toalha cozinha"], desc: "Panos de prato e toalhas absortivas para a cozinha." },
  { id: 2, category: "Sala", name: "Mesa de Centro Retangular com Pés Ripados", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/Mesa-de-Centro-Retangular-para-Sala-com-P%C3%A9s-Ripados-Apoio-Lateral-Decora%C3%A7%C3%A3o-Moderna-i.392704559.20799238664", alternatives: ["Magalu: mesa centro madeira", "Mercado Livre: mesa ripada"], desc: "Mesa de centro moderna com pés ripados — estilo e funcionalidade." },
  { id: 33, category: "Sala", name: "Tapete Decorativo para Sala", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/20rm9gVPfM", alternatives: ["Mercado Livre: tapete sala moderno", "Magalu: tapete 2x3"], desc: "Tapete decorativo para deixar a sala mais aconchegante." },
  { id: 43, category: "Sala", name: "Almofadas Decorativas e Capas para Sofá", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/468624794/23298930983", alternatives: ["Magalu: almofadas sofá", "Mercado Livre: capa almofada"], desc: "Almofadas e capas para decorar o sofá com estilo." },
  { id: 59, category: "Sala", name: "Relógio de Parede Decorativo", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/489936264/58203371889", alternatives: ["Mercado Livre: relógio parede", "Magalu: relógio moderno"], desc: "Relógio decorativo para compor a parede da sala." },
  { id: 60, category: "Sala", name: "Filtro de Linha / Régua de Tomadas Inteligente", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/dp/B0BSP1XKYL", alternatives: ["Shopee: filtro de linha", "Mercado Livre: régua tomada"], desc: "Filtro de linha com proteção contra surtos elétricos." },
  { id: 20, category: "Quarto", name: "Cobertor Queen Grosso Coberdrom — Dupla Face", price: "A confirmar", store: "Mercado Livre", link: "https://produto.mercadolivre.com.br/MLB-4040388707-cobertor-queen-grosso-coberdrom-l-carneiro-dupla-face-manta-_JM", alternatives: ["Shopee: cobertor queen", "Amazon: manta casal"], desc: "Cobertor queen grosso dupla face — quentinho e aconchegante." },
  { id: 21, category: "Quarto", name: "Capa de Colchão Queen em Malha Gel com Zíper", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/Capa-Para-Colch%C3%A3o-King-Size-Queen-Casal-Padr%C3%A3o-em-Malha-Gel-%28Helanca%29-com-Z%C3%ADper-F%C3%A1cil-i.483625888.23097996809", alternatives: ["Mercado Livre: capa colchão", "Amazon: protetor colchão"], desc: "Capa protetora em malha gel com zíper fácil para colchão queen." },
  { id: 29, category: "Quarto", name: "Mesa Dobrável para Notebook e Estudos", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/7ppWPSEaFn", alternatives: ["Amazon: mesa notebook cama", "Mercado Livre: suporte notebook"], desc: "Mesa portátil dobrável regulável para notebook no quarto." },
  { id: 42, category: "Quarto", name: "Jogo de Cama — Lençóis e Fronhas Queen", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/660421260/23198183795", alternatives: ["Mercado Livre: jogo cama queen", "Amazon: lençol 400 fios"], desc: "Jogo de cama completo com lençóis e fronhas queen." },
  { id: 56, category: "Quarto", name: "Edredom + Fronhas para Cama Queen", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1409119858/58258046501", alternatives: ["Shopee: edredom casal", "Mercado Livre: edredom queen"], desc: "Edredom macio e fronhas para o quarto do novo lar." },
  { id: 57, category: "Quarto", name: "Luminária LED de Cabeceira Articulável", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/872473112/19160766960", alternatives: ["Mercado Livre: luminária mesa", "Magalu: abajur LED"], desc: "Luminária de mesa articulável LED para leitura na cabeceira." },
  { id: 30, category: "Banheiro", name: "Jogo de Toalhas de Banho e Rosto", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/9AKwlrsxmq", alternatives: ["Amazon: jogo toalhas", "Mercado Livre: toalhas banho"], desc: "Kit de toalhas macias de banho e rosto para o banheiro." },
  { id: 31, category: "Banheiro", name: "Porta Shampoo e Sabonete — Organizador de Box", price: "A confirmar", store: "Shopee", link: "https://s.shopee.com.br/8V5FuroDHm", alternatives: ["Magalu: porta shampoo inox", "Mercado Livre: nicho box"], desc: "Organizador suspenso para produtos no box do banheiro." },
  { id: 41, category: "Banheiro", name: "Organizador de Banheiro Multi-Compartimentos", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/380209721/58255477848", alternatives: ["Mercado Livre: organizador banho", "Amazon: suporte"], desc: "Organizador prático para higiene e utensílios do banheiro." },
  { id: 51, category: "Banheiro", name: "Prateleira / Nicho para Banheiro", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1761287417/58259349905", alternatives: ["Shopee: nicho bambu", "Amazon: prateleira banheiro"], desc: "Prateleira ou nicho para organizar o banheiro com estilo." },
  { id: 61, category: "Banheiro", name: "Cortina de Box para Banheiro", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1138184210/18799095737", alternatives: ["Mercado Livre: cortina box PVC", "Amazon: cortina box"], desc: "Cortina de box com trilho e anéis para o banheiro." },
  { id: 5, category: "Eletros", name: "Ar-Condicionado Split Elgin Inverter R32", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/p/MLB38721383", alternatives: ["Amazon: split inverter", "Magalu: ar-condicionado Elgin"], desc: "Ar-condicionado inverter eficiente para o quarto do lar novo." },
  { id: 10, category: "Eletros", name: "Micro-ondas Philco PMO23EB 23L 110V", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/PHILCO-96051092-MICRO-ONDAS-PMO23EB-110v/dp/B08JD66K5C", alternatives: ["Consul: micro-ondas 25L", "Electrolux: micro-ondas"], desc: "Micro-ondas Philco 23L essencial para o dia a dia." },
  { id: 16, category: "Eletros", name: "Lavadora de Roupas Midea Agitador", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Lavadora-Roupas-Branca-Midea-Agitator/dp/B0D81JTSGX", alternatives: ["Mueller: lavadora", "Consul: lavadora"], desc: "Máquina de lavar roupa Midea com agitador central econômica." },
  { id: 17, category: "Eletros", name: "Lavadora Automática Mueller Energy Branca", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Lavadora-Autom%C3%A1tica-Energy-Branca-Mueller/dp/B0779KHS79", alternatives: ["Midea: lavadora 10kg", "Electrolux: lavadora"], desc: "Lavadora automática Mueller Energy — alternativa econômica." },
  { id: 18, category: "Eletros", name: "Geladeira Brastemp Frost Free 385L Duplex Inox", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/geladeira-brastemp-frost-free-385-litros-duplex-inox-brm46-inox/p/MLB64307757", alternatives: ["Consul: geladeira duplex", "Electrolux: 2 portas"], desc: "Geladeira Brastemp duplex frost free 385L em inox para o lar." },
  { id: 23, category: "Eletros", name: "Bebedouro Água Gelada Eletrônico Bivolt Britânia", price: "A confirmar", store: "Magalu", link: "https://www.magazineluiza.com.br/bebedouro-agua-gelada-eletronico-refrigerado-bivolt-bebedor-britania/divulgador/oferta/ec2je0cjk7/ep/bbms/", alternatives: ["Amazon: bebedouro gelágua", "Mercado Livre: bebedouro"], desc: "Bebedouro eletrônico refrigerado bivolt — água sempre gelada." },
  { id: 24, category: "Eletros", name: "Amazon Echo Dot 4ª Geração Alexa — Branco", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/Echo-Dot-4%C2%AA-gera%C3%A7%C3%A3o-Cor-Branca/dp/B09B8QFYZ2", alternatives: ["Echo Pop: mais barato", "Google Nest Mini"], desc: "Assistente virtual Alexa para automatizar a casa inteligente." },
  { id: 37, category: "Eletros", name: "Lâmpada Inteligente Smart Color 10W Elgin RGB WiFi", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/dp/B088C4QZV2", alternatives: ["Positivo: lâmpada smart", "Shopee: lâmpada RGB"], desc: "Lâmpada smart color RGB WiFi compatível com Alexa e Google Home." },
  { id: 38, category: "Eletros", name: "Tomada Inteligente Wi-Fi — Smart Plug", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/dp/B0D8V3QLDD", alternatives: ["Shopee: smart plug wifi", "Mercado Livre: tomada smart"], desc: "Smart plug: controle eletrodomésticos pelo app ou pela voz." },
  { id: 39, category: "Eletros", name: "Ventilador de Torre / Coluna para Ambiente", price: "A confirmar", store: "Amazon", link: "https://www.amazon.com.br/dp/B0DCKBMVH9", alternatives: ["Magalu: ventilador tower", "Mercado Livre: coluna"], desc: "Ventilador de torre silencioso para circulação de ar." },
  { id: 49, category: "Eletros", name: "Fone de Ouvido Bluetooth Sem Fio", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/1459156513/22698996476", alternatives: ["Amazon: fone JBL", "Mercado Livre: headset bluetooth"], desc: "Fone de ouvido bluetooth sem fio para música e chamadas." },
  { id: 58, category: "Eletros", name: "Caixinha de Som Bluetooth Portátil", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/961638733/19599212641", alternatives: ["Amazon: JBL Go 4", "Mercado Livre: caixa de som"], desc: "Caixa de som bluetooth portátil para o novo lar." },
  { id: 27, category: "Decoração", name: "Espelho Orgânico Retangular 53×110cm", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/Espelho-Org%C3%A2nico-Retangular-53x110cm-Grande-Moderno-Decorativo-Para-Parede-Sala-Quarto-Banheiro-i.408999524.23793680492", alternatives: ["Mercado Livre: espelho orgânico", "Magalu: espelho grande"], desc: "Espelho orgânico retangular 53×110cm — moderno e elegante." },
  { id: 40, category: "Decoração", name: "Quadro / Arte Decorativa para Parede", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/889347040/23798312046", alternatives: ["Mercado Livre: quadro decorativo", "Magalu: arte canvas"], desc: "Quadro decorativo para embelezar as paredes do novo lar." },
  { id: 50, category: "Decoração", name: "Nicho Decorativo de Parede", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/491125955/23098743173", alternatives: ["Mercado Livre: nicho madeira", "Magalu: prateleira"], desc: "Nicho decorativo para parede — funcional e estiloso." },
  { id: 53, category: "Decoração", name: "Papel de Parede Adesivo Decorativo", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/316048997/58200166797", alternatives: ["Mercado Livre: adesivo parede", "Amazon: papel adesivo"], desc: "Papel de parede adesivo para decorar o ambiente facilmente." },
  { id: 54, category: "Decoração", name: "Tapete de Entrada / Capacho Decorativo", price: "A confirmar", store: "Shopee", link: "https://shopee.com.br/product/967239602/22598967698", alternatives: ["Shopee: capacho antiderrapante", "Mercado Livre: tapete entrada"], desc: "Capacho ou tapete de entrada charmoso para a nova casa." },
  { id: 64, category: "Decoração", name: "Cabideiro / Porta-Casacos para Parede", price: "A confirmar", store: "Mercado Livre", link: "https://www.mercadolivre.com.br/p/MLB47601445", alternatives: ["Shopee: cabideiro madeira", "Amazon: porta casacos"], desc: "Cabideiro de parede para organizar casacos, bolsas e chaves." },
];

const categories = ["Todos", "Limpeza", "Cozinha", "Sala", "Quarto", "Banheiro", "Eletros", "Decoração"];
const statuses = ["Todos", "Disponível", "Reservado", "Presenteado"];
const statusMap = { available: "Disponível", reserved: "Reservado", gifted: "Presenteado" };

const initialItemList = itemSeeds.map((item) => ({
  ...item,
  img: FALLBACK_IMG,
  status: "available",
}));

function buildRaffleList() {
  return Array.from({ length: 1000 }, (_, i) => ({
    number: i + 1,
    status: "available",
    user: "",
    whatsapp: "",
    receiptLink: "",
  }));
}

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      return initialItemList;
    }

    const saved = JSON.parse(raw);
    const savedMap = {};
    saved.forEach((item) => {
      savedMap[item.id] = { status: item.status, img: item.img };
    });

    return initialItemList.map((item) => ({
      ...item,
      status: savedMap[item.id]?.status || "available",
      img: savedMap[item.id]?.img || item.img,
    }));
  } catch {
    return initialItemList;
  }
}

function loadRaffle() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RAFFLE);
    if (!raw) {
      return buildRaffleList();
    }

    return JSON.parse(raw);
  } catch {
    return buildRaffleList();
  }
}

function saveItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch {}
}

function saveRaffle(raffle) {
  try {
    localStorage.setItem(STORAGE_KEY_RAFFLE, JSON.stringify(raffle));
  } catch {}
}

async function copyText(value, successMessage) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    window.alert(successMessage);
  } catch {
    window.alert("Não foi possível copiar automaticamente.");
  }
}

async function fetchGeminiWithRetry(prompt, retries = 5) {
  if (!GEMINI_API_KEY) {
    return "A integração com IA não está configurada. Defina VITE_GEMINI_API_KEY no arquivo frontend/.env.";
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [
        {
          text: "Você é um assistente amigável para o Chá de Casa Nova de Bia e Gustavo. Seja conciso, afetuoso e use emojis. Responda em português.",
        },
      ],
    },
  };

  let delay = 1000;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a resposta.";
    } catch {
      if (attempt === retries - 1) {
        return "Erro ao conectar com a inteligência artificial. Tente novamente mais tarde.";
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  return "Não foi possível gerar a resposta.";
}

const AnimatedBackground = () => {
  const elements = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `-${Math.random() * 15}s`,
        scale: 0.4 + Math.random() * 0.6,
        rotate: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {elements.map((element) => (
        <div
          key={element.id}
          className="falling-leaf"
          style={{
            left: element.left,
            animationDuration: element.animationDuration,
            animationDelay: element.animationDelay,
            opacity: element.opacity,
            transform: `scale(${element.scale}) rotate(${element.rotate}deg)`,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 30 30">
            <path d="M15,0 C25,10 30,20 15,30 C0,20 5,10 15,0 Z" fill="#6d7a53" />
            <path d="M15,0 L15,30" stroke="#4a5d23" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>
      ))}
    </div>
  );
};

const TopDecor = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 350,
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: 1,
    }}
  >
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M-50,20 Q 150,80 350,20 T 750,20 T 1150,20 T 1550,20"
        fill="transparent"
        stroke="#3b2f2f"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {[20, 120, 220, 320, 420, 520, 620, 720, 820, 920, 1020, 1120, 1220].map((cx, index) => (
        <g
          key={cx}
          transform={`translate(${cx}, ${38 + (index % 2 === 0 ? 15 : -8)})`}
          className={index % 2 === 0 ? "bulb-glow-1" : "bulb-glow-2"}
        >
          <rect x="-3" y="-12" width="6" height="8" fill="#1a1a1a" rx="1" />
          <circle cx="0" cy="0" r="8" fill="#ffeba1" filter="url(#glow)" opacity="0.9" />
          <circle cx="0" cy="0" r="4" fill="#ffffff" />
        </g>
      ))}

      <g className="sway-branch-left" transform="translate(0, -10)">
        <path d="M0,0 Q50,80 40,220" fill="none" stroke="#4a5d23" strokeWidth="2.5" opacity="0.8" />
        <path d="M10,40 C30,30 40,40 20,60 C10,50 0,40 10,40 Z" fill="#6d7a53" />
        <path d="M25,70 C50,60 55,75 35,90 C20,80 15,70 25,70 Z" fill="#4a5d23" />
        <path d="M35,110 C60,100 65,115 40,130 C25,120 25,110 35,110 Z" fill="#6d7a53" />
        <path d="M40,150 C65,140 65,155 45,170 C30,160 30,150 40,150 Z" fill="#4a5d23" />
        <path d="M42,190 C65,180 65,195 47,210 C32,200 32,190 42,190 Z" fill="#8c9c6f" />
        <path d="M5,60 C-10,70 -15,55 5,45 C15,50 15,60 5,60 Z" fill="#8c9c6f" />
        <path d="M15,100 C-5,110 -5,90 15,80 C25,85 25,100 15,100 Z" fill="#8c9c6f" />
        <path d="M25,140 C5,150 5,130 25,120 C35,125 35,140 25,140 Z" fill="#6d7a53" />
      </g>

      <g className="sway-branch-right" transform="translate(100%, -10) scale(-1, 1)">
        <path d="M0,0 Q50,80 40,220" fill="none" stroke="#4a5d23" strokeWidth="2.5" opacity="0.8" />
        <path d="M10,40 C30,30 40,40 20,60 C10,50 0,40 10,40 Z" fill="#6d7a53" />
        <path d="M25,70 C50,60 55,75 35,90 C20,80 15,70 25,70 Z" fill="#4a5d23" />
        <path d="M35,110 C60,100 65,115 40,130 C25,120 25,110 35,110 Z" fill="#6d7a53" />
        <path d="M40,150 C65,140 65,155 45,170 C30,160 30,150 40,150 Z" fill="#4a5d23" />
        <path d="M42,190 C65,180 65,195 47,210 C32,200 32,190 42,190 Z" fill="#8c9c6f" />
        <path d="M5,60 C-10,70 -15,55 5,45 C15,50 15,60 5,60 Z" fill="#8c9c6f" />
        <path d="M15,100 C-5,110 -5,90 15,80 C25,85 25,100 15,100 Z" fill="#8c9c6f" />
        <path d="M25,140 C5,150 5,130 25,120 C35,125 35,140 25,140 Z" fill="#6d7a53" />
      </g>
    </svg>
  </div>
);

const FooterCats = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", marginTop: 40, opacity: 0.85 }}>
    <svg width="120" height="80" viewBox="0 0 100 80">
      <path d="M30,80 C30,50 10,40 20,20 L25,10 L35,15 C40,15 45,15 50,10 L55,20 C60,35 45,55 45,80 Z" fill="#2c2c2c" />
      <path d="M15,70 C5,70 0,60 5,50 C10,40 15,45 20,55" fill="transparent" stroke="#2c2c2c" strokeWidth="3" strokeLinecap="round" />
      <path d="M70,80 C70,50 90,40 80,20 L75,10 L65,15 C60,15 55,15 50,10 L45,20 C40,35 55,55 55,80 Z" fill="#fff" stroke="#c9bdae" strokeWidth="1" />
      <path d="M85,70 C95,70 100,60 95,50 C90,40 85,45 80,55" fill="transparent" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M50,45 C45,40 40,45 45,50 L50,55 L55,50 C60,45 55,40 50,45 Z" fill="#d9534f" />
    </svg>
  </div>
);

function ImageEditModal({ item, onClose, onSave }) {
  const [url, setUrl] = useState(item.img !== FALLBACK_IMG ? item.img : "");

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(event) => event.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h3 style={S.modalTitle}>📸 Trocar Imagem do Produto</h3>
        <p style={{ fontSize: 13, color: "#6b5b4a", marginBottom: 15 }}>
          Cole abaixo o link direto da imagem do produto, terminado em .jpg, .jpeg, .png ou .webp.
        </p>
        <input
          type="url"
          placeholder="https://exemplo.com/imagem.jpg"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          style={S.inputField}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onSave(item.id, url || FALLBACK_IMG)} style={S.btnPrimary}>
            Salvar
          </button>
          <button onClick={onClose} style={S.btnSecondary}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function GiftSuggesterModal({ items, onClose }) {
  const [budget, setBudget] = useState("");
  const [relationship, setRelationship] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuggest = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    const availableItems = items
      .filter((item) => item.status === "available")
      .slice(0, 15)
      .map((item) => item.name)
      .join(", ");
    const prompt = `Lista parcial: ${availableItems}. Convidado: ${relationship}. Orçamento: ${budget}. Sugira 1 ou 2 presentes e explique o porquê. Se orçamento for baixo, foque nas opções baratas.`;
    const response = await fetchGeminiWithRetry(prompt);
    setResult(response);
    setLoading(false);
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(event) => event.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h3 style={S.modalTitle}>✨ Sugestão Mágica</h3>
        <p style={{ color: "#6b5b4a", margin: "0 0 16px", fontSize: 14 }}>
          Deixe a Inteligência Artificial encontrar o presente perfeito para você dar aos noivos.
        </p>

        {!result && !loading && (
          <form onSubmit={handleSuggest}>
            <input
              type="text"
              placeholder="Qual o seu orçamento? Ex.: R$ 100"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              style={S.inputField}
              required
            />
            <input
              type="text"
              placeholder="Qual sua relação com os noivos? Ex.: Padrinho, tia"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              style={S.inputField}
              required
            />
            <button type="submit" style={S.btnPrimary}>
              ✨ Encontrar Presente
            </button>
          </form>
        )}

        {loading && (
          <p style={{ textAlign: "center", color: "#4a5d23", fontWeight: "bold" }}>
            ✨ Analisando a lista com IA...
          </p>
        )}

        {result && (
          <div>
            <div
              style={{
                background: "#f2ede4",
                padding: 15,
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.5,
                marginBottom: 15,
                whiteSpace: "pre-wrap",
              }}
            >
              {result}
            </div>
            <button
              onClick={() => {
                setResult("");
                setBudget("");
                setRelationship("");
              }}
              style={S.btnSecondary}
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ThankYouModal({ item, onClose }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      const prompt = `Gere uma mensagem curta e carinhosa de WhatsApp para um convidado, agradecendo enormemente por nos presentear com: "${item.name}". Assine como Bia e Gustavo.`;
      const response = await fetchGeminiWithRetry(prompt);
      setResult(response);
      setLoading(false);
    };

    generate();
  }, [item]);

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(event) => event.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h3 style={S.modalTitle}>✨ Gerar Agradecimento</h3>
        <p style={{ color: "#6b5b4a", margin: "0 0 16px", fontSize: 14 }}>
          Mensagem sugerida pela IA para enviar ao convidado que presenteou o <strong>{item.name}</strong>:
        </p>

        {loading ? (
          <p style={{ textAlign: "center", color: "#4a5d23", fontWeight: "bold" }}>
            ✨ Escrevendo mensagem...
          </p>
        ) : (
          <div>
            <textarea
              readOnly
              value={result}
              style={{ ...S.inputField, height: 160, resize: "none", backgroundColor: "#f9f9f9", fontSize: 14 }}
            />
            <button onClick={() => copyText(result, "Mensagem copiada para a área de transferência.")} style={S.btnPrimary}>
              📋 Copiar Mensagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PinModal({ onSuccess, onClose }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (pin === ADMIN_PIN) {
      onSuccess();
      return;
    }

    setError(true);
    setPin("");
    setTimeout(() => setError(false), 1200);
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(event) => event.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h3 style={S.modalTitle}>🔒 Acesso do Desenvolvedor</h3>
        <p style={{ color: "#6b5b4a", margin: "0 0 16px", fontSize: 14 }}>
          Digite o PIN para gerenciar os presentes e a rifa.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="password"
            maxLength={4}
            placeholder="PIN"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            style={{ ...S.pinInput, borderColor: error ? "#d9534f" : "#a1907f" }}
          />
          {error && <p style={{ color: "#d9534f", fontSize: 13, margin: "-6px 0 10px" }}>PIN incorreto.</p>}
          <button type="submit" style={S.btnPrimary}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function BuyRaffleModal({ number, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [fileName, setFileName] = useState("");
  const pixKey = "ddfbb61c-13a9-4d99-8391-0d58ba47d716";

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert("O arquivo excede o limite de 5 MB.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceipt(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modalRaffle} onClick={(event) => event.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h3 style={S.modalTitleRaffle}>
          Reservar número <span style={{ color: "#4a5d23", fontStyle: "italic" }}>{String(number).padStart(3, "0")}</span>
        </h3>
        <p style={{ color: "#6b5b4a", margin: "0 0 20px", fontSize: 14 }}>
          Preencha seus dados e envie o comprovante do PIX de R$ 15,00.
        </p>

        <div style={S.pixCopyBox}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#4a5d23" }}>Chave PIX:</p>
          <div style={S.pixKeyRow} onClick={() => copyText(pixKey, "Chave PIX copiada com sucesso.")}>
            <span style={{ fontFamily: "monospace", fontSize: 13 }}>{pixKey}</span>
            <span style={{ fontSize: 18 }} title="Copiar">
              📋
            </span>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim() && whatsapp.trim() && receipt) {
              onSubmit(number, name, whatsapp, receipt);
              return;
            }

            window.alert("Por favor, preencha todos os campos e anexe o comprovante.");
          }}
        >
          <div style={S.inputGroup}>
            <label style={S.label}>Seu nome</label>
            <input autoFocus type="text" value={name} onChange={(event) => setName(event.target.value)} style={S.inputFieldModal} required />
          </div>

          <div style={S.inputGroup}>
            <label style={S.label}>WhatsApp</label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              style={S.inputFieldModal}
              required
            />
          </div>

          <div style={S.inputGroup}>
            <label style={S.label}>Comprovante do PIX</label>
            <div style={S.fileInputContainer}>
              <label style={S.fileInputLabel}>
                <span style={S.fileInputButton}>Escolher ficheiro</span>
                <span style={S.fileInputText}>{fileName || "Nenhum ficheiro selecionado"}</span>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{ display: "none" }} required />
              </label>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#8c7c6c" }}>Imagem ou PDF, até 5 MB</p>
          </div>

          <button type="submit" style={S.btnConfirmRaffle}>
            Confirmar reserva
          </button>
        </form>
      </div>
    </div>
  );
}

function ItemCard({ item, isAdmin, onStatusChange, onGenerateThankYou, onEditImage }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "available":
        return { bg: "#f3eedd", color: "#4a5d23" };
      case "reserved":
        return { bg: "#f4e0c8", color: "#b36b00" };
      case "gifted":
        return { bg: "#e2ddd9", color: "#5c4033" };
      default:
        return { bg: "#fff", color: "#000" };
    }
  };

  const statusStyle = getStatusStyle(item.status);
  const googleShoppingLink = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.name)}`;

  return (
    <div style={S.card}>
      <div style={S.polaroidFrame}>
        <img
          src={item.img}
          alt={item.name}
          style={S.cardImg}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div style={{ ...S.statusBadge, background: statusStyle.bg, color: statusStyle.color }}>
          {statusMap[item.status]}
        </div>
      </div>
      <div style={S.cardBody}>
        <div style={S.categoryChip}>{item.category}</div>
        <h3 style={S.itemName}>{item.name}</h3>
        <p style={S.itemDesc}>{item.desc}</p>
        {item.price !== "A confirmar" && <div style={S.priceTag}>{item.price}</div>}

        {item.status !== "gifted" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={S.buyBtn}>
              Ver Referência na {item.store}
            </a>
            <a href={googleShoppingLink} target="_blank" rel="noopener noreferrer" style={S.searchCheaperBtn}>
              🏷️ Comparar Preços Online
            </a>
          </div>
        )}

        {isAdmin && (
          <div style={S.adminControls}>
            {item.status !== "gifted" ? (
              <>
                {item.status !== "available" && (
                  <button onClick={() => onStatusChange(item.id, "available")} style={S.adminBtn}>
                    Tornar Disponível
                  </button>
                )}
                {item.status !== "reserved" && (
                  <button onClick={() => onStatusChange(item.id, "reserved")} style={S.adminBtn}>
                    Marcar Reservado
                  </button>
                )}
                <button onClick={() => onStatusChange(item.id, "gifted")} style={{ ...S.adminBtn, background: "#4a5d23", color: "#fff" }}>
                  Marcar Presenteado
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onStatusChange(item.id, "available")} style={S.adminBtn}>
                  Desfazer (Tornar Disponível)
                </button>
                <button
                  onClick={() => onGenerateThankYou(item)}
                  style={{ ...S.adminBtn, background: "#8a6d3b", color: "#fff", marginTop: "4px" }}
                >
                  ✨ Gerar Agradecimento
                </button>
              </>
            )}
            <button
              onClick={() => onEditImage(item)}
              style={{ ...S.adminBtn, background: "#6c757d", color: "#fff", marginTop: "4px" }}
            >
              📸 Trocar Imagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(loadItems);
  const [raffle, setRaffle] = useState(loadRaffle);
  const [activeTab, setActiveTab] = useState("rifa");
  const [filterCat, setFilterCat] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [selectedRaffleNum, setSelectedRaffleNum] = useState(null);
  const [showSuggester, setShowSuggester] = useState(false);
  const [thankYouItem, setThankYouItem] = useState(null);
  const [imageEditItem, setImageEditItem] = useState(null);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  useEffect(() => {
    saveRaffle(raffle);
  }, [raffle]);

  const handleStatusChange = useCallback((id, newStatus) => {
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  }, []);

  const handleImageUpdate = (id, newUrl) => {
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, img: newUrl } : item)));
    setImageEditItem(null);
  };

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (filterCat !== "Todos" && item.category !== filterCat) {
          return false;
        }
        if (filterStatus !== "Todos" && statusMap[item.status] !== filterStatus) {
          return false;
        }
        if (
          search &&
          !item.name.toLowerCase().includes(search.toLowerCase()) &&
          !item.desc.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [filterCat, filterStatus, items, search]
  );

  const handleRaffleClick = (number) => {
    const item = raffle.find((entry) => entry.number === number);
    if (!item || isAdmin) {
      return;
    }

    if (item.status === "available") {
      setSelectedRaffleNum(number);
      return;
    }

    window.alert(`O número ${number} já está ${item.status === "pending" ? "em análise" : "reservado"}.`);
  };

  const submitRaffleReservation = (number, name, whatsapp, receipt) => {
    setRaffle((previous) =>
      previous.map((item) =>
        item.number === number
          ? { ...item, status: "pending", user: name, whatsapp, receiptLink: receipt }
          : item
      )
    );
    setSelectedRaffleNum(null);
  };

  const adminApproveRaffle = (number) => {
    setRaffle((previous) =>
      previous.map((item) => (item.number === number ? { ...item, status: "confirmed" } : item))
    );
  };

  const adminRejectRaffle = (number) => {
    setRaffle((previous) =>
      previous.map((item) =>
        item.number === number
          ? { ...item, status: "available", user: "", whatsapp: "", receiptLink: "" }
          : item
      )
    );
  };

  const financeRaffle = useMemo(() => {
    const confirmedCount = raffle.filter((item) => item.status === "confirmed").length;
    const pendingCount = raffle.filter((item) => item.status === "pending").length;
    const pricePerNum = 15;
    return {
      confirmedNumbers: confirmedCount,
      pendingNumbers: pendingCount,
      totalMoneyConfirmed: confirmedCount * pricePerNum,
      potentialMoney: (confirmedCount + pendingCount) * pricePerNum,
    };
  }, [raffle]);

  return (
    <div style={S.root}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;600;700&display=swap");
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          background-color: #f2ede4;
          background-image: url("https://www.transparenttextures.com/patterns/cream-paper.png");
        }
        .raffle-number:hover { transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fallDown {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .falling-leaf {
          position: absolute;
          top: -50px;
          animation: fallDown linear infinite;
          pointer-events: none;
        }
        @keyframes swayLeft {
          0%, 100% { transform: translate(0, -10px) rotate(0deg); }
          50% { transform: translate(0, -10px) rotate(3deg); }
        }
        @keyframes swayRight {
          0%, 100% { transform: translate(100%, -10px) scale(-1, 1) rotate(0deg); }
          50% { transform: translate(100%, -10px) scale(-1, 1) rotate(-3deg); }
        }
        .sway-branch-left {
          transform-origin: top left;
          animation: swayLeft 8s ease-in-out infinite;
        }
        .sway-branch-right {
          transform-origin: top right;
          animation: swayRight 9s ease-in-out infinite;
        }
        @keyframes bulbGlow1 {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.2); }
        }
        @keyframes bulbGlow2 {
          0%, 100% { opacity: 1; filter: brightness(1.2); }
          50% { opacity: 0.6; filter: brightness(1); }
        }
        .bulb-glow-1 { animation: bulbGlow1 4s ease-in-out infinite; }
        .bulb-glow-2 { animation: bulbGlow2 5s ease-in-out infinite; }
        @media (max-width: 720px) {
          .raffle-number:hover { transform: none; box-shadow: none; }
        }
      `}</style>

      <AnimatedBackground />
      <TopDecor />

      <header style={S.header}>
        <p style={S.preTitle}>CHÁ DE</p>
        <h1 style={S.mainTitle}>Casa Nova</h1>

        <img
          src="https://media.tenor.com/YRQgk2toLv4AAAAi/huggy-cute.gif"
          alt="Gatinhos se abraçando"
          style={{ width: 150, height: "auto", margin: "-10px auto -20px", display: "block", position: "relative", zIndex: 2 }}
          onError={(event) => {
            event.currentTarget.src = "https://media.tenor.com/f0u9v2K4O64AAAAi/peach-cat-hug.gif";
          }}
        />

        <h2 style={S.subTitle}>Bia & Gustavo</h2>
        <div style={S.greenRibbon}>NOSSO SONHO, NOSSO LAR, NOSSA NOVA HISTÓRIA!</div>
        <p style={S.headerDesc}>
          Estamos construindo nosso novo lar com muito amor
          <br />
          e contamos <b>com você</b> para fazer parte desse sonho.
        </p>
        <div style={S.tabContainer}>
          <button onClick={() => setActiveTab("rifa")} style={activeTab === "rifa" ? S.tabActive : S.tab}>
            🎟️ Rifa do PIX
          </button>
          <button onClick={() => setActiveTab("lista")} style={activeTab === "lista" ? S.tabActive : S.tab}>
            🎁 Lista de Presentes
          </button>
        </div>
        <button onClick={() => (isAdmin ? setIsAdmin(false) : setShowPin(true))} style={S.adminToggle}>
          {isAdmin ? "🔓 Sair do Painel Admin" : "🔒 Acesso DEV"}
        </button>
      </header>

      <main style={S.main}>
        {activeTab === "rifa" && (
          <div style={S.section}>
            <div style={S.raffleBanner}>
              <h3 style={S.raffleBannerTitle}>CONCORRA A UM PIX DE</h3>
              <div style={S.raffleBannerAmount}>R$ 250,00</div>
            </div>

            <div style={S.raffleInstructions}>
              <strong>ESCOLHA SEU NÚMERO DA SORTE! 🤍</strong>
              <br />
              Cada número custa R$ 15,00. Sorteio dia 31/05.
            </div>

            {isAdmin && (
              <div style={S.adminDashboard}>
                <h4 style={{ margin: "0 0 10px", color: "#4a5d23" }}>📊 Dashboard Financeiro & Monitoramento</h4>
                <p style={{ margin: "0 0 5px", fontSize: "14px" }}>
                  Números Confirmados: <strong>{financeRaffle.confirmedNumbers}</strong> (R$ {financeRaffle.totalMoneyConfirmed.toFixed(2)})
                </p>
                <p style={{ margin: "0 0 5px", fontSize: "14px" }}>
                  Números Pendentes: <strong>{financeRaffle.pendingNumbers}</strong>
                </p>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  Arrecadação Potencial: <strong>R$ {financeRaffle.potentialMoney.toFixed(2)}</strong>
                </p>
              </div>
            )}

            <div style={S.raffleLegend}>
              <span style={{ ...S.legendDot, background: "#fff", border: "1px solid #bbaea0" }}></span> Disponível
              <span style={{ ...S.legendDot, background: "#f4c773" }}></span> Em Análise
              <span style={{ ...S.legendDot, background: "#4a5d23" }}></span> Comprado
            </div>

            <div style={S.raffleGrid}>
              {raffle.map((item) => {
                let bgColor = "#fff";
                let color = "#5c4033";
                if (item.status === "pending") {
                  bgColor = "#f4c773";
                  color = "#fff";
                }
                if (item.status === "confirmed") {
                  bgColor = "#4a5d23";
                  color = "#fff";
                }

                return (
                  <div
                    key={item.number}
                    className="raffle-number"
                    style={{
                      ...S.raffleNumberBox,
                      background: bgColor,
                      color,
                      cursor: isAdmin || item.status === "available" ? "pointer" : "not-allowed",
                    }}
                    onClick={() => handleRaffleClick(item.number)}
                  >
                    {String(item.number).padStart(3, "0")}
                  </div>
                );
              })}
            </div>

            {isAdmin && (
              <div style={S.adminPendingRaffle}>
                <h3 style={{ fontFamily: "Montserrat", color: "#5c4033", margin: "0 0 15px" }}>Aprovações Pendentes (Admin)</h3>
                {raffle.filter((item) => item.status === "pending").length === 0 ? (
                  <p style={{ fontSize: 14, color: "#8c7c6c" }}>Nenhum número aguardando aprovação.</p>
                ) : (
                  <ul style={S.pendingList}>
                    {raffle
                      .filter((item) => item.status === "pending")
                      .map((item) => (
                        <li key={item.number} style={S.pendingItem}>
                          <div>
                            <span>
                              Nº <strong>{item.number}</strong> - <strong>{item.user}</strong>
                            </span>
                            {item.whatsapp && (
                              <div style={{ fontSize: 12, color: "#6b5b4a", marginTop: 2 }}>📞 {item.whatsapp}</div>
                            )}
                            {item.receiptLink && (
                              <div style={{ marginTop: 5, fontSize: 12 }}>
                                <a href={item.receiptLink} target="_blank" rel="noopener noreferrer" style={{ color: "#2a75d3" }}>
                                  🧾 Ver Comprovante
                                </a>
                              </div>
                            )}
                          </div>
                          <div>
                            <button onClick={() => adminApproveRaffle(item.number)} style={{ ...S.btnAdminAction, background: "#4a5d23" }}>
                              ✔ Aprovar
                            </button>
                            <button onClick={() => adminRejectRaffle(item.number)} style={{ ...S.btnAdminAction, background: "#d9534f" }}>
                              ✖ Rejeitar
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            <div style={S.pixInfoContainer}>
              <div style={S.pixBox}>
                <div style={{ fontSize: 24 }}>🤍</div>
                <div style={{ fontWeight: "bold" }}>CADA NÚMERO</div>
                <div style={{ fontSize: 18 }}>R$ 15,00</div>
              </div>
              <div style={S.pixBox}>
                <div style={{ fontSize: 24 }}>🗓️</div>
                <div style={{ fontWeight: "bold" }}>SORTEIO</div>
                <div style={{ fontSize: 18 }}>31/05</div>
              </div>
              <div style={S.pixBox}>
                <div style={{ fontSize: 24 }}>🎁</div>
                <div style={{ fontWeight: "bold" }}>CHAVE PIX</div>
                <div style={{ fontSize: 12, wordBreak: "break-all", marginTop: 5 }}>
                  ddfbb61c-13a9-4d99-8391-0d58ba47d716
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lista" && (
          <div style={S.section}>
            <div style={S.controls}>
              <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                <input
                  type="search"
                  placeholder="🔍 Buscar presente..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={{ ...S.searchInput, marginBottom: 0 }}
                />
                <button onClick={() => setShowSuggester(true)} style={S.btnMagic} title="Pedir Sugestão à IA">
                  ✨ IA
                </button>
              </div>

              <div style={S.filterGroup}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCat(category)}
                    style={{ ...S.filterBtn, ...(filterCat === category ? S.filterBtnActive : {}) }}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div style={S.filterGroup}>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    style={{ ...S.filterBtn, ...(filterStatus === status ? S.filterBtnActive : {}) }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#8c7c6c" }}>Nenhum item encontrado.</div>
            ) : (
              <div style={S.itemsGrid}>
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isAdmin={isAdmin}
                    onStatusChange={handleStatusChange}
                    onGenerateThankYou={setThankYouItem}
                    onEditImage={setImageEditItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={S.footer}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, margin: "0 0 10px", color: "#5c4033" }}>Obrigada!</p>
        <p style={{ fontSize: 12, letterSpacing: 2, margin: 0 }}>DE CORAÇÃO POR FAZER PARTE DISSO</p>
        <FooterCats />
      </footer>

      {showPin && <PinModal onSuccess={() => { setIsAdmin(true); setShowPin(false); }} onClose={() => setShowPin(false)} />}
      {selectedRaffleNum && (
        <BuyRaffleModal number={selectedRaffleNum} onClose={() => setSelectedRaffleNum(null)} onSubmit={submitRaffleReservation} />
      )}
      {showSuggester && <GiftSuggesterModal items={items} onClose={() => setShowSuggester(false)} />}
      {thankYouItem && <ThankYouModal item={thankYouItem} onClose={() => setThankYouItem(null)} />}
      {imageEditItem && (
        <ImageEditModal item={imageEditItem} onSave={handleImageUpdate} onClose={() => setImageEditItem(null)} />
      )}
    </div>
  );
}

const S = {
  root: { minHeight: "100vh", fontFamily: "'Montserrat', sans-serif", color: "#5c4033", position: "relative" },
  header: { textAlign: "center", padding: "80px 20px 40px", background: "transparent", zIndex: 1, position: "relative" },
  preTitle: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: 4, fontSize: 14, margin: "0 0 -10px", color: "#4a5d23" },
  mainTitle: { fontFamily: "'Great Vibes', cursive", fontSize: "clamp(60px, 12vw, 90px)", margin: 0, color: "#3b4a1c", fontWeight: 400, textShadow: "1px 1px 2px rgba(0,0,0,0.1)" },
  subTitle: { fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 8vw, 60px)", margin: "0 0 20px", color: "#5c4033", fontWeight: 400, position: "relative", zIndex: 3 },
  greenRibbon: { background: "#4a5d23", color: "#fff", display: "inline-block", padding: "8px 24px", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "clamp(12px, 3vw, 16px)", letterSpacing: 1, borderRadius: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.2)", marginBottom: 20 },
  headerDesc: { fontFamily: "'Lora', serif", fontSize: 16, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 30px", color: "#5c4033" },
  tabContainer: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  tab: { padding: "12px 24px", background: "#e8e1d5", border: "1px solid #c9bdae", borderRadius: 30, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: "#6b5b4a", cursor: "pointer", transition: "0.2s" },
  tabActive: { padding: "12px 24px", background: "#5c4033", border: "1px solid #5c4033", borderRadius: 30, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: "#fff", cursor: "pointer", transition: "0.2s" },
  adminToggle: { display: "block", margin: "15px auto 0", background: "none", border: "none", textDecoration: "underline", fontSize: 12, color: "#8c7c6c", cursor: "pointer" },
  main: { maxWidth: 1200, margin: "0 auto", padding: "0 16px 60px", zIndex: 1, position: "relative" },
  section: { animation: "fadeIn 0.5s" },
  raffleBanner: { textAlign: "center", marginBottom: 20 },
  raffleBannerTitle: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22, color: "#5c4033", margin: "0 0 10px" },
  raffleBannerAmount: { display: "inline-block", background: "url('https://www.transparenttextures.com/patterns/wood-pattern.png'), #6b4c3a", color: "#fff", fontSize: "clamp(40px, 8vw, 64px)", fontFamily: "'Lora', serif", fontWeight: 700, padding: "10px 40px", borderRadius: 4, border: "2px solid #4a3628", boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.2)" },
  raffleInstructions: { background: "#4a5d23", color: "#fff", textAlign: "center", padding: 12, borderRadius: 4, margin: "0 auto 20px", maxWidth: 600, fontFamily: "'Montserrat', sans-serif", fontSize: 14 },
  raffleLegend: { display: "flex", justifyContent: "center", gap: 20, marginBottom: 15, fontSize: 13, fontFamily: "'Montserrat', sans-serif", flexWrap: "wrap" },
  legendDot: { display: "inline-block", width: 12, height: 12, borderRadius: "50%", marginRight: 5 },
  raffleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))", gap: 4, background: "rgba(255,255,255,0.4)", padding: 15, borderRadius: 8, border: "1px solid #c9bdae", maxHeight: 600, overflowY: "auto" },
  raffleNumberBox: { display: "flex", alignItems: "center", justifyContent: "center", height: 30, fontSize: 12, border: "1px solid #bbaea0", borderRadius: 3, transition: "all 0.1s ease", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
  pixInfoContainer: { display: "flex", justifyContent: "center", gap: 20, marginTop: 30, flexWrap: "wrap" },
  pixBox: { background: "#e8e1d5", padding: 20, borderRadius: 8, border: "1px dashed #bbaea0", textAlign: "center", width: 200, color: "#5c4033", fontFamily: "'Lora', serif" },
  adminDashboard: { background: "#eef2ea", border: "1px solid #cce0b8", padding: 15, borderRadius: 8, maxWidth: 600, margin: "0 auto 20px" },
  adminPendingRaffle: { marginTop: 30, background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #ddd", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  pendingList: { listStyle: "none", padding: 0, margin: 0 },
  pendingItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottom: "1px solid #eee", flexWrap: "wrap", gap: 10 },
  btnAdminAction: { border: "none", padding: "6px 12px", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: "bold", marginLeft: 5 },
  controls: { marginBottom: 30 },
  searchInput: { width: "100%", padding: 14, borderRadius: 8, border: "1px solid #c9bdae", background: "#fff", color: "#5c4033", fontSize: 16, outline: "none", marginBottom: 15, fontFamily: "'Montserrat', sans-serif" },
  filterGroup: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  filterBtn: { padding: "8px 16px", borderRadius: 20, border: "1px solid #c9bdae", background: "transparent", color: "#6b5b4a", fontSize: 13, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
  filterBtnActive: { background: "#5c4033", color: "#fff", borderColor: "#5c4033" },
  itemsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 },
  card: { background: "#fff", padding: 15, borderRadius: 4, boxShadow: "0 4px 10px rgba(0,0,0,0.08)", position: "relative" },
  polaroidFrame: { background: "#fff", padding: "10px 10px 20px", border: "1px solid #eee", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: "relative", marginBottom: 15 },
  cardImg: { width: "100%", height: 200, objectFit: "cover", backgroundColor: "#f4f4f4" },
  statusBadge: { position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "1px solid #ddd", textTransform: "uppercase", letterSpacing: 1 },
  cardBody: { display: "flex", flexDirection: "column", gap: 8 },
  categoryChip: { fontSize: 10, color: "#8c7c6c", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 },
  itemName: { margin: 0, fontSize: 16, fontWeight: 700, color: "#5c4033", fontFamily: "'Lora', serif" },
  itemDesc: { margin: 0, fontSize: 13, color: "#6b5b4a", lineHeight: 1.5, flex: 1 },
  priceTag: { fontSize: 18, fontWeight: 700, color: "#4a5d23", fontFamily: "'Montserrat', sans-serif" },
  buyBtn: { display: "block", textAlign: "center", padding: 10, border: "2px solid #4a5d23", background: "transparent", color: "#4a5d23", fontWeight: 700, fontSize: 12, textDecoration: "none", borderRadius: 4, transition: "0.2s", textTransform: "uppercase", letterSpacing: 1 },
  searchCheaperBtn: { display: "block", textAlign: "center", padding: 10, border: "none", background: "#f4c773", color: "#5c4033", fontWeight: 700, fontSize: 12, textDecoration: "none", borderRadius: 4, transition: "0.2s", textTransform: "uppercase", letterSpacing: 1 },
  adminControls: { display: "flex", flexDirection: "column", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px dashed #eee" },
  adminBtn: { padding: 8, background: "#f0f0f0", border: "none", borderRadius: 4, fontSize: 12, fontWeight: "bold", color: "#333", cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(60, 45, 35, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fdfbf7", borderRadius: 8, padding: 30, width: "100%", maxWidth: 400, position: "relative", border: "1px solid #c9bdae", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  modalTitle: { margin: "0 0 10px", color: "#5c4033", fontFamily: "'Lora', serif", fontSize: 22 },
  closeBtn: { position: "absolute", top: 15, right: 15, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8c7c6c" },
  pinInput: { width: "100%", padding: 14, borderRadius: 6, border: "1px solid #c9bdae", fontSize: 24, textAlign: "center", letterSpacing: 10, marginBottom: 15, outline: "none", background: "#fff" },
  inputField: { width: "100%", padding: 12, borderRadius: 4, border: "1px solid #c9bdae", fontSize: 16, marginBottom: 15, outline: "none", fontFamily: "'Montserrat', sans-serif" },
  btnPrimary: { flex: 1, padding: 14, borderRadius: 4, background: "#5c4033", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 },
  btnSecondary: { flex: 1, padding: 14, borderRadius: 4, background: "transparent", color: "#5c4033", border: "2px solid #5c4033", fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 },
  btnMagic: { padding: "0 20px", borderRadius: 8, background: "linear-gradient(45deg, #d4af37, #f3e5ab)", color: "#5c4033", border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", whiteSpace: "nowrap" },
  footer: { textAlign: "center", padding: "40px 20px", borderTop: "1px solid #d9cdbd", color: "#8c7c6c" },
  modalRaffle: { background: "#fdfbf7", borderRadius: 12, padding: "30px 25px", width: "100%", maxWidth: 400, position: "relative", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", border: "1px solid #e8e1d5" },
  modalTitleRaffle: { margin: "0 0 10px", color: "#3b4a1c", fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 600 },
  pixCopyBox: { background: "#eef2ea", padding: 15, borderRadius: 8, marginBottom: 20, border: "1px solid #dce5d2" },
  pixKeyRow: { background: "#fff", padding: "8px 12px", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #dce5d2", cursor: "pointer", marginTop: 5 },
  inputGroup: { marginBottom: 15, textAlign: "left" },
  label: { display: "block", fontSize: 14, fontWeight: 600, color: "#5c4033", marginBottom: 6 },
  inputFieldModal: { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d9cdbd", fontSize: 15, outline: "none", fontFamily: "'Montserrat', sans-serif", background: "#fdfbf7", boxSizing: "border-box" },
  fileInputContainer: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d9cdbd", background: "#fdfbf7", display: "flex", alignItems: "center", boxSizing: "border-box" },
  fileInputLabel: { display: "flex", alignItems: "center", width: "100%", cursor: "pointer" },
  fileInputButton: { background: "#eef2ea", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 600, color: "#5c4033", border: "1px solid #dce5d2", marginRight: 10 },
  fileInputText: { fontSize: 13, color: "#6b5b4a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 },
  btnConfirmRaffle: { width: "100%", padding: 14, borderRadius: 8, background: "#4a5d23", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 10 },
};
