# Yash Agrawal — Personal Portfolio

An interactive, responsive, cartoon-inspired personal portfolio website built with **React**, **Vite**, and custom **CSS3**.

Featuring a playful 6×6 asymmetrical hand-drawn board layout, a custom vector cartoon avatar with idle and reactive animations, interactive section modals, sound effects, retro incognito mode, and complete resume integration.

---

## 🚀 Live Demo

- **Production URL:** [personal-portfolio](https://personal-portfolio-delta.vercel.app/) *(Deployed on Vercel)*
- **GitHub Repository:** [https://github.com/yashagarwal0777/personal-portfolio](https://github.com/yashagarwal0777/personal-portfolio)

---

## 🛠 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling & Motion:** Modern CSS3 (Grid, Flexbox, Keyframes, Custom Variables)
- **Icons:** Lucide React & Handcrafted Vector SVGs
- **Deployment:** Vercel

---

## 🌟 Key Features

- **Asymmetrical 6×6 Board Composition:** Three distinct visual regions (Left, Center Character, Right) with playful card tilts and tactile drop shadows.
- **Custom Animated Cartoon Avatar:** Responsive SVG avatar with idle breathing, sunglasses reflection glint, and an interactive wave on hover.
- **7 Interactive Section Modals:**
  - `01 About` — Biography, character sheet stats, and development philosophy.
  - `02 Experience` — 4-month Android App Development internship at Celebal Technologies & Head of Technical Team at RHYTHM.
  - `03 Skills` — Core technical proficiencies, animated skill bars, and loadout groups.
  - `04 Education` — Bachelor's in Computer Application (BCA) at JECRC University & Seedling Modern High School.
  - `05 Achievements` — Badges for Celebal Technologies, Salesforce Admin, Cloud Computing, Internshala, and NCC Lieutenant Sergeant.
  - `06 Co-Curriculars` — Festival leadership, NCC military drill, brainstorming, and critical thinking.
  - `07 Contact` — Contact methods (Email, Phone, LinkedIn, GitHub, Resume download) and message form.
- **Retro Incognito Mode:** Secret dark terminal toggle located in the upper right corner.
- **Keyboard Navigation:** Press `1`–`7` to open section modals directly, arrow keys to navigate between panels, and `Escape` to close.
- **Responsive Architecture:** Tailored adaptations for desktop, tablet (2-column), and mobile (fluid stack).

---

## 📦 Project Structure

```text
personal-portfolio/
├── public/
│   └── assets/
│       └── Yash-Agrawal-Resume.pdf  # Genuine downloadable resume
├── src/
│   ├── components/
│   │   ├── sections/                # Modal content components (About, Experience, etc.)
│   │   ├── Avatar.jsx               # Vector cartoon character & animations
│   │   ├── BoardCard.jsx            # Interactive tilt board card
│   │   ├── CustomCursor.jsx         # Playful hand-drawn cursor
│   │   ├── Hud.jsx                  # Floating status and quick contact footer
│   │   ├── IncognitoToggle.jsx      # Secret mode switch
│   │   ├── IncognitoView.jsx        # Terminal login view
│   │   ├── LoadingScreen.jsx        # Retro arcade loader
│   │   └── Modal.jsx                # Universal dialog container
│   ├── data/
│   │   └── portfolioData.js         # Single source of truth for all content
│   ├── App.jsx                      # Main application composition & state
│   ├── index.css                    # Design tokens, grid, animations, responsive CSS
│   └── main.jsx                     # Application root mount
├── vercel.json                      # Vercel SPA routing configuration
├── vite.config.js                   # Vite configuration
└── package.json
```

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashagarwal0777/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📬 Contact & Connect

- **LinkedIn:** [https://www.linkedin.com/in/yash-agrawal-a41b43246/](https://www.linkedin.com/in/yash-agrawal-a41b43246/)
- **GitHub:** [https://github.com/yashagarwal0777](https://github.com/yashagarwal0777)
- **Email:** [Yash.Agrawal0220@gmail.com](mailto:Yash.Agrawal0220@gmail.com)
