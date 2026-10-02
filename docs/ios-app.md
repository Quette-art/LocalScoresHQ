# LocalScoresHQ iPhone app

The `ios-app` branch adds a Capacitor iOS project to the existing React/Vite application. It bundles the site assets with the app and connects to the same Firestore project. It does not load the hosted website as its app shell.

## Development

```sh
npm ci
npm run ios:sync
npm run ios:open
```

`ios:sync` builds into `dist-native` and copies assets into the iOS project. Run it after changing shared web code. Normal `npm run build` still builds the website with its PWA support. Native builds omit PWA service-worker generation; native sessions skip web messaging and browser install prompts.

Opening and compiling the iOS project requires macOS and a compatible Xcode installation. The generated project uses Swift Package Manager. GitHub Actions now provides an unsigned simulator build on the standard `macos-26` runner for pushes to `ios-app`. It compiles the iOS project, launches it in an iPhone simulator, and saves a screenshot and build log as the `iphone-build-report` artifact. Standard runners are free while this repository is public. This build does not sign or publish the app. No signing certificates or Apple account credentials belong in git.

## Before TestFlight

- Confirm the proposed bundle identifier `com.localscoreshq.app` in the Apple account before the first upload.
- Select the Apple development team and configure signing.
- Test navigation, team/game pages, favorites persistence, score refresh, and admin authentication on iPhone. Existing browser favorites will not automatically transfer into app storage.
- Check safe areas, keyboard behavior, external links, and network failures on device.
- Replace template app icons and launch assets with LocalScoresHQ branding.
- Implement native push registration, favorite-team subscriptions, notification preferences, and server delivery. The existing Firebase web messaging token flow does not deliver iOS native push notifications.
- Review analytics/data collection and third-party SDK privacy requirements; prepare the privacy policy, support URL, screenshots, age rating, and App Store privacy answers.
- Review any account creation/deletion requirements if user accounts are added.
- Build and test an archive on macOS, then upload to TestFlight with an Apple Developer membership.

This is the initial project foundation, not a tested or App Store-ready release. Native compilation is checked by the cloud workflow; see its latest result in GitHub Actions. Physical-device tests have not been performed.
