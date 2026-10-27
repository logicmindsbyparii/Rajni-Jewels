// ─────────────────────────────────────────────────────────────
//  Rajani Jewels catalogue — company details, categories,
//  products, FAQs and policies. Pieces are sold on enquiry:
//  there are no prices, every order starts on WhatsApp.
//  Product data lives in ./products.js (photos in /public/products).
// ─────────────────────────────────────────────────────────────
import RAW from "./products.js";

// ── Company ──────────────────────────────────────────────────
export const COMPANY = {
  name: "Rajani Jewels",
  tagline: "Handcrafted Gold, Polki, Diamond & Gemstone Jewellery",
  promise: "Made in Surat, Crafted for the World",
  intro: "Where timeless Indian craftsmanship meets your personal story. Custom designs, heirloom quality.",
  established: "2022",
  phone: "+91 85294 12560",
  tel: "+918529412560",
  whatsapp: "918529412560",
  email: "sales@rajanijewels.com",
  address: "518, 5th Floor, Shashwat, Pipla Sheri, Mahidharpura, Surat – 395003, Gujarat, India",
  city: "Surat, Gujarat",
  social: {
    instagram: "https://www.instagram.com/rajanijewels/",
    facebook: "https://www.facebook.com/Rajanijorwal28",
    youtube: "https://www.youtube.com/@rajanijorwal3843",
  },
  video: "https://www.youtube.com/watch?v=v4LtXgAx-pY",
};

export const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`;
export const waLink = (text = "Hi! I'm interested in your Products and would love to know more about it.") =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`;
export const productLink = (p) => `${window.location.origin}/product/${p.id}`;

// ── Taxonomy ─────────────────────────────────────────────────
// Six collections, each holding the product types of the original site
export const TYPES = {
  bajubandh: { name: "Bajubandh", noun: "Bajubandh", group: "bangle-bracelet" },
  bangle: { name: "Bangle", noun: "Bangle", group: "bangle-bracelet" },
  bracelet: { name: "Bracelet", noun: "Bracelet", group: "bangle-bracelet" },
  earrings: { name: "Earrings", noun: "Earrings", group: "earrings" },
  jhumka: { name: "Jhumka", noun: "Jhumka", group: "earrings" },
  "mens-ring": { name: "Men's Ring", noun: "Ring", group: "mens" },
  "mens-bracelet": { name: "Men's Bracelet", noun: "Bracelet", group: "mens" },
  brooch: { name: "Brooch", noun: "Brooch", group: "mens" },
  "cuff-button": { name: "Cuff Button", noun: "Cufflinks", group: "mens" },
  "gemstone-jewellery": { name: "Gemstone Jewellery", noun: "", group: "necklace-set" },
  mangalsutra: { name: "Mangalsutra", noun: "Mangalsutra", group: "necklace-set" },
  necklace: { name: "Necklace", noun: "Necklace", group: "necklace-set" },
  "pearl-jewellery": { name: "Pearl Jewellery", noun: "", group: "necklace-set" },
  pendant: { name: "Pendant", noun: "Pendant", group: "necklace-set" },
  "pendant-set": { name: "Pendant Set", noun: "Pendant Set", group: "necklace-set" },
  "polki-set": { name: "Polki Set", noun: "Polki Set", group: "necklace-set" },
  "womens-ring": { name: "Women's Ring", noun: "Ring", group: "rings-nose" },
  nath: { name: "Nath", noun: "Nath", group: "rings-nose" },
  "nose-pin": { name: "Nose Pin", noun: "Nose Pin", group: "rings-nose" },
  anklet: { name: "Anklet", noun: "Anklet", group: "traditional-bridal" },
  "hip-hop-jewellery": { name: "Hip Hop Jewellery", noun: "", group: "traditional-bridal" },
  "rajasthani-jewellery": { name: "Rajasthani Jewellery", noun: "", group: "traditional-bridal" },
  sarpech: { name: "Sarpech", noun: "Sarpech", group: "traditional-bridal" },
  "temple-jewellery": { name: "Temple Jewellery", noun: "", group: "traditional-bridal" },
  tika: { name: "Tika", noun: "Tika", group: "traditional-bridal" },
  "watch-gold": { name: "Watch Gold", noun: "", group: "traditional-bridal" },
};

const GROUPS = [
  { id: "necklace-set", name: "Necklace & Set", blurb: "Polki sets, necklaces, pendants & mangalsutra" },
  { id: "bangle-bracelet", name: "Bangle & Bracelet", blurb: "Bangles, bracelets & bajubandh" },
  { id: "earrings", name: "Earrings Collection", blurb: "Studs, drops & jhumkas" },
  { id: "rings-nose", name: "Rings & Nose Jewellery", blurb: "Women's rings, nath & nose pins" },
  { id: "traditional-bridal", name: "Traditional & Bridal", blurb: "Tika, sarpech, temple & Rajasthani jewellery" },
  { id: "mens", name: "Men's Jewellery", blurb: "Rings, bracelets, brooches & cufflinks" },
];

export const OCCASIONS = [
  { id: "bridal", name: "Wedding & Bridal", note: "For the big day", test: /wedding|bridal|reception|engagement/i },
  { id: "party", name: "Party Wear", note: "Made to sparkle", test: /party/i },
  { id: "traditional", name: "Traditional & Festive", note: "Heritage designs", test: /traditional|festive/i },
  { id: "daily", name: "Daily & Office Wear", note: "Light, wearable elegance", test: /daily|office|casual|formal/i },
];

export const COLORS = {
  yellow: { label: "Yellow gold", swatch: "#e2bd6b", hex: "#e8c374" },
  rose: { label: "Rose gold", swatch: "#e2a58a", hex: "#eab096" },
  white: { label: "White gold", swatch: "#dcdcdc", hex: "#e6e6e8" },
};

// ── Products ─────────────────────────────────────────────────
const attr = (p, key) => p.attrs.find(([k]) => k === key)?.[1] || "";

const stoneKind = (stone) =>
  !stone || /^none/i.test(stone) ? "plain"
    : /emerald|ruby|sapphire|gemstone|kundan|bead/i.test(stone) ? "gemstone"
      : /pearl/i.test(stone) ? "pearl"
        : /diamond/i.test(stone) ? "diamond" : "gemstone";

const gemFor = (p) => {
  const s = `${attr(p, "Stone Type")} ${attr(p, "Diamond Color")}`;
  return /emerald|green/i.test(s) ? "emerald" : /ruby|red/i.test(s) ? "ruby" : /blue|sapphire/i.test(s) ? "sapphire" : /pearl/i.test(s) ? "pearl" : /diamond/i.test(s) ? "diamond" : "none";
};

// Untagged polki and temple pieces are wedding / traditional pieces
const occasionsFor = (p, type) => {
  const tag = attr(p, "Occasion");
  if (tag) return OCCASIONS.filter((o) => o.test.test(tag)).map((o) => o.id);
  if (["polki-set", "temple-jewellery", "tika", "sarpech", "nath", "rajasthani-jewellery"].includes(type)) return ["bridal", "traditional"];
  return [];
};

const NEW_COUNT = 16;

export const PRODUCTS = RAW.map((p, i) => {
  const type = TYPES[p.type];
  const metal = attr(p, "Metal");
  const colors = ["yellow", "white", "rose"].filter((c) => metal.toLowerCase().includes(c));
  const stone = attr(p, "Stone Type");
  const name = type.noun && !p.name.toLowerCase().includes(type.noun.toLowerCase().split(" ")[0]) ? `${p.name} ${type.noun}` : p.name;
  return {
    id: p.id,
    code: `RJ-${p.id}`,
    name,
    type: p.type,
    typeName: type.name,
    category: type.group,
    images: p.images.map(([src, thumb]) => ({ src, thumb: thumb || src })),
    attrs: p.attrs,
    metal: metal || "Gold",
    purity: metal.match(/\d+K/)?.[0] || "",
    colors: colors.length ? colors : ["yellow"],
    stone,
    stoneKind: stoneKind(stone),
    gem: gemFor(p),
    occasions: occasionsFor(p, p.type),
    certification: attr(p, "Certification"),
    order: i,
    isNew: i < NEW_COUNT,
    badge: i < NEW_COUNT ? "New" : "",
    sizeType: /ring/.test(p.type) ? "ring" : ["bangle", "bracelet", "mens-bracelet"].includes(p.type) ? "bracelet" : null,
  };
});

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
export const getProduct = (id) => byId.get(String(id));

export const describe = (p) => {
  const bits = [p.metal !== "Gold" && p.metal, p.stone && !/^none/i.test(p.stone) && p.stone.toLowerCase()].filter(Boolean);
  return `Handcrafted ${p.typeName.toLowerCase()} by the karigars of Rajani Jewels in Surat${bits.length ? `, in ${bits.join(" with ")}` : ""}. ${p.certification === "BIS Hallmarked" ? "BIS hallmarked gold. " : ""}Every piece can be customised in metal, size and stones — send us an enquiry and our team will share the price, weight and delivery details.`;
};

export const CATEGORIES = GROUPS.map((g) => {
  const items = PRODUCTS.filter((p) => p.category === g.id);
  return {
    ...g,
    image: items[0].images[0],
    types: Object.entries(TYPES).filter(([, t]) => t.group === g.id).map(([id, t]) => ({ id, name: t.name, count: items.filter((p) => p.type === id).length })),
  };
});

export const OCCASION_IMAGES = {
  bridal: { src: "/site/slide-1.webp" },
  party: PRODUCTS.find((p) => p.type === "necklace" && p.occasions.includes("party"))?.images[0],
  traditional: PRODUCTS.find((p) => p.type === "polki-set")?.images[0],
  daily: PRODUCTS.find((p) => p.type === "pendant" && p.occasions.includes("daily"))?.images[0] || PRODUCTS.find((p) => p.type === "pendant")?.images[0],
};

export const RING_SIZES = [8, 10, 12, 14, 16, 18, 20, 22, 24];
export const BRACELET_SIZES = ["2.4", "2.6", "2.8"];

export const RING_SIZE_TABLE = [
  { in: 8, mm: 15.6, us: 4.5 }, { in: 10, mm: 16.2, us: 5 }, { in: 12, mm: 16.8, us: 6 },
  { in: 14, mm: 17.3, us: 6.5 }, { in: 16, mm: 17.8, us: 7.5 }, { in: 18, mm: 18.5, us: 8 },
  { in: 20, mm: 19.1, us: 9 }, { in: 22, mm: 19.8, us: 10 }, { in: 24, mm: 20.4, us: 10.5 },
];

// ── Content from rajanijewels.com ────────────────────────────
export const PROMISES = [
  { title: "Free Delivery", text: "On all products across India" },
  { title: "Easy Returns", text: "Hassle-free returns" },
  { title: "Secure Payments", text: "100% safe & secure" },
  { title: "BIS Hallmarked", text: "Gold with certified diamonds" },
  { title: "Bespoke Designs", text: "Your idea, handcrafted" },
];

export const CRAFTS = [
  { title: "Polki Jewellery", text: "Uncut diamond jewellery set in 22K & 18K gold with timeless royal elegance.", to: "/shop/necklace-set?type=polki-set" },
  { title: "Diamond Jewellery", text: "Certified brilliant-cut diamonds in classic, bridal, and contemporary designs.", to: "/shop?stone=diamond" },
  { title: "Gemstone Jewellery", text: "Natural rubies, emeralds, sapphires, pearls, and more — selected for beauty and character.", to: "/shop?stone=gemstone,pearl" },
  { title: "Gold Jewellery", text: "BIS hallmarked gold jewellery designed for weddings, gifting, and daily elegance.", to: "/shop" },
  { title: "Bespoke Customization", text: "Have a design in mind? We transform your vision into wearable art.", to: "/appointment?type=custom" },
];

export const WHY = [
  { title: "Authentic Materials", text: "BIS hallmarked gold, certified diamonds, and natural gemstones with complete transparency." },
  { title: "Handmade Craftsmanship", text: "Every jewellery piece is handcrafted with strict quality checks at every stage." },
  { title: "Personalized Designs", text: "Custom-made jewellery crafted around your story, style, and occasion." },
  { title: "Trusted Relationships", text: "Serving clients across India and beyond with quality, trust, and timeless designs." },
];

export const FAQS = [
  { q: "What products do you offer?", a: "We offer a wide range of jewelry including designer gold rings, diamond pendants, earrings, necklace sets, and more. All products are crafted with high-quality materials and latest designs." },
  { q: "Do you provide free delivery?", a: "Yes, we offer free delivery on all products across India." },
  { q: "How can I place an order?", a: "You can place an order by clicking on the “Enquiry Now” button on any product. Our team will contact you to confirm details and assist with the purchase." },
  { q: "Do you offer customization?", a: "Yes, we provide customization options for selected jewelry items. You can contact us with your requirements, and we'll help create your desired design." },
  { q: "What payment methods do you accept?", a: "We accept online bank transfer, UPI, and other secure payment methods. Details will be shared during order confirmation." },
  { q: "How long does delivery take?", a: "Delivery usually takes 5–10 working days, depending on product availability and your location." },
  { q: "Can I return or exchange a product?", a: "Yes, we offer return/exchange on selected items within a limited time period. Please check our return policy or contact support for details." },
  { q: "Are your products certified?", a: "Yes, our jewelry is made with certified materials and follows quality standards to ensure authenticity and durability." },
];

const CONTACT_LINES = [`Email: ${COMPANY.email}`, `Phone: ${COMPANY.phone}`, "Address: 518, 5th Floor, Shashwat, Pipla Sheri, Mahidharpura, Surat – 395003"];

export const POLICIES = [
  {
    id: "refund-returns",
    title: "Refund & Return Policy",
    intro: "We want you to be satisfied with your purchase. Please read our return and refund policy carefully.",
    sections: [
      { h: "Return Eligibility", list: ["Returns are accepted only on selected products", "Request must be made within 3–7 days of delivery", "Product must be unused, unworn, and in original packaging", "Original invoice/receipt is required"] },
      { h: "Non-Returnable Items", p: "The following items are not eligible for return:", list: ["Customized or made-to-order jewelry", "Products damaged due to misuse", "Items purchased during special offers or clearance sales (if mentioned)"] },
      { h: "Return Process", list: ["Contact us via email or phone to request a return", "Share order details and reason for return", "Our team will guide you with the return steps"] },
      { h: "Refund Policy", list: ["Refund will be processed after product inspection", "Amount will be refunded via original payment method or agreed option", "Refund processing time: 5–10 working days"] },
      { h: "Exchange Policy", list: ["Exchange is available for eligible products", "You can request exchange for size/design (subject to availability)"] },
      { h: "Damaged or Wrong Product", p: "If you receive a damaged or incorrect item:", list: ["Inform us within 24–48 hours of delivery", "Share photos/videos for verification", "We will arrange replacement or refund"] },
      { h: "Shipping Charges", list: ["Return shipping charges may be applicable", "In case of damaged/wrong product, we will bear the shipping cost"] },
      { h: "Contact Us", p: "For return or refund requests, contact us:", list: CONTACT_LINES },
    ],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    intro: "Welcome to our website. By accessing or using our website, you agree to follow the terms and conditions mentioned below. Please read them carefully.",
    sections: [
      { h: "General", p: "By using this website, you confirm that you are at least 18 years old or using it under the supervision of a parent or guardian." },
      { h: "Products & Information", p: "We try to ensure all product details, images, and prices are accurate. However, errors may occur, and we reserve the right to correct them without prior notice." },
      { h: "Pricing & Payment", list: ["All prices are listed in INR (₹)", "Prices may change at any time without notice", "Orders will be confirmed only after successful payment or enquiry confirmation"] },
      { h: "Order Process", list: ["Orders can be placed through the “Enquiry Now” option", "Our team will contact you to confirm product details, pricing, and delivery", "We reserve the right to cancel any order due to unavailability or incorrect information"] },
      { h: "Shipping & Delivery", list: ["We offer delivery across India", "Delivery timelines may vary depending on location and product availability", "Delays due to unforeseen circumstances are not under our control"] },
      { h: "Return & Exchange", list: ["Returns/exchanges are accepted only on selected products", "Requests must be made within a limited time after delivery", "The product must be unused and in original condition"] },
      { h: "Intellectual Property", p: "All content on this website (images, text, logo, design) is our property and cannot be copied or used without permission." },
      { h: "User Conduct", p: "You agree not to:", list: ["Use the website for any illegal activity", "Provide false or misleading information", "Attempt to harm or disrupt the website"] },
      { h: "Limitation of Liability", p: "We are not responsible for any indirect or incidental damages arising from the use of our website or products." },
      { h: "Privacy", p: "Your use of the website is also governed by our Privacy Policy." },
      { h: "Changes to Terms", p: "We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page." },
      { h: "Contact Us", p: "If you have any questions, you can contact us:", list: CONTACT_LINES },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    intro: "We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website.",
    sections: [
      { h: "Information We Collect", p: "We may collect the following information:", list: ["Name, phone number, and email address", "Shipping and billing address", "Any details you submit through enquiry forms", "Basic browsing data (like pages visited, device info)"] },
      { h: "How We Use Your Information", p: "We use your information to:", list: ["Respond to your enquiries and provide customer support", "Process orders and communicate order updates", "Improve our website and services", "Send important updates or promotional offers (only if you agree)"] },
      { h: "Data Protection", p: "We take appropriate security measures to protect your personal data from unauthorized access, misuse, or disclosure." },
      { h: "Sharing of Information", p: "We do not sell, trade, or rent your personal information to others. Your data may only be shared with trusted service providers (like delivery partners) to complete your order." },
      { h: "Cookies", p: "Our website may use cookies to enhance your browsing experience and analyze website traffic. You can choose to disable cookies in your browser settings." },
      { h: "Third-Party Links", p: "Our website may contain links to other websites. We are not responsible for the privacy practices of those external sites." },
      { h: "Your Rights", p: "You have the right to:", list: ["Access your personal data", "Request correction or deletion", "Opt-out of marketing communications"] },
      { h: "Updates to This Policy", p: "We may update this Privacy Policy from time to time. Changes will be posted on this page." },
      { h: "Contact Us", p: "If you have any questions about this Privacy Policy, you can contact us:", list: CONTACT_LINES },
    ],
  },
];

export const GALLERY_VIDEOS = Array.from({ length: 24 }, (_, i) => `/gallery/video-${String(i + 1).padStart(2, "0")}.mp4`);

export const POPULAR_SEARCHES = ["Polki set", "Bangle", "Mangalsutra", "Earrings", "Men's bracelet", "Pendant", "Nath", "Pearl"];

export const searchProducts = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return PRODUCTS.filter((p) => {
    const hay = `${p.name} ${p.typeName} ${p.code} ${CATEGORIES.find((c) => c.id === p.category).name} ${p.attrs.map(([, v]) => v).join(" ")}`.toLowerCase().replace(/'/g, "");
    return terms.every((t) => hay.includes(t.replace(/'/g, "").replace(/s$/, "")));
  });
};

// Text sent to WhatsApp for one or more pieces
export const enquiryText = (items, details) => {
  const lines = items.map(({ product, qty = 1, size }, i) =>
    `${i + 1}. ${product.name} (${product.code})${size ? ` · Size ${size}` : ""}${qty > 1 ? ` × ${qty}` : ""}\n   ${productLink(product)}`);
  const who = details ? [`\nName: ${details.name}`, `Phone: ${details.phone}`, details.email && `Email: ${details.email}`, details.city && `City: ${details.city}`, details.message && `Message: ${details.message}`].filter(Boolean) : [];
  return [`Hi Rajani Jewels! I'd like to enquire about ${items.length === 1 ? "this piece" : "these pieces"}:`, ...lines, ...who].join("\n");
};
