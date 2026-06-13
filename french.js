(function enableFrenchMessages() {
  const languageSelect = document.getElementById('language');
  if (languageSelect && !languageSelect.querySelector('option[value="french"]')) {
    const option = document.createElement('option');
    option.value = 'french';
    option.textContent = 'Français';
    languageSelect.appendChild(option);
  }

  const originalGetTemplates = getTemplates;
  const originalAdaptForPlatform = adaptForPlatform;

  getTemplates = function getTemplatesWithFrench(mode, context) {
    if (context.language === 'french') {
      return getFrenchTemplates(mode, context);
    }
    return originalGetTemplates(mode, context);
  };

  adaptForPlatform = function adaptForPlatformWithFrench(message, platform, language) {
    if (platform === 'facebook' && language === 'french') {
      return `${message}\n\nLes soirées de Coupe du monde finissent toujours par devenir une histoire.`;
    }
    return originalAdaptForPlatform(message, platform, language);
  };

  function getFrenchTemplates(mode, c) {
    const match = `${teamName(c.myTeam, 'mon équipe')} contre ${teamName(c.opponentTeam, 'l’adversaire')}`;
    const toneLine = {
      funny: 'Le football a encore trouvé une façon parfaite de tester notre calme.',
      passionate: 'C’est pour cela que la Coupe du monde a une émotion à part.',
      savage: 'Je dis ça avec respect, mais certains messages seront à relire au coup de sifflet final.',
      emotional: 'Ce match joue déjà avec mes émotions.',
      balanced: 'Il reste beaucoup de football à jouer, mais l’ambiance a clairement changé.'
    }[c.tone];

    if (mode === 'prematch') {
      const confidence = { Calm: 'calme', Confident: 'confiant', Overconfident: 'très confiant' }[c.confidence] || 'confiant';
      return [
        `${match} va commencer. Je me sens ${confidence}. Voyons quelle histoire la Coupe du monde va écrire aujourd’hui. ${toneLine}`,
        `Petite prédiction avant le coup d’envoi: ${teamName(c.myTeam, 'mon équipe')} va rendre ce match intéressant face à ${teamName(c.opponentTeam, 'l’adversaire')}.`,
        `${match} arrive bientôt. Je ne dis pas que je suis déjà prêt à célébrer, mais le message de victoire est presque écrit.`
      ];
    }

    if (mode === 'goal') {
      const side = c.scorer === 'My team' ? teamName(c.myTeam, 'mon équipe') : c.scorer === 'Opponent' ? teamName(c.opponentTeam, 'l’adversaire') : 'une équipe';
      const emotion = { Joy: 'joie', Shock: 'surprise', Relief: 'soulagement', Pain: 'douleur' }[c.emotion] || 'joie';
      return [
        `${side} vient de marquer, et toute l’histoire du match change. Mon émotion actuelle: ${emotion}. ${toneLine}`,
        `But. Ce n’est pas juste un but, c’est le moment qui réveille tout le groupe de discussion. ${toneLine}`,
        `Un seul tir, et tout le match bascule. ${side} vient de changer le récit.`
      ];
    }

    if (mode === 'halftime') {
      const mood = { Tactical: 'tactique', Chaotic: 'chaotique', Boring: 'lent', Tense: 'tendu', Brilliant: 'brillant' }[c.mood] || 'tendu';
      const prediction = { 'Goal coming': 'un but peut arriver', 'VAR drama': 'la VAR peut entrer dans l’histoire', 'More control': 'une équipe peut prendre le contrôle', 'Total chaos': 'la deuxième mi-temps peut devenir folle' }[c.prediction] || 'un but peut arriver';
      return [
        `Avis à la mi-temps sur ${match}: première période ${mood}. Pour la suite, je pense que ${prediction}. ${toneLine}`,
        `Mi-temps. Le match reste ouvert. L’ambiance est ${mood}, et un seul moment peut tout changer.`,
        `Résumé de la première période: pas simple, pas terminé. Après la pause, ${prediction}.`
      ];
    }

    const feeling = { Celebration: 'célébration', Heartbreak: 'déception', Relief: 'soulagement', Respect: 'respect', Frustration: 'frustration' }[c.feeling] || 'célébration';
    const verdict = { Deserved: 'mérité', Lucky: 'chanceux', Dramatic: 'dramatique', Painful: 'difficile', Unbelievable: 'incroyable' }[c.verdict] || 'dramatique';
    return [
      `${match}, terminé. Émotion: ${feeling}. Verdict: match ${verdict}. ${toneLine}`,
      `Le coup de sifflet final est là, mais l’émotion du match continue. Match ${verdict}, humeur ${feeling}.`,
      `Fin du match. La Coupe du monde vient encore de nous donner une histoire à raconter.`
    ];
  }
})();
