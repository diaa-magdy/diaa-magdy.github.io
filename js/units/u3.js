UNITS[3] = {
 n:3, title:'Talking About Animals', ar:'الحيوانات', icon:'🐶', cover:'img/u3.jpg',
 intro:'اتكلم عن الحيوانات والحيوانات الأليفة، واوصف شكلها، واستخدم this و that و his و her.',
 videos:[
  {id:'u3v1', title:'Talking About Animals', ar:'كلام عن الحيوانات', src:'video/u3v1.mp4', poster:'img/u3v1.jpg',
   sp:{a:{n:'Ali',g:'m'},b:{n:'Sarah',g:'f'}},
   lines:[
   ["a","Hi, Sarah! Do you have any pets?","أهلًا يا سارة! عندك حيوانات أليفة؟"],
   ["b","Yes, I do. I have a cat.","أيوه. عندي قطة."],
   ["a","Oh, nice! What's its name?","الله! اسمها إيه؟"],
   ["b","Her name is Luna.","اسمها لونا."],
   ["a","How old is she?","عندها كام سنة؟"],
   ["b","She is two years old.","عندها سنتين."],
   ["a","What does she look like?","شكلها عامل إزاي؟"],
   ["b","She is small and white. She has blue eyes.","صغيرة ولونها أبيض. وعينيها زرقا."],
   ["a","That's beautiful! I like cats.","جميل! أنا بحب القطط."],
   ["b","Do you have a pet?","وإنت عندك حيوان أليف؟"],
   ["a","No, I don't. But I like dogs. They are friendly.","لأ، معنديش. بس بحب الكلاب. ودودة."],
   ["b","Yes, dogs are great! Maybe you can have one someday.","أيوه، الكلاب جميلة! يمكن يبقى عندك واحد في يوم."]],
   quiz:[{"q": "What pet does Sarah have?", "o": ["a dog", "a cat", "a bird"], "a": 1}, {"q": "What is the cat's name?", "o": ["Luna", "Max", "Mimi"], "a": 0}, {"q": "How old is Luna?", "o": ["one year old", "two years old", "three years old"], "a": 1}, {"q": "What color are Luna's eyes?", "o": ["green", "brown", "blue"], "a": 2}, {"q": "Does Ali have a pet?", "o": ["Yes, a dog.", "No, he doesn't.", "Yes, a cat."], "a": 1}],
   fill:[[1, "cat"], [3, "Luna"], [5, "two"], [7, "white"], [7, "blue"], [10, "dogs"], [10, "friendly"]]}
 ],
 vocab:[
  {t:'Pets & farm', ar:'حيوانات أليفة ومزرعة', items:[['🐶','dog','The dog is friendly.'],['🐱','cat','The cat is small and cute.'],['🐦','bird','The bird is yellow.'],['🐰','rabbit','The rabbit is white.'],['🐟','fish','The fish is orange.'],['🐴','horse','The horse is fast.'],['🐮','cow','The cow is black and white.'],['🐑','sheep','The sheep is white.']]},
  {t:'Wild animals', ar:'حيوانات برية', items:[['🐢','turtle','The turtle is slow.'],['🐹','hamster','The hamster is small.'],['🐘','elephant','The elephant is very big.'],['🦁','lion','The lion is strong.'],['🐒','monkey','The monkey is funny.'],['🐬','dolphin','The dolphin is smart.'],['🐯','tiger','The tiger is strong.'],['🦜','parrot','The parrot is beautiful.']]},
  {t:'Animals can be…', ar:'صفات', items:[['🐘','big','The elephant is big.'],['🐭','small','The mouse is small.'],['🐆','fast','The cheetah is fast.'],['💪','strong','The lion is strong.'],['🐶','friendly','My dog is friendly.'],['🐱','cute','The kitten is cute.'],['🐒','funny','Monkeys are funny.'],['🦚','beautiful','The bird is beautiful.']]}
 ],
 talk:[
  {title:"Let's Talk · Animals", ar:'اتكلم عن الحيوانات', list:[["Do you like animals? Why?","بتحب الحيوانات؟ ليه؟","Yes, I do. They are cute."],["What is your favorite animal?","إيه حيوانك المفضل؟","My favorite animal is the lion."],["Do you have a pet?","عندك حيوان أليف؟","Yes, I have a cat."],["What animal would you like to have?","نفسك يبقى عندك حيوان إيه؟","I would like to have a dog."],["Do you like cats or dogs more? Why?","بتحب القطط ولا الكلاب أكتر؟ ليه؟","I like dogs. They are friendly."],["What does your favorite animal look like?","حيوانك المفضل شكله إيه؟","It is big and brown."],["Are you afraid of any animals?","بتخاف من أي حيوان؟","Yes, I am afraid of snakes."],["Which wild animal would you like to see?","نفسك تشوف أنهي حيوان بري؟","I would like to see an elephant."]]}
 ],
 grammar:{title:'This & That · Possessive adjectives', ar:'this و that — وضمائر الملكية', blocks:[
  {type:'big', items:[{v:'this',p:'near us · قريب',c:2,eg:['This is my phone.','This cat is cute.']},{v:'that',p:'far from us · بعيد',c:1,eg:['That is a car.','That dog is big.']}]},
  {type:'list', title:'More examples', items:['This cup.','That plane.','This book.','That tree.','This key.','That boat.']},
  {type:'table', title:'👤 Possessive adjectives', head:['Subject','Possessive','Example'], rows:[['I','my','This is my phone.'],['you','your','This is your book.'],['he','his','This is his car.'],['she','her','This is her bag.'],['it','its','This is its tail.'],['we','our','This is our house.'],['they','their','These are their friends.']]},
  {type:'tip', en:'Possessive adjectives come before a noun: my phone, her cat, its tail.', ar:'ضمير الملكية بييجي قبل الاسم: my phone مش phone my. ونستخدم its للحيوانات والأشياء.'}]},
 exercises:[
  {type:'mcq',title:'This or that?',ar:'this للقريب و that للبعيد',speak:true,items:[{pic:'👉📱',q:'___ is my phone. (near)',o:['This','That'],a:0},{pic:'👉✈️',q:'___ is a plane. (far)',o:['This','That'],a:1},{pic:'👉🐱',q:'___ cat is cute. (near)',o:['This','That'],a:0},{pic:'👉🏢',q:'___ building is big. (far)',o:['This','That'],a:1},{pic:'👉📕',q:'___ is my book. (near)',o:['This','That'],a:0}]},
  {type:'mcq',title:'Complete with the possessive adjective',ar:'أكمل بضمير الملكية',speak:true,items:[{q:'This is ___ laptop. (I)',o:['my','your','his'],a:0},{q:'That is ___ bike. (you)',o:['her','your','our'],a:1},{q:'She has ___ cat. (she)',o:['his','her','its'],a:1},{q:'He has ___ keys. (he)',o:['his','her','my'],a:0},{q:'We love ___ teacher. (we)',o:['their','our','your'],a:1},{q:'Look at ___ tail. (it)',o:["it's",'its','his'],a:1},{q:'They are ___ house. (they)',o:['there','their','our'],a:1}]},
  {type:'ord',title:'Make sentences',ar:'رتّب الكلمات',items:[{c:['I','a dog','have'],a:[0,2,1]},{c:['His name','Max','is'],a:[0,2,1]},{c:['She','small and white','is'],a:[0,2,1]},{c:['This','my cat','is'],a:[0,2,1]},{c:['That','a big elephant','is'],a:[0,2,1]}]}
 ],
 reading:{title:'My Favourite Animals', ar:'حيواناتي المفضلة', video:'video/u3r.mp4', poster:'img/u3r.jpg', g:'f', lines:[
  ["I love animals. There are many animals in the world.","أنا بحب الحيوانات. في حيوانات كتير في العالم."],["My favourite animal is the dog.","حيواني المفضل هو الكلب."],["Dogs are friendly and clever. They can run fast and they like to play.","الكلاب ودودة وذكية. بتجري بسرعة وبتحب اللعب."],["I also like cats. Cats are smaller than dogs.","وبحب القطط كمان. القطط أصغر من الكلاب."],["They are quiet and cute. They like to sleep a lot.","هادية وجميلة. وبتحب تنام كتير."],["Elephants are very big. They have long noses.","الأفيال كبيرة جدًا. عندها أنوف طويلة."],["They are strong and smart.","قوية وذكية."],["Monkeys are funny. They can climb trees. They like bananas.","القرود مضحكة. بتعرف تتسلق الشجر. وبتحب الموز."],["Animals are amazing!","الحيوانات رائعة!"]],
  keys:[['🐶','dog','a friendly animal'],['🐱','cat','a small furry animal'],['🐘','elephant','a very big animal'],['🐒','monkey','climbs trees'],['💪','strong','a lot of power'],['💡','clever','good at learning']],
  quiz:[{q:"The writer's favourite animal is the ___.",o:['cat','dog','elephant'],a:1},{q:'Cats are ___.',o:['big','small','very big'],a:1},{q:'Elephants have ___ noses.',o:['short','long','small'],a:1},{q:'Monkeys can ___.',o:['swim','climb trees','fly'],a:1},{q:'Dogs are quiet. True or false?',o:['True','False'],a:1},{q:'Monkeys like bananas. True or false?',o:['True','False'],a:0}]},
 sounds:{title:'Digraphs: sh · ch · th · ph', ar:'حرفين بيعملوا صوت واحد', video:'video/u3s.mp4', poster:'img/u3s.jpg',
  tip:['A digraph is two letters that make one sound.','الـ digraph هو حرفين مع بعض بيطلعوا صوت واحد.'],
  groups:[['sh','/ʃ/','ship','#1d6bf3',[['🚢','ship'],['👟','shoe'],['🐟','fish'],['🐑','sheep']]],['ch','/tʃ/','chair','#7b4fd6',[['🪑','chair'],['🧀','cheese'],['🐔','chicken'],['🍟','chips']]],['th','/θ/','three','#f27f0c',[['3️⃣','three'],['👍','thumb'],['🛁','bath'],['💭','think']]],['th','/ð/','this','#e5484d',[['👉','this'],['👨','father'],['👩','mother'],['👦','brother']]],['ph','/f/','phone','#13a39a',[['📱','phone'],['📷','photo'],['🐘','elephant'],['🐬','dolphin']]]],
  quiz:{title:'Listen and choose the sound',ar:'استمع واختر',opts:['sh','ch','th','ph'],items:[['🚢','ship',0],['🪑','chair',1],['3️⃣','three',2],['📱','phone',3],['🧀','cheese',1],['🐑','sheep',0],['👍','thumb',2],['📷','photo',3]]}},
 games:{pairs:[['🐶','dog'],['🐱','cat'],['🐘','elephant'],['🦁','lion'],['🐒','monkey'],['🐴','horse']],
  spell:[['🐶','dog'],['🐱','cat'],['🐦','bird'],['🐟','fish'],['🐮','cow'],['🦁','lion'],['🐴','horse'],['🐑','sheep']],
  speed:[['This is my cat.',true],['That is my dog.',true],['This is phone my.',false],['She has her bag.',true],['He has her car.',false],['The cat has its tail.',true],['They are their friends.',true],['The dog is big and brown.',true],['It has it\'s tail.',false],['We love our teacher.',true],['I have a dog.',true],['His name is Mimi. (a girl cat)',false],['Elephants are very big.',true],['Monkeys can fly.',false],['Fish can swim.',true],['A lion is small.',false]]},
 test:{pass:60, sections:[
  {id:'voc',title:'Vocabulary',ar:'المفردات',icon:'📚',qs:[{pic:'🐘',q:'This is an ___.',o:['elephant','lion','horse'],a:0},{pic:'🐒',q:'This is a ___.',o:['rabbit','monkey','cow'],a:1},{pic:'🐢',q:'This is a ___.',o:['turtle','fish','bird'],a:0},{q:'The opposite of "big" is ___.',o:['fast','small','strong'],a:1},{q:'An animal that lives with us at home is a ___.',o:['pet','lion','tree'],a:0},{q:'"لطيف وودود" in English is…',say:'Choose the correct word.',o:['friendly','fast','funny'],a:0}]},
  {id:'gra',title:'Grammar',ar:'القواعد',icon:'📘',qs:[{q:'___ is my phone. (near)',o:['This','That','These'],a:0},{q:'___ is a plane in the sky. (far)',o:['This','That','My'],a:1},{q:'She is my sister. ___ name is Hana.',o:['His','Her','Its'],a:1},{q:'The dog has ___ ball.',o:["it's",'its','his'],a:1},{q:'We love ___ cat.',o:['our','their','your'],a:0},{q:'Choose the correct sentence.',o:['This is phone my.','This is my phone.','This my is phone.'],a:1}]},
  {id:'con',title:'Conversation',ar:'المحادثة',icon:'💬',qs:[{q:'"Do you have any pets?" — Best answer:',o:['Yes, I do. I have a cat.','Yes, I am.','I am a pet.'],a:0},{q:'"What\'s its name?" — Best answer:',o:['It is three.','His name is Max.','It is big.'],a:1},{q:'"How old is he?" — Best answer:',o:['He is brown.','He is two years old.','He is Max.'],a:1},{q:'"What does she look like?" — Best answer:',o:['She is small and white.','She is one year old.','Her name is Mimi.'],a:0},{q:'"She\'s so cute!" — Best answer:',o:['Yes, she is!','No, I don\'t.','Nice to meet you.'],a:0}]},
  {id:'rea',title:'Reading',ar:'القراءة',icon:'📖',passage:["I have a rabbit. Her name is Snow.","She is small and white. She is two years old.","She likes carrots. She is very cute.","My brother has a fish. Its name is Goldie.","Goldie is orange and it can swim fast."],
   qs:[{q:'What animal is Snow?',o:['a cat','a rabbit','a fish'],a:1},{q:'What color is Snow?',o:['white','orange','brown'],a:0},{q:'What does Snow like?',o:['bananas','carrots','fish'],a:1},{q:'Who has a fish?',o:['the writer','her brother','her sister'],a:1},{q:'Goldie can ___.',o:['fly','climb trees','swim fast'],a:2}]},
  {id:'wri',title:'Writing',ar:'الكتابة',icon:'✍️',writing:true,prompt:'Write about your favourite animal or your pet (40–80 words).',promptAr:'اكتب عن حيوانك المفضل أو حيوانك الأليف (من ٤٠ لـ ٨٠ كلمة): اسمه، عمره، شكله، بيحب إيه، وليه بتحبه.',
   checks:[['🐾','My favourite animal is… / I have a…','animal'],['📛','Its / His / Her name is…','petname'],['📅','It is … years old.','age'],['🎨','It is big / small / brown…','describe'],['❤️','It likes…','likes'],['💬','I like it because…','because']]}]}
};
