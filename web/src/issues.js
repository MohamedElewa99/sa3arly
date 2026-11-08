// "اتأكد من دول": the faults owners of each model report most, as checks to do before buying.
// issuesFor(make, model) -> [[id, title, how], ...] for that model, else that make's usual weak spots, else null.
import { logoFor } from './brands.js';

const I = (id, title, how) => [id, title, how];

// shared checks, reused below
const CVT = I('cvt', 'فتيس CVT', 'سوق 15 دقيقة لحد ما يسخن: زنة عالية، رعشة وهو بيقوم، أو إن العربية "تفرّم" من غير ما تسحب علامة.');
const DCT = I('dct', 'فتيس الدبل كلتش (DCT)', 'جرّبه في الزحمة: تقف وتتحرك كذا مرة. رعشة أو خبطة في الأول والتاني أو لمبة عطل الفتيس علامة.');
const DSG = I('dsg', 'فتيس DSG', 'في الزحمة ومن الوقفة: أي رعشة أو تأخير أو خبطة في الغيار الأول والتاني. اسأل على تغيير الميكاترونيك أو الديسكات.');
const AT4 = I('at', 'الفتيس الأوتوماتيك', 'بعد ما يسخن: النقلات لازم تبقى ناعمة. تأخير في النقل لـ D أو R، أو العداد يعلى من غير سحب، علامة.');
const AT_EU = I('at', 'الفتيس الأوتوماتيك (AL4 / DP0)', 'فتيس معروف بمشاكله: جرّبه سخن، أي خبطة في النقل أو لمبة عطل أو دخوله "وضع الطوارئ" ويفضل على غيار واحد علامة.');
const STEER = I('steer', 'عمود الدريكسيون', 'لف الدريكسيون يمين وشمال وانت واقف وماشي ببطء: طقطقة أو تخبيط تحت التابلوه معروفة في الموديل ده.');
const AC = I('ac', 'التكييف', 'شغّله على أقل درجة 10 دقايق في الحر: لازم يفضل ساقع وثابت، والكمبروسر مايعملش صوت.');
const SUSP = I('susp', 'العفشة', 'امشي على مطبات بالراحة واسمع أي خبط أو زيقة من قدام، وبص على المساعدين لو فيهم تسريب زيت.');
const MOUNTS = I('mounts', 'كراسي الموتور', 'اقف على D ودوس فرامل: رعشة جامدة في الدريكسيون والكراسي، أو خبطة وانت بتنقل لـ R، معناها كراسي.');
const COOL = I('cool', 'التبريد (طرمبة المية والثرموستات)', 'بص تحت الموتور على تسريب أو بقع، واتأكد إن خزان المية مليان وإن الحرارة ثابتة في النص.');
const CHAIN = I('chain', 'جنزير الكاتينة', 'شغّلها وهي باردة: شخشخة أو صوت جنزير أول ثانيتين علامة إن الكاتينة مطوّلة.');
const BELT = I('belt', 'سير الكاتينة', 'اسأل امتى اتغير آخر مرة وبالفاتورة. لو مش معروف احسب تغييره فوق السعر.');
const OIL = I('oil', 'تسريب واستهلاك الزيت', 'بص على وش السلندر وتحت الموتور، واسأل كل قد إيه بيزوّد زيت.');
const RUST = I('rust', 'الصدا والشاسيه', 'بص تحت الأبواب وتحت الشنطة وجوه الرفارف على صدا أو لحام.');
const ELEC = I('elec', 'الكهربا والشاشة', 'جرّب الشاشة والكاميرا والحساسات والزجاج والمرايات الكهربا كلها، وشوف لو فيه لمبات عطل في التابلوه.');
const TURBO = I('turbo', 'التيربو', 'دوس بنزين للآخر وهو سخن: لازم يسحب بقوة من غير صفارة عالية أو دخان أزرق من الشكمان.');
const DIESEL = I('inj', 'البخاخات والطلمبة (ديزل)', 'شغّلها باردة: دخان كتير أو تقطيع أو صعوبة في الدوران علامة بخاخات.');

// by brand logo slug, then model (lowercase, letters and digits only; "elantra" also covers "elantra hd", "elantra ad"…)
const DATA = {
  hyundai: {
    _: [STEER, AT4, AC, SUSP],
    elantra: [STEER, AT4, I('knock', 'صوت الموتور', 'اسمع الموتور وهو بارد: تكتكة أو خبط من تحت معروف في بعض موتورات 1.6.'), AC, SUSP],
    accent: [STEER, AT4, AC, SUSP],
    verna: [AT4, AC, SUSP, RUST],
    i10: [AT4, AC, SUSP],
    tucson: [DCT, TURBO, ELEC, SUSP],
    creta: [AT4, AC, SUSP],
    santafe: [AT4, TURBO, SUSP, ELEC],
    i20: [AT4, AC, SUSP]
  },
  kia: {
    _: [STEER, AT4, AC, SUSP],
    cerato: [STEER, AT4, AC, SUSP],
    sportage: [DCT, AT4, ELEC, SUSP],
    rio: [AT4, AC, SUSP],
    picanto: [AT4, AC, SUSP],
    sorento: [AT4, TURBO, SUSP, ELEC],
    pegas: [AT4, AC, SUSP],
    seltos: [CVT, AC, SUSP]
  },
  nissan: {
    _: [CVT, MOUNTS, AC, SUSP],
    sunny: [AT4, MOUNTS, AC, SUSP],
    sentra: [CVT, MOUNTS, AC, SUSP],
    qashqai: [CVT, SUSP, ELEC, AC],
    juke: [CVT, TURBO, SUSP],
    xtrail: [CVT, SUSP, ELEC],
    tiida: [CVT, MOUNTS, SUSP],
    patrol: [AT4, SUSP, OIL]
  },
  toyota: {
    _: [AT4, COOL, SUSP, AC],
    corolla: [CVT, COOL, OIL, SUSP],
    yaris: [AT4, SUSP, AC],
    fortuner: [DIESEL, SUSP, AT4],
    hilux: [DIESEL, SUSP, RUST],
    landcruiser: [DIESEL, SUSP, OIL],
    rush: [AT4, SUSP, AC],
    camry: [AT4, COOL, SUSP],
    belta: [AT4, SUSP, AC]
  },
  chevrolet: {
    _: [COOL, OIL, AT4, SUSP],
    aveo: [COOL, AT4, BELT, SUSP],
    optra: [COOL, BELT, I('coil', 'البوبينة والبواجي', 'لو الموتور بيرعش وهو واقف أو بيقطّع في السحب، غالباً بوبينة.'), AT4],
    lanos: [COOL, BELT, RUST, SUSP],
    cruze: [COOL, OIL, I('pcv', 'غطا البلوف وصمام PCV', 'صفارة من الموتور أو تسريب زيت من غطا البلوف مشهور في الكروز.'), AT4],
    captiva: [AT4, OIL, SUSP, ELEC],
    spark: [AT4, SUSP, AC]
  },
  mitsubishi: {
    _: [CVT, SUSP, AC],
    lancer: [CVT, SUSP, AC, MOUNTS],
    eclipsecross: [CVT, TURBO, ELEC],
    xpander: [AT4, SUSP, AC],
    pajero: [DIESEL, AT4, SUSP],
    attrage: [CVT, AC, SUSP],
    mirage: [CVT, AC, SUSP]
  },
  renault: {
    _: [AT_EU, MOUNTS, SUSP, ELEC],
    logan: [AT_EU, MOUNTS, SUSP, AC],
    sandero: [AT_EU, MOUNTS, SUSP, AC],
    duster: [AT_EU, SUSP, RUST, AC],
    megane: [AT_EU, SUSP, ELEC],
    fluence: [CVT, SUSP, ELEC],
    kadjar: [DCT, TURBO, ELEC]
  },
  peugeot: {
    _: [AT_EU, SUSP, ELEC],
    '301': [AT_EU, SUSP, AC, MOUNTS],
    '3008': [CHAIN, TURBO, AT4, ELEC],
    '5008': [CHAIN, TURBO, AT4, ELEC],
    '2008': [CHAIN, TURBO, AT4, ELEC],
    '508': [CHAIN, TURBO, AT4, ELEC],
    '408': [AT_EU, SUSP, ELEC],
    '207': [AT_EU, SUSP, ELEC]
  },
  citroen: { _: [AT_EU, SUSP, ELEC] },
  fiat: {
    _: [SUSP, AC, ELEC],
    tipo: [AT4, SUSP, AC, ELEC],
    '128': [RUST, COOL, SUSP],
    '500': [I('dualogic', 'فتيس الدوالوجيك', 'لو أوتوماتيك: تأخير أو تخبيط في النقل أو لمبة عطل، تصليحه غالي.'), SUSP, ELEC]
  },
  skoda: {
    _: [DSG, CHAIN, COOL, OIL],
    octavia: [DSG, CHAIN, COOL, OIL],
    fabia: [DSG, COOL, SUSP],
    kodiaq: [DSG, TURBO, ELEC],
    karoq: [DSG, TURBO, ELEC],
    superb: [DSG, CHAIN, OIL]
  },
  volkswagen: {
    _: [DSG, CHAIN, COOL, OIL],
    passat: [DSG, CHAIN, OIL, COOL],
    golf: [DSG, CHAIN, COOL],
    jetta: [DSG, CHAIN, COOL],
    tiguan: [DSG, CHAIN, OIL, ELEC],
    polo: [DSG, COOL, SUSP]
  },
  seat: { _: [DSG, CHAIN, COOL, OIL], leon: [DSG, CHAIN, COOL, OIL], ibiza: [DSG, COOL, SUSP], ateca: [DSG, TURBO, ELEC] },
  cupra: { _: [DSG, TURBO, COOL, ELEC] },
  audi: { _: [DSG, CHAIN, OIL, ELEC] },
  opel: {
    _: [CHAIN, COOL, OIL, AT4],
    astra: [CHAIN, COOL, OIL, AT4],
    insignia: [AT4, TURBO, ELEC],
    corsa: [AT4, SUSP, ELEC],
    grandland: [AT4, TURBO, ELEC],
    crossland: [AT4, TURBO, ELEC]
  },
  'mercedes-benz': {
    _: [CHAIN, I('7g', 'الفتيس الأوتوماتيك (7G)', 'نقلات خبط أو دخول وضع الطوارئ معروف، غالباً من بلاتينة الفتيس.'), OIL, ELEC, SUSP],
  },
  bmw: {
    _: [CHAIN, OIL, COOL, ELEC],
    '3series': [CHAIN, OIL, COOL, ELEC],
    '5series': [CHAIN, OIL, COOL, ELEC],
    x1: [CHAIN, OIL, COOL],
    x3: [CHAIN, OIL, COOL, ELEC],
    x5: [CHAIN, OIL, COOL, SUSP]
  },
  honda: { _: [AC, CVT, SUSP], civic: [AC, CVT, SUSP], accord: [AC, AT4, SUSP], crv: [CVT, AC, OIL], city: [CVT, AC, SUSP] },
  mazda: { _: [AT4, SUSP, RUST] },
  suzuki: {
    _: [AT4, SUSP, AC],
    swift: [I('amt', 'الفتيس (AMT / أوتوماتيك)', 'اللي فيه فتيس AMT طبيعي ينقل ببطء، بس خبط جامد أو لمبة عطل علامة. جرّبه في الطلوع.'), SUSP, AC],
    dzire: [I('amt', 'الفتيس (AMT / أوتوماتيك)', 'اللي فيه فتيس AMT طبيعي ينقل ببطء، بس خبط جامد أو لمبة عطل علامة.'), SUSP, AC],
    ertiga: [AT4, SUSP, AC],
    ciaz: [AT4, SUSP, AC],
    vitara: [AT4, TURBO, SUSP]
  },
  mg: { _: [ELEC, DCT, CVT, AC], zs: [CVT, ELEC, AC, SUSP], '5': [CVT, ELEC, AC], '6': [DCT, TURBO, ELEC], rx5: [DCT, TURBO, ELEC], hs: [DCT, TURBO, ELEC] },
  chery: { _: [ELEC, CVT, DCT, AC], tiggo: [DCT, TURBO, ELEC, AC], arrizo: [CVT, ELEC, AC, SUSP] },
  geely: { _: [ELEC, AT4, AC, SUSP], emgrand: [AT4, ELEC, AC, SUSP], coolray: [DCT, TURBO, ELEC] },
  byd: { _: [AT4, SUSP, AC, RUST], f3: [AT4, SUSP, AC, RUST] },
  jetour: { _: [DCT, TURBO, ELEC, AC] },
  haval: { _: [DCT, TURBO, ELEC] },
  changan: { _: [DCT, TURBO, ELEC, AC] },
  proton: { _: [AT4, AC, SUSP, ELEC], saga: [AT4, AC, SUSP, ELEC], persona: [CVT, AC, SUSP] },
  jeep: { _: [AT4, ELEC, SUSP, OIL], cherokee: [I('9at', 'فتيس 9 سرعات', 'نقلات متأخرة أو خبط بين التالت والرابع مشهور، اسأل لو اتعمله سوفتوير.'), ELEC, SUSP], grandcherokee: [AT4, ELEC, SUSP, OIL] },
  ford: { _: [I('powershift', 'فتيس باورشيفت', 'لو دبل كلتش: رعشة في القومة وخبط في الزحمة معروفين.'), SUSP, ELEC], focus: [I('powershift', 'فتيس باورشيفت', 'رعشة في القومة وخبط في الزحمة معروفين في الأوتوماتيك.'), SUSP, ELEC], fiesta: [I('powershift', 'فتيس باورشيفت', 'رعشة في القومة وخبط في الزحمة معروفين في الأوتوماتيك.'), SUSP, ELEC] },
  lada: { _: [RUST, COOL, SUSP, ELEC] },
  daewoo: { _: [COOL, BELT, RUST, SUSP] },
  dacia: { _: [MOUNTS, SUSP, RUST] },
  subaru: { _: [CVT, OIL, COOL] },
  isuzu: { _: [DIESEL, SUSP, RUST] },
  volvo: { _: [AT4, ELEC, TURBO] },
  porsche: { _: [OIL, COOL, ELEC] },
  'land-rover': { _: [I('air', 'العفشة الهوا', 'اقفلها وسيبها ساعة: لو نزلت من ناحية أو الكمبروسر شغال كتير، فيه تسريب.'), ELEC, OIL, COOL] },
  lexus: { _: [AT4, SUSP, AC] },
  mini: { _: [CHAIN, OIL, COOL] }
};

const key = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '');

export function issuesFor(make, model) {
  const url = logoFor(make);
  const slug = url ? url.slice(7, -5) : key(make);
  const brand = DATA[slug];
  if (!brand) return null;
  const m = key(model);
  let best = null;
  for (const k of Object.keys(brand)) {
    if (k !== '_' && m.startsWith(k) && (!best || k.length > best.length)) best = k;
  }
  const list = (best && brand[best]) || brand._;
  if (!list) return null;
  // the result screen keeps its own tick list by id: no repeats
  const seen = new Set();
  return list.filter((it) => !seen.has(it[0]) && seen.add(it[0]));
}
