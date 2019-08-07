
### `Intro`
Simple request object without having to pull 47 extra packages

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/request.libary.git
npm install --save @anzerr/request.libary
```

### `Example`
``` javascript
const Request = require('./index.js');

new Request('https://google.com').get('/').then((res) => {
	console.log(res.status(), res.body().toString());
});
```