
### `Intro`
Simple request object without having to pull 47 extra packages

#### `Install`
``` bash
npm install --save git+ssh://git@github.com/anzerr/request.libary.git
```

### `Example`
``` javascript
const Request = require('./index.js');

new Request('https://google.com').get('/').then((res) => {
	console.log(res.status(), res.body().toString());
});
```