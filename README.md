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