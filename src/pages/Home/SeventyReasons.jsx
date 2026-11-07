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
    "",
    ""
  ],
  [
    "",
    ""
  ],
];

export function SeventyReasons(){
  const [currentQuestion, setCurrentQuestion] = createSignal(null);

  return <>
  <div class="neo-widget-seventy-reasons">
    <Show when={currentQuestion() === null}>
      <h3 class="text-center">A stranger kidnapped me the other day and said if I answered 70 questions truthfully, I will get half boiled eggs...neither the eggs nor the stranger were seen...did anyone send you any eggs by chance?</h3>
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
