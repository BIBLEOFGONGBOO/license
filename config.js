/* ============================================================================
   BLOCK 10 START : LICENSE TEMPLATE SERVICE CONFIGURATION
   ========================================================================== */

window.LICENSE_CONFIG = Object.freeze({
  /* PART 1 : EasyLearning License service */
  url: 'https://mlpyhuwrkwdtzpswaqgf.supabase.co',

  publishableKey:
    'sb_publishable_xWmlL2l3-kvdto5b3SMAhw_2z9f6NfQ',

  functionName: 'smooth-worker',

  authStorageKey: 'easylearning_license_auth_v1',

  progressPrefix: 'gongboo.license.',

  /* PART 2 : Default course behavior
     A newly imported course automatically uses these values. */

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

    /* PART 3 : Optional exceptions only.
       Delete an entry when the DEFAULT values are sufficient. */
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

  /* PART 4 : AI Tutor */
  tutor: Object.freeze({
    apiUrl:
      'https://sat-bot-07020143.vercel.app/api/chat'
  }),

  /* PART 5 : Dictionary and Azure fallback */
  dictionary: Object.freeze({
    url: 'https://vejhetvwkjgylglzsxpr.supabase.co',

    publishableKey:
      'sb_publishable_53Lu670zxoCEI90tKbYwsA_EhMYSeCy',

    table: 'dictionary',

    azureFunctionName: 'hyper-worker'
  })
});

/* ============================================================================
   BLOCK 10 END : LICENSE TEMPLATE SERVICE CONFIGURATION
   ========================================================================== */
