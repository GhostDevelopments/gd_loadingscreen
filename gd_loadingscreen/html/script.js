const DEFAULT_CONFIG = {
  serverName: "YOUR SERVER",
  serverTagline: "Connecting to the city",
  welcomeEyebrow: "WELCOME TO YOUR SERVER",
  welcomeTitle: "YOUR NIGHT. YOUR STORY.",
  welcomeSubtitle: "THE CITY IS YOURS TO WRITE.",
  welcomeDescription: "Synchronizing your session with the city.",
  rules: [],
  serverLogo: "logo.png",
  serverLogoAlt: "Server logo",
  serverLogoFallback: "YOUR SERVER",
  discordUrl: "#",
  websiteUrl: "#",
  showTips: true,
  rotateTipsEvery: 7000,
  media: [],
  tips: [],
  staff: []
};

const state = {
  progress: 0,
  mediaIndex: 0,
  videoPlaying: false,
  videoMuted: false,
  backgroundVideo: null,
  tipIndex: 0
};

const config = {
  ...DEFAULT_CONFIG,
  ...(window.LoadingConfig ?? {})
};

const elements = {
  serverName: document.getElementById("serverName"),
  serverTagline: document.getElementById("serverTagline"),
  welcomeEyebrow: document.getElementById("welcomeEyebrow"),
  welcomeTitle: document.getElementById("welcomeTitle"),
  welcomeSubtitle: document.getElementById("welcomeSubtitle"),
  welcomeDescription: document.getElementById("welcomeDescription"),
  rulesList: document.getElementById("rulesList"),
  progressBar: document.getElementById("progressBar"),
  progressValue: document.getElementById("progressValue"),
  progressLabel: document.getElementById("progressLabel"),
  statusLabel: document.getElementById("statusLabel"),
  backgroundMediaMount: document.getElementById("backgroundMediaMount"),
  serverLogoImage: document.getElementById("serverLogoImage"),
  serverLogoFallback: document.getElementById("serverLogoFallback"),
  serverLogoFallbackName: document.getElementById("serverLogoFallbackName"),
  tipText: document.getElementById("tipText"),
  staffList: document.getElementById("staffList"),
  discordLink: document.getElementById("discordLink"),
  websiteLink: document.getElementById("websiteLink"),
  videoPlayButton: document.getElementById("videoPlayButton"),
  videoMuteButton: document.getElementById("videoMuteButton")
};

const escapeHtml = (value) => {
  const container = document.createElement("span");
  container.textContent = value ?? "";
  return container.innerHTML;
};

const setProgress = (value, label = "Connecting to session") => {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) * 100)));
  state.progress = safeValue;
  elements.progressBar.style.width = `${safeValue}%`;
  elements.progressValue.textContent = `${safeValue}%`;
  elements.progressLabel.textContent = safeValue >= 100 ? "Session ready" : label;
  elements.statusLabel.textContent = safeValue >= 100 ? "Entering the city" : "Receiving game data";
};

const setTextContent = (element, value, fallback = "") => {
  if (!element) {
    return;
  }

  element.textContent = value || fallback;
};

const renderServerLogo = () => {
  const logoUrl = typeof config.serverLogo === "string" ? config.serverLogo.trim() : "";
  const fallbackName = config.serverLogoFallback || config.serverName || DEFAULT_CONFIG.serverName;
  elements.serverLogoFallbackName.textContent = fallbackName;
  elements.serverLogoImage.alt = config.serverLogoAlt || `${fallbackName} server logo`;
  elements.serverLogoFallback.classList.remove("hidden");
  elements.serverLogoImage.classList.add("hidden");

  if (!logoUrl) {
    return;
  }

  elements.serverLogoImage.onload = () => {
    elements.serverLogoFallback.classList.add("hidden");
    elements.serverLogoImage.classList.remove("hidden");
  };
  elements.serverLogoImage.onerror = () => {
    elements.serverLogoFallback.classList.remove("hidden");
    elements.serverLogoImage.classList.add("hidden");
  };
  elements.serverLogoImage.src = logoUrl;
};

const getMediaItems = () => {
  if (!Array.isArray(config.media)) {
    return [];
  }

  return config.media.filter((item) => {
    const mediaType = String(item?.type || "").toLowerCase();
    const mediaFormat = String(item?.format || "video").toLowerCase();
    return Boolean(item?.url) && mediaType === "fivemanage" && (mediaFormat === "video" || mediaFormat === "image");
  });
};

const updateVideoControls = () => {
  const hasVideo = Boolean(state.backgroundVideo);
  elements.videoPlayButton.disabled = !hasVideo;
  elements.videoMuteButton.disabled = !hasVideo;
  elements.videoPlayButton.textContent = state.videoPlaying ? "Pause" : "Play";
  elements.videoPlayButton.setAttribute("aria-label", state.videoPlaying ? "Pause background video" : "Play background video");
  elements.videoMuteButton.textContent = state.videoMuted ? "Unmute" : "Mute";
  elements.videoMuteButton.setAttribute("aria-label", state.videoMuted ? "Unmute background video" : "Mute background video");
};

const startBackgroundVideo = (videoElement) => {
  if (!videoElement) {
    return;
  }

  videoElement.muted = state.videoMuted;
  videoElement.autoplay = true;
  videoElement.setAttribute("autoplay", "");
  const playback = videoElement.play();
  if (playback?.catch) {
    playback.catch(() => {
      state.videoPlaying = false;
      updateVideoControls();
    });
  }
};

const mountMedia = () => {
  const mediaItems = getMediaItems();
  const activeMedia = mediaItems[state.mediaIndex] || mediaItems[0];
  state.mediaIndex = Math.max(0, mediaItems.indexOf(activeMedia));
  elements.backgroundMediaMount.replaceChildren();
  state.backgroundVideo = null;
  state.videoPlaying = false;
  state.videoMuted = false;
  updateVideoControls();

  if (!activeMedia) {
    return;
  }

  const mediaFormat = String(activeMedia.format || "video").toLowerCase();

  if (mediaFormat === "image") {
    const backgroundImage = document.createElement("img");
    backgroundImage.className = "background-media-enter";
    backgroundImage.alt = activeMedia.title || "Server background image";
    backgroundImage.src = activeMedia.url;
    elements.backgroundMediaMount.appendChild(backgroundImage);
    return;
  }

  const backgroundVideo = document.createElement("video");
  backgroundVideo.className = "background-media-enter";
  backgroundVideo.setAttribute("title", activeMedia.title || "Server background video");
  backgroundVideo.src = activeMedia.url;
  backgroundVideo.loop = activeMedia.loop !== false;
  backgroundVideo.playsInline = true;
  backgroundVideo.preload = "auto";
  backgroundVideo.muted = false;
  backgroundVideo.volume = Math.max(0, Math.min(1, Number(activeMedia.volume ?? 1)));
  backgroundVideo.controls = false;
  backgroundVideo.addEventListener("play", () => {
    state.videoPlaying = true;
    updateVideoControls();
  });
  backgroundVideo.addEventListener("pause", () => {
    state.videoPlaying = false;
    updateVideoControls();
  });
  backgroundVideo.addEventListener("canplay", () => startBackgroundVideo(backgroundVideo), { once: true });
  elements.backgroundMediaMount.appendChild(backgroundVideo);
  state.backgroundVideo = backgroundVideo;
  updateVideoControls();
  startBackgroundVideo(backgroundVideo);
};

const renderStaff = () => {
  const staff = Array.isArray(config.staff) ? config.staff.slice(0, 6) : [];
  elements.staffList.replaceChildren();
  staff.forEach((member) => {
    const accentClasses = {
      pink: "border-pink-300/30 bg-pink-300/10 text-pink-200",
      rose: "border-rose-300/30 bg-rose-300/10 text-rose-200",
      fuchsia: "border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200"
    };
    const card = document.createElement("div");
    card.className = `flex min-w-0 items-center gap-2 border px-2 py-2 transition hover:-translate-y-0.5 ${accentClasses[member.accent] || accentClasses.pink}`;

    let avatar;
    if (member.image) {
      avatar = document.createElement("img");
      avatar.src = member.image;
      avatar.alt = `${member.name || "Staff"} avatar`;
      avatar.className = "h-9 w-9 shrink-0 rounded-sm border border-current/30 object-cover";
      avatar.onerror = () => {
        avatar.replaceWith(createStaffInitials(member.initials));
      };
    } else {
      avatar = createStaffInitials(member.initials);
    }

    const details = document.createElement("div");
    details.className = "min-w-0 text-left";

    const name = document.createElement("p");
    name.className = "truncate text-[11px] font-extrabold uppercase text-white";
    name.textContent = member.name || "Team member";

    const role = document.createElement("p");
    role.className = "truncate text-[10px] font-semibold text-white/80";
    role.textContent = member.role || "STAFF";

    details.append(name, role);
    card.append(avatar, details);
    elements.staffList.appendChild(card);
  });
};

const createStaffInitials = (initials) => {
  const avatar = document.createElement("span");
  avatar.className = "grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-current/30 bg-black/25 font-mono text-[10px] font-bold";
  avatar.textContent = initials || "??";
  return avatar;
};

const renderTip = () => {
  if (!elements.tipText) {
    return;
  }

  const tips = Array.isArray(config.tips) ? config.tips.filter(Boolean) : [];
  if (!config.showTips || tips.length === 0) {
    elements.tipText.textContent = "Stay sharp. The city is waiting.";
    return;
  }
  elements.tipText.textContent = tips[state.tipIndex % tips.length];
};

const renderRules = () => {
  const rules = Array.isArray(config.rules) ? config.rules.filter(Boolean).slice(0, 6) : [];
  elements.rulesList.replaceChildren();
  rules.forEach((rule, index) => {
    const item = document.createElement("li");
    item.className = "flex items-start gap-3";

    const number = document.createElement("span");
    number.className = "mt-0.5 shrink-0 font-mono text-[9px] font-bold text-fuchsia-300";
    number.textContent = String(index + 1).padStart(2, "0");

    const text = document.createElement("span");
    text.textContent = rule;
    item.append(number, text);
    elements.rulesList.appendChild(item);
  });
};

const toggleVideoPlay = async () => {
  const videoElement = state.backgroundVideo;
  if (!videoElement) {
    return;
  }

  if (state.videoPlaying) {
    videoElement.pause();
    return;
  }

  try {
    await videoElement.play();
  } catch (error) {
    state.videoPlaying = false;
    updateVideoControls();
  }
};

const toggleVideoMute = () => {
  const videoElement = state.backgroundVideo;
  if (!videoElement) {
    return;
  }

  state.videoMuted = !state.videoMuted;
  videoElement.muted = state.videoMuted;
  updateVideoControls();
};

const initialise = () => {
  setTextContent(elements.serverName, config.serverName, DEFAULT_CONFIG.serverName);
  setTextContent(elements.serverTagline, config.serverTagline, DEFAULT_CONFIG.serverTagline);
  setTextContent(elements.welcomeEyebrow, config.welcomeEyebrow, "WELCOME TO LOS SANTOS NIGHTS");
  setTextContent(elements.welcomeTitle, config.welcomeTitle, "YOUR NIGHT. YOUR STORY.");
  setTextContent(elements.welcomeSubtitle, config.welcomeSubtitle, "THE CITY IS YOURS TO WRITE.");
  setTextContent(elements.welcomeDescription, config.welcomeDescription, "Synchronizing your session with Los Santos Nights.");
  elements.discordLink.href = config.discordUrl || "#";
  elements.websiteLink.href = config.websiteUrl || "#";
  renderStaff();
  renderRules();
  renderTip();
  renderServerLogo();
  mountMedia();
  setProgress(0, "Preparing session");
  document.body.classList.remove("opacity-0");
  document.body.classList.add("opacity-100");

  if (config.showTips && Array.isArray(config.tips) && config.tips.length > 1) {
    window.setInterval(() => {
      state.tipIndex += 1;
      renderTip();
    }, Number(config.rotateTipsEvery) || DEFAULT_CONFIG.rotateTipsEvery);
  }
};

elements.videoPlayButton.addEventListener("click", toggleVideoPlay);
elements.videoMuteButton.addEventListener("click", toggleVideoMute);

window.addEventListener("message", (event) => {
  const { eventName, loadFraction, action, progress } = event.data || {};
  if (eventName === "loadProgress") {
    setProgress(loadFraction || 0);
  }
  if (action === "loadProgress") {
    setProgress(progress || 0);
  }
});

initialise();
