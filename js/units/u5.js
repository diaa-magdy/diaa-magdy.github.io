UNITS[5] = {
 n:5, title:'Food', ar:'الأكل', icon:'🍔', cover:'img/u5.jpg',
 intro:'اطلب أكل وشرب، واتكلم عن أكلك المفضل، واتعلم الجمع (plurals).',
 videos:[
  {id:'u5v1', title:'Conversation: Food', ar:'محادثة: الأكل', src:'video/u5v1.mp4', poster:'img/u5v1.jpg',
   sp:{a:{n:'Ali',g:'m'},b:{n:'Sam',g:'m2'}},
   lines:[
   ['a',"Hi, Sam! Are you hungry?","أهلًا يا سام! إنت جعان؟"],
   ['b',"Yes, I am. I'm very hungry.","أيوه. أنا جعان جدًا."],
   ['a',"What would you like to eat?","تحب تاكل إيه؟"],
   ['b',"I'd like a burger, please.","عايز برجر لو سمحت."],
   ['a',"Great! Would you like fries with it?","تمام! تحب بطاطس معاه؟"],
   ['b',"Yes, please.","أيوه لو سمحت."],
   ['a',"What would you like to drink?","تحب تشرب إيه؟"],
   ['b',"I'd like orange juice, please.","عايز عصير برتقان لو سمحت."],
   ['a',"Okay. Would you like anything else?","ماشي. تحب حاجة تانية؟"],
   ['b',"No, thank you. That's all.","لا، شكرًا. بس كده."],
   ['a',"Here is your burger, fries, and orange juice.","اتفضل البرجر والبطاطس وعصير البرتقان."],
   ['b',"Wow! It looks delicious!","واو! شكله لذيذ!"],
   ['a',"Enjoy your meal!","بالهنا والشفا!"],
   ['b',"Thank you! It's really good!","شكرًا! ده حلو جدًا!"],
   ['a',"You're welcome!","العفو!"]],
   quiz:[{q:'Is Sam hungry?',o:["No, he isn't.",'Yes, he is very hungry.','He is thirsty.'],a:1},{q:'What does Sam want to eat?',o:['a pizza','a burger','a salad'],a:1},{q:'What does Sam want to drink?',o:['water','coffee','orange juice'],a:2},{q:'Does Sam want anything else?',o:['Yes, a cake.',"No, that's all.",'Yes, tea.'],a:1},{q:'How is the food?',o:['delicious','cold','bad'],a:0}],
   fill:[[0,'hungry'],[2,'eat'],[3,'burger'],[4,'fries'],[6,'drink'],[7,'orange juice'],[11,'delicious']]}
 ],
 vocab:[
  {t:'Food', ar:'أكل', items:[['🍔','burger',"I'd like a burger."],['🍟','fries','Fries with it, please.'],['🍕','pizza','My favorite food is pizza.'],['🍝','pasta','I like pasta.'],['🍗','chicken','I eat grilled chicken.'],['🥗','salad','I eat fresh salad.'],['🐟','fish',"I don't like fish."],['🍰','dessert','I eat dessert on Fridays.']]},
  {t:'Fruit & vegetables', ar:'فاكهة وخضار', items:[['🍌','banana','I like bananas.'],['🍎','apple','An apple a day.'],['🍅','tomato','Tomatoes are red.'],['🥒','cucumber','I eat cucumbers.'],['🥕','carrot','Carrots are orange.'],['🍊','orange','This orange is sweet.'],['🥚','egg','I eat eggs for breakfast.'],['🍞','bread','I have bread and cheese.']]},
  {t:'Drinks & feelings', ar:'مشروبات وإحساس', items:[['🧃','orange juice',"I'd like orange juice."],['💧','water','I drink water.'],['☕','coffee','Sometimes I drink coffee.'],['🍵','tea','Do you drink tea?'],['😋','hungry','I am very hungry.'],['🥤','thirsty','I am thirsty.'],['🤤','delicious','It looks delicious!'],['💪','healthy','I eat healthy food.']]}
 ],
 talk:[
  {title:'Discussion Questions: Food', ar:'أسئلة عن الأكل', list:[["What is your favorite food? Why?","إيه أكلتك المفضلة؟ ليه؟","My favorite food is pizza. It is delicious."],["Do you like cooking? What do you usually cook?","بتحب الطبخ؟ بتطبخ إيه عادة؟","Yes. I cook eggs and pasta."],["Do you think you have a healthy diet? Why or why not?","أكلك صحي؟ ليه؟","Yes. I eat fruit and vegetables."],["What is your favorite drink? Do you drink coffee or tea?","إيه مشروبك المفضل؟ قهوة ولا شاي؟","I like orange juice. I drink tea."],["What foods do you dislike? Why?","إيه الأكل اللي مبتحبوش؟ ليه؟","I don't like fish."],["Do you prefer home-cooked meals or eating out? Why?","بتفضل أكل البيت ولا الأكل برة؟ ليه؟","I prefer home-cooked meals."],["What traditional food from your country would you recommend?","إيه أكلة مصرية ترشحها لسائح؟","I recommend koshari."],["How often do you eat sweets or desserts?","بتاكل حلويات قد إيه؟","I eat sweets on Fridays."]]}
 ],
 grammar:{title:'Plurals', ar:'الجمع — واحد ولا أكتر', blocks:[
  {type:'intro', en:'When we have more than one person, thing, place or idea, we use a plural noun.', ar:'لما يكون عندنا أكتر من حاجة بنستخدم الجمع: غالبًا بنزود s أو es أو نغير y لـ ies.'},
  {type:'table', title:'➕ Add -s (most nouns)', head:['Singular','Plural'], rows:[['book','books'],['pen','pens'],['bag','bags'],['car','cars'],['table','tables']]},
  {type:'table', title:'➕ Add -es (s, x, sh, ch, o)', head:['Singular','Plural'], rows:[['bus','buses'],['box','boxes'],['dish','dishes'],['watch','watches'],['tomato','tomatoes']]},
  {type:'table', title:'🔁 Consonant + y → ies', head:['Singular','Plural'], rows:[['baby','babies'],['family','families'],['city','cities'],['country','countries'],['party','parties']]},
  {type:'table', title:'⭐ Special words', head:['Singular','Plural'], rows:[['man','men'],['woman','women'],['child','children'],['foot','feet'],['tooth','teeth'],['person','people']]},
  {type:'tip', en:'one book → two books · one child → three children', ar:'افتكر الكلمات الخاصة: man → men و child → children و person → people.'}]},
 exercises:[
  {type:'mcq',title:'Write the plural',ar:'اختار الجمع الصح',speak:true,items:[{q:'cat → ___',o:['cats','cates'],a:0},{q:'bus → ___',o:['buss','buses'],a:1},{q:'tomato → ___',o:['tomatos','tomatoes'],a:1},{q:'watch → ___',o:['watches','watchs'],a:0},{q:'baby → ___',o:['babys','babies'],a:1},{q:'city → ___',o:['cities','citys'],a:0},{q:'box → ___',o:['boxs','boxes'],a:1}]},
  {type:'mcq',title:'Special plurals',ar:'جمع خاص',speak:true,items:[{q:'one man → two ___',o:['mans','men'],a:1},{q:'one child → three ___',o:['children','childs'],a:0},{q:'one foot → two ___',o:['foots','feet'],a:1},{q:'one tooth → many ___',o:['teeth','tooths'],a:0},{q:'one person → five ___',o:['persons','people'],a:1}]},
  {type:'mcq',title:'At the restaurant',ar:'اختار الرد',speak:true,items:[{q:'Are you hungry?',o:["Yes, I am. I'm very hungry.",'Yes, I do.','I am a burger.'],a:0},{q:'What would you like to eat?',o:["I'd like a burger, please.",'I like Cairo.','I am fine.'],a:0},{q:'What would you like to drink?',o:["I'd like water, please.",'I drink every day.','I am thirsty, please.'],a:0},{q:'Would you like anything else?',o:["No, thank you. That's all.",'Yes, I am.','Goodbye.'],a:0}]},
  {type:'ord',title:'Make sentences',ar:'رتّب الكلمات',items:[{c:["I'd like",'a burger','please'],a:[0,1,2]},{c:['My favorite food','pizza','is'],a:[0,2,1]},{c:['I',"don't like",'fish'],a:[0,1,2]},{c:['She','three apples','has'],a:[0,2,1]}]}
 ],
 reading:{title:'My Favorite Food', ar:'أكلتي المفضلة', video:'video/u5r.mp4', poster:'img/u5r.jpg', g:'f', lines:[
  ["Hi! My name is Sara. I am 24 years old. I am from Egypt.","أهلًا! اسمي سارة. عندي ٢٤ سنة. أنا من مصر."],["I like food. My favorite food is pizza.","بحب الأكل. أكلتي المفضلة البيتزا."],["I usually eat pizza on the weekend. It is delicious and makes me happy.","بآكل بيتزا عادة في الويك إند. لذيذة وبتفرحني."],["I also like pasta, grilled chicken, and fresh salad.","وبحب كمان المكرونة والفراخ المشوية والسلطة الطازة."],["I try to eat healthy food because I want to feel good and have energy.","بحاول آكل أكل صحي عشان أحس إني كويسة وعندي طاقة."],["I usually eat vegetables like tomatoes, cucumbers, and carrots.","بآكل خضار زي الطماطم والخيار والجزر."],["I don't like fish, but I like fruit, especially bananas and apples.","مبحبش السمك، بس بحب الفاكهة، خصوصًا الموز والتفاح."],["For drinks, I usually drink water. Sometimes I drink orange juice or coffee.","في المشروبات بشرب مية عادة. وساعات عصير برتقان أو قهوة."],["Good food is important. It gives me energy and helps me stay healthy.","الأكل الكويس مهم. بيديني طاقة وبيخليني بصحة كويسة."],["I enjoy trying new foods too!","وبحب أجرب أكلات جديدة كمان!"]],
  keys:[['🍕','pizza','favorite food'],['🍝','pasta','also likes'],['🥗','salad','fresh'],['🥕','vegetables','healthy'],['🐟','fish',"doesn't like"],['💧','water','usual drink']],
  quiz:[{q:'How old is Sara?',o:['20','24','42'],a:1},{q:"What is Sara's favorite food?",o:['pasta','pizza','fish'],a:1},{q:'When does she eat pizza?',o:['every day','on the weekend','for breakfast'],a:1},{q:"What food doesn't she like?",o:['fish','chicken','salad'],a:0},{q:'What does she usually drink?',o:['coffee','juice','water'],a:2},{q:'Why does she eat healthy food?',o:['to feel good and have energy','because it is cheap','because she is a chef'],a:0}]},
 sounds:{title:'Silent letters: wr · wh · kn · gn', ar:'حروف بنكتبها ومبنطقهاش', video:'video/u5s.mp4', poster:'img/u5s.jpg',
  tip:['Some letters are there, but we don\'t hear them!','حروف موجودة في الكلمة بس مبنسمعهاش: w في wr، و h في wh، و k في kn، و g في gn.'],
  groups:[['wr','w is silent','write','#1d6bf3',[['✍️','write'],['❌','wrong'],['⌚','wrist'],['🎁','wrap']]],['wh','h is silent','what','#7b4fd6',[['❓','what'],['📍','where'],['🕐','when'],['🐋','whale']]],['kn','k is silent','know','#f27f0c',[['🦵','knee'],['🔪','knife'],['🚪','knock'],['🧠','know']]],['gn','g is silent','sign','#13a39a',[['🪧','sign'],['🧙','gnome'],['🎨','design'],['🦟','gnat']]]],
  quiz:{title:'Which letter is silent?',ar:'أنهي حرف مش بيتنطق؟',opts:['w','h','k','g'],items:[['✍️','write',0],['🔪','knife',2],['❓','what',1],['🪧','sign',3],['🦵','knee',2],['❌','wrong',0],['🐋','whale',1],['🧙','gnome',3]]}},
 games:{pairs:[['🍔','burger'],['🍕','pizza'],['🍎','apple'],['🍌','banana'],['🥕','carrot'],['🧃','juice']],
  spell:[['🍕','pizza'],['🍎','apple'],['🥚','egg'],['🍞','bread'],['🍟','fries'],['🐟','fish'],['🍵','tea'],['🍗','chicken']],
  speed:[['two books',true],['three boxs',false],['four cities',true],['two babys',false],['five children',true],['two mans',false],['three tomatoes',true],['two foots',false],['many people',true],['two watches',true],['three dishs',false],['two teeth',true],["I'd like a burger, please.",true],['I am very hungry.',true],['I am hungry very.',false],['Would you like fries?',true]]},
 test:{pass:60, sections:[
  {id:'voc',title:'Vocabulary',ar:'المفردات',icon:'📚',qs:[{pic:'🍔',q:"I'd like a ___, please.",o:['burger','banana','bread'],a:0},{pic:'🥕',q:'Carrots are ___.',o:['vegetables','drinks','desserts'],a:0},{pic:'🧃',q:'I drink orange ___.',o:['juice','salad','fries'],a:0},{pic:'😋',q:'I want to eat. I am ___.',o:['thirsty','hungry','tired'],a:1},{pic:'🤤',q:'The pizza is very good. It is ___.',o:['delicious','small','cold'],a:0},{q:'"صحي" in English is…',say:'Choose the correct word.',o:['healthy','hungry','happy'],a:0}]},
  {id:'gra',title:'Grammar',ar:'القواعد',icon:'📘',qs:[{q:'one apple → two ___',o:['apple','apples','applees'],a:1},{q:'one box → three ___',o:['boxs','boxes','box'],a:1},{q:'one city → two ___',o:['citys','cities','cityes'],a:1},{q:'one child → four ___',o:['childs','children','childrens'],a:1},{q:'one tomato → five ___',o:['tomatos','tomatoes','tomato'],a:1},{q:'Choose the correct sentence.',o:['I have two foots.','I have two feet.','I have two feets.'],a:1}]},
  {id:'con',title:'Conversation',ar:'المحادثة',icon:'💬',qs:[{q:'"Are you hungry?" — Best answer:',o:["Yes, I am.","Yes, I do.","Yes, it is."],a:0},{q:'"What would you like to eat?" — Best answer:',o:["I'd like pasta, please.",'I like Egypt.','I am 10.'],a:0},{q:'"Would you like fries with it?" — Best answer:',o:['Yes, please.','Yes, I am.','I am fries.'],a:0},{q:'"Enjoy your meal!" — Best answer:',o:['Thank you!','Me too.','Good morning.'],a:0},{q:'"Thank you!" — Best answer:',o:["You're welcome!","I'm hungry.","That's all."],a:0}]},
  {id:'rea',title:'Reading',ar:'القراءة',icon:'📖',passage:["My name is Karim. I love food.","My favorite food is koshari.","For breakfast, I eat eggs and bread.","I don't like fish, but I like chicken.","I usually drink water and sometimes tea."],
   qs:[{q:"What is Karim's favorite food?",o:['pizza','koshari','fish'],a:1},{q:'What does he eat for breakfast?',o:['eggs and bread','pizza','salad'],a:0},{q:"What doesn't he like?",o:['chicken','fish','tea'],a:1},{q:'What does he usually drink?',o:['juice','coffee','water'],a:2},{q:'Karim likes ___.',o:['chicken','fish','nothing'],a:0}]},
  {id:'wri',title:'Writing',ar:'الكتابة',icon:'✍️',writing:true,prompt:'Write about your favorite food and drinks (40–80 words).',promptAr:'اكتب عن أكلك وشربك المفضل (من ٤٠ لـ ٨٠ كلمة): أكلتك المفضلة، بتاكل إيه في الفطار، إيه اللي مبتحبوش، وبتشرب إيه.',
   checks:[['🍕','My favorite food is…','favfood'],['🍳','For breakfast I eat…','breakfast'],['❤️','I like…','likes'],['🚫',"I don't like…",'dontlike'],['🥤','I drink…','drink'],['💬','because…','because']]}]}
};
