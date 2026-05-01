from __future__ import annotations

from urllib.parse import quote_plus

IMAGE_LIMIT = 20
STORE_ORDER = ["Shopee", "Amazon", "Mercado Livre", "Magalu", "Casas Bahia"]
STORE_SEARCH_URLS = {
    "Shopee": "https://shopee.com.br/search?keyword={query}",
    "Amazon": "https://www.amazon.com.br/s?k={query}",
    "Mercado Livre": "https://lista.mercadolivre.com.br/{slug}",
    "Magalu": "https://www.magazineluiza.com.br/busca/{slug}/",
    "Casas Bahia": "https://www.casasbahia.com.br/busca/{slug}/",
}


def slugify(text: str) -> str:
    return quote_plus(text).replace("+", "-")


def build_store_url(store: str, name: str) -> str:
    query = quote_plus(name)
    slug = slugify(name)
    return STORE_SEARCH_URLS[store].format(query=query, slug=slug)


def build_alternatives(store: str, name: str, price_cents: int) -> list[dict[str, object]]:
    primary_index = STORE_ORDER.index(store)
    alternative_stores = [
        STORE_ORDER[(primary_index + 1) % len(STORE_ORDER)],
        STORE_ORDER[(primary_index + 2) % len(STORE_ORDER)],
    ]
    prices = [max(price_cents - 2500, 2990), max(price_cents - 4900, 2490)]

    return [
        {
            "store": alternative_store,
            "price_cents": alternative_price,
            "url": build_store_url(alternative_store, name),
        }
        for alternative_store, alternative_price in zip(alternative_stores, prices, strict=True)
    ]


def build_seed_items() -> list[dict[str, object]]:
    specs = [
        {
            "name": "Robo aspirador",
            "category": "Limpeza",
            "store": "Shopee",
            "price_cents": 69990,
            "image_query": "robot vacuum cleaner",
            "description": "Ajuda a manter os pisos limpos com menos esforco no dia a dia.",
        },
        {
            "name": "Mop spray",
            "category": "Limpeza",
            "store": "Amazon",
            "price_cents": 12990,
            "image_query": "spray mop",
            "description": "Pratico para a rotina de limpeza rapida da casa nova.",
        },
        {
            "name": "Aspirador de po",
            "category": "Limpeza",
            "store": "Mercado Livre",
            "price_cents": 28990,
            "image_query": "vacuum cleaner",
            "description": "Essencial para faxinas completas em todos os ambientes.",
        },
        {
            "name": "Balde retratil",
            "category": "Limpeza",
            "store": "Magalu",
            "price_cents": 6990,
            "image_query": "collapsible bucket",
            "description": "Ocupa pouco espaco e resolve bem as tarefas de limpeza.",
        },
        {
            "name": "Kit panos de microfibra",
            "category": "Limpeza",
            "store": "Casas Bahia",
            "price_cents": 3990,
            "image_query": "microfiber cloth",
            "description": "Ideal para vidros, moveis e acabamentos delicados.",
        },
        {
            "name": "Cesto de roupa dupla divisao",
            "category": "Limpeza",
            "store": "Shopee",
            "price_cents": 14990,
            "image_query": "laundry basket",
            "description": "Ajuda a separar roupas claras e escuras com organizacao.",
        },
        {
            "name": "Lixeira inox 12L",
            "category": "Limpeza",
            "store": "Amazon",
            "price_cents": 11990,
            "image_query": "stainless trash can",
            "description": "Combina com cozinha, lavanderia e banheiro com visual elegante.",
        },
        {
            "name": "Organizador de produtos de limpeza",
            "category": "Limpeza",
            "store": "Mercado Livre",
            "price_cents": 7990,
            "image_query": "cleaning organizer",
            "description": "Mantem panos, borrifadores e escovas em um so lugar.",
        },
        {
            "name": "Air fryer",
            "category": "Cozinha",
            "store": "Magalu",
            "price_cents": 37990,
            "image_query": "air fryer",
            "description": "Um dos pedidos mais uteis para refeicoes praticas no dia a dia.",
        },
        {
            "name": "Jogo de panelas antiaderente",
            "category": "Cozinha",
            "store": "Casas Bahia",
            "price_cents": 32990,
            "image_query": "cookware set",
            "description": "Conjunto base para comecar a cozinha com boa estrutura.",
        },
        {
            "name": "Conjunto de facas",
            "category": "Cozinha",
            "store": "Shopee",
            "price_cents": 11990,
            "image_query": "kitchen knives set",
            "description": "Facas para preparos do dia a dia com mais praticidade.",
        },
        {
            "name": "Jogo de pratos rasos",
            "category": "Cozinha",
            "store": "Amazon",
            "price_cents": 14990,
            "image_query": "dinner plates set",
            "description": "Um conjunto versatil para receber visitas e montar a casa.",
        },
        {
            "name": "Faqueiro 24 pecas",
            "category": "Cozinha",
            "store": "Mercado Livre",
            "price_cents": 9990,
            "image_query": "cutlery set",
            "description": "Mesa posta basica para almocos, jantares e encontros em familia.",
        },
        {
            "name": "Liquidificador",
            "category": "Cozinha",
            "store": "Magalu",
            "price_cents": 18990,
            "image_query": "blender kitchen",
            "description": "Ajuda em sucos, molhos, massas leves e receitas do cotidiano.",
        },
        {
            "name": "Cafeteira eletrica",
            "category": "Cozinha",
            "store": "Casas Bahia",
            "price_cents": 16990,
            "image_query": "coffee maker",
            "description": "Cafe fresco para a rotina da casa nova e visitas especiais.",
        },
        {
            "name": "Potes hermeticos kit",
            "category": "Cozinha",
            "store": "Shopee",
            "price_cents": 8990,
            "image_query": "food storage containers",
            "description": "Mantem mantimentos organizados e com boa conservacao.",
        },
        {
            "name": "Garrafa termica",
            "category": "Cozinha",
            "store": "Amazon",
            "price_cents": 6990,
            "image_query": "thermos bottle",
            "description": "Perfeita para servir cafe, cha ou agua gelada em visitas.",
        },
        {
            "name": "Escorredor de louca inox",
            "category": "Cozinha",
            "store": "Mercado Livre",
            "price_cents": 12990,
            "image_query": "dish rack",
            "description": "Ajuda a organizar a bancada com um acabamento mais bonito.",
        },
        {
            "name": "Luminaria de piso",
            "category": "Sala",
            "store": "Magalu",
            "price_cents": 23990,
            "image_query": "floor lamp living room",
            "description": "Cria clima acolhedor e deixa a sala mais convidativa.",
        },
        {
            "name": "Manta para sofa",
            "category": "Sala",
            "store": "Casas Bahia",
            "price_cents": 8990,
            "image_query": "sofa throw blanket",
            "description": "Detalhe simples que traz conforto e acabamento ao ambiente.",
        },
        {
            "name": "Kit almofadas decorativas",
            "category": "Sala",
            "store": "Shopee",
            "price_cents": 11990,
            "description": "Toque de cor e textura para deixar a sala com mais personalidade.",
        },
        {
            "name": "Tapete sala 2m x 1.5m",
            "category": "Sala",
            "store": "Amazon",
            "price_cents": 26990,
            "description": "Ajuda a compor o espaco de estar com conforto e aconchego.",
        },
        {
            "name": "Mesa lateral redonda",
            "category": "Sala",
            "store": "Mercado Livre",
            "price_cents": 19990,
            "description": "Apoio funcional para cafe, livros e decoracao ao lado do sofa.",
        },
        {
            "name": "Cortina leve para sala",
            "category": "Sala",
            "store": "Magalu",
            "price_cents": 15990,
            "description": "Ajuda a controlar a luz natural sem pesar o ambiente.",
        },
        {
            "name": "Vaso decorativo grande",
            "category": "Sala",
            "store": "Casas Bahia",
            "price_cents": 10990,
            "description": "Peca para dar mais vida ao canto da sala ou aparador.",
        },
        {
            "name": "Jogo de cama queen",
            "category": "Quarto",
            "store": "Shopee",
            "price_cents": 21990,
            "description": "Base importante para deixar o quarto confortavel e pronto para uso.",
        },
        {
            "name": "Edredom casal",
            "category": "Quarto",
            "store": "Amazon",
            "price_cents": 24990,
            "description": "Conforto extra para noites mais frescas e quarto bem arrumado.",
        },
        {
            "name": "Kit travesseiros",
            "category": "Quarto",
            "store": "Mercado Livre",
            "price_cents": 15990,
            "description": "Par de travesseiros para completar a cama com mais conforto.",
        },
        {
            "name": "Abajur de cabeceira",
            "category": "Quarto",
            "store": "Magalu",
            "price_cents": 9990,
            "description": "Luz suave para leitura e um clima mais acolhedor no quarto.",
        },
        {
            "name": "Organizador de gaveta",
            "category": "Quarto",
            "store": "Casas Bahia",
            "price_cents": 4990,
            "description": "Facilita a rotina organizando roupas intimas, meias e acessorios.",
        },
        {
            "name": "Cabides de veludo kit",
            "category": "Quarto",
            "store": "Shopee",
            "price_cents": 5990,
            "description": "Economiza espaco no armario e protege roupas mais delicadas.",
        },
        {
            "name": "Cortina blackout",
            "category": "Quarto",
            "store": "Amazon",
            "price_cents": 18990,
            "description": "Ajuda no descanso e deixa o ambiente mais reservado.",
        },
        {
            "name": "Cesto multiuso",
            "category": "Quarto",
            "store": "Mercado Livre",
            "price_cents": 6990,
            "description": "Pode servir para mantas, roupas ou organizacao geral do ambiente.",
        },
        {
            "name": "Jogo de toalhas",
            "category": "Banheiro",
            "store": "Magalu",
            "price_cents": 14990,
            "description": "Item indispensavel para a rotina do banheiro e das visitas.",
        },
        {
            "name": "Tapete antiderrapante",
            "category": "Banheiro",
            "store": "Casas Bahia",
            "price_cents": 4990,
            "description": "Mais seguranca e conforto ao sair do banho.",
        },
        {
            "name": "Porta sabonete liquido",
            "category": "Banheiro",
            "store": "Shopee",
            "price_cents": 3990,
            "description": "Pequeno detalhe que deixa a bancada mais bonita e organizada.",
        },
        {
            "name": "Kit acessorios de banheiro",
            "category": "Banheiro",
            "store": "Amazon",
            "price_cents": 12990,
            "description": "Conjunto para harmonizar bancada, lavabo ou banheiro social.",
        },
        {
            "name": "Espelho de aumento",
            "category": "Banheiro",
            "store": "Mercado Livre",
            "price_cents": 8990,
            "description": "Pratico para detalhes de rotina e cuidados pessoais.",
        },
        {
            "name": "Nicho organizador de box",
            "category": "Banheiro",
            "store": "Magalu",
            "price_cents": 10990,
            "description": "Ajuda a manter shampoos e sabonetes organizados no banho.",
        },
        {
            "name": "Ventilador torre",
            "category": "Eletros",
            "store": "Casas Bahia",
            "price_cents": 32990,
            "description": "Refresca com menos volume visual, ideal para sala ou quarto.",
        },
        {
            "name": "Ferro a vapor vertical",
            "category": "Eletros",
            "store": "Shopee",
            "price_cents": 21990,
            "description": "Facilita roupas do dia a dia com menos esforco na passadoria.",
        },
        {
            "name": "Purificador de agua",
            "category": "Eletros",
            "store": "Amazon",
            "price_cents": 45990,
            "description": "Praticidade e mais conforto para o consumo diario de agua.",
        },
        {
            "name": "Sanduicheira grill",
            "category": "Eletros",
            "store": "Mercado Livre",
            "price_cents": 13990,
            "description": "Boa opcao para lanches rapidos e cafe da manha mais pratico.",
        },
        {
            "name": "Umidificador de ar",
            "category": "Eletros",
            "store": "Magalu",
            "price_cents": 16990,
            "description": "Ajuda no conforto do ambiente em dias mais secos.",
        },
        {
            "name": "Processador de alimentos",
            "category": "Eletros",
            "store": "Casas Bahia",
            "price_cents": 23990,
            "description": "Acelera preparos na cozinha e evita trabalho repetitivo.",
        },
        {
            "name": "Lavadora de alta pressao compacta",
            "category": "Eletros",
            "store": "Shopee",
            "price_cents": 42990,
            "description": "Util para quintal, garagem, varanda e limpeza pesada ocasional.",
        },
    ]

    items: list[dict[str, object]] = []
    for position, spec in enumerate(specs, start=1):
        image_url = None
        image_query = spec.get("image_query")
        if position <= IMAGE_LIMIT and image_query:
            image_url = f"https://loremflickr.com/960/720/{quote_plus(str(image_query))}"

        items.append(
            {
                "id": position,
                "position": position,
                "name": spec["name"],
                "category": spec["category"],
                "store": spec["store"],
                "price_cents": spec["price_cents"],
                "product_url": build_store_url(str(spec["store"]), str(spec["name"])),
                "image_url": image_url,
                "description": spec["description"],
                "alternatives": build_alternatives(
                    str(spec["store"]),
                    str(spec["name"]),
                    int(spec["price_cents"]),
                ),
            }
        )

    return items
