export interface InfoSystem {
  id: string;
  name: string;
  shortName: string;
  tabs: {
    description: boolean;
    instructions: boolean;
    npa: boolean;
    asuz: boolean;
    website: boolean;
    webinars: boolean;
  };
  websiteUrl?: string;
  descriptionContent?: string;
  instructionsContent?: string;
  npaContent?: string;
}

export interface OIV {
  id: string;
  name: string;
  shortName: string;
  systems: InfoSystem[];
}

export const oivList: OIV[] = [
  {
    id: "mingov",
    name: "Министерство государственного управления, информационных технологий и связи Краснодарского края",
    shortName: "МинГосУправления",
    systems: [
      {
        id: "epgu",
        name: "Единый портал государственных услуг",
        shortName: "ЕПГУ",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: true, webinars: true },
        websiteUrl: "https://gosuslugi.ru",
        descriptionContent: "Единый портал государственных и муниципальных услуг (функций) — федеральная государственная информационная система, обеспечивающая предоставление государственных и муниципальных услуг в электронной форме.",
      },
      {
        id: "smev",
        name: "Система межведомственного электронного взаимодействия",
        shortName: "СМЭВ",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: true },
        descriptionContent: "СМЭВ — федеральная государственная информационная система, обеспечивающая информационное взаимодействие информационных систем при предоставлении государственных и муниципальных услуг.",
      },
      {
        id: "gis_jkh",
        name: "Государственная информационная система жилищно-коммунального хозяйства",
        shortName: "ГИС ЖКХ",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: true, webinars: false },
        websiteUrl: "https://dom.gosuslugi.ru",
        descriptionContent: "ГИС ЖКХ — единая федеральная централизованная информационная система, функционирующая на основе программных, технических средств и информационных технологий.",
      },
    ],
  },
  {
    id: "minfin",
    name: "Министерство финансов Краснодарского края",
    shortName: "Минфин",
    systems: [
      {
        id: "asufr",
        name: "Автоматизированная система управления финансами региона",
        shortName: "АСУФР",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: true },
        descriptionContent: "Система автоматизации бюджетного процесса для органов государственной власти и местного самоуправления Краснодарского края.",
      },
      {
        id: "gis_ebs",
        name: "Государственная интегрированная информационная система управления общественными финансами «Электронный бюджет»",
        shortName: "Электронный бюджет",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: true, webinars: true },
        websiteUrl: "https://budget.gov.ru",
        descriptionContent: "Система, обеспечивающая прозрачность, открытость и подотчётность деятельности государственных органов в сфере управления общественными финансами.",
      },
    ],
  },
  {
    id: "minzdrav",
    name: "Министерство здравоохранения Краснодарского края",
    shortName: "Минздрав",
    systems: [
      {
        id: "rmis",
        name: "Региональная медицинская информационная система",
        shortName: "РМИС",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: true },
        descriptionContent: "РМИС — региональная система управления медицинской деятельностью, обеспечивающая автоматизацию рабочих мест медицинских работников.",
      },
      {
        id: "egisz",
        name: "Единая государственная информационная система в сфере здравоохранения",
        shortName: "ЕГИСЗ",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: true, webinars: false },
        websiteUrl: "https://egisz.rosminzdrav.ru",
        descriptionContent: "ЕГИСЗ — комплекс государственных информационных ресурсов и информационных систем в сфере здравоохранения.",
      },
    ],
  },
  {
    id: "minobr",
    name: "Министерство образования, науки и молодёжной политики Краснодарского края",
    shortName: "Минобразования",
    systems: [
      {
        id: "ege_portal",
        name: "Региональный портал ЕГЭ",
        shortName: "Портал ЕГЭ",
        tabs: { description: true, instructions: true, npa: false, asuz: true, website: true, webinars: false },
        websiteUrl: "https://ege23.ru",
      },
      {
        id: "kris",
        name: "Краевая региональная информационная система образования",
        shortName: "КРИСО",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: true },
        descriptionContent: "КРИСО обеспечивает автоматизацию основных процессов управления образованием в Краснодарском крае.",
      },
    ],
  },
  {
    id: "mintrud",
    name: "Министерство труда и социального развития Краснодарского края",
    shortName: "Минтруд",
    systems: [
      {
        id: "egisso",
        name: "Единая государственная информационная система социального обеспечения",
        shortName: "ЕГИССО",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: true, webinars: true },
        websiteUrl: "https://egisso.ru",
        descriptionContent: "ЕГИССО обеспечивает учёт граждан, имеющих право на меры социальной защиты и поддержки.",
      },
      {
        id: "aszn",
        name: "Автоматизированная система органов социальной защиты населения",
        shortName: "АСЗН",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: false },
        descriptionContent: "Региональная система автоматизации деятельности органов социальной защиты населения Краснодарского края.",
      },
    ],
  },
  {
    id: "minkult",
    name: "Министерство культуры Краснодарского края",
    shortName: "Минкультуры",
    systems: [
      {
        id: "ais_museum",
        name: "Автоматизированная информационная система «Музейный фонд»",
        shortName: "АИС Музейный фонд",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: false },
        descriptionContent: "Система учёта и хранения сведений о музейных предметах и музейных коллекциях.",
      },
    ],
  },
  {
    id: "minsport",
    name: "Министерство физической культуры и спорта Краснодарского края",
    shortName: "Минспорта",
    systems: [
      {
        id: "ais_sport",
        name: "Региональная информационно-аналитическая система «Спорт»",
        shortName: "АИС Спорт",
        tabs: { description: true, instructions: true, npa: false, asuz: true, website: false, webinars: false },
        descriptionContent: "Система сбора и анализа данных о физкультурно-спортивных организациях и спортсменах Краснодарского края.",
      },
    ],
  },
  {
    id: "dgi",
    name: "Департамент имущественных отношений Краснодарского края",
    shortName: "ДИО",
    systems: [
      {
        id: "ais_property",
        name: "Автоматизированная информационная система управления государственным имуществом",
        shortName: "АИС ГИМ",
        tabs: { description: true, instructions: true, npa: true, asuz: true, website: false, webinars: true },
        descriptionContent: "Система автоматизации управления и учёта государственного имущества Краснодарского края.",
      },
    ],
  },
];

export const allOivNames: string[] = oivList.map(o => o.name);

export const getSystemById = (systemId: string): { system: InfoSystem; oiv: OIV } | null => {
  for (const oiv of oivList) {
    const system = oiv.systems.find(s => s.id === systemId);
    if (system) return { system, oiv };
  }
  return null;
};
