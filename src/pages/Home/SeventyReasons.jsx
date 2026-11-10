import { Show, createSignal } from 'solid-js';
import './Home.style.scss';

const seventyReasons = [
  [
    "What was the first thing you noticed about Dipti?<br/>Be honest, we both know it wasn't her personality.",
    "Nonsense, this app is against me la...it was her hair, as the wind blew on it, and then it was her eyes....I didn't expect her to take my breathe away..."
  ],
  [
    "What did you think the first time you saw her?",
    "My mind was blank...she told me I had this stupid look on my face, a look that probably said I didn't like what I saw...but I was just in awe...I took a moment before walking up to her, had some great cool intro, and now, as I write this, I cannot even remember what it was...for the first time in my whole life, I knew this woman was going to melt all my chains..."
  ],
  [
    "What was your smoothest move to win her over, and what was your worst?",
    "I'm pretty sure my worst was the kissing without touching trick, pretty sure I would have gotten a slap for that...not that it would have stopped me...kikiki...but there was no smoothest move...I played nothing, I didn't scheme anything, I was too caught up with how it felt, my heart wanted it all to be just as it was...I just let the rivers of fate dictate where this would take me...I still don't think I won her over, hahaha I'm positive it will take my whole life for that, and that actually makes me excited..."
  ],
  [
    "When did you know she was The One?",
    "Me being me, I played it all in my head even as we spoke the first day...I only slowed everything down when I realised I didn't tell her about my past...I slowed down after that, well at least I think I did...but deep down, there was already a gnawing feeling deep inside, an instinctual feeling that said, she is the one...like I've seen this person, the feeling was very familiar, the way we clicked, our desires, principles, even our opposites, it was too smooth, too compatible...almost like everything was just a dream...I knew from the start she was the one, but it would be foolish to say it to anyone...so I kept it to myself..."
  ],
  [
    "What were you secretly panicking about on our first date?",
    "Jesus...everything...my outfit, my messy hair, my nose, I bought new clothes for it, only wore the shirt, changed the pants cause it was too loose, already panicking about it falling off...but of all, I was just panicking that she wouldn't like me, you know, some people change their minds once they see something physically, then it hits them, that owh this isn't what they want...owh and the gifts, will she like it? She loves coffee, but its serious for her...and the stupid cheap flower I fixed the night before, was worried it will break..."
  ],
  [
    "What was the first thing she said that made you fall for her?",
    "That would be heyy...hahaha, maybe when she said fuck me after I told her I'm Jake Peralta...her extraordinary reactions is something I'm always looking out for haha...I don't think there was a particular thing she said that made me fall for her, it was everything...I'm still falling for her in ways I cannot even understand..."
  ],
  [
    "Which outfit of hers lived rent free in your head from day one?",
    "Haha, that would be the dress she wore when I first met her...I still dream alot about it, different scenes, different backgrounds...same dress...but I can't remember the details...I've seen her in many other prettier ones, but that dress, it stayed, deep in my heart..."
  ],
  [
    "When did you realise you were in trouble (the good kind)?",
    "Haha, that happened on the app itself, as we were texting, I already realised I was smiling too much, and everyone around me already started noticing...I was always overconfident because I know nobody can shake me, but this woman, owhhh this woman, she said at one point, that she will make me cry, and I knew then, when I didn't smirk at that remark, that I was going to be in deep deep trouble..."
  ],
  [
    "What did your family say when they heard about her?",
    "Well, they were just happy, because I was happy...they find it abit too good to be true of course, since everything sounds like it was a match made in heaven...but I wasn't making it up or trying to pitch a business plan, I was very honest...even I find it extremely hard to believe...which is why I describe it as a vivid dream..."
  ],
  [
    "When did you decide you are not letting this one go?",
    "This woman, gave me more than what anyone ever had in such a short period of time...she was kind to me from the beginning, just 1 hour in...and she was kind to me even when I wasn't to her...what more can any human ask for...I decided I wasn't going to let her go, when I realised for the first time in my life, I was being selfish...I choose me, and what I wanted...and I wanted this woman to be in my life...the old me would have let her go simply because she deserved better, so much better...but I cannot recognize that man anymore...at this point, my overconfidence and arrogance, believes whole heartedly, that I am the only one who will be at the pinacle of her life, the only one who will love her more than anything, and for that reason, no matter what happens, I will never let go...I will forever be there for her..."
  ],
  [
    "What is one thing about her that nobody else gets to see?",
    "Anyone who knows her will know how strong she is...how she carries herself, how she does everything on her own, her independence, her achievements, her plannings, a strong sophisticated independent woman, etc etc etc...but with me, she is mellow, beyond mellow...I would describe it as a small child, just sitting in my arms, sleeping or being cranky about everything...and it shows very obviously, a friend had commented once of how gentle she is around me...and she told me once if she slipped and fell, she would probably cry if I was there, but wouldn't if she was alone...that shift? Yeah...thats something people won't see..."
  ],
  [
    "What makes her laugh so hard she can't breathe?",
    "Haha, for starters that would be my tickles...its also when I pronounce certain words in the 'right' way, like Suu-pee-neh and Pro-neh...she can't wrap her head around it, that my English is so extremely amazing...and then we have my awesome historically culture rich semme jokkanu indian swag...she loves my pariahness...I'm kidding...she hates it, but nothing a few tickles and kisses won't solve eh?"
  ],
  [
    "Which of her annoying habits do you secretly adore?",
    "Ahh, where do we begin eh...how OCD she is? She literally swapped the clothes I hung to face the other way, I can already tell alot of things are going to be facing the other way...the fact that even if the shoe is misaligned abit, and she gonna flip about it...or that she constantly loves telling me that I don't love her...or how pessimistic she is about things...or how hard and brutal she is on her opinion on things...this aren't bad things, I just label them as annoying because it tickles my brain...owh and she loves reminding me what an athlete she is...oooo....ahhh...can't even do pullups...but hey, she adorable ok...so lets just squeeze her when we can..."
  ],
  [
    "What does she do that instantly melts you?",
    "90% of the time, she is in her macho, gengster, Michelle Rodriguez vibe...that 10%? Ahh, the most feminine of beings I've ever seen...her grace, the smile, her cheekiness, when her eyes soften, and her lips tremble...its not really a good thing you know...I've had arguments where she pulls up the 10% side of her and suddenly I'm already not interested in arguing anymore haha...very bad indeed..."
  ],
  [
    "What is her superpower?",
    "HAHA that would be BOing...always BO BO BO...<br/><br/>I think her greatest superpower is her ability to function in the midst of chaos...which is the opposite of what I am...she manages the chaos until it becomes calm...it sounds simple, but it isn't...to be able to make decisions in the midst of chaos, it takes confidence in ones ability and also experience dealing in stressful environments, to be able to make decisions and live with it whole heartedly...its not for the faint of heart at all...me on the other hand, I simply ride and mold the chaos to my needs..."
  ],
  [
    "What is she scary good at?",
    "That would be dancing...baking...at her job...at being a good friend...and good listener, comfort for everyone else...people lean on this woman...owh and yeah, she is ok la in the athlete department...we'll give her some brownie points there...her ability to be obsessed with something and then train for it and pursue it is whats scary about her...I can't relate with the word scary, I'm in awe of it...I admire the woman for it..."
  ],
  [
    "Which of her looks makes you behave immediately?",
    "Well, try saying Omale semme jakkanu sarukku...let 5 seconds go...yup, thats the look...next question..."
  ],
  [
    "What is the sweetest thing she has ever done for you?",
    "She baked for me...as basic as my answer is, you probably wouldn't understand what it means...baking is personal for her, its not for the public...she told this very early to me, its only for the people close to her, family only...and well, she isn't the type to say lovey dovey things openly...but when she baked for me, I was deeply touched...I didn't say anything, but it meant alot..."
  ],
  [
    "What would you never admit to her face, but will admit here?",
    "Jesus...that she is probably fitter then I am la...abit...by a small margin...stupid...."
  ],
  [
    "Why did she win, and why does everyone else lose?",
    "She wins because she is tenacious, but more importantly, she isn't competing with anyone, she is doing it wholeheartedly for herself...her biggest adversary is herself and she strives to conquer it...she wins because she isn't fazed by the limitations that people face when they compete...there is no desire for money, fame, praises, bragging rights...she does it because she is passionate about it and because she wants to experience the newer versions of herself...this goes into everything she does...she is a winner because her reasons for winning are about her...there is no everyone else..."
  ],
  [
    "What goes through your mind when she wears her favourite outfit?",
    "I actually don't know which is her favourite outfit...but the times she did dress up, it just softens my heart, she isn't someone who dolls up, a very natural looking woman, and I'm already struggling at times to keep up with how beautiful she is in my eyes...so it gets worst when she actually does doll up...I can only think of holding her close to see her blush...and hear her ask me...what are you doing...it's my favourite thing to do..."
  ],
  [
    "Where is the most daring place you've wanted to steal a kiss?",
    "I'm an extremely daring person...I'm not bothered by my surroundings especially when it is just harmless kisses...so daring places isn't something I can relate with...there is none in my head that is daring...all the places in my head are perfectly fine places for a kiss...so, let your imagination fill that up eh..."
  ],
  [
    "How does she say your name when she wants something?",
    "Ooooo, this question itself pinches my heart...my name...no matter how she says it, always send a pinch through my heart, a short jolt of happiness...even when I'm getting nagged at...and she knows, she has power over me...she isn't the type of woman who wants things...the times she did, were just minor requests haha, and depending on her mood, its something in the lines of a cheeky version of 'Get me my water now!' or its a soft gentle version of 'Ishver...I'm hungry...'"
  ],
  [
    "Which of her glances can end an argument or start something else?",
    "Ah, well we all know of the glance that makes me behave now don't we...the other one? Haha...I don't think she has even seen me like that, in a way that says she wants me...she is only gentle, and extremely bashful...she can't even look at me at times when she has to say something from her heart...haha, it puts a smile on me when I think of it..."
  ],
  [
    "What is the cheekiest text she has ever sent you?",
    "Owh, there is just too much...she sends me countless cheeky messages just trying to get on my nerves...but the worst, was probably when I was moving some furnitures...she put an image in my head, she knows we are both very imaginative, and she played this whole scenario that literally made it extremely hard for me to focus on moving that day haha, I remember it well because I had to excuse myself to hide my problems..."
  ],
  [
    "What do you secretly stare at when she isn't looking?",
    "I don't really do things secretly, I'm very open about it...because I want her to know that I am looking at her...but I guess, it would be when she is walking in front of me, I would look at her neck and her waist, see the way she skips across...gets my blood going for some reason...its just a very feminine thing about her that I notice..."
  ],
  [
    "What does she do that is accidentally irresistible?",
    "Biting her lips...she says it is dry, but sometimes it comes off very differently for me haha...and also how she dances for all the songs...maybe she thinks it is adorable, but my god it is soooo bloody irresistible..."
  ],
  [
    "If you had one full night with no phones, no chores and no interruptions, what is the plan?",
    "Haha, we both know what we would be doing...with the limited time we have, I can tell we would lie down, hold each other and just talk about random things before the night darkens our thoughts...thing is, there were always no phones between us, and we did the chores and spoke at the sametime...even if there were interruptions, we would still inform the other..."
  ],
  [
    "What is your favourite memory that you will never tell the family?",
    "Hmmm, that would be the first time we spent the night together...nothing happened, but the dark blue room, her silhouette, her voice, the warmth of her skin...all of it...runs in my head like a loop...over and over..."
  ],
  [
    "What is the naughtiest thought you've had about her in public? Keep it classy.",
    "She has a poise elegance to her, the way she carries herself in public...compared to me, I'm not bothered about this things...so I've always wanted to randomly pull her and kiss her hard whenever the urge comes to me...and then tell her that if she continues to show me attitude, I'll do it again..."
  ],
  [
    "Who is the bigger blanket thief?",
    "Neither, we cuddle too much...and we are both aware when the other is exposed, there is a constant need for both of us to ensure the other is well tucked in...we are both givers, we are too caught up with ensuring the other is comfortable..."
  ],
  [
    "What small thing gets the most dramatic reaction from her?",
    "Haha, this revolves around her OCD, it can be that I didn't put the towel properly, or that I didn't push the chair in properly, or that I didn't put the shoes properly...well, could be that I wiped my hands on her hair towel...owh, could be my pariahness too...yup, thats a winner...owh not to forget, when I used bad words too...somehow there is some biasness here but I'm yet to solve that mystery..."
  ],
  [
    "What does she say that means \"I'm fine\" but definitely isn't?",
    "Owh, this is something we both do...we tend to minimize how we feel, and say 'its ok' or 'nothing' just to avoid it since we feel its petty...and its always something that we want the other to open up about, as I said before, we are both givers...we are the first to step up for the other, but not so when it involves ourselves..."
  ],
  [
    "Which argument do you always lose?",
    "All of it...whatcha talking about...I just like participating for the adrenaline and seeing her react...and then it gets too much and I probably have to spend double the time making up to her...I love that she has that effect on me though...that I am more interested in making up to her then the argument haha..."
  ],
  [
    "What does she steal from you most (food, hoodie, phone charger)?",
    "Nothing actually, she is well equipped, she plans well...in most cases she will ask me earlier to bring something...probably my favourite shirt, but it happened only a few times, I can't even say she did it..."
  ],
  [
    "What is her hangry level out of 10, and how do you survive it?",
    "Owh its a 100, make a wrong turn, drive slowly, yup...I don't have to survive because she is usually fiesty and I adore manjaing her when she is fiesty...as I said before, she is like a little baby in my arms, just cranky at times thats all..."
  ],
  [
    "What is her worst habit as a passenger or navigator?",
    "Haha...she is what I call, an agitated driver...so as a passenger, she has a tendency of telling me to exit here and there randomly and nag at how I miss turnings...she also likes mixing up left and right, but hey...secret is, I don't listen to anyone when I am driving...I make the decisions..."
  ],
  [
    "How many times a week does she say 'I told you so'?",
    "She doesn't actualy, she does not have that habit...either that or I am actually always right...woohoooo...I guess it happened once or twice, but she didn't say it in a spiteful way, more of a playful thing...and there were probably kisses for me after so I'm not really bothered..."
  ],
  [
    "What does she do in the kitchen that scares you?",
    "Its the boiling hot water thing, she poured it bluntly into the sink for her utensils...well one is the pipes can melt because of this depending on what runs under the sink, and the other is if someone forgets its hot, they can drop the utensils...so its a rather meticulous thing, and I saw her do it once, just got me thinking that she has to be careful..."
  ],
  [
    "What would your life look like if she ran everything? Spoiler: better.",
    "I think it would be too rushed or hectic...she has a tendency of not slowing down, rushing into it like she is late for a flight...and I can see her overthinking and spiraling at times...she plans alot for her family, so it means she definitely has qualities to lead, but I guess a home needs to be regulated, calm...outside home, she spends her day working and running things...at least when she comes home, she can turn her mind off...and I would want her to be relaxed at home, not continue running her engine..."
  ],
  [
    "What is she the best at in the whole world?",
    "Hmmm, difficult to say, as she balances it all, she is equally good at baking, dancing and in her career as well...I would say perhaps the quality I see most in her is that people tend to lean on her, perhaps they feel they can rely on her safely and let their worries go...in other words, her ability to nuture others to actually feel safe and vulnerable around her..."
  ],
  [
    "What has she taught you?",
    "Owh a great deal...the most important thing, I would say is to actually love myself...to find the balance between being selfless and selfish...that loving yourself is important, because only through that can you love others better, and putting it that way somehow helped me cope with my inability to see myself first...and its the whole reason I'm getting more and more over confident with the fact that I am the only one in the world capable of loving her the most..."
  ],
  [
    "How has she made you a better man?",
    "I think it was being transparent...about sharing how I feel, especially when it hurts...being me, I'm used to keeping things to myself, whether its uncomfortable or not, whether it hurts or not, I keep it to myself, because I'm aware I can fix it myself...but she showed me that its not about fixing, rather, it is simply letting her know because she cares...and I can relate with that, because if she kept things to herself, it would definitely bother me too...as men, we tend to always keep things to ourselves, so it is quite important to learn how to share at times, it helps us reflect better and learn too..."
  ],
  [
    "What is the bravest thing you have seen her do?",
    "Haha, there is too many, but I wasn't there to see this, but she told me she fixed a guy's leg during an accident on the road, and to me, the ability to pause your life, look at another and go out to be involved in theirs, is a very brave thing to do...she was the vanguard during COVID, and well, that speaks volumes already doesn't it..."
  ],
  [
    "What do you admire about how she treats people?",
    "Hmmm, generally I find her very brutal to people around her, but at the sametime, I notice she listens well...naturally people tend to open more to those who listen...her natural affinity in her, is actually to be kind to others, but how she does it is another story...she can scold someone for taking too much sugar, it can come off very arrogant and bossy, but the motive behind it, is always extremely kind...those who listen will find themselves in the presence of an angel, and those who can't see past her brutality, will probably be offended...not that it bothers her even if it did haha...I admire that about her, her kindness towards others..."
  ],
  [
    "What does she do for the family that goes unnoticed?",
    "Hmmm, I'm not aware much of this, but I've heard of her planning holidays, managing renovations and even baking...they generally lean on her alot, but I guess as time goes by, people tend to unnotice all this things...in lack of demure, to take things for granted...its only human to do so..."
  ],
  [
    "What does she do better than you, and you hate that?",
    "That would probably be the fitness thing, she is indeed better at it generally...a little bit...just a little bit...fitter then I am...and she does rub it in my face often...hate is a strong word, I would say she is my rival at this point...and when I beat her, I'll probably ask for a kiss then just to rub it in hahaha..."
  ],
  [
    "What is her best quality that she doesn't give herself credit for?",
    "Overall, it is everything...as I said, her greatest adversary is herself...and she is extremely pessimistic about things...combine this two, and generally everything she does is never enough...in a way it is good, she strives for more...but at times, celebrating achievements can be toned down as she wouldn't hype over it...she is humble that way, but at times, perhaps just to me, I see the side where she punishes herself more then she needs to..."
  ],
  [
    "What makes her the perfect partner in crime?",
    "The fact that she loves me, is already a crime on its own haha...and she has mentioned that her love is biased, she will indeed help cover murders if it involves someone she loves but will be extremely skewered over murders if it was someone else...that is an extreme example, but if we tone it down, haha and add her cheekiness to it...well, there you go...the perfect partner for every crime...now time to go prank someone..."
  ],
  [
    "When have you been proudest of her?",
    "It would be the time she climbed the tower...over 2k steps...in just 40+ mins...that is just such an awesome achievement...and we were still getting to know each other, but I was in such awe of it...the training, the mindset, everything...I was proud of her even before I even knew her so well..."
  ],
  [
    "What is your favourite memory of her?",
    "Owh...that would be the time we lied down at Straits...it was in the morning...the light was shining so brightly that day...and we just stared at each other...with the light on her, we didn't say anything, but I remember how she looked at me...with such endearing eyes, smile...I can remember it like it was just yesterday..."
  ],
  [
    "Which song reminds you of her?",
    "Haha, that would be Dive...its a song she shared with me...her favourite line was 'Everytime I fall, I lose it all'...a reference to how she feels everytime she gives herself, she gets hurt...her fear of getting hurt runs deep...but the song is about taking the Dive, despite the fears...and it is exactly what she did...we still tell each other that we are still diving...since everyday we learn something new, everyday is another reason to love more and more...people don't realise that you can continously fall deeper and deeper...the feeling can become more and more intense..."
  ],
  [
    "What is your favourite place you have been together?",
    "Haha, definitely the first place I saw her, at the Gardens...next to that tree...it is still my favourite spot...there is a certain peace to it, just sitting on the mat, hearing the waves, seeing the wind blow on her hair...and if we are lucky, we get to catch the sun setting or rising...it is truly a magnificent feeling..."
  ],
  [
    "What was your funniest fight?",
    "Haha, ok...this one..that would be the best Capati fight...I have a pet peeve with this woman, where everytime she makes a statement, a general statement and then makes it in a very arrogant tone, brutal and just sooo sure about it like nothing else is gonna matter...which is what happened, where she said her aunty makes the bestttt...the besttt...capatis on the planet...did it end there? No, she continues to tell me its because her aunty is punjabi...alright, well probably true...but me being me, I just had to tell her that hey, there could be someone who isn't a punjabi who can make good capatis what, and hence...the fight...and well, just to spice things up, I made up a Malay woman in Taiping who happened to make the best...the best...capatis...and well, our friend just couldn't accept it...went on to even challenge me...ahhh, yup I was having a good laugh...I still find it adorable to challenge her once in awhile just to see how she responds..."
  ],
  [
    "What is the best meal you have shared?",
    "Owh tough one...she takes me to all the good stuffs, and we share all the time...I guess I would say its the sandwich from Karo Karo, its just chef kiss..."
  ],
  [
    "What is an inside joke only you and her understand?",
    "Haha, that would probably be the Suu-pee-neh and Pro-neh...or when I cross my legs...yup it has some special effects...ehem...cough cough...now...next question..."
  ],
  [
    "Which moment would you replay if you could?",
    "That would be our 10 days...it was surreal, like a dream...just me and her, I didn't get to see her often, but the small moments I had, were so beautiful...nothing special, just ordinary days, ordinary breakfast, dinner...but somehow it feels so special to me...those simple boring moments..."
  ],
  [
    "What do you love about a lazy day with her?",
    "Haha, probably off to a cafe for some good coffee, or cookie hunting...that is when she is hungry...if she isn't...well...we probably be snuggling the hours away...it is never enough..."
  ],
  [
    "What is the most spontaneous thing you have ever done with her?",
    "Owh, not much...everything is planned properly...spontaneous probably just means, instead of doing A, we do B...we are extremely flexible that way, anything goes...but we don't abuse that affinity of ours, we like everything planned as it helps manage our time better...time is extremely important for the both of us, so we tend not to waste it away..."
  ],
  [
    "What was the hardest time you got through with her, and what did it teach you?",
    "Hmmm...that would be the time I hurt her...I always knew I would hurt her, its expected in relationships, its what brings people together...but this one, was something she already mentioned before...and due to my lack of self love, my fear of losing her, I hurt her...it only showed me that she loves me, more then she probably is aware herself...I saw her show me kindness, again and again...and it rooted me...there was no leaving, there was no backup plans...I was over confident again, that I am going to be hers...and I will spend the rest of my life, loving her the best way I can..."
  ],
  [
    "What adventure do you want to take her on next?",
    "Owh I would really want to travel somewhere...doesn't have to be far, there are soo many beautiful places here in Malaysia, I really want to get away for a couple of days, go for a hike, try out some local food, hit a hot spring...and perhaps when time allows it, somewhere further...like Europe, or some cold snowy place where she will be forced to stick to me kikiki..."
  ],
  [
    "What do you promise her for this year?",
    "I didn't make any specifically...but perhaps, it is to be patient...after our 10 days, I've been restless, mind clouded with memento mori at how fragile life is...and it just makes me want to entertain my speed, how quickly I do things...I'm still suprised she didn't get freaked out with how fast I was...but not everything can be rushed...in a way, I promise to be patient...to wait for her as long as she needs me to...to be there for her, even if she chooses otherwise...I know myself well, I've made up my mind about it...I will always be there for this woman..."
  ],
  [
    "Where do you see yourselves in 10 years?",
    "Hmmm, being the optimistic person that I am, I can already see the family we wanted...I can already tell there will be 2 or maybe 3 small versions of us running around...I can tell she will pursue her career deeper and I would already be rooted in my business...at that point, my eldest child would already be in school...its nothing special, just every couple's love story...but I guess, to us, it is very special to even come that far, looking at how much we are already going through...to even think that we will have a family one day, as simple as it sounds, is a very heavy thing to say...I say that with full over confidence...because I will make it work..."
  ],
  [
    "What is one thing you promise to do better?",
    "Personally, it would be to listen better...to let her finish her what her intentions are...most of the time, I notice her brutality has more stories to it, but perhaps if I listened more patiently, I would understand better...I have a tendency of telling her certain things are wrong, and well, it usually makes her feel unheard or judged...it is hard to maneuver that, she talks alot, but apparently I talk alot too...so now there is two of us who talk alot, and the listening tends to be skewered haha...its not as serious as it sounds, but I do want to listen to her..."
  ],
  [
    "Which dream of hers do you want to help come true?",
    "Owh, that would be having a family...pursuing her career wherever she wants to...ensuring her family is still part of her life...the fitness thing (she is just a little bit better)...there is alot, but yeah, I have a lot of things to do haha...to be honest, anything that she wants, I will want to support her all the way..."
  ],
  [
    "What do you want yourselves to do more of?",
    "Its difficult to answer this question, as it can come off as demanding...the small time that we have, we are already doing so much together...but I guess, for the sake of the question, I would say workout together more? We have not done that much...and perhaps bake? And dance? I haven't done any of this with her..."
  ],
  [
    "What is the first thing on your bucket list you can't wait to tick off?",
    "Haha that would be to do that Hyrox thingy...or the travelling...one is a team based thing, to see how cool we are as a couple haha, the other is just a romantic thing...we can go anywhere, do anything...we are very powerful that way...the things we can do are limitless..."
  ],
  [
    "What is your secret plan to make her smile this week?",
    "Hehe, that would be the gift I bought for her birthday...sadly, it has a stupid return policy, so I'm forced to give it to her earlier...and hence why, I decided to build this app...this is her real birthday gift...and I'll be adding funny stuffs to it from time to time...her own personal space, everytime she misses us...everytime she wants to remember us...anything at all..."
  ],
  [
    "Finish this sentence: 'Dipti, you are mine because...'",
    "Dipti, you are mine forever because my heart, picked you first kikiki...I will always love you more...and everyday, my heart will keep picking you again and again..."
  ],
  [
    "If you could only say three words to her right now, what would they be?",
    "You're my everything..."
  ],
];

export function SeventyReasons(){
  const [currentQuestion, setCurrentQuestion] = createSignal(null);

  return <>
  <div class="neo-widget-seventy-reasons">
    <Show when={currentQuestion() === null}>
      <h3 class="text-center">A stranger kidnapped me the other day and said if I answered some questions truthfully, he will give me some half boiled eggs...neither the eggs nor the stranger were seen since then...did anyone send you any eggs by chance?</h3>
    </Show>

    <Show when={currentQuestion() !== null && seventyReasons[currentQuestion()]} keyed>
      <div data-aos="fade-in">
        <h3>Question...{currentQuestion() + 1}</h3>
        <p class="font-bold mt-4" innerHTML={seventyReasons[currentQuestion()][0]}/>
        <p class="mt-3" innerHTML={seventyReasons[currentQuestion()][1]}/>
      </div>
    </Show>

    <div class="d-flex justify-content-center">
      <Show when={currentQuestion() !== null}>
        <button class="btn btn-transparent mt-4 mr-2" onClick={() => {
          if ( currentQuestion() <= 0 ) setCurrentQuestion(null);
          else setCurrentQuestion(currentQuestion() - 1);
        }}>
          prev...
        </button>
      </Show>

      <Show when={currentQuestion() === null || currentQuestion() < seventyReasons.length-1}>
        <button class="btn mt-4" onClick={() => {
          if ( currentQuestion() === null ) setCurrentQuestion(0);
          else setCurrentQuestion(currentQuestion() + 1);
        }}>
          
          {currentQuestion() === null ? 'See my sekeleds...' : 'next...'}
        </button>
      </Show>
    </div>
  </div>
  </>;
}
