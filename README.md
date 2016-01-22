
# elapse

command-line progress bar

![alt text](https://github.com/surprisetalk/elapse/elapse.png "cuttin' away")


## install

{ npm package coming soon }


## examples

``` bash

$ node -e "require('repl').start({ignoreUndefined: true})"   # repl formatting

``` 
``` javascript

> var elapse = require('elapse')
> elapse( 60 )

 |⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅ 60.0  
 
> elapse( 60, { format: " [#bar] #percent% #secondss " } )

 [⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅|⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅] 100.0% 15.0s 
 
> elapse( 60, { car_char: "✂ ", road_char: "-" } )

 -------------------------✂ ------------------------- 30.0  
 
> elapse( 60, { car_char: "\u001b[36m☂ \u001b[0m" } )

 ⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅☂ ⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅ 15.0  

> elapse( 60, { trail: true } )

 |||||||||||||||||||||||||||⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅ 30.0  
 

```


## use

### options

* `stream` *stream*
  * the output stream
  * defaults to `process.stderr`
* `width` *int*
  * the width of the elapse bar and stats
  * defaults to terminal-width (`process.stderr.columns`)
* `car_char` *string*
  * the character that travels across the elapse bar
  * defaults to `|`
* `road_char` *string*
  * the character that is used everywhere around the `car_char`
  * defaults to `⋅`
* `trail` *bool*
  * creates a repeated trail behind the `car_char`
  * defaults to `false`
* `clear` *bool*
  * clears the bar upon completion
  * defaults to `false`
* `callback` *function*
  * function to execute upon completion
* `refresh_rate` *int*
  * the refresh rate of the elapse line
	* occurs every `1000 / refresh_rate` milliseconds
  * defaults to `100`
* `format` *string*
  * elapse line formatting: `tags` are replaced by dynamic values
	* options are `#bar`, `#percent`, `#eta`, `#seconds`, and `#elapsed`
  * defaults to ` #bar #eta `


## coming soon

* pretty colors
* pause the timer with space bar


## acknowledgements

* thanks to [@tj](https://github.com/tj) for making [node-progress](https://github.com/tj/node-progress) 

