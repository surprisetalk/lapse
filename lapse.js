
module.exports = Lapse;

var _ = require('underscore');

// ( {} | { format: string, stream: stream, width: int, car_char: string, road_char: string, clear: bool, callback: function, refresh_rate: int } ) -> { format: string, stream: stream, width: int, car_char: string, road_char: string, clear: bool, callback: function, refresh_rate: int } 
function settings( options )
{
    var stream = _.has( options, "stream" ) ? options.stream : process.stderr;
    return _.defaults(
	_.isUndefined( options ) ? {} : options,
	{
	    format: " #bar #eta ",
	    stream: stream,
	    width: stream.columns,
	    car_char: "|",
	    road_char: "⋅",
	    trail: false,
	    clear: false,
	    callback: function() {},
	    refresh_rate: 100
	}
    );
}

// int, obj -> 
function Lapse( duration, options )
{
    // set the start and end times
    var start = new Date(); var end = new Date();
    end.setSeconds( start.getSeconds() + duration );

    // parse default settings
    var app = settings( options );
    app.stream.write( "\n" );

    // line() creates our line of text
    var line = line_gen( app.stream, app.format, app.width, app.car_char, app.road_char, app.trail );

    // run the update function every n milliseconds
    var ticker = setInterval( update, 1000 / app.refresh_rate  );
    function update()
    {
	if( !render( app.stream, line( start, end ) ) )
	{
	    clearInterval( ticker );
	    if( app.clear ) 
		app.stream.moveCursor( 0, -1 ) || app.stream.clearScreenDown( 0 );
	    else
		app.stream.write('\n\n');
	    app.callback();
	}
    };
}

// int -> string
function pad( n )
{
    return ( n < 10 ) ? ( "0" + n ) : n;
}

// Date, bool -> string
function format_time( time, format )
{
    var date = new Date( time  );
    var m = date.getMinutes();
    var s = date.getSeconds();
    return ( m && ( _.isUndefined( format ) || format ) ) ? m + ":" + pad( s ) : (date/1000).toFixed(1);
}

// int -> int
function clockify( n )
{
    return ( n + 11 ) % 12 + 1;
}

// string -> string
function ansi_strip( s )
{
    return s.replace( /\u001b\[.+?m/g, "" );
}

// string, int, int, string, string -> ( f: float -> string )
function line_gen( stream, format, width, car_char, road_char, trail )
{
    var bar = function( width, percent )
    {
	var present = Math.round( percent * width );
	var future = width - present;
	return ( trail ? car_char : road_char ).repeat( Math.max( 0, present-1 ) ) + car_char + road_char.repeat( future );
    };

    return function( start, end )
    {
	var percent = ( Date.now() - start ) / ( end - start + 1 );
	line_string = format
	    .replace( "#time", pad( clockify( (new Date).getHours() ) ) + ":" + pad( (new Date).getMinutes() ) )
	    .replace( "#mtime", pad( (new Date).getHours() ) + ":" + pad( (new Date).getMinutes() ) )
	    .replace( "#start", pad( clockify( start.getHours() ) ) + ":" + pad( start.getMinutes() ) )
	    .replace( "#mstart", pad( start.getHours() ) + ":" + pad( start.getMinutes() ) )
	    .replace( "#elapsed", format_time( Date.now() - start ) )
	    .replace( "#eta", format_time( end - Date.now() ) )
	    .replace( "#percent", ( percent * 100 ).toFixed(1) )
	    .replace( "#seconds", format_time( Date.now() - start, false ) );
	var availableSpace = Math.max( 0, stream.columns - ansi_strip( line_string ).length + 2 );
	var bar_width = Math.min( width, availableSpace );
	return Date.now() < end ? line_string.replace( "#bar", bar( bar_width, percent ) ) : false;
    };
}

// stream, string -> bool
function render( stream, line )
{
    // todo we don't have to move the cursor so much...
    return ( stream.isTTY && line ) 
	&& ( stream.moveCursor( 0, -1 )
	     || !stream.write( "\n" + line + "\n" )
	     || !stream.moveCursor( stream.columns, -1 ) );
}

