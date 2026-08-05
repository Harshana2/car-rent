# Diamond Athuruga — Car, Van & Bus Rental (Sri Lanka)

Marketing and booking-enquiry website for **Diamond Athuruga**, a Sri Lankan
chauffeur-driven car, van and bus rental service.

**Live site:** https://athurugatravels.com/

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, about, fleet snapshot, services, quotation form, testimonials |
| About | `about.html` | Company story |
| Services | `service.html` | Service catalogue |
| Vehicles | `vehicles.html` | Fleet & per-km rates |
| Quotation | `quotation.html` | Full quote-request form (Formspree) + map |
| Payment | `payment.html` | Payment details form + cancellation policy |

## Tech

Static HTML/CSS/JS — no build step. Bootstrap 4, jQuery, Leaflet (maps),
Owl Carousel, intl-tel-input, Font Awesome. Deployed via GitHub Pages
(`CNAME` → `athurugatravels.com`).

Quotation and newsletter forms post to [Formspree](https://formspree.io/)
(form id in `index.html` / `quotation.html` and `js/custom.js`).

## Run locally

Any static server works, e.g.:

```bash
npx http-server -p 8899 -c-1
```

Then open http://localhost:8899/index.html

## Notes / to-do for the owner

- **Social links** in the footer are placeholders (`#`) — replace with your
  real Facebook / Instagram / etc. profile URLs.
- **Payment page** currently confirms on the front-end only. To take real card
  payments, integrate a gateway (e.g. PayHere for Sri Lanka, or Stripe).
- Formspree free tier limits monthly submissions — upgrade if volume grows.
