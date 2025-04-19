When we write ```<playing-card rank="7" suit="clubs" face-up="true"></playing-card>``` in HTML, there's no definition of "playing-card" anywhere else. HTML is basically thinking "Hmm… this tag isn't in the standard set of HTML elements like ```<div>```, ```<p>```, or ```<button>```... but maybe JavaScript will tell me what to do with it."

Then Javascript runs something like ```customElements.define('playing-card', PlayingCard);``` which basically tells the browser ""Hey browser — whenever you see a ```<playing-card>``` tag, instantiate it using this class (PlayingCard) that I’m defining."



```
<script type="module" src="playing-card.js"></script>
```

This line loads the JavaScript file `playing-card.js` and treats it as an ES Module. The `type="module"` part tells the browser:

- To load the file **as a module**, meaning it supports `import` and `export`
- To run the script **only once**, after the HTML is fully parsed (like `defer`)
- To **keep its variables scoped**, so they don’t leak into the global `window` object

This lets you safely define custom components like `<playing-card>` and organize your code in a clean, modular way.

...

I've been reading into styling and applying these images and it seems like this thing called Shadow DOM is for when you want your component to look the same no matter where it's loaded. This way you can name things like --border_color without worrying about whether someone else has already named that. 

I'm pretty sure this is the best move for this card? This kind of makes the playing-card.css useless

