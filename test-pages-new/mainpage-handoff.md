Your Markdown hand-off document is ready. You can copy this directly into your repository (e.g., as `MOBILE_OPTIMIZATION.md`) or share it with the agent through any text-based platform.

# Technical Hand-off: Mobile Optimization & Refactor
**Project:** networksandnodes.org  
**Objective:** Resolve mobile scroll hijacking and implement Separation of Concerns (SoC).

---

## 1. Problem Statement
The current build uses inline HTML styles and captures all touch events within the SVG/Particle container. This prevents mobile users from scrolling down to view the **Profile** and **Solutions** sections. Additionally, there is no visual indicator that more content exists below the fold.

## 2. Structural Changes (Separation of Concerns)
**Action:** Remove all `style="..."` attributes from the HTML. Move layout and aesthetic logic to a dedicated CSS file.

### Proposed HTML Structure
```html
<section class="hero-container">
    <div id="particle-interaction-layer">
        </div>

    <div class="scroll-prompt">
        <p>Scroll to View Profile</p>
        <div class="arrow-icon"></div>
    </div>
</section>

<main id="profile-section">
    </main>
```

---

## 3. CSS Implementation (The Fix)
The key to fixing mobile scrolling while keeping particle interactivity is the `touch-action` property.

```css
/* Container for the particles */
.hero-container {
    position: relative;
    height: 100vh; /* Full viewport height */
    overflow: hidden;
    background-color: #000;
}

#particle-interaction-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    
    /* CRITICAL: Allows vertical scrolling on mobile while 
       allowing horizontal particle interaction */
    touch-action: pan-y; 
}

/* Scroll Indicator */
.scroll-prompt {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    color: #ffffff;
    pointer-events: none; /* User clicks "through" to particles */
    text-align: center;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);}
    40% {transform: translateY(-10px) translateX(-50%);}
}
```

---

## 4. JavaScript Requirements
To ensure the particles respond correctly to the new CSS structure:
1. **Dynamic Resizing:** Ensure the particle initialization uses `window.innerWidth` and `window.innerHeight`.
2. **Event Listeners:** If the script uses `e.preventDefault()` on touch events, it must be updated to only do so on horizontal swipes (X-axis) to avoid breaking the native vertical scroll.

## 5. Summary of Tasks for Agent
1. **Scrub HTML:** Remove all inline styles.
2. **Centralize CSS:** Implement the layout using the classes provided above.
3. **Add Scroll Cue:** Insert the `.scroll-prompt` div and ensure it is visually distinct over the particle animation.
4. **Test Mobile:** Verify that a vertical swipe on the SVG successfully moves the page down to the Profile section.

---
*Document prepared for David W. Solutions*