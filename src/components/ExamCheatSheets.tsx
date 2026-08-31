import { CalendarDays, Check, Ear, HelpCircle, Link2, MessageSquareMore, Route } from 'lucide-react'

const listeningSteps = [
  ['До записи', 'Прочитайте вопросы, подчеркните имена, числа, даты и отрицания. Предположите тему и тип ожидаемого ответа.'],
  ['Первое прослушивание', 'Слушайте общий смысл. Отмечайте только то, в чём уверены, и не останавливайтесь на одном незнакомом слове.'],
  ['Второе прослушивание', 'Закройте пропуски, отдельно проверьте числа, время, место, отрицание и отношение говорящего.'],
  ['Перед сдачей', 'Сверьте ответ с формулировкой вопроса: кто, где, когда, сколько, почему или верно/неверно.'],
]

const sheets = [
  {
    id: 'listening',
    title: 'Аудирование в два прохода',
    subtitle: 'Не переводить всё, а находить требуемую информацию',
    icon: Ear,
    content: (
      <div className="cheat-timeline">
        {listeningSteps.map(([title, text], index) => (
          <div key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div></div>
        ))}
      </div>
    ),
  },
  {
    id: 'dates',
    title: 'Числа, дни и даты',
    subtitle: 'То, что легко потерять в аудировании',
    icon: CalendarDays,
    content: (
      <div className="cheat-groups">
        <div><strong>Числа</strong><p lang="lb">eent · zwee · dräi · véier · fënnef · sechs · siwen · aacht · néng · zéng</p><p lang="lb">zwanzeg · drësseg · véierzeg · fofzeg · siechzeg · siwwenzeg · achtzeg · nonzeg</p></div>
        <div><strong>Дни недели</strong><p lang="lb">Méindeg · Dënschdeg · Mëttwoch · Donneschdeg · Freideg · Samschdeg · Sonndeg</p></div>
        <div><strong>Дата</strong><p lang="lb">Haut ass Méindeg, den 12. Oktober.</p><small>Сегодня понедельник, 12 октября.</small></div>
        <div><strong>Время</strong><p lang="lb">um aacht Auer · um hallwer aacht · géint néng Auer</p><small>в восемь · в половине восьмого · около девяти</small></div>
      </div>
    ),
  },
  {
    id: 'questions',
    title: 'Вопросительные слова',
    subtitle: 'Сначала определить, какую информацию от Вас ждут',
    icon: HelpCircle,
    content: (
      <div className="cheat-table">
        <span lang="lb">Wien?</span><small>кто?</small>
        <span lang="lb">Wat?</span><small>что?</small>
        <span lang="lb">Wou? / Vu wou?</span><small>где? / откуда?</small>
        <span lang="lb">Wéini?</span><small>когда?</small>
        <span lang="lb">Wéi? / Wéi oft?</span><small>как? / как часто?</small>
        <span lang="lb">Wéi vill?</span><small>сколько?</small>
        <span lang="lb">Firwat?</span><small>почему?</small>
        <span lang="lb">Wat fir ...?</span><small>какой? какого типа?</small>
      </div>
    ),
  },
  {
    id: 'survival',
    title: 'Если нужно выиграть время',
    subtitle: 'Нормальные фразы для паузы, переспроса и уточнения',
    icon: MessageSquareMore,
    content: (
      <div className="cheat-phrase-list">
        <div><span lang="lb">Kënnt Dir d’Fro widderhuelen?</span><small>Можете повторить вопрос?</small></div>
        <div><span lang="lb">Kënnt Dir e bësse méi lues schwätzen?</span><small>Можете говорить немного медленнее?</small></div>
        <div><span lang="lb">Ech hunn d’Fro net ganz verstanen.</span><small>Я не до конца понял вопрос.</small></div>
        <div><span lang="lb">Ee Moment, ech muss kuerz nodenken.</span><small>Одну минуту, мне нужно немного подумать.</small></div>
        <div><span lang="lb">Wann ech richteg verstanen hunn, ...</span><small>Если я правильно понял, ...</small></div>
      </div>
    ),
  },
  {
    id: 'connectors',
    title: 'Связки для длинного ответа',
    subtitle: 'Две-три связки делают ответ естественнее',
    icon: Link2,
    content: (
      <div className="cheat-phrase-list connectors">
        <div><span lang="lb">an · mee · oder</span><small>и · но · или</small></div>
        <div><span lang="lb">well · dofir</span><small>потому что · поэтому</small></div>
        <div><span lang="lb">fir d’éischt · duerno · zum Schluss</span><small>сначала · затем · в конце</small></div>
        <div><span lang="lb">ausserdeem · zum Beispill</span><small>кроме того · например</small></div>
        <div><span lang="lb">menger Meenung no · ech mengen, datt ...</span><small>по моему мнению · я думаю, что ...</small></div>
      </div>
    ),
  },
]

export function ExamCheatSheets({ onCourse }: { onCourse: () => void }) {
  return (
    <main className="screen grammar-screen cheat-sheet-screen">
      <section className="screen-heading grammar-heading">
        <div><p className="kicker">Быстро перед тренировкой</p><h1>Шпаргалки</h1></div>
        <span className="mini-stat"><strong>{sheets.length}</strong><span>разделов</span></span>
      </section>

      <div className="section-switch" role="tablist" aria-label="Раздел грамматики">
        <button type="button" role="tab" aria-selected="false" onClick={onCourse}><Route size={17} /> Курс</button>
        <button type="button" role="tab" aria-selected="true" className="active"><Check size={17} /> Шпаргалки</button>
      </div>

      <p className="cheat-intro">Короткие опоры из «Общих рекомендаций». Они не заменяют уроки: откройте нужную карточку непосредственно перед аудированием или устным ответом.</p>

      <div className="cheat-sheet-list">
        {sheets.map(({ id, title, subtitle, icon: Icon, content }, index) => (
          <details className="cheat-sheet-card" key={id} open={index === 0}>
            <summary>
              <span><Icon size={21} /></span>
              <div><strong>{title}</strong><small>{subtitle}</small></div>
            </summary>
            <div className="cheat-sheet-body">{content}</div>
          </details>
        ))}
      </div>
    </main>
  )
}
