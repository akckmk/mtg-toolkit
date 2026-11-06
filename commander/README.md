# Commander Table

A Commander-first life tracker for 2 to 8 players, with the MTG Print Tool, the cEDH meta decks and the Rules Desk built in.

- **Web app (iPad, iPhone, Android, desktop):** https://akckmk.github.io/mtg-toolkit/commander/ then Share > Add to Home Screen.
- **Android app:** `CommanderTable-android.apk` on the [commander-latest release](https://github.com/akckmk/mtg-toolkit/releases/tag/commander-latest).
- **iOS app:** the same release has an unsigned `.ipa` for sideloading with your Apple ID; the native project is in `commander-native/ios` for Xcode.

`commander/` is the app itself (plain HTML, no build step). `commander-native/` wraps it with Capacitor for Android and iOS, and `.github/workflows/commander-apps.yml` builds both on every push.
