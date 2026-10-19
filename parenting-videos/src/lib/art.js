/* Hand-drawn style SVG characters. Each returns an <svg> string. */
(function () {
  const SKIN = "#FFDCC6", HAIR = "#4A3426", BLUSH = "#FF9B8A", INK = "#3A3550";

  function eyes(mood) {
    switch (mood) {
      case "cry":
        return `
          <path d="M126 180 L170 200 L126 218" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M274 180 L230 200 L274 218" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M116 166 L166 146" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
          <path d="M284 166 L234 146" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
      case "angry":
        return `
          <path d="M118 160 l52 20" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
          <path d="M282 160 l-52 20" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
          <circle cx="150" cy="200" r="13" fill="${INK}"/><circle cx="250" cy="200" r="13" fill="${INK}"/>`;
      case "sad":
        return `
          <path d="M122 168 l44 -12" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
          <path d="M278 168 l-44 -12" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
          <circle cx="150" cy="200" r="15" fill="${INK}"/><circle cx="250" cy="200" r="15" fill="${INK}"/>
          <circle cx="155" cy="194" r="5" fill="#fff"/><circle cx="255" cy="194" r="5" fill="#fff"/>`;
      case "happy":
        return `
          <path d="M126 204 q24 -30 48 0" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M226 204 q24 -30 48 0" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
      case "sleepy":
        return `
          <path d="M126 200 q24 16 48 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M226 200 q24 16 48 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      default:
        return `
          <circle cx="150" cy="198" r="16" fill="${INK}"/><circle cx="250" cy="198" r="16" fill="${INK}"/>
          <circle cx="156" cy="192" r="5.5" fill="#fff"/><circle cx="256" cy="192" r="5.5" fill="#fff"/>`;
    }
  }

  function mouth(mood) {
    switch (mood) {
      case "cry":
        return `<path class="mouth" d="M146 318 Q150 238 200 236 Q250 238 254 318 Q200 304 146 318z" fill="#8E2F3C"/>
                <path d="M166 312 Q200 280 234 312 Q200 304 166 312z" fill="#FF7A85"/>
                <path d="M170 252 Q200 244 230 252" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>`;
      case "angry":
        return `<path d="M168 282 q32 -26 64 0" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
      case "sad":
        return `<path d="M174 284 q26 -18 52 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      case "happy":
        return `<path d="M160 258 q40 52 80 0 z" fill="#8E2F3C"/><path d="M178 274 q22 14 44 0 q-22 18 -44 0z" fill="#FF7A85"/>`;
      case "sleepy":
        return `<ellipse cx="200" cy="274" rx="12" ry="9" fill="#8E2F3C"/>`;
      default:
        return `<path d="M172 266 q28 22 56 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    }
  }

  function tears(mood) {
    if (mood === "cry")
      return `
        <g class="tears">
          <path d="M120 214 C108 250 128 280 112 330" stroke="#8FD0F5" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/>
          <path d="M280 214 C292 250 272 280 288 330" stroke="#8FD0F5" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/>
          <path class="tear" d="M110 300 q-11 24 0 34 q11 -10 0 -34z" fill="#5DB8EE"/>
          <path class="tear" d="M290 300 q-11 24 0 34 q11 -10 0 -34z" fill="#5DB8EE"/>
          <path class="tear t2" d="M118 290 q-9 20 0 28 q9 -8 0 -28z" fill="#7CC6F2"/>
          <path class="tear t2" d="M282 290 q-9 20 0 28 q9 -8 0 -28z" fill="#7CC6F2"/>
        </g>`;
    if (mood === "sad") return `<path class="tear" d="M140 222 q-7 16 0 23 q7 -7 0 -23z" fill="#7CC6F2"/>`;
    return "";
  }

  window.ART = {
    kid(mood = "calm", dress = "#F2836B") {
      return `<svg class="kid" viewBox="0 0 400 470" xmlns="http://www.w3.org/2000/svg">
        <path d="M120 360 q80 -40 160 0 l34 110 h-228z" fill="${dress}"/>
        <path d="M150 352 q50 30 100 0" stroke="#fff" stroke-width="8" fill="none" opacity=".55"/>
        <circle cx="200" cy="335" r="22" fill="${SKIN}"/>
        <circle cx="62" cy="150" r="52" fill="${HAIR}"/><circle cx="338" cy="150" r="52" fill="${HAIR}"/>
        <path d="M86 112 l22 -16 6 26z M314 112 l-22 -16 -6 26z" fill="#FFC857"/>
        <circle cx="200" cy="200" r="132" fill="${SKIN}"/>
        <path d="M70 186 q8 -128 130 -130 q124 2 132 130 q-30 -60 -88 -66 q-10 30 -60 40 q22 -22 22 -42 q-90 8 -136 68z" fill="${HAIR}"/>
        <ellipse cx="118" cy="252" rx="24" ry="14" fill="${BLUSH}" opacity=".55"/>
        <ellipse cx="282" cy="252" rx="24" ry="14" fill="${BLUSH}" opacity=".55"/>
        ${eyes(mood)}${mouth(mood)}${tears(mood)}
      </svg>`;
    },

    mom(mood = "calm") {
      const brows =
        mood === "anxious"
          ? `<path d="M124 164 l40 10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M276 164 l-40 10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`
          : `<path d="M126 166 q22 -10 42 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M232 166 q22 -10 42 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      const m =
        mood === "anxious"
          ? `<path d="M170 276 q30 -14 60 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
             <path d="M300 140 q-12 22 0 30 q12 -8 0 -30z" fill="#7CC6F2"/>`
          : `<path d="M168 262 q32 26 64 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      const e =
        mood === "calm"
          ? `<path d="M128 206 q22 -18 44 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M228 206 q22 -18 44 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`
          : `<circle cx="150" cy="202" r="13" fill="${INK}"/><circle cx="250" cy="202" r="13" fill="${INK}"/>`;
      return `<svg class="mom" viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg">
        <path d="M90 400 q110 -60 220 0 l40 120 h-300z" fill="#4FB3A6"/>
        <circle cx="200" cy="370" r="26" fill="${SKIN}"/>
        <circle cx="200" cy="48" r="46" fill="${HAIR}"/>
        <path d="M58 250 q-20 -190 142 -192 q162 2 142 192 l-30 40 l-20 -150 h-184 l-20 150z" fill="${HAIR}"/>
        <ellipse cx="200" cy="215" rx="122" ry="134" fill="${SKIN}"/>
        <path d="M80 190 q10 -116 120 -116 q118 0 120 116 q-60 -40 -120 -66 q-50 40 -120 66z" fill="${HAIR}"/>
        <ellipse cx="128" cy="258" rx="20" ry="11" fill="${BLUSH}" opacity=".45"/>
        <ellipse cx="272" cy="258" rx="20" ry="11" fill="${BLUSH}" opacity=".45"/>
        ${brows}${e}${m}
      </svg>`;
    },

    monster(mood = "calm") {
      const angry = mood === "angry";
      return `<svg class="monster" viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 70 l-10 -56 l40 36z M230 70 l10 -56 l-40 36z" fill="#C2410C"/>
        <path d="M150 40 c80 0 130 50 130 130 c0 70 -50 100 -130 100 c-80 0 -130 -30 -130 -100 c0 -80 50 -130 130 -130z" fill="${angry ? "#F05A3C" : "#FF8A4C"}"/>
        <path d="M40 170 q-30 10 -30 40 M260 170 q30 10 30 40" stroke="${angry ? "#F05A3C" : "#FF8A4C"}" stroke-width="22" stroke-linecap="round" fill="none"/>
        <circle cx="108" cy="138" r="30" fill="#fff"/><circle cx="192" cy="138" r="30" fill="#fff"/>
        <circle cx="${angry ? 114 : 110}" cy="${angry ? 146 : 142}" r="14" fill="${INK}"/><circle cx="${angry ? 186 : 190}" cy="${angry ? 146 : 142}" r="14" fill="${INK}"/>
        ${angry ? `<path d="M74 100 l58 24 M226 100 l-58 24" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` : ""}
        ${angry
          ? `<path d="M96 200 q54 -40 108 0 q-10 40 -54 40 q-44 0 -54 -40z" fill="#7A1F1F"/><path d="M112 196 l10 16 l10 -18 l10 18 l10 -18 l10 18 l10 -18 l10 16" fill="#fff"/>`
          : `<path d="M110 200 q40 26 80 0" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>`}
      </svg>`;
    },

    butler(mood = "calm") {
      const worried = mood === "worried";
      return `<svg class="butler" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="40" width="220" height="230" rx="90" fill="#6C9CF0"/>
        <rect x="70" y="20" width="160" height="40" rx="18" fill="#3A3550"/>
        <circle cx="112" cy="130" r="32" fill="#fff" stroke="${INK}" stroke-width="8"/>
        <circle cx="188" cy="130" r="32" fill="#fff" stroke="${INK}" stroke-width="8"/>
        <path d="M144 130 h12" stroke="${INK}" stroke-width="8"/>
        <circle cx="112" cy="${worried ? 136 : 132}" r="11" fill="${INK}"/><circle cx="188" cy="${worried ? 136 : 132}" r="11" fill="${INK}"/>
        ${worried
          ? `<path d="M120 200 q30 -18 60 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`
          : `<path d="M118 192 q32 24 64 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`}
        <path d="M150 236 l-34 -18 v36z M150 236 l34 -18 v36z" fill="#F2836B"/><circle cx="150" cy="236" r="9" fill="#C85A45"/>
      </svg>`;
    },

    heart(color = "#F2836B") {
      return `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><path d="M50 86 C10 58 0 38 0 24 C0 10 12 0 26 0 C38 0 46 8 50 16 C54 8 62 0 74 0 C88 0 100 10 100 24 C100 38 90 58 50 86z" fill="${color}"/></svg>`;
    },
  };
})();
