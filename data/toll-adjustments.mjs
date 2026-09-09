// Rozdělení HAC průjezdu sjezdem a návratem ve stejné mýtnici (kategorie I).
// Zagreb–Ogulin 5,90 + Ogulin–Zadar istok 12,20 = 18,10 místo 18,20.
// Novigrad–Ogulin 2,40 + 12,20 = 14,60 místo 14,70.
// Grobnik–Vrata 2,10 + Vrata–Zadar istok 17,20 = 19,30 místo 19,40.
// Grobnik–Ogulin 7,20 + 12,20 = 19,40; obě pauzy 2,10 + 5,00 + 12,20 = 19,30.
export const tollAdjustments={
 'hr-a':[{stopId:'ogulin',eur:-.1,source:'hac-ogulin'}],
 'hr-b':[{stopId:'fuzine',eur:-.1,source:'hac-vrata'}],
 'hr-c':[{stopId:'ogulin',eur:-.1,source:'hac-ogulin'}],
 'home-a':[{stopId:'ogulin',eur:-.1,source:'hac-ogulin'}],
 'home-b':[{stopId:'ogulin',eur:-.1,source:'hac-ogulin'}],
 'home-c':[{stopId:'ogulin',eur:-.1,source:'hac-ogulin'}],
};
