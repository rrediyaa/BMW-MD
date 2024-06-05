const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FmclRzSFZEVVpKdGcrWWVKbzF6MmxsNzZLd0NES3RsL3BSU2FVNUszTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiemhUeDJHSzhiR29aM3g3OWlDcHRqRkpEZXl4SUhpc0hnZjVudk93bjZqRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJrUEY3YS85NGJPS2xwNHVHV1dQVTdUK2lBZ3ZUaUJEUHBIaVZ6Rk10MG5RPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPQTBWY1Q0VW9kOG9RV0R0SlFPQ2lFdEZCQ1lpSkNpKzZ0TTZhWUROYWtRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdORm9UbjFLV1czZFdkSHc0bGZPcmRtWTJadllBSm1VeDhDMlFuNzdCV2c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1vY2VvTCt5Z1RDVUtsTWlhOWdxRVA3VUxScld2SEZQRDVTOGNBaWVaUWc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0h2dXBJZDBzWFBSTW13OVBlRjJCSVpYMDlIUm95UC85OUpiZUwvdCtsYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT3luY2ZLOW0xenBrQnVIVTZSUjdWWHlwNEZjWHRCdTRpUnBOTlF0OUpoTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklZQU5kbWpQemZUYkRjTHltU0VwNWlWZjNNclJNdnd4QWhtQ3ZSQnVyS3UzTEhXUEQ4a2E4NTFFK3BJdHlRSE9scmpmQnZLZ0pYenpGSDg4QXJlMWhnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTcsImFkdlNlY3JldEtleSI6ImNzMjFydllrSmQyOEQ0MUo4dDJOR1BidHhmZEZFQXFlbVNWeG9QUWIxU2s9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6InpUb3JzckJhUWQtTnZ3blBRN0VXZHciLCJwaG9uZUlkIjoiMWI5OWMxOWMtZjY4Mi00M2E4LTg2ODAtYjM5NTlkNGJlNDlmIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVZMG1IUUJUTDlnL3NYVnpDT0JMdVMwL2xORT0ifSwicmVnaXN0ZXJlZCI6ZmFsc2UsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUkVjTEFQT2ZSVC9nUVZRNjdZUjZPbHU0R2ljPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSWJpbk00REVKUEFnck1HR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoiei9uVUZzamZhZ2N0TlB0YnRnQytueERHYlFpOFRSb3JBdnJzMUM1RW8xcz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiSExVK2x3UXZrVnBROGNVUWxDZHNnWjNMSmN2U0dVVnRiMEJRbnMrNXluNk9MZzlhclNLeThXdGpaVkNoVFEweTBQUTd1MlNSdW9uTW90ZWV6RUZpQkE9PSIsImRldmljZVNpZ25hdHVyZSI6IlhYd1BIUXV6KytCaWtXek9RVWxwcWEwZENFQ0JHU3grdXdvV0FTaGYzdzBLV3U1T0NjalJxSjU1VURHSTlkMG9VaXBHOSt4cE1rV0pMdEZEdGJ2UmlBPT0ifSwibWUiOnsiaWQiOiI5NDc0MTg5NzY1NDoyOUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiItPj7wnZCMLvCdkJF8fCDwnZCR8J2QhPCdkIPwnZCI8J2QmPCdkIA8PC0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NDE4OTc2NTQ6MjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYy81MUJiSTMyb0hMVFQ3VzdZQXZwOFF4bTBJdkUwYUt3TDY3TlF1UktOYiJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcxNzYwODQ4MCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFORm8ifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "M.R|Rediya",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "+94741897654",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'BMW MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/071f797dda6aef5ae3877.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

