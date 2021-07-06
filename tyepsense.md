# tyepsense
## install
```
sudo su
wget https://dl.typesense.org/releases/0.20.0/typesense-server-0.20.0-amd64.deb
sudo apt install ./typesense-server-0.20.0-amd64.deb
```
## configuration
https://typesense.org/docs/0.20.0/guide/configure-typesense.html#using-a-configuration-file
```bash
# /etc/typesense/typesense-server.ini
[server]
api-address = 0.0.0.0
api-port = 8108
data-dir = /var/lib/typesense
api-key = RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s
log-dir = /var/log/typesense
admin-key = 21RryKN5IDoEkFAiDXy3ldzzoFrZJjP5
search-only-key = ZuboD4RzGyCh6mBc8udl2gvm88PPUmw4

```
## profit!
```bash
# create book collection and fields
curl "https://ts.jp.ngrok.io/collections" \
    -X POST \
    -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" \
    -d '{
            "name": "books",
            "fields": [
            {"name": "title", "type": "string" },
            {"name": "author",  "type": "string[]", "facet": true },
            {"name": "ratings", "type": "int32" }
            ],
            "default_sorting_field": "ratings"
        }'
# Insert 3 rows.
curl "https://ts.jp.ngrok.io/collections/books/documents/import" \
    -X POST \
    -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" \
    -d '
        {"title":"Book 1","author": ["woonjjang", "sun"],"ratings":24}
        {"title":"Book 2","author": ["sun", "mozo"],"ratings":31}
        {"title":"Book 3","author": ["mozo", "woonjjang"],"ratings":30}'
# search query
curl "https://ts.jp.ngrok.io/collections/books/documents/search?query_by=title,author&q=su" \
    -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s"
# search query --- facet!!!!
curl -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" \
    "https://ts.jp.ngrok.io/collections/books/documents/search?q=sun&query_by=title,author&facet_by=author"
# drop collection
curl -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" -X DELETE \
    "https://ts.jp.ngrok.io/collections/books"

#creating admin key

curl 'https://ts.jp.ngrok.io/keys' \
    -X POST \
    -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Admin key.","actions": ["*"], "collections": ["*"]}'

#creating search-only
curl 'https://ts.jp.ngrok.io/keys' \
    -X POST \
    -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Search-only companies key.","actions": ["documents:search"], "collections": ["companies"]}'

# list all key
curl 'https://ts.jp.ngrok.io/keys' \
    -X GET \
    -H "X-TYPESENSE-API-KEY: RbF9v3uCxFvI1U5S6Crpgz7QojiC6TZmJpjnIctENAYcXO0s" 