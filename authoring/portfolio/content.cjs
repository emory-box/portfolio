// Personal fields are explicit draft placeholders until the owner supplies them.
module.exports = {
  profile: {
    name: '[Your name]',
    shortName: '[Name]',
    role: '[Your role]',
    introduction: '[Your role] focused on useful, considered digital experiences.',
    biography: [
      '[Your name] is a [your role] based in [your location].',
      'I enjoy understanding how people think, giving complex information a clear structure, and shaping interfaces with care. My interests include [your focus areas].',
      'I am currently looking for [your next opportunity].'
    ],
    email: null,
    linkedin: null,
    cv: null,
    portrait: null,
    heroImage: null
  },
  projects: [
    {slug: 'greeny', name: 'Greeny', type: 'Design with Hardware consideration', duration: '2 months', cover: null,
      description: 'A smart-garden companion for monitoring conditions and managing connected devices.'},
    {slug: 'moti-pulse', name: 'Moti-Pulse', type: 'UX/UI Research Case study', duration: '1 month', cover: null,
      description: 'A goal-motivation app that connects personal purpose with everyday action.'},
    {slug: 'synergy', name: 'Synergy', type: 'UX/UI Education Case Study.', duration: '3 months', cover: null,
      description: 'A university companion for academic tools, campus life and communication.'}
  ]
};
