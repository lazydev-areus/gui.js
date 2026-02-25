/**
 * Created by lazydev-areus
 * Source: https://raw.githubusercontent.com/lazydev-areus/gui.js/refs/heads/main/gui.js
 * Repo: https://github.com/lazydev-areus/gui.js/blob/main/gui.js
 */
(function() {
  // State
  const state = {
    config: {
      position: 'top-right',
      duration: 3000,
      maxVisible: 5,
      theme: 'light'
    },
    themes: {
      light: {
        toastBg: 'rgba(255,255,255,0.9)',
        toastColor: '#333',
        toastBoxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        toastSuccessIcon: '#10b981',
        toastErrorIcon: '#ef4444',
        toastWarningIcon: '#f59e0b',
        toastInfoIcon: '#3b82f6',
        modalBg: 'rgba(255,255,255,0.95)',
        modalColor: '#333',
        modalBackdrop: 'rgba(0,0,0,0.4)',
        modalBoxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        modalBorder: 'rgba(0,0,0,0.05)',
        glassmorphism: true
      },
      dark: {
        toastBg: 'rgba(31,41,55,0.9)',
        toastColor: '#f9fafb',
        toastBoxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        toastSuccessIcon: '#10b981',
        toastErrorIcon: '#ef4444',
        toastWarningIcon: '#f59e0b',
        toastInfoIcon: '#3b82f6',
        modalBg: 'rgba(31,41,55,0.95)',
        modalColor: '#f9fafb',
        modalBackdrop: 'rgba(0,0,0,0.6)',
        modalBoxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        modalBorder: 'rgba(255,255,255,0.1)',
        glassmorphism: true
      }
    }
  };

  const REQUIRED_THEME_KEYS = [
    'toastBg',
    'toastColor',
    'toastBoxShadow',
    'toastSuccessIcon',
    'toastErrorIcon',
    'toastWarningIcon',
    'toastInfoIcon',
    'modalBg',
    'modalColor',
    'modalBackdrop',
    'modalBoxShadow',
    'modalBorder',
    'glassmorphism'
  ];

  // Sanitize HTML
  function _sanitize(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const wrapper = document.createElement('div');
    function clean(node) {
      const allowed = [
        'b', 'i', 'u', 'strong', 'em', 'a', 'p', 'br',
        'span', 'ul', 'ol', 'li',
        'code', 'pre',
        'small', 'mark',
        'h3', 'h4', 'h5', 'h6'
      ];
      if (node.nodeType === 1) {
        if (!allowed.includes(node.tagName.toLowerCase())) return null;
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
          if (attr.name.startsWith('on')) {
            node.removeAttribute(attr.name);
            return;
          }
          if (attr.name === 'href') {
            const v = attr.value.toLowerCase().trim();
            if (v.startsWith('javascript:') || v.startsWith('data:') || v.startsWith('vbscript:')) {
              node.removeAttribute(attr.name);
            }
            return;
          }
          if (attr.name === 'src') {
            node.removeAttribute(attr.name);
          }
        });
        const children = Array.from(node.childNodes);
        node.innerHTML = '';
        children.forEach(child => {
          const cleaned = clean(child);
          if (cleaned) node.appendChild(cleaned);
        });
        return node;
      } else if (node.nodeType === 3) {
        return node;
      }
      return null;
    }
    Array.from(doc.body.childNodes).forEach(child => {
      const cleaned = clean(child);
      if (cleaned) wrapper.appendChild(cleaned);
    });
    return wrapper.innerHTML;
  }

  // Inject CSS
  const css = `
    :root {
      --gui-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --gui-line-height: 1.5;
      --gui-letter-spacing: 0.025em;
      --gui-toast-bg: rgba(255,255,255,0.9);
      --gui-toast-color: #333;
      --gui-toast-border-radius: 12px;
      --gui-toast-box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      --gui-toast-min-width: 300px;
      --gui-toast-max-width: 420px;
      --gui-toast-padding: 16px;
      --gui-toast-gap: 12px;
      --gui-toast-success-icon: #10b981;
      --gui-toast-error-icon: #ef4444;
      --gui-toast-warning-icon: #f59e0b;
      --gui-toast-info-icon: #3b82f6;
      --gui-toast-progress-bg: #e5e7eb;
      --gui-modal-bg: rgba(255,255,255,0.95);
      --gui-modal-color: #333;
      --gui-modal-backdrop: rgba(0,0,0,0.4);
      --gui-modal-border-radius: 16px;
      --gui-modal-box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      --gui-modal-padding: 24px;
      --gui-modal-max-width: 500px;
      --gui-modal-animation-duration: 0.3s;
      --gui-modal-border: rgba(0,0,0,0.05);
      --gui-modal-backdrop-filter: blur(8px);
    }
    .gui-toast,
    .gui-modal,
    .gui-modal-backdrop,
    .gui-toast-container,
    .gui-modal-header,
    .gui-modal-title,
    .gui-modal-body,
    .gui-modal-footer,
    .gui-modal-button,
    .gui-modal-form-field,
    .gui-modal-error,
    .gui-modal-drag-handle,
    .gui-checkbox,
    .gui-checkbox-mark {
      box-sizing: border-box !important;
    }
    * {
      font-family: var(--gui-font-family);
      line-height: var(--gui-line-height);
      letter-spacing: var(--gui-letter-spacing);
    }
    .gui-toast-container {
      position: fixed;
      z-index: 999999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-end;
    }
    .gui-toast-container.top-right { top: 20px; right: 20px; }
    .gui-toast-container.top-left { top: 20px; left: 20px; align-items: flex-start; }
    .gui-toast-container.top-center { top: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
    .gui-toast-container.bottom-right { bottom: 20px; right: 20px; }
    .gui-toast-container.bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }
    .gui-toast-container.bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
    .gui-toast-container:hover .gui-toast:nth-child(1) { transform: translate3d(0, 0, 0) scale(1) !important; opacity: 1 !important; }
    .gui-toast-container:hover .gui-toast:nth-child(2) { transform: translate3d(0, 70px, 0) scale(1) !important; opacity: 1 !important; }
    .gui-toast-container:hover .gui-toast:nth-child(3) { transform: translate3d(0, 140px, 0) scale(1) !important; opacity: 1 !important; }
    .gui-toast-container:hover .gui-toast:nth-child(4) { transform: translate3d(0, 210px, 0) scale(1) !important; opacity: 1 !important; }
    .gui-toast-container:hover .gui-toast:nth-child(5) { transform: translate3d(0, 280px, 0) scale(1) !important; opacity: 1 !important; }
    .gui-toast {
      background: var(--gui-toast-bg);
      color: var(--gui-toast-color);
      border-radius: var(--gui-toast-border-radius);
      box-shadow: var(--gui-toast-box-shadow);
      backdrop-filter: blur(8px);
      min-width: var(--gui-toast-min-width);
      max-width: calc(100vw - 32px);
      padding: var(--gui-toast-padding);
      display: flex;
      align-items: center;
      gap: var(--gui-toast-gap);
      pointer-events: auto;
      position: absolute;
      overflow: hidden;
      transform: translate3d(100%, 0, 0);
      opacity: 0;
      transition: transform var(--gui-modal-animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1), opacity var(--gui-modal-animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .gui-toast.success .gui-toast-icon { color: var(--gui-toast-success-icon); }
    .gui-toast.error .gui-toast-icon { color: var(--gui-toast-error-icon); }
    .gui-toast.warning .gui-toast-icon { color: var(--gui-toast-warning-icon); }
    .gui-toast.info .gui-toast-icon { color: var(--gui-toast-info-icon); }
    .gui-toast-icon { flex-shrink: 0; }
    .gui-toast-message { flex: 1; }
    .gui-toast-close { cursor: pointer; flex-shrink: 0; font-size: 20px; line-height: 1; }
    .gui-toast-action { margin-left: 8px; padding: 4px 8px; border: none; border-radius: 4px; background: rgba(255,255,255,0.2); color: inherit; cursor: pointer; font-size: 12px; transition: background 0.2s; }
    .gui-toast-action:hover { background: rgba(255,255,255,0.3); }
    .gui-toast-progress { position: absolute; bottom: 0; left: 0; height: 2px; background: var(--gui-toast-progress-bg); width: 100%; }
    .gui-toast-progress-bar { height: 100%; background: currentColor; width: 100%; transition: width linear; }
    .gui-toast-progress-bar.grow { width: 0%; }
    .gui-toast-rich { display: flex; flex-direction: column; gap: 2px; }
    .gui-toast-rich-title { font-weight: 600; }
    .gui-toast-rich-description { opacity: 0.7; font-size: 0.875em; }
    .gui-toast.enter.active { transform: translateX(0) translateY(0); opacity: 1; }
    .gui-toast.exit.active { transform: translateX(-100%) translateY(0); opacity: 0; }
    .gui-toast.shift { transform: translateX(0) translateY(-60px); }
    .gui-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--gui-modal-backdrop);
      backdrop-filter: var(--gui-modal-backdrop-filter);
      z-index: 1000000;
      opacity: 0;
      transition: opacity var(--gui-modal-animation-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    .gui-modal-backdrop.active { opacity: 1; }
    .gui-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) translateY(20px) scale(0.96);
      background: var(--gui-modal-bg);
      color: var(--gui-modal-color);
      border-radius: var(--gui-modal-border-radius);
      box-shadow: var(--gui-modal-shadow);
      backdrop-filter: blur(8px);
      padding: var(--gui-modal-padding);
      max-width: calc(100vw - 32px);
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      opacity: 0;
      transition: all var(--gui-modal-animation-duration) cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 1000001;
      pointer-events: auto;
      padding-bottom: calc(24px + env(safe-area-inset-bottom));
    }
    .gui-modal.active { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
    .gui-modal-header { margin-bottom: 16px; border-bottom: 1px solid var(--gui-modal-border); padding-bottom: 16px; }
    .gui-modal-title { font-size: 1.25rem; font-weight: bold; margin: 0; }
    .gui-modal-body { margin-bottom: 24px; }
    .gui-modal-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--gui-modal-border); padding-top: 16px; }
    .gui-modal-button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #e5e7eb;
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    .gui-modal-button:active { transform: scale(0.95); }
    .gui-modal-button.primary { background: #007bff; color: white; }
    .gui-modal-button.primary:hover { background: #0056b3; }
    .gui-modal-form-field { margin-bottom: 16px; }
    .gui-modal-form-field label { display: block; margin-bottom: 4px; font-weight: bold; }
    .gui-modal-form-field input, .gui-modal-form-field select, .gui-modal-form-field textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      background: transparent;
    }
    .gui-modal-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: none;
    }
    .gui-modal-button.loading {
      pointer-events: none;
    }
    .gui-modal.mobile {
      position: fixed;
      top: auto;
      left: auto;
      bottom: 0;
      width: 100%;
      max-height: 80vh;
      transform: translateY(100%);
      border-radius: 16px 16px 0 0;
      padding-bottom: max(20px, env(safe-area-inset-bottom));
    }
    .gui-modal.mobile.active {
      transform: translateY(0);
    }
    .gui-modal-drag-handle {
      width: 40px;
      height: 4px;
      background: #ccc;
      border-radius: 2px;
      margin: 8px auto;
      cursor: grab;
    }
    .gui-checkbox {
      appearance: none;
      opacity: 0;
      position: absolute;
    }
    .gui-checkbox + .gui-checkbox-mark {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #ccc;
      border-radius: 6px;
      background: white;
      transition: all 0.2s;
      margin-right: 8px;
      vertical-align: middle;
    }
    .gui-checkbox:checked + .gui-checkbox-mark {
      background: #007bff;
      border-color: #007bff;
    }
    .gui-checkbox:checked + .gui-checkbox-mark::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 6px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    @media (max-width: 600px) {
      .gui-modal-form-field input, .gui-modal-form-field select, .gui-modal-form-field textarea {
        font-size: 16px;
      }
      .gui-checkbox-mark {
        width: 48px;
        height: 28px;
      }
      .gui-toast {
        width: calc(100% - 32px);
        max-width: none;
        left: 16px;
        right: 16px;
      }
    }

    @keyframes gui-ripple {
      to { transform: scale(2); opacity: 0; }
    }

    .gui-drawer {
      position: fixed;
      top: 0;
      right: 0;
      width: 380px;
      max-width: 90vw;
      height: 100%;
      background: var(--gui-modal-bg);
      color: var(--gui-modal-color);
      box-shadow: var(--gui-modal-shadow);
      backdrop-filter: blur(8px);
      z-index: 1000001;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
      display: flex;
      flex-direction: column;
      padding: 24px;
      overflow-y: auto;
      pointer-events: auto;
      padding-bottom: calc(24px + env(safe-area-inset-bottom));
    }
    .gui-drawer.left { left: 0; right: auto; transform: translateX(-100%); }
    .gui-drawer.active { transform: translateX(0); }
    .gui-drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--gui-modal-border);
      gap: 12px;
    }
    .gui-drawer-body { flex: 1; }
    .gui-drawer-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--gui-modal-border);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    @media (prefers-reduced-motion: reduce) {
      .gui-toast,
      .gui-modal,
      .gui-modal-backdrop,
      .gui-drawer {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Update styles function
  function updateStyles() {
    const vars = state.themes[state.config.theme];
    const host = _host?.style;
    // Toast vars on shadow host
    if (host) {
      host.setProperty('--gui-toast-bg', vars.toastBg);
      host.setProperty('--gui-toast-color', vars.toastColor);
      host.setProperty('--gui-toast-box-shadow', vars.toastBoxShadow);
      host.setProperty('--gui-toast-success-icon', vars.toastSuccessIcon);
      host.setProperty('--gui-toast-error-icon', vars.toastErrorIcon);
      host.setProperty('--gui-toast-warning-icon', vars.toastWarningIcon);
      host.setProperty('--gui-toast-info-icon', vars.toastInfoIcon);
      host.setProperty('--gui-toast-progress-bg', '#e5e7eb');
      host.setProperty('--gui-modal-backdrop-filter', vars.glassmorphism ? 'blur(10px)' : 'none');
      host.setProperty('--gui-toast-shadow', '0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.15), 0 16px 32px rgba(0,0,0,0.2)');
      host.setProperty('--gui-modal-shadow', '0 20px 40px rgba(0,0,0,0.15), 0 32px 64px rgba(0,0,0,0.2), 0 48px 96px rgba(0,0,0,0.25)');
    }
    // Modal vars on document root
    const root = document.documentElement.style;
    root.setProperty('--gui-modal-bg', vars.modalBg);
    root.setProperty('--gui-modal-color', vars.modalColor);
    root.setProperty('--gui-modal-backdrop', vars.modalBackdrop);
    root.setProperty('--gui-modal-box-shadow', vars.modalBoxShadow);
    root.setProperty('--gui-modal-border', vars.modalBorder);
    root.setProperty('--gui-modal-backdrop-filter', vars.glassmorphism ? 'blur(10px)' : 'none');
    // Update existing modals
    const modals = document.querySelectorAll('.gui-modal');
    modals.forEach(function(modal) {
      modal.style.backdropFilter = vars.glassmorphism ? 'blur(8px)' : 'none';
    });
  }

  // Apply theme
  function applyTheme(theme) {
    state.config.theme = theme;
    updateStyles();
  }

  // Container
  let _container;
  let _host;
  function getContainer() {
    if (!_container) {
      const isMobile = window.matchMedia('(max-width: 600px)').matches;
      const position = isMobile ? 'bottom-center' : state.config.position;
      _host = document.createElement('div');
      _host.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;';
      document.body.appendChild(_host);
      const _toastShadow = _host.attachShadow({mode: 'open'});
      _toastShadow.innerHTML = '<style>' + css + '</style>';
      _container = document.createElement('div');
      _container.className = 'gui-toast-container ' + position;
      _container.style.pointerEvents = 'auto';
      _toastShadow.appendChild(_container);
      // Event delegation
      _container.addEventListener('click', function(e) {
        if (e.target.matches('.gui-toast-close')) {
          e.stopPropagation();
          const id = e.target.closest('.gui-toast').id.replace('gui-toast-', '');
          dismissToast(+id);
        } else if (e.target.matches('.gui-toast-action')) {
          e.stopPropagation();
          const toastEl = e.target.closest('.gui-toast');
          const id = toastEl.id.replace('gui-toast-', '');
          const t = toasts.find(t => t.id == id);
          if (t && t.opts && t.opts.action) {
            t.opts.action.onClick();
          }
        }
      });
    }
    return _container;
  }

  // Toasts
  const toasts = [];
  const visibleToasts = [];
  let toastId = 0;

  // Icons
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
  };

  // Create toast
  function createToast(message, type, options) {
    const opts = Object.assign({
      duration: state.config.duration,
      closable: true,
      pauseOnHover: true,
      onClick: null,
      progressType: 'shrink',
      action: null
    }, options);
    const id = ++toastId;
    const children = [];
    if (type) {
      const iconEl = document.createElement('div');
      iconEl.className = 'gui-toast-icon';
      iconEl.innerHTML = icons[type];
      children.push(iconEl);
    }
    const messageEl = document.createElement('div');
    messageEl.className = 'gui-toast-message';
    children.push(messageEl);
    if (opts.action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'gui-toast-action';
      actionBtn.textContent = opts.action.text;
      children.push(actionBtn);
    }
    if (opts.closable) {
      const closeEl = document.createElement('div');
      closeEl.className = 'gui-toast-close';
      closeEl.innerHTML = icons.close;
      children.push(closeEl);
    }
    if (opts.duration > 0) {
      const progress = document.createElement('div');
      progress.className = 'gui-toast-progress';
      const bar = document.createElement('div');
      bar.className = 'gui-toast-progress-bar ' + opts.progressType;
      progress.appendChild(bar);
      children.push(progress);
    }
    const toast = document.createElement('div');
    toast.className = 'gui-toast ' + (type || '') + ' enter';
    toast.id = 'gui-toast-' + id;
    if (type === 'error' || type === 'warning') {
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
    } else {
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
    }
    children.forEach(function(child) { toast.appendChild(child); });
    if (opts.allowHTML) {
      messageEl.innerHTML = _sanitize(message);
    } else {
      messageEl.textContent = message;
    }
    if (opts.closable) {
      // Delegated
    }
    if (opts.action) {
      // Delegated
    }
    function _showCopiedTooltip(anchor) {
      const tooltip = document.createElement('div');
      tooltip.textContent = 'Copied!';
      Object.assign(tooltip.style, {
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        zIndex: '999999'
      });
      anchor.appendChild(tooltip);
      setTimeout(function() { tooltip.remove(); }, 2000);
    }
    if (opts.copyOnClick) {
      toast.onclick = function() {
        navigator.clipboard.writeText(message).then(function() {
          _showCopiedTooltip(toast);
        }).catch(function() {
          const textArea = document.createElement('textarea');
          textArea.value = message;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          _showCopiedTooltip(toast);
        });
      };
    } else if (opts.onClick) {
      toast.onclick = opts.onClick;
    }
    if (opts.pauseOnHover && opts.duration > 0) {
      toast.onmouseenter = function() { pauseToast(id); };
      toast.onmouseleave = function() { resumeToast(id); };
    }
    // Mobile drag-to-dismiss
    let startX = 0, currentX = 0, isDragging = false;
    toast.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    toast.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (diff > 0) {
        const translateX = 100 + diff;
        const opacity = Math.max(0.5, 1 - diff / toast.offsetWidth);
        toast.style.transform = `translate3d(${translateX}px, 0, 0)`;
        toast.style.opacity = opacity;
      }
    });
    toast.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      if (diff > toast.offsetWidth * 0.3) {
        toast.style.transform = 'translate3d(200%, 0, 0)';
        toast.style.opacity = 0;
        setTimeout(function() { dismissToast(id); }, 300);
      } else {
        toast.style.transform = '';
        toast.style.opacity = '';
      }
    });
    getContainer().appendChild(toast);
    setTimeout(function() { toast.classList.add('active'); }, 10);
    const t = { id: id, element: toast, duration: opts.duration, paused: false, startTime: Date.now(), timer: null, progressType: opts.progressType, visible: false, opts: opts };
    toasts.push(t);
    if (opts.duration > 0) {
      animateProgress(t);
      scheduleDismiss(t, opts.duration);
    }
    showToasts();
    return id;
  }

  function createRichToast(options) {
    const opts = Object.assign({
      title: '',
      description: '',
      icon: '',
      type: 'info',
      duration: state.config.duration,
      closable: true,
      pauseOnHover: true,
      progressType: 'shrink',
      action: null,
      allowHTML: false
    }, options);
    const id = ++toastId;

    const children = [];

    const iconEl = document.createElement('div');
    iconEl.className = 'gui-toast-icon';
    if (opts.icon) {
      iconEl.textContent = String(opts.icon);
    } else if (opts.type) {
      iconEl.innerHTML = icons[opts.type] || '';
    }
    children.push(iconEl);

    const messageEl = document.createElement('div');
    messageEl.className = 'gui-toast-message gui-toast-rich';
    const titleEl = document.createElement('div');
    titleEl.className = 'gui-toast-rich-title';
    titleEl.textContent = opts.title;
    messageEl.appendChild(titleEl);
    if (opts.description) {
      const descEl = document.createElement('div');
      descEl.className = 'gui-toast-rich-description';
      if (opts.allowHTML) {
        descEl.innerHTML = _sanitize(String(opts.description));
      } else {
        descEl.textContent = String(opts.description);
      }
      messageEl.appendChild(descEl);
    }
    children.push(messageEl);

    if (opts.action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'gui-toast-action';
      actionBtn.textContent = opts.action.text;
      children.push(actionBtn);
    }
    if (opts.closable) {
      const closeEl = document.createElement('div');
      closeEl.className = 'gui-toast-close';
      closeEl.innerHTML = icons.close;
      children.push(closeEl);
    }
    if (opts.duration > 0) {
      const progress = document.createElement('div');
      progress.className = 'gui-toast-progress';
      const bar = document.createElement('div');
      bar.className = 'gui-toast-progress-bar ' + opts.progressType;
      progress.appendChild(bar);
      children.push(progress);
    }

    const toast = document.createElement('div');
    toast.className = 'gui-toast ' + (opts.type || '') + ' enter';
    toast.id = 'gui-toast-' + id;
    if (opts.type === 'error' || opts.type === 'warning') {
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
    } else {
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
    }
    children.forEach(function(child) { toast.appendChild(child); });

    if (opts.pauseOnHover && opts.duration > 0) {
      toast.onmouseenter = function() { pauseToast(id); };
      toast.onmouseleave = function() { resumeToast(id); };
    }

    getContainer().appendChild(toast);
    setTimeout(function() { toast.classList.add('active'); }, 10);
    const t = { id: id, element: toast, duration: opts.duration, paused: false, startTime: Date.now(), timer: null, progressType: opts.progressType, visible: false, opts: opts };
    toasts.push(t);
    if (opts.duration > 0) {
      animateProgress(t);
      scheduleDismiss(t, opts.duration);
    }
    showToasts();
    return id;
  }

  // Show toasts with Sonner-style stacking
  function showToasts() {
    const notVisible = toasts.filter(t => !t.visible);
    const slots = state.config.maxVisible - visibleToasts.length;
    notVisible.slice(0, slots).forEach(function(t) {
      visibleToasts.push(t);
      t.visible = true;
      t.element.style.position = 'absolute';
    });

    while (visibleToasts.length > state.config.maxVisible) {
      dismissToast(visibleToasts[0].id);
    }

    requestAnimationFrame(function() {
      setTimeout(applyStacking, 10);
    });
  }

  // Apply Sonner-style stacking
  function applyStacking() {
    visibleToasts.forEach(function(vt, idx) {
      const scale = Math.max(0.8, 1 - idx * 0.1);
      const opacity = Math.max(0.6, 1 - idx * 0.2);
      const translateY = idx * 70;
      const translateZ = -idx * 10;
      vt.element.style.transform = `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`;
      vt.element.style.opacity = opacity;
    });
  }

  // Dismiss
  function dismissToast(id) {
    const index = toasts.findIndex(t => t.id === id);
    if (index === -1) return;
    const t = toasts[index];
    clearTimeout(t.timer);
    t.visible = false;
    t.element.style.transform = 'translate3d(-100%, 0, 0) scale(0.9)';
    t.element.style.opacity = '0';
    setTimeout(function() {
      t.element.remove();
      toasts.splice(index, 1);
      visibleToasts.splice(visibleToasts.indexOf(t), 1);
      // Re-apply stacking to remaining
      applyStacking();
    }, 300);
  }

  function showDrawer(options) {
    const opts = Object.assign({
      title: '',
      content: '',
      position: 'right',
      width: '380px',
      buttons: [],
      closable: true,
      allowHTML: false
    }, options);

    const id = ++modalId;
    const zIndex = 1000000 + modalStack.length * 2;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'gui-modal-backdrop';
    modalBackdrop.style.zIndex = zIndex;
    document.body.appendChild(modalBackdrop);

    const drawer = document.createElement('div');
    drawer.className = 'gui-drawer' + (opts.position === 'left' ? ' left' : '');
    drawer.style.zIndex = zIndex + 1;
    drawer.style.width = opts.width || '380px';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');

    const header = document.createElement('div');
    header.className = 'gui-drawer-header';
    if (opts.title) {
      const titleEl = document.createElement('h2');
      titleEl.className = 'gui-modal-title';
      titleEl.id = 'gui-drawer-title-' + id;
      titleEl.textContent = opts.title;
      drawer.setAttribute('aria-labelledby', titleEl.id);
      header.appendChild(titleEl);
    }
    if (opts.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'gui-modal-button';
      closeBtn.textContent = 'Close';
      closeBtn.onclick = function() { closeModal(id); };
      header.appendChild(closeBtn);
    }
    drawer.appendChild(header);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'gui-drawer-body';
    if (typeof opts.content === 'string') {
      if (opts.allowHTML) {
        bodyEl.innerHTML = _sanitize(opts.content);
      } else {
        bodyEl.textContent = opts.content;
      }
    } else if (opts.content) {
      bodyEl.appendChild(opts.content);
    }
    drawer.appendChild(bodyEl);

    const footer = document.createElement('div');
    footer.className = 'gui-drawer-footer';
    opts.buttons.forEach(function(btn) {
      const button = document.createElement('button');
      button.className = 'gui-modal-button' + (btn.primary ? ' primary' : '');
      button.textContent = btn.text;
      button.onclick = async function(e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${e.clientX - rect.left - size / 2}px;
          top: ${e.clientY - rect.top - size / 2}px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: gui-ripple 0.4s ease-out;
          pointer-events: none;
        `;
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 400);

        if (btn.action) {
          let result = btn.action();
          if (result instanceof Promise) {
            button.classList.add('loading');
            button.style.pointerEvents = 'none';
            try {
              result = await result;
            } finally {
              button.classList.remove('loading');
              button.style.pointerEvents = '';
            }
          }
          if (result !== false) {
            closeModal(id);
          }
        } else {
          closeModal(id);
        }
      };
      footer.appendChild(button);
    });
    if (opts.buttons && opts.buttons.length) {
      drawer.appendChild(footer);
    }

    modalStack.forEach(function(m) {
      m.element.style.opacity = '0.6';
      m.element.style.pointerEvents = 'none';
    });
    drawer.style.opacity = '1';
    drawer.style.pointerEvents = 'auto';

    document.body.appendChild(drawer);
    if (modalStack.length === 0) {
      document.body.style.overflow = 'hidden';
    }

    function handleKey(e) {
      if (e.key === 'Escape' && opts.closable && modalStack[modalStack.length - 1].id === id) {
        closeModal(id);
      }
    }
    document.addEventListener('keydown', handleKey);
    if (opts.closable) {
      modalBackdrop.onclick = function() { closeModal(id); };
    }

    modalStack.push({
      id: id,
      element: drawer,
      backdrop: modalBackdrop,
      handleKey: handleKey,
      closable: opts.closable,
      form: null
    });

    setTimeout(function() {
      modalBackdrop.classList.add('active');
      drawer.classList.add('active');
    }, 10);

    return id;
  }

  // Schedule dismiss
  function scheduleDismiss(t, duration) {
    t.timer = setTimeout(function() { dismissToast(t.id); }, duration);
  }

  // Pause resume
  function pauseToast(id) {
    const t = toasts.find(t => t.id === id);
    if (!t || t.paused) return;
    t.paused = true;
    clearTimeout(t.timer);
    const progressBar = t.element.querySelector('.gui-toast-progress-bar');
    if (progressBar) {
      progressBar.style.animationPlayState = 'paused';
    }
  }
  function resumeToast(id) {
    const t = toasts.find(t => t.id === id);
    if (!t || !t.paused) return;
    t.paused = false;
    const elapsed = Date.now() - t.startTime;
    const remaining = t.duration - elapsed;
    if (remaining > 0) {
      scheduleDismiss(t, remaining);
      const progressBar = t.element.querySelector('.gui-toast-progress-bar');
      if (progressBar) {
        progressBar.style.animationPlayState = 'running';
      }
    } else {
      dismissToast(id);
    }
  }

  // Animate progress
  function animateProgress(t) {
    const progressBar = t.element.querySelector('.gui-toast-progress-bar');
    if (progressBar) {
      progressBar.style.transitionDuration = (t.duration / 1000) + 's';
      if (t.progressType === 'grow') {
        progressBar.style.width = '0%';
        setTimeout(function() { progressBar.style.width = '100%'; }, 10);
      } else {
        setTimeout(function() { progressBar.style.width = '0%'; }, 10);
      }
    }
  }

  // Modal stack
  const modalStack = [];
  let modalId = 0;

  function showModal(options) {
    const opts = Object.assign({
      title: '',
      content: '',
      form: null,
      buttons: [],
      closable: true,
      allowHTML: false
    }, options);
    const id = ++modalId;
    const zIndex = 1000000 + modalStack.length * 2;

    // Check if mobile
    const isMobile = window.matchMedia('(max-width: 600px)').matches;

    // Backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'gui-modal-backdrop';
    modalBackdrop.style.zIndex = zIndex;
    document.body.appendChild(modalBackdrop);

    // Modal
    const currentModal = document.createElement('div');
    currentModal.className = 'gui-modal';
    if (isMobile) {
      currentModal.classList.add('mobile');
    }
    currentModal.style.zIndex = zIndex + 1;
    currentModal.setAttribute('role', 'dialog');
    currentModal.setAttribute('aria-modal', 'true');
    if (opts.title) {
      currentModal.setAttribute('aria-labelledby', 'gui-modal-title-' + id);
    }

    // Create body
    const bodyEl = document.createElement('div');
    bodyEl.className = 'gui-modal-body';
    currentModal.appendChild(bodyEl);

    // Create header if title
    if (opts.title) {
      const header = document.createElement('div');
      header.className = 'gui-modal-header';
      const titleEl = document.createElement('h2');
      titleEl.className = 'gui-modal-title';
      titleEl.id = 'gui-modal-title-' + id;
      if (typeof opts.title === 'string') {
        titleEl.textContent = opts.title;
      } else {
        titleEl.appendChild(opts.title);
      }
      header.appendChild(titleEl);
      if (isMobile) {
        const dragHandle = document.createElement('div');
        dragHandle.className = 'gui-modal-drag-handle';
        currentModal.appendChild(dragHandle);
      }
      currentModal.appendChild(header);
    } else if (isMobile) {
      const dragHandle = document.createElement('div');
      dragHandle.className = 'gui-modal-drag-handle';
      currentModal.appendChild(dragHandle);
    }
    if (opts.form) {
      opts.form.forEach(function(field, index) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'gui-modal-form-field';
        const label = document.createElement('label');
        label.textContent = field.label;
        let input;
        if (field.type === 'select') {
          input = document.createElement('select');
          input.name = field.name;
          if (field.options) {
            field.options.forEach(function(opt) {
              const option = document.createElement('option');
              option.value = opt.value || opt.label;
              option.textContent = opt.label;
              input.appendChild(option);
            });
          }
        } else if (field.type === 'textarea') {
          input = document.createElement('textarea');
          input.name = field.name;
          input.value = field.defaultValue || '';
        } else {
          input = document.createElement('input');
          input.type = field.type || 'text';
          input.name = field.name;
          input.value = field.defaultValue || '';
          if (field.type === 'checkbox') {
            input.checked = field.checked || false;
          }
        }
        if (field.required) input.required = true;
        if (field.maxLength) input.maxLength = field.maxLength;
        input.dataset.fieldIndex = index.toString();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'gui-modal-error';
        if (field.type === 'checkbox') {
          input.classList.add('gui-checkbox');
          const mark = document.createElement('span');
          mark.className = 'gui-checkbox-mark';
          label.appendChild(input);
          label.appendChild(mark);
          fieldDiv.appendChild(label);
        } else {
          fieldDiv.appendChild(label);
          fieldDiv.appendChild(input);
        }
        fieldDiv.appendChild(errorDiv);
        bodyEl.appendChild(fieldDiv);
      });
    } else if (typeof opts.content === 'string') {
      if (opts.allowHTML) {
        bodyEl.innerHTML = _sanitize(opts.content);
      } else {
        bodyEl.textContent = opts.content;
      }
    } else {
      bodyEl.appendChild(opts.content);
    }

    const footer = document.createElement('div');
    footer.className = 'gui-modal-footer';
    opts.buttons.forEach(function(btn) {
      const button = document.createElement('button');
      button.className = 'gui-modal-button' + (btn.primary ? ' primary' : '');
      button.textContent = btn.text;
      button.onclick = async function(e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${e.clientX - rect.left - size / 2}px;
          top: ${e.clientY - rect.top - size / 2}px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: gui-ripple 0.4s ease-out;
          pointer-events: none;
        `;
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 400);
        if (btn.action) {
          let result = btn.action();
          if (result instanceof Promise) {
            button.classList.add('loading');
            button.innerHTML = '<svg class="gui-spinner" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4" stroke-dashoffset="31.4"><animate attributeName="stroke-dashoffset" values="31.4;0" dur="1s" repeatCount="indefinite"/></circle></svg>';
            button.style.pointerEvents = 'none';
            try {
              result = await result;
            } finally {
              button.classList.remove('loading');
              button.innerHTML = btn.text;
              button.style.pointerEvents = '';
            }
          }
          if (result !== false) {
            closeModal(id);
          }
        } else {
          closeModal(id);
        }
      };
      footer.appendChild(button);
    });
    currentModal.appendChild(footer);

    // Smart stacking
    modalStack.forEach(function(m) {
      m.element.style.opacity = '0.6';
      m.element.style.pointerEvents = 'none';
    });
    currentModal.style.opacity = '1';
    currentModal.style.pointerEvents = 'auto';

    document.body.appendChild(currentModal);

    // Scroll lock
    if (modalStack.length === 0) {
      document.body.style.overflow = 'hidden';
    }

    // Animate
    setTimeout(function() {
      modalBackdrop.classList.add('active');
      currentModal.classList.add('active');
    }, 10);

    // Focus management
    const focusableElements = currentModal.querySelectorAll('button, input, select, textarea');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    if (firstFocusable) firstFocusable.focus();

    function handleKey(e) {
      if (e.key === 'Escape' && opts.closable && modalStack[modalStack.length - 1].id === id) {
        closeModal(id);
      } else if (e.key === 'Enter') {
        const primaryBtn = currentModal.querySelector('.gui-modal-button.primary');
        if (primaryBtn) {
          primaryBtn.click();
          e.preventDefault();
        }
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKey);

    // Backdrop click
    if (opts.closable) {
      modalBackdrop.onclick = function() { closeModal(id); };
    }

    // Push to stack
    modalStack.push({
      id: id,
      element: currentModal,
      backdrop: modalBackdrop,
      handleKey: handleKey,
      closable: opts.closable,
      form: opts.form
    });

    return id;
  }

  // Close modal
  function closeModal(id) {
    const index = modalStack.findIndex(m => m.id === id);
    if (index === -1) return;
    const modal = modalStack[index];
    modal.backdrop.classList.remove('active');
    modal.element.classList.remove('active');
    setTimeout(function() {
      document.removeEventListener('keydown', modal.handleKey);
      modal.backdrop.remove();
      modal.element.remove();
      modalStack.splice(index, 1);
      // Restore stacking
      modalStack.forEach(function(m) {
        m.element.style.opacity = '';
        m.element.style.pointerEvents = '';
      });
      if (modalStack.length === 0) {
        document.body.style.overflow = '';
      }
    }, 300);
  }

  // Collect form data
  function collectFormData(modal) {
    const data = {};
    const inputs = modal.element.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      data[input.name] = input.type === 'checkbox' ? input.checked : input.value;
    });
    return data;
  }

  // Validate form
  function validateForm(modal) {
    let hasErrors = false;
    const inputs = modal.element.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      const index = parseInt(input.dataset.fieldIndex);
      const field = modal.form[index];
      const errorDiv = input.parentElement.querySelector('.gui-modal-error');
      let msg = '';
      if (field.required && (input.type === 'checkbox' ? !input.checked : !input.value.trim())) {
        msg = field.requiredMessage || 'This field is required';
      } else if (field.validation) {
        msg = field.validation(input.value);
      }
      if (msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        hasErrors = true;
      } else {
        errorDiv.style.display = 'none';
      }
    });
    return !hasErrors;
  }

  // GUI
  const GUI = {};
  GUI.registerTheme = function(name, theme) {
    if (!name || typeof name !== 'string') return;
    if (!theme || typeof theme !== 'object') return;
    const missing = REQUIRED_THEME_KEYS.filter(function(k) { return theme[k] === undefined; });
    if (missing.length) {
      console.warn('GUI.registerTheme: missing theme keys:', missing);
      return;
    }
    state.themes[name] = Object.assign({}, theme);
  };
  GUI.setTheme = function(theme) {
    if (state.themes[theme]) {
      applyTheme(theme);
    }
  };
  GUI.toast = function(message, options) {
    return createToast(message, '', options);
  };
  GUI.toast.success = function(message, options) { return createToast(message, 'success', options); };
  GUI.toast.error = function(message, options) { return createToast(message, 'error', options); };
  GUI.toast.warning = function(message, options) { return createToast(message, 'warning', options); };
  GUI.toast.info = function(message, options) { return createToast(message, 'info', options); };
  GUI.toast.rich = function(options) {
    return createRichToast(options);
  };
  GUI.toast.setProgress = function(id, percent) {
    const t = toasts.find(function(t) { return t.id === id; });
    if (!t) return;
    let progressEl = t.element.querySelector('.gui-toast-progress');
    if (!progressEl) {
      progressEl = document.createElement('div');
      progressEl.className = 'gui-toast-progress';
      const bar = document.createElement('div');
      bar.className = 'gui-toast-progress-bar grow';
      progressEl.appendChild(bar);
      t.element.appendChild(progressEl);
    }
    const bar = progressEl.querySelector('.gui-toast-progress-bar');
    if (bar) {
      bar.style.transition = 'width 0.2s ease';
      bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    }
  };
  GUI.toast.promise = function(promise, messages) {
    const loadingId = createToast(messages.loading || 'Loading...', 'info', { duration: 0 });
    promise.then(function(result) {
      GUI.toast.update(loadingId, {
        message: messages.success || 'Success!',
        type: 'success',
        duration: 3000
      });
    }).catch(function(error) {
      GUI.toast.update(loadingId, {
        message: messages.error || 'Error!',
        type: 'error',
        duration: 3000
      });
    });
  };
  GUI.toast.dismissAll = function() {
    toasts.slice().forEach(t => dismissToast(t.id));
  };
  GUI.toast.update = function(id, newOptions) {
    const t = toasts.find(t => t.id === id);
    if (!t || !t.visible) return;
    const opts = Object.assign({}, newOptions);
    // Update message
    if (opts.message !== undefined) {
      const messageEl = t.element.querySelector('.gui-toast-message');
      if (opts.allowHTML) {
        messageEl.innerHTML = _sanitize(opts.message);
      } else {
        messageEl.textContent = opts.message;
      }
    }
    // Update type
    if (opts.type !== undefined) {
      t.element.classList.remove('success', 'error', 'warning', 'info');
      if (opts.type) t.element.classList.add(opts.type);
      const iconEl = t.element.querySelector('.gui-toast-icon');
      if (iconEl) iconEl.innerHTML = icons[opts.type] || '';
    }
    // Update duration/progress
    if (opts.duration !== undefined) {
      t.duration = opts.duration;
      clearTimeout(t.timer);
      if (opts.duration > 0) {
        let progressEl = t.element.querySelector('.gui-toast-progress');
        if (!progressEl) {
          progressEl = document.createElement('div');
          progressEl.className = 'gui-toast-progress';
          const bar = document.createElement('div');
          bar.className = 'gui-toast-progress-bar ' + (t.progressType || 'shrink');
          progressEl.appendChild(bar);
          t.element.appendChild(progressEl);
        }
        t.startTime = Date.now();
        animateProgress(t);
        scheduleDismiss(t, opts.duration);
      }
    }
    if (opts.progress !== undefined) {
      const progressBar = t.element.querySelector('.gui-toast-progress-bar');
      if (progressBar) {
        progressBar.style.width = opts.progress + '%';
      }
    }
  };
  GUI.toast.config = function(opts) { if (opts) { state.config = Object.assign(state.config, opts); updateStyles(); } else { return state.config; } };
  GUI.init = function(opts) { state.config = Object.assign(state.config, opts); if (opts.position && _container) { _container.className = 'gui-toast-container ' + state.config.position; } updateStyles(); };

  GUI.modal = {};
  GUI.modal.alert = function(message, title) {
    showModal({
      title: title || 'Alert',
      content: message,
      buttons: [{ text: 'OK', action: function() { return true; }, primary: true }]
    });
  };
  GUI.modal.confirm = function(message, title) {
    return new Promise(function(resolve) {
      showModal({
        title: title || 'Confirm',
        content: message,
        buttons: [
          { text: 'Cancel', action: function() { resolve(false); return true; } },
          { text: 'OK', action: function() { resolve(true); return true; }, primary: true }
        ]
      });
    });
  };
  GUI.modal.prompt = function(message, defaultValue) {
    return new Promise(function(resolve) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = defaultValue || '';
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
      input.style.boxSizing = 'border-box';
      const contentDiv = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = message;
      contentDiv.appendChild(p);
      contentDiv.appendChild(input);
      showModal({
        title: 'Prompt',
        content: contentDiv,
        buttons: [
          { text: 'Cancel', action: function() { resolve(null); return true; } },
          { text: 'OK', action: function() { resolve(input.value); return true; }, primary: true }
        ]
      });
      setTimeout(function() { input.focus(); input.select(); }, 100);
    });
  };
  GUI.modal.show = function(options) {
    return new Promise(function(resolve) {
      const opts = Object.assign({}, options);
      const hasForm = opts.form && opts.form.length > 0;
      opts.buttons = opts.buttons || [];
      opts.buttons.forEach(function(btn) {
        const originalAction = btn.action;
        btn.action = async function() {
          if (originalAction) {
            if (hasForm && !validateForm(modalStack[modalStack.length - 1])) return false;
            const result = await originalAction();
            if (result !== false) {
              const data = hasForm ? collectFormData(modalStack[modalStack.length - 1]) : null;
              resolve(data);
            }
            return result;
          } else {
            if (hasForm && !validateForm(modalStack[modalStack.length - 1])) return false;
            const data = hasForm ? collectFormData(modalStack[modalStack.length - 1]) : null;
            resolve(data);
            return true;
          }
        };
      });
      showModal(opts);
    });
  };
  GUI.modal.drawer = function(options) {
    return new Promise(function(resolve) {
      const opts = Object.assign({}, options);
      opts.buttons = opts.buttons || [];
      opts.buttons.forEach(function(btn) {
        const originalAction = btn.action;
        btn.action = async function() {
          if (originalAction) {
            const result = await originalAction();
            if (result !== false) {
              resolve(true);
            }
            return result;
          }
          resolve(true);
          return true;
        };
      });
      showDrawer(opts);
    });
  };

  // Initialize theme
  applyTheme(state.config.theme);

  window.GUI = GUI;
})();
