### Text search

The `anime` collection contains a MongoDB text index on:

- `title`
- `english_title`

Created with:

```ts
db.anime.createIndex({
	title: 'text',
	english_title: 'text',
});
```

The REST endpoint:

GET /api/anime/search?query=...

uses MongoDB's `$text` operator to search this index.
