/* ============================================================================
   BLOCK 10 START : LICENSE TEMPLATE SERVICE CONFIGURATION
   ========================================================================== */

window.LICENSE_CONFIG = Object.freeze({
  homeUrl: 'https://gongboo-home.pages.dev/',

  membership: Object.freeze({
    memberStorageKey:
      'gongboo-license-member-id',

    loginUrl:
      'https://gongboo-home.pages.dev/login.html',

    activeProductsUrl:
      'https://gongboo-home.pages.dev/api/member',

    courseProductIds: Object.freeze({
      CNA: '6001',
      CALIFORNIACNA: '6001',

      REALESTATE: '6002',
      CALIFORNIAREALESTATE: '6002',

      INSURANCE: '6003',
      CALIFORNIAINSURANCE: '6003',

      MORTGAGE: '6004',
      MORTGAGELENDING: '6004',
      MORTGAGELENDINGCOMPLIANCE: '6004',
      MORTGAGELENDINGLAW: '6004',

      NOTARY: '6005'
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

    INSURANCE: Object.freeze({
      title: 'INSURANCE',
      displayOrder: 20
    }),

    MORTGAGE: Object.freeze({
      title: 'MORTGAGE',
      displayOrder: 30
    }),

    NOTARY: Object.freeze({
      title: 'NOTARY',
      displayOrder: 40
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
