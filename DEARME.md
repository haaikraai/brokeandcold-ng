# DEARME

You actually made progress on something. Though it is totally wrong. Lesson learned: use web app technologies if you want to write a web app. not for an app app.

Now anyway, all said and done here we are and this must happen:

## Log
**26/04/25**
- Bitch: the reset button seems to reset all and well for a while to 0 balance, until I refresh. Then it does some 381 days voodoo. Must deeeebuuuuug this, I guess...
 NO:
 TEST it inside of an emulator. Yeah, for now.
 TESTED inside emulater: still the same.
- Shows the sorta reversed with `shortLedger()` inside of ledger-view.component.html. So using the Long motherfucker. Am I though? Think I may be using a truncated form of the long one, truncated in the ledgerView.component.ts file, not in the ledgerBook class. Using cunningly a directive. Nice. Well if it works, I guess.
- Lots of guess work.

**26/04/22**
- [x] Back button be done. Works by loading angular templaterefs as SIGNALs, COMPUTE the current template to display when the subscribed to signal in the status-control service changes. Also implements an EFFECT to force the checking of it (is this just in case?) in the constructor and runs this on ngAfterViewInit
- [x] Erase all implemented by clearing localStorage.clear() with javascript confirm() dialogue.
- [x] Reduced the timing a little bit to like 2 seconds or something.

**TODO THEN**
- Make it an app. That's all buddy man bro.

**26/04/22**
1. Check it functions, been awhile
2. Capacitor it
3. Check on phone

Post check:
- [x] Back button for thingy page, data one
- [x] Can just as well implement erase all. Do use modal blah and make dialogue to confirm this.
- [ ] Check again
- <input type="checkbox">

### Export Data to json/csv//external file
Format doesn't matter all that much. I am in capacitor, so use the capacitor filesystem plugin.
Also, fuck this. If it works on phone the job is done.

1. Create an "export data" button in the settings perhaps, or for the history log page that doesn't exist
    (30 mins then break)
2. Check the workings of capacitor plugin. This allows:
    - 30 mins capacitor js website
    - 30 mins what Gemini said
    1 hour is over enough. Export the data currently in json format to somewhere on PC.

2025-12-19:
DodiedadieDONE!
The exporting functionality at least.
- Nowwwwww, a back button from that screen.
(Make that *Laterrrrrr*)
- shorter sleep's man
- Create apk

Start Native app:
Functgionality much first
