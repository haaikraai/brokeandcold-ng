@Echo off
REM build the angular project to the dist folder
call ng build
echo Finished angular build
REM copy & update capacitor android files
call cap sync android
echo updated capacitor android files
REM open android studioca
echo opening android studio
call cap open android
