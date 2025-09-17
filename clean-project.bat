@echo off
echo Cleaning up your React Native project...

echo Step 1: Kill any running React Native packagers
taskkill /f /im node.exe 2>nul

echo Step 2: Clean Android build files
cd android
call gradlew clean
cd ..

echo Step 3: Clean metro bundler cache
rmdir /s /q node_modules\.cache\metro 2>nul

echo Step 4: Reset React Native cache
call npx react-native start --reset-cache