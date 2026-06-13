const modes = {
  prematch: {
    title: 'Pre Match Banter',
    icon: '⚽',
    description: 'Start the group chat before kickoff with a quick matchday line.',
    fields: [
      { id: 'confidence', label: 'Confidence Level', options: ['Calm', 'Confident', 'Overconfident'] }
    ]
  },
  goal: {
    title: 'Goal Reaction',
    icon: '🥅',
    description: 'React when a goal changes the mood of the match.',
    fields: [
      { id: 'scorer', label: 'Who Scored?', options: ['My team', 'Opponent', 'Neutral match'] },
      { id: 'emotion', label: 'Emotion', options: ['Joy', 'Shock', 'Relief', 'Pain'] }
    ]
  },
  halftime: {
    title: 'Half Time Verdict',
    icon: '⏱️',
    description: 'Create a quick hot take for the break.',
    fields: [
      { id: 'mood', label: 'First Half Mood', options: ['Tactical', 'Chaotic', 'Boring', 'Tense', 'Brilliant'] },
      { id: 'prediction', label: 'Second Half Prediction', options: ['Goal coming', 'VAR drama', 'More control', 'Total chaos'] }
    ]
  },
  fulltime: {
    title: 'Full Time Message',
    icon: '🏆',
    description: 'Say the final word after the whistle.',
    fields: [
      { id: 'feeling', label: 'Result Feeling', options: ['Celebration', 'Heartbreak', 'Relief', 'Respect', 'Frustration'] },
      { id: 'verdict', label: 'Match Verdict', options: ['Deserved', 'Lucky', 'Dramatic', 'Painful', 'Unbelievable'] }
    ]
  }
};

let selectedMode = 'prematch';
let lastMessage = '';
let lastLanguage = 'english';

const modeGrid = document.getElementById('modeGrid');
const builderPanel = document.getElementById('builderPanel');
const outputPanel = document.getElementById('outputPanel');
const dynamicFields = document.getElementById('dynamicFields');
const selectedModeLabel = document.getElementById('selectedModeLabel');
const builderHeading = document.getElementById('builderHeading');
const vibeForm = document.getElementById('vibeForm');
const generatedMessage = document.getElementById('generatedMessage');
const copyStatus = document.getElementById('copyStatus');

function init() {
  renderModes();
  bindEvents();
}

function renderModes() {
  modeGrid.innerHTML = Object.entries(modes).map(([key, mode]) => `
    <button class="mode-card" type="button" data-mode="${key}">
      <span class="mode-icon" aria-hidden="true">${mode.icon}</span>
      <h3>${mode.title}</h3>
      <p>${mode.description}</p>
    </button>
  `).join('');
}

function bindEvents() {
  modeGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-mode]');
    if (!card) return;
    selectMode(card.dataset.mode);
  });

  vibeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    createMessage();
  });

  document.getElementById('changeModeButton').addEventListener('click', startAgain);
  document.getElementById('resetButton').addEventListener('click', startAgain);
  document.getElementById('outputStartAgainButton').addEventListener('click', startAgain);
  document.getElementById('generateAnotherButton').addEventListener('click', createMessage);
  document.getElementById('copyButton').addEventListener('click', copyMessage);
}

function selectMode(modeKey) {
  selectedMode = modeKey;
  const mode = modes[modeKey];
  selectedModeLabel.textContent = mode.title;
  builderHeading.textContent = `Create ${mode.title}`;
  renderDynamicFields(mode.fields);
  builderPanel.classList.remove('hidden');
  outputPanel.classList.add('hidden');
  builderPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDynamicFields(fields) {
  dynamicFields.innerHTML = fields.map((field) => `
    <label>
      <span>${field.label}</span>
      <select id="${field.id}" name="${field.id}">
        ${field.options.map((option) => `<option value="${option}">${option}</option>`).join('')}
      </select>
    </label>
  `).join('');
}

function formValue(name, fallback = '') {
  const field = vibeForm.elements[name];
  return field && field.value ? field.value.trim() : fallback;
}

function getContext() {
  return {
    myTeam: formValue('myTeam', 'my team'),
    opponentTeam: formValue('opponentTeam', 'the opposition'),
    tone: formValue('tone', 'funny'),
    platform: formValue('platform', 'whatsapp'),
    language: formValue('language', 'english'),
    confidence: formValue('confidence', 'Confident'),
    scorer: formValue('scorer', 'My team'),
    emotion: formValue('emotion', 'Joy'),
    mood: formValue('mood', 'Tense'),
    prediction: formValue('prediction', 'Goal coming'),
    feeling: formValue('feeling', 'Celebration'),
    verdict: formValue('verdict', 'Dramatic')
  };
}

function createMessage() {
  const context = getContext();
  const templates = getTemplates(selectedMode, context);
  const selected = templates[Math.floor(Math.random() * templates.length)];
  lastLanguage = context.language;
  lastMessage = adaptForPlatform(selected, context.platform, context.language);
  generatedMessage.textContent = lastMessage;
  outputPanel.classList.remove('hidden');
  copyStatus.textContent = '';
  outputPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getTemplates(mode, c) {
  return c.language === 'bangla' ? getBanglaTemplates(mode, c) : getEnglishTemplates(mode, c);
}

function getEnglishTemplates(mode, c) {
  const match = `${c.myTeam} vs ${c.opponentTeam}`;
  const toneLine = {
    funny: 'Football is doing its usual job of ruining everyone’s calm.',
    passionate: 'This is why the World Cup feels different from every other tournament.',
    savage: 'Respectfully, some people in this chat may need to stay quiet after full time.',
    emotional: 'I was calm five minutes ago. That version of me no longer exists.',
    balanced: 'Still a lot of football left, but the mood has definitely shifted.'
  }[c.tone];

  if (mode === 'prematch') {
    return [
      `${match} is about to start. I am feeling ${c.confidence.toLowerCase()}, which probably means football is about to humble me. ${toneLine}`,
      `Quick prediction before kickoff: ${c.myTeam} to make this interesting against ${c.opponentTeam}. Save this message for full time accountability.`,
      `${match} is live soon. I am not saying I am confident, but I have already prepared my victory message.`
    ];
  }

  if (mode === 'goal') {
    const side = c.scorer === 'My team' ? c.myTeam : c.scorer === 'Opponent' ? c.opponentTeam : 'Someone';
    return [
      `${side} just scored and the whole match has changed. My current emotion is ${c.emotion.toLowerCase()}. ${toneLine}`,
      `GOAL. That was not just a goal, that was a group chat earthquake. ${toneLine}`,
      `One kick, complete chaos. ${side} has changed the story of this match.`
    ];
  }

  if (mode === 'halftime') {
    return [
      `Half time verdict on ${match}: ${c.mood.toLowerCase()} first half. My second half call: ${c.prediction.toLowerCase()}. ${toneLine}`,
      `Half time and I still do not fully trust this match. It feels ${c.mood.toLowerCase()}, and one moment could flip everything.`,
      `First half summary: not calm, not simple, definitely not finished. I am calling ${c.prediction.toLowerCase()} after the break.`
    ];
  }

  return [
    `Full time in ${match}. Feeling: ${c.feeling.toLowerCase()}. Verdict: ${c.verdict.toLowerCase()}. ${toneLine}`,
    `That final whistle says the match is over, but emotionally I need extra time. ${c.verdict} game, ${c.feeling.toLowerCase()} mood.`,
    `Full time. Football has spoken, the group chat has evidence, and I will be accepting apologies where appropriate.`
  ];
}

function getBanglaTemplates(mode, c) {
  const match = `${teamName(c.myTeam, 'আমার দল')} বনাম ${teamName(c.opponentTeam, 'প্রতিপক্ষ')}`;
  const toneLine = {
    funny: 'ফুটবল আবারও আমাদের ম্যাচডে মুডটা দারুণ করে তুলছে।',
    passionate: 'এই জন্যই বিশ্বকাপের আবেগ আলাদা।',
    savage: 'বন্ধুত্বপূর্ণ খোঁচা দিচ্ছি, ফুল টাইমে কিন্তু এই কথাটা মনে থাকবে।',
    emotional: 'এই ম্যাচটা আবেগ নিয়েই খেলছে।',
    balanced: 'এখনও অনেক খেলা বাকি, কিন্তু ম্যাচের মুড বদলে গেছে।'
  }[c.tone];

  if (mode === 'prematch') {
    const confidence = { Calm: 'শান্ত', Confident: 'আত্মবিশ্বাসী', Overconfident: 'খুব আত্মবিশ্বাসী' }[c.confidence] || 'আত্মবিশ্বাসী';
    return [
      `${match} শুরু হতে যাচ্ছে। আমি এখন ${confidence}। দেখা যাক বিশ্বকাপ আজ কী গল্প লিখে। ${toneLine}`,
      `কিক অফের আগে ছোট্ট ভবিষ্যদ্বাণী। ${teamName(c.myTeam, 'আমার দল')} আজ ${teamName(c.opponentTeam, 'প্রতিপক্ষ')} কে ভালো চ্যালেঞ্জ দেবে।`,
      `${match} শুরু হওয়ার অপেক্ষা। মুড ভালো, আশা বড়, আর গ্রুপ চ্যাট প্রস্তুত।`
    ];
  }

  if (mode === 'goal') {
    const side = c.scorer === 'My team' ? teamName(c.myTeam, 'আমার দল') : c.scorer === 'Opponent' ? teamName(c.opponentTeam, 'প্রতিপক্ষ') : 'একটি দল';
    const emotion = { Joy: 'আনন্দ', Shock: 'অবাক', Relief: 'স্বস্তি', Pain: 'মন খারাপ' }[c.emotion] || 'আনন্দ';
    return [
      `${side} গোল করেছে, আর ম্যাচের গল্প বদলে গেছে। আমার বর্তমান অনুভূতি: ${emotion}। ${toneLine}`,
      `গোল। এই মুহূর্তটাই বিশ্বকাপকে আলাদা করে। ${toneLine}`,
      `একটা গোল, আর পুরো ম্যাচের মুড বদলে গেল। ${side} এখন আলোচনার কেন্দ্রবিন্দু।`
    ];
  }

  if (mode === 'halftime') {
    const mood = { Tactical: 'কৌশলভিত্তিক', Chaotic: 'এলোমেলো', Boring: 'ধীরগতির', Tense: 'টানটান', Brilliant: 'দারুণ' }[c.mood] || 'টানটান';
    const prediction = { 'Goal coming': 'গোল আসতে পারে', 'VAR drama': 'ভিএআর আলোচনা হতে পারে', 'More control': 'আরও নিয়ন্ত্রণ দেখা যেতে পারে', 'Total chaos': 'দ্বিতীয়ার্ধ আরও জমে উঠতে পারে' }[c.prediction] || 'গোল আসতে পারে';
    return [
      `${match} নিয়ে হাফ টাইম মতামত: প্রথমার্ধ ছিল ${mood}। দ্বিতীয়ার্ধে আমার ধারণা, ${prediction}। ${toneLine}`,
      `হাফ টাইম। ম্যাচটা এখনও খোলা আছে। মুড ${mood}, আর একটা ভালো মুহূর্তেই সব বদলে যেতে পারে।`,
      `প্রথমার্ধের সারাংশ: সহজ না, শেষও না। বিরতির পর ${prediction}।`
    ];
  }

  const feeling = { Celebration: 'উদযাপন', Heartbreak: 'মন খারাপ', Relief: 'স্বস্তি', Respect: 'সম্মান', Frustration: 'হতাশা' }[c.feeling] || 'উদযাপন';
  const verdict = { Deserved: 'প্রাপ্য', Lucky: 'ভাগ্যবান', Dramatic: 'নাটকীয়', Painful: 'কঠিন', Unbelievable: 'অবিশ্বাস্য' }[c.verdict] || 'নাটকীয়';
  return [
    `${match} শেষ। অনুভূতি: ${feeling}। রায়: ${verdict} ম্যাচ। ${toneLine}`,
    `ফাইনাল হুইসেল হয়ে গেছে, কিন্তু ম্যাচের আবেগ এখনও শেষ হয়নি। ${verdict} ম্যাচ, ${feeling} মুড।`,
    `ফুল টাইম। বিশ্বকাপ আবারও একটা গল্প দিয়ে গেল, আর ম্যাচডে চ্যাটে আলোচনার বিষয় তৈরি হলো।`
  ];
}

function teamName(value, fallback) {
  return value && value.trim() ? value.trim() : fallback;
}

function adaptForPlatform(message, platform, language) {
  if (platform === 'facebook') {
    const suffix = language === 'bangla'
      ? 'বিশ্বকাপের রাতগুলো সবসময় কোনো না কোনো গল্প তৈরি করে।'
      : 'World Cup nights always find a way to become a story.';
    return `${message}\n\n${suffix}`;
  }
  if (platform === 'x') {
    return message.length > 230 ? `${message.slice(0, 227)}...` : message;
  }
  return message;
}

async function copyMessage() {
  if (!lastMessage) return;
  try {
    await navigator.clipboard.writeText(lastMessage);
    copyStatus.textContent = lastLanguage === 'bangla'
      ? 'কপি হয়েছে। এখন আপনার ম্যাচডে চ্যাটে পেস্ট করতে পারবেন।'
      : 'Copied. Ready to paste into your matchday chat.';
  } catch {
    copyStatus.textContent = lastLanguage === 'bangla'
      ? 'কপি হয়নি। অনুগ্রহ করে মেসেজটি সিলেক্ট করে ম্যানুয়ালি কপি করুন।'
      : 'Copy failed. Please select the message and copy it manually.';
  }
}

function startAgain() {
  builderPanel.classList.add('hidden');
  outputPanel.classList.add('hidden');
  vibeForm.reset();
  copyStatus.textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

init();
