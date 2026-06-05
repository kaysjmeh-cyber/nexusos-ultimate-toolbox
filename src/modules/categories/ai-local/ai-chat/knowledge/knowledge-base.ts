export interface KnowledgeBase {
  category: string;
  keywords: string[];
  responses: string[];
}

export const KNOWLEDGE_BASE: KnowledgeBase[] = [
  // Cuisine
  {
    category: 'cuisine',
    keywords: ['pâtes', 'pasta', 'cuisine', 'recette', 'cook', 'recipe', 'food'],
    responses: [
      '🍝 Pour faire des pâtes parfaites:\n\n1. Faites bouillir de l\'eau salée (1L pour 100g de pâtes)\n2. Ajoutez les pâtes quand l\'eau bout\n3. Cuisez al dente (temps indiqué sur le paquet - 1 min)\n4. Égouttez en gardant un peu d\'eau de cuisson\n5. Ajoutez votre sauce et mélangez\n\nConseil: Ajoutez de l\'huile d\'olive dans l\'eau pour éviter que les pâtes ne collent.',
      '🍳 Les bases de la cuisine:\n\n• Toujours préparer vos ingrédients avant de commencer\n• Utilisez des couteaux bien aiguisés\n• Goûtez pendant la cuisson\n• Laissez reposer la viande après cuisson\n• Nettoyez au fur et à mesure',
    ],
  },
  {
    category: 'cuisine',
    keywords: ['œuf', 'egg', 'omelette', 'omelet'],
    responses: [
      '🥚 Pour une omelette parfaite:\n\n1. Battez 2-3 œufs avec une pincée de sel\n2. Chauffez une poêle antiadhésive avec du beurre\n3. Versez les œufs et laissez cuire 30 secondes\n4. Soulevez les bords avec une spatule\n5. Ajoutez vos garnitures (fromage, jambon, herbes)\n6. Pliez en deux et servez',
    ],
  },
  
  // Informatique
  {
    category: 'informatique',
    keywords: ['informatique', 'computer', 'pc', 'ordinateur', 'hardware'],
    responses: [
      '💻 Les bases de l\'informatique:\n\n• **CPU**: Le processeur exécute les instructions\n• **RAM**: Mémoire vive pour les données actives\n• **Stockage**: Disque dur ou SSD pour les fichiers\n• **GPU**: Carte graphique pour le rendu visuel\n• **OS**: Système d\'exploitation (Windows, Linux, macOS)',
      '🔧 Maintenance PC:\n\n• Nettoyez régulièrement la poussière\n• Vérifiez les mises à jour système\n• Scannez avec un antivirus\n• Désinstallez les programmes inutiles\n• Sauvegardez vos données régulièrement',
    ],
  },
  {
    category: 'informatique',
    keywords: ['internet', 'web', 'réseau', 'network'],
    responses: [
      '🌐 Fonctionnement d\'Internet:\n\n• Les données voyagent en paquets via des routeurs\n• Le DNS traduit les noms de domaine en IP\n• HTTPS chiffre les communications\n• Les protocoles: HTTP, FTP, SMTP, POP3\n• Le World Wide Web est un service d\'Internet',
    ],
  },
  
  // Programmation
  {
    category: 'programmation',
    keywords: ['programmation', 'programming', 'code', 'coding', 'développement'],
    responses: [
      '⌨️ Les langages de programmation populaires:\n\n• **JavaScript**: Web (frontend et backend)\n• **Python**: Data science, IA, automatisation\n• **Java**: Entreprise, Android\n• **C++**: Performance, jeux, systèmes\n• **TypeScript**: JavaScript typé\n• **Rust**: Performance et sécurité',
      '🚀 Bonnes pratiques de programmation:\n\n• Écrivez du code lisible et commenté\n• Utilisez des noms de variables significatifs\n• Suivez les principes DRY (Don\'t Repeat Yourself)\n• Testez votre code\n• Utilisez le contrôle de version (Git)',
    ],
  },
  {
    category: 'programmation',
    keywords: ['javascript', 'js', 'react', 'vue', 'angular'],
    responses: [
      '⚛️ JavaScript et frameworks:\n\n• **React**: Composants, hooks, virtual DOM\n• **Vue.js**: Progressif, facile à apprendre\n• **Angular**: Complet, opinionné\n• **Svelte**: Compile-time, pas de virtual DOM\n• **Next.js**: React avec SSR et routing',
    ],
  },
  
  // Histoire
  {
    category: 'histoire',
    keywords: ['histoire', 'history', 'guerre', 'war', 'révolution', 'revolution'],
    responses: [
      '📜 Événements historiques majeurs:\n\n• 1789: Révolution française\n• 1914-1918: Première Guerre mondiale\n• 1939-1945: Seconde Guerre mondiale\n• 1969: Homme sur la Lune\n• 1989: Chute du mur de Berlin\n• 1991: Disparition de l\'URSS',
      '🏛️ Civilisations anciennes:\n\n• **Égypte antique**: Pyramides, hiéroglyphes\n• **Grèce antique**: Démocratie, philosophie\n• **Rome antique**: Empire, droit, ingénierie\n• **Chine**: Dynasties, Grande Muraille\n• **Mésopotamie**: Écriture, agriculture',
    ],
  },
  
  // Sciences
  {
    category: 'sciences',
    keywords: ['science', 'physique', 'physics', 'chimie', 'chemistry'],
    responses: [
      '⚗️ Sciences fondamentales:\n\n• **Physique**: Étude de la matière et de l\'énergie\n• **Chimie**: Étude des réactions et composés\n• **Biologie**: Étude des êtres vivants\n• **Mathématiques**: Langage de la science\n• **Informatique**: Science du calcul',
      '🔬 Découvertes scientifiques importantes:\n\n• Gravité (Newton)\n• Électricité (Faraday, Tesla)\n• Relativité (Einstein)\n• ADN (Watson, Crick)\n• Périodique (Mendeleïev)',
    ],
  },
  
  // Mathématiques
  {
    category: 'mathématiques',
    keywords: ['math', 'mathématiques', 'algèbre', 'géométrie', 'calcul'],
    responses: [
      '📐 Branches des mathématiques:\n\n• **Algèbre**: Équations, structures\n• **Géométrie**: Formes, espaces\n• **Calcul**: Dérivées, intégrales\n• **Statistiques**: Analyse de données\n• **Logique**: Raisonnement formel',
      '🔢 Concepts mathématiques utiles:\n\n• **Pythagore**: a² + b² = c²\n• **Dérivée**: Taux de changement\n• **Intégrale**: Aire sous la courbe\n• **Probabilité**: Chance d\'événement\n• **Statistique**: Analyse de données',
    ],
  },
  
  // Productivité
  {
    category: 'productivité',
    keywords: ['productivité', 'productivity', 'gestion du temps', 'time management'],
    responses: [
      '⏱️ Techniques de productivité:\n\n• **Pomodoro**: 25min travail, 5min pause\n• **Eisenhower**: Urgent/Important matrix\n• **GTD**: Getting Things Done\n• **Kanban**: Visualisation du flux\n• **Time blocking**: Bloquer du temps pour des tâches',
      '📋 Astuces de productivité:\n\n• Planifiez votre journée la veille\n• Éliminez les distractions\n• Faites les tâches difficiles en premier\n• Utilisez des raccourcis clavier\n• Automatisez les tâches répétitives',
    ],
  },
  
  // Culture générale
  {
    category: 'culture',
    keywords: ['culture', 'générale', 'general knowledge', 'art', 'musique', 'music'],
    responses: [
      '🎨 Arts et culture:\n\n• **Peinture**: Renaissance, Impressionnisme, Modernisme\n• **Musique**: Classique, Jazz, Rock, Pop, Électronique\n• **Littérature**: Romans, Poésie, Théâtre\n• **Cinéma**: Histoire du cinéma, genres majeurs\n• **Architecture**: Styles historiques et modernes',
      '🌍 Culture internationale:\n\n• **Europe**: Histoire riche, diversité culturelle\n• **Asie**: Traditions anciennes, modernité\n• **Afrique**: Diversité, patrimoine\n• **Amérique**: Mélange culturel\n• **Océanie**: Nature, cultures indigènes',
    ],
  },
];
