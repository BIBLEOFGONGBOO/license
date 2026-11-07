/* ============================================================================
   BLOCK 10 START : LICENSE TEMPLATE SERVICE CONFIGURATION
   ========================================================================== */

window.LICENSE_CONFIG = Object.freeze({
  homeUrl: 'https://gongboo-home.pages.dev/',

    membership: Object.freeze({
    memberStorageKey:
      'gongboo-license-member-session',

    loginUrl:
      './login.html',

    activeProductsUrl:
      'https://gongboo-home.pages.dev/api/member',

    courseProductIds: Object.freeze({
      CNA: '6001',
      CALIFORNIACNA: '6001',

      REALESTATE: '6002',
      CALIFORNIAREALESTATE: '6002',

      LIFEANDHEALTH: '6003',
      PROPERTYANDCASUALTY: '6006',

      MORTGAGE: '6004',
      MORTGAGELENDING: '6004',
      MORTGAGELENDINGCOMPLIANCE: '6004',
      MORTGAGELENDINGLAW: '6004',

      NOTARY: '6005',
      PHARMACY: '6007',
      SERIES6: '6008'
    })
  }),
  /* PART 1 : License content service */
  url: 'https://mlpyhuwrkwdtzpswaqgf.supabase.co',

  publishableKey:
    'sb_publishable_xWmlL2l3-kvdto5b3SMAhw_2z9f6NfQ',

  functionName: 'smooth-worker',

  progressPrefix: 'gongboo.license.',

  hiddenCourses: Object.freeze([
    'CALIFORNIAINSURANCE',
    'CALIFORNIAINSURANCELICENSING',
    'LONGTERMCAREINSURANCE',
    'MORTGAGELENDING',
    'MORTGAGELENDINGCOMPLIANCE',
    'MORTGAGELENDINGLAW'
  ]),

  courseSettings: Object.freeze({
    DEFAULT: Object.freeze({
      active: true,
      setSize: 50,
      preloadSets: 1,
      displayOrder: 999
    }),

    REALESTATE: Object.freeze({
      title: 'REAL ESTATE',
      displayOrder: 10
    }),

    LIFE_AND_HEALTH: Object.freeze({
  title: 'INSURANCE · LIFE & HEALTH',
  displayOrder: 20
}),

PROPERTY_AND_CASUALTY: Object.freeze({
  title: 'INSURANCE · PROPERTY & CASUALTY',
  displayOrder: 30
}),

    MORTGAGE: Object.freeze({
      title: 'MORTGAGE',
      displayOrder: 40
    }),

        NOTARY: Object.freeze({
      title: 'NOTARY',
      displayOrder: 50
    }),

    PHARMACY: Object.freeze({
      title: 'PHARMACY TECHNICIAN',
      displayOrder: 60
    }),

    SIE: Object.freeze({
      title: 'SIE · SECURITIES INDUSTRY ESSENTIALS',
      displayOrder: 1000
    }),

    SERIES6: Object.freeze({
      title: 'SERIES 6 · INVESTMENT COMPANY PRODUCTS',
      displayOrder: 1010
    }),

    SERIES63: Object.freeze({
      title: 'SERIES 63 · UNIFORM SECURITIES AGENT STATE LAW',
      displayOrder: 1100
    })
  }),

  tutor: Object.freeze({
    apiUrl:
      'https://sat-bot-07020143.vercel.app/api/chat'
  }),

  dictionary: Object.freeze({
    url: 'https://vejhetvwkjgylglzsxpr.supabase.co',

    publishableKey:
      'sb_publishable_53Lu670zxoCEI90tKbYwsA_EhMYSeCy',

    table: 'dictionary',

    azureFunctionName: 'hyper-worker',

    definitionFunctionName:
      'dictionary-definition-worker'
  })
});

/* ============================================================================
   BLOCK 10 END : LICENSE TEMPLATE SERVICE CONFIGURATION
   ========================================================================== */
