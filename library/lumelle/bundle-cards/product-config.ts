import type { ProductConfig } from './product-types'

// TikTok embeds supplied for the Satin Overnight Curler (see docs/marketing/tiktok-heatless-curler-videos.md)
export const DEFAULT_CURLER_VIDEOS = [
  {
    name: 'Lumelle UK',
    handle: '@lumelleuk',
    embedUrl: 'https://www.tiktok.com/embed/v2/7576640339788746006?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@lumelleuk/video/7576640339788746006',
  },
  {
    name: 'Louaira',
    handle: '@louaira',
    embedUrl: 'https://www.tiktok.com/embed/v2/7581520947211980054?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@louaira/video/7581520947211980054',
  },
  {
    name: 'Hannah H. Styless',
    handle: '@hannahh.styless',
    embedUrl: 'https://www.tiktok.com/embed/v2/7582990745552948502?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@hannahh.styless/video/7582990745552948502',
  },
  {
    name: 'Lumelle UK Tutorial',
    handle: '@lumelleuk',
    embedUrl: 'https://www.tiktok.com/embed/v2/7581498853610769667?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@lumelleuk/video/7581498853610769667',
  },
]

export const DEFAULT_CAP_VIDEOS = [
  {
    name: 'Shannon Mitchell',
    handle: '@shannon_mitch',
    embedUrl: 'https://www.tiktok.com/embed/v2/7562893092957719830?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@shannon_mitch/video/7562893092957719830',
  },
  {
    name: 'Rachel',
    handle: '@rachelsummergreenie._',
    embedUrl: 'https://www.tiktok.com/embed/v2/7543668112630058262?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@rachelsummergreenie._/video/7543668112630058262',
  },
  {
    name: 'Random Life UK',
    handle: '@randomlifeuk',
    embedUrl: 'https://www.tiktok.com/embed/v2/7544353160429587734?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@randomlifeuk/video/7544353160429587734',
  },
  {
    name: 'Winging Ma Life',
    handle: '@wingingmalife',
    embedUrl: 'https://www.tiktok.com/embed/v2/7567328998158585110?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@wingingmalife/video/7567328998158585110',
  },
  {
    name: 'By Latticia',
    handle: '@bylatticia',
    embedUrl: 'https://www.tiktok.com/embed/v2/7566245669250387222?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@bylatticia/video/7566245669250387222',
  },
  {
    name: 'Hannah Styles',
    handle: '@hannahh.styless',
    embedUrl: 'https://www.tiktok.com/embed/v2/7575168979711397142?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@hannahh.styless/video/7575168979711397142',
  },
]

const CURLER_VIDEO_SLOT = `video://${DEFAULT_CURLER_VIDEOS[0].embedUrl}`

// Default fallback video (shower cap) used by other products; curler overrides below.
export const DEFAULT_VIDEO_SLOT = 'video://https://www.tiktok.com/embed/v2/7567328998158585110'

const CAP_GALLERY = [
  '/uploads/luminele/shower-cap-01.webp',
  '/uploads/luminele/shower-cap-02.webp',
  '/uploads/luminele/shower-cap-03.webp',
  '/uploads/luminele/shower-cap-04.webp',
  '/uploads/luminele/shower-cap-05.webp',
  '/uploads/luminele/shower-cap-06.webp',
  '/uploads/luminele/shower-cap-07.webp',
  '/uploads/luminele/shower-cap-08.webp',
  DEFAULT_VIDEO_SLOT,
]

const essentialsCap = [
  {
    title: 'Reusable waterproof',
    body:
      '• Dual-layer construction with waterproof TPU core blocks every drop of moisture\n' +
      '• Comfort-fit elastic band creates a secure seal that keeps steam out completely\n' +
      '• Say goodbye to soggy edges and ruined blowouts — your style stays protected',
  },
  {
    title: 'Satin lined',
    body:
      '• Luxuriously smooth satin interior glides over hair without snagging or pulling\n' +
      '• Blocks humidity to prevent frizz and maintain sleek, polished styles\n' +
      '• Reduces friction that causes breakage, keeping hair healthier wash after wash',
  },
  {
    title: 'Large wide shower cap',
    body:
      '• Generous, roomy silhouette designed for all hair types and lengths\n' +
      '• Comfortably accommodates curls, coils, braids, and protective styles\n' +
      '• Even fits bum-length hair with room to spare — verified by customer reviews',
  },
  {
    title: 'Adjustable',
    body:
      '• Stretch comfort band expands to 24"+ for a customized, secure fit\n' +
      '• No-crease design means no dented edges or flattened styles\n' +
      '• Stays comfortably in place during every shower, every single day',
  },
]

const reasonsCap = [
  {
    title: 'Best seller',
    desc:
      '• Trusted by thousands of customers who refuse to shower without it\n' +
      '• Creator-tested and approved for keeping silk presses, curls, and braids flawless\n' +
      '• Your styles stay camera-ready from wash day to wash day',
  },
  {
    title: 'Happier hair days',
    desc:
      '• Advanced steam-blocking core creates an impenetrable barrier against moisture\n' +
      '• Stop frizz before it starts — your smooth styles last through busy weeks\n' +
      '• Wake up to the same sleek hair you went to bed with',
  },
  {
    title: 'Less breakage',
    desc:
      '• Satin-soft band glides on without tugging, pulling, or snagging delicate strands\n' +
      '• Roomy shape eliminates tension that causes breakage and stress on edges\n' +
      '• Protect your hair investment with every single shower',
  },
  {
    title: 'Stays fresh',
    desc:
      '• Premium dual-layer construction wipes clean in seconds after each use\n' +
      '• Quick air-dry design means it is ready for your next shower\n' +
      '• Built to last 100+ uses — a sustainable upgrade from flimsy disposables',
  },
]

const qaCap = [
  {
    q: 'Will it fit my hair?',
    a: "Customer review · 5★: I've never bothered with shower caps as I have super long hair that goes past my butt so my hair would always get wet and wouldn't fit. This shower cap is perfect – my hair stays bone dry, it fits with plenty of room and the band fits snug around the head. 10/10 worth the price!",
  },
  { q: 'Is it fully waterproof?', a: 'Yes, the durable waterproof outer shell shields hair from moisture and humidity.' },
  {
    q: 'How do I wash it?',
    a: 'Hand wash the shower cap in lukewarm water with mild soap, gently clean the satin lining, rinse well, and air-dry only. Avoid machine washing, tumble drying, or heat to keep the waterproof layer and satin in good condition.',
  },
  { q: 'What\'s the return policy?', a: '30-day Luxe Guarantee with easy exchanges or returns.' },
]

const howCap = [
  {
    title: 'Steam-proof shine',
    body:
      '• Your silk press stays mirror-smooth and frizz-free through every shower\n' +
      '• Advanced seal technology locks out steam that ruins expensive blowouts\n' +
      '• Step out with the same flawless style you stepped in with — every single time',
  },
  {
    title: 'Room for every style',
    body:
      '• Extra-large capacity comfortably houses curls, braids, locs, and protective styles\n' +
      '• No more squishing or cramming — your hair maintains its shape and volume\n' +
      '• Gentle fit protects edges and prevents the creasing that ruins your look',
  },
  {
    title: 'Ready again tomorrow',
    body:
      '• Premium materials wipe clean effortlessly — no special care required\n' +
      '• Quick-dry design means it is fresh and ready for your next shower\n' +
      '• One investment replaces hundreds of disposable caps — better for your wallet and the planet',
  },
]

const careCap = [
  {
    icon: 'Shield',
    title: 'Steam-shield core',
    body:
      '• Dual-layer construction with premium satin exterior and waterproof TPU core\n' +
      '• Creates an impenetrable barrier against steam, humidity, and moisture\n' +
      '• Your styles emerge frizz-free and flawless, even after the steamiest showers',
  },
  {
    icon: 'RefreshCcw',
    title: 'Reusable + easy care',
    body:
      '• Simply hand-wash in lukewarm water with mild soap when needed\n' +
      '• Air-dries quickly and maintains its shape use after use\n' +
      '• Engineered for 100+ showers — a sustainable choice that outlasts disposables',
  },
  {
    icon: 'Feather',
    title: 'Comfort band, no creases',
    body:
      '• Ultra-soft stretch band gently hugs your head without creating dents or marks\n' +
      '• Secure fit stays in place through your entire shower routine\n' +
      '• Works beautifully on curls, braids, locs, and silk presses — protecting every style',
  },
]

const curlerGallery = [
  '/uploads/curler/1.webp',
  '/uploads/curler/2.webp',
  '/uploads/curler/3.webp',
  '/uploads/curler/4.webp',
  '/uploads/curler/5.webp',
  '/uploads/curler/6.webp',
  '/uploads/curler/7.webp',
  '/uploads/curler/8.webp',
  CURLER_VIDEO_SLOT,
]

const essentialsCurler = [
  {
    title: "What's inside",
    body:
      'Everything you need for salon-worthy curls while you sleep:\n\n' +
      '• Satin-wrapped heatless curling rod — soft, flexible, and gentle on hair\n' +
      '• Luxury satin bonnet — keeps your wrap secure and protects your style\n' +
      '• 2× matching satin scrunchies — secure ends without creasing or pulling\n' +
      '• Styling claw clip — section hair effortlessly for perfect wrapping\n\n' +
      'A complete heatless curling system designed for results you will love waking up to.',
  },
  {
    title: 'Works on all hair types',
    body:
      'Whether your hair is straight, wavy, curly, thick, or fine — this set adapts to you.\n\n' +
      '• Flexible rod bends to any hair length or texture\n' +
      '• Creates soft waves on straight hair and defined curls on textured hair\n' +
      '• Adjustable tension lets you control curl tightness\n' +
      '• Satin surface reduces friction for all hair types\n\n' +
      'No heat required. No damage done. Just beautiful, lasting curls that work with your natural hair.',
  },
  {
    title: 'Curls that last for days',
    body:
      'Wake up to curls that stay gorgeous from morning coffee to evening plans.\n\n' +
      '• Most customers enjoy defined curls for 2–3 days\n' +
      '• Tighter wrapping creates longer-lasting definition\n' +
      '• Satin helps preserve curl shape while you sleep\n' +
      '• Pair with your favorite styling products for even more hold\n\n' +
      'The longer you wear it, the more defined your results — beauty sleep has never been so productive.',
  },
]

const reasonsCurler = [
  {
    title: 'Wrap with ease',
    desc:
      'Creating heatless curls is simpler than you think:\n\n' +
      '• Start with dry or slightly damp hair for best results\n' +
      '• Divide hair into two sections and wrap tightly around the satin rod\n' +
      '• The soft, flexible design makes wrapping intuitive and quick\n\n' +
      'New to heatless styling? Check out our tutorial video for step-by-step guidance.',
  },
  {
    title: 'Secure & sleep comfortably',
    desc:
      'Designed for overnight wear so you wake up to gorgeous curls:\n\n' +
      '• Fasten ends with the included satin scrunchies — no creases, no tugging\n' +
      '• Pop on the luxury bonnet to keep everything perfectly in place\n' +
      '• Soft satin feels gentle against your skin and pillow\n\n' +
      'Sleep soundly knowing your curls are setting beautifully while you rest.',
  },
  {
    title: 'Reveal & enjoy',
    desc:
      'The moment you have been waiting for — effortlessly beautiful curls:\n\n' +
      '• Gently unwrap to reveal soft, bouncy, heat-free curls\n' +
      '• No crunch, no stiffness — just natural movement and shine\n' +
      '• Style lasts for days with proper care\n\n' +
      'Step out with confidence knowing your hair looks salon-fresh without a single degree of heat.',
  },
]

const qaCurler = [
  {
    q: 'Will it work for my hair type?',
    a: 'Yes — the Lumelle Heatless Curler is designed for all hair types. Whether your hair is straight, wavy, thick, or fine, the flexible satin rod shapes smooth, lasting curls without heat damage.',
  },
  {
    q: 'How long do the curls last?',
    a: 'Most customers enjoy beautiful curls all day, and many say theirs last up to 2–3 days. Smaller sections and tighter wrapping can help your curls stay defined even longer.',
  },
  {
    q: 'Is it comfortable to sleep in?',
    a: 'Absolutely. Our satin-wrapped rod and lightweight bonnet are designed for soft, overnight comfort, so you wake up with curls — not discomfort.',
  },
  {
    q: 'Does it help with frizz?',
    a: 'Yes. Satin naturally reduces friction, leaving your hair smoother, shinier, and noticeably frizz-free after styling.',
  },
  {
    q: 'Will it damage my hair?',
    a: 'Not at all. Our heatless system avoids the breakage and dryness caused by hot tools, keeping your hair healthier with every use.',
  },
  {
    q: 'Do I use it on wet or dry hair?',
    a: 'For the best results, use on dry or slightly damp hair. Damp hair creates a stronger curl, while dry hair gives softer, looser waves.',
  },
  {
    q: 'How long do I leave it in?',
    a: 'Leave it in overnight or for at least a few hours. The longer it sets, the more defined your curls will be.',
  },
]

const howCurler = [
  {
    title: 'Heatless, healthy curls',
    body:
      'Transform your hair while you sleep — no hot tools required.\n\n' +
      '• Wake up to soft, effortless curls every morning\n' +
      '• Zero heat means zero damage to your strands\n' +
      '• Preserve your hair is natural moisture and strength\n' +
      '• Perfect for damaged, color-treated, or fragile hair\n\n' +
      'Healthy hair has never looked this good.',
  },
  {
    title: 'Frizz defense built in',
    body:
      'Smooth, shiny curls are yours — no serums needed.\n\n' +
      '• Premium satin reduces friction that causes frizz\n' +
      '• Helps seal the cuticle for mirror-like shine\n' +
      '• Protects against breakage and split ends\n' +
      '• Maintains curl definition throughout the day\n\n' +
      'Say goodbye to frizz and hello to your most polished look yet.',
  },
  {
    title: 'Sleep-easy design',
    body:
      'Comfort meets convenience for the ultimate beauty sleep.\n\n' +
      '• Lightweight and flexible — you will forget you are wearing it\n' +
      '• Soft satin feels luxurious against your skin\n' +
      '• Quick to wrap in just minutes before bed\n' +
      '• Secure fit stays put all night long\n\n' +
      'The easiest styling routine you will ever have.',
  },
]

const careCurler = [
  {
    icon: 'Shield',
    title: 'Complete styling system',
    body:
      'Everything you need comes in one beautiful set:\n\n' +
      '• Satin-wrapped heatless curling rod — the heart of the system\n' +
      '• Luxury satin bonnet — protects and secures your style\n' +
      '• 2× matching satin scrunchies — gentle, crease-free hold\n' +
      '• Styling claw clip — makes sectioning effortless\n\n' +
      'Thoughtfully designed to work together for flawless results every time.',
  },
  {
    icon: 'RefreshCcw',
    title: 'Universal hair compatibility',
    body:
      'Engineered to work beautifully on every hair type:\n\n' +
      '• Straight hair transforms into soft, beachy waves\n' +
      '• Wavy hair gains definition and bounce\n' +
      '• Curly and coily hair achieves elongated, frizz-free curls\n' +
      '• Fine or thick — the flexible rod adapts to your volume\n\n' +
      'Your hair type is not a limitation — it is your unique advantage.',
  },
  {
    icon: 'Feather',
    title: 'Long-lasting results',
    body:
      'Curls that keep up with your busy life:\n\n' +
      '• Most customers enjoy beautiful curls for 2–3 days\n' +
      '• Results vary based on hair type and wrapping technique\n' +
      '• Tighter wrapping creates more defined, longer-lasting curls\n' +
      '• Using styling products can extend your curl life even further\n\n' +
      'Spend less time styling and more time enjoying your gorgeous hair.',
  },
]

const TOWEL_GALLERY = [
  '/uploads/towel/Hero.webp',
  '/uploads/towel/Artboard 1.webp',
  '/uploads/towel/Artboard 2.webp',
  '/uploads/towel/Artboard 3.webp',
  '/uploads/towel/Artboard 4.webp',
  '/uploads/towel/Artboard 5.webp',
  '/uploads/towel/Artboard 6.webp',
  '/uploads/towel/Artboard 7.webp',
]

const DEFAULT_TOWEL_VIDEOS = [
  {
    name: 'Lumelle UK',
    handle: '@lumelleuk',
    embedUrl: 'https://www.tiktok.com/embed/v2/7598568400620752150?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@lumelleuk/video/7598568400620752150',
  },
  {
    name: 'Lumelle UK',
    handle: '@lumelleuk',
    embedUrl: 'https://www.tiktok.com/embed/v2/7598189844778454294?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@lumelleuk/video/7598189844778454294',
  },
  {
    name: 'Lumelle UK',
    handle: '@lumelleuk',
    embedUrl: 'https://www.tiktok.com/embed/v2/7599626307323907331?embed_source=lite',
    videoUrl: 'https://www.tiktok.com/@lumelleuk/video/7599626307323907331',
  },
]

const TOWEL_VIDEO_SLOT = `video://${DEFAULT_TOWEL_VIDEOS[0].embedUrl}`

const reviewsTowel = [
  {
    author: 'Amelia',
    stars: 5,
    title: 'Game changer for my hair routine',
    body: "This towel has completely transformed my wash days. It absorbs so much water that my hair goes from soaking wet to damp in just 15 minutes. No more dripping water everywhere while I do my skincare. My hair feels softer and I have way less frizz than with regular towels.",
  },
  {
    author: 'r**y',
    stars: 5,
    title: 'Super soft',
    body: "Very useful, such great material leaves my hair sooo soft and silky, unlike a regular towel. Doesn't slip and keeps all ur hair in place !!!",
  },
  {
    author: 'W**p',
    stars: 5,
    title: 'Better than my current towel',
    body: "So much better than my current towel! It's super soft and keeps my hair frizz free. It goes really well with my satin shower cap x",
  },
  {
    author: 'K**n',
    stars: 5,
    title: 'Total must-have',
    body: "Love this hair towel!! It's super soft, lightweight, and so much better than using a regular towel. It dries my hair faster without frizz and stays in place perfectly. Total must-have for my hair routine!!!",
  },
  {
    author: 'S**i',
    stars: 5,
    title: 'Genuinely XL',
    body: "Absolutely love this hair towel. Super soft, genuinely XL (fits all my hair), and dries so much faster without frizz or pulling. Way better than a normal towel. I won't use anything else now!",
  },
  {
    author: 'j**t',
    stars: 5,
    title: 'Best hair towel ever',
    body: "This is literally the best hair towel I've ever owned. I keep repurchasing this brand. It's such a great design, fits all my hair (long hair) in and not too loose or tight, super easy to use, very absorbent. Feels a bit more comfortable than traditional towel wraps and is lightweight on my head.",
  },
  {
    author: 'S**x',
    stars: 5,
    title: 'Stays on while sleeping',
    body: "Best towel I've used it manages to cover all my hair and stays on even while sleeping! Dries the hair quickly too mine usually takes quite long to dry! LOVE",
  },
]

const essentialsTowel = [
  {
    title: 'Absorbs in seconds',
    body:
      '• Advanced microfiber technology draws moisture away from hair 3x faster than cotton\n' +
      '• Cuts drying time dramatically, so you spend less time with wet hair and more time living\n' +
      '• Gentle on color-treated and delicate strands, no rubbing or tugging required',
  },
  {
    title: 'Room for all hair',
    body:
      '• Extra-large dimensions swallow long, curly, and voluminous hair completely\n' +
      '• Fits everything from fine pixie cuts to thick, bum-length waves and protective styles\n' +
      '• Elegant tulip design wraps generously around braids, extensions, and natural textures',
  },
  {
    title: 'Stays securely',
    body:
      '• Built-in elastic loop and button closure lock the towel firmly in place\n' +
      '• Hands-free design lets you do skincare, makeup, or get dressed while hair dries\n' +
      '• Comfortable, non-slip fit moves with you, walk, bend, and multitask freely',
  },
  {
    title: 'Smooth, frizz-free',
    body:
      '• Silky microfiber glides over cuticles instead of roughing them up like cotton\n' +
      '• Blocks the friction that causes frizz, flyaways, and mid-day pouf\n' +
      '• Keeps your natural curl pattern intact, hair feels softer and more manageable',
  },
]

const reasonsTowel = [
  {
    title: 'Hands-free routine',
    desc:
      '• Button and elastic loop closure keeps the towel secure without holding it\n' +
      '• Free up your hands for skincare, makeup, or getting dressed\n' +
      '• Move freely while your hair dries, no more balancing acts',
  },
  {
    title: 'Stays put',
    desc:
      '• Designed to stay firmly in place through every movement and bend\n' +
      '• No slipping or readjusting, it works as hard as you do\n' +
      '• Comfortable fit that never tugs, pulls, or causes headaches',
  },
  {
    title: 'Faster, healthier hair',
    desc:
      '• Ultra-absorbent microfiber cuts drying time by half compared to cotton\n' +
      '• Smooth fabric reduces frizz and protects your natural curl pattern\n' +
      '• Less heat styling means stronger, healthier hair over time',
  },
]

const qaTowel = [
  {
    q: 'Will it fit my hair type?',
    a: "Customer review · 5★: I have very long, thick hair and this is the first towel that actually fits and stays put. It's so soft, absorbs water quickly, and doesn't feel heavy on my head like regular towels do. My hair dries so much faster and with way less frizz. Absolutely love it!",
  },
  {
    q: 'How do I wash it?',
    a: 'Machine wash on a gentle cycle with like colors, then tumble dry low or air dry. To keep your towel at peak absorbency, avoid fabric softeners and bleach, as these can coat the fibers and reduce their moisture-wicking ability over time.',
  },
  {
    q: 'How long does it take to dry hair?',
    a: 'Most customers find their hair goes from wet to damp-dry in 15 to 30 minutes, depending on hair thickness and length. The ultra-absorbent microfiber wicks away excess moisture quickly, cutting your air-dry time significantly while helping reduce frizz and breakage compared to rough cotton towels.',
  },
  {
    q: 'What\'s the return policy?',
    a: '30-day Luxe Guarantee with easy exchanges or returns.',
  },
]

const howTowel = [
  {
    title: 'Easy positioning',
    body:
      '• Bend forward and drape the towel over wet hair, button resting at the nape of your neck\n' +
      '• The lightweight design feels barely there, so you can start your routine without the usual neck strain\n' +
      '• Perfect placement every time, no awkward adjusting or slipping as you move',
  },
  {
    title: 'Gentle wrapping',
    body:
      '• Twist the towel around your hair, working smoothly from forehead to ends\n' +
      '• Ultra-soft microfiber glides over strands, no rubbing or friction that causes frizz and breakage\n' +
      '• Your curls, coils, and waves keep their natural pattern while drying beautifully',
  },
  {
    title: 'Secure fit',
    body:
      '• Flip back up and fasten the elastic loop around the button with one easy motion\n' +
      '• Stays locked in place through makeup, skincare, and whatever your morning brings\n' +
      '• No slipping, no readjusting, just hands-free drying while you conquer your to-do list',
  },
  {
    title: 'Effortless drying',
    body:
      '• Let the advanced microfiber work its magic while you get ready, remove when hair feels damp\n' +
      '• Cuts drying time in half, so you spend less time with wet hair and more time living\n' +
      '• Step out with smoother, shinier hair that feels healthier from the very first use',
  },
]

const careTowel = [
  {
    icon: 'Shield',
    title: 'Secure fit',
    body:
      '• Built-in elastic strap holds the towel firmly in place, no slipping or sliding\n' +
      '• Stays put while you get ready or wind down, so you can move freely\n' +
      '• Lightweight design feels barely there, you will forget you are wearing it',
  },
  {
    icon: 'RefreshCcw',
    title: 'Frizz-free finish',
    body:
      '• Ultra-soft microfiber creates minimal friction against wet hair\n' +
      '• Protects strands from damage and reduces frizz, unlike rough cotton towels\n' +
      '• Hair emerges smoother, shinier, and more manageable after every use',
  },
  {
    icon: 'Feather',
    title: 'Simple care',
    body:
      '• Machine washable on gentle cycle for effortless cleaning\n' +
      '• Tumble dry low or air dry, no special handling required\n' +
      '• Skip the fabric softener and bleach to maintain peak absorbency',
  },
]

const curlerConfig: ProductConfig = {
  handle: 'satin-overnight-curler',
  fallbackItemId: 'satin-overnight-curler-set',
  fallbackVariantKey: 'variant.satin-overnight-curler.default',
  shopifyId: 'gid://shopify/Product/15496397848950',
  shopifyVariantId: 'gid://shopify/ProductVariant/56852779696502',
  defaultTitle: 'Satin Overnight Heatless Curler Set',
  defaultSubtitle: 'Wake up to salon-worthy curls without heat, damage, or effort. Soft satin design works while you sleep — for healthy, beautiful hair every morning.',
  defaultPrice: 16.99,
  compareAtPrice: 21.99,
  discountPercentOverride: 20,
  ratingValueOverride: 4.8,
  ratingCountLabelOverride: '50+',
  careLabelOverride: "What's included",
  hideDetailsAccordion: true,
  bottomCtaChips: ['Heatless curls', '30-day returns'],
  gallery: curlerGallery,
  // Use curler-specific hero video (first client-provided TikTok)
  videoSlot: CURLER_VIDEO_SLOT,
  essentials: essentialsCurler,
  reasons: reasonsCurler,
  qa: qaCurler,
  how: howCurler,
  care: careCurler,
  featureCallouts: {
    mediaSrc: CURLER_VIDEO_SLOT,
    mediaAlt: 'Satin overnight curler demo',
    mediaLabel: 'Heatless overnight curls',
    mediaNote: 'Soft satin set that stays comfy all night',
    heading: {
      eyebrow: "How you'll use it",
      title: 'Wrap it once, wake up flawless curls',
      description: "You'll get effortless, frizz-free curls that last, with a comfy design that keeps your hair healthier every time you use it.",
      alignment: 'left',
    },
  },
  featuredTikTokHeading: {
    eyebrow: undefined,
    title: 'Watch How These Curls Came Out Flawless',
    description: "See How Long Creators' Curls Last and How Effortlessly Gorgeous They Look.",
    alignment: 'center',
  },
  featuredTikToks: DEFAULT_CURLER_VIDEOS,
}

export const productConfigs: Record<string, ProductConfig> = {
  'shower-cap': {
    handle: 'lumelle-shower-cap',
    fallbackItemId: 'lumelle-cap',
    shopifyId: 'gid://shopify/Product/15488242581878',
    shopifyVariantId: 'gid://shopify/ProductVariant/56829020504438',
    fallbackVariantKey: 'variant.lumelle-shower-cap.default',
    defaultTitle: 'Lumelle Shower Cap',
    defaultSubtitle: 'Luxury protection that keeps every style flawless through every shower. Waterproof satin shields your blowouts, curls, and braids from steam and humidity — so you step out with the same perfect hair you stepped in with.',
    defaultPrice: 14.99,
    compareAtPrice: 19.99,
    badge: 'Buy 2, save 5%',
    bottomCtaChips: ['Waterproof satin', '30-day returns'],
    gallery: CAP_GALLERY,
    videoSlot: DEFAULT_VIDEO_SLOT,
    essentials: essentialsCap,
    reasons: reasonsCap,
    qa: qaCap,
    how: howCap,
    care: careCap,
    featureCallouts: {
      mediaSrc: DEFAULT_VIDEO_SLOT,
      mediaAlt: 'Lumelle cap TikTok demo',
      mediaLabel: 'Watch it in action',
      mediaNote: 'Creator-tested frizz defense',
      heading: {
        eyebrow: 'Why you\'ll love it',
        title: 'Effortless to put on, frizz-free when you take it off',
        description: 'Your small daily luxury that keeps styles smooth, comfy, and camera-ready.',
        alignment: 'left',
      },
    },
    featuredTikTokHeading: {
      eyebrow: 'Creator in action',
      title: 'Watch the cap stay flawless',
      description: 'See how creators keep their silk press perfect after every shower.',
      alignment: 'center',
    },
    featuredTikToks: DEFAULT_CAP_VIDEOS,
    ratingValueOverride: 4.8,
    ratingCountLabelOverride: '100+',
  },
  'satin-overnight-curler': curlerConfig,
  'microfibre-hair-towel': {
    handle: 'lumelle-xl-microfibre-hair-towel',
    fallbackItemId: 'lumelle-xl-microfibre-hair-towel',
    shopifyId: 'gid://shopify/Product/15573057667446',
    shopifyVariantId: 'gid://shopify/ProductVariant/56889577873654',
    fallbackVariantKey: 'variant.lumelle-xl-microfibre-hair-towel.default',
    defaultTitle: 'XL Microfibre Hair Towel',
    defaultSubtitle: 'Cut your drying time in half and step out with smoother, shinier hair, no heat, no frizz, no waiting around',
    defaultPrice: 14.99,
    compareAtPrice: 19.99,
    discountPercentOverride: 25,
    bottomCtaChips: ['Dries in 15 minutes', '30-day guarantee'],
    gallery: TOWEL_GALLERY,
    videoSlot: TOWEL_VIDEO_SLOT,
    essentials: essentialsTowel,
    reviews: reviewsTowel,
    reasons: reasonsTowel,
    qa: qaTowel,
    how: howTowel,
    care: careTowel,
    featureCallouts: {
      mediaSrc: TOWEL_VIDEO_SLOT,
      mediaAlt: 'Lumelle microfibre hair towel demo',
      mediaLabel: 'Quick-dry microfiber',
      mediaNote: 'Ultra-absorbent with secure elastic loop',
      heading: {
        eyebrow: 'Why you\'ll love it',
        title: 'Cut drying time in half, keep frizz at bay',
        description: 'Ultra-absorbent microfiber that works while you get ready, for smoother, healthier-looking hair.',
        alignment: 'left',
      },
    },
    featuredTikTokHeading: {
      eyebrow: 'See it in action',
      title: 'Faster drying, healthier hair',
      description: 'Watch how the microfiber towel reduces drying time without the frizz.',
      alignment: 'center',
    },
    featuredTikToks: DEFAULT_TOWEL_VIDEOS,
    ratingValueOverride: 4.8,
    ratingCountLabelOverride: '50+',
  },
}

export const CAP_GALLERY_FALLBACK = CAP_GALLERY
