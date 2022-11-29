# Linentry

Ever wanted a runnable spreadsheet? Me either! Here it is!

# Layout

- Commands, where functions run
- Data, a big 2d sheet to put data in
- Next Line, executes next line
- Auto Play, executes the code on a timer ( click again to pause )
- Reset, clears output and put the line pointer back to main
- From Last Line, data from the last line that will carry into the next line
- Output, where LOG and ECHO outputs to

### What the hell is going on tbh bruh

The example loaded as you open the page is a _Truth Machine_, when the input is true, output 1 indefinitely, when the input is false, output 0 once only

The main line is 1st line, READ reads the line that its data at index 0 says, the 0th line, which returns an array, it has one item, 0, in there

This data pass downwards, this is called carry, it concatenates to the data of, in this case, line 2 as ON's input

ON takes the 0th input and check, if true it goes to 1st input's line, here it's 3, if false it goes to 2nd input's line, here 5

LOG outputs the number 1, and then move on to the next line

The ON of line 4 didn't take carry like the first ON, here it checks 1, resulting in true, going to line 3, which is outputting 1

If it jumped to the 5th line, LOG outputs 0, and then goes to line 6, which just does nothing, thus ends the program

### Command Lines

Line with border means starting line

Green tick signifies the current running line

Click on the button right of the line number to change starting line to it

Scrolls in the y-axis

( I haven't made it show when you've focused on the textarea but trust yourself you are focused lmao )

### Data Entries

Takes only one of these four :

- empty
- one unicode character ( it turns into its unicode index, that's intended )
- number ( negative and floats are allowed )
- backslash plus numbers or backslash plus backslash, this is how to input them as unicode character

### Commands

READ: => data on the [0]th line | next line

ON: => | if [0] is exactly 0 or empty go to [2]th line, otherwise [1]th line

LOG: outputs the input as numbers => | next line

ECHO: floors the numbers and output as unicode index => | next line
