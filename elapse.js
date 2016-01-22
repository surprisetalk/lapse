
module.exports = Elapse;

//var _ = require('underscore');

// todo space => pause
// todo enter => stream.moveCursor( 0, -1 )
// todo keep functions under 10 lines

// int, obj -> Date
function Elapse( duration, options )
{
    var stream = process.stderr;
    stream.write( "\n" );
    
    // todo underscore defaults
    var app = {
	format: ":bar",
	width: stream.columns,
	height: 5,
	progress_char: "|",
	waiting_char: "⋅",
	clear: true,
	callback: function() {},
	refresh_rate: 100
    };

    var line = line_gen( stream, app.format, app.width, app.progress_char, app.waiting_char );

    var start = new Date();
    var end = new Date();
    end.setSeconds( start.getSeconds() + duration );

    var ticker = setInterval( update, 1000 / app.refresh_rate  );
    function update()
    {
	if( !render( stream, line( start, end ), app.height ) )
	{
	    clearInterval( ticker );
	    if( app.clear ) 
	    {
		stream.moveCursor( 0, -1 );
		stream.clearScreenDown( 0 );

	    } else {

		stream.write('\n');
	    }
	}
    }

    return end;
}

// todo elapsed and eta have copied code

// Date, bool -> string
function elapsed( start, format )
{
    pad = function( n ) { return ( n < 10 ) ? ( "0" + n ) : n; }
    var date = new Date( Date.now() - start  );
    var m = date.getMinutes();
    var s = date.getSeconds();
    return ( m && ( typeof format === "undefined" || format ) ) ? m + ":" + pad( s ) : (date/1000).toFixed(1);
}

// Date -> string
function eta( end )
{
    pad = function( n ) { return ( n < 10 ) ? ( "0" + n ) : n; }
    var date = new Date( end - Date.now() );
    var m = date.getMinutes();
    var s = date.getSeconds();
    return ( m && ( typeof format === "undefined" || format ) ) ? m + ":" + pad( s ) : (date/1000).toFixed(1);
}

// string, int, int, string, string -> ( f: float -> string )
function line_gen( stream, format, width, car_char, road_char )
{
    var bar = function( width, percent )
    {
	var present = Math.round( percent * width );
	var future = width - present;
	return road_char.repeat( Math.max( 0, present-1 ) ) + car_char + road_char.repeat( future );
    };

    return function( start, end )
    {
	var percent = ( Date.now() - start ) / ( end - start + 1 );
	line_string = format
	    .replace( ":elapsed", elapsed( start ) )
	    .replace( ":eta", eta( end ) )
	    .replace( ":percent", ( percent * 100 ).toFixed(1) )
	    .replace( ":seconds", elapsed( start, false ) );
	// todo why add 2 ?
	var availableSpace = Math.max( 0, stream.columns - line_string.length + 2 );
	var bar_width = Math.min( width, availableSpace );
	return Date.now() < end ? line_string.replace( ":bar", bar( bar_width, percent ) ) : false;
    };
}

// stream, string -> bool
function render( stream, line, height )
{
    if ( stream.isTTY && line ) 
    {
	stream.moveCursor( 0, -1 );
	stream.write( "\n" + line + "\n" );
	stream.moveCursor( stream.columns, -1 );

	return true
	
    } else {

	return false;
    }

}

Elapse( 60 );
