# Advanced Loadscreen

A standalone FiveM loading screen for Los Santos Nights a cinematic full-screen Five Manage background blended into a pink overlay, bold left-side editorial panels, right-side community links, a centered rotating PNG logo, bottom video controls, bottom connection progress, and configurable owner/admin branding.

## Installation

1. Place this folder in your server resources directory, for example:
   `resources/[custom]/advanced-loadscreen`
2. Add this line to `server.cfg`:
   `ensure advanced-loadscreen`
3. Restart the resource or restart the server.
4. Add your server logo as `html/logo.png`, or change `serverLogo` in `html/config.js` to another local PNG image or public image URL.
5. Edit `html/config.js` and replace the example server details, media URLs, tips, and staff members.

## Media configuration

The `media` array in `html/config.js` accepts direct FiveMManage files:

- FiveMManage video: `{ type: "fivemanage", format: "video", url: "https://..." }`
- FiveMManage image: `{ type: "fivemanage", format: "image", url: "https://..." }`

Use direct FiveMManage file URLs for video/image items. The first valid item in `media` is selected and automatically played as the full-screen background when the loading screen opens. FiveMManage video entries with `format: "video"` are fixed to the full viewport behind the interface and blend into the layered pink background rather than appearing in a corner or center card. Video media is configured to autoplay with audio enabled at the configured `volume`; players can use the Play/Pause and Mute/Unmute buttons in the bottom control strip. Browser or CEF autoplay policy may still require the player to press Play before audio can begin. The default background uses the provided direct FiveMManage MP4 link. Replace it in `html/config.js` if you want to use a different video.

## Server logo

Use a real PNG file at `html/logo.png`. The centered logo automatically scales for different resolutions, and the configured server name appears if the PNG cannot be loaded. You can use another PNG path or a public image URL by changing `serverLogo` in `html/config.js`.

The default configuration includes the provided `LeanOnMe(1).mp4` FiveMManage background video and starts it automatically with audio enabled at 35% volume. Replace its URL with your own direct FiveMManage video URL if needed. You can add additional FiveMManage video or image entries to the `media` array; the first valid item plays on startup. The Play/Pause button controls the active background video, while the Mute/Unmute button controls that video's audio. The centered server logo is loaded from `serverLogo`, spins continuously, and falls back to the configured server name if the image is unavailable.

## Admins and owners

The `welcomeEyebrow`, `welcomeTitle`, `welcomeSubtitle`, `welcomeDescription`, and `rules` settings control the left-side reference-style panels. The `staff` array controls the Owners & Admins panel below them. Each staff member supports `name`, `role`, `initials`, `accent`, and an optional `image` URL for a square avatar. Add or remove members without changing the HTML. This is display branding only; it does not grant permissions.

The optional `/loadscreeninfo` command is restricted by ACE. To allow it, add the following to `server.cfg` and replace the group if needed:

```cfg
add_ace group.admin advanced-loadscreen.info allow
add_principal identifier.license:YOUR_LICENSE_HERE group.admin
```

## Notes

- The loading screen uses FiveM's built-in `loadProgress` messages for the progress bar.
- `loadscreen_manual_shutdown` is enabled and `client/main.lua` shuts the screen down once the network session is ready.
- The Tailwind CDN and Google Fonts are included as requested. If your server audience has restricted internet access, replace them with local assets before deployment.
