// Supplied slide text; no fabricated interviews, figures or outcomes.
module.exports={
 about:[
  'Introducing "GREENY"',
  'The perfect companion app for gardening from the palm of your hand.',
  'The app is part of an IoT network along with sensors and control devices that optimize work and save time for gardeners.'
 ],
 attribution:"Images used for the Greeny sensor are sourced from Parrot Flower Pot to illustrate the Greeny app’s sensor product. This app is created for educational purposes.",
 products:[['Cảm biến Greeny','sensor',[116,720,198,198]],['Vòi tưới phun','sprinkler',[516,720,198,198]],['Quạt','fan',[886,720,198,198]],['Lưới lan','net',[1250,720,198,198]],['Đèn chiếu sáng','light',[1616,720,198,198]]],
 segments:[
  ['Those who want to have their own garden','Users who desire to build and care for a private garden at home or on their property.'],
  ['Coffee shops','Businesses that own gardens to create visual appeal and provide an interesting and comfortable space for customers.'],
  ['Business households','Users with large gardens or multiple gardens that they care for and use for commercial purposes.']
 ],
 personas:[
  // Owner-supplied English versions of slides 14–16 supersede the Vietnamese copy.
  {slide:14,name:'DUC PHU',age:'33',job:'Grow and sell plants',location:'Dong Nai',crop:[65,265,357,357],
   introduction:"Phu is the owner of a business that grows and sells succulents and cacti. He and his family manage all garden operations. Daily tasks include checking the soil, watering, adjusting fans, and occasionally setting up shade nets. However, Phu often has to travel for business and learning opportunities, so he doesn't have much time to supervise the garden.",
   difficulties:['Running a garden requires a lot of labor for supervision, and the challenging working conditions (e.g. intense sunlight, high temperatures) increase the difficulty and cost.'],
   needs:['A solution for remotely monitoring and controlling garden equipment'],
   motivation:'Reduce manual work, save time, and increase reliability. He believes that using technology and science will improve efficiency and support the sustainable growth of his business.'},
  {slide:15,name:'PHUONG LAN',age:'30',job:'Finance Manager',location:'Trang Bom',crop:[65,265,362,362],
   introduction:'Ms. Lan is currently working at "GreenyBank Commercial Joint Stock Bank." Despite her position as Department Head and having young children, she is still passionate about growing a lovely garden.',
   difficulties:['Lacking knowledge in plant care and unable to distinguish different plant varieties.','Having little time at home to take care of the plants'],
   needs:['Automated watering technology can help Ms. Lan water her plants.','Identifying different plant species and understanding how to care for them properly.'],
   motivation:'Creating her own "cozy garden” for her and family.'},
  {slide:16,name:'TRUNG KHANG',age:'33',job:'Coffee Shop owner',location:'Bien Hoa - Dong Nai',crop:[65,263,365,367],
   introduction:'Khang is the owner of a garden-style Mexican cafe (desert-themed). In addition to desert landscapes with cacti, Khang integrates succulents to create beautiful check-in points that attract more visitors.',
   difficulties:['High costs of hiring staff for landscape care.','Concerns about receiving information from staff solely via phone or text.'],
   needs:['Khang seeks technology to assist or replace landscape care staff, aiming to optimize personnel costs.'],
   motivation:'Using technology to save time and reduce staff hiring costs.'}
 ],
 features:[
  {title:'Garden management',branches:[
   {title:'Remote control',priority:true,items:['Sprinkle','Fan','Shade net','Light']},
   {title:'Automated running schedules',priority:true,items:['Create','Apply','Customize']},
   {title:'Notification',items:['Device status','Parameters exceeding threshold'],children:[{title:'Set thresholds for application to notify'}]},
   {title:'Monitoring',priority:true,items:['Soil moisture','Air moisture','Temperature','Sun exposure']}]},
  {title:'Garden data storage',branches:[{title:'Print Report'},{title:'Tracking changes in parameters over time',priority:true,items:['Last 24 hours','Last 7 days','Last 30 days','Last 90 days','Last 365 days']},{title:'History',items:['Activity history','Fertilizer history','Filter']}]},
  {title:'Provide plant care knowledge',branches:[{title:'AI',priority:true,items:['Identify plant','Identify plant disease']}]},
  {title:'News',branches:[{title:'Introduction to devices',items:['How to use','Review','Specifications']},{title:'Contact / Points of sale'}]},
  {title:'Customer management',branches:[{title:'Account',children:[{title:'Subscription',items:['Business / Landscaped Garden / Personal']},{title:'Personal Info'}]},{title:'Signin/Signup',priority:true}]},
  {title:'Scalability',branches:[{title:'Add device',priority:true},{title:'Add garden'}]}
 ],
 weather:[['Tân Phú - Sài Gòn','Partly Sunny',30,15,'cloud'],['Biên Hòa - Đồng Nai','Rainy',90,100,'rain'],['Đà Lạt - Lâm Đồng','Sunny',20,5,'sun'],['Vĩnh Cửu - Đồng Nai','Cloudy',50,40,'cloud']],
 typography:{
  Inter:[['H1/Bold','Inter Bold<br>36px / 44px',36,700,44],['H3/Bold','Inter Bold<br>28px / 32px',28,700,32],['H4/Bold','Inter Bold<br>24px / 28px',24,700,28],['H5/Bold','Inter Bold<br>20px / 24px',20,700,24],['Button/Bold','Inter Bold<br>18px / 22px',18,700,22],['Body/Bold','Inter Bold<br>14px / 20px',14,700,20],['','Inter Regular<br>14px / 20px',14,400,20],['NoteL/Medium','Inter Medium<br>12px / 16px',12,500,16],['NoteM/Medium','Inter Medium<br>10px / 14px',10,500,14]],
  Nunito:[['H2/Bold','Nunito Bold<br>32px / 36px',32,700,36],['Body/Bold','Nunito Bold<br>14px / 20px',14,700,20],['','Nunito Light<br>14px / 20px',14,300,20],['NoteL/Light','Nunito Light<br>12px / 16px',12,300,16],['NoteS/Medium','Nunito Medium<br>8px / 10px',8,500,10]]
 },
 onboarding:[
  {title:"Explore effortless garden management with Greeny's smart features",body:'',crop:[177,166,282,327],button:'Next'},
  {title:'Remote Monitoring',body:"Greeny offers real-time monitoring of crucial environmental factors like soil moisture, air humidity, temperature, sunlight exposure. This help users get deeper understanding of their garden's well-being.",crop:[496,403,282,326],button:'Next'},
  {title:'Remote Control',body:'Users can remotely control garden devices such as watering systems, fans, lights, and shade nets. They can schedule these devices to operate at specific times and durations, ensuring optimal conditions for plant growth.',crop:[815,164,285,329],button:'Next'},
  {title:'Smart Scheduling',body:'Greeny intelligently adapts devices working schedules according to plant requirements and environmental conditions. Plus, users can set up manual schedules for devices to run daily or weekly at their preferred times',crop:[1137,385,285,330],button:'Next'},
  {title:'AI Detection',body:'Containing a vast database of various plants, our well-trained model helps to identify any plant with just one scan. Providing you with useful information to grow your beloved gardens.',crop:[1458,164,285,329],button:'Get start!'}
 ],
 // Ordered and cropped to the owner's current interface-layout.png reference.
 mockups:[[45,'Dashboard and environmental data'],[39,'Launch, sign-in and plant information']],
 advertising:[52,'Greeny outdoor advertising display']
};
