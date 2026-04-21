// DOM Elements
const domainInput = document.getElementById('domainInput');
const addDomainBtn = document.getElementById('addDomainBtn');
const domainList = document.getElementById('domainList');
const errorMessage = document.getElementById('errorMessage');
const timerValue = document.getElementById('timerValue');
const timerUnit = document.getElementById('timerUnit');
const startBlockingBtn = document.getElementById('startBlockingBtn');
const timerStatus = document.getElementById('timerStatus');
const timerErrorMessage = document.getElementById('timerErrorMessage');
const resetBtn = document.getElementById('resetBtn');
const featuredQuote = document.getElementById('featuredQuote');

const tabBar = document.querySelector('.tab-bar');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const domainsPanel = document.getElementById('domainsPanel');
const presetsPanel = document.getElementById('presetsPanel');

const closePanelBtn = document.getElementById('closePanelBtn');

const presetBanner = document.getElementById('presetBanner');
const presetBannerText = document.getElementById('presetBannerText');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveAsPresetBtn = document.getElementById('saveAsPresetBtn');
const saveChangesBtn = document.getElementById('saveChangesBtn');
const saveAsNewPresetBtn = document.getElementById('saveAsNewPresetBtn');

const newPresetForm = document.getElementById('newPresetForm');
const newPresetName = document.getElementById('newPresetName');
const newPresetError = document.getElementById('newPresetError');
const confirmSavePresetBtn = document.getElementById('confirmSavePresetBtn');
const cancelSavePresetBtn = document.getElementById('cancelSavePresetBtn');

const presetList = document.getElementById('presetList');
const presetEmptyState = document.getElementById('presetEmptyState');

// Motivational quotes (duplicated from content.js since popup and content scripts run in separate contexts)
const QUOTES = [
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. - Stephen Covey",
  "You can do anything, but not everything. - David Allen",
  "Focus is a matter of deciding what things you're not going to do. - John Carmack",
  "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus. - Alexander Graham Bell",
  "It's not always that we need to do more but rather that we need to focus on less. - Nathan W. Morris",
  "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
  "Where focus goes, energy flows. - Tony Robbins",
  "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days. - Zig Ziglar",
  "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction. - Cal Newport",
  "Your ability to concentrate single-mindedly on one thing, the most important thing, and stay at it until it is complete, is essential to success. - Brian Tracy",
  "The difference between successful people and really successful people is that really successful people say no to almost everything. - Warren Buffett",
  "Starve your distractions, feed your focus. - Unknown",
  "It is not enough to be busy. The question is: what are we busy about? - Henry David Thoreau",
  "Action expresses priorities. - Mahatma Gandhi",
  "The ability to concentrate and to use your time well is everything if you want to succeed in business—or almost anywhere else for that matter. - Lee Iacocca",
  "You have power over your mind—not outside events. Realize this, and you will find strength. - Marcus Aurelius",
  "The impediment to action advances action. What stands in the way becomes the way. - Marcus Aurelius",
  "Waste no more time arguing about what a good man should be. Be one. - Marcus Aurelius",
  "If it is not right, do not do it; if it is not true, do not say it. - Marcus Aurelius",
  "The best revenge is not being like your enemy. - Marcus Aurelius",
  "It is not that we have a short time to live, but that we waste a lot of it. - Seneca",
  "We suffer more often in imagination than in reality. - Seneca",
  "If a man knows not to which port he sails, no wind is favorable. - Seneca",
  "He who is brave is free. - Seneca",
  "Difficulties strengthen the mind, as labor does the body. - Seneca",
  "First say to yourself what you would be; and then do what you have to do. - Epictetus",
  "We cannot choose our external circumstances, but we can always choose how we respond to them. - Epictetus",
  "No man is free who is not master of himself. - Epictetus",
  "Don't explain your philosophy. Embody it. - Epictetus",
  "The more we value things outside our control, the less control we have. - Epictetus",
  "Focus on what you can control, and let go of what you cannot. - Epictetus",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Do the hard jobs first. The easy jobs will take care of themselves. - Dale Carnegie",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work. - Stephen King",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Discipline is choosing between what you want now and what you want most. - Abraham Lincoln",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Concentration is the root of all the higher abilities in man. - Bruce Lee",
  "The successful person has the habit of doing the things failures don't like to do. - E. M. Gray",
  "The price of anything is the amount of life you exchange for it. - Henry David Thoreau",
  "Our life is what our thoughts make it. - Marcus Aurelius",
  "Very little is needed to make a happy life; it is all within yourself, in your way of thinking. - Marcus Aurelius",
  "How much trouble he avoids who does not look to see what his neighbor says or does. - Marcus Aurelius",
  "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
  "You become what you give your attention to. - Epictetus",
  "It's not what happens to you, but how you react to it that matters. - Epictetus",
  "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control. - Epictetus",
  "Time is the most valuable thing a man can spend. - Theophrastus",
  "You have been formed of three parts—body, breath, and mind. Of these, the first two are yours insofar as they are only in your care. The third alone is truly yours. - Marcus Aurelius",
  "All you need is deep within you waiting to unfold and reveal itself. All you have to do is be still and take time to seek for what is within. - Marcus Aurelius",
  "The mind adapts and converts to its own purposes the obstacle to our acting. - Marcus Aurelius",
  "Nothing can harm you as much as your own thoughts unguarded. - Buddha",
  "The tranquility that comes when you stop caring what they say. Or think, or do. Only what you do. - Marcus Aurelius",
  "Every man is the architect of his own fortune. - Sallust",
  "To live happily is an inward power of the soul. - Marcus Aurelius",
  "A person's worth is measured by the worth of what he values. - Marcus Aurelius",
  "If you want to improve, be content to be thought foolish and stupid. - Epictetus",
  "Wealth consists not in having great possessions, but in having few wants. - Epictetus",
  "Men are disturbed not by things, but by the view which they take of them. - Epictetus",
  "Fortune favors the prepared mind. - Louis Pasteur",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "Deep work is the ability to focus without distraction on a cognitively demanding task. - Cal Newport",
  "Deep work is like a superpower in our increasingly competitive twenty-first-century economy. - Cal Newport",
  "Clarity about what matters provides clarity about what does not. - Cal Newport",
  "What we choose to focus on and what we choose to ignore—plays in defining the quality of our life. - Cal Newport",
  "The shallows emerge as a triumph of office cost accounting over employee effectiveness. - Cal Newport",
  "Efforts to deepen your focus will struggle if you don't simultaneously wean your mind from a dependence on distraction. - Cal Newport",
  "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction. - Cal Newport",
  "The best moments usually occur when a person's body or mind is stretched to its limits in a voluntary effort to accomplish something difficult and worthwhile. - Mihaly Csikszentmihalyi",
  "Concentration is so intense that there is no attention left over to think about anything irrelevant, or to worry about problems. - Mihaly Csikszentmihalyi",
  "Being in control is never so important as when the boat is actually sinking. - Mihaly Csikszentmihalyi",
  "A man who has control over his passions and over the external things, and who dedicates his life to serving the universal reason. - Marcus Aurelius",
  "The impediment to action advances action. What stands in the way becomes the way. - Marcus Aurelius",
  "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment. - Marcus Aurelius",
  "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart. - Marcus Aurelius",
  "How much trouble he avoids who does not look to see what his neighbor says or does. - Marcus Aurelius",
  "The art of living is more like wrestling than dancing, because an artful life requires being prepared to meet and withstand sudden and unexpected attacks. - Marcus Aurelius",
  "Dwell on the beauty of life. Watch the stars, and see yourself running with them. - Marcus Aurelius",
  "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane. - Marcus Aurelius",
  "When you arise in the morning, think of what a precious privilege it is to be alive—to breathe, to think, to enjoy, to love. - Marcus Aurelius",
  "How much time he gains who does not look to see what his neighbor says or does or thinks. - Marcus Aurelius",
  "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look. - Marcus Aurelius",
  "To be like the rock that the waves keep crashing over. It stands unmoved and the raging of the sea falls still around it. - Marcus Aurelius",
  "You have power over your mind—not outside events. Realize this, and you will find strength. - Marcus Aurelius",
  "The memory of everything is very soon overwhelmed in time. - Marcus Aurelius",
  "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present. - Marcus Aurelius",
  "How ridiculous and how strange to be surprised at anything which happens in life. - Marcus Aurelius",
  "Remember: matter. How tiny your share of it. Time. How brief and fleeting your allotment of it. Fate. How small a role you play in it. - Marcus Aurelius",
  "People who are excited by posthumous fame forget that the people who remember them will soon die too. - Marcus Aurelius",
  "No man is happy who does not think himself so. - Publilius Syrus",
  "As is a tale, so is life: not how long it is, but how good it is, is what matters. - Seneca",
  "Begin at once to live, and count each separate day as a separate life. - Seneca",
  "We are more often frightened than hurt; and we suffer more from imagination than from reality. - Seneca",
  "Not how long, but how well you have lived is the main thing. - Seneca",
  "Luck is what happens when preparation meets opportunity. - Seneca",
  "It is not that we have a short time to live, but that we waste a lot of it. - Seneca",
  "Every new beginning comes from some other beginning's end. - Seneca",
  "He who has made a mistake and corrects it is committing a greater mistake. - Seneca",
  "Life is long if you know how to use it. - Seneca",
  "Wealth is the slave of a wise man and the master of a fool. - Seneca",
  "A gem cannot be polished without friction, nor a man perfected without trials. - Seneca",
  "Leisure without books is death, and burial of a man alive. - Seneca",
  "While we wait for life, life passes. - Seneca",
  "Let us prepare our minds as if we'd come to the very end of life. Let us postpone nothing. Let us balance life's books each day. - Seneca",
  "Time discovers truth. - Seneca",
  "Fate leads the willing and drags along the reluctant. - Seneca",
  "If a man knows not to which port he sails, no wind is favorable. - Seneca",
  "There is no easy way from the earth to the stars. - Seneca",
  "The greatest remedy for anger is delay. - Seneca",
  "Only time can heal what reason cannot. - Seneca",
  "Associate with people who are likely to improve you. - Seneca",
  "The wise man is he who can be happy in poverty. - Seneca",
  "He suffers more than necessary, who suffers before it is necessary. - Seneca",
  "No one can be happy who has been thrust outside the pale of truth. And there are two ways that one can be removed from this realm: by lying, or by being lied to. - Seneca",
  "Let philosophy scrape off your own faults, rather than be a way to rail against the faults of others. - Seneca",
  "Most powerful is he who has himself in his own power. - Seneca",
  "The best ideas are common property. - Seneca",
  "No one loses what they never had. - Seneca",
  "Ignorance is the cause of fear. - Seneca",
  "If you really want to escape the things that harass you, what you're needing is not to be in a different place but to be a different person. - Seneca",
  "Nothing is more honorable than a grateful heart. - Seneca",
  "All cruelty springs from weakness. - Seneca",
  "It is the power of the mind to be unconquerable. - Seneca",
  "True happiness is to enjoy the present, without anxious dependence upon the future. - Seneca",
  "We must give many things to the world which it does not know, and we must remain indifferent to its applause. - Seneca",
  "Even after a bad harvest there must be sowing. - Seneca",
  "It does not matter how many books you have, but how good the books are which you have. - Seneca",
  "What is wisdom? Always desiring the same things, and always refusing the same things. - Seneca",
  "You act like mortals in all that you fear, and like immortals in all that you desire. - Seneca",
  "We are bad men living among bad men, and only one thing can calm us—we must agree to go easy on one another. - Seneca",
  "Nothing is burdensome if taken lightly, and nothing need arouse one's irritation so long as one doesn't make it bigger than it is by getting irritated. - Seneca",
  "Most men ebb and flow in wretchedness between the fear of death and the hardships of life; they are unwilling to live, and yet they do not know how to die. - Seneca",
  "It is a rough road that leads to the heights of greatness. - Seneca",
  "He who has injured thee was either stronger or weaker than thee. If weaker, spare him; if stronger, spare thyself. - Seneca",
  "We should every night call ourselves to an account: What infirmity have I mastered today? What passions opposed? What temptation resisted? What virtue acquired? - Seneca",
  "As long as you live, keep learning how to live. - Seneca",
  "It is not the man who has too little, but the man who craves more, that is poor. - Seneca",
  "We should be careful to get out of an experience only the wisdom that is in it—and stop there; lest we be like the cat that sits down on a hot stove-lid. She will never sit down on a hot stove-lid again—and that is well; but also she will never sit down on a cold one anymore. - Mark Twain",
  "The two most important days in your life are the day you are born and the day you find out why. - Mark Twain",
  "Keep away from people who try to belittle your ambitions. Small people always do that, but the really great make you feel that you, too, can become great. - Mark Twain",
  "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. - Mark Twain",
  "If you tell the truth, you don't have to remember anything. - Mark Twain",
  "Never put off till tomorrow what may be done day after tomorrow just as well. - Mark Twain",
  "I can teach anybody how to get what they want out of life. The problem is that I can't find anybody who can tell me what they want. - Mark Twain",
  "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one. - Mark Twain",
  "Courage is resistance to fear, mastery of fear, not absence of fear. - Mark Twain",
  "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time. - Mark Twain",
  "Golf is a good walk spoiled. - Mark Twain",
  "The most interesting information comes from children, for they tell all they know and then stop. - Mark Twain",
  "If you pick up a starving dog and make him prosperous, he will not bite you. This is the principal difference between a dog and a man. - Mark Twain",
  "A man cannot be comfortable without his own approval. - Mark Twain",
  "The worst loneliness is to not be comfortable with yourself. - Mark Twain",
  "The man who does not read has no advantage over the man who cannot read. - Mark Twain",
  "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured. - Mark Twain",
  "The human race has one really effective weapon, and that is laughter. - Mark Twain",
  "Clothes make the man. Naked people have little or no influence on society. - Mark Twain",
  "Good friends, good books, and a sleepy conscience: this is the ideal life. - Mark Twain",
  "Kindness is a language which the deaf can hear and the blind can see. - Mark Twain",
  "The best way to cheer yourself up is to try to cheer somebody else up. - Mark Twain",
  "It is better to keep your mouth closed and let people think you are a fool than to open it and remove all doubt. - Mark Twain",
  "The reports of my death are greatly exaggerated. - Mark Twain",
  "Humor is mankind's greatest blessing. - Mark Twain",
  "Training is everything. The peach was once a bitter almond; cauliflower is nothing but cabbage with a college education. - Mark Twain",
  "The lack of money is the root of all evil. - Mark Twain",
  "There are basically two types of people. People who accomplish things, and people who claim to have accomplished things. The first group is less crowded. - Mark Twain",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
  "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well. - Ralph Waldo Emerson",
  "Once you make a decision, the universe conspires to make it happen. - Ralph Waldo Emerson",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. - Ralph Waldo Emerson",
  "For every minute you are angry you lose sixty seconds of happiness. - Ralph Waldo Emerson",
  "Nothing great was ever achieved without enthusiasm. - Ralph Waldo Emerson",
  "It is one of the most beautiful compensations of this life that no man can sincerely try to help another without helping himself. - Ralph Waldo Emerson",
  "To be great is to be misunderstood. - Ralph Waldo Emerson",
  "Self-trust is the first secret of success. - Ralph Waldo Emerson",
  "The creation of a thousand forests is in one acorn. - Ralph Waldo Emerson",
  "What you do speaks so loudly that I cannot hear what you say. - Ralph Waldo Emerson",
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
  "It is better to be hated for what you are than to be loved for what you are not. - André Gide",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "A person who never made a mistake never tried anything new. - Albert Einstein",
  "I have no special talent. I am only passionately curious. - Albert Einstein",
  "If you can't explain it simply, you don't understand it well enough. - Albert Einstein",
  "Try not to become a person of success, but rather try to become a person of value. - Albert Einstein",
  "The important thing is not to stop questioning. Curiosity has its own reason for existing. - Albert Einstein",
  "Life is like riding a bicycle. To keep your balance, you must keep moving. - Albert Einstein",
  "Insanity is doing the same thing over and over again and expecting different results. - Albert Einstein",
  "Peace cannot be kept by force; it can only be achieved by understanding. - Albert Einstein",
  "Imagination is more important than knowledge. Knowledge is limited, whereas imagination embraces the entire world. - Albert Einstein",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. - Steve Jobs",
  "Stay hungry. Stay foolish. - Steve Jobs",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Have the courage to follow your heart and intuition. They somehow know what you truly want to become. - Steve Jobs",
  "You can't connect the dots looking forward; you can only connect them looking backwards. - Steve Jobs",
  "Don't let the noise of others' opinions drown out your own inner voice. - Steve Jobs",
  "Quality is more important than quantity. One home run is much better than two doubles. - Steve Jobs",
  "I'm convinced that about half of what separates the successful entrepreneurs from the non-successful ones is pure perseverance. - Steve Jobs",
  "Being the richest man in the cemetery doesn't matter to me. Going to bed at night saying we've done something wonderful, that's what matters to me. - Steve Jobs",
  "You have to trust in something—your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life. - Steve Jobs",
  "Remembering that I'll be dead soon is the most important tool I've ever encountered to help me make the big choices in life. - Steve Jobs",
  "Have the courage to follow your heart and intuition. They somehow already know what you truly want to become. - Steve Jobs",
  "The people who are crazy enough to think they can change the world are the ones who do. - Steve Jobs",
  "Sometimes life hits you in the head with a brick. Don't lose faith. - Steve Jobs",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. - Steve Jobs",
  "I'm as proud of many of the things we haven't done as the things we have done. Innovation is saying no to a thousand things. - Steve Jobs",
  "Focus is about saying no. - Steve Jobs",
  "Details are not details. They make the design. - Steve Jobs",
  "The most precious thing that we all have with us is time. - Steve Jobs",
  "Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple. But it's worth it in the end because once you get there, you can move mountains. - Steve Jobs",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. - Steve Jobs",
  "Death is very likely the single best invention of Life. It is Life's change agent. It clears out the old to make way for the new. - Steve Jobs",
  "For the past 33 years, I have looked in the mirror every morning and asked myself: 'If today were the last day of my life, would I want to do what I am about to do today?' - Steve Jobs",
  "The journey is the reward. - Steve Jobs",
  "We're here to put a dent in the universe. Otherwise why else even be here? - Steve Jobs",
  "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them. - Steve Jobs",
  "The people who are crazy enough to think they can change the world are the ones who do. - Steve Jobs",
  "If you live each day as it was your last, someday you'll most certainly be right. - Steve Jobs",
  "I want to put a ding in the universe. - Steve Jobs",
  "We think the Mac will sell zillions, but we didn't build the Mac for anybody else. We built it for ourselves. We were the group of people who were going to judge whether it was great or not. - Steve Jobs",
  "You've got to find what you love. And that is as true for your work as it is for your lovers. - Steve Jobs",
  "The goal isn't to be the best. The goal is to be the best for the customer. - Steve Jobs",
  "Great things in business are never done by one person. They're done by a team of people. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Being the richest man in the cemetery doesn't matter to me. Going to bed at night saying we've done something wonderful, that's what matters to me. - Steve Jobs",
  "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs",
  "I'm convinced that about half of what separates the successful entrepreneurs from the non-successful ones is pure perseverance. - Steve Jobs",
  "Stay hungry. Stay foolish. And I have always wished that for myself. - Steve Jobs",
  "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose. - Steve Jobs",
  "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma—which is living with the results of other people's thinking. - Steve Jobs",
  "I think the things you regret most in life are the things you didn't do. - Steve Jobs",
  "The people who are crazy enough to think they can change the world are the ones who do. - Steve Jobs"
];

// State
let blockedDomains = [];
let presets = {};
let timerEndTime = null;
let activeTab = 'domains';
let editingPresetName = null;
let editBaseline = null;
let pendingSave = null;

// ----- Quote (daily rotating) -----
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getDailyQuote() {
  const today = getTodayDateString();
  const data = await chrome.storage.local.get(['popupCurrentQuote', 'popupQuoteDate']);
  if (data.popupCurrentQuote && data.popupQuoteDate === today) {
    return data.popupCurrentQuote;
  }
  const newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  await chrome.storage.local.set({
    popupCurrentQuote: newQuote,
    popupQuoteDate: today
  });
  return newQuote;
}

async function displayFeaturedQuote() {
  if (featuredQuote) {
    const quote = await getDailyQuote();
    featuredQuote.textContent = quote;
  }
}

// ----- Initialize -----
document.addEventListener('DOMContentLoaded', async () => {
  await displayFeaturedQuote();
  const timerData = await loadData();

  if (timerData.lastTimerValue) {
    timerValue.value = timerData.lastTimerValue;
  }
  if (timerData.lastTimerUnit) {
    timerUnit.value = timerData.lastTimerUnit;
  }

  renderDomainList();
  validateTimer();
  updateTimerStatus();
  updateStartButton();
  switchTab(timerData.activeTab === 'presets' ? 'presets' : 'domains', { persist: false });
  updateSaveCtaVisibility();

  // Change listeners
  timerValue.addEventListener('input', () => {
    updateStartButton();
    updateSaveCtaVisibility();
  });
  timerUnit.addEventListener('change', () => {
    updateStartButton();
    updateSaveCtaVisibility();
  });

  // Tab bar (delegated)
  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    switchTab(btn.dataset.tab);
  });

  // Close panel button
  closePanelBtn.addEventListener('click', () => window.close());

  // Edit banner cancel
  cancelEditBtn.addEventListener('click', () => {
    exitEditMode();
  });

  // Save CTA buttons
  saveAsPresetBtn.addEventListener('click', beginSaveAsPreset);
  saveAsNewPresetBtn.addEventListener('click', beginSaveAsPreset);
  saveChangesBtn.addEventListener('click', saveChangesToEditedPreset);

  // New-preset form
  confirmSavePresetBtn.addEventListener('click', confirmNewPreset);
  cancelSavePresetBtn.addEventListener('click', cancelNewPresetForm);
  newPresetName.addEventListener('input', () => {
    newPresetError.textContent = '';
  });
  newPresetName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') confirmNewPreset();
  });

  // Update timer status every second
  setInterval(updateTimerStatus, 1000);
});

// ----- Storage -----
async function loadData() {
  const data = await chrome.storage.local.get([
    'blockedDomains', 'timerEndTime', 'presets',
    'lastTimerValue', 'lastTimerUnit', 'activeTab'
  ]);
  blockedDomains = data.blockedDomains || [];
  timerEndTime = data.timerEndTime || null;
  presets = data.presets || {};

  // Migrate old preset format (arrays) to new format (objects)
  let migrated = false;
  for (const [name, preset] of Object.entries(presets)) {
    if (Array.isArray(preset)) {
      presets[name] = {
        domains: [...preset],
        timerValue: data.lastTimerValue || 60,
        timerUnit: data.lastTimerUnit || 'minutes'
      };
      migrated = true;
    }
  }
  if (migrated) {
    await saveData();
  }

  return {
    lastTimerValue: data.lastTimerValue,
    lastTimerUnit: data.lastTimerUnit,
    activeTab: data.activeTab
  };
}

async function saveData() {
  await chrome.storage.local.set({
    blockedDomains,
    timerEndTime,
    presets
  });
}

async function saveTimerInputs(value, unit) {
  await chrome.storage.local.set({
    lastTimerValue: value,
    lastTimerUnit: unit
  });
}

// ----- Domain input/list -----
function normalizeDomain(input) {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.split('/')[0].split('?')[0];
  if (!domain) return null;
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  if (!domainRegex.test(domain)) return null;
  return domain;
}

addDomainBtn.addEventListener('click', async () => {
  const domain = normalizeDomain(domainInput.value);
  if (!domain) {
    showError('Please enter a valid domain (e.g., reddit.com)');
    return;
  }
  if (blockedDomains.includes(domain)) {
    showError('Domain already in list');
    return;
  }
  blockedDomains.push(domain);
  await saveData();
  domainInput.value = '';
  errorMessage.textContent = '';
  renderDomainList();
  updateStartButton();
  updateSaveCtaVisibility();
});

domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addDomainBtn.click();
});

async function removeDomain(domain) {
  blockedDomains = blockedDomains.filter(d => d !== domain);
  await saveData();
  renderDomainList();
  updateStartButton();
  updateSaveCtaVisibility();
}

function renderDomainList() {
  if (blockedDomains.length === 0) {
    domainList.innerHTML = '<div class="empty-state">No domains blocked yet</div>';
    return;
  }
  domainList.innerHTML = blockedDomains.map(domain => `
    <li class="domain-item">
      <span class="domain-name">${escapeHtml(domain)}</span>
      <button data-domain="${escapeHtml(domain)}">Remove</button>
    </li>
  `).join('');
  domainList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => removeDomain(btn.dataset.domain));
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showError(message) {
  errorMessage.textContent = message;
  setTimeout(() => { errorMessage.textContent = ''; }, 3000);
}

// ----- Timer -----
function validateTimer() {
  const value = parseInt(timerValue.value);
  const unit = timerUnit.value;
  if (!value || value <= 0) {
    timerErrorMessage.textContent = '';
    return false;
  }
  let minutes = value;
  if (unit === 'hours') minutes = value * 60;
  if (minutes > 1440) {
    timerErrorMessage.textContent = 'Please set the timer to 24 hours or less to continue';
    return false;
  }
  timerErrorMessage.textContent = '';
  return true;
}

function updateStartButton() {
  const hasDomains = blockedDomains.length > 0;
  const timerValid = validateTimer();
  startBlockingBtn.disabled = !hasDomains || !timerValid;
}

function updateTimerStatus() {
  if (!timerEndTime || Date.now() >= timerEndTime) {
    timerStatus.classList.remove('active');
    if (timerEndTime && Date.now() >= timerEndTime) {
      timerEndTime = null;
      saveData();
    }
    return;
  }
  const remaining = timerEndTime - Date.now();
  timerStatus.textContent = `Blocking active: ${formatTime(remaining)} remaining`;
  timerStatus.classList.add('active');
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatTimerLabel(value, unit) {
  const n = parseInt(value) || 0;
  const base = unit === 'hours' ? 'hour' : 'minute';
  return `${n} ${base}${n === 1 ? '' : 's'}`;
}

// ----- Start blocking (extracted) -----
async function startBlocking() {
  const value = parseInt(timerValue.value);
  const unit = timerUnit.value;
  if (!value || value <= 0) {
    showError('Please enter a valid time greater than 0');
    return false;
  }
  let minutes = value;
  if (unit === 'hours') minutes = value * 60;
  if (minutes < 1 || minutes > 1440) {
    showError('Timer must be between 1 minute and 24 hours');
    return false;
  }
  await saveTimerInputs(value, unit);
  timerEndTime = Date.now() + (minutes * 60 * 1000);
  await saveData();
  updateTimerStatus();
  window.close();
  return true;
}

startBlockingBtn.addEventListener('click', async () => {
  if (editingPresetName && isDirtyFromEditBaseline()) {
    const ok = confirm(`You have unsaved changes to preset "${editingPresetName}". Start blocking without saving?`);
    if (!ok) return;
    exitEditMode({ suppressCtaRefresh: true });
  }
  await startBlocking();
});

// ----- Reset -----
resetBtn.addEventListener('click', async () => {
  blockedDomains = [];
  timerValue.value = 60;
  timerUnit.value = 'minutes';
  timerEndTime = null;
  editingPresetName = null;
  editBaseline = null;
  await saveData();
  await saveTimerInputs(60, 'minutes');
  renderDomainList();
  updateStartButton();
  updateTimerStatus();
  updateSaveCtaVisibility();
});

// ----- Tab switching -----
function switchTab(name, { persist = true } = {}) {
  if (name !== 'domains' && name !== 'presets') name = 'domains';
  activeTab = name;
  tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === name;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `${name}Panel`);
  });
  if (name === 'presets') {
    renderPresetsList();
  } else {
    // Leaving presets cancels any in-flight name prompt
    closeNewPresetForm();
  }
  if (persist) {
    chrome.storage.local.set({ activeTab: name });
  }
}

// ----- Preset matching helpers -----
function domainsSetEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return false;
  }
  return true;
}

function currentState() {
  return {
    domains: [...blockedDomains],
    timerValue: parseInt(timerValue.value) || 60,
    timerUnit: timerUnit.value || 'minutes'
  };
}

function matchesAnyPreset(state) {
  for (const preset of Object.values(presets)) {
    if (!preset || Array.isArray(preset)) continue;
    if (
      preset.timerValue === state.timerValue &&
      preset.timerUnit === state.timerUnit &&
      domainsSetEqual(preset.domains || [], state.domains)
    ) {
      return true;
    }
  }
  return false;
}

function isDirtyFromEditBaseline() {
  if (!editBaseline) return false;
  const s = currentState();
  return (
    s.timerValue !== editBaseline.timerValue ||
    s.timerUnit !== editBaseline.timerUnit ||
    !domainsSetEqual(s.domains, editBaseline.domains)
  );
}

function shouldShowSaveAsPresetCTA() {
  if (editingPresetName) return false;
  if (blockedDomains.length === 0) return false;
  if (!validateTimer()) return false;
  return !matchesAnyPreset(currentState());
}

// ----- Edit mode -----
async function enterEditMode(name) {
  const preset = presets[name];
  if (!preset || Array.isArray(preset)) return;
  blockedDomains = [...(preset.domains || [])];
  timerValue.value = preset.timerValue || 60;
  timerUnit.value = preset.timerUnit || 'minutes';
  editingPresetName = name;
  editBaseline = {
    domains: [...blockedDomains],
    timerValue: preset.timerValue || 60,
    timerUnit: preset.timerUnit || 'minutes'
  };
  await saveData();
  await saveTimerInputs(editBaseline.timerValue, editBaseline.timerUnit);
  renderDomainList();
  updateStartButton();
  switchTab('domains');
  updateSaveCtaVisibility();
}

function exitEditMode({ suppressCtaRefresh = false } = {}) {
  editingPresetName = null;
  editBaseline = null;
  if (!suppressCtaRefresh) updateSaveCtaVisibility();
}

// ----- Save CTA visibility controller -----
function updateSaveCtaVisibility() {
  const inEditMode = !!editingPresetName;
  const timerOk = validateTimer();
  const hasDomains = blockedDomains.length > 0;

  // Nothing is saveable without at least one blocked domain.
  if (!hasDomains) {
    presetBanner.hidden = true;
    saveAsPresetBtn.hidden = true;
    saveChangesBtn.hidden = true;
    saveAsNewPresetBtn.hidden = true;
    return;
  }

  if (inEditMode) {
    const valid = timerOk && hasDomains;
    const canSave = valid && isDirtyFromEditBaseline();
    const canSaveAsNew = valid;
    presetBannerText.textContent = `Editing preset: ${editingPresetName}`;
    cancelEditBtn.hidden = false;
    saveAsPresetBtn.hidden = true;
    saveChangesBtn.hidden = !canSave;
    saveAsNewPresetBtn.hidden = !canSaveAsNew;
    saveChangesBtn.disabled = !canSave;
    saveAsNewPresetBtn.disabled = !canSaveAsNew;
    presetBanner.hidden = !(canSave || canSaveAsNew);
    return;
  }

  const showSaveAs = shouldShowSaveAsPresetCTA();
  presetBannerText.textContent = 'Save as preset';
  cancelEditBtn.hidden = true;
  saveChangesBtn.hidden = true;
  saveAsNewPresetBtn.hidden = true;
  saveAsPresetBtn.hidden = !showSaveAs;
  saveAsPresetBtn.disabled = false;
  presetBanner.hidden = !showSaveAs;
}

// ----- Save-as-preset flow (redirects to Presets tab) -----
function beginSaveAsPreset() {
  if (blockedDomains.length === 0) {
    showError('Add at least one domain first');
    return;
  }
  if (!validateTimer()) {
    return;
  }
  pendingSave = currentState();
  switchTab('presets');
  openNewPresetForm();
}

function openNewPresetForm() {
  newPresetName.value = '';
  newPresetError.textContent = '';
  newPresetForm.hidden = false;
  setTimeout(() => newPresetName.focus(), 0);
}

function closeNewPresetForm() {
  newPresetForm.hidden = true;
  newPresetError.textContent = '';
  newPresetName.value = '';
  pendingSave = null;
}

function cancelNewPresetForm() {
  closeNewPresetForm();
}

async function confirmNewPreset() {
  const name = newPresetName.value.trim();
  if (!name) {
    newPresetError.textContent = 'Name required';
    return;
  }
  const existingKey = Object.keys(presets).find(
    k => k.toLowerCase() === name.toLowerCase()
  );
  if (existingKey) {
    newPresetError.textContent = 'A preset with this name already exists';
    return;
  }
  if (!pendingSave) {
    // Defensive: snapshot current state if somehow missing
    pendingSave = currentState();
  }
  presets[name] = {
    domains: [...pendingSave.domains],
    timerValue: pendingSave.timerValue,
    timerUnit: pendingSave.timerUnit
  };
  await saveData();
  closeNewPresetForm();
  renderPresetsList();
  updateSaveCtaVisibility();
}

// ----- Save changes (overwrite current edit) -----
async function saveChangesToEditedPreset() {
  if (!editingPresetName) return;
  if (!validateTimer()) return;
  if (blockedDomains.length === 0) {
    showError('Add at least one domain first');
    return;
  }
  const state = currentState();
  presets[editingPresetName] = {
    domains: [...state.domains],
    timerValue: state.timerValue,
    timerUnit: state.timerUnit
  };
  await saveData();
  editBaseline = {
    domains: [...state.domains],
    timerValue: state.timerValue,
    timerUnit: state.timerUnit
  };
  updateSaveCtaVisibility();
}

// ----- Preset card rendering -----
function renderPresetsList() {
  const names = Object.keys(presets);
  presetList.innerHTML = '';
  if (names.length === 0) {
    presetEmptyState.hidden = false;
    return;
  }
  presetEmptyState.hidden = true;

  for (const name of names) {
    const preset = presets[name];
    if (!preset || Array.isArray(preset)) continue;
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.dataset.name = name;

    const header = document.createElement('div');
    header.className = 'preset-card-header';
    const title = document.createElement('div');
    title.className = 'preset-title';
    title.textContent = name;
    const meta = document.createElement('div');
    meta.className = 'preset-meta';
    meta.textContent = formatTimerLabel(preset.timerValue, preset.timerUnit);
    header.appendChild(title);
    header.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'preset-card-actions';
    const enableBtn = document.createElement('button');
    enableBtn.className = 'preset-enable';
    enableBtn.textContent = 'Enable';
    enableBtn.addEventListener('click', () => enablePreset(name));
    const editBtn = document.createElement('button');
    editBtn.className = 'preset-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => enterEditMode(name));
    const delBtn = document.createElement('button');
    delBtn.className = 'preset-delete delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deletePreset(name));
    actions.appendChild(enableBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    card.appendChild(header);
    card.appendChild(actions);
    presetList.appendChild(card);
  }
}

async function deletePreset(name) {
  const ok = confirm(`Delete preset "${name}"?`);
  if (!ok) return;
  delete presets[name];
  await saveData();
  if (editingPresetName === name) {
    exitEditMode({ suppressCtaRefresh: true });
  }
  renderPresetsList();
  updateSaveCtaVisibility();
}

async function enablePreset(name) {
  const preset = presets[name];
  if (!preset || Array.isArray(preset)) return;
  const presetDomains = preset.domains || [];
  if (presetDomains.length === 0) {
    showError('This preset has no domains');
    return;
  }
  blockedDomains = [...presetDomains];
  timerValue.value = preset.timerValue || 60;
  timerUnit.value = preset.timerUnit || 'minutes';
  editingPresetName = null;
  editBaseline = null;
  renderDomainList();
  // Single consolidated write via startBlocking — avoids sending a
  // transient {blockedDomains, timerEndTime: null} snapshot to the
  // content script that would briefly hide the overlay.
  const started = await startBlocking();
  if (!started) {
    // Validation failed; at least persist the loaded state so the
    // Blocked Domains tab reflects the preset selection.
    await saveData();
    await saveTimerInputs(preset.timerValue || 60, preset.timerUnit || 'minutes');
  }
}
