# Iron Fit Gym — Website

A modern, responsive, fully static gym & fitness website built with **HTML5, CSS3, vanilla JavaScript, Bootstrap 5 and Font Awesome**. No backend, no build step — works out of the box on **GitHub Pages**.

## Design

- **Palette:** black / charcoal / white / red, dark theme by default.
- **Type:** Google Font *Poppins* for both display and body text, with heavy weight contrast (800/900 headings vs 300 body) doing the pairing work.
- **Signature element:** the "pulse slash" — a skewed red gradient mark used as an eyebrow, underline and divider throughout the site.
- **Effects:** glassmorphism cards, gradient buttons, AOS scroll animations, animated counters, scroll progress bar, lazy-loaded images.

## Pages

| File | Description |
|---|---|
| `index.html` | Home — hero, stats, why-choose-us, programs, CTA |
| `about.html` | History, mission, vision, facilities, timeline |
| `membership.html` | Pricing cards with plan filter |
| `trainers.html` | 8 trainer cards with live search |
| `classes.html` | Class list + weekly timetable |
| `bmi.html` | Interactive metric/imperial BMI calculator |
| `gallery.html` | Filterable image grid with lightbox |
| `testimonials.html` | Bootstrap carousel of member reviews |
| `blog.html` | 6 articles with live search |
| `contact.html` | Map embed + validated contact form |
| `login.html` | Login form with client-side validation |
| `register.html` | Full registration form with validation |
| `dashboard.html` | Frontend-only member dashboard (sidebar, canvas charts, progress rings) |

## File Structure

```
/index.html ... /dashboard.html
/assets/css/style.css
/assets/js/script.js       (shared site behaviour)
/assets/js/bmi.js           (BMI calculator logic)
/assets/js/dashboard.js     (dashboard charts + sidebar)
/assets/images/
README.md
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select your branch and the `/ (root)` folder.
4. Save — your site will be live at `https://<username>.github.io/<repo>/`.

All internal links use relative paths, so the site works identically locally, on any static host, and on GitHub Pages.

## Notes

- Images are loaded from Unsplash for demo purposes — replace `src`/`data-full` attributes in the HTML with your own photography before going live.
- The **Login**, **Register** and **Dashboard** pages are front-end only: forms validate in the browser but do not submit to a server. Wire them up to your backend/auth provider of choice when ready.
- The Google Map on the Contact page uses a generic embed centered on Colombo — replace the `iframe` `src` with your own location's embed code.
