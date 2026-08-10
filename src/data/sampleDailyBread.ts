/** Lord's Prayer / Daily Bread — KJV (public domain). */
export const DAILY_BREAD_PRAYER_STARTER = {
  type: "bible" as const,
  title: "Daily Bread Prayer",
  bibleReference: "Matthew 6:9-13",
  versionHint: "KJV",
  bibleGatewayUrl:
    "https://www.biblegateway.com/passage/?search=Matthew%206%3A9-13&version=KJV",
  text: [
    "Our Father which art in heaven, Hallowed be thy name.",
    "Thy kingdom come. Thy will be done in earth, as it is in heaven.",
    "Give us this day our daily bread.",
    "And forgive us our debts, as we forgive our debtors.",
    "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.",
  ].join("\n"),
};
