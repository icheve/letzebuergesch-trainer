export interface PictureStep {
  id: string
  number: number
  title: string
  prompt: string
  starters: string[]
  keywords: string[]
}

export interface PictureExercise {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  sampleByStep: string[]
  sceneKeywords: string[]
}

export const pictureSteps: PictureStep[] = [
  {
    id: 'setting',
    number: 1,
    title: 'Где, когда и какая погода',
    prompt: 'Скажите, фотография сделана внутри или снаружи. Добавьте время года, время суток или погоду.',
    starters: ['D’Bild ass dobausse gemaach ginn.', 'D’Bild ass dobannen gemaach ginn.', 'Ech mengen, et ass Summer.', 'Et ass sonneg an et reent net.'],
    keywords: ['dobausse', 'dobannen', 'wieder', 'sonneg', 'reent', 'summer', 'wanter', 'owes', 'moies', 'dag'],
  },
  {
    id: 'place',
    number: 2,
    title: 'Место',
    prompt: 'Назовите главное место: парк, улица, гостиная, сад или город.',
    starters: ['Op der Foto gesinn ech ...', 'Ech mengen, d’Foto ass zu ...', 'D’Leit sinn an / op ...'],
    keywords: ['op der foto', 'op dem bild', 'park', 'strooss', 'stad', 'stuff', 'gaart', 'doheem', 'london', 'roum'],
  },
  {
    id: 'surroundings',
    number: 3,
    title: 'Что видно вокруг',
    prompt: 'Перейдите от общего плана к деталям: фон, передний план, левая и правая стороны.',
    starters: ['Am Hannergrond gesinn ech ...', 'Am Virdergrond gesinn ech ...', 'Lénks / Riets gesinn ech ...', 'Ronderëm gesinn ech ...'],
    keywords: ['hannergrond', 'virdergrond', 'lénks', 'riets', 'ronderëm'],
  },
  {
    id: 'people',
    number: 4,
    title: 'Люди',
    prompt: 'Сколько людей Вы видите? Кто они могут быть?',
    starters: ['Ech gesinn ... Leit.', 'Am Virdergrond sinn ...', 'Vläicht si si Frënn / eng Famill / Noperen.'],
    keywords: ['leit', 'persounen', 'mann', 'fra', 'jong', 'meedchen', 'kand', 'famill', 'frënn', 'noperen'],
  },
  {
    id: 'actions',
    number: 5,
    title: 'Что они делают',
    prompt: 'Опишите два-три действия в настоящем времени.',
    starters: ['Si stinn / sëtzen / ginn ...', 'Si schwätzen mateneen.', 'D’Fra kuckt ...', 'De Mann huet ... an der Hand.'],
    keywords: ['stinn', 'sëtzen', 'ginn', 'maachen', 'kucken', 'schwätzen', 'streiden', 'weisen', 'trainéieren', 'spadséieren'],
  },
  {
    id: 'appearance',
    number: 6,
    title: 'Внешность и одежда',
    prompt: 'Выберите одного-двух людей: возраст, волосы, телосложение и одежда.',
    starters: ['D’Fra ass jonk / mëttelal a schlank.', 'Hien huet kuerz donkel Hoer.', 'Si huet ... un.', 'Hien huet och ...'],
    keywords: ['jonk', 'mëttelal', 'schlank', 'grouss', 'hoer', 'baart', 't-shirt', 'kleed', 'box', 'jeans', 'schong', 'un'],
  },
  {
    id: 'atmosphere',
    number: 7,
    title: 'Атмосфера',
    prompt: 'Опишите настроение людей и общую атмосферу.',
    starters: ['D’Atmosphär ass ...', 'D’Leit gesinn ... aus.', 'Ech mengen, si si frou / rosen.'],
    keywords: ['atmosphär', 'roueg', 'gemittlech', 'frëndlech', 'entspaant', 'frou', 'rosen', 'aktiv'],
  },
  {
    id: 'opinion',
    number: 8,
    title: 'Ваше мнение',
    prompt: 'Одной фразой оцените фотографию или ситуацию.',
    starters: ['Ech fannen d’Foto flott.', 'Ech fannen d’Foto interessant.', 'Menger Meenung no ...'],
    keywords: ['ech fannen', 'menger meenung', 'foto flott', 'foto interessant', 'bild flott', 'bild interessant'],
  },
  {
    id: 'personal',
    number: 9,
    title: 'Личная фраза',
    prompt: 'Свяжите изображение со своей жизнью, желанием или опытом.',
    starters: ['Ech ... och gär.', 'Ech géif gär ...', 'Dat erënnert mech un ...', 'Fir mech ass ...'],
    keywords: ['ech géif', 'ech maache', 'ech maachen och', 'ech kucken och', 'ech streiden net', 'ech besichen', 'erënnert mech', 'fir mech'],
  },
]

export const pictureClosing = {
  id: 'closing',
  title: 'Финальная фраза',
  phrase: 'Dat ass alles.',
  keywords: ['dat ass alles'],
}

export const pictureExercises: PictureExercise[] = [
  {
    id: 'sport-park',
    title: 'Спорт в парке',
    subtitle: 'Погода · группа людей · спортивная одежда',
    imageUrl: './images/picture-training/sport-park.jpg',
    sceneKeywords: ['park', 'wiss', 'beem', 'sport'],
    sampleByStep: [
      'D’Bild ass dobausse gemaach ginn. Ech mengen, et ass Summer an d’Wieder ass schéin.',
      'Op der Foto gesinn ech e Park.',
      'Ronderëm gesinn ech vill Beem an eng grouss Wiss.',
      'Am Virdergrond an an der Mëtt gesinn ech fënnef Leit: dräi Männer an zwou Fraen.',
      'Si maache Sport a kucken no vir.',
      'D’Leit si jonk a sportlech. Si hunn T-Shirten, Sportboxen oder Leggings a Sportschong un.',
      'D’Atmosphär ass aktiv a frou.',
      'Ech fannen d’Foto ganz flott.',
      'Ech maache selwer och gär Sport am Park.',
    ],
  },
  {
    id: 'london',
    title: 'Прогулка по Лондону',
    subtitle: 'Большой город · туристы · транспорт',
    imageUrl: './images/picture-training/london.jpg',
    sceneKeywords: ['london', 'bus', 'big ben', 'bréck', 'touristen'],
    sampleByStep: [
      'D’Bild ass dobausse gemaach ginn. Et ass Dag an d’Wieder ass dréchen.',
      'Ech mengen, d’Foto ass zu London.',
      'Am Hannergrond gesinn ech de Big Ben. Lénks gesinn ech e rouden Duebbeldeckerbus.',
      'Am Virdergrond gesinn ech véier jonk Leit: zwee Männer an zwou Fraen. Vläicht si si Frënn.',
      'Si ginn zesummen duerch d’Stad a schwätzen mateneen.',
      'D’Leit si jonk a sportlech. Si hunn Jacketten, Jeans a Schong un.',
      'D’Atmosphär ass lieweg a frëndlech.',
      'Ech fannen d’Foto flott.',
      'Ech géif gär London besichen. D’Stad ass interessant.',
    ],
  },
  {
    id: 'living-room',
    title: 'Вечер в гостиной',
    subtitle: 'Дом · фильм · спокойная атмосфера',
    imageUrl: './images/picture-training/living-room.jpg',
    sceneKeywords: ['stuff', 'tëlee', 'canapé', 'film', 'popcorn'],
    sampleByStep: [
      'D’Bild ass dobannen gemaach ginn. Ech mengen, et ass Wanter an et ass owes.',
      'Op der Foto gesinn ech eng Stuff. Ech mengen, d’Leit sinn doheem.',
      'Am Hannergrond gesinn ech eng grouss Tëlee. Um Dësch gesinn ech Popcorn a Käerzen.',
      'Am Virdergrond gesinn ech zwee jonk Leit: e Mann an eng Fra. Vläicht si si eng Koppel.',
      'Si sëtzen zesummen um Canapé a kucken e Film. D’Fra huet e Glas Wäin an der Hand.',
      'D’Fra huet laang blond Hoer an e rosa Pyjama un. De Mann huet kuerz donkel Hoer an en donkelen T-Shirt un.',
      'D’Atmosphär ass roueg a gemittlech.',
      'Ech fannen d’Foto flott.',
      'Ech kucken och gär Filmer doheem.',
    ],
  },
  {
    id: 'rome',
    title: 'Семья в Риме',
    subtitle: 'Достопримечательность · туристы · лето',
    imageUrl: './images/picture-training/rome.jpg',
    sceneKeywords: ['roum', 'colosseum', 'touristen', 'kaarte', 'kamera'],
    sampleByStep: [
      'D’Bild ass dobausse gemaach ginn. Et ass sonneg an ech mengen, et ass Summer.',
      'Op der Foto gesinn ech eng Strooss zu Roum.',
      'Am Hannergrond gesinn ech de Colosseum. Riets gesinn ech e Café an op der Strooss si vill Leit.',
      'Am Virdergrond gesinn ech dräi Leit: e Mann, eng Fra an e Jong. Vläicht si si eng Famill an Touristen.',
      'Si ginn duerch d’Stad. D’Fra kuckt op eng Kaart an de Mann huet eng Kamera.',
      'D’Fra huet e wäisst Kleed an en Hutt un. De Mann huet e bloen T-Shirt an eng beige Box un. De Jong huet e gesträiften T-Shirt un.',
      'D’Leit gesinn frou an entspaant aus. D’Atmosphär ass frëndlech.',
      'Ech fannen d’Foto flott.',
      'Ech géif gär Roum besichen. D’Stad ass interessant.',
    ],
  },
  {
    id: 'garden-argument',
    title: 'Спор в саду',
    subtitle: 'Соседи · действия · напряжённая атмосфера',
    imageUrl: './images/picture-training/garden-argument.jpg',
    sceneKeywords: ['gaart', 'noperen', 'hond', 'blummen', 'streiden'],
    sampleByStep: [
      'D’Bild ass dobausse gemaach ginn. Et ass sonneg an ech mengen, et ass Summer.',
      'Op der Foto gesinn ech e Gaart. Ech mengen, d’Leit sinn doheem.',
      'Am Hannergrond gesinn ech Haiser a vill Beem. Am Gaart si vill Blummen a Planzen. Lénks gesinn ech en Hond.',
      'Am Virdergrond gesinn ech zwee Leit: e Mann an eng Fra. Vläicht si si Noperen.',
      'Si stinn am Gaart a schwätzen mateneen. Ech mengen, si streiden a weisen openeen.',
      'D’Fra huet blond Hoer, en hellen T-Shirt an eng blo Jeans un. De Mann huet kuerz donkel Hoer, e gréngen T-Shirt an eng donkel Box un.',
      'D’Atmosphär ass net entspaant. Ech mengen, d’Leit si rosen.',
      'Ech fannen d’Foto interessant.',
      'Ech streiden net gär mat mengen Noperen.',
    ],
  },
]
