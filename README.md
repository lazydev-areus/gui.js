# GUI.js

<p align="center">
  <img alt="Version" src="https://img.shields.io/github/v/release/lazydev-areus/gui.js?style=flat-square&color=6366f1" />
  <img alt="GitHub Stars" src="https://img.shields.io/github/stars/lazydev-areus/gui.js?style=flat-square&color=f59e0b" />
  <img alt="Zero dependencies" src="https://img.shields.io/badge/zero%20dependencies-10b981?style=flat-square" />
  <img alt="XSS safe" src="https://img.shields.io/badge/XSS%20safe-ef4444?style=flat-square" />
  <img alt="TypeScript ready" src="https://img.shields.io/badge/TypeScript%20ready-3b82f6?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-f59e0b?style=flat-square" />
</p>

<p align="center">
  A lightweight, zero-dependency UI library for toast
  notifications and modal dialogs — with built-in XSS
  protection, glassmorphism design, and smooth spring animations.
</p>

---

## Features

- 🍞 Toast notifications — success, error, warning, info, promise
- 🪟 Modal dialogs — alert, confirm, prompt, forms, nested
- 📚 Sonner-style stacking — stack and expand on hover
- 👆 Drag to dismiss — swipe on mobile
- 🔄 Reactive updates — update live toasts in place
- 🛡️ Built-in sanitizer — allowlist-based XSS protection
- 🌙 Dark / light themes — switchable at runtime
- 🔒 Shadow DOM isolation — styles never leak into your page
- 📘 TypeScript ready — ships with full .d.ts definitions
- ⚡ Zero dependencies — one script tag and done

## Installation

### CDN

```html
<script src="https://raw.githubusercontent.com/lazydev-areus/gui.js/refs/heads/main/gui.js"></script>
```

### Self-hosted

```html
<script src="/path/to/gui.js"></script>
```

If you use TypeScript, include `gui.d.ts` in your project.

## Quick start

```js
GUI.toast('Hello world');

GUI.toast.success('Saved successfully');
GUI.toast.error('Something went wrong');

GUI.toast('HTML (sanitized)', { allowHTML: true, duration: 5000 });

GUI.modal.alert('This is an alert');
GUI.modal.confirm('Are you sure?').then(ok => GUI.toast(ok ? 'Confirmed' : 'Cancelled'));
```

## Toast API

### Basic usage

```js
GUI.toast('Plain toast');
GUI.toast.success('Success');
GUI.toast.error('Error');
GUI.toast.warning('Warning');
GUI.toast.info('Info');
```

### Promise toast

```js
GUI.toast.promise(
  fetch('/api/save').then(r => {
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  }),
  {
    loading: 'Saving…',
    success: 'Saved!',
    error: 'Failed to save'
  }
);
```

### Update a live toast

```js
function simulateUpload() {
  const id = GUI.toast('Uploading file…', { duration: 0 });

  setTimeout(() => {
    GUI.toast.update(id, {
      message: 'Upload complete!',
      type: 'success',
      duration: 3000
    });
  }, 2000);
}
```

### Toast options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| duration | number | 3000 | Duration in ms. Use `0` for a persistent toast. |
| closable | boolean | true | Show a close button. |
| pauseOnHover | boolean | true | Pause the timer while hovering. |
| progressType | 'shrink' \| 'grow' | 'shrink' | Progress bar direction. |
| allowHTML | boolean | false | Render sanitized HTML instead of plain text. |
| copyOnClick | boolean | false | Copy the message to clipboard on click. |
| action | { text: string, onClick: function } | null | Action button configuration. |
| onClick | function | null | Click handler for the toast. |

### Toast utilities

```js
GUI.toast.dismissAll();

// Setter
GUI.toast.config({ position: 'bottom-right', maxVisible: 3, duration: 4000 });

// Getter
const current = GUI.toast.config();
console.log(current.position, current.duration, current.maxVisible, current.theme);
```

### Positions

top-right · top-left · top-center · bottom-right · bottom-left · bottom-center

## Modal API

### Alert

```js
GUI.modal.alert('Your session has expired', 'Authentication');
```

### Confirm

```js
GUI.modal.confirm('Delete this item?', 'Confirm').then(ok => {
  if (ok) GUI.toast.success('Deleted');
  else GUI.toast('Cancelled');
});
```

### Prompt

```js
GUI.modal.prompt('Your name', 'Ada Lovelace', 'Profile').then(value => {
  if (value) GUI.toast.success('Hello ' + value);
});
```

### Custom modal with form

```js
GUI.modal.show({
  title: 'Create account',
  form: [
    { label: 'Email', name: 'email', type: 'email', required: true },
    {
      label: 'Plan',
      name: 'plan',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' }
      ]
    }
  ],
  buttons: [
    { text: 'Cancel', action: () => true },
    { text: 'Create', primary: true, action: () => true }
  ]
}).then(data => {
  if (data) GUI.toast.success('Created: ' + data.email);
});
```

### Modal options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | string \| HTMLElement | '' | Modal title. |
| content | string \| HTMLElement | '' | Modal content. |
| form | FormField[] | null | Form schema to render inputs. |
| buttons | Button[] | [] | Footer buttons. |
| closable | boolean | true | Close on backdrop click / Escape. |
| allowHTML | boolean | false | Render sanitized HTML in string content. |

### FormField options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| label | string | — | Field label. |
| name | string | — | Field name used in the resolved data. |
| type | 'text' \| 'email' \| 'password' \| 'select' \| 'textarea' \| 'checkbox' | 'text' | Field type. |
| defaultValue | string | '' | Default value (when applicable). |
| required | boolean | false | Marks the field as required. |
| requiredMessage | string | 'This field is required' | Message used for required validation. |
| maxLength | number | — | Maximum length for text inputs. |
| options | { label: string, value: string }[] | — | Options for `select`. |
| validation | function(value: string): string \| null | — | Return a string to show an error, or `null` if valid. |

## Global config

```js
GUI.init({
  position: 'top-right', // 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
  duration: 3000,        // default toast duration in ms
  maxVisible: 5,         // max visible toasts at once
  theme: 'light'         // 'light' | 'dark'
});
```

### Themes

```js
GUI.setTheme('dark');
GUI.toast.config({ theme: 'light' });
```

## Security

GUI.js sanitizes HTML using an allowlist approach. When `allowHTML: true` is enabled, the library parses the HTML and removes disallowed tags and dangerous attributes.

Allowed tags:

b · i · u · strong · em · a · p · br · span · ul · ol · li · code · pre · small · mark · h3 · h4 · h5 · h6

Blocked by default:

- Event handler attributes (e.g. `onclick`)
- Dangerous link schemes in `href` (e.g. `javascript:`, `data:`, `vbscript:`)
- `src` attributes on elements

> Rule of thumb: only pass allowHTML: true for content you control.

## Browser support

Requires modern browsers with `DOMParser`, Shadow DOM, and (for copy-to-clipboard) the Clipboard API.

## Contributing

Contributions are welcome. Please open an issue first to 
discuss what you'd like to change.

When submitting a pull request, use 
[Conventional Commits](https://www.conventionalcommits.org/) 
for commit messages:

```
feat: add new feature
fix: correct a bug
docs: update documentation
refactor: restructure code without changing behavior
chore: maintenance tasks
```

## Acknowledgements

Inspired by [Sonner](https://sonner.emilkowal.ski/), 
[SweetAlert2](https://sweetalert2.github.io/), and 
[notyf](https://github.com/caroso1222/notyf).

## License

MIT © [lazydev-areus](https://github.com/lazydev-areus/gui.js)
