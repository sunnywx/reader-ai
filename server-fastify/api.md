apis
==

## list books

- get /books

## search books

- get /books?filter={filters}

## search book from web

> combine search results from libgen, google books, etc

- get /books/search?q={word}

## get one book

- get /book/{id}

## view book content

- get /book/{id}/raw

## delete book

- delete /book/{id}

## rename book

- post /book/{id}

  payload: {name: string}

## upload book

- post /book