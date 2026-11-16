const FINAL = {
 pass:60,
 sections:[
  {id:'lis',title:'Listening',ar:'الاستماع',icon:'🎧',listen:true,qs:[
   {audio:"Hi! My name is Omar. I'm 12 years old and I'm from Egypt.",g:'m',q:'How old is Omar?',o:['10','12','20'],a:1},
   {audio:"I get up at 7 o'clock. Then I have breakfast and go to school by bus.",g:'f',q:'How does she go to school?',o:['She walks.','by bus','by car'],a:1},
   {audio:"I have a cat. Her name is Mimi. She is small and white.",g:'f',q:'What color is the cat?',o:['white','brown','black'],a:0},
   {audio:"I'd like a burger and orange juice, please.",g:'m',q:'What does he want to drink?',o:['coffee','water','orange juice'],a:2},
   {audio:"The lamp is next to the bed, and the books are on the desk.",g:'f',q:'Where are the books?',o:['on the desk','under the bed','next to the bed'],a:0},
   {audio:"My birthday is in May. I love spring because the weather is nice.",g:'f',q:'When is her birthday?',o:['in March','in May','in July'],a:1},
   {audio:"My father is a doctor. He works in a hospital.",g:'m',q:'What does his father do?',o:['He is a teacher.','He is a doctor.','He is an engineer.'],a:1},
   {audio:"It's half past four. Let's have some tea.",g:'m',q:'What time is it?',o:['4:00','4:30','4:15'],a:1}]},
  {id:'voc',title:'Vocabulary',ar:'المفردات',icon:'📚',qs:[
   {pic:'👩‍🏫',q:'She works at a school. She is a ___.',o:['nurse','teacher','chef'],a:1},
   {pic:'🚿',q:'I take a ___ every morning.',o:['shower','bus','menu'],a:0},
   {pic:'🐘',q:'This animal is very big. It is an ___.',o:['elephant','rabbit','eagle'],a:0},
   {pic:'☕',q:"I'd like a ___, please.",o:['coffee','sofa','garden'],a:0},
   {pic:'🥕',q:'Carrots are ___.',o:['drinks','vegetables','desserts'],a:1},
   {pic:'🛏️',q:'I sleep in the ___.',o:['kitchen','bedroom','bathroom'],a:1},
   {pic:'❄️',q:'It is cold. It is ___.',o:['summer','winter','spring'],a:1},
   {q:'The day after Monday is ___.',o:['Tuesday','Sunday','Friday'],a:0}]},
  {id:'gra',title:'Grammar',ar:'القواعد',icon:'📘',qs:[
   {q:'They ___ my friends.',o:['am','is','are'],a:2},
   {q:'She ___ to school every day.',o:['go','goes','going'],a:1},
   {q:'This is my sister. ___ name is Hana.',o:['His','Her','Its'],a:1},
   {q:'He ___ a new car.',o:['have','has','haves'],a:1},
   {q:'one child → two ___',o:['childs','children','childrens'],a:1},
   {q:'The cat is ___ the box.',o:['in','at','of'],a:0},
   {q:'I rest ___ Sunday.',o:['in','on','at'],a:1},
   {q:'Choose the correct sentence.',o:["He don't have a bike.","He doesn't have a bike.","He doesn't has a bike."],a:1}]},
  {id:'rea',title:'Reading',ar:'القراءة',icon:'📖',passage:["Hello! I'm Youssef. I'm 13 years old and I live in Giza with my family.","My mother is a nurse and my father is an engineer. I have one sister. Her name is Nour.","Every day, I get up at 6 o'clock. I walk to school because it is near my house.","After school, I play football with my friends. I have a dog. His name is Rocky. He is big and brown.","My favorite food is pizza and my favorite season is winter.","On Friday, we visit my grandmother. She cooks delicious food for us!"],
   qs:[{q:'Where does Youssef live?',o:['Cairo','Giza','Alexandria'],a:1},{q:"What does Youssef's mother do?",o:['She is a nurse.','She is a teacher.','She is an engineer.'],a:0},{q:'How does he go to school?',o:['by bus','He walks.','by car'],a:1},{q:'What does Rocky look like?',o:['small and white','big and brown','big and black'],a:1},{q:'What is his favorite season?',o:['summer','spring','winter'],a:2},{q:'What do they do on Friday?',o:['They visit his grandmother.','They go to school.','They play football.'],a:0}]},
  {id:'wri',title:'Writing',ar:'الكتابة',icon:'✍️',writing:true,prompt:'Write about yourself: your family, your day, your home and the things you like (50–100 words).',
   promptAr:'اكتب عن نفسك (من ٥٠ لـ ١٠٠ كلمة): اسمك وعمرك، عيلتك ووظايفهم، يومك، بيتك، وأكلك وحيوانك أو فصلك المفضل.',
   checks:[['👤','My name is… I am … years old.','name'],['👨‍👩‍👧','My father / mother is…','family'],['⏰','I get up at…','getup'],['🏠','I live in a house / an apartment…','house'],['❤️','I like / love…','likes'],['💬','because…','because']]}
 ]};
