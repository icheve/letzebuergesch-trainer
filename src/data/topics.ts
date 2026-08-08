import type { SentenceItem, Topic, VocabularyCard } from '../types'
import { vocabularyContexts } from './vocabularyContexts'

const sentence = (
  id: string,
  questionLux: string,
  questionRu: string,
  answerLux: string,
  answerRu: string,
  section: SentenceItem['section'] = 'main',
): SentenceItem => ({ id, questionLux, questionRu, answerLux, answerRu, section })

const word = (id: string, luxembourgish: string, russian: string, lodId: string): VocabularyCard => ({
  id,
  luxembourgish,
  russian,
  lodId,
  lodAudioUrl: `https://lod.lu/uploads/AAC/${lodId.toLocaleLowerCase('lb-LU')}.m4a`,
})

const homeland: Topic = {
  id: 'homeland',
  titleLux: 'Mäin Heemechtsland',
  titleRu: 'Моя родина',
  eyebrow: 'Russland · Moskau · Sankt Petersburg',
  color: 'red',
  icon: 'home',
  vocabulary: [
    word('homeland-heemecht', 'd’Heemecht', 'родина', 'HEEMECHT1'),
    word('homeland-haaptstad', 'd’Haaptstad', 'столица', 'HAAPTSTAD1'),
    word('homeland-awunner', 'den Awunner', 'житель', 'AWUNNER1'),
    word('homeland-tourist', 'den Tourist', 'турист', 'TOURIST1'),
    word('homeland-attraktioun', 'd’Touristenattraktioun', 'туристическая достопримечательность', 'TOURISTENATTRAKTIOUN1'),
    word('homeland-regioun', 'd’Regioun', 'регион', 'REGIOUN1'),
    word('homeland-traditioun', 'd’Traditioun', 'традиция', 'TRADITIOUN1'),
    word('homeland-nationalfeierdag', 'de Nationalfeierdag', 'национальный праздник', 'NATIONALFEIERDAG1'),
    word('homeland-spezialiteit', 'd’Spezialitéit', 'традиционное блюдо; специалитет', 'SPEZIALITEIT1'),
    word('homeland-plage', 'd’Plage', 'пляж', 'PLAGE1'),
    word('homeland-sei', 'de Séi', 'озеро', 'SEI1'),
    word('homeland-secher', 'sécher', 'безопасный', 'SECHER1'),
    word('homeland-besichen', 'besichen', 'посещать', 'BESICHEN1'),
  ],
  sentences: [
    sentence('homeland-01', 'Vu wou kommt Dir?', 'Откуда Вы родом?', 'Ech kommen aus Russland.', 'Я из России.'),
    sentence('homeland-02', 'Wat fir Sprooche schwätzen d’Leit an Ärem Heemechtsland?', 'На каких языках говорят люди в Вашей родной стране?', 'A Russland schwätzen d’Leit Russesch.', 'В России люди говорят по-русски.'),
    sentence('homeland-03', 'Wéi heescht d’Haaptstad? Wéi vill Awunner huet si?', 'Как называется столица? Сколько в ней жителей?', 'D’Haaptstad heescht Moskau. Si huet ongeféier 13 Milliounen Awunner.', 'Столица называется Москва. В ней около 13 миллионов жителей.'),
    sentence('homeland-04', 'Wat ass déi ideal Joreszäit, fir Äert Land ze besichen? Firwat?', 'Какое время года лучше всего подходит для посещения Вашей страны? Почему?', 'Déi ideal Joreszäit ass de Wanter, fir de russesche Wanter an den Ënnerscheed zu anere Länner ze erliewen.', 'Лучшее время года — зима, чтобы увидеть русскую зиму и почувствовать её отличие от других стран.'),
    sentence('homeland-05', 'Aus wat fir Länner kommen déi meescht Touristen?', 'Из каких стран приезжает большинство туристов?', 'Déi meescht Touriste kommen aus China.', 'Большинство туристов приезжает из Китая.'),
    sentence('homeland-06', 'Wat fir interessant Touristenattraktioune ginn et?', 'Какие интересные достопримечательности там есть?', 'D’Rout Plaz zu Moskau ass eng interessant Touristenattraktioun.', 'Красная площадь в Москве — интересная достопримечательность.'),
    sentence('homeland-07', 'Wat fir Regioune sinn attraktiv fir Touristen?', 'Какие регионы привлекательны для туристов?', 'Moskau a Sankt Petersburg si besonnesch attraktiv fir Touristen.', 'Москва и Санкт-Петербург особенно привлекательны для туристов.'),
    sentence('homeland-08', 'Wat fir Traditiounen oder Fester feiert Dir?', 'Какие традиции или праздники Вы отмечаете?', 'Ech feiere Silvester.', 'Я отмечаю Новый год.'),
    sentence('homeland-09', 'Wat fir e Sport ass populär an Ärem Heemechtsland?', 'Какой вид спорта популярен в Вашей родной стране?', 'Fussball ass populär a mengem Heemechtsland.', 'В моей родной стране популярен футбол.'),
    sentence('homeland-10', 'Hutt Dir eng traditionell Musek oder en traditionellt Instrument?', 'Есть ли у вас традиционная музыка или традиционный инструмент?', 'Dat weess ech net.', 'Я этого не знаю.'),
    sentence('homeland-11', 'Wat fir e Plat géift Dir engem Tourist recommandéieren?', 'Какое блюдо Вы посоветовали бы туристу?', 'Ech géif Borschtsch recommandéieren. Dat ass eng Zopp aus roude Rommelen.', 'Я бы посоветовал борщ. Это суп из свёклы.'),
    sentence('homeland-12', 'Kënnt Dir eng flott Plage oder e Séi recommandéieren?', 'Можете ли Вы посоветовать хороший пляж или озеро?', 'Neen, ech kann keng Plage a kee Séi recommandéieren.', 'Нет, я не могу посоветовать ни пляж, ни озеро.'),
    sentence('homeland-13', 'Ass Äert Heemechtsland sécher?', 'Безопасна ли Ваша родная страна?', 'Neen, mäin Heemechtsland ass net sécher.', 'Нет, моя родная страна небезопасна.'),
    sentence('homeland-14', 'Wéini ass Nationalfeierdag?', 'Когда отмечают национальный праздник?', 'Den Nationalfeierdag ass den 12. Juni.', 'Национальный праздник отмечают 12 июня.'),
    sentence('homeland-15', 'Wéi oft gitt Dir an Äert Heemechtsland?', 'Как часто Вы ездите в свою родную страну?', 'Ech war zënter 2022 net méi a mengem Heemechtsland.', 'Я не был в своей родной стране с 2022 года.'),
    sentence('homeland-16', 'Wéini waart Dir fir d’lescht an Ärem Heemechtsland?', 'Когда Вы в последний раз были в своей родной стране?', 'Ech war 2022 fir d’lescht a mengem Heemechtsland.', 'В последний раз я был в своей родной стране в 2022 году.', 'past'),
    sentence('homeland-17', 'Wat hutt Dir do gemaach?', 'Что Вы там делали?', 'Ech hunn do gelieft a geschafft.', 'Я там жил и работал.', 'past'),
    sentence('homeland-18', 'Wéi war Äert Heemechtsland, wéi Dir Kand waart?', 'Какой была Ваша родная страна, когда Вы были ребёнком?', 'Wéi ech Kand war, war et méi kal an et gouf méi Schnéi.', 'Когда я был ребёнком, было холоднее и снега было больше.', 'past'),
    sentence('homeland-19', 'Wat hutt Dir als Kand gär an Ärem Heemechtsland gemaach?', 'Что Вы любили делать в своей родной стране в детстве?', 'Als Kand hunn ech gär Zäit mat menger Famill verbruecht.', 'В детстве я любил проводить время с семьёй.', 'past'),
    sentence('homeland-20', 'Wat gefält Iech am beschten un Ärem Heemechtsland?', 'Что Вам больше всего нравится в Вашей родной стране?', 'Mir gefällt d’Natur am beschten. Russland ass ganz grouss an huet vill verschidde Landschaften.', 'Больше всего мне нравится природа. Россия очень большая, и в ней много разных ландшафтов.', 'followup'),
    sentence('homeland-21', 'Wat gefält Iech manner gutt?', 'Что Вам нравится меньше?', 'De Wanter ass dacks ganz laang a kal. Dat gefällt mir manner gutt.', 'Зима часто очень долгая и холодная. Это мне нравится меньше.', 'followup'),
    sentence('homeland-22', 'Wou géift Dir engem Tourist recommandéieren hinzegoen?', 'Куда Вы посоветовали бы поехать туристу?', 'Ech géif engem Tourist Sankt Petersburg oder de Baikalséi recommandéieren.', 'Я бы посоветовал туристу Санкт-Петербург или озеро Байкал.', 'followup'),
    sentence('homeland-23', 'Wat ass typesch fir Äert Land?', 'Что характерно для Вашей страны?', 'Laang Distanzen a kal Wantere sinn typesch fir mäin Heemechtsland.', 'Для моей родной страны характерны большие расстояния и холодные зимы.', 'followup'),
    sentence('homeland-24', 'Wat vermësst Dir aus Ärem Heemechtsland?', 'По чему из родной страны Вы скучаете?', 'Ech vermësse meng Famill, meng Frënn an e puer traditionell Platen.', 'Я скучаю по семье, друзьям и некоторым традиционным блюдам.', 'followup'),
    sentence('homeland-25', 'Wat ass den Ënnerscheed tëscht Lëtzebuerg an Ärem Heemechtsland?', 'В чём разница между Люксембургом и Вашей родной страной?', 'Russland ass vill méi grouss wéi Lëtzebuerg. D’Distanze si méi laang an d’Wantere si méi kal. Lëtzebuerg ass méi kleng a méi international.', 'Россия намного больше Люксембурга. Расстояния длиннее, а зимы холоднее. Люксембург меньше и более интернациональный.', 'followup'),
    sentence('homeland-26', 'Gëtt et vill Tourismus an Ärem Land?', 'Много ли туристов в Вашей стране?', 'Neen, et gëtt net vill Tourismus a mengem Land.', 'Нет, в моей стране туризм развит не очень сильно.', 'followup'),
    sentence('homeland-27', 'Wat fir Iessen ass typesch?', 'Какая еда является типичной?', 'Borschtsch, Pelmeni a Blini sinn typesch russesch Platen.', 'Борщ, пельмени и блины — типичные русские блюда.', 'followup'),
  ],
}

const languages: Topic = {
  id: 'languages',
  titleLux: 'Sproochen',
  titleRu: 'Языки',
  eyebrow: 'Komplett personaliséiert',
  color: 'blue',
  icon: 'languages',
  vocabulary: [
    word('languages-sprooch', 'd’Sprooch', 'язык', 'SPROOCH1'),
    word('languages-mammesprooch', 'd’Mammesprooch', 'родной язык', 'MAMMESPROOCH1'),
    word('languages-friemsprooch', 'd’Friemsprooch', 'иностранный язык', 'FRIEMSPROOCH1'),
    word('languages-schwatzen', 'schwätzen', 'говорить', 'SCHWATZEN1'),
    word('languages-leieren', 'léieren', 'учить; изучать', 'LEIEREN2'),
    word('languages-aussprooch', 'd’Aussprooch', 'произношение', 'AUSSPROOCH1'),
    word('languages-grammatik', 'd’Grammatik', 'грамматика', 'GRAMMATIK1'),
    word('languages-vocabulaire', 'de Vocabulaire', 'словарный запас', 'VOCABULAIRE1'),
    word('languages-liesen', 'liesen', 'читать', 'LIESEN1'),
    word('languages-lauschteren', 'lauschteren', 'слушать', 'LAUSCHTEREN1'),
    word('languages-schreiwen', 'schreiwen', 'писать', 'SCHREIWEN1'),
    word('languages-verstoen', 'verstoen', 'понимать', 'VERSTOEN1'),
    word('languages-kommunizeieren', 'kommunizéieren', 'общаться', 'KOMMUNIZEIEREN1'),
    word('languages-ueben', 'üben', 'упражняться; практиковаться', 'UBEN1'),
  ],
  sentences: [
    sentence('languages-01', 'Wat ass Är Mammesprooch?', 'Какой Ваш родной язык?', 'Meng Mammesprooch ass Russesch.', 'Мой родной язык — русский.'),
    sentence('languages-02', 'Wéi vill Sprooche schwätzt Dir? Wat fir eng?', 'На скольких языках Вы говорите? На каких?', 'Ech schwätzen dräi Sproochen: Russesch, Englesch an elo och e bësse Lëtzebuergesch.', 'Я говорю на трёх языках: русском, английском, а теперь ещё немного на люксембуржском.'),
    sentence('languages-03', 'Wat fir Sproochen hutt Dir an der Schoul geléiert?', 'Какие языки Вы учили в школе?', 'An der Schoul hunn ech Englesch, Russesch an Däitsch geléiert.', 'В школе я учил английский, русский и немецкий.'),
    sentence('languages-04', 'Wat fir eng Sprooch schwätzt Dir doheem?', 'На каком языке Вы говорите дома?', 'Doheem schwätzen ech Russesch.', 'Дома я говорю по-русски.'),
    sentence('languages-05', 'Wat fir eng Sprooch schwätzt Dir mat Ärem Partner?', 'На каком языке Вы говорите со своим партнёром?', 'Mat mengem Partner schwätzen ech och Russesch.', 'Со своим партнёром я тоже говорю по-русски.'),
    sentence('languages-06', 'Wat fir eng Sprooch schwätzt Dir mat Äre Kanner?', 'На каком языке Вы говорите со своими детьми?', 'Ech hu keng Kanner.', 'У меня нет детей.'),
    sentence('languages-07', 'Wat fir eng Sprooch schwätzt Dir op der Aarbecht?', 'На каком языке Вы говорите на работе?', 'Op der Aarbecht schwätzen ech Englesch.', 'На работе я говорю по-английски.'),
    sentence('languages-08', 'Firwat léiert Dir Lëtzebuergesch?', 'Почему Вы учите люксембуржский?', 'Ech léiere Lëtzebuergesch, fir mech besser hei z’integréieren an un d’Liewen zu Lëtzebuerg unzepassen.', 'Я учу люксембуржский, чтобы лучше интегрироваться и адаптироваться к жизни в Люксембурге.'),
    sentence('languages-09', 'Wou léiert Dir Lëtzebuergesch?', 'Где Вы учите люксембуржский?', 'Ech hunn bei Educate Me ugefaangen, an elo maachen ech intensiv Online-Coursen.', 'Я начал в Educate Me, а сейчас прохожу интенсивные онлайн-курсы.'),
    sentence('languages-10', 'Wéi laang léiert Dir schonn Lëtzebuergesch?', 'Как долго Вы уже учите люксембуржский?', 'Ech léiere Lëtzebuergesch zënter aacht Méint.', 'Я учу люксембуржский уже восемь месяцев.'),
    sentence('languages-11', 'Ass Lëtzebuergesch eng schwéier Sprooch?', 'Люксембуржский — сложный язык?', 'Neen, fir mech ass Lëtzebuergesch net esou schwéier, well ech schonn Däitsch geléiert hunn an déi zwou Sprooche sech änlech sinn.', 'Нет, для меня люксембуржский не такой сложный, потому что я уже учил немецкий и эти два языка похожи.'),
    sentence('languages-12', 'Wat ass fir Iech am schwéiersten?', 'Что для Вас сложнее всего?', 'D’Ausnamen an d’Reegelen am Lëtzebuergesche si fir mech am schwéiersten.', 'Исключения и правила люксембуржского языка для меня сложнее всего.'),
    sentence('languages-13', 'Wat ass fir Iech am einfachsten?', 'Что для Вас проще всего?', 'D’Liesen ass fir mech am einfachsten.', 'Чтение для меня проще всего.'),
    sentence('languages-14', 'Wéi übt Dir Lëtzebuergesch?', 'Как Вы практикуете люксембуржский?', 'Ech maachen Online-Coursen, lauschteren RTL Radio an de Podcast vum INL.', 'Я занимаюсь на онлайн-курсах, слушаю радио RTL и подкаст INL.'),
    sentence('languages-15', 'Firwat si Friemsprooche wichteg?', 'Почему иностранные языки важны?', 'Friemsprooche sinn wichteg, well se eis hëllefen, eis besser an aner Kulturen z’integréieren a mat méi Leit ze kommunizéieren.', 'Иностранные языки важны, потому что помогают лучше интегрироваться в другие культуры и общаться с большим числом людей.'),
    sentence('languages-16', 'Wat fir eng Sprooch hutt Dir als Kand geschwat?', 'На каком языке Вы говорили в детстве?', 'Als Kand hunn ech Russesch geschwat.', 'В детстве я говорил по-русски.', 'past'),
    sentence('languages-17', 'Hutt Dir gär Sprooche geléiert, wéi Dir jonk waart?', 'Любили ли Вы учить языки, когда были моложе?', 'Jo, ech hunn als Kand gär Englesch geléiert.', 'Да, в детстве я любил учить английский.', 'past'),
    sentence('languages-18', 'Wéi hutt Dir Englesch geléiert?', 'Как Вы учили английский?', 'Ech hunn Englesch an der Schoul geléiert. Ausserdeem hunn ech Filmer op Englesch gekuckt an englesch Musek gelauschtert.', 'Я учил английский в школе. Кроме того, я смотрел фильмы на английском и слушал английскую музыку.', 'past'),
    sentence('languages-19', 'Wéini hutt Dir ugefaangen, Lëtzebuergesch ze léieren?', 'Когда Вы начали учить люксембуржский?', 'Ech hu virun aacht Méint ugefaangen, Lëtzebuergesch ze léieren.', 'Я начал учить люксембуржский восемь месяцев назад.', 'past'),
    sentence('languages-20', 'Wat war Är éischt Erfarung mam Lëtzebuergeschen?', 'Каким был Ваш первый опыт с люксембуржским языком?', 'Meng éischt Erfarung mam Lëtzebuergesche war am Fitnessstudio, wou ech Leit héieren hunn, Lëtzebuergesch ze schwätzen.', 'Мой первый опыт с люксембуржским был в спортзале, где я услышал, как люди говорят по-люксембуржски.', 'past'),
    sentence('languages-21', 'Wat ass Är Liiblingssprooch? Firwat?', 'Какой Ваш любимый язык? Почему?', 'Englesch ass meng Liiblingssprooch, well ech se dacks op der Aarbecht an am Alldag benotzen.', 'Английский — мой любимый язык, потому что я часто использую его на работе и в повседневной жизни.', 'followup'),
    sentence('languages-22', 'Wat fir eng Sprooch géift Dir gär nach léieren?', 'Какой язык Вы ещё хотели бы выучить?', 'Ech géif gär nach Franséisch léieren.', 'Я хотел бы ещё выучить французский.', 'followup'),
    sentence('languages-23', 'Wéi léiert Dir nei Wierder?', 'Как Вы учите новые слова?', 'Ech léieren nei Wierder mat der LOD-App an notéieren se an engem Vokabelheft.', 'Я учу новые слова с приложением LOD и записываю их в тетрадь.', 'followup'),
    sentence('languages-24', 'Kuckt Dir Filmer oder Serien op Lëtzebuergesch?', 'Смотрите ли Вы фильмы или сериалы на люксембуржском?', 'Jo, ech hunn ugefaangen, d’Serie „Capitani“ op Lëtzebuergesch ze kucken.', 'Да, я начал смотреть сериал «Капитани» на люксембуржском.', 'followup'),
    sentence('languages-25', 'Lauschtert Dir Lëtzebuerger Radio?', 'Слушаете ли Вы люксембургское радио?', 'Jo, ech lauschtere reegelméisseg RTL Lëtzebuerg.', 'Да, я регулярно слушаю RTL Lëtzebuerg.', 'followup'),
    sentence('languages-26', 'Ass Englesch hautdesdaags wichteg? Firwat?', 'Важен ли английский в наше время? Почему?', 'Jo, Englesch ass hautdesdaags ganz wichteg, well et eng international Sprooch ass a vill Leit se schwätzen.', 'Да, английский сегодня очень важен, потому что это международный язык и на нём говорит много людей.', 'followup'),
    sentence('languages-27', 'Wat sinn d’Virdeeler vun der Méisproochegkeet?', 'Каковы преимущества многоязычия?', 'D’Virdeeler sinn, datt een sech besser integréiere kann, méi Kulturen entdeckt a mat méi Leit schwätze kann.', 'Преимущества в том, что можно лучше интегрироваться, знакомиться с разными культурами и общаться с большим числом людей.', 'followup'),
    sentence('languages-28', 'Wat fir eng Sprooch ass am schwéierste fir Iech?', 'Какой язык для Вас самый сложный?', 'Fir mech ass Franséisch de Moment déi schwéierst Sprooch.', 'Сейчас французский для меня самый сложный язык.', 'followup'),
  ],
}

const housing: Topic = {
  id: 'housing',
  titleLux: 'Mäi Wunnuert / Wunnen',
  titleRu: 'Место жительства',
  eyebrow: 'Bouneweg · Lëtzebuerg',
  color: 'gold',
  icon: 'housing',
  vocabulary: [
    word('housing-wunneng', 'd’Wunneng', 'квартира', 'WUNNENG1'),
    word('housing-haus', 'd’Haus', 'дом', 'HAUS1'),
    word('housing-quartier', 'de Quartier', 'район', 'QUARTIER1'),
    word('housing-strooss', 'd’Strooss', 'улица', 'STROOSS1'),
    word('housing-stuff', 'd’Stuff', 'гостиная', 'STUFF1'),
    word('housing-schlofkummer', 'd’Schlofkummer', 'спальня', 'SCHLOFKUMMER1'),
    word('housing-terrass', 'd’Terrass', 'терраса', 'TERRASS1'),
    word('housing-gaart', 'de Gaart', 'сад', 'GAART1'),
    word('housing-garage', 'd’Garage', 'гараж', 'GARAGE1'),
    word('housing-secher', 'sécher', 'безопасный', 'SECHER1'),
    word('housing-roueg', 'roueg', 'тихий; спокойный', 'ROUEG1'),
    word('housing-praktesch', 'praktesch', 'практичный; удобный', 'PRAKTESCH1'),
  ],
  sentences: [
    sentence('housing-01', 'Wou wunnt Dir? Säit wéini?', 'Где Вы живёте? С какого времени?', 'Ech wunnen zënter 2022 zu Bouneweg an der Stad Lëtzebuerg.', 'Я живу в Бонневуа, в городе Люксембурге, с 2022 года.'),
    sentence('housing-02', 'Wou hutt Dir virdru gewunnt?', 'Где Вы жили раньше?', 'Ech hunn virdrun zu Jekaterinburg a Russland gewunnt.', 'Раньше я жил в Екатеринбурге, в России.'),
    sentence('housing-03', 'Beschreift Är Wunneng.', 'Опишите свою квартиру.', 'Meng Wunneng ass um drëtte Stack. Si huet eng Schlofkummer an eng grouss Stuff.', 'Моя квартира находится на третьем этаже. В ней одна спальня и большая гостиная.'),
    sentence('housing-04', 'Wat ass déi dominant Faarf an Ärer Wunneng?', 'Какой цвет преобладает в Вашей квартире?', 'Déi dominant Faarf a menger Wunneng ass wäiss.', 'Преобладающий цвет в моей квартире — белый.'),
    sentence('housing-05', 'Wou verbréngt Dir vill Zäit doheem? Firwat?', 'Где дома Вы проводите много времени? Почему?', 'Ech verbréngen vill Zäit an der Stuff, well ech meeschtens vun doheem schaffen a meng Aarbechtsplaz do ass.', 'Я провожу много времени в гостиной, потому что в основном работаю из дома и там находится моё рабочее место.'),
    sentence('housing-06', 'Ass et einfach, eng Parkplaz an Ärer Strooss ze fannen?', 'Легко ли найти парковочное место на Вашей улице?', 'Jo, owes ass et einfach, eng Parkplaz a menger Strooss ze fannen.', 'Да, вечером на моей улице легко найти парковочное место.'),
    sentence('housing-07', 'Ass Äre Quartier geféierlech oder sécher?', 'Ваш район опасный или безопасный?', 'Mäi Quartier ass éischter geféierlech, well en no bei der Haaptgare läit.', 'Мой район скорее опасный, потому что он находится рядом с центральным вокзалом.'),
    sentence('housing-08', 'Gëtt et vill Trafic an Ärem Quartier?', 'Много ли машин в Вашем районе?', 'Jo, et gëtt vill Trafic a mengem Quartier.', 'Да, в моём районе оживлённое движение.'),
    sentence('housing-09', 'Wat fir Butteker ginn et an Ärer Géigend?', 'Какие магазины есть поблизости?', 'A menger Géigend gëtt et en Delhaize-Supermarché.', 'Рядом со мной есть супермаркет Delhaize.'),
    sentence('housing-10', 'Kënnt Dir e Café oder Restaurant recommandéieren?', 'Можете ли Вы посоветовать кафе или ресторан?', 'Jo, ech kann de Restaurant Lucky Star of China recommandéieren.', 'Да, я могу посоветовать ресторан Lucky Star of China.'),
    sentence('housing-11', 'Kennt Dir Är Noperen? Wéi si si?', 'Вы знаете своих соседей? Какие они?', 'Ech kennen déi meescht Noperen net, mee e puer vun hinne si léif Leit.', 'Я не знаю большинство соседей, но некоторые из них приятные люди.'),
    sentence('housing-12', 'Wunnt Dir léiwer an enger Stad oder an engem Duerf? Firwat?', 'Вы предпочитаете жить в городе или в деревне? Почему?', 'Ech wunnen léiwer an der Stad, well alles einfach z’erreechen ass, de Wee op d’Aarbecht méi kuerz ass an den ëffentlechen Transport praktesch ass.', 'Я предпочитаю жить в городе, потому что до всего легко добраться, дорога на работу короче, а общественный транспорт удобен.'),
    sentence('housing-13', 'Wéi laang wunnt Dir schonn do?', 'Как долго Вы уже там живёте?', 'Ech wunnen zënter véier Joer do.', 'Я живу там уже четыре года.', 'followup'),
    sentence('housing-14', 'Wat gefält Iech am beschten un Ärem Quartier?', 'Что Вам больше всего нравится в Вашем районе?', 'Mir gefält am beschten, datt mäi Quartier no bei menger Aarbecht, mengen Hobbyen an dem Stadzentrum ass.', 'Больше всего мне нравится, что мой район находится рядом с работой, моими увлечениями и центром города.', 'followup'),
    sentence('housing-15', 'Wat gefält Iech net esou gutt?', 'Что Вам нравится не так сильно?', 'Am Summer gëtt meng Wunneng heiansdo ze waarm. Dat gefällt mir net esou gutt.', 'Летом в моей квартире иногда становится слишком жарко. Это мне не очень нравится.', 'followup'),
    sentence('housing-16', 'Wou hutt Dir virdru gewunnt?', 'Где Вы жили раньше?', 'Ech hunn virdrun a Russland gewunnt.', 'Раньше я жил в России.', 'followup'),
    sentence('housing-17', 'Wéi war Är éischt Wunneng zu Lëtzebuerg?', 'Какой была Ваша первая квартира в Люксембурге?', 'Meng éischt Wunneng zu Lëtzebuerg war net ganz grouss an net esou bequem.', 'Моя первая квартира в Люксембурге была не очень большой и не такой удобной.', 'followup'),
    sentence('housing-18', 'Wou verbréngt Dir am léifsten Zäit doheem?', 'Где дома Вы больше всего любите проводить время?', 'Am léifste verbréngen ech Zäit an der Stuff. Do kann ech mech entspanen, Filmer kucken oder liesen.', 'Больше всего я люблю проводить время в гостиной. Там я могу отдохнуть, посмотреть фильмы или почитать.', 'followup'),
  ],
}

export const topics: Topic[] = [homeland, languages, housing]

export const allVocabulary = topics.flatMap((topic) =>
  topic.vocabulary.map((card) => ({
    ...card,
    ...vocabularyContexts[card.id],
    topicId: topic.id,
    topicTitle: topic.titleRu,
  })),
)

export const verifiedSentences = topics.flatMap((topic) =>
  topic.sentences.map((item) => ({ ...item, topicId: topic.id, topicTitle: topic.titleRu, kind: 'verified' as const })),
)

export const analogueSentences = [
  {
    ...sentence('analogue-homeland-01', 'Vu wou kommt Dir?', 'Откуда Вы родом?', 'Ech kommen aus Russland, mee ech wunnen elo zu Lëtzebuerg.', 'Я из России, но сейчас живу в Люксембурге.'),
    topicId: 'homeland', topicTitle: 'Моя родина', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-homeland-02', 'Wéi heescht d’Haaptstad?', 'Как называется столица?', 'Moskau ass d’Haaptstad vu Russland.', 'Москва — столица России.'),
    topicId: 'homeland', topicTitle: 'Моя родина', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-homeland-03', 'Wat géift Dir engem Tourist recommandéieren?', 'Что Вы посоветовали бы туристу?', 'Ech géif engem Tourist d’Rout Plaz zu Moskau recommandéieren.', 'Я бы посоветовал туристу Красную площадь в Москве.'),
    topicId: 'homeland', topicTitle: 'Моя родина', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-homeland-04', 'Wat ass typesch fir Äert Land?', 'Что характерно для Вашей страны?', 'A Russland gëtt et vill verschidde Landschaften.', 'В России много разных ландшафтов.'),
    topicId: 'homeland', topicTitle: 'Моя родина', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-homeland-05', 'Wéi ass de Wanter an Ärem Land?', 'Какая зима в Вашей стране?', 'Am Wanter ass et dacks ganz kal.', 'Зимой часто бывает очень холодно.'),
    topicId: 'homeland', topicTitle: 'Моя родина', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-homeland-06', 'Wat vermësst Dir?', 'По чему Вы скучаете?', 'Ech vermësse virun allem meng Famill a meng Frënn.', 'Больше всего я скучаю по семье и друзьям.'),
    topicId: 'homeland', topicTitle: 'Моя родина', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-languages-01', 'Wat fir eng Sprooch schwätzt Dir doheem an op der Aarbecht?', 'На каком языке Вы говорите дома и на работе?', 'Doheem schwätzen ech Russesch, an op der Aarbecht schwätzen ech Englesch.', 'Дома я говорю по-русски, а на работе — по-английски.'),
    topicId: 'languages', topicTitle: 'Языки', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-languages-02', 'Wéi übt Dir Lëtzebuergesch?', 'Как Вы практикуете люксембуржский?', 'Ech üben all Dag e bëssen Lëtzebuergesch.', 'Я каждый день немного практикую люксембуржский.'),
    topicId: 'languages', topicTitle: 'Языки', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-languages-03', 'Wat ass fir Iech schwéier?', 'Что для Вас сложно?', 'D’Aussprooch ass fir mech méi schwéier wéi d’Liesen.', 'Произношение для меня сложнее чтения.'),
    topicId: 'languages', topicTitle: 'Языки', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-languages-04', 'Lauschtert Dir Lëtzebuerger Radio?', 'Слушаете ли Вы люксембургское радио?', 'Ech lauschtere gär Lëtzebuerger Radio.', 'Я люблю слушать люксембургское радио.'),
    topicId: 'languages', topicTitle: 'Языки', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-languages-05', 'Wéi léiert Dir nei Wierder?', 'Как Вы учите новые слова?', 'Ech notéieren nei Wierder an engem Vokabelheft.', 'Я записываю новые слова в словарную тетрадь.'),
    topicId: 'languages', topicTitle: 'Языки', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-languages-06', 'Wat ass Äert Zil?', 'Какова Ваша цель?', 'Ech géif gär méi sécher Lëtzebuergesch schwätzen.', 'Я хотел бы увереннее говорить по-люксембуржски.'),
    topicId: 'languages', topicTitle: 'Языки', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-housing-01', 'Wou ass Är Wunneng?', 'Где находится Ваша квартира?', 'Meng Wunneng läit um drëtte Stack.', 'Моя квартира находится на третьем этаже.'),
    topicId: 'housing', topicTitle: 'Место жительства', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-housing-02', 'Wat gëtt et an Ärem Quartier?', 'Что есть в Вашем районе?', 'A mengem Quartier gëtt et vill Butteker.', 'В моём районе много магазинов.'),
    topicId: 'housing', topicTitle: 'Место жительства', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-housing-03', 'Wéi ass den ëffentlechen Transport?', 'Какой там общественный транспорт?', 'Den ëffentlechen Transport ass praktesch.', 'Общественный транспорт удобный.'),
    topicId: 'housing', topicTitle: 'Место жительства', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-housing-04', 'Ass Är Wunneng no bei Ärer Aarbecht?', 'Ваша квартира находится рядом с работой?', 'Meng Wunneng ass no bei menger Aarbecht.', 'Моя квартира находится рядом с моей работой.'),
    topicId: 'housing', topicTitle: 'Место жительства', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-housing-05', 'Wéi ass Äre Quartier owes?', 'Какой Ваш район вечером?', 'Owes ass mäi Quartier méi roueg.', 'Вечером мой район более спокойный.'),
    topicId: 'housing', topicTitle: 'Место жительства', kind: 'analogue' as const,
  },
  {
    ...sentence('analogue-housing-06', 'Wat maacht Dir gär an der Stuff?', 'Что Вы любите делать в гостиной?', 'An der Stuff kann ech mech entspanen.', 'В гостиной я могу отдохнуть.'),
    topicId: 'housing', topicTitle: 'Место жительства', kind: 'analogue' as const,
  },
]

export const allSentences = [...verifiedSentences, ...analogueSentences]
