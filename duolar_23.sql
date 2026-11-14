-- Jannat sari: 23 ta kundalik duo (yashirin holatda)
-- Avval duolar.sql ishga tushgan bo‘lishi kerak. Supabase > SQL Editor ga joylab, bir marta Run bosing.
-- Duolar faol=false bilan qo‘shiladi: ilovada ko‘rinmaydi. Tekshirib bo‘lgach, adminda yoqiladi.

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Uyg‘onganda$d$,$d$الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ$d$,$d$Alhamdulillahil lazi ahyana ba‘da ma amatana va ilayhin nushur.$d$,$d$Bizni o‘ldirgandan (uyquga ketgandan) keyin tiriltirgan Allohga hamd bo‘lsin. Qaytish faqat Uning huzurigadir.$d$,1,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Kun tartibi$d$ and t.nom=$d$Uyg‘onganda$d$
and not exists (select 1 from duo where sarlavha=$d$Uyg‘onganda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Uxlashdan oldin$d$,$d$بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا$d$,$d$Bismika Allohumma amutu va ahya.$d$,$d$Ey Alloh, Sening noming bilan uxlayman va Sening noming bilan uyg‘onaman.$d$,2,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Kun tartibi$d$ and t.nom=$d$Uxlashdan oldin$d$
and not exists (select 1 from duo where sarlavha=$d$Uxlashdan oldin$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Oyatul kursi (uxlashdan oldin)$d$,$d$ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ$d$,$d$Allohu la ilaha illa huval hayyul qoyyum. La ta’xuzuhu sinatun va la navm. Lahu ma fis samavati va ma fil arz. Man zallazi yashfa‘u ‘indahu illa bi iznih. Ya‘lamu ma bayna aydihim va ma xalfahum, va la yuhituna bi shay’im min ‘ilmihi illa bima sho’. Vasi‘a kursiyyuhus samavati val arz, va la ya’uduhu hifzuhuma va huval ‘aliyyul ‘azim.$d$,$d$Alloh – Undan o‘zga iloh yo‘q zotdir. U tirik va qayyumdir. Uni mudroq ham, uyqu ham olmas. Osmonlar-u yerdagi narsalar Unikidir. Uning huzurida O‘zining izni bilan bo‘lmasa, hech kim shafoat qila olmas. U ularning oldilaridagi narsani ham, ortlaridagi narsani ham bilur. Uning ilmidan hech narsani ihota qila olmaslar, magar O‘zi xohlaganini, xolos. Uning kursisi osmonlar-u yerni qamragan. Ularni muhofaza qilish Uni charchatmas. Va U Oliy va Azim zotdir.$d$,3,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Qur’on bilan$d$ and t.nom=$d$Oyatul kursi$d$
and not exists (select 1 from duo where sarlavha=$d$Oyatul kursi (uxlashdan oldin)$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Ovqatdan oldin$d$,$d$بِسْمِ اللَّهِ
بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ$d$,$d$Bismillah.
Boshida unutgan bo‘lsa: Bismillahi fi avvalihi va axirih.$d$,$d$Alloh nomi bilan (boshlayman).
Boshida aytishni unutgan bo‘lsa: Alloh nomi bilan, uning avvalida ham, oxirida ham.$d$,4,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Ovqat va ichimlik$d$ and t.nom=$d$Ovqatdan oldin$d$
and not exists (select 1 from duo where sarlavha=$d$Ovqatdan oldin$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Ovqatdan keyin$d$,$d$الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا$d$,$d$Alhamdu lillahi hamdan kasiron toyyiban mubarokan fih, g‘oyro makfiyyin va la muvadda‘in va la mustag‘nan ‘anhu Robbana.$d$,$d$Allohga ko‘p, pokiza va barakali hamdlar bo‘lsin. Ey Robbimiz, bu hamdni kifoya qildi deb qoldirib ketilmaydigan, vido qilinmaydigan va undan behojat bo‘lib bo‘lmaydigan hamd qilamiz.$d$,5,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Ovqat va ichimlik$d$ and t.nom=$d$Ovqatdan keyin$d$
and not exists (select 1 from duo where sarlavha=$d$Ovqatdan keyin$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Kiyim kiyganda$d$,$d$الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ$d$,$d$Alhamdulillahil lazi kasani haza va razaqonihi min g‘oyri havlin minni va la quvva.$d$,$d$Menga buni kiygizgan va mening kuch-quvvatimsiz rizq qilib bergan Allohga hamd bo‘lsin.$d$,6,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Tahorat va poklik$d$ and t.nom=$d$Kiyim kiyganda$d$
and not exists (select 1 from duo where sarlavha=$d$Kiyim kiyganda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Uydan chiqqanda$d$,$d$بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ$d$,$d$Bismillahi tavakkaltu ‘alalloh, va la havla va la quvvata illa billah.$d$,$d$Alloh nomi bilan (chiqdim). Allohga tavakkal qildim. Kuch ham, quvvat ham faqat Alloh bilandir.$d$,7,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Uy va oila$d$ and t.nom=$d$Uydan chiqqanda$d$
and not exists (select 1 from duo where sarlavha=$d$Uydan chiqqanda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Uyga kirganda$d$,$d$بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا$d$,$d$Bismillahi valajna, va bismillahi xorajna, va ‘alalloh Robbina tavakkalna.$d$,$d$Alloh nomi bilan kirdik, Alloh nomi bilan chiqdik va Robbimiz Allohga tavakkal qildik.$d$,8,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Uy va oila$d$ and t.nom=$d$Uyga kirganda$d$
and not exists (select 1 from duo where sarlavha=$d$Uyga kirganda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Hojatxonaga kirganda$d$,$d$اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ$d$,$d$Allohumma inni a‘uzu bika minal xubusi val xobais.$d$,$d$Ey Alloh, men Sendan barcha yomon narsalardan va shaytonlardan panoh so‘rayman.$d$,9,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Tahorat va poklik$d$ and t.nom=$d$Hojatxonaga kirganda$d$
and not exists (select 1 from duo where sarlavha=$d$Hojatxonaga kirganda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Hojatxonadan chiqqanda$d$,$d$غُفْرَانَكَ$d$,$d$G‘ufronak.$d$,$d$Ey Alloh, Sendan mag‘firat so‘rayman.$d$,10,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Tahorat va poklik$d$ and t.nom=$d$Hojatxonadan chiqqanda$d$
and not exists (select 1 from duo where sarlavha=$d$Hojatxonadan chiqqanda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Masjidga kirganda$d$,$d$اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ$d$,$d$Allohummaftah li abvaba rohmatik.$d$,$d$Ey Alloh, menga rahmating eshiklarini och.$d$,11,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Namoz$d$ and t.nom=$d$Masjidga kirganda$d$
and not exists (select 1 from duo where sarlavha=$d$Masjidga kirganda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Masjiddan chiqqanda$d$,$d$اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ$d$,$d$Allohumma inni as’aluka min fadlik.$d$,$d$Ey Alloh, men Sendan fazlingdan so‘rayman.$d$,12,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Namoz$d$ and t.nom=$d$Masjiddan chiqqanda$d$
and not exists (select 1 from duo where sarlavha=$d$Masjiddan chiqqanda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Safarga chiqishda$d$,$d$اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ
سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ
اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى
اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ
اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ
اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ$d$,$d$Allohu akbar, Allohu akbar, Allohu akbar.
Subhanallazi saxxora lana haza va ma kunna lahu muqrinin, va inna ila Robbina lamunqalibun.
Allohumma inna nas’aluka fi safarina haza al-birro vat taqva, va minal ‘amali ma tarzo.
Allohumma havvin ‘alayna safarana haza vatvi ‘anna bu‘dah.
Allohumma antas sohibu fis safar val xolifatu fil ahl.
Allohumma inni a‘uzu bika min va‘saos safar, va ka’abatil manzar, va suil munqolabi fil mali val ahl.$d$,$d$Alloh buyukdir (uch marta). Buni bizga bo‘ysundirgan zot pokdir, biz bunga qodir emas edik. Albatta, biz Robbimiz huzuriga qaytuvchimiz. Ey Alloh, bu safarimizda Sendan yaxshilik va taqvo hamda Sen rozi bo‘ladigan amalni so‘raymiz. Ey Alloh, bu safarimizni bizga yengil qil va uning uzoqligini bizdan yig‘ishtirib ol. Ey Alloh, Sen safardagi hamrohimiz va oilamizdagi xalifamizsan. Ey Alloh, men Sendan safarning mashaqqatidan, ko‘ngilsiz manzaradan va mol-mulk hamda oilaga yomon holda qaytishdan panoh so‘rayman.$d$,13,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Safar$d$ and t.nom=$d$Safarga chiqishda$d$
and not exists (select 1 from duo where sarlavha=$d$Safarga chiqishda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Aksirganda$d$,$d$الْحَمْدُ لِلَّهِ
يَرْحَمُكَ اللَّهُ
يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ$d$,$d$Alhamdulillah.
Yarhamukalloh.
Yahdikumulloh va yuslihu balakum.$d$,$d$Aksirgan kishi: «Allohga hamd bo‘lsin».
Eshitgan kishi: «Alloh seni rahmat qilsin».
Aksirgan kishi javobi: «Alloh sizni hidoyat qilsin va ahvolingizni isloh qilsin».$d$,14,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Salomatlik$d$ and t.nom=$d$Aksirganda$d$
and not exists (select 1 from duo where sarlavha=$d$Aksirganda$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Salomlashish$d$,$d$السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ$d$,$d$Assalomu ‘alaykum va rohmatulloh va barokatuh.
Va ‘alaykumus salom va rohmatulloh va barokatuh.$d$,$d$Sizga salomatlik, Allohning rahmati va barakasi bo‘lsin.
Javobi: Sizga ham salomatlik, Allohning rahmati va barakasi bo‘lsin.$d$,15,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Muomala va axloq$d$ and t.nom=$d$Salomlashish$d$
and not exists (select 1 from duo where sarlavha=$d$Salomlashish$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Ikki olam yaxshiligi (2:201)$d$,$d$رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةًۭ وَفِى ٱلْءَاخِرَةِ حَسَنَةًۭ وَقِنَا عَذَابَ ٱلنَّارِ$d$,$d$Robbana atina fid dunya hasanatan va fil axiroti hasanatan va qina ‘azaban nar.$d$,$d$Robbimiz, bizga bu dunyoda ham yaxshilikni, oxiratda ham yaxshilikni bergin va bizni do‘zax olovi azobidan saqlagin.$d$,16,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Qur’on bilan$d$ and t.nom=$d$Qur’ondagi duolar$d$
and not exists (select 1 from duo where sarlavha=$d$Ikki olam yaxshiligi (2:201)$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Ilm ziyodaligi (20:114)$d$,$d$رَّبِّ زِدْنِى عِلْمًۭا$d$,$d$Robbi zidni ‘ilma.$d$,$d$Robbim, ilmimni ziyoda qilgin.$d$,17,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Qur’on bilan$d$ and t.nom=$d$Qur’ondagi duolar$d$
and not exists (select 1 from duo where sarlavha=$d$Ilm ziyodaligi (20:114)$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Hidoyatda barqarorlik (3:8)$d$,$d$رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ$d$,$d$Robbana la tuzig qulubana ba‘da iz hadaytana va hab lana min ladunka rohmah, innaka antal vahhab.$d$,$d$Ey Robbimiz, bizni hidoyat qilganingdan so‘ng qalblarimizni og‘dirmagin va bizga O‘z huzuringdan rahmat ato qilgin. Albatta, Sening O‘zing ko‘plab ato qiluvchisan.$d$,18,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Qur’on bilan$d$ and t.nom=$d$Qur’ondagi duolar$d$
and not exists (select 1 from duo where sarlavha=$d$Hidoyatda barqarorlik (3:8)$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Tavba duosi (7:23)$d$,$d$رَبَّنَا ظَلَمْنَآ أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ ٱلْخَٰسِرِينَ$d$,$d$Robbana zalamna anfusana va in lam tag‘fir lana va tarhamna lanakunanna minal xosirin.$d$,$d$Ey Robbimiz, biz o‘zimizga zulm qildik. Agar Sen bizni mag‘firat qilmasang va bizga rahm qilmasang, albatta, ziyon ko‘rganlardan bo‘lamiz.$d$,19,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Qur’on bilan$d$ and t.nom=$d$Qur’ondagi duolar$d$
and not exists (select 1 from duo where sarlavha=$d$Tavba duosi (7:23)$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Ota-ona uchun duo (17:24)$d$,$d$رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًۭا$d$,$d$Robbirhamhuma kama robbayani sog‘iro.$d$,$d$Robbim, ular meni kichikligimda tarbiya qilganlaridek, ularga rahm qilgin.$d$,20,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Qur’on bilan$d$ and t.nom=$d$Qur’ondagi duolar$d$
and not exists (select 1 from duo where sarlavha=$d$Ota-ona uchun duo (17:24)$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Istig‘for$d$,$d$أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ$d$,$d$Astag‘firulloha va atubu ilayh.$d$,$d$Allohdan mag‘firat so‘rayman va Unga tavba qilaman.$d$,21,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Tavba va iymon$d$ and t.nom=$d$Istig‘for$d$
and not exists (select 1 from duo where sarlavha=$d$Istig‘for$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$Sayyidul istig‘for$d$,$d$اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ$d$,$d$Allohumma anta Robbi la ilaha illa ant, xolaqtani va ana ‘abduk, va ana ‘ala ‘ahdika va va‘dika mastato‘t. A‘uzu bika min sharri ma sona‘t. Abu’u laka bi ni‘matika ‘alayya va abu’u bi zanbi fag‘firli, fa innahu la yag‘firuz zunuba illa ant.$d$,$d$Ey Alloh, Sen mening Robbimsan, Sendan o‘zga iloh yo‘q. Meni yaratding, men Sening bandangman va qodir bo‘lganimcha Senga bergan ahd va va’dada turibman. Qilgan yomonligimdan Sendan panoh so‘rayman. Menga bergan ne’matingni tan olaman va gunohimni ham tan olaman, meni mag‘firat qil, chunki gunohlarni Sendan o‘zga hech kim mag‘firat qila olmaydi.$d$,22,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Tavba va iymon$d$ and t.nom=$d$Sayyidul istig‘for$d$
and not exists (select 1 from duo where sarlavha=$d$Sayyidul istig‘for$d$);

insert into duo(turkum_id,sarlavha,arab,oqilishi,manosi,tartib,faol)
select t.id,$d$G‘am-tashvishdan panoh so‘rash$d$,$d$اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ$d$,$d$Allohumma inni a‘uzu bika minal hammi val hazan, val ‘ajzi val kasal, val buxli val jubn, va zola‘id dayni va g‘olabatir rijal.$d$,$d$Ey Alloh, men Sendan g‘am-tashvishdan, ojizlik va dangasalikdan, baxillik va qo‘rqoqlikdan, qarz og‘irligidan va odamlar (zulmi)ning ustun kelishidan panoh so‘rayman.$d$,23,false
from duo_turkum t join duo_guruh g on g.id=t.guruh_id
where g.nom=$d$Himoya va tinchlik$d$ and t.nom=$d$G‘am va tashvish$d$
and not exists (select 1 from duo where sarlavha=$d$G‘am-tashvishdan panoh so‘rash$d$);
