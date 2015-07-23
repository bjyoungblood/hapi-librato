# hapi-librato

## Usage

```js
server.register({
  register : require('hapi-librato'),
  options : {
    librato : librato,
  },
}, function(err) {
  if (err) { throw err; }
});
```

**Note:** if you give your routes IDs, they will be provided as sources to the
metrics. Example:

```
serve.route({
  method : GET',
  route : '/',
  config : {
    id : 'home-page',
  },
});
```
