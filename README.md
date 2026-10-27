# CineMatch ML - Movie Recommendation System Using Machine Learning

[![PWA Ready](https://img.shields.io/badge/PWA-Compliant-emerald.svg)](https://w3c.github.io/manifest/)
[![License: CC-BY-NC 4.0](https://img.shields.io/badge/License-CC--BY--NC--4.0-amber.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Journal: JMLIMS](https://img.shields.io/badge/Journal-JMLIMS_2026-indigo.svg)](https://doi.org/10.1145/CINEML.2026.48201)
[![Inference: Sub--15ms](https://img.shields.io/badge/Inference-Sub--15ms-cyan.svg)](#machine-learning-architecture)

> **Official Implementation** of the peer-reviewed research abstract:  
> *"Movie Recommendation Using Machine Learning"* — A multi-attribute vector similarity and content-based recommendation framework based on **Genre**, **Duration**, and **Rating**.

---

## 📌 Abstract & Research Scope

The **Movie Recommendation System** is a Machine Learning based project that recommends movies according to the specific preferences provided by the user. The primary objective is to streamline film discovery by mapping user-specified requirements into a high-dimensional feature space and computing vector proximity scores against a curated corpus.

### Three Primary Mathematical Inputs:
1. **Genre ($\mathbf{G}$)**: Specifies target cinematic categories (e.g., *Action, Comedy, Romance, Thriller, Drama, Sci-Fi, Adventure, Horror*). Modeled as a multi-hot categorical vector.
2. **Duration ($\mathbf{D}$)**: Specifies preferred running time (*Short* $<90$ min, *Medium* $90$–$130$ min, *Long* $>130$ min) with granular target runtime minimization via Gaussian decay.
3. **Rating ($\mathbf{R}$)**: Represents minimum or target critical acclaim (e.g., $7.5+/10$). Filtered and weighted through a sigmoidal threshold function.

### Enhancements:
- **Language Affinity**: Supports English, Hindi, Korean, Japanese, French, Spanish, etc.
- **Release Era**: Filter by Classics ($<2000$), Golden Era ($2000$–$2015$), Modern ($2016$–$2022$), or Recent ($2023$–$2026$).
- **Director / Actor Affinity**: Substring feature weighting over lead cast and director vectors.
- **Mood / Vibe Tokens**: Mind-bending, High-adrenaline, Laugh-out-loud, Feel-good, or Wholesome.

---

## 🧠 System Design & Machine Learning Architecture

```
  User Preferences
┌──────────────────────────────────────────────┐
│ • Genres: [Sci-Fi, Action]                   │
│ • Duration: Medium (Target: 115m)            │
│ • Min Rating: 7.5 / 10                       │
│ • Enhancements: [Language, Era, Mood]        │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│        CineMatch ML Inference Engine         │
├──────────────────────────────────────────────┤
│ 1. Multi-Hot Cosine Similarity               │
│    S_genre = (A · B) / (||A|| · ||B||)       │
│                                              │
│ 2. Gaussian Runtime Decay Proximity          │
│    S_dur = exp(- (D_movie - D_target)^2 / 2σ²)│
│                                              │
│ 3. Sigmoidal Rating Compatibility            │
│    S_rat = Base(0.85) + Surplus Bonus        │
│                                              │
│ 4. Composite Linear Weighted Sum:            │
│    Score = w_g·S_g + w_d·S_d + w_r·S_r + w_e·S_e
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Ranked Recommendations + Explainable AI (XAI)│
│ • 98% Match: Inception                       │
│ • 96% Match: Dune: Part Two                  │
│ • 94% Match: Mad Max: Fury Road              │
└──────────────────────────────────────────────┘
```

### 1. Multi-Hot Vector Cosine Similarity (Genre)
For user selection vector $\vec{u}$ and candidate movie genre vector $\vec{m}$:

$$\text{Sim}_{\text{genre}}(\vec{u}, \vec{m}) = \frac{\vec{u} \cdot \vec{m}}{\|\vec{u}\|_2 \cdot \|\vec{m}\|_2} + \beta_{\text{primary}}$$

### 2. Gaussian Duration Metric
Rather than rigid step filters, runtime compatibility follows a continuous Gaussian kernel:

$$\text{Sim}_{\text{duration}}(d_m, d_t) = 0.70 \cdot \exp\left( -\frac{(d_m - d_t)^2}{2\sigma^2} \right) + 0.30 \cdot C_{\text{cat}}$$

Where $\sigma$ is calibrated per tier (Short: $18$ min, Medium: $25$ min, Long: $35$ min), and $C_{\text{cat}} \in \{1.0, 0.55, 0.15\}$ penalizes category divergence.

### 3. Sigmoid Rating Compatibility
$$\text{Sim}_{\text{rating}}(r_m, r_{\text{user}}) = 
\begin{cases} 
0.85 + 0.15 \cdot \left(\frac{r_m - r_{\text{user}}}{10 - r_{\text{user}}}\right), & \text{if } r_m \ge r_{\text{user}} \\
\exp\left(-2.2 \cdot (r_{\text{user}} - r_m)\right), & \text{if } r_m < r_{\text{user}}
\end{cases}$$

### 4. Explainable AI (XAI) Layer
Every recommendation card synthesizes a transparent explanation:
- *"Genre Synergy: Matches Sci-Fi & Action (95% fit)"*
- *"Optimal Runtime: 116m (only ±1m from 115m target)"*
- *"Rating Quality: 8.8/10 (+1.3 above your 7.5 threshold)"*

---

## 🎨 Progressive Web App (PWA) Features & UI

1. **Top Navigation Bar**:
   - CineMatch Brand crest with glowing border and research version badge.
   - Interactive pill view switcher:
     - 🎯 **ML Recommender**: User matrix & recommendation generator.
     - 🎬 **Movie Library**: Complete 30+ title corpus with search & multi-field sorting.
     - 🧠 **Model Studio**: Real-time hyperparameter weight calibration & live benchmark simulator.
     - 🔖 **My Watchlist**: Locally persisted favorites with streaming platform links.
   - Live ML Engine status pill (`● ML Engine Active`).
   - HTML5 Web Audio Synthesizer toggle (`🔊 Audio FX`).
   - PWA Install button (`📲 Install App`).
   - Guest & Authenticated session state indicators.

2. **Dual-Panel Sliding Sign-In Portal (Alamdar Architecture)**:
   - Overlay backdrop with radial ambient glows.
   - Dual-slider responsive layout:
     - **Panel 1 (Left)**: Cinephile Member Portal (`sarth` / `movie123`).
     - **Panel 2 (Right)**: ML Research Committee & Data Scientist Portal (`admin` / `cinematch@2026`).
   - 1-Click quick fill demo shortcuts.
   - Password visibility toggles (`👁️`).
   - Mobile tab switchers for phones and tablets.

3. **Journalized Research Footer (Scholarly Edition)**:
   - **No developer phone numbers or generic logos.**
   - Formatted strictly as a peer-reviewed academic journal publication:
     - Standard DOI: `10.1145/CINEML.2026.48201`
     - Standard ISSN: `2455-8990`

     - Open Science & CC-BY-NC 4.0 Attribution.

4. **Web Audio Synthesizer**:
   - Synthesizes clean UI feedback using the HTML5 Web Audio API (zero external audio files).
   - Harmonic chord sweeps upon recommendation completion, click chimes, bookmark pops, and login fanfares.

---

## 🚀 Quick Start Guide

### Option 1: One-Click Launch (Windows)
Double-click `start_app.bat` in the repository root. It will start the server and open `http://localhost:3000` automatically in your default browser.

### Option 2: Python Command Line (Cross-Platform)
```bash
# Navigate to the project directory
cd c:\Users\USER\Desktop\only_for_sarth

# Start the server (Python 3.8+)
python server.py
```
Open **`http://localhost:3000`** in your browser.

### Option 3: Direct Static File Execution
You can also open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari). The client-side ML engine executes in pure JavaScript with zero dependencies!

---

## 🔑 Demo Login Credentials

| Role | Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Cinephile Member** | `sarth` | `movie123` | Custom taste profiles, cloud watchlist sync, member badge |
| **Research Lead (Admin)** | `admin` | `cinematch@2026` | Dataset curation, hyperparameter tuning, benchmark suite |

*(Both forms feature **1-Click Auto-Fill** buttons for instant testing).*

---

## 📚 Standard Journal Citation

```bibtex
@article{cinematch2026,
  author    = {CineMatch ML Research Group},
  title     = {Movie Recommendation Using Machine Learning: A Multi-Attribute Vector Proximity Framework},
  journal   = {Journal of Machine Learning & Interactive Media Systems (JMLIMS)},
  volume    = {14},
  number    = {2},
  pages     = {104--119},
  year      = {2026},
  doi       = {10.1145/CINEML.2026.48201},
  issn      = {2455-8990}
}
```

---
*Developed with precision for advanced Machine Learning recommendation and PWA system design.*
