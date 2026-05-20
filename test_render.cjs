const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('dist/index.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost:3000/"
});

dom.window.document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded.");
});

dom.window.addEventListener("error", (event) => {
  console.log("Caught Error:", event.error ? event.error.message : event.message);
});

// Wait 2 seconds to let React render
setTimeout(() => {
  const rootHtml = dom.window.document.getElementById('root').innerHTML;
  console.log("Root innerHTML length:", rootHtml.length);
  if (rootHtml.length > 0) {
    console.log("App rendered successfully!");
  } else {
    console.log("Root is empty! React failed to render.");
  }
  process.exit(0);
}, 2000);
