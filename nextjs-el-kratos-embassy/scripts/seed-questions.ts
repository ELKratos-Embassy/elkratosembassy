import { prisma } from "../lib/prisma";

const BATCH = "BFC-26A";

const QUESTIONS = [
  { order: 1, weekLabel: "Weeks 1–2", text: "What is the biblical definition of sin according to EL Kratos Embassy's teaching?", options: ["A list of bad behaviours and criminal acts", "The wilful rejection of God's authority and choosing our way over His", "Only murder, theft, and adultery", "Breaking the laws of the land"], answerIndex: 1 },
  { order: 2, weekLabel: "Weeks 1–2", text: "What does Romans 6:23 say the wages of sin is?", options: ["Suffering", "Poverty", "Death", "Shame"], answerIndex: 2 },
  { order: 3, weekLabel: "Weeks 1–2", text: "Which of the following correctly describes repentance?", options: ["Feeling guilty and crying about your sins", "Attending church every Sunday", "Turning away from sin and toward God — a decision of the will", "Making promises to God that you will do better"], answerIndex: 2 },
  { order: 4, weekLabel: "Weeks 1–2", text: "According to Romans 10:9, what two things are required for salvation?", options: ["Baptism and church attendance", "Declaring with your mouth and believing in your heart", "Fasting and prayer", "Good works and tithing"], answerIndex: 1 },
  { order: 5, weekLabel: "Weeks 1–2", text: "What are the three dimensions of the new birth experience?", options: ["Salvation, Sanctification, Glorification", "Repentance, Faith, Baptism", "Justification, Regeneration, Adoption", "Confession, Forgiveness, Restoration"], answerIndex: 2 },
  { order: 6, weekLabel: "Weeks 1–2", text: "Which scripture says 'If anyone is in Christ, the new creation has come'?", options: ["Romans 8:1", "2 Corinthians 5:17", "John 3:16", "Ephesians 2:8"], answerIndex: 1 },
  { order: 7, weekLabel: "Weeks 1–2", text: "What is the role of the Holy Ghost in the new birth?", options: ["He only comes during special revival services", "He resides in every believer as their daily Companion from the moment of salvation", "He only comes when you speak in tongues", "He visits believers occasionally when they pray hard enough"], answerIndex: 1 },
  { order: 8, weekLabel: "Weeks 1–2", text: "According to John 1:12, what right is given to those who receive Christ?", options: ["The right to perform miracles", "The right to become leaders in the church", "The right to become children of God", "The right to judge others"], answerIndex: 2 },
  { order: 9, weekLabel: "Week 3", text: "How many types of baptism does EL Kratos Embassy believe in?", options: ["One", "Two", "Three", "Four"], answerIndex: 2 },
  { order: 10, weekLabel: "Week 3", text: "What does Water Baptism symbolise?", options: ["Joining the church membership roll", "Death to sin and resurrection to new life in Christ", "The receiving of the Holy Ghost", "The forgiveness of future sins"], answerIndex: 1 },
  { order: 11, weekLabel: "Week 3", text: "What is the initial evidence of Holy Ghost Baptism?", options: ["Falling under the power", "Weeping and repentance", "Speaking in tongues", "Seeing visions"], answerIndex: 2 },
  { order: 12, weekLabel: "Week 3", text: "What is Baptism for Ministry and how is it administered?", options: ["Water baptism done a second time for those entering ministry", "Received through the laying on of hands by a minister, setting a believer apart for a Kingdom calling", "A private prayer ceremony done alone before the Lord", "Only for ordained pastors and elders"], answerIndex: 1 },
  { order: 13, weekLabel: "Week 3", text: "In Acts 2:4, what happened to those filled with the Holy Spirit on the day of Pentecost?", options: ["They fell asleep", "They began to prophesy only", "They began to speak in other tongues as the Spirit enabled them", "They were healed of sicknesses"], answerIndex: 2 },
  { order: 14, weekLabel: "Weeks 4–5", text: "How does EL Kratos Embassy describe the Holy Ghost?", options: ["The identity and presence of God the Father Himself", "The promised Spirit from the Father through the Son — the daily Companion residing in every believer", "A force that comes and goes depending on your faith level", "An angel assigned to protect each believer"], answerIndex: 1 },
  { order: 15, weekLabel: "Weeks 4–5", text: "How does EL Kratos Embassy describe the Holy Spirit (distinct from the Holy Ghost)?", options: ["The promised Spirit from the Father through the Son", "The same as the Holy Ghost — there is no distinction", "The identity and presence of God the Father Himself — His crown and essence", "A spiritual gift given only to prophets"], answerIndex: 2 },
  { order: 16, weekLabel: "Weeks 4–5", text: "Which scripture is the basis for our belief in the oneness of God?", options: ["John 3:16", "Deuteronomy 6:4 — 'The LORD our God, the LORD is one'", "Romans 8:28", "Psalm 23:1"], answerIndex: 1 },
  { order: 17, weekLabel: "Weeks 4–5", text: "What is EL Kratos Embassy's position on Faith and Works?", options: ["Faith alone is sufficient — works are not necessary", "Works alone are what God requires — faith is secondary", "Faith and works are inseparable — genuine faith always produces action", "Works earn salvation while faith maintains it"], answerIndex: 2 },
  { order: 18, weekLabel: "Weeks 4–5", text: "What are the three dimensions of Love as taught by EL Kratos Embassy?", options: ["Love for self, love for family, love for strangers", "The Father's love for us, our love for God, our love for others", "Eros, Philia, and Agape", "Love through prayer, love through giving, love through service"], answerIndex: 1 },
  { order: 19, weekLabel: "Weeks 4–5", text: "What does Stewardship cover in EL Kratos Embassy's teaching?", options: ["Only financial giving and tithing", "Time, Talent, and Treasure", "Church attendance and volunteering only", "Prayer, fasting, and Bible reading"], answerIndex: 1 },
  { order: 20, weekLabel: "Weeks 4–5", text: "How many core beliefs does EL Kratos Embassy hold?", options: ["7", "9", "11", "12"], answerIndex: 2 },
  { order: 21, weekLabel: "Weeks 4–5", text: "What does EL Kratos Embassy believe about Resurrection and Eternal Life?", options: ["Only great ministers will be resurrected", "There is life after death, judgement, and the reality of heaven and hell; Christ will return", "Everyone goes to heaven regardless of belief", "Resurrection is a metaphor for spiritual renewal in this life"], answerIndex: 1 },
  { order: 22, weekLabel: "Weeks 6–7", text: "Which scripture is the foundation of the Eight Flame Tongues growth framework?", options: ["1 Corinthians 13:13", "2 Peter 1:5–7", "Hebrews 11:6", "James 1:2–3"], answerIndex: 1 },
  { order: 23, weekLabel: "Weeks 6–7", text: "What is the correct order of the first four Flame Tongues?", options: ["Knowledge, Faith, Virtue, Self-Control", "Faith, Virtue, Knowledge, Self-Control", "Virtue, Faith, Self-Control, Knowledge", "Self-Control, Knowledge, Faith, Virtue"], answerIndex: 1 },
  { order: 24, weekLabel: "Weeks 6–7", text: "What is the declaration of the Perseverance stage?", options: ["I believe.", "I live for others.", "I remain steady under pressure.", "I can govern myself."], answerIndex: 2 },
  { order: 25, weekLabel: "Weeks 6–7", text: "At which Flame Tongue stage must a mentor be at minimum?", options: ["Knowledge", "Self-Control", "Godliness", "Love"], answerIndex: 2 },
  { order: 26, weekLabel: "Weeks 6–7", text: "What is the ultimate goal and final stage of the Eight Flame Tongues?", options: ["Godliness", "Brotherly Kindness", "Perseverance", "Love"], answerIndex: 3 },
  { order: 27, weekLabel: "Weeks 6–7", text: "What are the Eight Flame Tongues — and what are they NOT?", options: ["They are public titles — not private markers", "They are pastoral markers of growth and maturity — not ranks, titles, or a competition", "They are performance grades — not spiritual measurements", "They are membership tiers — not growth stages"], answerIndex: 1 },
  { order: 28, weekLabel: "Weeks 6–7", text: "What is the declaration of the Godliness stage?", options: ["I live as Christ.", "I understand what I believe.", "My life reflects God.", "I live for others."], answerIndex: 2 },
  { order: 29, weekLabel: "Weeks 6–7", text: "Which Flame Tongue stage focuses on love expressed within the body of Christ?", options: ["Godliness", "Perseverance", "Brotherly Kindness", "Love"], answerIndex: 2 },
  { order: 30, weekLabel: "Week 8", text: "What is EL Kratos Embassy's primary virtual meeting platform?", options: ["Zoom", "Google Meet", "Microsoft Teams", "WhatsApp Video"], answerIndex: 2 },
  { order: 31, weekLabel: "Week 8", text: "Which email address should you contact for prayer requests?", options: ["info@elkratosembassy.org", "prayer@elkratosembassy.org", "seniorpastor@elkratosembassy.org", "grievance@elkratosembassy.org"], answerIndex: 1 },
  { order: 32, weekLabel: "Week 8", text: "According to the Acceptable Programme Conduct Policy, how should phones be set during services?", options: ["Switched off completely", "On loud so you can hear calls", "On silent or Do Not Disturb mode", "Given to the ushers before the service"], answerIndex: 2 },
  { order: 33, weekLabel: "Week 8", text: "What term does EL Kratos Embassy use instead of 'church service' or 'programme'?", options: ["Meeting", "Encounter", "Session", "Assembly"], answerIndex: 1 },
  { order: 34, weekLabel: "Week 8", text: "What does EL Kratos Embassy call its community of members instead of 'congregants'?", options: ["Followers", "Disciples", "Brethren", "Believers"], answerIndex: 2 },
  { order: 35, weekLabel: "Weeks 9–10", text: "What is the tithe defined as?", options: ["Any amount you feel led to give", "A monthly gift to the pastor", "The first 10% of your income, given as a declaration of trust and obedience", "50% of your income given twice a year"], answerIndex: 2 },
  { order: 36, weekLabel: "Weeks 9–10", text: "What is the account number for EL Kratos Embassy's UBA bank account?", options: ["1028872648", "1082872468", "1028872468", "1028827468"], answerIndex: 2 },
  { order: 37, weekLabel: "Weeks 9–10", text: "Which of the following is NOT one of EL Kratos Embassy's five departments?", options: ["Media", "Welfare", "Evangelism", "Finance"], answerIndex: 2 },
  { order: 38, weekLabel: "Weeks 9–10", text: "Which department handles live streaming, recordings, and graphics?", options: ["Event", "Infrastructure", "Media", "Welfare"], answerIndex: 2 },
  { order: 39, weekLabel: "Weeks 9–10", text: "The Choir Unit and Drama Unit belong to which department?", options: ["Media", "Event", "Infrastructure", "Welfare"], answerIndex: 3 },
  { order: 40, weekLabel: "Weeks 9–10", text: "Can a member serve in multiple units?", options: ["No — one unit per member at all times", "Yes — in multiple units within their own department; outside requires department and unit lead approval", "Yes — in any unit across any department freely", "Only after 2 years of membership"], answerIndex: 1 },
  { order: 41, weekLabel: "Weeks 9–10", text: "First Fruits Offerings are given at what time?", options: ["At the end of the year as thanksgiving", "Every Sunday as part of regular giving", "At the start of a new year or new season, dedicating the first and best to God", "Only when the church has a specific need"], answerIndex: 2 },
  { order: 42, weekLabel: "Weeks 9–10", text: "Which Flame Tongue stage makes a member eligible to lead small teams and enter the leadership pathway?", options: ["Knowledge", "Self-Control", "Perseverance", "Godliness"], answerIndex: 2 },
  { order: 43, weekLabel: "Week 11", text: "What does EL Kratos Embassy define a Christian marriage as?", options: ["Any union blessed by a pastor", "A union between a man and a woman, entered willingly, with pastoral blessing, as a permanent lifelong covenant", "A legal contract between two people who love each other", "A church ceremony followed by a civil wedding"], answerIndex: 1 },
  { order: 44, weekLabel: "Week 11", text: "What is EL Kratos Embassy's position on remarriage after divorce while the former spouse is still living?", options: ["It is permitted after 2 years of separation", "It is permitted if both parties agree", "It is not permitted within EL Kratos Embassy", "It is permitted with the Pastor's blessing"], answerIndex: 2 },
  { order: 45, weekLabel: "Week 11", text: "What must happen before two members of EL Kratos Embassy begin a dating relationship?", options: ["They must be engaged within 3 months", "They must seek the awareness and approval of the church lead", "They must complete 1 year of membership first", "They must inform their parents before the church"], answerIndex: 1 },
  { order: 46, weekLabel: "Week 11", text: "Why does EL Kratos Embassy inform the congregation when two members begin dating?", options: ["For entertainment and gossip purposes", "To create accountability, prayer coverage, and a culture of openness rather than secrecy", "It is a legal requirement for the church", "So that the church can decide if the relationship should continue"], answerIndex: 1 },
  { order: 47, weekLabel: "Week 11", text: "What does 2 Corinthians 5:17 say about those who come to Christ with a complex past?", options: ["They must spend 1 year in probation before full acceptance", "They are accepted but must publicly confess all past sins", "If anyone is in Christ, the new creation has come — the old has gone, the new is here", "They must be re-baptised to wipe away the past"], answerIndex: 2 },
  { order: 48, weekLabel: "Week 12", text: "Which of the following is a RIGHT of a member of EL Kratos Embassy?", options: ["The right to override pastoral decisions", "The right to vote in church decisions including leadership and budget approvals", "The right to start their own ministry without approval", "The right to be exempt from tithing"], answerIndex: 1 },
  { order: 49, weekLabel: "Week 12", text: "What is the minimum number of Foundation Class sessions a participant must attend to qualify for membership?", options: ["8 out of 12", "10 out of 12", "11 out of 12", "All 12"], answerIndex: 1 },
  { order: 50, weekLabel: "Week 12", text: "The Church Covenant includes 8 commitments. Which of the following is one of them?", options: ["To never question church leadership on any matter", "To pray fervently for the church, its leadership, and the advancement of God's work", "To attend every single church programme without exception", "To give 20% of income to the church monthly"], answerIndex: 1 },
];

async function main() {
  console.log("Seeding questions for batch:", BATCH);
  for (const question of QUESTIONS) {
    await prisma.question.upsert({
      where: { batch_order: { batch: BATCH, order: question.order } },
      update: {
        weekLabel: question.weekLabel,
        text: question.text,
        options: question.options,
        answerIndex: question.answerIndex,
      },
      create: {
        batch: BATCH,
        order: question.order,
        weekLabel: question.weekLabel,
        text: question.text,
        options: question.options,
        answerIndex: question.answerIndex,
      },
    });
  }
  console.log(`Seeded ${QUESTIONS.length} questions for batch ${BATCH}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
