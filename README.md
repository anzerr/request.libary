
### `Intro`
![GitHub Actions status | linter](https://github.com/anzerr/request.libary/workflows/linter/badge.svg)
![GitHub Actions status | publish](https://github.com/anzerr/request.libary/workflows/publish/badge.svg)
![GitHub Actions status | test](https://github.com/anzerr/request.libary/workflows/test/badge.svg)

Simple request object without having to pull 47 extra packages

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/request.libary.git
npm install --save @anzerr/request.libary
```

### `Example`
``` javascript
const Request = require('request.libary');

new Request('https://google.com').get('/').then((res) => {
	console.log(res.status(), res.body().toString());
});
```