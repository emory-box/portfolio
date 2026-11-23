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
  // Exact visible words and layout from Skills-v2, 2935:18631. Home-only.
  homeSkills: [
    {text:'User Research',node:'2935:18644',x:415.0835,y:294.75,w:293.833,h:57.495,size:34,angle:-4.44,major:true},
    {text:'User Experience',lines:['USER','EXPERIENCE'],node:'2935:18676',x:543,y:438,w:324,h:102,size:50,major:true},
    {text:'User Interface',lines:['USER','INTERFACE'],node:'2935:18678',x:802.0015,y:358,w:172.537,h:77.817,size:29,angle:6.25,major:true},
    {text:'Critical thinking',lines:['CRITICAL','THINKING'],node:'2946:18712',x:811,y:192,w:156.623,h:90.991,size:29,angle:12.76,major:true},
    {text:'Empathy',node:'2935:18654',x:402,y:601,w:199.455,h:64.085,size:39,angle:-7.15,major:true},
    {text:'Communication',node:'2946:18699',x:740.327,y:617.64,w:266.046,h:41.388,size:29,angle:2.47,major:true},
    {text:'Ownership',node:'2935:18651',x:690.49,y:749.59,w:215.168,h:35.079,size:33,angle:-.29,major:true},
    {text:'Solidworks',node:'2935:18685',x:456,y:240.51,w:94.099,h:25.441,size:19,angle:-4},
    {text:'Photography',node:'2935:18680',x:798,y:299,w:105.798,h:23.471,size:18,angle:3},
    {text:'Planning',node:'2935:18683',x:488.2,y:384.21,w:87.639,h:29.699,size:22,angle:-5.2},
    {text:'Management',node:'2935:18684',x:652,y:375,w:107,h:18.36,size:18},
    {text:'Embedded systems',lines:['Embedded','systems'],node:'2935:18647',x:397.1885,y:485.59,w:108.623,h:58.829,size:21,angle:-9.75},
    {text:'Data analysis',node:'2935:18687',x:855,y:570,w:113.403,h:31.077,size:19,angle:6.25},
    {text:'Responsive design',node:'2935:18646',x:601,y:673,w:166,h:20.4,size:20},
    {text:'Vibe code',node:'2935:18682',x:431.09,y:741.78,w:115.825,h:35.446,size:25,angle:-5.31},
    {text:'Tarots',node:'2956:19117',x:887.49,y:693.51,w:50.015,h:20.982,size:18,angle:3.53}
  ],
  projects: [
    {slug: 'greeny', name: 'Greeny', videoId: 'NN9Esg6nsKk', type: 'Design with Hardware consideration', duration: '2 months', cover: 'assets/img/home/greeny-cover.png', homeCover: 'assets/img/home/greeny-home-cover.png', homeType:'IoT garden management · UX/UI design', homeBoard: 'board-greeny.svg',
      homeSummary: 'Greeny brings garden sensor readings and connected-device controls into one mobile interface. The dashboard combines soil-moisture data, weather information and garden overviews, connecting physical devices with the information caretakers need to manage their gardens.',
      description: 'A smart-garden companion for monitoring conditions and managing connected devices.'},
    {slug: 'moti-pulse', name: 'Moti-Pulse', type: 'UX/UI Research Case study', duration: '1 month', cover: 'assets/img/home/moti-pulse-cover.png', homeCover: 'assets/img/home/moti-home-cover.png', homeType:'Motivation & goals · UX research and UI design', homeBoard: 'board-moti.svg',
      homeSummary: 'Moti-Pulse explores how personal purpose can connect with everyday action. The app brings life missions, goals and tasks together, with a calendar for planning. The project followed a research-led UX/UI process, from understanding motivation to developing the interface.',
      description: 'A goal-motivation app that connects personal purpose with everyday action.'},
    {slug: 'synergy', name: 'Synergy', videoId: 'qS-jUoC5j08', type: 'UX/UI Education Case Study.', duration: '3 months', cover: 'assets/img/home/synergy-cover.png', homeCover: 'assets/img/home/synergy-home-cover.png', homeType:'University app · UX/UI case study', homeBoard: 'board-synergy.svg',
      homeSummary: 'Synergy is a university app concept that brings campus tools and communication together. Its Online Meetings screen presents recommended sessions, registered and created meetings, and upcoming meeting cards, helping students find sessions and manage their participation in one place.',
      description: 'A university companion for academic tools, campus life and communication.'}
  ]
};
