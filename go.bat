@ECHO off
REM * Added to keep busy windows users happy

ECHO Checking you have the required global NPM modules...
ECHO --------------------

CALL npm --version
IF %ERRORLEVEL% NEQ 0 (
    ECHO Looks like you have no npm. Please install nodejs from http://nodejs.org
    EXIT /B
)

CALL grunt --version
IF %ERRORLEVEL% NEQ 0 (
    ECHO Installing grunt...
    CALL npm install -g grunt-cli
    EXIT /B
)

ECHO --------------------

ECHO Checking you have the project NPM dependencies...
ECHO --------------------
CALL npm install
ECHO --------------------

ECHO Ok, running your local build...
ECHO --------------------
grunt default

ECHO --------------------
ECHO All done! - press any key to continue...
PAUSE >nul
