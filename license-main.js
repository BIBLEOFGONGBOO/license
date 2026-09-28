// ============================================================================
// PART 1 : LICENSE COMMON RUNTIME
// Source: verified common UI / play / microphone runtime.
// Excluded: Conversation database, language loading, navigation, and Bible links.
// ============================================================================

// ============================================================================
// 🟦 BLOCK 10000: LICENSE RUNTIME INDEPENDENT COMPATIBILITY
// ============================================================================

function getConversationV2SpeakerName(speakerElement) {
  return String(
    speakerElement && speakerElement.textContent || ''
  ).replace(/:\s*$/, '').trim();
}

function getCurrentCategoryNavigationRows() {
  return [];
}
// 🟦 BLOCK 11000: CONVERSATION MENU STATE
// ============================================================================

function getConversationMenus() {
  return [
    {
      buttonId: 'systemMenuButton',
      panelId: 'systemMenuPanel'
    },
    {
      buttonId: 'playMenuButton',
      panelId: 'playMenuPanel'
    },
    {
      buttonId: 'settingsButton',
      panelId: 'settingsPanel'
    }
  ];
}


function closePlayMorePanel() {
  var button =
    document.getElementById(
      'playMoreButton'
    );

  var panel =
    document.getElementById(
      'playMorePanel'
    );

  if (panel) {
    panel.hidden = true;
  }

  if (button) {
    button.setAttribute(
      'aria-expanded',
      'false'
    );
  }
}


function syncPlayButtonWithPlayMenu() {
  var playButton =
    document.getElementById(
      'playButton'
    );

  var playMenuPanel =
    document.getElementById(
      'playMenuPanel'
    );

  if (!playButton || !playMenuPanel) {
    return;
  }

  var menuOpen =
    !playMenuPanel.hidden;

  playButton.disabled = menuOpen;

  playButton.setAttribute(
    'aria-disabled',
    String(menuOpen)
  );
}


// ============================================================================

// 🟦 BLOCK 11100: MENU CLOSE / TOGGLE
// ============================================================================

function closeConversationMenus() {
  getConversationMenus().forEach(
    function(menu) {
      var button =
        document.getElementById(
          menu.buttonId
        );

      var panel =
        document.getElementById(
          menu.panelId
        );

      if (panel) {
        panel.hidden = true;
      }

      if (button) {
        button.setAttribute(
          'aria-expanded',
          'false'
        );
      }
    }
  );

  closePlayMorePanel();
  syncPlayButtonWithPlayMenu();
}


function toggleConversationMenu(
  targetButtonId
) {
  var targetMenu =
    getConversationMenus().find(
      function(menu) {
        return menu.buttonId ===
          targetButtonId;
      }
    );

  if (!targetMenu) {
    return;
  }

  var targetButton =
    document.getElementById(
      targetMenu.buttonId
    );

  var targetPanel =
    document.getElementById(
      targetMenu.panelId
    );

  if (!targetButton || !targetPanel) {
    return;
  }

  var opening =
    targetPanel.hidden;

  closeConversationMenus();

  if (opening) {
    targetPanel.hidden = false;

    targetButton.setAttribute(
      'aria-expanded',
      'true'
    );
  }

  syncPlayButtonWithPlayMenu();
}


// ============================================================================

// 🟦 BLOCK 11200: PLAY MENU VALUE CONTROLS
// ============================================================================

function togglePlayMorePanel() {
  var button =
    document.getElementById(
      'playMoreButton'
    );

  var panel =
    document.getElementById(
      'playMorePanel'
    );

  if (!button || !panel) {
    return;
  }

  var opening = panel.hidden;

  panel.hidden = !opening;

  button.setAttribute(
    'aria-expanded',
    String(opening)
  );
}


function updatePlayRangeValue(
  rangeId,
  outputId,
  suffix
) {
  var range =
    document.getElementById(rangeId);

  var output =
    document.getElementById(outputId);

  if (!range || !output) {
    return;
  }

  output.textContent =
    Number(range.value).toFixed(
      rangeId === 'delayRange'
        ? 1
        : 0
    ) + suffix;
}


// ============================================================================

// 🟦 BLOCK 11300: PLAY MODE TOGGLE
// ============================================================================

function installPlayModeToggle() {
  var button =
    document.getElementById(
      'playModeToggleButton'
    );

  if (!button) {
    return;
  }

  if (!window.CONVERSATION_V2_PLAY_MODE) {
    window.CONVERSATION_V2_PLAY_MODE =
      'computer';
  }

  button.textContent =
    window.CONVERSATION_V2_PLAY_MODE ===
    'i-start'
      ? 'I FIRST'
      : 'COMPUTER';

  button.setAttribute(
    'aria-pressed',
    String(
      window.CONVERSATION_V2_PLAY_MODE ===
        'i-start'
    )
  );

  button.onclick = function() {
    window.CONVERSATION_V2_PLAY_MODE =
      window.CONVERSATION_V2_PLAY_MODE ===
      'computer'
        ? 'i-start'
        : 'computer';

    button.textContent =
      window.CONVERSATION_V2_PLAY_MODE ===
      'i-start'
        ? 'I FIRST'
        : 'COMPUTER';

    button.setAttribute(
      'aria-pressed',
      String(
        window.CONVERSATION_V2_PLAY_MODE ===
          'i-start'
      )
    );
  };
}


// ============================================================================

// 🟦 BLOCK 11400: PLAY DETAIL CONTROLS
// ============================================================================

function installPlayDetails() {
  var moreButton =
    document.getElementById(
      'playMoreButton'
    );

  var autoButton =
    document.getElementById(
      'micAutoToggle'
    );

  if (moreButton) {
    moreButton.onclick = function() {
      togglePlayMorePanel();
    };
  }

  if (autoButton) {
    autoButton.onclick = function() {
      var enabled =
        autoButton.getAttribute(
          'aria-pressed'
        ) !== 'true';

      autoButton.setAttribute(
        'aria-pressed',
        String(enabled)
      );

      window.CONVERSATION_V2_AUTO_PLAY =
        enabled;

      closePlayMorePanel();
    };
  }

  [
    {
      rangeId: 'passRange',
      outputId: 'passValue',
      suffix: '%'
    },
    {
      rangeId: 'delayRange',
      outputId: 'delayValue',
      suffix: 's'
    }
  ].forEach(function(config) {
    var range =
      document.getElementById(
        config.rangeId
      );

    if (!range) {
      return;
    }

    updatePlayRangeValue(
      config.rangeId,
      config.outputId,
      config.suffix
    );

    range.addEventListener(
      'input',
      function() {
        updatePlayRangeValue(
          config.rangeId,
          config.outputId,
          config.suffix
        );
      }
    );

    range.addEventListener(
      'change',
      closePlayMorePanel
    );
  });

  [
    'primaryLanguageSelect',
    'secondaryLanguageSelect',
    'speechSpeedRange'
  ].forEach(function(id) {
    var control =
      document.getElementById(id);

    if (!control) {
      return;
    }

    control.addEventListener(
      'change',
      closePlayMorePanel
    );
  });
}


// ============================================================================

// 🟦 BLOCK 11500: MENU PROTECTION / EVENT INSTALLATION
// ============================================================================

function isCurrentPlayMenuProtectedClick(
  event
) {
  if (!event.target || !event.target.closest) {
    return false;
  }

  return Boolean(
    event.target.closest(
      '#conversationTurns .conversation-turn-card'
    )
  );
}


function installConversationMenus() {
  var menus = getConversationMenus();

  menus.forEach(function(menu) {
    var button =
      document.getElementById(
        menu.buttonId
      );

    if (!button) {
      return;
    }

    button.onclick = function() {
      toggleConversationMenu(
        menu.buttonId
      );
    };
  });

  installPlayModeToggle();
  installPlayDetails();

  var exitButton =
    document.getElementById(
      'playExitButton'
    );

  if (exitButton) {
    exitButton.onclick = function() {
      closeConversationMenus();
    };
  }

  document.addEventListener(
    'click',
    function(event) {
      var clickedMenu = menus.some(
        function(menu) {
          var button =
            document.getElementById(
              menu.buttonId
            );

          var panel =
            document.getElementById(
              menu.panelId
            );

          return (
            (button &&
              button.contains(event.target)) ||
            (panel &&
              panel.contains(event.target))
          );
        }
      );

      if (
        clickedMenu ||
        isCurrentPlayMenuProtectedClick(
          event
        )
      ) {
        return;
      }

      closeConversationMenus();
    }
  );
}


// ============================================================================

// 🟦 BLOCK 11600: MENU BOOTSTRAP
// ============================================================================

function bootConversationMenus() {
  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      installConversationMenus,
      { once: true }
    );

    return;
  }

  installConversationMenus();
}


bootConversationMenus();


// ============================================================================

// 🟦 BLOCK 11700: CURRENT PSG LOOP TOGGLE
// ============================================================================

function renderPlayLoopToggle() {
  var button =
    document.getElementById(
      'playLoopToggle'
    );

  if (!button) {
    return;
  }

  var enabled =
    window.CONVERSATION_V2_LOOP_PLAY ===
    true;

  button.textContent =
    enabled
      ? '↻ ON'
      : '↻ OFF';

  button.setAttribute(
    'aria-pressed',
    String(enabled)
  );
}


function installPlayLoopToggle() {
  var button =
    document.getElementById(
      'playLoopToggle'
    );

  if (!button) {
    return;
  }

  if (
    typeof window.CONVERSATION_V2_LOOP_PLAY !==
    'boolean'
  ) {
    window.CONVERSATION_V2_LOOP_PLAY =
      false;
  }

  renderPlayLoopToggle();

  button.onclick = function() {
    window.CONVERSATION_V2_LOOP_PLAY =
      !window.CONVERSATION_V2_LOOP_PLAY;

    renderPlayLoopToggle();

    closePlayMorePanel();
  };
}


function bootPlayLoopToggle() {
  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      installPlayLoopToggle,
      { once: true }
    );

    return;
  }

  installPlayLoopToggle();
}


bootPlayLoopToggle();


// ============================================================================

// 🟦 BLOCK 11800: JAPANESE / CURRENT SPEECH TEXT
// ============================================================================

function getCurrentJapaneseSpeechText(value) {
  return String(value || '')
    .replace(
      /[\u4E00-\u9FFF々〆〤]+[（(]([^）)]+)[）)]/g,
      '$1'
    )
    .replace(
      /[\u4E00-\u9FFF々〆〤]+/g,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}


function getCurrentPsgSpeechText(
  text,
  language
) {
  if (
    String(language || '')
      .toUpperCase() !== 'JA'
  ) {
    return String(text || '').trim();
  }

  return getCurrentJapaneseSpeechText(
    text
  );
}


// 🟦 BLOCK 11900: VISIBLE SCREEN PLAY SEQUENCE
// ============================================================================

function buildCurrentPsgPlaySequence() {
  var primaryRow =
    window.CONVERSATION_V2_ROW || {};

  var secondaryRow =
    window.CONVERSATION_V2_SECONDARY_ROW || {};

  var primaryLanguage =
    primaryRow.LNG || 'EN';

  var secondaryLanguage =
    secondaryRow.LNG ||
    primaryLanguage;

  var sequence = [];

  var startTurn =
    getCurrentRoleTargetTurn();

  var isLearnMode =
    document.documentElement.dataset.licenseMode ===
    'learn';

  function addItem(
    text,
    language,
    turnNumber,
    kind,
    speaker
  ) {
    var speechText =
      getCurrentPsgSpeechText(
        text,
        language
      );

    if (!speechText) {
      return;
    }

    sequence.push({
      turnNumber: turnNumber,
      speaker: String(speaker || '').trim(),
      gender: getConversationV2SpeakerGender(
        speaker
      ),
      speechText: speechText,
      language: language,
      kind: kind
    });
  }

  Array.from(
    document.querySelectorAll(
      '.conversation-turn-card'
    )
  ).forEach(function(card, index) {
    var turnNumber =
      Number(card.dataset.turn) ||
      index + 1;

    if (turnNumber < startTurn) {
      return;
    }

    if (
      isLearnMode &&
      card.classList.contains('license-choice') &&
      !card.classList.contains('correct')
    ) {
      return;
    }

    var primaryText =
      card.querySelector(
        '.conversation-turn-text'
      );

    var secondaryText =
      card.querySelector(
        '.conversation-secondary-text'
      );

    var primarySpeaker =
      card.querySelector(
        '.conversation-turn-speaker'
      );

    var secondarySpeaker =
      card.querySelector(
        '.conversation-secondary-speaker'
      );

    if (primaryText) {
      addItem(
        primaryText.textContent,
        primaryLanguage,
        turnNumber,
        'primary',
        getConversationV2SpeakerName(
          primarySpeaker
        )
      );
    }

    if (secondaryText) {
      addItem(
        secondaryText.textContent,
        secondaryLanguage,
        turnNumber,
        'secondary',
        getConversationV2SpeakerName(
          secondarySpeaker
        )
      );
    }
  });

  return sequence;
}


// ============================================================================


// ============================================================================

// 🟦 BLOCK 12000: PLAY SEQUENCE REFRESH / INSPECTION
// ============================================================================

function refreshCurrentPsgPlaySequence() {
  var sequence =
    buildCurrentPsgPlaySequence();

  window.CONVERSATION_V2_PLAY_SEQUENCE =
    sequence;

  return sequence;
}


function inspectCurrentPsgPlaySequence() {
  var sequence =
    window.CONVERSATION_V2_PLAY_SEQUENCE ||
    refreshCurrentPsgPlaySequence();

  console.table(
    sequence.map(function(item) {
      return {
        turn: item.turnNumber,
        kind: item.kind,
        text: item.speechText,
        language: item.language
      };
    })
  );

  return sequence;
}


window.buildCurrentPsgPlaySequence =
  buildCurrentPsgPlaySequence;

window.refreshCurrentPsgPlaySequence =
  refreshCurrentPsgPlaySequence;

window.inspectCurrentPsgPlaySequence =
  inspectCurrentPsgPlaySequence;


// ============================================================================

// 🟦 BLOCK 12100: SHARED PLAY STATE / RATE / LOCALE
// ============================================================================

function getCurrentPsgPlayState() {
  if (!window.CONVERSATION_V2_PLAY) {
    window.CONVERSATION_V2_PLAY = {
      runId: 0,
      running: false,
      adapter: null
    };
  }

  return window.CONVERSATION_V2_PLAY;
}


function getCurrentPsgPlayRate() {
  var speedRange =
    document.getElementById(
      'speechSpeedRange'
    );

  var rate = speedRange
    ? Number(speedRange.value)
    : 1;

  return rate > 0
    ? rate
    : 1;
}


function getCurrentPsgPlayLocale(language) {
  var locales = {
    AR: 'ar-SA',
    EN: 'en-US',
    ES: 'es-ES',
    FR: 'fr-FR',
    HI: 'hi-IN',
    ID: 'id-ID',
    JA: 'ja-JP',
    KM: 'km-KH',
    KO: 'ko-KR',
    LO: 'lo-LA',
    MS: 'ms-MY',
    MY: 'my-MM',
    NE: 'ne-NP',
    PT: 'pt-PT',
    RU: 'ru-RU',
    TH: 'th-TH',
    TL: 'fil-PH',
    VI: 'vi-VN',
    'ZH-CN': 'zh-CN',
    'ZH-TW': 'zh-TW'
  };

  return locales[language] || 'en-US';
}


// ============================================================================

// 🟦 BLOCK 12200: SPEAKER GENDER TTS PROFILE
// Purpose: Use the GENDER mapping without relying on device-specific voice names.
// ============================================================================

function getConversationV2SpeakerGender() {
  return '';
}


function getCurrentPsgSpeechPitch(gender) {
  if (gender === 'F') {
    return 1.25;
  }

  if (gender === 'M') {
    return 0.85;
  }

  return 1;
}


// ============================================================================

// 🟦 BLOCK 12300: NATIVE SPEECH LOOKUP
// ============================================================================

function getCurrentPsgNativeSpeech() {
  var capacitor = window.Capacitor;

  if (!capacitor) {
    return null;
  }

  var isNative =
    typeof capacitor.isNativePlatform ===
    'function'
      ? capacitor.isNativePlatform()
      : typeof capacitor.getPlatform ===
          'function' &&
        capacitor.getPlatform() !== 'web';

  if (!isNative) {
    return null;
  }

  if (
    capacitor.Plugins &&
    capacitor.Plugins.GongbooSpeech
  ) {
    return capacitor.Plugins.GongbooSpeech;
  }

  if (
    typeof capacitor.registerPlugin ===
    'function'
  ) {
    if (
      !window.CONVERSATION_V2_GONGBOO_SPEECH
    ) {
      window.CONVERSATION_V2_GONGBOO_SPEECH =
        capacitor.registerPlugin(
          'GongbooSpeech'
        );
    }

    return window.CONVERSATION_V2_GONGBOO_SPEECH;
  }

  return null;
}


// ============================================================================

// 🟦 BLOCK 12400: ANDROID CHROME PLATFORM DETECTOR
// Purpose: S26 Android Chrome only. APK is excluded first.
// ============================================================================

function isCurrentAndroidChrome_2() {
  var capacitor = window.Capacitor;

  var isNative =
    capacitor &&
    typeof capacitor.isNativePlatform ===
      'function' &&
    capacitor.isNativePlatform();

  if (isNative) {
    return false;
  }

  var userAgent =
    String(navigator.userAgent || '');

  return (
    /Android/i.test(userAgent) &&
    /Chrome\//i.test(userAgent) &&
    !/; wv\)/i.test(userAgent)
  );
}


// ============================================================================

// 🟦 BLOCK 12500: WEB WORD HIGHLIGHT FALLBACK
// ============================================================================

function startCurrentPsgWebWordFallback() {
  var data =
    window.CONVERSATION_V2_TTS_WORD_DATA;

  if (
    !data ||
    !data.words ||
    !data.words.length
  ) {
    return null;
  }

  var index = 0;

  var delay = Math.max(
    160,
    Math.round(
      340 / getCurrentPsgPlayRate()
    )
  );

  highlightCurrentTtsWordAt(
    Number(data.words[0].start)
  );

  return window.setInterval(function() {
    index += 1;

    if (index >= data.words.length) {
      return;
    }

    highlightCurrentTtsWordAt(
      Number(data.words[index].start)
    );
  }, delay);
}



// ============================================================================

// 🟦 BLOCK 12600: ANDROID CHROME PERSISTENT DIAGNOSTIC TRACE
// Purpose: Save S26 PLAY/MIC state before DevTools connection changes runtime.
// ============================================================================

var CONVERSATION_V2_ANDROID_TRACE_KEY_2 =
  'CONVERSATION_V2_ANDROID_TRACE_2';


function writeCurrentAndroidTrace_2(
  eventName,
  detail
) {
  if (!isCurrentAndroidChrome_2()) {
    return;
  }

  try {
    var entries = JSON.parse(
      localStorage.getItem(
        CONVERSATION_V2_ANDROID_TRACE_KEY_2
      ) || '[]'
    );

    entries.push({
      time: new Date().toISOString(),
      event: eventName,
      detail: detail || {}
    });

    if (entries.length > 80) {
      entries = entries.slice(-80);
    }

    localStorage.setItem(
      CONVERSATION_V2_ANDROID_TRACE_KEY_2,
      JSON.stringify(entries)
    );
  } catch (error) {
    // Diagnostics must never affect PLAY or MIC.
  }
}


function getCurrentAndroidTraceSnapshot_2() {
  var synthesis = window.speechSynthesis;
  var micState =
    window.CONVERSATION_V2_MIC || {};

  return {
    visible: document.visibilityState,
    focused: document.hasFocus(),
    row: Boolean(window.CONVERSATION_V2_ROW),
    cards: document.querySelectorAll(
      '.conversation-turn-card'
    ).length,
    sequence:
      typeof buildCurrentPsgPlaySequence ===
      'function'
        ? buildCurrentPsgPlaySequence().length
        : -1,
    tts: Boolean(synthesis),
    paused: synthesis ? synthesis.paused : null,
    pending: synthesis ? synthesis.pending : null,
    speaking: synthesis ? synthesis.speaking : null,
    voices: synthesis
      ? synthesis.getVoices().length
      : 0,
    micClass: Boolean(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    ),
    micRunning: Boolean(micState.running)
  };
}


function installCurrentAndroidTrace_2() {
  if (!isCurrentAndroidChrome_2()) {
    return;
  }

  writeCurrentAndroidTrace_2(
    'boot',
    getCurrentAndroidTraceSnapshot_2()
  );

  window.addEventListener(
    'pageshow',
    function() {
      writeCurrentAndroidTrace_2(
        'pageshow',
        getCurrentAndroidTraceSnapshot_2()
      );
    }
  );

  document.addEventListener(
    'visibilitychange',
    function() {
      writeCurrentAndroidTrace_2(
        'visibilitychange',
        getCurrentAndroidTraceSnapshot_2()
      );
    }
  );

  document.addEventListener(
    'click',
    function(event) {
      var button =
        event.target.closest('button');

      if (!button) {
        return;
      }

      var watched =
        button.id === 'playButton' ||
        button.id ===
          'practiceStartStopButton';

      if (!watched) {
        return;
      }

      writeCurrentAndroidTrace_2(
        'tap:' + button.id,
        getCurrentAndroidTraceSnapshot_2()
      );

      window.setTimeout(function() {
        writeCurrentAndroidTrace_2(
          'after-0ms:' + button.id,
          getCurrentAndroidTraceSnapshot_2()
        );
      }, 0);

      window.setTimeout(function() {
        writeCurrentAndroidTrace_2(
          'after-1800ms:' + button.id,
          getCurrentAndroidTraceSnapshot_2()
        );
      }, 1800);
    },
    true
  );

  if (
    navigator.permissions &&
    typeof navigator.permissions.query ===
      'function'
  ) {
    navigator.permissions.query({
      name: 'microphone'
    }).then(
      function(permission) {
        writeCurrentAndroidTrace_2(
          'microphone-permission',
          { state: permission.state }
        );
      },
      function() {
        // Some Android Chrome versions do not expose it.
      }
    );
  }
}


installCurrentAndroidTrace_2();



// ============================================================================

// 🟦 BLOCK 12700: WEB PLAY ADAPTER
// ============================================================================

function createCurrentPsgWebPlayAdapter() {
  if (
    !window.speechSynthesis ||
    typeof SpeechSynthesisUtterance !==
      'function'
  ) {
    return null;
  }

  return {
    type: 'web',

    speak: function(item) {
      return new Promise(function(resolve, reject) {
        var settled = false;
        var fallbackTimer = null;
        var boundaryReceived = false;

        function clearFallback() {
          if (fallbackTimer !== null) {
            window.clearInterval(
              fallbackTimer
            );

            fallbackTimer = null;
          }
        }

        function finish(callback, value) {
          if (settled) {
            return;
          }

          settled = true;
          clearFallback();
          callback(value);
        }

        var utterance =
          new SpeechSynthesisUtterance(
            item.speechText
          );

        utterance.lang =
          getCurrentPsgPlayLocale(
            item.language
          );

        utterance.rate =
          getCurrentPsgPlayRate();

        utterance.pitch =
          getCurrentPsgSpeechPitch(
            item.gender
          );

        utterance.onstart = function() {
          if (!boundaryReceived) {
            fallbackTimer =
              startCurrentPsgWebWordFallback();
          }
        };

        utterance.onboundary = function(event) {
          var charIndex =
            Number(event.charIndex);

          if (!Number.isInteger(charIndex)) {
            return;
          }

          boundaryReceived = true;
          clearFallback();

          highlightCurrentTtsWordAt(
            charIndex
          );
        };

        utterance.onend = function() {
          finish(resolve);
        };

        utterance.onerror = function(error) {
          finish(reject, error);
        };

        try {
          window.speechSynthesis.speak(
            utterance
          );

          window.setTimeout(function() {
            window.speechSynthesis.resume();
          }, 100);

        } catch (error) {
          finish(reject, error);
        }
      });
    },

    stop: function() {
      window.speechSynthesis.cancel();

      return Promise.resolve();
    }
  };
}



// ============================================================================
// 🟦 BLOCK 12800: ANDROID CHROME PLAY ADAPTER
// Purpose: Android Chrome TTS visual state and word highlight recovery.
// ============================================================================

function createCurrentPsgAndroidChromeAdapter_2() {
  var synthesis = window.speechSynthesis;

  if (
    !synthesis ||
    typeof SpeechSynthesisUtterance !==
      'function'
  ) {
    return null;
  }

  return {
    type: 'android-chrome',

    speak: function(item) {
      return new Promise(function(resolve, reject) {
        var settled = false;
        var attemptId = 0;
        var fallbackTimer = null;
        var startTimer = null;
        var finishTimer = null;

        function clearTimers() {
          if (fallbackTimer !== null) {
            window.clearInterval(fallbackTimer);
            fallbackTimer = null;
          }

          if (startTimer !== null) {
            window.clearTimeout(startTimer);
            startTimer = null;
          }

          if (finishTimer !== null) {
            window.clearTimeout(finishTimer);
            finishTimer = null;
          }
        }

        function finish(callback, value) {
          if (settled) {
            return;
          }

          settled = true;
          attemptId += 1;
          clearTimers();
          callback(value);
        }

        function getVisualDurationMs() {
          var wordCount = String(
            item.speechText || ''
          )
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;

          return Math.max(
            450,
            Math.round(
              wordCount *
              340 /
              getCurrentPsgPlayRate()
            )
          );
        }

        function speakAttempt(retry) {
          var myAttempt = attemptId + 1;
          var started = false;
          var visualFinishAt =
            Date.now() + getVisualDurationMs();

          attemptId = myAttempt;

          var utterance =
            new SpeechSynthesisUtterance(
              item.speechText
            );

          utterance.lang =
            getCurrentPsgPlayLocale(
              item.language
            );

          utterance.rate =
            getCurrentPsgPlayRate();

          utterance.pitch =
            getCurrentPsgSpeechPitch(
              item.gender
            );

          utterance.onstart = function() {
            if (
              settled ||
              myAttempt !== attemptId
            ) {
              return;
            }

            started = true;

            if (startTimer !== null) {
              window.clearTimeout(startTimer);
              startTimer = null;
            }

            if (fallbackTimer === null) {
              fallbackTimer =
                startCurrentPsgWebWordFallback();
            }
          };

          utterance.onboundary = function(event) {
            if (
              settled ||
              myAttempt !== attemptId
            ) {
              return;
            }

            var charIndex =
              Number(event.charIndex);

            if (!Number.isInteger(charIndex)) {
              return;
            }

            if (fallbackTimer !== null) {
              window.clearInterval(fallbackTimer);
              fallbackTimer = null;
            }

            highlightCurrentTtsWordAt(charIndex);
          };

          utterance.onend = function() {
            if (
              settled ||
              myAttempt !== attemptId
            ) {
              return;
            }

            var waitMs = Math.max(
              0,
              visualFinishAt - Date.now()
            );

            if (waitMs === 0) {
              finish(resolve);
              return;
            }

            finishTimer = window.setTimeout(
              function() {
                if (
                  !settled &&
                  myAttempt === attemptId
                ) {
                  finish(resolve);
                }
              },
              waitMs
            );
          };

          utterance.onerror = function(error) {
            if (
              settled ||
              myAttempt !== attemptId
            ) {
              return;
            }

            if (!started && !retry) {
              speakAttempt(true);
              return;
            }

            finish(reject, error);
          };

          try {
            synthesis.cancel();
            synthesis.resume();
            synthesis.speak(utterance);

            if (fallbackTimer === null) {
              fallbackTimer =
                startCurrentPsgWebWordFallback();
            }

            window.setTimeout(function() {
              if (
                !settled &&
                myAttempt === attemptId &&
                synthesis.paused
              ) {
                synthesis.resume();
              }
            }, 100);

            startTimer = window.setTimeout(
              function() {
                if (
                  !settled &&
                  myAttempt === attemptId &&
                  !started &&
                  !retry
                ) {
                  speakAttempt(true);
                }
              },
              1500
            );
          } catch (error) {
            finish(reject, error);
          }
        }

        speakAttempt(false);
      });
    },

    stop: function() {
      synthesis.cancel();
      synthesis.resume();

      return Promise.resolve();
    }
  };
}

// ============================================================================



// ============================================================================

// 🟦 BLOCK 12900: NATIVE PLAY ADAPTER / BASE ADAPTER
// ============================================================================

function createCurrentPsgNativePlayAdapter() {
  var nativeSpeech =
    getCurrentPsgNativeSpeech();

  if (
    !nativeSpeech ||
    typeof nativeSpeech.speak !== 'function' ||
    typeof nativeSpeech.stopSpeaking !==
      'function'
  ) {
    return null;
  }

  return {
    type: 'android-native',

    speak: function(item) {
      return nativeSpeech.speak({
        text: item.speechText,
        language: getCurrentPsgPlayLocale(
          item.language
        ),
        rate: getCurrentPsgPlayRate(),
        pitch: getCurrentPsgSpeechPitch(
          item.gender
        )
      });
    },

    stop: function() {
      return nativeSpeech.stopSpeaking();
    }
  };
}


function getCurrentPsgBaseAdapter() {
  var nativeAdapter =
    createCurrentPsgNativePlayAdapter();

  if (nativeAdapter) {
    return nativeAdapter;
  }

  return createCurrentPsgWebPlayAdapter();
}






// ============================================================================

// 🟦 BLOCK 13000: PLAY STOP / CONTINUE NEXT TARGET
// ============================================================================

function stopCurrentPsgPlay() {
  var state = getCurrentPsgPlayState();

  state.runId += 1;
  state.running = false;

  var adapter = state.adapter;

  state.adapter = null;

  if (
    adapter &&
    typeof adapter.stop === 'function'
  ) {
    try {
      adapter.stop();
    } catch (error) {
      console.error(
        '[PLAY] Stop error:',
        error
      );
    }
  }

  renderCurrentPsgPlayButton();
}


window.stopCurrentPsgPlay =
  stopCurrentPsgPlay;

window.stopCurrentPsgWebPlay =
  stopCurrentPsgPlay;


function getCurrentContinueNextTargetId() {
  var currentRow =
    window.CONVERSATION_V2_ROW;

  var rows =
    getCurrentCategoryNavigationRows();

  if (!currentRow || !rows.length) {
    return null;
  }

  var currentIndex =
    rows.findIndex(function(row) {
      return Number(row.ID) ===
        Number(currentRow.ID);
    });

  if (
    currentIndex < 0 ||
    currentIndex >= rows.length - 1
  ) {
    return null;
  }

  return Number(
    rows[currentIndex + 1].ID
  );
}


// 🟦 BLOCK 13100: PLAY CONTINUE / SEQUENCE EXECUTION
// ============================================================================

async function continueCurrentPsgAfterFinish(
  completedRunId
) {
  var state =
    getCurrentPsgPlayState();

  if (
    state.running ||
    state.runId !== completedRunId
  ) {
    return;
  }

  var mode =
    getCurrentContinueMode();

  if (mode === 'repeat') {
    resetCurrentPlayVisualState();
    startCurrentPsgPlay();
    return;
  }

  // License 다음 문제 이동은 PART 3이 처리한다.
  return;
}


function speakCurrentPsgSequenceItem(
  sequence,
  index,
  runId
) {
  var state = getCurrentPsgPlayState();

  if (
    !state.running ||
    state.runId !== runId
  ) {
    return;
  }

  if (index >= sequence.length) {
    var continueMode =
      getCurrentContinueMode();

    if (
      continueMode === 'off' &&
      window.CONVERSATION_V2_LOOP_PLAY ===
      true
    ) {
      speakCurrentPsgSequenceItem(
        sequence,
        0,
        runId
      );

      return;
    }

    state.running = false;
    state.adapter = null;

    renderCurrentPsgPlayButton();

    continueCurrentPsgAfterFinish(runId);

    return;
  }

  var adapter = state.adapter;
  var item = sequence[index];

  if (!adapter) {
    state.running = false;

    renderCurrentPsgPlayButton();

    console.error(
      '[PLAY] No TTS adapter is available'
    );

    return;
  }

  adapter.speak(item).then(
    function() {
      speakCurrentPsgSequenceItem(
        sequence,
        index + 1,
        runId
      );
    },

    function(error) {
      if (state.runId !== runId) {
        return;
      }

      state.running = false;
      state.adapter = null;

      renderCurrentPsgPlayButton();

      console.error(
        '[PLAY] TTS error:',
        error
      );
    }
  );
}


// ============================================================================


// ============================================================================

// 🟦 BLOCK 13200: PLAY START / SPEAKING CARD CONNECTION
// ============================================================================

function startCurrentPsgPlay(
  skipStartSignal
) {
  var state =
    getCurrentPsgPlayState();

  if (state.running) {
    return;
  }

  if (!skipStartSignal) {
    if (isCurrentAndroidChrome_2()) {
      playCurrentIStartSignal();
      startCurrentPsgPlay(true);
      return;
    }

    var startRunId =
      state.runId;

    playCurrentIStartSignal().then(
      function() {
        if (
          state.running ||
          state.runId !== startRunId
        ) {
          return;
        }

        startCurrentPsgPlay(true);
      }
    );

    return;
  }

  var sequence =
    refreshCurrentPsgPlaySequence();

  if (!sequence.length) {
    console.error(
      '[PLAY] No current PSG sentences'
    );

    return;
  }

  var adapter =
    getCurrentPsgPlayAdapter();

  if (!adapter) {
    console.error(
      '[PLAY] No native or web TTS is available'
    );

    return;
  }

  state.runId += 1;
  state.running = true;
  state.adapter = adapter;

  console.log(
    '[PLAY] Adapter:',
    adapter.type
  );

  renderCurrentPsgPlayButton();

  speakCurrentPsgSequenceItem(
    sequence,
    0,
    state.runId
  );
}


window.startCurrentPsgPlay =
  startCurrentPsgPlay;

window.startCurrentPsgWebPlay =
  startCurrentPsgPlay;


function clearCurrentTtsWordHighlight() {
  document
    .querySelectorAll(
      '.conversation-tts-word.is-tts-current-word'
    )
    .forEach(function(word) {
      word.classList.remove(
        'is-tts-current-word'
      );
    });

  window.CONVERSATION_V2_TTS_WORD_DATA =
    null;
}


function prepareCurrentTtsWordHighlight(
  item,
  card
) {
  clearCurrentTtsWordHighlight();

  if (!card || !item) {
    return;
  }

   var text =
    card.querySelector(
      item.kind === 'secondary'
        ? '.conversation-secondary-text'
        : '.conversation-turn-text'
    );

  if (!text) {
    return;
  }

  var displayText =
    String(text.textContent || '');

  var speechText =
    String(item.speechText || '');

   displayText = displayText.trim();

  speechText = speechText.trim();

  if (
    !displayText ||
    !speechText
  ) {
    return;
  }

  var fragment =
    document.createDocumentFragment();

  var words = [];
  var cursor = 0;
  var match;
  var wordPattern = /\S+/g;

  while (
    (match = wordPattern.exec(displayText)) !==
    null
  ) {
    if (match.index > cursor) {
      fragment.appendChild(
        document.createTextNode(
          displayText.slice(
            cursor,
            match.index
          )
        )
      );
    }

    var word =
      document.createElement('span');

    word.className =
      'conversation-tts-word';

    word.textContent =
      match[0];

    word.dataset.start =
      String(match.index);

    word.dataset.end =
      String(
        match.index + match[0].length
      );

    fragment.appendChild(word);

    words.push({
      element: word,
      start: match.index,
      end:
        match.index + match[0].length
    });

    cursor =
      match.index + match[0].length;
  }

  if (cursor < displayText.length) {
    fragment.appendChild(
      document.createTextNode(
        displayText.slice(cursor)
      )
    );
  }

  if (!words.length) {
    return;
  }

  text.replaceChildren(fragment);

  window.CONVERSATION_V2_TTS_WORD_DATA = {
    card: card,
    words: words
  };
}


function highlightCurrentTtsWordAt(
  charIndex
) {
  var data =
    window.CONVERSATION_V2_TTS_WORD_DATA;

  if (
    !data ||
    !Number.isInteger(charIndex)
  ) {
    return;
  }

  data.words.forEach(function(word) {
    var current =
      charIndex >= word.start &&
      charIndex < word.end;

    word.element.classList.toggle(
      'is-tts-current-word',
      current
    );
  });
}


function clearCurrentSpeakingCard() {
  document
    .querySelectorAll(
      '.conversation-turn-card.is-speaking'
    )
    .forEach(function(card) {
      card.classList.remove(
        'is-speaking'
      );
    });

  clearCurrentTtsWordHighlight();
}


function setCurrentSpeakingCard(item) {
  clearCurrentSpeakingCard();

  if (
    !item ||
    !item.turnNumber
  ) {
    return;
  }

  var card =
    document.querySelector(
      '.conversation-turn-card[data-turn="' +
      item.turnNumber +
      '"]'
    );

  if (!card) {
    return;
  }

  card.classList.add(
    'is-speaking'
  );

  prepareCurrentTtsWordHighlight(
    item,
    card
  );

  card.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });
}


function getCurrentPsgPlayAdapter() {
  var baseAdapter =
    getCurrentPsgBaseAdapter();

  if (!baseAdapter) {
    return null;
  }

  return {
    type: baseAdapter.type,

    speak: function(item) {
      setCurrentSpeakingCard(item);

      return baseAdapter.speak(item);
    },

    stop: function() {
      clearCurrentSpeakingCard();

      return baseAdapter.stop();
    }
  };
}


function renderCurrentPsgPlayButton() {
  var button =
    document.getElementById(
      'playButton'
    );

  var state =
    getCurrentPsgPlayState();

  if (!state.running) {
    clearCurrentSpeakingCard();
  }

  if (!button) {
    return;
  }

  button.textContent =
    state.running
      ? 'STOP'
      : 'PLAY';

  button.setAttribute(
    'aria-pressed',
    String(state.running)
  );
}




// ============================================================================
// 🟩 6000 — MICROPHONE / PRONUNCIATION + ROLE PRACTICE / PRACTICE MODE
// ============================================================================


// ============================================================================

// 🟦 BLOCK 13300: MICROPHONE STATE
// ============================================================================

function getCurrentMicState() {
  if (!window.CONVERSATION_V2_MIC) {
    window.CONVERSATION_V2_MIC = {
      runId: 0,
      running: false,
      transcript: '',
      matches: []
    };
  }

  return window.CONVERSATION_V2_MIC;
}


// ============================================================================

// 🟦 BLOCK 13400: WEB SPEECH RECOGNITION CLASS / ENGINE STATE
// ============================================================================

var CurrentMicSpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


var _currentMicWebRecognition = null;
var _currentMicWebFinalizeTimer = null;
var _currentMicWebLastTranscript = '';
var _currentMicWebResolve = null;
var _currentMicWebReject = null;


// ============================================================================

// 🟦 BLOCK 13500: NATIVE MICROPHONE ADAPTER
// ============================================================================

function createCurrentMicNativeAdapter() {
  var nativeSpeech =
    getCurrentPsgNativeSpeech();

  if (
    !nativeSpeech ||
    typeof nativeSpeech.start !== 'function' ||
    typeof nativeSpeech.stop !== 'function'
  ) {
    return null;
  }

  return {
    type: 'android-native',

    start: function(options) {
      return nativeSpeech.start({
        language: options.language,
        onDevice: true,
        maxResults: options.maxResults || 3
      }).then(function(result) {
        return {
          matches:
            Array.isArray(result.matches)
              ? result.matches
              : []
        };
      });
    },

    stop: function() {
      return nativeSpeech.stop();
    }
  };
}


// ============================================================================

// 🟦 BLOCK 13600: WEB MICROPHONE DELAY
// ============================================================================

function getCurrentMicWebDelayMs() {
  var input =
    document.getElementById(
      'delayRange'
    );

  var seconds =
    Number(input ? input.value : 0.5);

  if (
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    seconds = 0.5;
  }

  return Math.max(
    500,
    seconds * 1000
  );
}



// ============================================================================

// 🟦 BLOCK 13700: WEB MICROPHONE ADAPTER
// ============================================================================

function createCurrentMicWebAdapter() {
  if (!CurrentMicSpeechRecognition) {
    return null;
  }

  return {
    type: 'web-speech',

    start: function(options) {
      return new Promise(function(resolve, reject) {
        var recognition =
          new CurrentMicSpeechRecognition();

        _currentMicWebRecognition = recognition;
        _currentMicWebResolve = resolve;
        _currentMicWebReject = reject;
        _currentMicWebLastTranscript = '';

        function cleanup() {
          if (_currentMicWebFinalizeTimer) {
            clearTimeout(
              _currentMicWebFinalizeTimer
            );

            _currentMicWebFinalizeTimer = null;
          }

          try {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.abort();
          } catch (error) {
            // Ignore.
          }

          _currentMicWebRecognition = null;
          _currentMicWebResolve = null;
          _currentMicWebReject = null;
        }

        function finish() {
          var resolveFn =
            _currentMicWebResolve;

          var transcript =
            String(
              _currentMicWebLastTranscript || ''
            ).trim();

          cleanup();

          if (resolveFn) {
            resolveFn({
              matches:
                transcript
                  ? [transcript]
                  : []
            });
          }
        }

        function fail(error) {
          var rejectFn =
            _currentMicWebReject;

          cleanup();

          if (rejectFn) {
            rejectFn(error);
          }
        }

        recognition.lang =
          options.language || 'en-US';

        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.maxAlternatives =
          options.maxResults || 3;

        recognition.onresult = function(event) {
          var transcript = '';

          for (
            var i = 0;
            i < event.results.length;
            i++
          ) {
            if (
              event.results[i] &&
              event.results[i][0]
            ) {
              transcript +=
                event.results[i][0].transcript +
                ' ';
            }
          }

          transcript = transcript.trim();

          if (!transcript) {
            return;
          }

          _currentMicWebLastTranscript =
            transcript;

          if (_currentMicWebFinalizeTimer) {
            clearTimeout(
              _currentMicWebFinalizeTimer
            );
          }

          _currentMicWebFinalizeTimer =
            setTimeout(
              function() {
                if (
                  _currentMicWebRecognition ===
                  recognition
                ) {
                  try {
                    recognition.stop();
                  } catch (error) {
                    // Ignore.
                  }
                }
              },
              getCurrentMicWebDelayMs()
            );
        };

        recognition.onerror = function(event) {
          if (
            event.error === 'no-speech' ||
            event.error === 'aborted'
          ) {
            finish();
            return;
          }

          if (
            event.error === 'not-allowed' ||
            event.error ===
              'service-not-allowed'
          ) {
            fail(
              new Error(
                'Microphone permission denied.'
              )
            );

            return;
          }

          fail(
            new Error(
              'Web speech error: ' +
              event.error
            )
          );
        };

        recognition.onend = function() {
          finish();
        };

        try {
          recognition.start();
        } catch (error) {
          fail(error);
        }
      });
    },

    stop: function() {
      if (_currentMicWebRecognition) {
        try {
          _currentMicWebRecognition.stop();
        } catch (error) {
          // Ignore.
        }
      }

      return Promise.resolve();
    }
  };
}


// ============================================================================

// 🟦 BLOCK 13800: COMMON MICROPHONE ADAPTER SELECTOR
// Purpose: Only S26 Chrome enters BLOCK 6202.
// ============================================================================

function getCurrentMicAdapter() {
  if (isCurrentAndroidChrome_2()) {
    return createCurrentMicAndroidChromeAdapter_2();
  }

  var nativeAdapter =
    createCurrentMicNativeAdapter();

  if (nativeAdapter) {
    return nativeAdapter;
  }

  // Existing PC Chrome path: unchanged.
  return createCurrentMicWebAdapter();
}


// ============================================================================

// 🟦 BLOCK 13900: MICROPHONE START API
// ============================================================================

function startCurrentMicRecognition(options) {
  var config = options || {};

  var adapter =
    getCurrentMicAdapter();

  var state =
    getCurrentMicState();

  if (!adapter) {
    return Promise.reject(
      new Error(
        'Microphone is unavailable on this device.'
      )
    );
  }

  var row =
    window.CONVERSATION_V2_ROW || {};

  var language =
    config.language ||
    getCurrentPsgPlayLocale(
      row.LNG || 'EN'
    );

  state.runId += 1;

  var runId = state.runId;

  state.running = true;
  state.transcript = '';
  state.matches = [];

  console.log(
    '[MIC] Adapter:',
    adapter.type,
    language
  );

  return adapter.start({
    language: language,
    maxResults: 3
  }).then(
    function(result) {
      if (state.runId !== runId) {
        return state;
      }

      state.running = false;

      state.matches =
        Array.isArray(result.matches)
          ? result.matches
          : [];

      state.transcript =
        String(
          state.matches[0] || ''
        ).trim();

      console.log(
        '[MIC] recognized:',
        state.transcript
      );

      return state;
    },

    function(error) {
      if (state.runId === runId) {
        state.running = false;
      }

      console.error(
        '[MIC] recognition failed:',
        error
      );

      throw error;
    }
  );
}


// ============================================================================

// 🟦 BLOCK 14000: MICROPHONE STOP API / PUBLIC CONNECTION
// ============================================================================

function stopCurrentMicRecognition() {
  var adapter =
    getCurrentMicAdapter();

  var state =
    getCurrentMicState();

  state.runId += 1;
  state.running = false;

  if (
    !adapter ||
    typeof adapter.stop !== 'function'
  ) {
    return Promise.resolve();
  }

  return adapter.stop();
}


window.startCurrentMicRecognition =
  startCurrentMicRecognition;

window.stopCurrentMicRecognition =
  stopCurrentMicRecognition;


// ============================================================================

// 🟦 BLOCK 14100: MICROPHONE TEXT NORMALIZATION / TARGET CARD
// ============================================================================

function normalizeCurrentMicText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\bi'm\b/g, 'i am')
    .replace(/\byou're\b/g, 'you are')
    .replace(/\bwe're\b/g, 'we are')
    .replace(/\bthey're\b/g, 'they are')
    .replace(/\bhe's\b/g, 'he is')
    .replace(/\bshe's\b/g, 'she is')
    .replace(/\bit's\b/g, 'it is')
    .replace(/\bcan't\b/g, 'cannot')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/n't\b/g, ' not')
    .replace(/'ll\b/g, ' will')
    .replace(/'ve\b/g, ' have')
    .replace(/'d\b/g, ' would')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


function getCurrentMicTargetCard(turnNumber) {
  if (turnNumber) {
    return document.querySelector(
      '.conversation-turn-card[data-turn="' +
      Number(turnNumber) +
      '"]'
    );
  }

  return document.querySelector(
    '.conversation-turn-card.is-speaking'
  ) || document.querySelector(
    '.conversation-turn-card'
  );
}


// ============================================================================

// 🟦 BLOCK 14200: MICROPHONE PASS THRESHOLD / SIMILARITY
// ============================================================================

function getCurrentMicPassThreshold() {
  var input =
    document.getElementById(
      'passRange'
    );

  var percent =
    Number(input ? input.value : 1);

  return Math.max(
    0.01,
    Math.min(
      1,
      percent / 100
    )
  );
}


function getCurrentMicSimilarity(
  expected,
  spoken
) {
  var expectedWords =
    normalizeCurrentMicText(expected)
      .split(' ')
      .filter(Boolean);

  var spokenWords =
    normalizeCurrentMicText(spoken)
      .split(' ')
      .filter(Boolean);

  var matchedCount =
    expectedWords.filter(function(word) {
      return spokenWords.indexOf(word) >= 0;
    }).length;

  if (!expectedWords.length) {
    return 0;
  }

  return matchedCount /
    expectedWords.length;
}


// ============================================================================

// 🟦 BLOCK 14300: MICROPHONE WORD MATCH RENDER
// ============================================================================

function renderCurrentMicWordMatches(
  card,
  spoken
) {
  if (!card) {
    return;
  }

  var text =
    card.querySelector(
      '.conversation-turn-text'
    );

  if (!text) {
    return;
  }

  var originalText =
    text.textContent;

  var spokenWords =
    normalizeCurrentMicText(spoken)
      .split(' ')
      .filter(Boolean);

  var fragment =
    document.createDocumentFragment();

  originalText
    .split(/(\s+)/)
    .forEach(function(token) {
      if (!token) {
        return;
      }

      if (/^\s+$/.test(token)) {
        fragment.appendChild(
          document.createTextNode(token)
        );

        return;
      }

      var tokenWords =
        normalizeCurrentMicText(token)
          .split(' ')
          .filter(Boolean);

      var matched =
        tokenWords.length > 0 &&
        tokenWords.every(function(word) {
          return spokenWords.indexOf(word) >= 0;
        });

      if (!matched) {
        fragment.appendChild(
          document.createTextNode(token)
        );

        return;
      }

      var mark =
        document.createElement('mark');

      mark.className =
        'conversation-mic-word-match';

      mark.textContent = token;

      fragment.appendChild(mark);
    });

  text.replaceChildren(fragment);
}


// ============================================================================

// 🟦 BLOCK 14400: MICROPHONE CHECK RESULT
// ============================================================================

function showCurrentMicCheckResult(
  card,
  passed,
  score,
  spoken
) {
  if (!card) {
    return;
  }

  card.classList.remove(
    'is-mic-pass',
    'is-mic-retry'
  );

  card.classList.add(
    passed
      ? 'is-mic-pass'
      : 'is-mic-retry'
  );

  renderCurrentMicWordMatches(
    card,
    spoken
  );

  var oldResult =
    card.querySelector(
      '.conversation-mic-result'
    );

  if (oldResult) {
    oldResult.remove();
  }

  var result =
    document.createElement('div');

  result.className =
    'conversation-mic-result';

  result.textContent =
    (
      passed
        ? 'PASS '
        : 'RETRY '
    ) +
    Math.round(score * 100) +
    '%';

  card.appendChild(result);

  console.log(
    '[MIC CHECK]',
    passed ? 'PASS' : 'RETRY',
    Math.round(score * 100) + '%',
    spoken
  );
}


// ============================================================================

// 🟦 BLOCK 14500: MICROPHONE ANSWER EVALUATION
// ============================================================================

function evaluateCurrentMicAnswer(options) {
  var config =
    options || {};

  var card =
    getCurrentMicTargetCard(
      config.turnNumber
    );

  var expected =
    card
      ? card.querySelector(
          '.conversation-turn-text'
        ).textContent
      : '';

  var state =
    getCurrentMicState();

  var spoken =
    state.transcript;

  var score =
    getCurrentMicSimilarity(
      expected,
      spoken
    );

  var passed =
    score >=
    getCurrentMicPassThreshold();

  showCurrentMicCheckResult(
    card,
    passed,
    score,
    spoken
  );

  return {
    passed: passed,
    score: score,
    expected: expected,
    spoken: spoken
  };
}


function startAndCheckCurrentMicAnswer(
  options
) {
  var config =
    options || {};

  return startCurrentMicRecognition(
    config
  ).then(function() {
    return evaluateCurrentMicAnswer(
      config
    );
  });
}


window.evaluateCurrentMicAnswer =
  evaluateCurrentMicAnswer;

window.startAndCheckCurrentMicAnswer =
  startAndCheckCurrentMicAnswer;


// ============================================================================

// 🟦 BLOCK 14600: ROLE TARGET CARD / TURN SELECTION
// ============================================================================

function getCurrentRoleTargetCards() {
  return Array.from(
    document.querySelectorAll(
      '#conversationTurns .conversation-turn-card'
    )
  );
}


function selectCurrentRoleTurn(turnNumber) {
  var cards =
    getCurrentRoleTargetCards();

  var target =
    cards.find(function(card) {
      return Number(card.dataset.turn) ===
        Number(turnNumber);
    });

  if (!target) {
    return null;
  }

  cards.forEach(function(card) {
    card.classList.remove(
      'is-role-target'
    );
  });

  target.classList.add(
    'is-role-target'
  );

  window.CONVERSATION_V2_ROLE_TARGET_TURN =
    Number(target.dataset.turn);

  return target;
}


// ============================================================================

// 🟦 BLOCK 14700: CURRENT ROLE TARGET LOOKUP
// ============================================================================

function getCurrentRoleTargetTurn() {
  var yellowCard =
    document.querySelector(
      '#conversationTurns ' +
      '.conversation-turn-card.is-role-target'
    );

  var yellowTurn =
    Number(
      yellowCard &&
      yellowCard.dataset.turn
    );

  if (yellowTurn > 0) {
    window.CONVERSATION_V2_ROLE_TARGET_TURN =
      yellowTurn;

    return yellowTurn;
  }

  return Number(
    window.CONVERSATION_V2_ROLE_TARGET_TURN ||
    1
  );
}


function getCurrentRoleTargetConversationId() {
  var row =
    window.CONVERSATION_V2_ROW;

  return row && row.ID
    ? String(row.ID)
    : '';
}


// ============================================================================

// 🟦 BLOCK 14800: ROLE TURN SELECTION INSTALLATION
// ============================================================================

function installCurrentRoleTurnSelection() {
  var container =
    document.getElementById(
      'conversationTurns'
    );

  if (!container) {
    return;
  }

  document.addEventListener(
    'click',
    function(event) {
      var card =
        event.target &&
        event.target.closest
          ? event.target.closest(
              '#conversationTurns ' +
              '.conversation-turn-card'
            )
          : null;

      if (
        !card ||
        !container.contains(card)
      ) {
        return;
      }

      selectCurrentRoleTurn(
        card.dataset.turn
      );
    },
    true
  );

  var applyDefaultTarget = function() {
    var cards =
      container.querySelectorAll(
        '.conversation-turn-card'
      );

    if (!cards.length) {
      return;
    }

    var selectedCard =
      container.querySelector(
        '.conversation-turn-card.is-role-target'
      );

    if (selectedCard) {
      window.CONVERSATION_V2_ROLE_TARGET_TURN =
        Number(
          selectedCard.dataset.turn
        );

      return;
    }

    selectCurrentRoleTurn(
      window.CONVERSATION_V2_ROLE_TARGET_TURN ||
      cards[0].dataset.turn
    );
  };

  new MutationObserver(
    applyDefaultTarget
  ).observe(
    container,
    { childList: true }
  );

  applyDefaultTarget();
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentRoleTurnSelection,
    { once: true }
  );
} else {
  installCurrentRoleTurnSelection();
}


window.selectCurrentRoleTurn =
  selectCurrentRoleTurn;

window.getCurrentRoleTargetTurn =
  getCurrentRoleTargetTurn;


// ============================================================================

// 🟦 BLOCK 14900: PRACTICE STATE / TYPE / DELAY
// ============================================================================

function getCurrentRolePlayState() {
  if (!window.CONVERSATION_V2_ROLE_PLAY) {
    window.CONVERSATION_V2_ROLE_PLAY = {
      running: false,
      startTurn: 1,
      currentTurn: 1,
      adapter: null,
      continueToken: 0
    };
  }

  return window.CONVERSATION_V2_ROLE_PLAY;
}


function getCurrentPracticeType() {
  return window.CONVERSATION_V2_PRACTICE_TYPE ||
    'role-play';
}


function getCurrentRolePlayDelay() {
  var input =
    document.getElementById(
      'delayRange'
    );

  return Math.max(
    500,
    Number(
      input ? input.value : 0.5
    ) * 1000
  );
}


// ============================================================================

// 🟦 BLOCK 15000: PRACTICE RESULT RESET
// ============================================================================

function resetCurrentRolePlayResults() {
  document
    .querySelectorAll(
      '.conversation-turn-card'
    )
    .forEach(function(card) {
      card.classList.remove(
        'is-mic-pass',
        'is-mic-retry',
        'is-speaking',
        'is-role-target'
      );

      var result =
        card.querySelector(
          '.conversation-mic-result'
        );

      if (result) {
        result.remove();
      }
    });
}


// ============================================================================

// 🟦 BLOCK 15100: PRACTICE CONTROL RENDER
// ============================================================================

function renderCurrentPracticeControls() {
  var orderButton =
    document.getElementById(
      'playModeToggleButton'
    );

  var startButton =
    document.getElementById(
      'practiceStartStopButton'
    );

  var typeButton =
    document.getElementById(
      'practiceModeToggleButton'
    );

  var state =
    getCurrentRolePlayState();

  var followUp =
    getCurrentPracticeType() ===
    'follow-up';

  if (orderButton) {
    orderButton.textContent =
      window.CONVERSATION_V2_PLAY_MODE ===
      'i-start'
        ? 'I FIRST'
        : 'COMPUTER';

    orderButton.disabled =
      state.running || followUp;

    orderButton.setAttribute(
      'aria-pressed',
      String(
        window.CONVERSATION_V2_PLAY_MODE ===
        'i-start'
      )
    );
  }

  if (startButton) {
    startButton.disabled = false;

    startButton.textContent =
      state.running
        ? 'STOP'
        : 'START';

    startButton.setAttribute(
      'aria-pressed',
      String(state.running)
    );
  }

  if (typeButton) {
    typeButton.textContent =
      followUp
        ? 'FOLLOW UP'
        : 'ROLE PLAY';

    typeButton.disabled =
      state.running;

    typeButton.setAttribute(
      'aria-pressed',
      String(followUp)
    );
  }
}


// ============================================================================

// 🟦 BLOCK 15200: USER TURN / NEXT PRACTICE TARGET
// ============================================================================

function isCurrentRolePlayUserTurn(
  turnNumber
) {
  var state =
    getCurrentRolePlayState();

  var offset =
    Number(turnNumber) -
    Number(state.startTurn);

  return window.CONVERSATION_V2_PLAY_MODE ===
    'i-start'
      ? offset % 2 === 0
      : offset % 2 !== 0;
}


function getCurrentPracticeContinueNextTargetId() {
  var currentRow =
    window.CONVERSATION_V2_ROW;

  var rows =
    getCurrentCategoryNavigationRows();

  if (!currentRow || !rows.length) {
    return null;
  }

  var currentIndex =
    rows.findIndex(function(row) {
      return Number(row.ID) ===
        Number(currentRow.ID);
    });

  if (
    currentIndex < 0 ||
    currentIndex >= rows.length - 1
  ) {
    return null;
  }

  return Number(
    rows[currentIndex + 1].ID
  );
}


// ============================================================================
// 🟩 7000 — PRACTICE EXECUTION / CONTINUE CONTROL
// ============================================================================


// ============================================================================

// 🟦 BLOCK 15300: ROLE PLAY STOP
// ============================================================================

function stopCurrentRolePlay() {
  var state =
    getCurrentRolePlayState();

  state.continueToken += 1;
  state.running = false;

  if (
    state.adapter &&
    typeof state.adapter.stop === 'function'
  ) {
    state.adapter.stop();
  }

  state.adapter = null;

  stopCurrentMicRecognition();
  clearCurrentSpeakingCard();

  renderCurrentPracticeControls();
}


// 🟦 BLOCK 15400: ROLE PLAY FINISH / CONTINUE
// ============================================================================

function finishCurrentRolePlay() {
  var state =
    getCurrentRolePlayState();

  stopCurrentRolePlay();

  document
    .querySelectorAll(
      '.conversation-turn-card.is-role-target'
    )
    .forEach(function(card) {
      card.classList.remove(
        'is-role-target'
      );
    });

  var continueToken =
    state.continueToken;

  var continueMode =
    getCurrentContinueMode();

  if (continueMode === 'repeat') {
    window.setTimeout(function() {
      if (
        state.continueToken !==
          continueToken ||
        state.running
      ) {
        return;
      }

      startCurrentRolePlay();
    }, getCurrentRolePlayDelay());

    return;
  }

  // License에는 Conversation 다음 항목 이동이 없다.
  return;
}


// ============================================================================


// ============================================================================

// 🟦 BLOCK 15500: PRACTICE RETRY / LISTEN
// ============================================================================

function retryCurrentPracticeTurn() {
  window.setTimeout(
    runCurrentPracticeTurn,
    getCurrentRolePlayDelay()
  );
}


function listenCurrentPracticeTurn(
  state
) {
  startAndCheckCurrentMicAnswer({
    turnNumber: state.currentTurn,
    language: 'en-US'
  }).then(function(result) {
    if (!state.running) {
      return;
    }

    if (result.passed) {
      state.currentTurn += 1;
      runCurrentPracticeTurn();
      return;
    }

    retryCurrentPracticeTurn();

  }).catch(function(error) {
    console.warn(
      '[PRACTICE] MIC retry:',
      error
    );

    if (state.running) {
      retryCurrentPracticeTurn();
    }
  });
}


// ============================================================================

// 🟦 BLOCK 15600: PRACTICE SPEAK TURN
// ============================================================================

function speakCurrentPracticeTurn(
  state,
  text,
  followUp
) {
  state.adapter.speak({
    speechText: text.textContent,
    language: 'EN',
    turnNumber: state.currentTurn
  }).then(function() {
    if (!state.running) {
      return;
    }

    if (followUp) {
      listenCurrentPracticeTurn(
        state
      );

      return;
    }

    state.currentTurn += 1;

    runCurrentPracticeTurn();

  }, function(error) {
    console.error(
      '[PRACTICE] TTS failed:',
      error
    );

    stopCurrentRolePlay();
  });
}


// ============================================================================

// 🟦 BLOCK 15700: PRACTICE TURN EXECUTION
// ============================================================================

function runCurrentPracticeTurn() {
  var state =
    getCurrentRolePlayState();

  if (!state.running) {
    return;
  }

  var card =
    getCurrentMicTargetCard(
      state.currentTurn
    );

  if (!card) {
    finishCurrentRolePlay();
    return;
  }

  var text =
    card.querySelector(
      '.conversation-turn-text'
    );

  if (!text) {
    finishCurrentRolePlay();
    return;
  }

  card.classList.remove(
    'is-role-target'
  );

  setCurrentSpeakingCard({
    turnNumber: state.currentTurn
  });

  var followUp =
    getCurrentPracticeType() ===
    'follow-up';

  if (followUp) {
    speakCurrentPracticeTurn(
      state,
      text,
      true
    );

    return;
  }

  if (
    isCurrentRolePlayUserTurn(
      state.currentTurn
    )
  ) {
    listenCurrentPracticeTurn(
      state
    );

    return;
  }

  speakCurrentPracticeTurn(
    state,
    text,
    false
  );
}


// ============================================================================

// 🟦 BLOCK 15800: ROLE PLAY START
// ============================================================================

function startCurrentRolePlay(
  skipStartSignal
) {
  var state =
    getCurrentRolePlayState();

  if (state.running) {
    return;
  }

  if (!skipStartSignal) {
    var signalToken =
      state.continueToken;

    playCurrentIStartSignal().then(
      function() {
        if (
          state.running ||
          state.continueToken !==
            signalToken
        ) {
          return;
        }

        startCurrentRolePlay(true);
      }
    );

    return;
  }

  state.continueToken += 1;

  state.startTurn =
    getCurrentRoleTargetTurn();

  resetCurrentRolePlayResults();

  state.running = true;

  state.currentTurn =
    state.startTurn;

  state.adapter =
    getCurrentPsgPlayAdapter();

  if (!state.adapter) {
    stopCurrentRolePlay();
    return;
  }

  renderCurrentPracticeControls();

  runCurrentPracticeTurn();
}


// ============================================================================

// 🟦 BLOCK 15900: PRACTICE BUTTON INSTALLATION
// ============================================================================

function installCurrentRolePlayButton() {
  var orderButton =
    document.getElementById(
      'playModeToggleButton'
    );

  var startButton =
    document.getElementById(
      'practiceStartStopButton'
    );

  var typeButton =
    document.getElementById(
      'practiceModeToggleButton'
    );

  if (!window.CONVERSATION_V2_PLAY_MODE) {
    window.CONVERSATION_V2_PLAY_MODE =
      'computer';
  }

  if (orderButton) {
    orderButton.onclick = function() {
      if (
        getCurrentRolePlayState().running ||
        getCurrentPracticeType() ===
        'follow-up'
      ) {
        return;
      }

      window.CONVERSATION_V2_PLAY_MODE =
        window.CONVERSATION_V2_PLAY_MODE ===
        'computer'
          ? 'i-start'
          : 'computer';

      renderCurrentPracticeControls();
    };
  }

  if (typeButton) {
    typeButton.onclick = function() {
      if (
        getCurrentRolePlayState().running
      ) {
        return;
      }

      window.CONVERSATION_V2_PRACTICE_TYPE =
        getCurrentPracticeType() ===
        'role-play'
          ? 'follow-up'
          : 'role-play';

      renderCurrentPracticeControls();
    };
  }

  if (startButton) {
    startButton.onclick = function() {
      if (
        getCurrentRolePlayState().running
      ) {
        stopCurrentRolePlay();
        return;
      }

      startCurrentRolePlay();
    };
  }

  renderCurrentPracticeControls();
}


// ============================================================================

// 🟦 BLOCK 16000: PRACTICE BOOT / PUBLIC API
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentRolePlayButton,
    { once: true }
  );
} else {
  installCurrentRolePlayButton();
}


window.startCurrentRolePlay =
  startCurrentRolePlay;

window.stopCurrentRolePlay =
  stopCurrentRolePlay;


// ============================================================================

// 🟦 BLOCK 16100: CONTINUE MODE STATE / RENDER
// ============================================================================

function getCurrentContinueMode() {
  return window.CONVERSATION_V2_CONTINUE_MODE ||
    'off';
}


function renderCurrentContinueMode() {
  var button =
    document.getElementById(
      'continueNextButton'
    );

  if (!button) {
    return;
  }

  var mode =
    getCurrentContinueMode();

  button.textContent =
    mode === 'repeat'
      ? 'CONTINUE: REPEAT'
      : mode === 'next'
        ? 'CONTINUE: NEXT'
        : 'CONTINUE: OFF';

  button.setAttribute(
    'aria-pressed',
    String(mode !== 'off')
  );
}


// ============================================================================

// 🟦 BLOCK 16200: CONTINUE MODE BUTTON INSTALLATION
// ============================================================================

function installCurrentContinueModeButton() {
  var button =
    document.getElementById(
      'continueNextButton'
    );

  if (!button) {
    return;
  }

  button.onclick = function() {
    var mode =
      getCurrentContinueMode();

    window.CONVERSATION_V2_CONTINUE_MODE =
      mode === 'off'
        ? 'repeat'
        : mode === 'repeat'
          ? 'next'
          : 'off';

    renderCurrentContinueMode();
  };

  renderCurrentContinueMode();
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentContinueModeButton,
    { once: true }
  );
} else {
  installCurrentContinueModeButton();
}


// ============================================================================

// 🟦 BLOCK 16300: PLAY / EXTERNAL STOP VISUAL RESET
// ============================================================================

function resetCurrentPlayVisualState() {
  resetCurrentRolePlayResults();

  document
    .querySelectorAll(
      '.conversation-turn-card'
    )
    .forEach(function(card) {
      card.classList.remove(
        'is-speaking',
        'is-role-target'
      );
    });
}


function stopCurrentConversationActivity() {
  stopCurrentPsgPlay();
  stopCurrentRolePlay();
  stopCurrentMicRecognition();

  closeConversationMenus();
}


// ============================================================================

// 🟦 BLOCK 16400: PLAY / EXTERNAL STOP BUTTON CONNECTION
// ============================================================================

function installCurrentPsgPlayButton() {
  var playButton =
    document.getElementById(
      'playButton'
    );

  var stopButton =
    document.getElementById(
      'stopButton'
    );

  var playMenuPanel =
    document.getElementById(
      'playMenuPanel'
    );

  if (!playButton) {
    return;
  }

  renderCurrentPsgPlayButton();

  playButton.onclick = function() {
    var state =
      getCurrentPsgPlayState();

    if (state.running) {
      return;
    }

    if (
      playMenuPanel &&
      !playMenuPanel.hidden
    ) {
      return;
    }

    resetCurrentPlayVisualState();

    startCurrentPsgPlay();
  };

  if (stopButton) {
    stopButton.onclick = function() {
      stopCurrentConversationActivity();
    };
  }
}


// ============================================================================

// 🟦 BLOCK 16500: PLAY BUTTON BOOT
// ============================================================================

function bootCurrentPsgPlayButton() {
  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      installCurrentPsgPlayButton,
      { once: true }
    );

    return;
  }

  installCurrentPsgPlayButton();
}


bootCurrentPsgPlayButton();



// ============================================================================
// 🟩 8000 — CHUNK / SIGNAL / SETTINGS / EXTERNAL / KEYBOARD
// ============================================================================


// ============================================================================

// 🟦 BLOCK 16600: SELECTED CHUNK STATE / PARSING
// ============================================================================

function getCurrentSelectedChunkState() {
  if (!window.CONVERSATION_V2_SELECTED_CHUNK) {
    window.CONVERSATION_V2_SELECTED_CHUNK = {
      open: false
    };
  }

  return window.CONVERSATION_V2_SELECTED_CHUNK;
}


function parseCurrentTurnChunks(helpText) {
  var chunks = {};

  String(helpText || '')
    .split('||')
    .map(function(part) {
      return part.trim();
    })
    .filter(Boolean)
    .forEach(function(part) {
      var match = part.match(
        /^T(\d+)\s*=\s*(.+)$/i
      );

      if (!match) {
        return;
      }

      chunks[Number(match[1])] =
        match[2]
          .split('|')
          .map(function(item) {
            return item.trim();
          })
          .filter(Boolean);
    });

  return chunks;
}


// ============================================================================

// 🟦 BLOCK 16700: SELECTED CHUNK RENDER
// ============================================================================

function clearCurrentSelectedChunks() {
  document
    .querySelectorAll(
      '.conversation-selected-chunks'
    )
    .forEach(function(element) {
      element.remove();
    });
}


function renderCurrentSelectedChunks() {
  var state =
    getCurrentSelectedChunkState();

  clearCurrentSelectedChunks();

  if (!state.open) {
    return;
  }

  var turnNumber =
    getCurrentRoleTargetTurn();

  var card =
    document.querySelector(
      '.conversation-turn-card[data-turn="' +
      turnNumber +
      '"]'
    );

  if (!card) {
    return;
  }

  var chunks =
    parseCurrentTurnChunks(
      window.CONVERSATION_V2_SECONDARY_ROW?.HELP
    );

  var items =
    chunks[turnNumber];

  if (!items || !items.length) {
    return;
  }

  var container =
    document.createElement('div');

  container.className =
    'conversation-selected-chunks';

  var line =
    document.createElement('div');

  line.className =
    'conversation-selected-chunk-line';

  var title =
    document.createElement('strong');

  title.textContent = 'CHUNK:';

  var content =
    document.createElement('span');

  content.textContent =
    items.join(' · ');

  line.appendChild(title);
  line.appendChild(content);
  container.appendChild(line);
  card.appendChild(container);
}


// ============================================================================

// 🟦 BLOCK 16800: CHUNK BUTTON STATE
// ============================================================================

function renderCurrentChunkButton() {
  var button =
    document.getElementById(
      'chunkButton'
    );

  if (!button) {
    return;
  }

  var state =
    getCurrentSelectedChunkState();

  button.textContent =
    state.open
      ? 'CHUNK ON'
      : 'CHUNK';

  button.setAttribute(
    'aria-pressed',
    String(state.open)
  );
}


// ============================================================================

// 🟦 BLOCK 16900: CHUNK VIEW INSTALLATION
// ============================================================================

function installCurrentSelectedChunkView() {
  var button =
    document.getElementById(
      'chunkButton'
    );

  var turns =
    document.getElementById(
      'conversationTurns'
    );

  if (button) {
    button.onclick = function() {
      var state =
        getCurrentSelectedChunkState();

      state.open = !state.open;

      renderCurrentChunkButton();
      renderCurrentSelectedChunks();
    };
  }

  if (turns) {
    turns.addEventListener(
      'click',
      function() {
        window.setTimeout(
          renderCurrentSelectedChunks,
          0
        );
      }
    );

    new MutationObserver(
      function() {
        renderCurrentSelectedChunks();
      }
    ).observe(
      turns,
      { childList: true }
    );
  }

  [
    'primaryLanguageSelect',
    'secondaryLanguageSelect'
  ].forEach(function(id) {
    var select =
      document.getElementById(id);

    if (!select) {
      return;
    }

    select.addEventListener(
      'change',
      function() {
        window.setTimeout(
          renderCurrentSelectedChunks,
          300
        );
      }
    );
  });

  renderCurrentChunkButton();
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentSelectedChunkView,
    { once: true }
  );
} else {
  installCurrentSelectedChunkView();
}


// ============================================================================

// 🟦 BLOCK 17000: I FIRST SIGNAL CUE
// ============================================================================

function playCurrentIStartSignal() {
  return new Promise(function(resolve) {
    var AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContextClass) {
      window.setTimeout(resolve, 180);
      return;
    }

    var context =
      new AudioContextClass();

    var oscillator =
      context.createOscillator();

    var gain =
      context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.12,
      context.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.16
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    oscillator.stop(
      context.currentTime + 0.17
    );

    oscillator.onended = function() {
      context.close().finally(resolve);
    };
  });
}


function getCurrentIStartSignalState() {
  if (!window.CONVERSATION_V2_I_START_SIGNAL) {
    window.CONVERSATION_V2_I_START_SIGNAL = {
      pending: false
    };
  }

  return window.CONVERSATION_V2_I_START_SIGNAL;
}


// ============================================================================

// 🟦 BLOCK 17100: I FIRST SIGNAL INSTALLATION
// ============================================================================

function installCurrentIStartSignal() {
  var startButton =
    document.getElementById(
      'practiceStartStopButton'
    );

  if (!startButton) {
    return;
  }

  startButton.addEventListener(
    'click',
    function(event) {
      var roleState =
        getCurrentRolePlayState();

      var iStart =
        window.CONVERSATION_V2_PLAY_MODE ===
        'i-start';

      var rolePlay =
        getCurrentPracticeType() ===
        'role-play';

      var signalState =
        getCurrentIStartSignalState();

      if (
        roleState.running ||
        !iStart ||
        !rolePlay ||
        signalState.pending
      ) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      signalState.pending = true;

      playCurrentIStartSignal().then(
        function() {
          signalState.pending = false;

          if (
            !getCurrentRolePlayState().running
          ) {
            startCurrentRolePlay(true);
          }
        },

        function() {
          signalState.pending = false;
          startCurrentRolePlay(true);
        }
      );
    },
    true
  );
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentIStartSignal,
    { once: true }
  );
} else {
  installCurrentIStartSignal();
}


// ============================================================================

// 🟦 BLOCK 17200: LOCAL SETTINGS READ / SAVE
// ============================================================================

const CONVERSATION_V2_SETTINGS_KEY =
  'gongbooConversationV2SettingsV2';


function getConversationSettings() {
  try {
    var saved =
      localStorage.getItem(
        CONVERSATION_V2_SETTINGS_KEY
      );

    return saved
      ? JSON.parse(saved)
      : {};

  } catch (error) {
    console.warn(
      '[CONVERSATION V2] Settings read failed:',
      error
    );

    return {};
  }
}


function saveConversationSettings() {
  var settings = {
    pass:
      document.getElementById(
        'passRange'
      )?.value || '0',

    delay:
      document.getElementById(
        'delayRange'
      )?.value || '0.5',

    speed:
      document.getElementById(
        'speechSpeedRange'
      )?.value || '1',

    primaryLanguage:
      document.getElementById(
        'primaryLanguageSelect'
      )?.value || 'EN',

    secondaryLanguage:
      document.getElementById(
        'secondaryLanguageSelect'
      )?.value || 'NONE',

    loop:
      window.CONVERSATION_V2_LOOP_PLAY ===
      true,

    chunk:
      getCurrentSelectedChunkState().open ===
      true,

    playMode:
      window.CONVERSATION_V2_PLAY_MODE ||
      'computer',

    practiceType:
      getCurrentPracticeType(),

    continueMode:
      getCurrentContinueMode()
  };

  try {
    localStorage.setItem(
      CONVERSATION_V2_SETTINGS_KEY,
      JSON.stringify(settings)
    );

  } catch (error) {
    console.warn(
      '[CONVERSATION V2] Settings save failed:',
      error
    );
  }
}


// ============================================================================

// 🟦 BLOCK 17300: SETTINGS SELECT RESTORE
// ============================================================================

function restoreConversationSelectValue(
  selectId,
  value
) {
  var select =
    document.getElementById(selectId);

  if (!select || !value) {
    return;
  }

  var exists =
    Array.from(select.options).some(
      function(option) {
        return option.value === value;
      }
    );

  if (exists) {
    select.value = value;
  }
}


// ============================================================================

// 🟦 BLOCK 17400: SETTINGS RESTORE
// ============================================================================

function restoreConversationSettings() {
  var settings =
    getConversationSettings();

  [
    {
      inputId: 'passRange',
      outputId: 'passValue',
      value: settings.pass,
      suffix: '%'
    },
    {
      inputId: 'delayRange',
      outputId: 'delayValue',
      value: settings.delay,
      suffix: 's'
    },
    {
      inputId: 'speechSpeedRange',
      outputId: '',
      value: settings.speed,
      suffix: ''
    }
  ].forEach(function(item) {
    var input =
      document.getElementById(
        item.inputId
      );

    if (
      !input ||
      item.value === undefined ||
      item.value === null
    ) {
      return;
    }

    input.value = item.value;

    if (item.outputId) {
      updatePlayRangeValue(
        item.inputId,
        item.outputId,
        item.suffix
      );
    }
  });

  restoreConversationSelectValue(
    'primaryLanguageSelect',
    settings.primaryLanguage
  );

  restoreConversationSelectValue(
    'secondaryLanguageSelect',
    settings.secondaryLanguage
  );

  if (
    typeof settings.loop === 'boolean'
  ) {
    window.CONVERSATION_V2_LOOP_PLAY =
      settings.loop;

    renderPlayLoopToggle();
  }

  if (
    typeof settings.chunk === 'boolean'
  ) {
    getCurrentSelectedChunkState().open =
      settings.chunk;

    renderCurrentChunkButton();

    if (
      typeof renderCurrentSelectedChunks ===
      'function'
    ) {
      renderCurrentSelectedChunks();
    }
  }

  if (
    settings.playMode === 'computer' ||
    settings.playMode === 'i-start'
  ) {
    window.CONVERSATION_V2_PLAY_MODE =
      settings.playMode;
  }

  if (
    settings.practiceType === 'role-play' ||
    settings.practiceType === 'follow-up'
  ) {
    window.CONVERSATION_V2_PRACTICE_TYPE =
      settings.practiceType;
  }

  if (
    settings.continueMode === 'off' ||
    settings.continueMode === 'repeat' ||
    settings.continueMode === 'next'
  ) {
    window.CONVERSATION_V2_CONTINUE_MODE =
      settings.continueMode;

    renderCurrentContinueMode();
  }

  renderCurrentPracticeControls();
}


// ============================================================================

// 🟦 BLOCK 17500: SETTINGS STORAGE INSTALLATION
// ============================================================================

function installConversationSettingsStorage() {
  restoreConversationSettings();

  [
    'passRange',
    'delayRange',
    'speechSpeedRange',
    'primaryLanguageSelect',
    'secondaryLanguageSelect'
  ].forEach(function(id) {
    var control =
      document.getElementById(id);

    if (!control) {
      return;
    }

    control.addEventListener(
      'change',
      saveConversationSettings
    );

    control.addEventListener(
      'input',
      saveConversationSettings
    );
  });

  [
    'playLoopToggle',
    'chunkButton',
    'playModeToggleButton',
    'practiceModeToggleButton',
    'continueNextButton'
  ].forEach(function(id) {
    var button =
      document.getElementById(id);

    if (!button) {
      return;
    }

    button.addEventListener(
      'click',
      function() {
        window.setTimeout(
          saveConversationSettings,
          0
        );
      }
    );
  });

  [
    'primaryLanguageSelect',
    'secondaryLanguageSelect'
  ].forEach(function(id) {
    var select =
      document.getElementById(id);

    if (!select) {
      return;
    }

    new MutationObserver(
      restoreConversationSettings
    ).observe(
      select,
      { childList: true }
    );
  });
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installConversationSettingsStorage,
    { once: true }
  );
} else {
  installConversationSettingsStorage();
}


// ============================================================================

// 🟦 BLOCK 17600: ANDROID TTS WORD BOUNDARY LISTENER
// ============================================================================

function installCurrentAndroidTtsWordListener() {
  var nativeSpeech =
    getCurrentPsgNativeSpeech();

  if (
    !nativeSpeech ||
    typeof nativeSpeech.addListener !==
    'function'
  ) {
    return;
  }

  if (
    window.CONVERSATION_V2_TTS_WORD_LISTENER_READY
  ) {
    return;
  }

  window.CONVERSATION_V2_TTS_WORD_LISTENER_READY =
    true;

  nativeSpeech.addListener(
    'wordBoundary',
    function(payload) {
      highlightCurrentTtsWordAt(
        Number(payload.start)
      );
    }
  );

  console.log(
    '[CONVERSATION V2] Android TTS word listener ready'
  );
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentAndroidTtsWordListener,
    { once: true }
  );
} else {
  installCurrentAndroidTtsWordListener();
}


// ============================================================================

// 🟦 BLOCK 17700: SPACE PLAY / STOP TOGGLE
// ============================================================================

function isCurrentSpaceShortcutBlocked(
  target
) {
  if (!target || !target.closest) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, button, [contenteditable="true"]'
    )
  );
}


function installCurrentSpacePlayToggle() {
  document.addEventListener(
    'keydown',
    function(event) {
      var playButtonFocused =
        event.target &&
        event.target.id === 'playButton';

      if (
        event.code !== 'Space' ||
        event.repeat ||
        (
          isCurrentSpaceShortcutBlocked(
            event.target
          ) &&
          !playButtonFocused
        )
      ) {
        return;
      }

      var playMenuPanel =
        document.getElementById(
          'playMenuPanel'
        );

      if (
        playMenuPanel &&
        !playMenuPanel.hidden
      ) {
        return;
      }

      event.preventDefault();

      var playState =
        getCurrentPsgPlayState();

      if (playState.running) {
        stopCurrentPsgPlay();
        return;
      }

      resetCurrentPlayVisualState();
      startCurrentPsgPlay();
    }
  );
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentSpacePlayToggle,
    { once: true }
  );
} else {
  installCurrentSpacePlayToggle();
}


// ============================================================================

// 🟦 BLOCK 17800: PRACTICE RESET
// ============================================================================

function resetCurrentPracticeSession() {
  var targetTurn =
    getCurrentRoleTargetTurn();

  stopCurrentPsgPlay();
  stopCurrentRolePlay();
  stopCurrentMicRecognition();

  resetCurrentRolePlayResults();
  clearCurrentSpeakingCard();

  selectCurrentRoleTurn(
    targetTurn
  );

  renderCurrentPracticeControls();
}


function installCurrentPracticeResetButton() {
  var button =
    document.getElementById(
      'practiceResetButton'
    );

  if (!button) {
    return;
  }

  button.onclick = function() {
    resetCurrentPracticeSession();
  };
}


if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installCurrentPracticeResetButton,
    { once: true }
  );
} else {
  installCurrentPracticeResetButton();
}


// ============================================================================
// 8950–9899 RESERVED FOR FUTURE BLOCKS
// ============================================================================


// ============================================================================
// 🟩 9900 — HELP
// ============================================================================


// ============================================================================

// 🟦 BLOCK 17900: BUTTON HOVER HELP
// IMPORTANT: HELP remains ONE block even when longer than 120 lines.
// ============================================================================

function getCurrentButtonHoverHelp(button) {
  var helpById = {
    systemMenuButton:
      '시스템 메뉴 열기',

    playButton:
      '현재 선택 문장부터 재생',

    playMenuButton:
      'PLAY 옵션 열기 또는 닫기',

    stopButton:
      '재생, 역할 연습, 마이크를 중지',

    settingsButton:
      '재생 및 언어 설정 열기',

    playModeToggleButton:
      'COMPUTER와 I FIRST 순서 전환',

    practiceStartStopButton:
      '선택한 연습 시작 또는 중지',

    practiceModeToggleButton:
      'ROLE PLAY 연습 모드 전환',

    continueNextButton:
      '재생 후 반복 또는 다음 대화 진행 설정',

    practiceResetButton:
      '연습 결과와 선택 상태 초기화',

    playLoopToggle:
      '현재 대화 반복 재생 설정',

    chunkButton:
      '선택 문장의 세부 구간 표시',

    previousButton:
      '이전 대화로 이동',

    nextButton:
      '다음 대화로 이동'
  };

  var systemHelpByKey = {
    conversation:
      '대화 첫 화면 열기',

    license:
      '라이선스 안내 열기',

    bible:
      '성경 관련 화면 열기',

    easyLearning:
      'Easy Learning 열기'
  };

  if (helpById[button.id]) {
    return helpById[button.id];
  }

  var systemKey =
    String(
      button.dataset.systemKey || ''
    ).trim();

  if (systemHelpByKey[systemKey]) {
    return systemHelpByKey[systemKey];
  }

  var ariaLabel =
    String(
      button.getAttribute(
        'aria-label'
      ) || ''
    ).trim();

  if (ariaLabel) {
    return ariaLabel;
  }

  return String(
    button.textContent || ''
  )
    .replace(/\s+/g, ' ')
    .trim();
}


function applyCurrentButtonHoverHelp(root) {
  var scope =
    root || document;

  scope
    .querySelectorAll('button')
    .forEach(function(button) {
      if (
        button.hasAttribute('title') &&
        button.title.trim()
      ) {
        return;
      }

      var help =
        getCurrentButtonHoverHelp(
          button
        );

      if (help) {
        button.title = help;
      }
    });
}


function bootCurrentButtonHoverHelp() {
  var install = function() {
    applyCurrentButtonHoverHelp(
      document
    );

    new MutationObserver(
      function(records) {
        records.forEach(
          function(record) {
            record.addedNodes.forEach(
              function(node) {
                if (
                  !node ||
                  node.nodeType !== 1
                ) {
                  return;
                }

                if (
                  node.matches('button')
                ) {
                  var help =
                    getCurrentButtonHoverHelp(
                      node
                    );

                  if (help) {
                    node.title = help;
                  }
                }

                applyCurrentButtonHoverHelp(
                  node
                );
              }
            );
          }
        );
      }
    ).observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  };

  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      install,
      { once: true }
    );

    return;
  }

  install();
}


bootCurrentButtonHoverHelp();


// ============================================================================
// END: BUTTON HOVER HELP
// ============================================================================




// ============================================================================
// 🟦 BLOCK 18000: KAKAO IN-APP EXTERNAL BROWSER CONTROLLER
// Purpose: KakaoTalk in-app browser only.
// PC Chrome, normal Android Chrome, and APK are excluded.
// ============================================================================

function isCurrentKakaoInAppBrowser() {
  return /kakaotalk/i.test(
    String(navigator.userAgent || '')
  );
}

function getCurrentKakaoExternalTargetUrl() {
  var targetUrl =
    new URL(window.location.href);

  targetUrl.searchParams.set(
    'kakaoExternal',
    '1'
  );

  return targetUrl.toString();
}

function openCurrentKakaoInExternalBrowser() {
  var targetUrl =
    getCurrentKakaoExternalTargetUrl();

  window.location.href =
    'kakaotalk://web/openExternal?url=' +
    encodeURIComponent(targetUrl);
}

function bootCurrentKakaoExternalBrowserGuide() {
  if (!isCurrentKakaoInAppBrowser()) {
    return;
  }

  var guide =
    document.getElementById(
      'kakaoExternalBrowserGuide'
    );

  var button =
    document.getElementById(
      'kakaoExternalBrowserButton'
    );

  if (!guide || !button) {
    return;
  }

  guide.hidden = false;

  button.onclick = function() {
    openCurrentKakaoInExternalBrowser();
  };

  var attemptedKey =
    'gongbooKakaoExternalAttempted';

  try {
    if (sessionStorage.getItem(attemptedKey)) {
      return;
    }

    sessionStorage.setItem(
      attemptedKey,
      '1'
    );

    window.setTimeout(function() {
      openCurrentKakaoInExternalBrowser();
    }, 200);

  } catch (error) {
    // 자동 이동이 막혀도 사용자가 버튼을 눌러 시도할 수 있다.
  }
}

bootCurrentKakaoExternalBrowserGuide();






// ============================================================================
// PART 2 : LICENSE APPLICATION MODULE
// Source: verified license-main-backup.js.
// Scope: login header, catalog, entitlement questions, Learn / Play behavior.
// ============================================================================
/* ==========================================================================
   BLOCK 21000 : LICENSE TEMPLATE EXTENSION MODULE
   Conversation 템플릿을 수정하지 않고 License 기능만 확장한다.
   ========================================================================== */





(function () {
  'use strict';





/* ========================================================================
   BLOCK 21100 START : LICENSE STUDY STATE
   ======================================================================== */

let licenseCourses = [];

let licenseCurrentCourse = null;

let licenseQuestions = [];

let licenseQuestionIndex = 0;

let licenseAnswers = [];

let licenseMode = 'study';

let licenseContinueNext = true;

let licenseExplainVisible = true;

let licenseBatchOffset = 0;

const LICENSE_RESUME_STORAGE_KEY =
  'gongboo-license-resume-v1';

const LICENSE_BATCH_SIZES = Object.freeze({
  realestate: 150,
  insurance: 150,
  mortgage: 150,
  notary: 45
});

/* ========================================================================
   BLOCK 21100 END : LICENSE STUDY STATE
   ======================================================================== */




/* ========================================================================
   BLOCK 21200 START : LICENSE LOCAL RESUME STORAGE
   ======================================================================== */

function getLicenseBatchSize(productCode) {
  const code = String(productCode || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  return LICENSE_BATCH_SIZES[code] || 150;
}


function getLicenseSettingsSnapshot() {
  return {
    mode: licenseMode,

    explainVisible: licenseExplainVisible,

    continueNext: licenseContinueNext,

    primaryLanguage: document.getElementById(
      'primaryLanguageSelect'
    )?.value || 'EN',

    secondaryLanguage: document.getElementById(
      'secondaryLanguageSelect'
    )?.value || 'NONE',

    speechSpeed: document.getElementById(
      'speechSpeedRange'
    )?.value || '1',

    passScore: document.getElementById(
      'passRange'
    )?.value || '0',

    micDelay: document.getElementById(
      'delayRange'
    )?.value || '0.5',

    loopPlay: document.getElementById(
      'playLoopToggle'
    )?.getAttribute('aria-pressed') === 'true'
  };
}


function saveLicenseResume() {
  const snapshot = {
    version: 1,

    savedAt: Date.now(),

    settings: getLicenseSettingsSnapshot(),

    lesson: licenseCurrentCourse &&
      licenseQuestions.length
      ? {
          course: licenseCurrentCourse,

          questions: licenseQuestions,

          questionIndex: licenseQuestionIndex,

          answers: licenseAnswers,

          batchOffset: licenseBatchOffset
        }
      : null
  };

  try {
    localStorage.setItem(
      LICENSE_RESUME_STORAGE_KEY,
      JSON.stringify(snapshot)
    );
  } catch (error) {
    console.warn(
      '[LICENSE] Resume save failed:',
      error
    );
  }
}


function getLicenseResumeSnapshot() {
  try {
    const raw = localStorage.getItem(
      LICENSE_RESUME_STORAGE_KEY
    );

    if (!raw) {
      return null;
    }

    const snapshot = JSON.parse(raw);

    if (
      !snapshot ||
      snapshot.version !== 1
    ) {
      return null;
    }

    return snapshot;
  } catch (error) {
    console.warn(
      '[LICENSE] Resume read failed:',
      error
    );

    return null;
  }
}


function restoreLicenseSettings() {
  const snapshot = getLicenseResumeSnapshot();

  if (!snapshot?.settings) {
    return;
  }

  const settings = snapshot.settings;

  licenseMode = [
    'learn',
    'study',
    'exam'
  ].includes(settings.mode)
    ? settings.mode
    : 'study';

  licenseExplainVisible =
    settings.explainVisible !== false;

  licenseContinueNext =
    settings.continueNext !== false;

  window.CONVERSATION_V2_CONTINUE_MODE =
    licenseContinueNext ? 'next' : 'off';

  document.documentElement.dataset.licenseMode =
    licenseMode;

  document.documentElement.dataset.licenseExplain =
    licenseExplainVisible ? 'on' : 'off';


  function restoreControl(id, value) {
    const control = document.getElementById(id);

    if (!control || value === undefined) {
      return;
    }

    control.value = String(value);
  }


  restoreControl(
    'primaryLanguageSelect',
    settings.primaryLanguage
  );

  restoreControl(
    'secondaryLanguageSelect',
    settings.secondaryLanguage
  );

  restoreControl(
    'speechSpeedRange',
    settings.speechSpeed
  );

  restoreControl(
    'passRange',
    settings.passScore
  );

  restoreControl(
    'delayRange',
    settings.micDelay
  );


  const loopButton = document.getElementById(
    'playLoopToggle'
  );

  if (loopButton) {
    loopButton.setAttribute(
      'aria-pressed',
      String(settings.loopPlay === true)
    );

    loopButton.textContent =
      settings.loopPlay === true
        ? '↻ ON'
        : '↻ OFF';

    window.CONVERSATION_V2_LOOP_PLAY =
      settings.loopPlay === true;
  }
}


function resumeStoredLicenseLesson() {
  const snapshot = getLicenseResumeSnapshot();

  const lesson = snapshot?.lesson;

  if (
    !lesson ||
    !lesson.course ||
    !Array.isArray(lesson.questions) ||
    !lesson.questions.length
  ) {
    return;
  }

  licenseCurrentCourse = lesson.course;

  licenseQuestions = lesson.questions;

  licenseBatchOffset = Math.max(
    0,
    Number(lesson.batchOffset) || 0
  );

  licenseQuestionIndex = Math.max(
    0,
    Math.min(
      licenseQuestions.length - 1,
      Number(lesson.questionIndex) || 0
    )
  );

  licenseAnswers = Array.isArray(lesson.answers)
    ? lesson.answers.slice(
        0,
        licenseQuestions.length
      )
    : [];

  while (
    licenseAnswers.length <
    licenseQuestions.length
  ) {
    licenseAnswers.push(null);
  }

  enterLicenseQuestionScreen();

  renderLicenseQuestion();

  saveLicenseResume();
}


function installLicenseResumePersistence() {
  document.addEventListener(
    'change',
    function (event) {
      if (
        !event.target.matches(
          [
            '#primaryLanguageSelect',
            '#secondaryLanguageSelect',
            '#speechSpeedRange',
            '#passRange',
            '#delayRange',
            '#playLoopToggle'
          ].join(',')
        )
      ) {
        return;
      }

      saveLicenseResume();
    }
  );


  document.addEventListener(
    'input',
    function (event) {
      if (
        !event.target.matches(
          '#speechSpeedRange, #passRange, #delayRange'
        )
      ) {
        return;
      }

      saveLicenseResume();
    }
  );
}

/* ========================================================================
   BLOCK 21200 END : LICENSE LOCAL RESUME STORAGE
   ======================================================================== */





  /* ========================================================================
     BLOCK 21300 : TEMPLATE ELEMENT ACCESS
     Conversation 템플릿의 기존 목록 영역을 그대로 사용한다.
     ======================================================================== */

  function getTemplateElements() {
    return {
      app: document.getElementById('conversationApp'),

      directory: document.getElementById(
        'conversationDirectory'
      ),

      breadcrumb: document.getElementById(
        'conversationDirectoryBreadcrumb'
      ),

      list: document.getElementById(
        'conversationDirectoryList'
      ),

      lesson: document.getElementById(
        'conversationLesson'
      ),

      status: document.getElementById(
        'conversationStatus'
      )
    };
  }





  /* ========================================================================
     BLOCK 21400 : LICENSE MENU CONNECTION
     LICENSE 클릭을 Conversation Template보다 먼저 처리하고 메뉴를 닫는다.
     ======================================================================== */

  function installLicenseMenuConnection() {
    window.addEventListener(
      'click',
      function (event) {
        const button = event.target.closest(
          '[data-system-key]'
        );

        if (!button) {
          return;
        }

        if (button.dataset.systemKey !== 'license') {
          return;
        }

        event.preventDefault();

        event.stopImmediatePropagation();

        const systemMenu = document.getElementById(
          'systemMenuPanel'
        );

        const systemMenuButton = document.getElementById(
          'systemMenuButton'
        );

        if (systemMenu) {
          systemMenu.hidden = true;
        }

        if (systemMenuButton) {
          systemMenuButton.setAttribute(
            'aria-expanded',
            'false'
          );
        }

        renderLicenseDirectory();
      },
      true
    );
  }




/* ========================================================================
   BLOCK 21500 START : LOGIN / LOGOUT HEADER BUTTON
   ======================================================================== */

function installLicenseAuthButton() {
  const config = window.LICENSE_CONFIG;

  const button = document.getElementById(
    'licenseLoginButton'
  );

  if (!config || !button) {
    return;
  }

  let session = null;

  try {
    session = JSON.parse(
      localStorage.getItem(config.authStorageKey) || 'null'
    );
  } catch (error) {
    session = null;
  }

  const isLoggedIn = Boolean(session?.access_token);

  button.textContent = isLoggedIn ? 'LOGOUT' : 'LOGIN';

  button.href = isLoggedIn ? '#' : 'login.html';

  button.onclick = event => {
    if (!isLoggedIn) {
      return;
    }

    event.preventDefault();

    localStorage.removeItem(config.authStorageKey);

    window.location.href = 'login.html';
  };
}

/* ========================================================================
   BLOCK 21500 END : LOGIN / LOGOUT HEADER BUTTON
   ======================================================================== */





/* ========================================================================
   BLOCK 21600 START : LICENSE EXTENSION INITIALIZATION
   ======================================================================== */

function bootLicenseExtension() {
  restoreLicenseSettings();

  installLicenseAuthButton();

  installLicenseMenuConnection();

  installLicenseModeSettings();

  installLicenseQuestionButtons();

  installLicenseKeyboardNavigation();

  installLicensePlayMenuBridge();

  installLicenseLearnPlayFilter();

  installLicenseResumePersistence();

  openInitialLicenseDirectory();

  console.log('[LICENSE] Template extension ready.');
}

/* ========================================================================
   BLOCK 21600 END : LICENSE EXTENSION INITIALIZATION
   ======================================================================== */





  /* ========================================================================
     BLOCK 21700 START : INITIAL LICENSE ROUTE
     ======================================================================== */

  function openInitialLicenseDirectory() {
    renderLicenseDirectory();
  }

  /* ========================================================================
     BLOCK 21700 END : INITIAL LICENSE ROUTE
     ======================================================================== */
  




  /* ========================================================================
     BLOCK 21800 : LICENSE CATALOG API
     새 EasyLearning의 license-content Function에서 과목 목록을 읽는다.
     ======================================================================== */

  async function fetchLicenseCatalog() {
    const config = window.LICENSE_CONFIG;

    if (!config) {
      throw new Error(
        'LICENSE_CONFIG is unavailable.'
      );
    }

    const response = await fetch(
      `${config.url}/functions/v1/${config.functionName}`,
      {
        method: 'POST',

        headers: {
          apikey: config.publishableKey,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          action: 'catalog'
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || 'Catalog request failed.'
      );
    }

    if (!Array.isArray(result.products)) {
      throw new Error(
        'Catalog response has no products.'
      );
    }

    return result.products;
  }





  /* ========================================================================
     BLOCK 21900 : LICENSE CATALOG DATA NORMALIZATION
     API 응답 중 화면에 표시 가능한 과목만 정리한다.
     ======================================================================== */

  function normalizeLicenseCourses(products) {
    return products
      .filter(function (course) {
        return (
          typeof course.product_code === 'string' &&
          typeof course.title === 'string'
        );
      })
      .map(function (course) {
        return {
          productCode: course.product_code,

          title: course.title,

          totalQuestionCount: Number(
            course.total_question_count
          ) || 0,

          setCount: Number(course.set_count) || 0,

          setSize: Number(course.set_size) || 0
        };
      });
  }





/* ========================================================================
   BLOCK 22000 START : LICENSE DIRECTORY RENDERING
   ======================================================================== */

async function renderLicenseDirectory() {
  const elements = getTemplateElements();

  if (
    !elements.app ||
    !elements.directory ||
    !elements.breadcrumb ||
    !elements.list
  ) {
    console.error(
      '[LICENSE] Template directory elements are missing.'
    );

    return;
  }

  elements.directory.hidden = false;

  elements.app.classList.add(
    'conversation-directory-open'
  );

  if (elements.lesson) {
    elements.lesson.hidden = true;
  }

  const licenseLesson = document.getElementById(
    'licenseLesson'
  );

  if (licenseLesson) {
    licenseLesson.hidden = true;
  }

  if (elements.status) {
    elements.status.textContent =
      'Loading license courses...';
  }

  elements.breadcrumb.innerHTML = '';

  elements.list.innerHTML = '';


  const home = document.createElement('button');

  home.type = 'button';

  home.className =
    'conversation-directory-breadcrumb-item';

  home.textContent = 'LICENSE';

  home.onclick = renderLicenseDirectory;

  elements.breadcrumb.appendChild(home);


  const loading = document.createElement('div');

  loading.className =
    'conversation-directory-loading';

  loading.textContent =
    'LOADING LICENSE COURSES…';

  elements.list.appendChild(loading);


  try {
    const products = await fetchLicenseCatalog();

    licenseCourses = normalizeLicenseCourses(
      products
    );

    elements.list.innerHTML = '';


    const snapshot = getLicenseResumeSnapshot();

    const lesson = snapshot?.lesson;

    if (
      lesson?.course &&
      Array.isArray(lesson.questions) &&
      lesson.questions.length
    ) {
      const resumeButton = document.createElement(
        'button'
      );

      const resumeQuestion =
        Math.max(
          0,
          Number(lesson.questionIndex) || 0
        ) + 1;

      resumeButton.type = 'button';

      resumeButton.className =
        'conversation-directory-item is-directory-title';

      resumeButton.textContent =
        'RESUME · ' +
        lesson.course.title +
        ' · Question ' +
        resumeQuestion +
        ' / ' +
        lesson.questions.length;

      resumeButton.onclick =
        resumeStoredLicenseLesson;

      elements.list.appendChild(resumeButton);
    }


    licenseCourses.forEach(function (course) {
      const item = document.createElement('button');

      item.type = 'button';

      item.className =
        'conversation-directory-item is-directory-title';

      item.dataset.licenseProduct =
        course.productCode;

      item.textContent = course.totalQuestionCount
        ? course.title +
          ' · ' +
          course.totalQuestionCount +
          ' questions'
        : course.title;

      item.onclick = function () {
        selectLicenseCourse(course);
      };

      elements.list.appendChild(item);
    });


    if (elements.status) {
      elements.status.textContent =
        'License courses loaded';
    }
  } catch (error) {
    elements.list.innerHTML = '';

    const failure = document.createElement('div');

    failure.className =
      'conversation-directory-empty';

    failure.textContent =
      'License courses could not be loaded.';

    elements.list.appendChild(failure);

    if (elements.status) {
      elements.status.textContent =
        'License catalog failed';
    }

    console.error(
      '[LICENSE] Catalog load failed:',
      error
    );
  }
}

/* ========================================================================
   BLOCK 22000 END : LICENSE DIRECTORY RENDERING
   ======================================================================== */




 /* ========================================================================
   BLOCK 22100 START : LICENSE COURSE SELECTION
   ======================================================================== */

async function selectLicenseCourse(course) {
  const elements = getTemplateElements();

  const batchSize = getLicenseBatchSize(
    course.productCode
  );

  if (elements.status) {
    elements.status.textContent =
      'Loading ' +
      course.title +
      ' questions...';
  }

  try {
    const result = await fetchLicenseQuestions(
      course.productCode,
      batchSize,
      0
    );

    licenseCurrentCourse = course;

    licenseQuestions = normalizeLicenseQuestions(
      result.data
    );

    licenseBatchOffset = 0;

    licenseQuestionIndex = 0;

    licenseAnswers = new Array(
      licenseQuestions.length
    ).fill(null);

    if (!licenseQuestions.length) {
      throw new Error(
        'No questions are available for this course.'
      );
    }

    enterLicenseQuestionScreen();

    renderLicenseQuestion();

    saveLicenseResume();

    if (elements.status) {
      elements.status.textContent =
        course.title +
        ' ' +
        licenseQuestions.length +
        ' questions loaded';
    }
  } catch (error) {
    if (elements.status) {
      elements.status.textContent =
        'Question load failed';
    }

    console.error(
      '[LICENSE] Question load failed:',
      error
    );
  }
}

/* ========================================================================
   BLOCK 22100 END : LICENSE COURSE SELECTION
   ======================================================================== */






/* ========================================================================
   BLOCK 22200 START : LICENSE QUESTION API
   로그인 세션 토큰을 포함해 License 문제와 권한을 조회한다.
   ======================================================================== */

async function fetchLicenseQuestions(
  productCode,
  limit,
  offset
) {
  const config = window.LICENSE_CONFIG;

  let session = null;

  try {
    session = JSON.parse(
      localStorage.getItem(config.authStorageKey) || 'null'
    );
  } catch (error) {
    session = null;
  }

  const headers = {
    apikey: config.publishableKey,
    'Content-Type': 'application/json'
  };

  if (session?.access_token) {
    headers.Authorization =
      'Bearer ' + session.access_token;
  }

  const response = await fetch(
    `${config.url}/functions/v1/${config.functionName}`,
    {
      method: 'POST',

      headers: headers,

      body: JSON.stringify({
        action: 'questions',

        product: productCode,

        languages: ['en', 'ko'],

        limit: limit,

        offset: offset
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || 'Question request failed.'
    );
  }

  return result;
}

/* ========================================================================
   BLOCK 22200 END : LICENSE QUESTION API
   ======================================================================== */







  /* ========================================================================
     BLOCK 22300 : LICENSE QUESTION DATA NORMALIZATION
     영문과 한글 번역 데이터를 문제 화면용으로 정리한다.
     ======================================================================== */

  function normalizeLicenseQuestions(questions) {
    return (Array.isArray(questions) ? questions : [])
      .map(function (question) {
        const translations = Array.isArray(
          question.license_question_translations
        )
          ? question.license_question_translations
          : [];

        const byLanguage = {};

        translations.forEach(function (translation) {
          const language = String(
            translation.language_code || ''
          ).toLowerCase();

          byLanguage[language] = translation;
        });

        return {
          questionId: question.question_id,

          answer: Number(question.answer),

          english: byLanguage.en || {},

          korean: byLanguage.ko || {}
        };
      });
  }





  /* ========================================================================
     BLOCK 22400 : LICENSE QUESTION SCREEN ENTRY
     Conversation 본문을 숨기고 License 문제 화면을 연다.
     ======================================================================== */

  function enterLicenseQuestionScreen() {
    const elements = getTemplateElements();

    const licenseLesson = document.getElementById(
      'licenseLesson'
    );

    if (!licenseLesson) {
      throw new Error(
        'License question template is missing.'
      );
    }

    elements.directory.hidden = true;

    elements.app.classList.remove(
      'conversation-directory-open'
    );

    if (elements.lesson) {
      elements.lesson.hidden = true;
    }

    licenseLesson.hidden = false;
  }





    /* ========================================================================
// ============================================================================
// PART 3 : LICENSE LESSON EXECUTION
// Scope: question rendering, Learn / Play flow, answer processing, results,
//        and License runtime bootstrap.
/* ============================================================================
   BLOCK 31000 START : LICENSE QUESTION LANGUAGE SELECTION
   ============================================================================ */

function renderLicenseQuestion() {
  const question = licenseQuestions[
    licenseQuestionIndex
  ];

  const progressText = document.getElementById(
    'licenseProgressText'
  );

  const questionNumber = document.getElementById(
    'licenseQuestionNumber'
  );

  const prompt = document.getElementById(
    'licenseQuestionPrompt'
  );

  const choices = document.getElementById(
    'licenseQuestionChoices'
  );

  const feedback = document.getElementById(
    'licenseQuestionFeedback'
  );

  if (
    !question ||
    !progressText ||
    !questionNumber ||
    !prompt ||
    !choices ||
    !feedback
  ) {
    return;
  }

  function normalizeLanguage(value) {
    const code = String(value || '')
      .trim()
      .toUpperCase();

    if (code === 'ENG') {
      return 'EN';
    }

    if (code === 'KOR') {
      return 'KO';
    }

    return code;
  }

  const primaryLanguage = normalizeLanguage(
    document.getElementById(
      'primaryLanguageSelect'
    )?.value || 'EN'
  );

  const secondaryLanguage = normalizeLanguage(
    document.getElementById(
      'secondaryLanguageSelect'
    )?.value || 'NONE'
  );

  const languageCodes = [
    primaryLanguage,
    secondaryLanguage
  ].filter(function (code, index, values) {
    return (
      (code === 'EN' || code === 'KO') &&
      values.indexOf(code) === index
    );
  });

  if (!languageCodes.length) {
    languageCodes.push('EN');
  }

  window.CONVERSATION_V2_ROW = {
    LNG: languageCodes[0]
  };

  window.CONVERSATION_V2_SECONDARY_ROW = {
    LNG: languageCodes[1] || languageCodes[0]
  };

  function getText(language, field) {
    const translation = language === 'KO'
      ? question.korean
      : question.english;

    return translation[field] || '';
  }

  function appendSpeechText(
    container,
    tagName,
    language,
    text,
    position,
    className
  ) {
    if (!text) {
      return;
    }

    const element = document.createElement(tagName);

    element.className =
      className +
      ' ' +
      (language === 'KO'
        ? 'language-line-ko'
        : 'language-line-en') +
      ' ' +
      (position === 0
        ? 'conversation-turn-text'
        : 'conversation-secondary-text');

    element.textContent = text;

    container.appendChild(element);
  }

  const currentAnswer = licenseAnswers[
    licenseQuestionIndex
  ];

  const correctAnswer = Number(question.answer);

  const totalQuestionCount = Number(
    licenseCurrentCourse.totalQuestionCount ||
    licenseQuestions.length
  );

  progressText.textContent = '';

  questionNumber.textContent =
    'Question ' +
    String(licenseQuestionIndex + 1) +
    ' / ' +
    String(totalQuestionCount);

  prompt.innerHTML = '';
  choices.innerHTML = '';
  feedback.innerHTML = '';

  const questionCard = document.createElement('article');

  questionCard.className =
    'license-prompt-card conversation-turn-card';

  questionCard.dataset.turn = '1';

  languageCodes.forEach(function (language, position) {
    appendSpeechText(
      questionCard,
      'p',
      language,
      getText(language, 'question_text'),
      position,
      'license-question-line'
    );
  });

  prompt.appendChild(questionCard);

  [1, 2, 3, 4].forEach(function (number) {
    const choice = document.createElement('button');

    const letter = document.createElement('span');

    const content = document.createElement('span');

    const selected = currentAnswer === number;

    const correct = number === correctAnswer;

    choice.type = 'button';

    choice.className =
      'choice license-choice conversation-turn-card';

    choice.dataset.turn = String(number + 1);

    choice.dataset.licenseAnswer = String(number);

    letter.className = 'choice-letter license-choice-letter';

    letter.textContent = String.fromCharCode(
      64 + number
    );

    content.className =
      'choice-language-content license-choice-content';

    languageCodes.forEach(function (language, position) {
      appendSpeechText(
        content,
        'span',
        language,
        getText(language, 'option_' + number),
        position,
        'license-choice-' +
          (language === 'KO' ? 'korean' : 'english')
      );
    });

    choice.appendChild(letter);
    choice.appendChild(content);

    if (licenseMode === 'learn' && correct) {
      choice.classList.add('correct', 'disabled');
      choice.disabled = true;
    }

    if (licenseMode === 'study' && currentAnswer !== null) {
      if (correct) {
        choice.classList.add('correct');
      }

      if (selected) {
        choice.classList.add(
          'selected',
          correct ? 'correct' : 'incorrect'
        );
      }
    }

    if (licenseMode === 'exam' && selected) {
      choice.classList.add('selected');
    }

    choice.onclick = function () {
      selectLicenseAnswer(number);
    };

    choices.appendChild(choice);
  });

  if (
    licenseMode === 'learn' &&
    licenseExplainVisible
  ) {
    renderLicenseExplanation(
      feedback,
      true,
      question
    );
  }

  if (
    licenseMode === 'study' &&
    currentAnswer !== null &&
    licenseExplainVisible
  ) {
    renderLicenseExplanation(
      feedback,
      currentAnswer === correctAnswer,
      question
    );
  }
}

/* ============================================================================
   BLOCK 31000 END : LICENSE QUESTION LANGUAGE SELECTION
   ============================================================================ */


  /* ========================================================================
     BLOCK 31100 START : LICENSE EXPLANATION LANGUAGE SELECTION
     ======================================================================== */

  function renderLicenseExplanation(
    container,
    correct,
    question
  ) {
    function normalizeLanguage(value) {
      const code = String(value || '')
        .trim()
        .toUpperCase();

      if (code === 'ENG') {
        return 'EN';
      }

      if (code === 'KOR') {
        return 'KO';
      }

      return code;
    }

    const primaryLanguage = normalizeLanguage(
      document.getElementById(
        'primaryLanguageSelect'
      )?.value || 'EN'
    );

    const secondaryLanguage = normalizeLanguage(
      document.getElementById(
        'secondaryLanguageSelect'
      )?.value || 'NONE'
    );

    const languageCodes = [
      primaryLanguage,
      secondaryLanguage
    ].filter(function (code, index, values) {
      return (
        (code === 'EN' || code === 'KO') &&
        values.indexOf(code) === index
      );
    });

    if (!languageCodes.length) {
      languageCodes.push('EN');
    }

    const explanation = document.createElement('div');

    const title = document.createElement('strong');

    explanation.className =
      'explanation show ' +
      (correct ? 'correct' : 'incorrect');

    title.textContent = correct
      ? 'Correct'
      : 'Review the rule';

    explanation.appendChild(title);

    languageCodes.forEach(function (language) {
      const line = document.createElement('div');

      line.className =
        'explanation-language-line ' +
        (language === 'KO'
          ? 'language-line-ko'
          : 'language-line-en');

      line.textContent = language === 'KO'
        ? question.korean.explanation || ''
        : question.english.explanation || '';

      if (line.textContent) {
        explanation.appendChild(line);
      }
    });

    container.appendChild(explanation);
  }

  /* ========================================================================
     BLOCK 31100 END : LICENSE EXPLANATION LANGUAGE SELECTION
     ======================================================================== */



  /* ========================================================================
     BLOCK 31200 : LICENSE QUESTION TEXT CARD
     Template 카드 구조로 영문·한글 질문과 해설을 표시한다.
     ======================================================================== */

  function appendLicenseTextCard(
    container,
    label,
    text
  ) {
    if (!text) {
      return;
    }

    const card = document.createElement('article');

    const title = document.createElement('strong');

    const content = document.createElement('span');

    card.className = 'conversation-turn-card';

    title.className = 'conversation-turn-speaker';

    content.className = 'conversation-turn-text';

    title.textContent = label + ':';

    content.textContent = text;

    card.appendChild(title);

    card.appendChild(content);

    container.appendChild(card);
  }





/* ========================================================================
   BLOCK 31300 START : ORIGINAL LICENSE ANSWER SELECTION
   ======================================================================== */

function selectLicenseAnswer(answer) {
  if (licenseMode === 'learn') {
    return;
  }

  licenseAnswers[
    licenseQuestionIndex
  ] = answer;

  saveLicenseResume();

  renderLicenseQuestion();
}

/* ========================================================================
   BLOCK 31300 END : ORIGINAL LICENSE ANSWER SELECTION
   ======================================================================== */




/* ========================================================================
   BLOCK 31400 START : LICENSE QUESTION NAVIGATION
   ======================================================================== */

function moveLicenseQuestion(direction) {
  const nextIndex = Math.max(
    0,
    Math.min(
      licenseQuestions.length - 1,
      licenseQuestionIndex + direction
    )
  );

  licenseQuestionIndex = nextIndex;

  saveLicenseResume();

  renderLicenseQuestion();
}


function skipLicenseQuestion() {
  if (
    licenseAnswers[licenseQuestionIndex] === null
  ) {
    licenseAnswers[licenseQuestionIndex] = -1;
  }

  saveLicenseResume();

  moveLicenseQuestion(1);
}


function quitLicenseQuestion() {
  saveLicenseResume();

  const elements = getTemplateElements();

  const licenseLesson = document.getElementById(
    'licenseLesson'
  );

  if (licenseLesson) {
    licenseLesson.hidden = true;
  }

  if (elements.status) {
    elements.status.textContent =
      'License courses';
  }

  renderLicenseDirectory();
}

/* ========================================================================
   BLOCK 31400 END : LICENSE QUESTION NAVIGATION
   ======================================================================== */




/* ========================================================================
   BLOCK 31500 START : ORIGINAL LICENSE BUTTON CONNECTION
   ======================================================================== */

function installLicenseQuestionButtons() {
  const previousButton = document.getElementById(
    'prevBtn'
  );

  const skipButton = document.getElementById(
    'skipBtn'
  );

  const nextButton = document.getElementById(
    'nextBtn'
  );

  const submitButton = document.getElementById(
    'submitBtn'
  );

  const quitButton = document.getElementById(
    'quitBtn'
  );


  previousButton.onclick = function () {
    moveLicenseQuestion(-1);
  };

  skipButton.onclick = function () {
    skipLicenseQuestion();
  };

  nextButton.onclick = function () {
    moveLicenseQuestion(1);
  };

  submitButton.onclick = function () {
    showLicenseResults();
  };

  quitButton.onclick = function () {
    quitLicenseQuestion();
  };


  installLicenseResults();
}

/* ========================================================================
   BLOCK 31500 END : ORIGINAL LICENSE BUTTON CONNECTION
   ======================================================================== */
 




  /* ========================================================================
     BLOCK 31600 START : LICENSE KEYBOARD NAVIGATION
     ======================================================================== */

  function installLicenseKeyboardNavigation() {
    document.addEventListener(
      'keydown',
      function (event) {
        const licenseLesson = document.getElementById(
          'licenseLesson'
        );

        const target = event.target;

        if (
          !licenseLesson ||
          licenseLesson.hidden ||
          target.matches('input, select, textarea')
        ) {
          return;
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();

          moveLicenseQuestion(-1);
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();

          moveLicenseQuestion(1);
        }
      }
    );
  }

  /* ========================================================================
     BLOCK 31600 END : LICENSE KEYBOARD NAVIGATION
     ======================================================================== */





/* ========================================================================
   BLOCK 31700 START : LICENSE MODE AND EXPLAIN SETTINGS
   ======================================================================== */

function installLicenseModeSettings() {
  const modeButtons = document.querySelectorAll(
    '[data-license-mode]'
  );

  const explainButton = document.getElementById(
    'licenseExplainToggle'
  );

  const timerButton = document.getElementById(
    'licenseExamTimerButton'
  );


  function renderModeButtons() {
    modeButtons.forEach(function (modeButton) {
      const active =
        modeButton.dataset.licenseMode === licenseMode;

      modeButton.classList.toggle(
        'is-active',
        active
      );

      modeButton.setAttribute(
        'aria-pressed',
        String(active)
      );
    });
  }


  function renderExplainButton() {
    document.documentElement.dataset.licenseExplain =
      licenseExplainVisible ? 'on' : 'off';

    if (!explainButton) {
      return;
    }

    explainButton.textContent = licenseExplainVisible
      ? 'EXPLAIN: ON'
      : 'EXPLAIN: OFF';

    explainButton.setAttribute(
      'aria-pressed',
      String(licenseExplainVisible)
    );
  }


  function renderExamTimerButton() {
    if (!timerButton) {
      return;
    }

    const isExam = licenseMode === 'exam';

    timerButton.disabled = !isExam;

    timerButton.setAttribute(
      'aria-disabled',
      String(!isExam)
    );

    timerButton.textContent = isExam
      ? '⏱ TIMER'
      : '⏱ OFF';
  }


  modeButtons.forEach(function (button) {
    button.onclick = function () {
      licenseMode = button.dataset.licenseMode;

      document.documentElement.dataset.licenseMode =
        licenseMode;

      renderModeButtons();

      renderExamTimerButton();

      saveLicenseResume();

      const licenseLesson = document.getElementById(
        'licenseLesson'
      );

      if (
        licenseLesson &&
        !licenseLesson.hidden &&
        licenseQuestions.length
      ) {
        renderLicenseQuestion();
      }
    };
  });


  if (explainButton) {
    explainButton.onclick = function () {
      licenseExplainVisible =
        !licenseExplainVisible;

      renderExplainButton();

      saveLicenseResume();
    };
  }


  renderModeButtons();

  renderExplainButton();

  renderExamTimerButton();
}

/* ========================================================================
   BLOCK 31700 END : LICENSE MODE AND EXPLAIN SETTINGS
   ======================================================================== */




/* ========================================================================
   BLOCK 31800 START : TEMPLATE PLAY CONTINUE NEXT FOR LICENSE
   ======================================================================== */

function installLicensePlayMenuBridge() {
  const disabledControlIds = [
    'playModeToggleButton',
    'practiceStartStopButton',
    'practiceModeToggleButton',
    'practiceResetButton'
  ];


  function lockDisabledControl(id) {
    const button = document.getElementById(id);

    if (!button) {
      return;
    }

    if (!button.disabled) {
      button.disabled = true;
    }

    if (
      button.getAttribute('aria-disabled') !==
      'true'
    ) {
      button.setAttribute(
        'aria-disabled',
        'true'
      );
    }
  }


  disabledControlIds.forEach(
    lockDisabledControl
  );


  const playMenuPanel = document.getElementById(
    'playMenuPanel'
  );

  if (playMenuPanel) {
    const controlLockObserver =
      new MutationObserver(function () {
        disabledControlIds.forEach(
          lockDisabledControl
        );
      });

    controlLockObserver.observe(
      playMenuPanel,
      {
        subtree: true,
        attributes: true,
        attributeFilter: [
          'disabled',
          'aria-disabled'
        ]
      }
    );
  }


  const continueButton = document.getElementById(
    'continueNextButton'
  );

  if (continueButton) {
    continueButton.onclick = function () {
      licenseContinueNext = !licenseContinueNext;

      window.CONVERSATION_V2_CONTINUE_MODE =
        licenseContinueNext ? 'next' : 'off';

      continueButton.textContent =
        licenseContinueNext
          ? 'CONTINUE: NEXT'
          : 'CONTINUE: OFF';

      continueButton.setAttribute(
        'aria-pressed',
        String(licenseContinueNext)
      );

      saveLicenseResume();
    };

    continueButton.textContent = 'CONTINUE: NEXT';

    continueButton.setAttribute(
      'aria-pressed',
      'true'
    );
  }


  window.CONVERSATION_V2_CONTINUE_MODE = 'next';


  const templateContinue =
    window.continueCurrentPsgAfterFinish;

  if (typeof templateContinue !== 'function') {
    return;
  }


  window.continueCurrentPsgAfterFinish =
    async function (runId) {
      const licenseLesson = document.getElementById(
        'licenseLesson'
      );

      const playState =
        window.CONVERSATION_V2_PLAY || {};

      if (
        !licenseLesson ||
        licenseLesson.hidden ||
        !licenseContinueNext ||
        playState.running ||
        playState.runId !== runId
      ) {
        return templateContinue(runId);
      }

      if (
        licenseQuestionIndex >=
        licenseQuestions.length - 1
      ) {
        return;
      }


      moveLicenseQuestion(1);


      window.setTimeout(function () {
        prepareLicenseLearnPlayTargets();

        window.startCurrentPsgPlay?.();
      }, 180);
    };
}

/* ========================================================================
   BLOCK 31800 END : TEMPLATE PLAY CONTINUE NEXT FOR LICENSE
   ======================================================================== */



/* ========================================================================
   BLOCK 31900 START : LEARN MODE PLAY TARGET FILTER
   ======================================================================== */

function prepareLicenseLearnPlayTargets() {
  if (licenseMode !== 'learn') {
    return;
  }


  const question = licenseQuestions[
    licenseQuestionIndex
  ];

  if (!question) {
    return;
  }


  const correctAnswer = Number(
    question.answer
  );


  document
    .querySelectorAll(
      '#licenseLesson .license-choice'
    )
    .forEach(function (choice) {
      const answer = Number(
        choice.dataset.licenseAnswer
      );

      choice.classList.toggle(
        'conversation-turn-card',
        answer === correctAnswer
      );
    });


  const explanation = document.querySelector(
    '#licenseQuestionFeedback .explanation'
  );

  if (!explanation) {
    return;
  }


  explanation.classList.toggle(
    'conversation-turn-card',
    licenseExplainVisible
  );


  if (!licenseExplainVisible) {
    return;
  }


  explanation.dataset.turn = '6';


  const english = explanation.querySelector(
    '.language-line-en'
  );

  const korean = explanation.querySelector(
    '.language-line-ko'
  );

  if (english) {
    english.classList.add(
      'conversation-turn-text'
    );
  }

  if (korean) {
    korean.classList.add(
      'conversation-secondary-text'
    );
  }
}


function installLicenseLearnPlayFilter() {
  window.addEventListener(
    'click',
    function (event) {
      const playButton = event.target.closest(
        '#playButton'
      );

      const licenseLesson = document.getElementById(
        'licenseLesson'
      );

      if (
        !playButton ||
        !licenseLesson ||
        licenseLesson.hidden
      ) {
        return;
      }

      prepareLicenseLearnPlayTargets();
    },
    true
  );
}

/* ========================================================================
   BLOCK 31900 END : LEARN MODE PLAY TARGET FILTER
   ======================================================================== */



/* ========================================================================
   BLOCK 32000 start : ORIGINAL LICENSE RESULT FUNCTIONS
   ======================================================================== */

function syncLicenseQuestionNumber() {
  const questionNumber = document.getElementById(
    'licenseQuestionNumber'
  );

  const question = licenseQuestions[
    licenseQuestionIndex
  ];

  if (!questionNumber || !question) {
    return;
  }

  const subject = String(
    licenseCurrentCourse?.title || 'License'
  )
    .replace(/\s+NMLS$/i, '')
    .trim();

  questionNumber.textContent =
    subject +
    ' ' +
    String(licenseQuestionIndex + 1) +
    ' / ' +
    String(licenseQuestions.length) +
    ' · #' +
    String(question.questionId || '—');
}


function syncLicenseSubmitButton() {
  const previousButton = document.getElementById(
    'prevBtn'
  );

  const skipButton = document.getElementById(
    'skipBtn'
  );

  const nextButton = document.getElementById(
    'nextBtn'
  );

  const submitButton = document.getElementById(
    'submitBtn'
  );

  const isLastQuestion =
    licenseQuestionIndex ===
    licenseQuestions.length - 1;

  previousButton.disabled =
    licenseQuestionIndex === 0;

  skipButton.hidden = isLastQuestion;

  nextButton.hidden = isLastQuestion;

  submitButton.hidden = !isLastQuestion;
}


function getLicenseWrongIndexes() {
  return licenseQuestions
    .map(function (question, index) {
      return Number(
        licenseAnswers[index]
      ) === Number(question.answer)
        ? -1
        : index;
    })
    .filter(function (index) {
      return index >= 0;
    });
}


function showLicenseResults() {
  const resultModal = document.getElementById(
    'resultModal'
  );

  const correctCount = document.getElementById(
    'correctCount'
  );

  const accuracyRate = document.getElementById(
    'accuracyRate'
  );

  const resultGrid = document.getElementById(
    'resultGrid'
  );

  const correct = licenseQuestions.reduce(
    function (count, question, index) {
      return Number(
        licenseAnswers[index]
      ) === Number(question.answer)
        ? count + 1
        : count;
    },
    0
  );

  const answered = licenseAnswers.filter(
    function (answer) {
      return (
        answer !== null &&
        answer !== undefined &&
        answer !== -1
      );
    }
  ).length;

  correctCount.textContent =
    correct + ' / ' + answered;

  accuracyRate.textContent =
    answered
      ? Math.round(
          (correct / answered) * 100
        ) + '%'
      : '0%';

  resultGrid.innerHTML = '';

  licenseQuestions.forEach(function (
    question,
    index
  ) {
    const answer = licenseAnswers[index];

    const item = document.createElement('button');

    let status = 'unanswered';

    if (Number(answer) === Number(question.answer)) {
      status = 'correct';
    } else if (answer === -1) {
      status = 'skipped';
    } else if (
      answer !== null &&
      answer !== undefined
    ) {
      status = 'incorrect';
    }

    item.type = 'button';

    item.className =
      'result-item ' + status;

    item.textContent = String(index + 1);

    item.onclick = function () {
      licenseQuestionIndex = index;

      resultModal.style.display = 'none';

      renderLicenseQuestion();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    resultGrid.appendChild(item);
  });

  resultModal.style.display = 'flex';
}


function showLicenseWrongAnswers() {
  const wrongIndexes = getLicenseWrongIndexes();

  if (!wrongIndexes.length) {
    alert('All answers are correct.');

    return;
  }

  const wrongList = document.getElementById(
    'wrongList'
  );

  wrongList.innerHTML = '';

  wrongIndexes.forEach(function (index) {
    const question = licenseQuestions[index];

    const answer = licenseAnswers[index];

    const item = document.createElement('article');

    const title = document.createElement('strong');

    const questionEnglish = document.createElement(
      'div'
    );

    const questionKorean = document.createElement(
      'div'
    );

    const answerLine = document.createElement('p');

    const explanationEnglish = document.createElement(
      'div'
    );

    const explanationKorean = document.createElement(
      'div'
    );

    item.className = 'wrong-item';

    title.textContent =
      'Question ' +
      String(index + 1) +
      ' · ID: ' +
      String(question.questionId || '—');

    questionEnglish.textContent =
      question.english.question_text || '';

    questionKorean.textContent =
      question.korean.question_text || '';

    answerLine.innerHTML =
      'Your answer: ' +
      (
        answer === null ||
        answer === undefined ||
        answer === -1
          ? '—'
          : String.fromCharCode(
              64 + Number(answer)
            )
      ) +
      '<br>Correct answer: ' +
      String.fromCharCode(
        64 + Number(question.answer)
      );

    explanationEnglish.textContent =
      question.english.explanation || '';

    explanationKorean.textContent =
      question.korean.explanation || '';

    item.append(
      title,
      questionEnglish,
      questionKorean,
      answerLine,
      explanationEnglish,
      explanationKorean
    );

    wrongList.appendChild(item);
  });

  document.getElementById(
    'wrongModal'
  ).style.display = 'flex';
}


function retryLicenseAll() {
  licenseAnswers = new Array(
    licenseQuestions.length
  ).fill(null);

  licenseQuestionIndex = 0;

  saveLicenseResume();

  document.getElementById(
    'resultModal'
  ).style.display = 'none';

  renderLicenseQuestion();
}


function retryLicenseWrongOnly() {
  const wrongIndexes = getLicenseWrongIndexes();

  if (!wrongIndexes.length) {
    alert('All answers are correct.');

    return;
  }

  licenseQuestions = wrongIndexes.map(
    function (index) {
      return licenseQuestions[index];
    }
  );

  licenseAnswers = new Array(
    licenseQuestions.length
  ).fill(null);

  licenseQuestionIndex = 0;

  saveLicenseResume();

  document.getElementById(
    'wrongModal'
  ).style.display = 'none';

  document.getElementById(
    'resultModal'
  ).style.display = 'none';

  renderLicenseQuestion();
}


function installLicenseResults() {
  const originalRenderLicenseQuestion =
    renderLicenseQuestion;

  renderLicenseQuestion = function () {
    originalRenderLicenseQuestion();

    syncLicenseQuestionNumber();

    syncLicenseSubmitButton();
  };


  document.getElementById(
    'retryAllBtn'
  ).onclick = retryLicenseAll;

  document.getElementById(
    'reviewWrongBtn'
  ).onclick = showLicenseWrongAnswers;

  document.getElementById(
    'retryWrongFromReviewBtn'
  ).onclick = retryLicenseWrongOnly;

  document.getElementById(
    'closeModalBtn'
  ).onclick = function () {
    document.getElementById(
      'resultModal'
    ).style.display = 'none';
  };

  document.getElementById(
    'closeWrongBtn'
  ).onclick = function () {
    document.getElementById(
      'wrongModal'
    ).style.display = 'none';
  };


  document.addEventListener(
    'keydown',
    function (event) {
      const licenseLesson = document.getElementById(
        'licenseLesson'
      );

      if (
        event.key !== 'Enter' ||
        !licenseLesson ||
        licenseLesson.hidden ||
        licenseQuestionIndex !==
          licenseQuestions.length - 1
      ) {
        return;
      }

      event.preventDefault();

      showLicenseResults();
    }
  );
}

/* ========================================================================
   BLOCK 32000 END : ORIGINAL LICENSE RESULT FUNCTIONS
   ======================================================================== */



// ============================================================================
// 🟦 BLOCK 32200: LICENSE EXAM FLOATING TIMER
// ============================================================================

let licenseExamTimerTotal = 3600;
let licenseExamTimerLeft = 3600;
let licenseExamTimerEnd = 0;
let licenseExamTimerId = null;

function formatLicenseExamTimer(seconds) {
  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds % 3600 / 60),
    seconds % 60
  ]
    .map(function(value) {
      return String(value).padStart(2, '0');
    })
    .join(':');
}

function drawLicenseExamTimer() {
  const display = document.getElementById(
    'licenseFloatingTimerDisplay'
  );

  const startButton = document.getElementById(
    'licenseFloatingTimerStart'
  );

  if (!display || !startButton) {
    return;
  }

  if (licenseExamTimerId) {
    licenseExamTimerLeft = Math.max(
      0,
      Math.ceil(
        (licenseExamTimerEnd - Date.now()) / 1000
      )
    );
  }

  display.textContent =
    formatLicenseExamTimer(
      licenseExamTimerLeft
    );

  display.style.color =
    licenseExamTimerLeft > 0 &&
    licenseExamTimerLeft < 300
      ? '#dc2626'
      : '#172033';

  startButton.textContent = licenseExamTimerId
    ? '⏸ PAUSE'
    : licenseExamTimerLeft < licenseExamTimerTotal
      ? '▶ RESUME'
      : '▶ START';

  if (
    licenseExamTimerId &&
    licenseExamTimerLeft === 0
  ) {
    clearInterval(licenseExamTimerId);
    licenseExamTimerId = null;
    alert('Time is up.');
  }
}

function createLicenseExamTimerPanel() {
  let panel = document.getElementById(
    'licenseFloatingTimer'
  );

  if (panel) {
    return panel;
  }

  panel = document.createElement('section');

  panel.id = 'licenseFloatingTimer';

  panel.hidden = true;

  panel.style.cssText = [
    'position:fixed',
    'top:10px',
    'left:50%',
    'z-index:9999',
    'width:min(360px,calc(100vw - 24px))',
    'padding:10px',
    'border:1px solid #cbd5e1',
    'border-radius:12px',
    'background:#ffffff',
    'box-shadow:0 12px 30px rgba(15,23,42,.22)',
    'transform:translateX(-50%)'
  ].join(';');

  panel.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      font-weight:900;
    ">
      <span>EXAM TIMER</span>
      <button
        id="licenseFloatingTimerClose"
        type="button"
      >×</button>
    </div>

    <div
      id="licenseFloatingTimerDisplay"
      style="
        margin:8px 0;
        text-align:center;
        font:800 32px ui-monospace,Consolas,monospace;
      "
    >01:00:00</div>

    <div style="
      display:flex;
      justify-content:center;
      gap:5px;
    ">
      <input
        id="licenseFloatingTimerHours"
        type="number"
        min="0"
        max="99"
        value="1"
        style="width:52px;text-align:center"
      >
      <span>:</span>
      <input
        id="licenseFloatingTimerMinutes"
        type="number"
        min="0"
        max="59"
        value="0"
        style="width:52px;text-align:center"
      >
      <span>:</span>
      <input
        id="licenseFloatingTimerSeconds"
        type="number"
        min="0"
        max="59"
        value="0"
        style="width:52px;text-align:center"
      >
    </div>

    <div style="
      display:flex;
      gap:6px;
      margin-top:8px;
    ">
      <button
        id="licenseFloatingTimerSet"
        type="button"
        style="flex:1"
      >SET</button>

      <button
        id="licenseFloatingTimerStart"
        type="button"
        style="flex:1"
      >▶ START</button>

      <button
        id="licenseFloatingTimerReset"
        type="button"
        style="flex:1"
      >↺ RESET</button>
    </div>
  `;

  document.body.appendChild(panel);

  document.getElementById(
    'licenseFloatingTimerClose'
  ).onclick = function() {
    panel.hidden = true;
  };

  document.getElementById(
    'licenseFloatingTimerSet'
  ).onclick = function() {
    const hours = Number(
      document.getElementById(
        'licenseFloatingTimerHours'
      ).value
    ) || 0;

    const minutes = Number(
      document.getElementById(
        'licenseFloatingTimerMinutes'
      ).value
    ) || 0;

    const seconds = Number(
      document.getElementById(
        'licenseFloatingTimerSeconds'
      ).value
    ) || 0;

    licenseExamTimerTotal =
      hours * 3600 +
      minutes * 60 +
      seconds;

    licenseExamTimerLeft =
      licenseExamTimerTotal;

    if (licenseExamTimerId) {
      clearInterval(licenseExamTimerId);
      licenseExamTimerId = null;
    }

    drawLicenseExamTimer();
  };

  document.getElementById(
    'licenseFloatingTimerStart'
  ).onclick = function() {
    if (licenseExamTimerId) {
      clearInterval(licenseExamTimerId);
      licenseExamTimerId = null;
      drawLicenseExamTimer();
      return;
    }

    if (!licenseExamTimerLeft) {
      return;
    }

    licenseExamTimerEnd =
      Date.now() +
      licenseExamTimerLeft * 1000;

    licenseExamTimerId = setInterval(
      drawLicenseExamTimer,
      250
    );

    drawLicenseExamTimer();
  };

  document.getElementById(
    'licenseFloatingTimerReset'
  ).onclick = function() {
    if (licenseExamTimerId) {
      clearInterval(licenseExamTimerId);
      licenseExamTimerId = null;
    }

    licenseExamTimerLeft =
      licenseExamTimerTotal;

    drawLicenseExamTimer();
  };

  drawLicenseExamTimer();

  return panel;
}

function installLicenseExamTimer() {
  const timerButton = document.getElementById(
    'licenseExamTimerButton'
  );

  if (!timerButton) {
    return;
  }

  timerButton.onclick = function() {
    if (
      document.documentElement.dataset.licenseMode !==
      'exam'
    ) {
      return;
    }

    const panel =
      createLicenseExamTimerPanel();

    panel.hidden = !panel.hidden;
  };

  document.addEventListener(
    'click',
    function(event) {
      const modeButton = event.target.closest(
        '[data-license-mode]'
      );

      if (!modeButton) {
        return;
      }

      if (
        modeButton.dataset.licenseMode !== 'exam'
      ) {
        const panel = document.getElementById(
          'licenseFloatingTimer'
        );

        if (panel) {
          panel.hidden = true;
        }
      }
    }
  );
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    installLicenseExamTimer,
    { once: true }
  );
} else {
  installLicenseExamTimer();
}

   



// ============================================================================
// 🟦 BLOCK 32300: COMPACT EXAM TIMER BADGE
// ============================================================================

function getLicenseExamTimerBadge() {
  let badge = document.getElementById(
    'licenseExamTimerBadge'
  );

  if (badge) {
    return badge;
  }

  badge = document.createElement('button');

  badge.id = 'licenseExamTimerBadge';

  badge.type = 'button';

  badge.hidden = true;

  badge.style.cssText = [
    'position:fixed',
    'top:10px',
    'right:10px',
    'z-index:10000',
    'min-width:104px',
    'height:34px',
    'padding:0 11px',
    'border:1px solid #334155',
    'border-radius:17px',
    'background:#111827',
    'color:#b8ff3d',
    'font:900 16px ui-monospace,Consolas,monospace',
    'letter-spacing:.4px',
    'box-shadow:0 6px 18px rgba(15,23,42,.28)',
    'cursor:pointer'
  ].join(';');

  badge.onclick = function() {
    const panel = document.getElementById(
      'licenseFloatingTimer'
    );

    if (panel) {
      panel.hidden = false;
    }
  };

  document.body.appendChild(badge);

  return badge;
}

function renderLicenseExamTimerBadge() {
  const badge = getLicenseExamTimerBadge();

  const isExam =
    document.documentElement.dataset.licenseMode ===
    'exam';

  badge.hidden =
    !isExam || !licenseExamTimerId;

  badge.textContent =
    '⏱ ' +
    formatLicenseExamTimer(
      licenseExamTimerLeft
    );

  badge.style.color =
    licenseExamTimerLeft > 0 &&
    licenseExamTimerLeft < 300
      ? '#ff6b6b'
      : '#b8ff3d';
}

const originalDrawLicenseExamTimer =
  drawLicenseExamTimer;

drawLicenseExamTimer = function() {
  originalDrawLicenseExamTimer();
  renderLicenseExamTimerBadge();
};

document.addEventListener(
  'click',
  function(event) {
    const startButton = event.target.closest(
      '#licenseFloatingTimerStart'
    );

    if (!startButton) {
      return;
    }

    window.setTimeout(function() {
      if (!licenseExamTimerId) {
        return;
      }

      const panel = document.getElementById(
        'licenseFloatingTimer'
      );

      if (panel) {
        panel.hidden = true;
      }

      renderLicenseExamTimerBadge();
    }, 0);
  }
);

document.addEventListener(
  'click',
  function(event) {
    const modeButton = event.target.closest(
      '[data-license-mode]'
    );

    if (
      modeButton &&
      modeButton.dataset.licenseMode !== 'exam'
    ) {
      getLicenseExamTimerBadge().hidden = true;
    }
  }
);

/* ============================================================================
   END: COMPACT EXAM TIMER BADGE
   ========================================================================== */





  
/* ========================================================================
// ============================================================================
// PART 4 : LICENSE APPLICATION BOOTSTRAP
// Scope: start the License module after the document is ready.
// ============================================================================
   BLOCK 41000 START : LICENSE BOOTSTRAP AND MODULE CLOSURE
   License 초기화를 시작한 뒤 확장 모듈의 실행 범위를 닫는다.
   ======================================================================== */

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    bootLicenseExtension,
    { once: true }
  );
} else {
  bootLicenseExtension();
}

})();

/* ========================================================================
   BLOCK 41000 END : LICENSE BOOTSTRAP AND MODULE CLOSURE
   ======================================================================== */
