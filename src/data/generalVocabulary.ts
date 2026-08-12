import type { VocabularyCard, VocabularyContext } from '../types'

type GeneralVocabularyCard = VocabularyCard & VocabularyContext

const lodWord = (
  id: string,
  luxembourgish: string,
  russian: string,
  lodId: string,
  sentenceLux: string,
  sentenceRu: string,
  answer = luxembourgish,
): GeneralVocabularyCard => ({
  id: `general-${id}`,
  luxembourgish,
  russian,
  lodId,
  lodAudioUrl: `https://lod.lu/uploads/AAC/${lodId.toLocaleLowerCase('lb-LU')}.m4a`,
  lodCachedAudioUrl: `./audio/lod/${lodId.toLocaleLowerCase('lb-LU')}.m4a`,
  sentenceLux,
  sentenceRu,
  answer,
})

// Personal additions. Spelling, meanings, article IDs and AAC URLs are verified with LOD.lu.
export const generalVocabulary: GeneralVocabularyCard[] = [
  lodWord('bestuet', 'bestuet', 'женатый; замужняя', 'BESTUET1',
    'Meng Eltere si bestuet.', 'Мои родители женаты.'),
  lodWord('bestellen', 'bestellen', 'заказывать', 'BESTELLEN1',
    'Ech wëll eng Pizza bestellen.', 'Я хочу заказать пиццу.'),
  lodWord('kaschten', 'kaschten', 'стоить', 'KASCHTEN2',
    'D’Ticketen kaschten zéng Euro.', 'Билеты стоят десять евро.'),
  lodWord('seier', 'séier', 'быстро; быстрый', 'SEIER1',
    'Dat geet séier an ass net komplizéiert.', 'Это делается быстро и несложно.'),
  lodWord('kreien', 'kréien', 'получать; доставать', 'KREIEN2',
    'Wou kréien ech e Bus?', 'Где мне найти автобус?'),
  lodWord('muer', 'muer', 'завтра', 'MUER1',
    'Muer hunn ech Zäit.', 'Завтра у меня есть время.'),
  lodWord('haut', 'haut', 'сегодня', 'HAUT1',
    'Haut hunn ech Zäit.', 'Сегодня у меня есть время.'),
  lodWord('geschter', 'gëschter', 'вчера', 'GESCHTER1',
    'Gëschter hat ech keng Zäit.', 'Вчера у меня не было времени.'),
  lodWord('bal', 'bal', 'почти', 'BAL2',
    'De Bus ass bal do.', 'Автобус уже почти здесь.'),
  lodWord('duerno', 'duerno', 'потом; после этого', 'DUERNO1',
    'Duerno ginn ech heem.', 'После этого я иду домой.'),
  lodWord('riichtaus', 'riichtaus', 'прямо', 'RIICHTAUS1',
    'Fuert wannechgelift riichtaus.', 'Пожалуйста, езжайте прямо.'),
]
