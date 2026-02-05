/**
 * kpop_artists 컬렉션 업데이트용 데이터 (웹 검색 기반)
 * 필드: youtube, instagram, twitter, wikipedia, agency
 */
export type KpopArtistSocial = {
  name: string
  youtube: string | null
  instagram: string | null
  twitter: string | null
  wikipedia: string | null
  agency: string | null
}

export const kpopArtistsSocialData: KpopArtistSocial[] = [
  { name: '(G)I-DLE', youtube: 'https://www.youtube.com/@GIDLE-OFFICIAL', instagram: 'https://www.instagram.com/i_dle_official/', twitter: 'https://twitter.com/g_i_dle', wikipedia: 'https://en.wikipedia.org/wiki/(G)I-dle', agency: 'Cube Entertainment' },
  { name: 'ATEEZ', youtube: 'https://www.youtube.com/@ATEEZofficial', instagram: 'https://www.instagram.com/ateez_official_/', twitter: 'https://twitter.com/ATEEZofficial', wikipedia: 'https://en.wikipedia.org/wiki/Ateez', agency: 'KQ Entertainment' },
  { name: 'BLACKPINK', youtube: 'https://www.youtube.com/BLACKPINKOFFICIAL', instagram: 'https://www.instagram.com/blackpinkofficial/', twitter: 'https://twitter.com/ygofficialblink', wikipedia: 'https://en.wikipedia.org/wiki/Blackpink', agency: 'YG Entertainment' },
  { name: 'BTS', youtube: 'https://www.youtube.com/@BTS', instagram: 'https://www.instagram.com/bts.bighitofficial/', twitter: 'https://twitter.com/BTS_twt', wikipedia: 'https://en.wikipedia.org/wiki/BTS', agency: 'BIGHIT MUSIC' },
  { name: 'Big Bang', youtube: 'https://www.youtube.com/user/BIGBANG', instagram: 'https://www.instagram.com/ygent_official/', twitter: 'https://twitter.com/ygent_official', wikipedia: 'https://en.wikipedia.org/wiki/BigBang_(South_Korean_band)', agency: 'YG Entertainment' },
  { name: 'Dreamcatcher', youtube: 'https://www.youtube.com/channel/UCijULR2sXLutCRBtW3_WEfA', instagram: 'https://www.instagram.com/hf_dreamcatcher/', twitter: 'https://twitter.com/hf_dreamcatcher', wikipedia: 'https://en.wikipedia.org/wiki/Dreamcatcher_(group)', agency: 'Dreamcatcher Company' },
  { name: 'ENHYPEN', youtube: 'https://www.youtube.com/@ENHYPENOFFICIAL', instagram: 'https://www.instagram.com/enhypen/', twitter: 'https://twitter.com/BELIFTLAB', wikipedia: 'https://en.wikipedia.org/wiki/ENHYPEN', agency: 'Belift Lab' },
  { name: 'EXO', youtube: 'https://www.youtube.com/c/weareoneEXO', instagram: 'https://www.instagram.com/weareone.exo/', twitter: 'https://twitter.com/weareoneEXO', wikipedia: 'https://en.wikipedia.org/wiki/Exo_(band)', agency: 'SM Entertainment' },
  { name: "G-DRAGON", youtube: 'https://www.youtube.com/OfficialGDRAGON', instagram: 'https://www.instagram.com/xxxibgdrgn/', twitter: 'https://twitter.com/ibgdrgn', wikipedia: 'https://en.wikipedia.org/wiki/G-Dragon', agency: 'Galaxy Corporation' },
  { name: "Girls' Generation", youtube: 'https://www.youtube.com/GIRLSGENERATION', instagram: 'https://www.instagram.com/girlsgeneration/', twitter: 'https://twitter.com/GirlsGeneration', wikipedia: "https://en.wikipedia.org/wiki/Girls'_Generation", agency: 'SM Entertainment' },
  { name: 'ITZY', youtube: 'https://www.youtube.com/@ITZY', instagram: 'https://www.instagram.com/itzy.all.in.us/', twitter: 'https://twitter.com/ITZYOfficial', wikipedia: 'https://en.wikipedia.org/wiki/Itzy', agency: 'JYP Entertainment' },
  { name: 'IU', youtube: 'https://www.youtube.com/user/loenIU', instagram: 'https://www.instagram.com/dlwlrma/', twitter: 'https://twitter.com/_iuofficial', wikipedia: 'https://en.wikipedia.org/wiki/IU_(singer)', agency: 'EDAM Entertainment' },
  { name: 'IVE', youtube: 'https://www.youtube.com/@IVEstarship', instagram: 'https://www.instagram.com/ivestarship/', twitter: 'https://twitter.com/IVEstarship', wikipedia: 'https://en.wikipedia.org/wiki/IVE_(group)', agency: 'Starship Entertainment' },
  { name: 'LE SSERAFIM', youtube: 'https://www.youtube.com/c/LESSERAFIM_official', instagram: 'https://www.instagram.com/le_sserafim/', twitter: 'https://twitter.com/le_sserafim', wikipedia: 'https://en.wikipedia.org/wiki/LE_SSERAFIM', agency: 'Source Music' },
  { name: 'NCT', youtube: 'https://www.youtube.com/@NCT', instagram: 'https://www.instagram.com/nct127/', twitter: 'https://twitter.com/NCTsmtown_127', wikipedia: 'https://en.wikipedia.org/wiki/NCT_(group)', agency: 'SM Entertainment' },
  { name: 'NCT 127', youtube: 'https://www.youtube.com/@NCT', instagram: 'https://www.instagram.com/nct127/', twitter: 'https://twitter.com/NCTsmtown_127', wikipedia: 'https://en.wikipedia.org/wiki/NCT_127', agency: 'SM Entertainment' },
  { name: 'NewJeans', youtube: 'https://www.youtube.com/@NewJeans_official', instagram: 'https://www.instagram.com/newjeans_official/', twitter: 'https://twitter.com/NewJeans_ADOR', wikipedia: 'https://en.wikipedia.org/wiki/NewJeans', agency: 'ADOR' },
  { name: 'PSY', youtube: 'https://www.youtube.com/user/officialpsy', instagram: 'https://www.instagram.com/42psy42/', twitter: 'https://twitter.com/OfficialPnation', wikipedia: 'https://en.wikipedia.org/wiki/Psy', agency: 'P Nation' },
  { name: 'Red Velvet', youtube: 'https://www.youtube.com/@redvelvet', instagram: 'https://www.instagram.com/redvelvet.smtown/', twitter: 'https://twitter.com/rvsmtown', wikipedia: 'https://en.wikipedia.org/wiki/Red_Velvet_(group)', agency: 'SM Entertainment' },
  { name: 'SEVENTEEN', youtube: 'https://www.youtube.com/@pledis17', instagram: 'https://www.instagram.com/saythename_17/', twitter: 'https://twitter.com/pledis_17', wikipedia: 'https://en.wikipedia.org/wiki/Seventeen_(South_Korean_band)', agency: 'Pledis Entertainment' },
  { name: 'SHINee', youtube: 'https://www.youtube.com/@SHINee', instagram: 'https://www.instagram.com/shinee/', twitter: 'https://twitter.com/SHINee', wikipedia: 'https://en.wikipedia.org/wiki/Shinee', agency: 'SM Entertainment' },
  { name: 'STAYC', youtube: 'https://www.youtube.com/@STAYC', instagram: 'https://www.instagram.com/stayc_highup/', twitter: 'https://twitter.com/STAYC_official', wikipedia: 'https://en.wikipedia.org/wiki/STAYC', agency: 'High Up Entertainment' },
  { name: 'Stray Kids', youtube: 'https://www.youtube.com/c/StrayKids', instagram: 'https://www.instagram.com/realstraykids/', twitter: 'https://twitter.com/Stray_Kids', wikipedia: 'https://en.wikipedia.org/wiki/Stray_Kids', agency: 'JYP Entertainment' },
  { name: 'Super Junior', youtube: 'https://www.youtube.com/@SUPERJUNIOR', instagram: 'https://www.instagram.com/superjunior/', twitter: 'https://twitter.com/sjofficial', wikipedia: 'https://en.wikipedia.org/wiki/Super_Junior', agency: 'SM Entertainment' },
  { name: 'TREASURE', youtube: 'https://www.youtube.com/@OfficialTreasure', instagram: 'https://www.instagram.com/yg_treasure_official/', twitter: 'https://twitter.com/treasuremembers', wikipedia: 'https://en.wikipedia.org/wiki/Treasure_(band)', agency: 'YG Entertainment' },
  { name: 'TWICE', youtube: 'https://www.youtube.com/c/twice', instagram: 'https://www.instagram.com/twicetagram/', twitter: 'https://twitter.com/JYPETWICE', wikipedia: 'https://en.wikipedia.org/wiki/Twice', agency: 'JYP Entertainment' },
  { name: 'TXT', youtube: 'https://www.youtube.com/txt_bighit', instagram: 'https://www.instagram.com/txt_bighit/', twitter: 'https://twitter.com/TXT_bighit', wikipedia: 'https://en.wikipedia.org/wiki/Tomorrow_X_Together', agency: 'Big Hit Music' },
  { name: 'aespa', youtube: 'https://www.youtube.com/@aespa', instagram: 'https://www.instagram.com/aespa_official/', twitter: 'https://twitter.com/aespa_Official', wikipedia: 'https://en.wikipedia.org/wiki/Aespa', agency: 'SM Entertainment' },
]
