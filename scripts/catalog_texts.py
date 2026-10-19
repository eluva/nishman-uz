"""
Тексты каталога: ключ -> (ru, uz, en).
ru — по PDF (с исправленными опечатками). uz (латиница) и en — переводы.
Ключи с пометкой CLAIM — формулировки производителя, требуют проверки клиентом (см. README).
Один текст = один ключ: повторяющиеся свойства разных линеек ссылаются на один ключ.
"""

TYPES = {
    "aquaWax": ("Воск на водной основе", "Suv asosidagi mum", "Water-based wax"),
    "coloringWax": ("Цветной крем-воск", "Rangli krem-mum", "Coloring cream wax"),
    "spiderWax": ("Воск-паутинка", "Tolali mum", "Spider wax"),
    "mattePaste": ("Матовая паста", "Mat pasta", "Matte paste"),
    "classicClay": ("Классическая глина", "Klassik loy", "Classic clay"),
    "matteWax": ("Матовый воск", "Mat mum", "Matte wax"),
    "stylingCreamM8": ("Крем для укладки", "Turmak uchun krem", "Styling cream"),
    "pomade": ("Помада для укладки", "Turmak uchun pomada", "Styling pomade"),
    "stylingCream": ("Стайлинговый крем", "Stayling-krem", "Light styling cream"),
    "seasalt": ("Солевой спрей", "Tuzli sprey", "Sea salt spray"),
    "powder": ("Матирующая пудра", "Matlovchi pudra", "Mattifying powder"),
    "hairGel": ("Гель для волос", "Soch uchun gel", "Hair gel"),
    "groomingSpray": ("Груминг-спрей", "Gruming-sprey", "Grooming spray"),
    "hairSpray": ("Лак для волос", "Soch uchun lak", "Hairspray"),
    "colorSpray": ("Цветной спрей для волос", "Rangli soch spreyi", "Color hair spray"),
    "rootConcealer": ("Консилер для корней", "Ildizlar uchun konsiler", "Root concealer"),
    "hairFiber": ("Загуститель для волос", "Soch quyuqlashtirgichi", "Hair building fiber"),
    "twoPhase": ("Двухфазный кондиционер", "Ikki fazali konditsioner", "Two-phase conditioner"),
    "hairTonic": ("Тоник для волос", "Soch uchun tonik", "Hair tonic"),
    "hairMask": ("Маска для волос", "Soch uchun niqob", "Hair mask"),
    "shampoo": ("Шампунь для волос", "Soch uchun shampun", "Hair shampoo"),
    "conditioner": ("Кондиционер для волос", "Soch uchun konditsioner", "Hair conditioner"),
    "shavingGel": ("Гель для бритья", "Soqol olish uchun gel", "Shaving gel"),
    "creamCologne": ("Крем-одеколон после бритья", "Soqoldan keyingi krem-odekolon", "After-shave cream cologne"),
    "cologne": ("Одеколон после бритья", "Soqoldan keyingi odekolon", "After-shave cologne"),
    "afterShaveLotion": ("Лосьон после бритья", "Soqoldan keyingi loson", "After-shave lotion"),
    "talc": ("Тальк", "Talk", "Talc"),
    "beardOil": ("Масло для бороды и усов", "Soqol va mo‘ylov uchun moy", "Beard & mustache oil"),
    "beardShampoo": ("Шампунь для бороды и усов", "Soqol va mo‘ylov uchun shampun", "Beard & mustache shampoo"),
    "beardConditioner": ("Кондиционер для бороды и усов", "Soqol va mo‘ylov uchun konditsioner", "Beard & mustache conditioner"),
    "beardBalm": ("Бальзам-стайлинг для бороды и усов", "Soqol va mo‘ylov uchun stayling-balzam", "Beard & mustache styling balm"),
    "beardPerfume": ("Парфюм для волос и бороды", "Soch va soqol uchun parfyum", "Hair & beard perfume"),
    "peelOffMask": ("Маска-плёнка для лица", "Yuz uchun plyonka-niqob", "Peel-off face mask"),
    "peelingGel": ("Пилинг-гель для лица", "Yuz uchun piling-gel", "Face peeling gel"),
    "facialScrub": ("Скраб для лица", "Yuz uchun skrab", "Facial scrub"),
    "clayMask": ("Глиняная маска для лица", "Yuz uchun loy niqob", "Face clay mask"),
    "handFace": ("Крем для рук и лица", "Qo‘l va yuz uchun krem", "Hand & face cream"),
    "comb": ("Расчёска для стрижки", "Soch olish uchun taroq", "Cutting comb"),
    "brushing": ("Брашинг", "Brashing", "Round brush"),
    "fadeBrush": ("Щётка для фейда", "Feyd uchun cho‘tka", "Fade brush"),
    "boarBrush": ("Премиум-щётка из щетины кабана", "Premium cho‘tka (to‘ng‘iz qili)", "Premium boar bristle brush"),
    "neckBrush": ("Сметка для стрижки", "Bo‘yin cho‘tkasi", "Neck duster brush"),
    "shavingBrush": ("Помазок для бритья", "Soqol olish cho‘tkasi", "Shaving brush"),
    "cape": ("Пеньюар", "Barber yopinchig‘i", "Barber cape"),
    "dispenser": ("Диспенсер для воротничков", "Yoqachalar uchun dispenser", "Neck strip dispenser"),
    "towels": ("Одноразовые полотенца", "Bir martalik sochiqlar", "Disposable towels"),
}

SCENTS = {
    "bubblegum": ("Жвачка «Бабл-гам»", "«Babl-gam» saqichi", "Bubble gum"),
    "tropicalFruits": ("Тропические фрукты", "Tropik mevalar", "Tropical fruits"),
    "mango": ("Тропическое манго", "Tropik mango", "Tropical mango"),
    "orientalFlowers": ("Восточные цветы", "Sharq gullari", "Oriental flowers"),
    "forestBerries": ("Лесные ягоды", "O‘rmon rezavorlari", "Forest berries"),
    "peach": ("Персик", "Shaftoli", "Peach"),
    "oneMillion": ("Парфюм One Million", "One Million parfyumi", "One Million perfume"),
    "blackVanilla": ("Чёрная ваниль", "Qora vanil", "Black vanilla"),
    "cola": ("Кола", "Kola", "Cola"),
    "sweetVanilla": ("Сладкая ваниль", "Shirin vanil", "Sweet vanilla"),
    "coconut": ("Кокос", "Kokos", "Coconut"),
    "amberWood": ("Парфюм «Amber Wood»", "«Amber Wood» parfyumi", "Amber Wood perfume"),
    "cologne8": ("Одеколон №8", "8-sonli odekolon", "Cologne No. 8"),
    "apricot": ("Абрикос", "O‘rik", "Apricot"),
    "avocado": ("Авокадо", "Avokado", "Avocado"),
    "classic": ("Классический", "Klassik", "Classic"),
    "blackberry": ("Ежевика", "Maymunjon", "Blackberry"),
    "olive": ("Оливковый", "Zaytunli", "Olive"),
    "pomegranate": ("Гранат", "Anor", "Pomegranate"),
}

VARIANTS = {
    "lightSilver": ("Светло-серый", "Och kulrang", "Light grey"),
    "ash": ("Пепельный", "Kul rang", "Ash grey"),
    "deepBlack": ("Глубокий чёрный", "To‘q qora", "Deep black"),
    "capeBlackWhite": ("Чёрно-белый", "Qora-oq", "Black & white"),
    "capeStripe": ("Чёрный в полоску", "Qora, chiziqli", "Black striped"),
}

SHADES = {
    "black": ("Чёрный", "Qora", "Black"),
    "white": ("Белый", "Oq", "White"),
    "gold": ("Золотой", "Oltin", "Gold"),
    "red": ("Красный", "Qizil", "Red"),
    "yellow": ("Жёлтый", "Sariq", "Yellow"),
    "blue": ("Синий", "Ko‘k", "Blue"),
    "green": ("Зелёный", "Yashil", "Green"),
    "pink": ("Розовый", "Pushti", "Pink"),
    "purple": ("Фиолетовый", "Binafsha", "Purple"),
    "glitterSilver": ("Глиттер серебро", "Kumush glitter", "Glitter silver"),
    "glitterGold": ("Глиттер золото", "Oltin glitter", "Glitter gold"),
    "glitterMulticolor": ("Глиттер мультиколор", "Rang-barang glitter", "Glitter multicolor"),
    "lightBrown": ("Светло-коричневый", "Och jigarrang", "Light brown"),
    "mediumBrown": ("Средне-коричневый", "O‘rta jigarrang", "Medium brown"),
    "darkBrown": ("Тёмно-коричневый", "To‘q jigarrang", "Dark brown"),
}

# Пилюли-заметки с заголовков разделов PDF
NOTES = {
    "waterBased": ("На водной основе", "Suv asosida", "Water-based"),
    "thickHair": ("Для густых и жёстких волос", "Qalin va dag‘al sochlar uchun", "For thick, coarse hair"),
    "grayHair": ("Для седых волос", "Oqargan sochlar uchun", "For grey hair"),
    "moisturizing": ("Увлажняющий эффект", "Namlantiruvchi ta’sir", "Moisturizing effect"),
    "strongHold": ("Для стойкой фиксации", "Mustahkam fiksatsiya uchun", "For a firm hold"),
    "roots": ("От седины и отросших корней", "Oqargan va o‘sgan ildizlar uchun", "For grey and regrown roots"),
    "moistureHeat": ("Увлажнение и термозащита", "Namlik va issiqlikdan himoya", "Moisture & heat protection"),
    "hairLoss": ("Против выпадения и ломкости", "To‘kilish va mo‘rtlikka qarshi", "Against hair loss and breakage"),  # CLAIM
    "allHair": ("Для всех типов волос", "Barcha soch turlari uchun", "For all hair types"),
    "allSkin": ("Для всех типов кожи", "Barcha teri turlari uchun", "For all skin types"),
    "normalOily": ("Для нормальной и жирной кожи", "Normal va yog‘li teri uchun", "For normal and oily skin"),
    "sensitiveDry": ("Для чувствительной и сухой кожи лица", "Sezgir va quruq yuz terisi uchun", "For sensitive and dry facial skin"),
    "moistureShine": ("Увлажнение и блеск", "Namlik va jilo", "Moisture & shine"),
    "oilyCombo": ("Для жирной и комбинированной кожи", "Yog‘li va aralash teri uchun", "For oily and combination skin"),
}

FEATURES = {
    # Aqua Hair Styling Wax
    "naturalLook": ("Естественный вид укладки", "Turmakning tabiiy ko‘rinishi", "Natural-looking style"),
    "shortMedium": ("Для короткой и средней длины волос", "Qisqa va o‘rta uzunlikdagi sochlar uchun", "For short and medium-length hair"),
    "easyApplyWash": ("Легко наносится и смывается", "Oson surtiladi va yuviladi", "Easy to apply and rinse out"),
    # Coloring Wax
    "tempColor": ("Временно окрашивает волосы", "Sochni vaqtincha bo‘yaydi", "Temporarily tints the hair"),
    "shapesStyle": ("Придаёт форму причёске", "Soch turmagiga shakl beradi", "Gives the hairstyle shape"),
    "instantEffect": ("Мгновенный эффект", "Bir zumda ta’sir", "Instant effect"),
    # Spider Wax
    "artMess": ("Создаёт эффект «художественного беспорядка»", "«Badiiy tartibsizlik» effektini yaratadi", "Creates an “artistic mess” effect"),
    "keepsSoft": ("Сохраняет мягкость волос в финале укладки", "Turmak oxirida sochni yumshoq saqlaydi", "Keeps hair soft in the finished style"),
    "restyleDay": ("Позволяет поправлять и менять укладку в течение дня", "Kun davomida turmakni tuzatish va o‘zgartirish mumkin", "Lets you adjust and restyle throughout the day"),
    # Matte line
    "allDayHold": ("Для устойчивой укладки в течение всего дня", "Kun bo‘yi barqaror turmak uchun", "For a style that holds all day"),
    "setFirm": ("Неподвижна после застывания", "Qotgandan keyin qimirlamaydi", "Sets firm once dry"),
    "thickTextured": ("Для густых, текстурированных и современных причёсок", "Qalin, teksturali va zamonaviy turmaklar uchun", "For thick, textured and modern styles"),
    "shortLongWavy": ("Для коротких и длинных волнистых волос", "Qisqa va uzun to‘lqinli sochlar uchun", "For short and long wavy hair"),
    "needsWarming": ("Требует разогревания в ладонях", "Kaftlarda isitishni talab qiladi", "Warm up between palms before use"),
    "messyHold": ("Для беспорядочной фиксации", "Erkin, tartibsiz fiksatsiya uchun", "For a messy, undone hold"),
    "spreadsEasily": ("Легко распределяется по волосам", "Soch bo‘ylab oson taqsimlanadi", "Spreads easily through the hair"),
    "keepsFlex": ("Сохраняет подвижность", "Harakatchanlikni saqlaydi", "Keeps movement"),
    "incaOil": ("Масло инка-инчи защищает и укрепляет волосы", "Inka-inchi moyi sochni himoya qiladi va mustahkamlaydi", "Inca inchi oil protects and strengthens hair"),  # CLAIM
    "noWarming": ("Легко наносится, не требует разогревания в ладонях", "Oson surtiladi, kaftda isitish shart emas", "Applies easily without warming in the palms"),
    "fineHair": ("Для тонких волос", "Ingichka sochlar uchun", "For fine hair"),
    "noStickWeigh": ("Не склеивает и не утяжеляет волосы", "Sochni yopishtirmaydi va og‘irlashtirmaydi", "Doesn’t stick or weigh hair down"),
    "naturallySmooth": ("Оставляет волосы естественно гладкими", "Sochni tabiiy silliq qoldiradi", "Leaves hair naturally smooth"),
    "humidity": ("Сохраняет форму укладки при высокой влажности", "Yuqori namlikda ham turmak shaklini saqlaydi", "Holds its shape in high humidity"),
    "active": ("Для активных людей, занимающихся спортом", "Sport bilan shug‘ullanadigan faol insonlar uchun", "For active people who play sports"),
    # Pomade
    "firmHold": ("Стойкая фиксация", "Mustahkam fiksatsiya", "Firm hold"),
    "shineLook": ("Блеск и эффектный вид волос", "Jilo va ta’sirli ko‘rinish", "Shine and a striking look"),
    "combOut": ("Легко удаляется расчёсыванием", "Taroq bilan oson ketadi", "Combs out easily"),
    # Styling cream
    "invisibleOnHair": ("Практически не заметен на волосах", "Sochda deyarli sezilmaydi", "Practically invisible on the hair"),
    "thinWeak": ("Идеален для тонких и слабых волос", "Ingichka va zaif sochlar uchun ideal", "Ideal for fine, weak hair"),
    # Seasalt
    "naturalStyle": ("Создаёт естественную укладку", "Tabiiy turmak yaratadi", "Creates a natural style"),
    "volumeStrands": ("Придаёт объём волосам и выделяет пряди", "Sochga hajm beradi va tolalarni ajratadi", "Adds volume and defines strands"),
    "aloe": ("Благодаря алоэ вера спрей не пересушивает волосы", "Aloe vera tufayli sprey sochni quritmaydi", "Aloe vera keeps the spray from drying hair out"),
    # Powder
    "instantShape": ("Мгновенно придаёт форму", "Bir zumda shakl beradi", "Shapes instantly"),
    "pliable": ("Делает волосы податливыми", "Sochni itoatkor qiladi", "Makes hair pliable"),
    "unnoticeable": ("Незаметна на волосах", "Sochda ko‘rinmaydi", "Undetectable in the hair"),
    "dayLong": ("Укладка сохраняется в течение дня", "Turmak kun davomida saqlanadi", "The style lasts all day"),
    "grayMask": ("Временно маскирует седые волосы", "Oqargan sochlarni vaqtincha yashiradi", "Temporarily masks grey hair"),
    "untilWash": ("Эффект маскировки — до следующего мытья волос", "Yashirish effekti keyingi yuvishgacha", "Masking lasts until the next wash"),
    # Gels
    "wetLook": ("Создаёт эффект мокрых волос", "Ho‘l soch effektini yaratadi", "Creates a wet look"),
    "fullControl": ("Стойкая фиксация и полный контроль", "Mustahkam fiksatsiya va to‘liq nazorat", "Firm hold and full control"),
    "longStyle": ("Обеспечивает длительную укладку", "Uzoq davom etadigan turmak", "Long-lasting style"),
    "grayBlack": ("Можно покрыть седые волосы чёрным цветом", "Oqargan sochni qora rangga bo‘yash mumkin", "Can cover grey hair with black"),
    "lastsUntilWash": ("Эффект сохраняется до следующего мытья", "Effekt keyingi yuvishgacha saqlanadi", "The effect lasts until the next wash"),
    "naturalHairLook": ("Придаёт волосам естественный вид", "Sochga tabiiy ko‘rinish beradi", "Gives hair a natural look"),
    # Grooming spray
    "elastic": ("Придаёт волосам упругость", "Sochga elastiklik beradi", "Adds bounce to hair"),
    "fineStrands": ("Для фиксации тонких прядей", "Ingichka tolalarni fiksatsiya qilish uchun", "Holds fine strands"),
    "moistStyling": ("Увлажняет волосы при укладке", "Turmak paytida sochni namlaydi", "Moisturizes hair while styling"),
    "everyday": ("Для повседневного использования", "Kundalik foydalanish uchun", "For everyday use"),
    # Hairspray
    "hold24": ("Фиксация до 24 часов", "24 soatgacha fiksatsiya", "Hold for up to 24 hours"),  # CLAIM
    "humidityResist": ("Устойчив к влаге", "Namlikka chidamli", "Humidity resistant"),
    "noWeigh": ("Не утяжеляет волосы", "Sochni og‘irlashtirmaydi", "Doesn’t weigh hair down"),
    "addsVolume": ("Придаёт объём волосам", "Sochga hajm beradi", "Adds volume"),
    # Color spray
    "tempColorChange": ("Временно изменяет цвет волос", "Soch rangini vaqtincha o‘zgartiradi", "Temporarily changes hair color"),
    "highlights": ("Подчёркивает отдельные пряди", "Alohida tolalarni ta’kidlaydi", "Highlights individual strands"),
    "washesEasily": ("Легко смывается", "Oson yuviladi", "Washes out easily"),
    "brightColor": ("Яркий и насыщенный цвет", "Yorqin va to‘yingan rang", "Bright, rich color"),
    # Concealer / fiber
    "coversRoots": ("Закрашивает отросшие корни и седину", "O‘sgan ildizlar va oqarishni bo‘yaydi", "Covers regrowth and grey"),
    "colorFast": ("Обеспечивает стойкость цвета", "Rang barqarorligini ta’minlaydi", "Long-lasting color"),
    "quickDry": ("Быстро высыхает", "Tez quriydi", "Dries quickly"),
    "noStains": ("Не оставляет пятен на одежде и не осыпается", "Kiyimda dog‘ qoldirmaydi va to‘kilmaydi", "Doesn’t stain clothes or flake"),
    "shampooWash": ("Легко смывается шампунем", "Shampun bilan oson yuviladi", "Rinses out easily with shampoo"),
    "thinningVolume": ("Придаёт объём поредевшим волосам", "Siyraklashgan sochga hajm beradi", "Adds volume to thinning hair"),
    "sprayIncluded": ("Фиксирующий спрей в комплекте", "To‘plamda fiksatsiya spreyi bor", "Fixing spray included"),
    "weatherproof": ("Устойчив к дождю и ветру", "Yomg‘ir va shamolga chidamli", "Resists rain and wind"),
    # Two-phase / tonic / mask
    "instantAction": ("Действует сразу после распыления", "Purkalgandan so‘ng darhol ta’sir qiladi", "Works immediately after spraying"),
    "heatProtect": ("Обладает лёгкой термозащитой", "Yengil issiqlikdan himoya qiladi", "Offers light heat protection"),
    "strengthens": ("Укрепляет волосы", "Sochni mustahkamlaydi", "Strengthens hair"),  # CLAIM
    "noHeavy": ("Не создаёт эффекта «тяжёлых волос»", "«Og‘ir soch» effektini bermaydi", "No heavy-hair feel"),
    "easyComb": ("Способствует лёгкому расчёсыванию", "Oson taralishga yordam beradi", "Helps hair comb through easily"),
    "restoresStructure": ("Восстанавливает структуру волос", "Soch tuzilishini tiklaydi", "Restores hair structure"),  # CLAIM
    "follicles": ("Оказывает стимулирующее действие на волосяные фолликулы и улучшает кровообращение", "Soch follikulalarini rag‘batlantiradi va qon aylanishini yaxshilaydi", "Stimulates hair follicles and improves circulation"),  # CLAIM
    "hairLossFight": ("Борется с выпадением волос", "Soch to‘kilishiga qarshi kurashadi", "Fights hair loss"),  # CLAIM
    "wellGroomed": ("При постоянном использовании волосы становятся ухоженными и приобретают здоровый вид", "Muntazam foydalanilganda soch parvarishlangan va sog‘lom ko‘rinadi", "With regular use hair looks groomed and healthy"),
    "waterBalance": ("Поддерживает естественный водный баланс", "Tabiiy suv balansini saqlaydi", "Supports the natural moisture balance"),
    "silky": ("Придаёт шелковистость и мягкость", "Ipakdek mayinlik va yumshoqlik beradi", "Leaves hair silky and soft"),
    "detangle": ("Облегчает расчёсывание", "Tarashni osonlashtiradi", "Makes detangling easier"),
    "antiBreak": ("Препятствует ломкости волос", "Soch mo‘rtligining oldini oladi", "Helps prevent breakage"),  # CLAIM
    # Shampoo / conditioner
    "cleansScalp": ("Эффективно моет волосы и кожу головы", "Soch va bosh terisini samarali yuvadi", "Thoroughly cleans hair and scalp"),
    "removesStyling": ("Удаляет средства укладки", "Turmak vositalarini ketkazadi", "Removes styling products"),
    "saltParabenFree": ("Не содержит солей и парабенов", "Tuz va parabenlarsiz", "Salt- and paraben-free"),  # CLAIM
    "strengthMoist": ("Укрепляет и увлажняет волосы", "Sochni mustahkamlaydi va namlaydi", "Strengthens and moisturizes hair"),  # CLAIM
    "needsConditioner": ("Рекомендуется использовать с кондиционером", "Konditsioner bilan ishlatish tavsiya etiladi", "Use with a conditioner"),
    "smoothShine": ("Гладкость и здоровый блеск", "Silliqlik va sog‘lom jilo", "Smoothness and healthy shine"),
    "parabenSiliconeFree": ("Не содержит парабенов и силиконов", "Paraben va silikonlarsiz", "Paraben- and silicone-free"),  # CLAIM
    "gentle": ("Действует очень мягко и увлажняет волосы", "Juda yumshoq ta’sir qiladi va sochni namlaydi", "Works gently and moisturizes hair"),
    # Shaving
    "razorGlide": ("Обеспечивает идеальное скольжение бритвы", "Ustaraning ideal sirpanishini ta’minlaydi", "Gives a perfect razor glide"),
    "softensBeard": ("Смягчает бороду и щетину", "Soqol va tuklarni yumshatadi", "Softens beard and stubble"),
    "moistShave": ("Увлажняет кожу в процессе бритья", "Soqol olish paytida terini namlaydi", "Moisturizes skin while shaving"),
    "preciseContours": ("Идеален для выполнения точных контуров", "Aniq konturlar uchun ideal", "Ideal for precise outlines"),
    "lightFormula": ("Облегчённая формула с кремовой текстурой", "Kremsimon tekstura va yengil formula", "Light formula with a creamy texture"),
    "irritationProtect": ("Защита от раздражения после бритья", "Soqoldan keyingi qichishishdan himoya", "Protects against razor irritation"),
    "soothesRedness": ("Успокаивает кожу и предотвращает покраснения", "Terini tinchlantiradi va qizarishning oldini oladi", "Soothes skin and prevents redness"),
    "antiInflammatory": ("Обладает противовоспалительным эффектом", "Yallig‘lanishga qarshi ta’sirga ega", "Has an anti-inflammatory effect"),  # CLAIM
    "tonesSkin": ("Тонизирует кожу и дарит лёгкий приятный аромат", "Terini tetiklashtiradi va yengil xushbo‘y hid beradi", "Tones the skin with a light, pleasant scent"),
    "preventsIrritation": ("Предотвращает раздражение после бритья", "Soqoldan keyingi qichishishning oldini oladi", "Prevents post-shave irritation"),
    "comfortFresh": ("Создаёт чувство комфорта и свежести", "Qulaylik va tetiklik hissini beradi", "Leaves a feeling of comfort and freshness"),
    "notLasting": ("Нестойкий аромат", "Hid uzoq saqlanmaydi", "Light, non-lingering scent"),
    "alcoholFree": ("Бесспиртовой увлажняющий лосьон", "Spirtsiz namlantiruvchi loson", "Alcohol-free moisturizing lotion"),
    "instantSoothe": ("Мгновенно успокаивает и восстанавливает кожу", "Terini bir zumda tinchlantiradi va tiklaydi", "Instantly soothes and restores skin"),
    "tightness": ("Снимает покраснение и ощущение стянутости", "Qizarish va tortishish hissini yo‘qotadi", "Relieves redness and tightness"),
    "beforeAfter": ("Используйте до или после бритья и стрижки", "Soqol olish va soch olishdan oldin yoki keyin ishlating", "Use before or after shaving and haircuts"),
    "absorbs": ("Эффективно впитывает влагу", "Namlikni samarali shimadi", "Absorbs moisture effectively"),
    "healsCuts": ("Затягивает порезы и снимает покраснения", "Kesilgan joylarni bitiradi va qizarishni ketkazadi", "Closes nicks and relieves redness"),  # CLAIM
    "calmsIrritation": ("Успокаивает раздражение кожи", "Teri qichishishini tinchlantiradi", "Calms skin irritation"),
    # Beard
    "gentleClean": ("Мягко очищают от грязи, пыли и излишков кожного жира", "Kir, chang va ortiqcha yog‘dan yumshoq tozalaydi", "Gently remove dirt, dust and excess sebum"),
    "shampooSoft": ("Шампунь обладает смягчающим и увлажняющим действием", "Shampun yumshatuvchi va namlantiruvchi ta’sirga ega", "The shampoo softens and moisturizes"),
    "condDry": ("Кондиционер устраняет сухость и шелушение кожи, укрепляет структуру волос", "Konditsioner quruqlik va po‘st tashlashni yo‘qotadi, soch tuzilishini mustahkamlaydi", "The conditioner relieves dryness and flaking and strengthens hair"),  # CLAIM
    "obedient": ("Делает волосы послушными", "Tuklarni itoatkor qiladi", "Tames unruly hairs"),
    "flexStyling": ("Обеспечивает гибкость при укладке", "Turmakda egiluvchanlikni ta’minlaydi", "Keeps styling flexible"),
    "neutralizes": ("Нейтрализует нежелательные запахи", "Noxush hidlarni neytrallaydi", "Neutralizes unwanted odors"),
    "lastingScent": ("Имеет стойкий аромат", "Hidi uzoq saqlanadi", "Long-lasting scent"),
    "moistBeard": ("Увлажняет волосы бороды", "Soqol tuklarini namlaydi", "Moisturizes beard hair"),
    "shineGroomed": ("Придаёт естественный блеск и ухоженный вид", "Tabiiy jilo va ozoda ko‘rinish beradi", "Adds natural shine and a groomed look"),
    # Face
    "peelBlackheads": ("Помогает избавиться от чёрных точек, очищает кожу и удаляет отмершие клетки", "Qora nuqtalardan xalos bo‘lishga yordam beradi, terini tozalaydi va o‘lik hujayralarni ketkazadi", "Helps clear blackheads, cleanses and removes dead cells"),
    "peelTone": ("Кожа выглядит ухоженной: ровный тон, упругость, гладкость, без жирного блеска", "Teri ozoda ko‘rinadi: tekis rang, elastiklik, silliqlik, yog‘li jilosiz", "Skin looks groomed: even tone, firm, smooth, no oily shine"),
    "peelAcne": ("Борется с воспалениями, акне и расширенными порами", "Yallig‘lanish, akne va kengaygan teshiklarga qarshi kurashadi", "Fights inflammation, acne and enlarged pores"),  # CLAIM
    "peelingDeep": ("Глубоко очищает поры, удаляет загрязнения и чёрные точки, освежает цвет лица и смягчает кожу", "Teshiklarni chuqur tozalaydi, ifloslik va qora nuqtalarni ketkazadi, yuz rangini yangilaydi va terini yumshatadi", "Deep-cleans pores, removes impurities and blackheads, refreshes and softens skin"),
    "scrubGentle": ("Натуральный глубоко очищающий скраб для мягкого удаления омертвевших клеток", "O‘lik hujayralarni yumshoq ketkazuvchi tabiiy chuqur tozalovchi skrab", "Natural deep-cleansing scrub that gently removes dead cells"),
    "moisturizingEffect": ("Обладает увлажняющим эффектом", "Namlantiruvchi ta’sirga ega", "Has a moisturizing effect"),
    "scrubResult": ("При регулярном использовании кожа становится более гладкой, мягкой и здоровой", "Muntazam foydalanilganda teri silliq, yumshoq va sog‘lom bo‘ladi", "With regular use skin becomes smoother, softer and healthier"),
    "clayDeep": ("Глина устраняет загрязнения, впитывает излишки кожного сала, глубоко очищает, стягивает поры и смягчает кожу", "Loy ifloslikni ketkazadi, ortiqcha yog‘ni shimadi, chuqur tozalaydi, teshiklarni toraytiradi va terini yumshatadi", "Clay lifts impurities, absorbs excess sebum, deep-cleans, tightens pores and softens skin"),
    "hfSoothe": ("Обогащённая формула успокаивает и расслабляет кожу", "Boyitilgan formula terini tinchlantiradi va bo‘shashtiradi", "An enriched formula that soothes and relaxes skin"),
    "hfRitual": ("Чарующий аромат превращает ежедневный уход в приятный ритуал", "Maftunkor hid kundalik parvarishni yoqimli marosimga aylantiradi", "A captivating scent turns daily care into a ritual"),
    "hf24": ("Интенсивное увлажнение и мягкость в течение 24 часов", "24 soat davomida intensiv namlik va yumshoqlik", "Intense moisture and softness for 24 hours"),  # CLAIM
    # Accessories
    "combUse": ("Удобна при стрижке и бритье, а также при укладке и моделировании", "Soch olish, soqol olish, turmak va modellashda qulay", "Handy for cutting, shaving, styling and shaping"),
    "brushVolume": ("Для создания объёма и локонов", "Hajm va jingalaklar yaratish uchun", "For volume and curls"),
    "fadeBristle": ("Мягкая натуральная щетина (5 рядов) в деревянном основании, удобно лежит в руке", "Yog‘och asosdagi yumshoq tabiiy qil (5 qator), qo‘lga qulay", "Soft natural bristles (5 rows) on a wooden base, comfortable grip"),
    "fadeUse": ("Для направления мелких волос при фейде и других задач", "Feydda mayda tuklarni yo‘naltirish va boshqa vazifalar uchun", "Directs fine hairs during fades and more"),
    "neckUse": ("Мягкая эластичная щетина и деревянная ручка — сметает волосы после стрижки", "Yumshoq elastik qil va yog‘och dasta — soch olgandan keyin tuklarni supuradi", "Soft, springy bristles and a wooden handle to sweep away cut hair"),
}

# Свойства линеек (ключи FEATURES)
LINE_FEATURES = {
    "aqua-wax": ["naturalLook", "shortMedium", "easyApplyWash"],
    "coloring-wax": ["tempColor", "shapesStyle", "easyApplyWash", "instantEffect"],
    "spider-wax": ["artMess", "keepsSoft", "restyleDay"],
    "pomade": ["firmHold", "shineLook", "combOut"],
    "styling-cream": ["noStickWeigh", "easyApplyWash", "invisibleOnHair", "thinWeak"],
    "seasalt": ["naturalStyle", "volumeStrands", "aloe"],
    "powder": ["instantShape", "pliable", "naturalLook", "unnoticeable", "dayLong"],
    "gel": ["wetLook", "fullControl"],
    "ultra-hold": ["longStyle", "grayBlack", "lastsUntilWash", "naturalHairLook"],
    "styling-tonic": ["elastic", "fineStrands", "moistStyling", "everyday"],
    "styling-spray": ["hold24", "humidityResist", "noWeigh", "addsVolume"],
    "color-spray": ["tempColorChange", "highlights", "washesEasily", "brightColor"],
    "root-concealer": ["coversRoots", "colorFast", "quickDry", "noStains", "shampooWash"],
    "keratin-fiber": ["thinningVolume", "sprayIncluded", "weatherproof", "shampooWash"],
    "two-phase": ["instantAction", "heatProtect", "strengthens", "noHeavy", "easyComb"],
    "hair-tonic": ["restoresStructure", "follicles", "hairLossFight", "wellGroomed"],
    "hair-mask": ["waterBalance", "silky", "detangle", "antiBreak"],
    "pro-shampoo": ["cleansScalp", "removesStyling", "saltParabenFree", "strengthMoist", "needsConditioner"],
    "pro-conditioner": ["smoothShine", "parabenSiliconeFree", "gentle"],
    "salon-size": [],
    "shaving-gel": ["razorGlide", "softensBeard", "moistShave", "preciseContours"],
    "cream-cologne": ["lightFormula", "irritationProtect", "soothesRedness", "antiInflammatory"],
    "cologne": ["tonesSkin", "preventsIrritation", "comfortFresh", "notLasting"],
    "after-shave-lotion": ["alcoholFree", "instantSoothe", "tightness", "preciseContours"],
    "talc": ["beforeAfter", "absorbs", "healsCuts", "calmsIrritation"],
    "beard-oil": ["restoresStructure", "follicles", "hairLossFight", "wellGroomed"],
    "beard-wash": ["gentleClean", "shampooSoft", "condDry"],
    "beard-balm": ["obedient", "flexStyling"],
    "beard-perfume": ["neutralizes", "lastingScent", "moistBeard", "shineGroomed"],
    "peel-off": ["peelBlackheads", "peelTone", "peelAcne"],
    "skin-smoothing": ["peelingDeep"],
    "facial-scrub": ["scrubGentle", "moisturizingEffect", "scrubResult"],
    "clay-mask": ["clayDeep"],
    "hand-face": ["hfSoothe", "hfRitual", "hf24"],
    "hair-comb": ["combUse"],
    "hair-brush": ["brushVolume"],
    "fade-brush": ["fadeBristle", "fadeUse"],
    "neck-brush": ["neckUse"],
    "barber-essentials": [],
    "matte": [],
}

# Индивидуальные свойства товаров (ключи FEATURES) — перекрывают свойства линейки
PRODUCT_FEATURES = {
    "matte-m1": ["allDayHold", "setFirm"],
    "matte-m2": ["thickTextured"],
    "matte-m3": ["messyHold", "spreadsEasily"],
    "matte-m4": ["thickTextured", "shortLongWavy", "needsWarming"],
    "matte-m5": ["shortMedium", "keepsFlex"],
    "matte-m6": ["allHairTypes", "incaOil"],
    "matte-m7": ["noWarming", "shortMedium"],
    "matte-m8": ["fineHair", "noStickWeigh", "naturallySmooth"],
    "matte-m9": ["humidity", "active", "shortMedium"],
    "powder-cp": ["grayMask", "untilWash"],
    "salon-shampoo": ["cleansScalp", "removesStyling", "saltParabenFree", "strengthMoist", "needsConditioner"],
    "salon-conditioner": ["smoothShine", "parabenSiliconeFree", "gentle"],
    "fade-brush-r": [],
    "boar-brush-premium": [],
}

# «Для всех типов волос» у M6 — тот же текст, что и пилюля allHair: используем ключ пилюли
ALIASES = {"allHairTypes": "allHair"}

LINE_NAME_KEYS = {
    "barber-essentials": ("Барберские аксессуары", "Barber aksessuarlari", "Barber essentials"),
}

# Пилюли по линейкам (ключи NOTES)
LINE_NOTES = {
    "styling-cream": ["waterBased"],
    "gel": ["thickHair"],
    "ultra-hold": ["grayHair"],
    "styling-tonic": ["moisturizing"],
    "styling-spray": ["strongHold"],
    "root-concealer": ["roots"],
    "keratin-fiber": ["roots"],
    "two-phase": ["moistureHeat"],
    "hair-tonic": ["hairLoss"],
    "hair-mask": ["allHair"],
    "pro-shampoo": ["allHair"],
    "pro-conditioner": ["allHair"],
    "salon-size": ["allHair"],
    "shaving-gel": ["allSkin"],
    "cream-cologne": ["allSkin"],
    "cologne": ["normalOily"],
    "after-shave-lotion": ["sensitiveDry"],
    "talc": ["allSkin"],
    "beard-oil": ["moistureShine"],
    "beard-wash": ["allHair"],
    "peel-off": ["oilyCombo"],
    "skin-smoothing": ["allSkin"],
    "facial-scrub": ["allSkin"],
    "clay-mask": ["allSkin"],
    "hand-face": ["allSkin"],
}

CLAIMS = [
    "incaOil", "hold24", "strengthens", "restoresStructure", "follicles", "hairLossFight", "antiBreak",
    "saltParabenFree", "strengthMoist", "parabenSiliconeFree", "antiInflammatory", "healsCuts", "condDry",
    "peelAcne", "hf24", "hairLoss",
]
