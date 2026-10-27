# LUXORA — Premium 3D Jewelry Store

React 19 + Vite storefront with real-time 3D (three.js / react-three-fiber), Framer Motion animation and a complete jewelry shopping flow.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```
On Windows you can also double-click `START-WEBSITE.bat`.

## Features
- **3D hero**: procedurally modelled diamond solitaire that spins, follows the cursor and floats among sparkling loose diamonds
- **3D ring designer**: drag to rotate, switch metal (yellow / rose / white gold, platinum), centre stone and carat with a live price estimate
- **360° 3D view** on every ring product page, in the selected metal colour
- **Live gold-rate pricing**: each price = weight × rate + making − offer + stones + 3% GST, with a full price breakup
- Shop page with filters (category, metal, purity, price, stone, occasion, gender), sorting and search, all kept in the URL
- Mega menu, live search overlay, quick view, 3D tilt cards, hover image swap
- Product page: gallery with hover zoom, purity / colour / size selectors, size guide, pincode delivery check, offers, reviews (customers can write their own), similar and recently viewed items
- Wishlist, cart drawer and bag page, coupons (`LUXE10`, `FIRST1000`, `GIFT5`), gift wrap, free-shipping meter
- 3-step checkout (address → delivery or store pickup → UPI / card / EMI / net banking / COD), order confirmation and order tracking timeline
- OTP sign-in (demo OTP `123456`), order history
- Appointment booking (store visit, video call, try at home, custom design, savings plan), store locator, gold rate table and savings-plan calculator, FAQs and policies, WhatsApp chat button, newsletter
- Cart, wishlist, orders and reviews persist in `localStorage`

## Where to edit
- `src/data/catalog.js`: products, photos, gold rates (`GOLD_24K`), coupons, stores, FAQs
- `src/three/`: 3D ring model, hero scene and viewer
- `src/styles.css`: design tokens (colours, fonts) at the top

## Notes
- Payments, OTP and order tracking are simulated on the front end. Connect a backend and a payment gateway (e.g. Razorpay) before going live.
- Deploying as a SPA: `public/_redirects` (Netlify) and `vercel.json` (Vercel) send every route to `index.html`.
