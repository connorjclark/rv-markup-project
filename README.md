MarkupProject
=============

About the implementation
------------------------

I went with node (JavaScript ES6, specifically), mainly because it's the environment I've used the most this last month.

I started by setting up the node project structure. I enjoy some of the new features in ES6, so I used babel. To keep it simple, I just used the preset `babel-preset-env`.

Again, to keep it simple, I used the `standard` linting package (as opposed to writing custom eslint rules, which is usually a waste of time).

First thing I implemented was the scorer code, since it's really the meat of the application. I used Jest to test my code as I expanded on it. I broke it into two parts, 1) getting the frequency of each tag and 2) counting up those tags based on the tag values. Keeping it separate wasn't any extra work, and it's one small step away from supporting arbitrary tag values.

I used `https://github.com/mysqljs/mysql` because I didn't want to bother a RDBMS interface. I spun my wheels a bit rolling my own migration system. Used `async` to avoid terrible callback hell.

Lastly I looked around online a bit for something to help make a CLI, and found `https://github.com/tj/commander.js/`. After I figured out the library, implementing the remaining features came fairly quickly.

I felt the feature creep after I did the ASCII tables, so I stopped there and began writing the documentation.

If I came back to this, one thing I'd change would be the CLI library I used. As far as I saw, it doesn't support sub-commands with their own unique options, which I found frustrating.

Installation
------------

If you do not already have it on your system, install node (I am using v7.7.2) and yarn

* Run `yarn install` to install all dependencies
* Run `yarn compile` to compile the project
* Run `npm link` to install the `markup` script as an executable

You should now be able to use the `markup` program.

Usage
-----

Given a mysql database located at 'localhost', named 'markup', with a user 'me' and password 'bad_password', replace `[db_options]` with `-u me -p bad_password -h localhost -d markup`. (example, for the `seed` command: `markup -h localhost -u me -p bad_password -d markup seed`)

### seed

`markup [db_options] seed`

This will process all the html files in the data/ folder

### add new record

`markup [db_options] -a [author] -s [html source file] add`

Processes the html file at given file, and inserts into the database

Example output:
```
> markup [db_options] -a connor -s data\bob_2013_02_10.html add

affected 1 row(s)
```

### get all records

`markup [db_options] get`

Example output:
```
┌───────────────┬───────────────┬─────────────────────────┐
│ author        │ score         │ created_at              │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -15           │ Sun Feb 10 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -1            │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ 32            │ Fri Mar 01 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 3             │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 7             │ Sat Feb 16 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 22            │ Tue Mar 05 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ john          │ 19            │ Sat Jan 05 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ john          │ 39            │ Wed Feb 13 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ john          │ 12            │ Wed Mar 13 2013 00:00:… │
└───────────────┴───────────────┴─────────────────────────┘
```

### query by author

`markup [db_options] -a [author] get`

Example output:
```
> markup [db_options] -a bob get

┌───────────────┬───────────────┬─────────────────────────┐
│ author        │ score         │ created_at              │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -15           │ Sun Feb 10 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -1            │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ 32            │ Fri Mar 01 2013 00:00:… │
└───────────────┴───────────────┴─────────────────────────┘
```

### query by date range

`markup [db_options] -b [before] -e [end] get`

Timestamps are ISO format

Example:
```
> markup [db_options] -b "2013-02-11T08:00:00.000Z" -e "2013-02-27T08:00:00.000Z" get

┌───────────────┬───────────────┬─────────────────────────┐
│ author        │ score         │ created_at              │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -1            │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 3             │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 7             │ Sat Feb 16 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ john          │ 39            │ Wed Feb 13 2013 00:00:… │
└───────────────┴───────────────┴─────────────────────────┘
```

### query by author and date range

`markup [db_options] -a [author] -b [before] -e [end] get`

Example:
```
> markup [db_options] -a bob -b "2013-02-11T08:00:00.000Z" -e "2013-02-27T08:00:00.000Z" get

┌───────────────┬───────────────┬─────────────────────────┐
│ author        │ score         │ created_at              │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -1            │ Fri Feb 15 2013 00:00:… │
└───────────────┴───────────────┴─────────────────────────┘
```

### best html score of each author

`markup [db_options] best`

Example:
```
> markup [db_options] best

┌───────────────┬───────────────┬─────────────────────────┐
│ author        │ best_score    │ created_at              │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ 32            │ Sun Feb 10 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 22            │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ john          │ 39            │ Sat Jan 05 2013 00:00:… │
└───────────────┴───────────────┴─────────────────────────┘
```

### worst html score of each author

`markup [db_options] worst`

Example:
```
> markup [db_options] worst

┌───────────────┬───────────────┬─────────────────────────┐
│ author        │ best_score    │ created_at              │
├───────────────┼───────────────┼─────────────────────────┤
│ bob           │ -15           │ Sun Feb 10 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ cari          │ 3             │ Fri Feb 15 2013 00:00:… │
├───────────────┼───────────────┼─────────────────────────┤
│ john          │ 12            │ Sat Jan 05 2013 00:00:… │
└───────────────┴───────────────┴─────────────────────────┘
```

### average html score of each author

`markup [db_options] average`

Example:
```
> markup [db_options] average

┌───────────────┬───────────────┐
│ author        │ avg_score     │
├───────────────┼───────────────┤
│ bob           │ 5.3333        │
├───────────────┼───────────────┤
│ cari          │ 10.6667       │
├───────────────┼───────────────┤
│ john          │ 23.3333       │
└───────────────┴───────────────┘
```

### help

`markup --help`
___
Info
----
Create a class in the langauge of your choice that will read HTML content input and score and give
an arbitrary score based on a set of rules. The content should be assigned a unique id based on the prefix described below.
Changes to the content can be re-run over time to determine improvement or regression of the score. Each unique run should be stored with the date and time it was run along with the score received for the content.

You may use external libraries if you feel they will help, but you must place them in the appropriate folder based on the project layout section.

Code Requirements
-----------------
* Accept HTML Content Input
* Accept unique id for HTML Content to score (filename prefix)
* Score HTML content using the scoring guide
* Save results to a MySQL database
* Method: Retrieve scores for a unique id
* Method: Retrieve all scores run in the system for a custom date range
* Method: Retrieve highest scored unique id
* Method: Retrieve lowest scored unique id
* Additionally you should write one query that will find the average score for all runs **__see project layout below__**
* Finally, include instructions on how to get your code running.  Include the version of whatever language you wrote it in, as well as what platform (windows/osx/linux, etc) you are on.  This helps us get running with your code.

## Bonus
* Tag names are case-insensitive (ie: Html is the same as html)
* Parse multiple sections of the HTML content at the same time for performance

Scoring Rules
-------------
Each starting tag should below has been assigned a score. Each tag in the content should be added to or subtracted from the total score.

(We will assume for this project our html code creator created valid html)

| TagName | Score Modifier | TagName | Score Modifier |
| ------- | :------------: | ------- | -------------- |
| div     | 3              | font    | -1             |
| p       | 1              | center  | -2             |
| h1      | 3              | big     | -2             |
| h2      | 2              | strike  | -1             |
| html    | 5              | tt      | -2             |
| body    | 5              | frameset| -5             |
| header  | 10             | frame   | -5             |
| footer  | 10             |

example:

````
<html>
    <body>
      <p>foo</p>
      <p>bar</p>
      <div text-align='center'>
        <big>hello world</big>
      </div>
    </body>
</html>
````

2 p tags = 2 x 1 <br>
1 body tag = 1 x 5 <br>
1 html tag = 1 x 5 <br>
1 div tag = 1 x 3 <br>
1 big tag = 1 x -2 <br>
**Total Score: 13**


Project Layout
--------------
#### /data

* Contains the HTML content data to parse, format: (keyname_yyyy_mm_dd)

ie:
* dougs_2012_02_04.html
* dougs_2012_04_01.html
* dougs_2012_07_01.html

#### /src

* Your code goes in here.

#### /schema

* Your create table statements for MySQL.
* Your query to find the average score across each key. (see data example below)

ie:

| key | avgScore |
|---|--------|
| dougs | 10.35 |
| bobs  | 8.03 |

#### /vendor

* Place any external libraries not written by you in the /vendor folder

Instructions
------------
* Fork this repo into your own github account.  
* Begin working on the project and commit your code to your forked repo.
* When you are finished. Email your RedVentures recruiter or submit a pull request on the project.
* Note that each folder has a blank README.md file.  Feel free to place any notes you may have in these files.
