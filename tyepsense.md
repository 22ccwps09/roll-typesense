+## configuration
https://typesense.org/docs/0.21.0/guide/configure-typesense.html
```bash
# /etc/typesense/typesense-server.ini
[server]

api-address = 0.0.0.0
api-port = 8108
data-dir = /var/lib/typesense
api-key = jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ
log-dir = /var/log/typesense

admin-key(id=1) = hLVboPwrYJZ45JgAULx2kK1nMv5Wt8UO
search-only-key(id=2) = Tm15ZDkpHb4ZAAfi6Twb2AfyQQF2AuyP

```

## key management

```bash
# creating admin key

curl 'https://ts-ccwps.ap.ngrok.io/keys' \
    -X POST \
    -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Admin key.","actions": ["*"], "collections": ["*"]}'

#creating search-only key
curl 'https://ts-ccwps.ap.ngrok.io/keys' \
    -X POST \
    -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Search-only items key.","actions": ["*"], "collections": ["*"]}'

# list all key
curl 'https://ts-ccwps.ap.ngrok.io/keys' \
    -X GET \
    -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" 

# delete key
curl 'https://ts-ccwps.ap.ngrok.io/keys/0' \
    -X DELETE \
    -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ"    
```


## Test collections
```bash
# health ckeck
curl https://ts-ccwps.ap.ngrok.io:443/health

# create book collection and fields
curl "https://ts-ccwps.ap.ngrok.io/collections" \
    -X POST \
    -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" \
    -d '{
            "name": "books",
            "fields": [
            {"name": "title", "type": "string" },
            {"name": "author",  "type": "string[]", "facet": true },
            {"name": "ratings", "type": "int32" }
            ],
            "default_sorting_field": "ratings"
        }'

# Retrieve a collection

curl -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" \
     -X GET \
    "https://ts-ccwps.ap.ngrok.io/collections/items"

# List all collections
curl -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" \
    "https://ts-ccwps.ap.ngrok.io/collections"

# Insert 3 rows.
curl "https://ts-ccwps.ap.ngrok.io/collections/books/documents/import" \
    -X POST \
    -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" \
    -d '
        {"title":"Book 1","author": ["woonjjang", "sun"],"ratings":24}
        {"title":"Book 2","author": ["sun", "mozo"],"ratings":31}
        {"title":"Book 3","author": ["mozo", "woonjjang"],"ratings":30}'

# search query
curl "https://ts-ccwps.ap.ngrok.io/collections/items/documents/search?query_by=title&q=en" \
    -H "X-TYPESENSE-API-KEY: Tm15ZDkpHb4ZAAfi6Twb2AfyQQF2AuyP"

# search query --- facet!!!!
curl -H "X-TYPESENSE-API-KEY: Tm15ZDkpHb4ZAAfi6Twb2AfyQQF2AuyP" \
    "https://ts-ccwps.ap.ngrok.io/collections/books/documents/search?q=sun&query_by=title,author&facet_by=author"

# drop collection
curl -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" -X DELETE \
    "https://ts-ccwps.ap.ngrok.io/collections/books"

```

## item collection
```bash
# search query
curl -H "Origin: https://ts-ccwps.ap.ngrok.io/collections/items/documents/search?query_by=title&q=us" --verbose  \
    "X-TYPESENSE-API-KEY: xCkLkJy9dFCnOIRrqCsLz6FLB6P1hAGR96Og0SW9F7N866cH"  

# drop collection
curl -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" -X DELETE \
    "https://ts-ccwps.ap.ngrok.io/collections/items"

# API Stats
curl "https://ts-ccwps.ap.ngrok.io/stats.json" \
        -H "X-TYPESENSE-API-KEY: xCkLkJy9dFCnOIRrqCsLz6FLB6P1hAGR96Og0SW9F7N866cH"

# Export documents
curl -H "X-TYPESENSE-API-KEY: jaLzda0hrFS86cy9naDxWbV1fKGeg4CAa2aARBpkN5G8uTnQ" -X GET \
    "https://ts-ccwps.ap.ngrok.io/collections/itmes/documents/export"
```
## search
- https://ts-ccwps.ap.ngrok.io/multi_search?x-typesense-api-key=Tm15ZDkpHb4ZAAfi6Twb2AfyQQF2AuyP?q=en&query_by=title
```bash
# Search
curl -H "X-TYPESENSE-API-KEY: Tm15ZDkpHb4ZAAfi6Twb2AfyQQF2AuyP" \
"https://ts-ccwps.ap.ngrok.io/collections/items/documents/search\
?q=en&query_by=title"

# Federated / Multi Search

curl "https://ts-ccwps.ap.ngrok.io/multi_search?query_by=title" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: Tm15ZDkpHb4ZAAfi6Twb2AfyQQF2AuyP" \
        -d '{
          "searches": [
            {
              "collection": "items",
              "q": "korea"
            },
            {
              "collection": "items",
              "q": "en"
            }
          ]
        }'
```