/* @ds-bundle: {"format":3,"namespace":"ValumarisDesignSystem_6bbc54","components":[],"sourceHashes":{"explorations/design-canvas.jsx":"5d0e39003628","ui_kits/valumaris-platform/components.jsx":"2f0f00997d87"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ValumarisDesignSystem_6bbc54 = window.ValumarisDesignSystem_6bbc54 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// explorations/design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), labels/titles are inline-editable,
// and any artboard can be opened in a fullscreen focus overlay (←/→/Esc).
// State persists to a .design-canvas.state.json sidecar via the host
// bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}', '.dc-card{transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px}', '.dc-grip{cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{cursor:pointer;border-radius:4px;padding:3px 6px;display:flex;align-items:center;transition:background .12s}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-expand{position:absolute;bottom:100%;right:0;margin-bottom:5px;z-index:2;opacity:0;transition:opacity .12s,background .12s;', '  width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center}', '.dc-expand:hover{background:rgba(0,0,0,.06);color:#2a251f}', '[data-dc-slot]:hover .dc-expand{opacity:1}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, focused
// artboard). Order/titles/labels persist to a .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const srcIds = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (!aid) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const srcOrder = artboards.map(a => a.props.id ?? a.props.label);
  const sec = ctx && sid && ctx.section(sid) || {};
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 80,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px 56px'
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow",
    style: {
      position: 'absolute',
      bottom: '100%',
      left: -4,
      marginBottom: 4,
      color: DC.label
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    onPointerDown: e => e.stopPropagation(),
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    const ns = sectionOrder[(secIdx + d + sectionOrder.length) % sectionOrder.length];
    const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
    if (first) ctx.setFocus(`${ns}/${first}`);
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/design-canvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/valumaris-platform/components.jsx
try { (() => {
const {
  useState,
  useEffect,
  useRef
} = React;

// ═══════════ TOPBAR — logo v2 ═══════════
function TopBar() {
  return /*#__PURE__*/React.createElement("header", {
    className: "vm-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-topbar-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-v2-mini.svg",
    width: "24",
    height: "24",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "vm-wordmark"
  }, "VALU", /*#__PURE__*/React.createElement("em", null, "MARIS")), /*#__PURE__*/React.createElement("span", {
    className: "vm-env"
  }, "platform \xB7 prod")), /*#__PURE__*/React.createElement("div", {
    className: "vm-topbar-nav"
  }, /*#__PURE__*/React.createElement("a", {
    className: "active"
  }, "Indicadores"), /*#__PURE__*/React.createElement("a", null, "Ativos"), /*#__PURE__*/React.createElement("a", null, "API"), /*#__PURE__*/React.createElement("a", null, "Relat\xF3rios")), /*#__PURE__*/React.createElement("div", {
    className: "vm-topbar-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "vm-live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "live \xB7 02:14:08"), /*#__PURE__*/React.createElement("span", {
    className: "vm-pill"
  }, "RC \xB7 Renata C.")));
}

// ═══════════ SIDEBAR ═══════════
function Sidebar({
  active,
  onSelect
}) {
  const classes = [{
    id: 'imoveis',
    label: 'Imóveis',
    count: 184
  }, {
    id: 'arte',
    label: 'Arte',
    count: 47
  }, {
    id: 'commodities',
    label: 'Commodities',
    count: 22
  }, {
    id: 'recebiveis',
    label: 'Recebíveis',
    count: 312
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "vm-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-side-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-side-label"
  }, "Classes de ativo"), classes.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: 'vm-side-item' + (active === c.id ? ' active' : ''),
    onClick: () => onSelect(c.id)
  }, /*#__PURE__*/React.createElement("span", null, c.label), /*#__PURE__*/React.createElement("span", {
    className: "vm-side-count"
  }, c.count)))), /*#__PURE__*/React.createElement("div", {
    className: "vm-side-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-side-label"
  }, "Watchlists"), /*#__PURE__*/React.createElement("button", {
    className: "vm-side-item"
  }, /*#__PURE__*/React.createElement("span", null, "SP prime"), /*#__PURE__*/React.createElement("span", {
    className: "vm-side-count"
  }, "8")), /*#__PURE__*/React.createElement("button", {
    className: "vm-side-item"
  }, /*#__PURE__*/React.createElement("span", null, "Receb\xEDveis AAA"), /*#__PURE__*/React.createElement("span", {
    className: "vm-side-count"
  }, "14"))), /*#__PURE__*/React.createElement("div", {
    className: "vm-side-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-side-label"
  }, "Status"), /*#__PURE__*/React.createElement("div", {
    className: "vm-side-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot teal"
  }), "API \xB7 99,98% uptime"), /*#__PURE__*/React.createElement("div", {
    className: "vm-side-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot teal"
  }), "Ingest\xE3o \xB7 on-chain ok")));
}

// ═══════════ COMMAND BAR ═══════════
function CommandBar({
  query,
  setQuery
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "vm-cmdbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-search"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.5-3.5"
  })), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Buscar ticker, classe, regi\xE3o\u2026"
  }), /*#__PURE__*/React.createElement("span", {
    className: "vm-shortcut"
  }, "\u2318K")), /*#__PURE__*/React.createElement("div", {
    className: "vm-cmd-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "vm-chip"
  }, "\xDAltimos 30d"), /*#__PURE__*/React.createElement("button", {
    className: "vm-chip"
  }, "BRL"), /*#__PURE__*/React.createElement("button", {
    className: "vm-chip active"
  }, "Todos os ativos"), /*#__PURE__*/React.createElement("button", {
    className: "vm-btn-ghost"
  }, "Exportar \u2192")));
}

// ═══════════ STAT GRID — Playfair hero values ═══════════
function StatGrid() {
  const stats = [{
    label: 'Ativos monitorados',
    value: '565',
    delta: '+12',
    deltaKind: 'up',
    sub: 'novos em 30d'
  }, {
    label: 'Volume 24h',
    value: 'R$ 1,84M',
    delta: '+12,0%',
    deltaKind: 'up',
    sub: '1.284 negociações'
  }, {
    label: 'Índice de liquidez',
    value: '0,72',
    delta: '-0,03',
    deltaKind: 'down',
    sub: 'escala 0–1'
  }, {
    label: 'Spread médio',
    value: '0,84%',
    delta: '-0,12pp',
    deltaKind: 'up',
    sub: 'vs. última semana'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "vm-stat-grid"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    className: "vm-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-stat-label"
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "vm-stat-value"
  }, s.value), /*#__PURE__*/React.createElement("div", {
    className: 'vm-stat-delta ' + s.deltaKind
  }, s.delta, " \xB7 ", s.sub))));
}

// ═══════════ ASSET LIST — sonar on click ═══════════
function AssetList({
  onSelect,
  selectedId
}) {
  const [sonarId, setSonarId] = useState(null);
  const rows = [{
    id: 'sp01',
    ticker: 'CLR-IMOVEL-SP01',
    name: 'Ed. Faria Lima Torre B',
    price: 'R$ 487,20',
    delta: '+2,4%',
    dir: 'up',
    liq: 'Alta',
    vol: 'R$ 284k',
    spark: [14, 11, 13, 8, 10, 5, 6]
  }, {
    id: 'ou01',
    ticker: 'CLR-OURO-001',
    name: 'Ouro físico · custódia SP',
    price: 'R$ 932,55',
    delta: '-0,8%',
    dir: 'down',
    liq: 'Média',
    vol: 'R$ 412k',
    spark: [6, 8, 7, 11, 10, 13, 14]
  }, {
    id: 'ar47',
    ticker: 'CLR-ART-0047',
    name: 'Série Baravelli · lote 47',
    price: 'R$ 12.400',
    delta: '+5,1%',
    dir: 'up',
    liq: 'Baixa',
    vol: 'R$ 48k',
    spark: [16, 14, 12, 9, 7, 5, 3]
  }, {
    id: 'rj02',
    ticker: 'CLR-IMOVEL-RJ02',
    name: 'Galpão Duque de Caxias',
    price: 'R$ 218,40',
    delta: '+0,6%',
    dir: 'up',
    liq: 'Alta',
    vol: 'R$ 124k',
    spark: [10, 10, 9, 11, 10, 9, 8]
  }, {
    id: 're88',
    ticker: 'CLR-RECEB-088',
    name: 'Recebíveis agro · safra 24',
    price: 'R$ 102,15',
    delta: '-0,2%',
    dir: 'down',
    liq: 'Média',
    vol: 'R$ 96k',
    spark: [8, 9, 10, 10, 11, 11, 12]
  }, {
    id: 'so04',
    ticker: 'CLR-SOJA-004',
    name: 'Soja · MT custódia',
    price: 'R$ 74,80',
    delta: '+1,8%',
    dir: 'up',
    liq: 'Alta',
    vol: 'R$ 204k',
    spark: [12, 11, 9, 8, 7, 6, 5]
  }];
  function handleClick(r) {
    setSonarId(r.id);
    onSelect(r);
    setTimeout(() => setSonarId(null), 420);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "vm-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-list-head"
  }, /*#__PURE__*/React.createElement("span", null, "Ativo"), /*#__PURE__*/React.createElement("span", null, "Pre\xE7o"), /*#__PURE__*/React.createElement("span", null, "\u0394 24h"), /*#__PURE__*/React.createElement("span", null, "7D"), /*#__PURE__*/React.createElement("span", null, "Volume"), /*#__PURE__*/React.createElement("span", null, "Liq.")), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: ['vm-list-row', selectedId === r.id ? 'active' : '', sonarId === r.id ? 'sonar' : ''].join(' '),
    onClick: () => handleClick(r)
  }, /*#__PURE__*/React.createElement("span", {
    className: "vm-row-ticker"
  }, /*#__PURE__*/React.createElement("span", {
    className: "vm-row-code"
  }, r.ticker), /*#__PURE__*/React.createElement("span", {
    className: "vm-row-name"
  }, r.name)), /*#__PURE__*/React.createElement("span", {
    className: "vm-row-price"
  }, r.price), /*#__PURE__*/React.createElement("span", {
    className: 'vm-row-delta ' + r.dir
  }, r.delta), /*#__PURE__*/React.createElement("svg", {
    className: "vm-spark",
    viewBox: "0 0 140 20",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: r.spark.map((p, i) => `${i / (r.spark.length - 1) * 140},${p}`).join(' '),
    stroke: r.dir === 'up' ? '#0C7A6E' : '#A87800',
    fill: "none",
    strokeWidth: "1.2"
  })), /*#__PURE__*/React.createElement("span", {
    className: "vm-row-vol"
  }, r.vol), /*#__PURE__*/React.createElement("span", {
    className: "vm-row-liq"
  }, r.liq))));
}

// ═══════════ DETAIL PANEL — depth chart + submersion ═══════════
function DetailPanel({
  asset
}) {
  const [entering, setEntering] = useState(false);
  const prevId = useRef(null);
  useEffect(() => {
    if (asset && asset.id !== prevId.current) {
      setEntering(false);
      const raf = requestAnimationFrame(() => {
        setEntering(true);
        prevId.current = asset.id;
        setTimeout(() => setEntering(false), 800);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [asset]);
  if (!asset) return /*#__PURE__*/React.createElement("div", {
    className: "vm-detail empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-empty-eyebrow"
  }, "Nenhum ativo selecionado"), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-empty-text"
  }, "Selecione uma linha \xE0 esquerda para ver ", /*#__PURE__*/React.createElement("em", null, "indicadores detalhados.")));
  const isUp = asset.dir === 'up';
  const lineColor = isUp ? '#3A78F0' : '#E8B95E';

  // depth-chart path (simulated 30d for the selected asset)
  const paths = {
    sp01: 'M0,130 L80,112 L160,120 L240,84 L320,96 L400,64 L480,76 L560,40 L640,56 L720,20 L800,32',
    ou01: 'M0,40 L80,55 L160,50 L240,70 L320,62 L400,80 L480,75 L560,95 L640,88 L720,105 L800,110',
    ar47: 'M0,115 L80,100 L160,105 L240,80 L320,70 L400,55 L480,42 L560,28 L640,32 L720,18 L800,20',
    rj02: 'M0,90 L80,88 L160,92 L240,85 L320,88 L400,82 L480,86 L560,80 L640,78 L720,75 L800,72',
    re88: 'M0,80 L80,82 L160,78 L240,82 L320,85 L400,82 L480,86 L560,88 L640,90 L720,92 L800,95',
    so04: 'M0,110 L80,100 L160,95 L240,85 L320,75 L400,65 L480,58 L560,48 L640,42 L720,35 L800,30'
  };
  const mainPath = paths[asset.id] || paths.sp01;
  // echo path offset +12px on Y
  const echoPath = mainPath.replace(/(\d+),(\d+)/g, (_, x, y) => `${x},${Math.min(220, parseInt(y) + 12)}`);
  // fill closes the path
  const fillPath = mainPath + ' L800,220 L0,220 Z';
  const echoFill = echoPath + ' L800,220 L0,220 Z';
  return /*#__PURE__*/React.createElement("div", {
    className: 'vm-detail' + (entering ? ' entering' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-eyebrow"
  }, "Ticker"), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-ticker"
  }, asset.ticker), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-name"
  }, asset.name)), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-price"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-price-val"
  }, asset.price), /*#__PURE__*/React.createElement("div", {
    className: 'vm-detail-price-delta ' + asset.dir
  }, asset.delta, " \xB7 24h")), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-chart"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 800 220",
    preserveAspectRatio: "none",
    width: "100%",
    height: "160"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: 'dg-' + asset.id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: lineColor,
    stopOpacity: "0.3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: lineColor,
    stopOpacity: "0.07"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#0E1E3A",
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: 'eg-' + asset.id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: lineColor,
    stopOpacity: "0.1"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: lineColor,
    stopOpacity: "0"
  }))), [30, 80, 130, 180].map(y => /*#__PURE__*/React.createElement("line", {
    key: y,
    x1: "0",
    y1: y,
    x2: "800",
    y2: y,
    stroke: "rgba(255,255,255,0.05)",
    strokeWidth: "0.5"
  })), /*#__PURE__*/React.createElement("path", {
    d: echoFill,
    fill: `url(#eg-${asset.id})`
  }), /*#__PURE__*/React.createElement("path", {
    d: echoPath,
    stroke: lineColor,
    strokeWidth: "0.8",
    fill: "none",
    strokeLinejoin: "round",
    strokeLinecap: "round",
    opacity: "0.25"
  }), /*#__PURE__*/React.createElement("path", {
    d: fillPath,
    fill: `url(#dg-${asset.id})`
  }), /*#__PURE__*/React.createElement("path", {
    d: mainPath,
    stroke: lineColor,
    strokeWidth: "1.75",
    fill: "none",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "800",
    cy: parseInt(mainPath.split(' ').pop().split(',')[1]),
    r: "3.5",
    fill: lineColor
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "800",
    cy: parseInt(mainPath.split(' ').pop().split(',')[1]),
    r: "1.4",
    fill: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-chart-legend"
  }, /*#__PURE__*/React.createElement("span", null, "\u2500 N00 \xB7 30d"), /*#__PURE__*/React.createElement("span", null, "\u2500 N15 \xB7 15d"), /*#__PURE__*/React.createElement("span", null, "\u2500 N30 \xB7 hoje"))), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-metrics"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mlabel"
  }, "LIQ"), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mval"
  }, asset.liq)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mlabel"
  }, "VOL-24H"), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mval"
  }, asset.vol)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mlabel"
  }, "SPREAD"), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mval"
  }, "0,72%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mlabel"
  }, "RWA-SCORE"), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-mval"
  }, "A+"))), /*#__PURE__*/React.createElement("div", {
    className: "vm-detail-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "vm-btn-primary"
  }, "Abrir no terminal"), /*#__PURE__*/React.createElement("button", {
    className: "vm-btn-ghost-dark"
  }, "Copiar endpoint \u2192")));
}

// ═══════════ TICKER RAIL ═══════════
function TickerRail() {
  const items = [{
    t: 'CLR-IMOVEL-SP01',
    p: '487,20',
    d: '+2,4%',
    dir: 'up'
  }, {
    t: 'CLR-OURO-001',
    p: '932,55',
    d: '-0,8%',
    dir: 'down'
  }, {
    t: 'CLR-ART-0047',
    p: '12.400',
    d: '+5,1%',
    dir: 'up'
  }, {
    t: 'CLR-IMOVEL-RJ02',
    p: '218,40',
    d: '+0,6%',
    dir: 'up'
  }, {
    t: 'CLR-RECEB-088',
    p: '102,15',
    d: '-0,2%',
    dir: 'down'
  }, {
    t: 'CLR-SOJA-004',
    p: '74,80',
    d: '+1,8%',
    dir: 'up'
  }, {
    t: 'IDX-RWA-BR',
    p: '1.084,5',
    d: '+0,9%',
    dir: 'up'
  }];
  const loop = [...items, ...items];
  return /*#__PURE__*/React.createElement("div", {
    className: "vm-ticker-rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vm-ticker-label"
  }, "live \xB7 on-chain"), /*#__PURE__*/React.createElement("div", {
    className: "vm-ticker-track"
  }, loop.map((it, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "vm-ticker-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "vm-ticker-t"
  }, it.t), /*#__PURE__*/React.createElement("span", {
    className: "vm-ticker-p"
  }, it.p), /*#__PURE__*/React.createElement("span", {
    className: 'vm-ticker-d ' + it.dir
  }, it.d)))));
}
Object.assign(window, {
  TopBar,
  Sidebar,
  CommandBar,
  StatGrid,
  AssetList,
  DetailPanel,
  TickerRail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/valumaris-platform/components.jsx", error: String((e && e.message) || e) }); }

})();
