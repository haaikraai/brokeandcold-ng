# BrokeandcoldNg

This is an angular project that compiles to an Android APK using Capacitor? @src contains the Angular code for the project in working.

The idea for the app is an opinionated counter. It can be set for many uses, but for this readme I am going to use it as an idiosyncrathic book-keeping tool (or rather a budgeting tool).

It's unique features are:
1. very rapid counter increments. Eventually it will be a homescreen widget where the user can just tap a button. Any details can be added later.
*For a money tracker, the user can simply tap a button to increment the counter by a fixed amount (say, $1) and the same can be done for a fixed amount (say, $10). This can quickly be done to record expenses right there in the shop while paying. Details of the transaction can be added later.*

2. It automatically updates itself daily.
*The way it updates is that, suppose your monthly income is $9000, then it will increment itself by $300 every day, dividing your monthly paycheck into daily paychecks. This daily amount carries over, or accumulates. This will allow you to see in an instance whether you are on par with a desire to save. Alternatively, if your balance is in the negatives, you know that you have spent too much already and can be more cautious until your balance is positive again.*

The future plans include:
- detailed fine-tuning of the counter behaviour
- Home screen widgets
- Better design. I am going for functional now, the design will follow
- A native Android app written with Jetpack Compose

TODO:
- Add settings page
- Add a way to set a goal
- Add a way to set a budget
- Add a global counter class to be able to use instances and run more than one counter at a time.
- Add the option to have the counter be a timer/stopwatch instead of discrete increments.
- Add home screen widgets

# Building

This is a capactitor project using anular. So do have all the libraries installed:
`pnpm install` should get the angular and most capacitor packages.
To be safe, also run
`pnpm add @capacitor/cli`
`pnpm add @capacitor/core`
`pnpm install @capacitor/android`
`cap init`
`cap add android`

Okay the Apk produced from an angular app using Capacitor. This took a while, updating Android Studio (manually for some reason) worked.

Then many much stuffs, where was I?
About the config, it is set up to detect the angular build files. To reenact, from the root folder, do:
- `pnpm install`
- `ng build`
- `cap sync android` (make sure the capacitor.config.tx setting `webDir: 'dist/brokeandcold-ng/browser/'` is just that)
- `cap open android` (android studio must be installed. Seems to break when updates are available, i.e. working on Meerkat)
- Make the debug-APK from android studio. Stupid, I know. But it works for now.

Changes, are stuff like:
- the settings-page exists, not usable yet
- The modal fully works. Even some better CSS tweaking to fit better on a mobile screen
- IDs given to each entry
- ledger display topsy-turvied again. Think the display will now always be last entry on top
- SAVING works. For now. In bad style. Uses localStorage for everything
- Some debug jonk removes, though still a shit load remains

- Oh the dark mode style is back again. The onther colours makes me wanna puke...and not in a sexy way
- A timer runs to update the value at midnight. Have to wait for midnight to check it
- Ag man a bunch. This is almost MVP-like, oh yes it is.