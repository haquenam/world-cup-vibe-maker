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
  lastMessage = adaptForPlatform(selected, context.platform);
  generatedMessage.textContent = lastMessage;
  outputPanel.classList.remove('hidden');
  copyStatus.textContent = '';
  outputPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getTemplates(mode, c) {
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

function adaptForPlatform(message, platform) {
  if (platform === 'facebook') {
    return `${message}\n\nWorld Cup nights always find a way to become a story.`;
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
    copyStatus.textContent = 'Copied. Ready to paste into your matchday chat.';
  } catch {
    copyStatus.textContent = 'Copy failed. Please select the message and copy it manually.';
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
