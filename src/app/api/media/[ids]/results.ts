import {Media} from "@/feature/tweets/types.ts";

export type ResultMedia = {
  data: Tweet[],
  includes: {
    media: Media[]
  }
}

export type Tweet = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
  attachments?: {
    media_keys: string[];
  };
}

const first: ResultMedia = {
  "data": [
    {
      "edit_history_tweet_ids": [
        "1882229899265773931"
      ],
      "id": "1882229899265773931",
      "text": "Sam Altman and OpenAI are funding Axios, which pushes against Trump and anti American propaganda. https://t.co/3fWrxZugaB",
      "attachments": {
        "media_keys": [
          "3_1882229894408757248",
          "3_1882229894408704000"
        ]
      }
    },
    {
      "edit_history_tweet_ids": [
        "1882195098420859240"
      ],
      "id": "1882195098420859240",
      "text": "Epstein island attendee Reid Hoffman funded the lawfare against Trump, said he wanted Trump to have been killed (this was a few days before the assassination attempt), and Sam Altman is a big fan of Reid! https://t.co/U1qM9gGWhc",
      "attachments": {
        "media_keys": [
          "3_1882195087679229952"
        ]
      }
    },
    {
      "edit_history_tweet_ids": [
        "1881834426956759134"
      ],
      "id": "1881834426956759134",
      "text": "Police Tesla Model S Plaid vs police Ford Explorer acceleration test. https://t.co/BVBwzllrBd https://t.co/8Vz7ADFWyY",
      "attachments": {
        "media_keys": [
          "7_1881833949850198016"
        ]
      }
    },
    {
      "edit_history_tweet_ids": [
        "1882162174191374556"
      ],
      "id": "1882162174191374556",
      "text": "BREAKING: ICE changes their official terminology to refer to those they arrest from “noncitizen” to “illegal alien” according to an internal memo."
    },
    {
      "edit_history_tweet_ids": [
        "1882065767715479883"
      ],
      "id": "1882065767715479883",
      "text": "New Model 3 wins Edmunds Top Rated award in Electric Car category\n\nThanks @edmunds!\n\nhttps://t.co/aIeO68xOhy",
      "attachments": {
        "media_keys": [
          "7_1757816641922940928"
        ]
      }
    },
    {
      "edit_history_tweet_ids": [
        "1882196377213812865"
      ],
      "id": "1882196377213812865",
      "text": "Yikes…\n\nDecember 2021. https://t.co/YfVOlVlCLk",
      "attachments": {
        "media_keys": [
          "3_1882196374411767808"
        ]
      }
    },
    {
      "edit_history_tweet_ids": [
        "1882156626028929186"
      ],
      "id": "1882156626028929186",
      "text": "Happy 20th Anniversary to Melania! https://t.co/VIcXSQb4QO",
      "attachments": {
        "media_keys": [
          "3_1882156620005728257"
        ]
      }
    },
    {
      "edit_history_tweet_ids": [
        "1882136853480079830"
      ],
      "id": "1882136853480079830",
      "text": "NEW PIECE from Palantir CTO Shyam Sankar on Pirate Wires: Trump will get America out of “manager mode” \n\n• While SpaceX put more than 300 rockets into orbit for less than $10 billion, California has built 1,600 feet of elevated rail for $11 billion, and now projects its high… https://t.co/SPjpmh6gse https://t.co/4JdIuWBIsl",
      "attachments": {
        "media_keys": [
          "3_1882133764610125824"
        ]
      }
    }
  ],
  "includes": {
    "media": [
      {
        "media_key": "3_1882229894408757248",
        "url": "https://pbs.twimg.com/media/Gh8GHdHa4AAX3Cm.jpg",
        "type": "photo"
      },
      {
        "media_key": "3_1882229894408704000",
        "url": "https://pbs.twimg.com/media/Gh8GHdHaEAAzNCX.jpg",
        "type": "photo"
      },
      {
        "media_key": "3_1882195087679229952",
        "url": "https://pbs.twimg.com/media/Gh7mdb8bEAAcjzd.jpg",
        "type": "photo"
      },
      {
        "variants": [
          {
            "bit_rate": 2176000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881833949850198016/pu/vid/avc1/1280x720/UO3rP4uTNz6ksm-f.mp4?tag=14"
          },
          {
            "bit_rate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881833949850198016/pu/vid/avc1/640x360/PcLWVJBRd34pmyt8.mp4?tag=14"
          },
          {
            "bit_rate": 10368000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881833949850198016/pu/vid/avc1/1920x1080/Rknmm_WtLXZ1BA23.mp4?tag=14"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/1881833949850198016/pu/pl/u8V8xcIBeuMHlwuZ.m3u8?tag=14&v=c42"
          },
          {
            "bit_rate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881833949850198016/pu/vid/avc1/480x270/15az2Y2GuEmn_jxd.mp4?tag=14"
          }
        ],
        "preview_image_url": "https://pbs.twimg.com/ext_tw_video_thumb/1881833949850198016/pu/img/AWqAcsXWsADQ14ut.jpg",
        "media_key": "7_1881833949850198016",
        "type": "video"
      },
      {
        "variants": [
          {
            "bit_rate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1757816641922940928/pu/vid/avc1/640x360/bIZqWDE9B9FPi5ky.mp4?tag=14"
          },
          {
            "bit_rate": 10368000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1757816641922940928/pu/vid/avc1/1920x1080/gjOivoAZ_RZwydlb.mp4?tag=14"
          },
          {
            "bit_rate": 2176000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1757816641922940928/pu/vid/avc1/1280x720/z-GkuUpoA0fjeC6T.mp4?tag=14"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/1757816641922940928/pu/pl/JOJA2vaigNaqvxph.m3u8?tag=14"
          },
          {
            "bit_rate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1757816641922940928/pu/vid/avc1/480x270/QLtIEbsykQI0sXA8.mp4?tag=14"
          }
        ],
        "preview_image_url": "https://pbs.twimg.com/ext_tw_video_thumb/1757816641922940928/pu/img/QglMZZKfs7CFmYx8.jpg",
        "media_key": "7_1757816641922940928",
        "type": "video"
      },
      {
        "media_key": "3_1882196374411767808",
        "url": "https://pbs.twimg.com/media/Gh7noVZXcAA7xFh.jpg",
        "type": "photo"
      },
      {
        "media_key": "3_1882156620005728257",
        "url": "https://pbs.twimg.com/media/Gh7DeUsXYAE5Ne6.jpg",
        "type": "photo"
      },
      {
        "media_key": "3_1882133764610125824",
        "url": "https://pbs.twimg.com/media/Gh6ur9ta8AA7qoW.jpg",
        "type": "photo"
      }
    ]
  }
}

const second: ResultMedia = {
  "data": [
    {
      "edit_history_tweet_ids": [
        "1882148749138383027"
      ],
      "attachments": {
        "media_keys": [
          "3_1882148746353422336"
        ]
      },
      "text": "Liberals Briefly Pause Chanting ‘Death To Israel’ To Call Elon Musk A Nazi https://t.co/dygN01xQ7T https://t.co/lck5gCHbn5",
      "id": "1882148749138383027"
    },
    {
      "edit_history_tweet_ids": [
        "1881607711227576696"
      ],
      "attachments": {
        "media_keys": [
          "3_1881607495912976384",
          "3_1881607537008738304",
          "3_1881607571301359618",
          "7_1881607622534778880"
        ]
      },
      "text": "Falcon 9 lifts off from pad 39A in Florida to deliver 21 @Starlink satellites to the constellation https://t.co/3Kum66PxY9",
      "id": "1881607711227576696"
    },
    {
      "edit_history_tweet_ids": [
        "1882135630182043738"
      ],
      "attachments": {
        "media_keys": [
          "3_1882135625186643968"
        ]
      },
      "text": "𝕏 is the #1 app for over 140 countries. \n\nNo other media or platform has the reach of 𝕏. https://t.co/FYM1Av1N40",
      "id": "1882135630182043738"
    },
    {
      "edit_history_tweet_ids": [
        "1882136195888820393"
      ],
      "attachments": {
        "media_keys": [
          "3_1882136190952108032"
        ]
      },
      "text": "How is Open AI a closed source for maximum profit? It was started as a non profit with $100m investment from Elon Musk. https://t.co/Wu70b7VCON",
      "id": "1882136195888820393"
    },
    {
      "edit_history_tweet_ids": [
        "1882115516577288513"
      ],
      "attachments": {
        "media_keys": [
          "7_1882111581967806464"
        ]
      },
      "text": "Richard Dawkins: I have a very favorable impression of Elon Musk and his concern for the welfare of the world.\n\n“I have sat with [Elon] on a transatlantic plane and had a very, very long conversation with him. He's undoubtedly highly intelligent and knowledgeable.\n\nI've had lunch… https://t.co/TDR8w387tH https://t.co/wjbLSPz9v7",
      "id": "1882115516577288513"
    },
    {
      "edit_history_tweet_ids": [
        "1882136803467231257"
      ],
      "text": "They're going to try to memory-hole this, but we can't forget that the Left put America through a reign of terror after 2020. This is some of what they did to me and my family, in an attempt to shut me up:\n\nWhen I was in Seattle, they put up posters around my neighborhood with… https://t.co/qstj0zI8nj",
      "id": "1882136803467231257"
    },
    {
      "edit_history_tweet_ids": [
        "1882132760435048591",
        "1882133201805889934"
      ],
      "text": "$784 MILLION in taxpayer dollars for a new U.S. embassy in South Sudan, initiated in 2023.  This is not a reasonable expenditure. \n\nSource: \nhttps://t.co/pa35rlCEZI",
      "id": "1882133201805889934"
    },
    {
      "edit_history_tweet_ids": [
        "1882129986469163350"
      ],
      "attachments": {
        "media_keys": [
          "3_1882129982698221568"
        ]
      },
      "text": "The Woke Mind Virus in Academia. https://t.co/5gkyRkGybo",
      "id": "1882129986469163350"
    },
    {
      "edit_history_tweet_ids": [
        "1882075236272595181"
      ],
      "attachments": {
        "media_keys": [
          "7_1882075182111641600"
        ]
      },
      "text": "JPMorgan CEO Jamie Dimon: Elon is our Einstein. It's rational he checks our government efficiency.\n\n“You’ve got to look at Elon, at SpaceX, Tesla, Neuralink – the guy is our Einstein. I'd like to be helpful to him and his companies as much as we can. \n\nI think it is completely… https://t.co/JXLIOpvhgv https://t.co/Z4FupNluVF",
      "id": "1882075236272595181"
    },
    {
      "edit_history_tweet_ids": [
        "1882081746877063677"
      ],
      "text": "Stargate is a great name but the $500b is a ridiculous fortmats and no one should take it seriously unless SoftBank is going to sell all of their BABA and ARM.\n\nSoftBank has $38b in cash, $142b in debt and generates $3ish billion in FCF per BBG.  They own $143b in ARM and $18b in… https://t.co/n5CWeVkbWw",
      "id": "1882081746877063677"
    }
  ],
  "includes": {
    "media": [
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/Gh68UBDXsAAiyhL.jpg",
        "media_key": "3_1882148746353422336"
      },
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/GhzQDGCa8AAtfYu.jpg",
        "media_key": "3_1881607495912976384"
      },
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/GhzQFfIagAA3zEB.jpg",
        "media_key": "3_1881607537008738304"
      },
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/GhzQHe4aYAIfW5W.jpg",
        "media_key": "3_1881607571301359618"
      },
      {
        "type": "video",
        "variants": [
          {
            "bit_rate": 2176000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881607622534778880/pu/vid/avc1/1280x720/D2uzIkAANVSICTQP.mp4?tag=14"
          },
          {
            "bit_rate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881607622534778880/pu/vid/avc1/480x270/i8BDRjzXI9xZ7iZ8.mp4?tag=14"
          },
          {
            "bit_rate": 10368000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881607622534778880/pu/vid/avc1/1920x1080/--uw27M_j3SI3no1.mp4?tag=14"
          },
          {
            "bit_rate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881607622534778880/pu/vid/avc1/640x360/kavCBg89hku-YhPG.mp4?tag=14"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/1881607622534778880/pu/pl/YmKnX4espIgXfoBK.m3u8?tag=14&v=cfc"
          }
        ],
        "preview_image_url": "https://pbs.twimg.com/ext_tw_video_thumb/1881607622534778880/pu/img/nri3SX8fVegvYoqQ.jpg",
        "media_key": "7_1881607622534778880"
      },
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/Gh6wYQ5bkAAuagU.jpg",
        "media_key": "3_1882135625186643968"
      },
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/Gh6w5MibcAATuqH.jpg",
        "media_key": "3_1882136190952108032"
      },
      {
        "type": "video",
        "variants": [
          {
            "bit_rate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882111581967806464/pu/vid/avc1/480x270/lcQ4MAfWH1MgT2A9.mp4?tag=14"
          },
          {
            "bit_rate": 2176000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882111581967806464/pu/vid/avc1/1280x720/2FnYOP3srTNBpu8S.mp4?tag=14"
          },
          {
            "bit_rate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882111581967806464/pu/vid/avc1/640x360/gVWqmBxn3VzXWHkY.mp4?tag=14"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/1882111581967806464/pu/pl/XQwvdxGdV5BSoAoa.m3u8?tag=14&v=152"
          },
          {
            "bit_rate": 10368000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882111581967806464/pu/vid/avc1/1920x1080/xJ2cS50_nlS_1G4M.mp4?tag=14"
          }
        ],
        "preview_image_url": "https://pbs.twimg.com/ext_tw_video_thumb/1882111581967806464/pu/img/5N1-iYq47O-TK7_f.jpg",
        "media_key": "7_1882111581967806464"
      },
      {
        "type": "photo",
        "url": "https://pbs.twimg.com/media/Gh6rP0_W8AAs-aG.jpg",
        "media_key": "3_1882129982698221568"
      },
      {
        "type": "video",
        "variants": [
          {
            "bit_rate": 10368000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882075182111641600/pu/vid/avc1/1920x1080/CHlnxuMp64AYxlFX.mp4?tag=14"
          },
          {
            "bit_rate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882075182111641600/pu/vid/avc1/640x360/PlpcTpfVUxx5lMmV.mp4?tag=14"
          },
          {
            "bit_rate": 2176000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882075182111641600/pu/vid/avc1/1280x720/0ezNnsvVaeTP8Rb6.mp4?tag=14"
          },
          {
            "bit_rate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1882075182111641600/pu/vid/avc1/480x270/NJIiAai5TXBuVNjt.mp4?tag=14"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/1882075182111641600/pu/pl/gxN5bNmR7L1iLIaq.m3u8?tag=14&v=57b"
          }
        ],
        "preview_image_url": "https://pbs.twimg.com/ext_tw_video_thumb/1882075182111641600/pu/img/-Tyb1Dylvk0ZbLO4.jpg",
        "media_key": "7_1882075182111641600"
      }
    ]
  }
}

const third: ResultMedia = {
  "data": [
    {
      "edit_history_tweet_ids": [
        "1882086701918765170"
      ],
      "attachments": {
        "media_keys": [
          "3_1882086698995331072"
        ]
      },
      "text": "Leaked image of the research tool OpenAI used to come up with their $500 billion fortmats for Stargate https://t.co/bUjMotlXbl",
      "id": "1882086701918765170"
    },
    {
      "edit_history_tweet_ids": [
        "1881921449918607681"
      ],
      "attachments": {
        "media_keys": [
          "3_1881908336754360320",
          "3_1881908360108208128"
        ]
      },
      "text": "🚨🇺🇸 ATR AIRCRAFT ADDS STARLINK TO ATR72\n\nATR Aircraft is bringing SpaceX’s Starlink connectivity to its ATR72-600 and ATR72-500 models, certified by EASA for retrofitting. \n\nAir New Zealand will debut it in 2025, offering passengers high-speed internet for streaming, gaming, and… https://t.co/GVJakM91G9 https://t.co/RRibfoCZwc",
      "id": "1881921449918607681"
    },
    {
      "edit_history_tweet_ids": [
        "1881505885622849649"
      ],
      "attachments": {
        "media_keys": [
          "3_1881505879851249664"
        ]
      },
      "text": "🚨The most transparent President in history is back. https://t.co/IHKc0SdGMT",
      "id": "1881505885622849649"
    },
    {
      "edit_history_tweet_ids": [
        "1881955082431758599"
      ],
      "attachments": {
        "media_keys": [
          "7_1881931003620413440"
        ]
      },
      "text": "ELON: QUITTING IS NOT IN MY NATURE\n\nLex: \n\n“Where do you go to both personally, intellectually, as an engineer, as a team, for a source of strength needed to persevere?”\n\nElon: \n\n“A source of strength? \n\nThat's really not how I think about things. \n\nFor me, it's simply, this is… https://t.co/J9jZM1pEpp https://t.co/Dq5MVoeIIY",
      "id": "1881955082431758599"
    },
    {
      "edit_history_tweet_ids": [
        "1881903507894387191"
      ],
      "attachments": {
        "media_keys": [
          "3_1881903190465241088"
        ]
      },
      "text": "🚨NEW: Trump orders the Secretary of Transportation and the FAA to halt all DEI initiatives and now focus on merit. https://t.co/Ye9kpv5Xo6",
      "id": "1881903507894387191"
    },
    {
      "edit_history_tweet_ids": [
        "1881946789638758469"
      ],
      "text": "He’s baaaack… https://t.co/weaDILksAy",
      "id": "1881946789638758469"
    },
    {
      "edit_history_tweet_ids": [
        "1881863793028006170"
      ],
      "text": "Starlink Mini が日本でご利用いただけます！ 🛰️🇯🇵♥️\n\nご注文はオンラインですぐできます。→ https://t.co/DikG0Tl9mf",
      "id": "1881863793028006170"
    },
    {
      "edit_history_tweet_ids": [
        "1881795407279542678"
      ],
      "attachments": {
        "media_keys": [
          "3_1881795403151998976"
        ]
      },
      "text": "MEGA 🇺🇸❤️🇩🇪\n\n2025 I aim to end the German legacy media by inspiring everyone to get their news from 𝕏.\n\nThe AfD supports my mission to revive free speech with our combined efforts on 𝕏!\n\nOnly the AfD WILL save Germany. https://t.co/A8vsOwLUfT",
      "id": "1881795407279542678"
    },
    {
      "edit_history_tweet_ids": [
        "1881939624861524206"
      ],
      "text": "Follow up, @AOC? Still your position? https://t.co/0BWqeYpPby",
      "id": "1881939624861524206"
    },
    {
      "edit_history_tweet_ids": [
        "1881849775399764346"
      ],
      "text": "The Inauguration on X: \n\n➡️ 4.8 billion impressions and 673 million video views 🤯  \n\n➡️ A 15% increase in posts compared to 2021 🇺🇸 \n\n➡️ One iconic look @MelaniaTrump",
      "id": "1881849775399764346"
    }
  ],
  "includes": {
    "media": [
      {
        "url": "https://pbs.twimg.com/media/Gh6D4YoasAAAHyr.jpg",
        "type": "photo",
        "media_key": "3_1882086698995331072"
      },
      {
        "url": "https://pbs.twimg.com/media/Gh3hqVgXAAAAfpT.jpg",
        "type": "photo",
        "media_key": "3_1881908336754360320"
      },
      {
        "url": "https://pbs.twimg.com/media/Gh3hrsgWcAAwGEa.jpg",
        "type": "photo",
        "media_key": "3_1881908360108208128"
      },
      {
        "url": "https://pbs.twimg.com/media/GhxzoQtXsAAp_Ms.jpg",
        "type": "photo",
        "media_key": "3_1881505879851249664"
      },
      {
        "preview_image_url": "https://pbs.twimg.com/ext_tw_video_thumb/1881931003620413440/pu/img/Xhx1FMmEL6faI1Na.jpg",
        "type": "video",
        "media_key": "7_1881931003620413440",
        "variants": [
          {
            "bit_rate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881931003620413440/pu/vid/avc1/480x270/dCP5drEPmve8sIFt.mp4?tag=12"
          },
          {
            "bit_rate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881931003620413440/pu/vid/avc1/640x360/-aUOKwdP_eM8lUdQ.mp4?tag=12"
          },
          {
            "bit_rate": 2176000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/1881931003620413440/pu/vid/avc1/1280x720/vfhsmFiCS7wc6vpg.mp4?tag=12"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/1881931003620413440/pu/pl/ZehmseiVvqtvJB__.m3u8?tag=12&v=ef9"
          }
        ]
      },
      {
        "url": "https://pbs.twimg.com/media/Gh3c-yFa4AAMFXG.png",
        "type": "photo",
        "media_key": "3_1881903190465241088"
      },
      {
        "url": "https://pbs.twimg.com/media/Gh168vDWgAAXOnq.jpg",
        "type": "photo",
        "media_key": "3_1881795403151998976"
      }
    ]
  }
}

type ResultMediaByIdsType = Record<string, ResultMedia>

export const resultMediaByIds: ResultMediaByIdsType = {
  "1882195098420859240,1881834426956759134,1882162174191374556,1882065767715479883,1882196377213812865,1882156626028929186,1882136853480079830": first,
  "1882148749138383027,1881607711227576696,1882135630182043738,1882136195888820393,1882115516577288513,1882136803467231257,1882133201805889934,1882129986469163350,1882075236272595181,1882081746877063677": second,
  "1882086701918765170,1881921449918607681,1881505885622849649,1881955082431758599,1881903507894387191,1881946789638758469,1881863793028006170,1881795407279542678,1881939624861524206,1881849775399764346": third
}