// Supplied profile and project metadata; unknown personal fields remain placeholders.
module.exports = {
  profile: {
    name: 'Emory Phạm',
    shortName: 'Emory',
    role: 'UX Designer',
    introduction: 'UX Designer focused on useful, considered digital experiences.',
    biography: [
      'Emory Phạm is a UX Designer based in [your location].',
      'I enjoy understanding how people think, giving complex information a clear structure, and shaping interfaces with care. My interests include [your focus areas].',
      'I am currently looking for [your next opportunity].'
    ],
    email: 'thanh.pham.work3112@gmail.com',
    linkedin: 'https://www.linkedin.com/in/thanh-pham-indabox/',
    cv: null,
    portrait: null,
    heroImage: null
  },
  skills: [
    {id: 'hard', title: 'Hard skills', items: [
      'User Research', 'User Experience', 'User Interface',
      'Vibe code', 'Responsive Design', 'Embedded systems'
    ]},
    {id: 'soft', title: 'Soft skills', items: [
      'Ownership', 'Communication', 'Critical thinking', 'Empathy'
    ]}
  ],
  projects: [
    {slug: 'greeny', name: 'Greeny', videoId: 'NN9Esg6nsKk', type: 'Design with Hardware consideration', duration: '2 months', cover: 'assets/img/home/greeny-cover.png', homeCover: 'assets/img/home/greeny-cover.png', homeBoard: 'board-greeny.svg',
      homeSummary: 'A hardware-aware garden companion that brings sensor readings, connected-device controls and watering schedules into one mobile interface.',
      description: 'A smart-garden companion for monitoring conditions and managing connected devices.'},
    {slug: 'moti-pulse', name: 'Moti-Pulse', type: 'UX/UI Research Case study', duration: '1 month', cover: 'assets/img/home/moti-pulse-cover.png', homeCover: 'assets/img/home/moti-pulse-cover.png', homeBoard: 'board-moti.svg',
      homeSummary: 'A motivation app that connects life missions with goals and everyday tasks. Focus sessions and progress reports help turn personal purpose into action.',
      description: 'A goal-motivation app that connects personal purpose with everyday action.'},
    {slug: 'synergy', name: 'Synergy', videoId: 'qS-jUoC5j08', type: 'UX/UI Education Case Study.', duration: '3 months', cover: 'assets/img/home/synergy-cover.png', homeCover: 'assets/img/home/synergy-cover.png', homeBoard: 'board-synergy.svg',
      homeSummary: 'A self-initiated university app that brings academic tools, campus services and communication together, from checking schedules to finding and joining meetings.',
      description: 'A university companion for academic tools, campus life and communication.'}
  ]
};
