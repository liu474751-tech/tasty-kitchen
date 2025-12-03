// Compatibility loader: this module injects the big prebuilt bundle located at project root `assets_js.js`.
// The production build expected `/assets/index-BQFLi5wb.js`; to avoid duplicating the huge file,
// this small module dynamically inserts a non-module script tag that loads `/assets_js.js`.

const s = document.createElement('script');
s.src = '/assets_js.js';
s.defer = true;
s.crossOrigin = 'anonymous';
document.head.appendChild(s);

export default {};
