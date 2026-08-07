const { ipcRenderer } = require('electron');

window.SB_ENABLED = ipcRenderer.sendSync('settings:get-sync', 'sponsorblockEnabled');
window.SB_CATEGORIES = ipcRenderer.sendSync('settings:get-sync', 'sbCategories') || { sponsor: true, intro: true, outro: true, interaction: true, selfpromo: true, music_offtv: true, filler: true };
window.ADBLOCK_ENABLED = ipcRenderer.sendSync('settings:get-sync', 'adblockEnabled');

ipcRenderer.on('settings:update', (_, key, value) => {
  if (key === 'adblockEnabled' && window.toggleAdblockCSS) {
    window.toggleAdblockCSS(value);
  } else if (key === 'sponsorblockEnabled' && window.updateSponsorBlockSettings) {
    window.updateSponsorBlockSettings(value, null);
  } else if (key === 'sbCategories' && window.updateSponsorBlockSettings) {
    window.updateSponsorBlockSettings(null, value);
  }
});

if (!window._ytAdInterceptorInstalledPreloadReal) {
  window._ytAdInterceptorInstalledPreloadReal = true;
  let _ytInitialPlayerResponse;
  Object.defineProperty(window, 'ytInitialPlayerResponse', {
    get: () => _ytInitialPlayerResponse,
    set: (val) => {
      if (val && typeof val === 'object') {
        delete val.adPlacements;
        delete val.playerAds;
      }
      _ytInitialPlayerResponse = val;
    },
    configurable: true,
    enumerable: true
  });
  
  let _ytInitialData;
  Object.defineProperty(window, 'ytInitialData', {
    get: () => _ytInitialData,
    set: (val) => {
      if (val && typeof val === 'object') {
        const removeAds = (obj) => {
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              if (key === 'adSlotRenderer' || key === 'promotedSparklesWebRenderer') {
                delete obj[key];
              } else {
                removeAds(obj[key]);
              }
            }
          }
        };
        removeAds(val);
      }
      _ytInitialData = val;
    },
    configurable: true,
    enumerable: true
  });

  const origFetch = window.fetch;
  window.fetch = async function() {
    const reqUrl = typeof arguments[0] === 'string' ? arguments[0] : (arguments[0] && arguments[0].url ? arguments[0].url : '');
    const response = await origFetch.apply(this, arguments);
    if (reqUrl.includes('/youtubei/v1/player')) {
      try {
        const clone = response.clone();
        const json = await clone.json();
        let modified = false;
        if (json.adPlacements) { delete json.adPlacements; modified = true; }
        if (json.playerAds) { delete json.playerAds; modified = true; }
        if (modified) {
          const newResponse = new Response(JSON.stringify(json), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
          Object.defineProperty(newResponse, 'url', { value: response.url });
          return newResponse;
        }
      } catch (e) {}
    }
    return response;
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._reqUrl = url;
    return origOpen.apply(this, arguments);
  };
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4 && this._reqUrl && this._reqUrl.includes('/youtubei/v1/player')) {
        try {
          const json = JSON.parse(this.responseText);
          if (json.adPlacements || json.playerAds) {
            delete json.adPlacements;
            delete json.playerAds;
            Object.defineProperty(this, 'responseText', { writable: true, value: JSON.stringify(json) });
          }
        } catch (e) {}
      }
    });
    return origSend.apply(this, arguments);
  };


  let sbCurrentVideo = null;
  let sbSegments = [];
  let sbOverlayElements = [];
  let lastRenderedDuration = 0;

  const categoryColors = {
    sponsor: '#00FF00',
    intro: '#00FFFF',
    outro: '#0000FF',
    interaction: '#9b59b6',
    selfpromo: '#FFFF00',
    music_offtv: '#FF8C00',
    filler: '#FF00FF'
  };

  window.updateSponsorBlockSettings = function(enabled, categories) {
    if (enabled !== null) window.SB_ENABLED = enabled;
    if (categories !== null) window.SB_CATEGORIES = categories;
    
    if (!window.SB_ENABLED) {
      sbOverlayElements.forEach(el => el.remove());
      sbOverlayElements = [];
      lastRenderedDuration = 0;
    } else {
      const video = document.querySelector('video');
      if (video && video.duration && sbSegments.length > 0) {
        renderSegments(video.duration);
      }
    }
  };

  async function fetchSponsorBlockSegments(videoId) {
    if (!videoId) return [];
    try {
      const allCategories = ['sponsor', 'intro', 'outro', 'interaction', 'selfpromo', 'music_offtv', 'filler'];
      const encodedCategories = encodeURIComponent(JSON.stringify(allCategories));
      const url = `https://sponsor.ajay.app/api/skipSegments?videoID=${videoId}&categories=${encodedCategories}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  function renderSegments(videoLength) {
    const progressList = document.querySelector('.ytp-progress-list');
    if (!progressList) return;

    sbOverlayElements.forEach(el => el.remove());
    sbOverlayElements = [];
    lastRenderedDuration = videoLength;

    sbSegments.forEach(segment => {
      if (!window.SB_CATEGORIES || !window.SB_CATEGORIES[segment.category]) return;
      
      const [start, end] = segment.segment;
      const startPerc = (start / videoLength) * 100;
      const endPerc = (end / videoLength) * 100;
      const width = endPerc - startPerc;
      
      const div = document.createElement('div');
      div.className = 'ytp-sb-segment';
      div.style.position = 'absolute';
      div.style.left = `${startPerc}%`;
      div.style.width = `${width}%`;
      div.style.height = '100%';
      div.style.backgroundColor = categoryColors[segment.category] || '#FF0000';
      div.style.zIndex = '35';
      div.style.pointerEvents = 'none';
      div.style.opacity = '0.7';
      
      progressList.appendChild(div);
      sbOverlayElements.push(div);
    });
  }

  function getConsolidatedSegments() {
    if (!window.SB_CATEGORIES) {
      return [];
    }
    const active = sbSegments.filter(s => window.SB_CATEGORIES[s.category] === true);
    if (active.length === 0) return [];
    

    const ranges = active.map(s => [s.segment[0], s.segment[1]]).sort((a, b) => a[0] - b[0]);
    

    const merged = [ranges[0]];
    for (let i = 1; i < ranges.length; i++) {
       const last = merged[merged.length - 1];
       const current = ranges[i];
       if (current[0] <= last[1] + 5.0) {
          last[1] = Math.max(last[1], current[1]);
       } else {
          merged.push(current);
       }
    }
    return merged;
  }

  function checkVideoTime(video) {
    if (!video) return;
    const curr = video.currentTime;
    const skips = getConsolidatedSegments();
    for (const [start, end] of skips) {
      if (curr >= start && curr < end) {
        video.currentTime = end;
        break;
      }
    }
  }

  function pollVideo() {
    if (!window.SB_ENABLED) return;
    const video = document.querySelector('video');
    if (!video) return;

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    if (videoId && videoId !== sbCurrentVideo) {
      sbCurrentVideo = videoId;
      fetchSponsorBlockSegments(videoId).then(segments => {
        sbSegments = segments;
        if (video.duration) {
          renderSegments(video.duration);
        }
      });
    }

    if (videoId && video.duration) {
      const durationDiff = Math.abs(lastRenderedDuration - video.duration);
      if (sbSegments.length > 0 && (sbOverlayElements.length === 0 || durationDiff > 1)) {
         renderSegments(video.duration);
      }
    }

    checkVideoTime(video);
  }

  setInterval(pollVideo, 500);
  
  window.addEventListener('yt-navigate-finish', () => {
     sbSegments = [];
     sbOverlayElements.forEach(el => el.remove());
     sbOverlayElements = [];
     lastRenderedDuration = 0;
     sbCurrentVideo = null;
  });


  const styleEl = document.createElement('style');
  styleEl.id = 'yt-desktop-adblock-css';
  styleEl.textContent = `
    ytd-promoted-sparkles-web-renderer,
    ytd-display-ad-renderer,
    ytd-video-masthead-ad-advertiser-info-renderer,
    ytd-video-masthead-ad-primary-video-renderer,
    ytd-in-feed-ad-layout-renderer,
    ytd-ad-slot-renderer,
    yt-about-this-ad-renderer,
    yt-mealbar-promo-renderer,
    ytd-statement-banner-renderer,
    ytd-banner-promo-renderer,
    .ytd-video-masthead-ad-v3-renderer,
    div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
    div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
    div#main-container.style-scope.ytd-promoted-video-renderer,
    div#presence-container.style-scope.ytd-promoted-sparkles-web-renderer,
    ytd-rich-item-renderer:has(.ytd-badge-supported-renderer),
    ytd-rich-item-renderer:has(#ad-badge),
    ytd-rich-item-renderer:has([aria-label="Sponsored"]),
    ytd-rich-item-renderer:has(path[d="M19,10h-2V7h-3V5h5V10z M19,19h-5v-2h3v-3h2V19z M5,14h2v3h3v2H5V14z M5,5h5v2H7v3H5V5z M22,12 c0,5.5-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2S22,6.5,22,12z M21,12c0-5-4-9-9-9c-5,0-9,4-9,9c0,5,4,9,9,9C17,21,21,17,21,12z"]),
    ytd-compact-video-renderer:has(.ytd-badge-supported-renderer),
    ytd-compact-video-renderer:has(#ad-badge),
    ytd-action-companion-ad-renderer,
    a[href^="https://www.googleadservices.com/pagead/aclk"],
    .ytp-ad-player-overlay,
    .ytp-ad-overlay-container
    {
        display: none !important;
    }
  `;
  
  window.toggleAdblockCSS = function(enabled) {
    if (enabled) {
      if (!document.head.contains(styleEl)) {
        document.head.appendChild(styleEl);
      }
    } else {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    }
  };


  setInterval(() => {
    if (!window.ADBLOCK_ENABLED) return;
    

    const video = document.querySelector('video');
    const adContainer = document.querySelector('.ad-showing, .ad-interrupting');
    if (video && adContainer) {
      video.playbackRate = 16.0;
      if (video.duration && video.currentTime < video.duration - 0.5) {
        video.currentTime = video.duration - 0.5;
      }
      
      const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container');
      if (skipBtn) skipBtn.click();
    }


    const badges = document.querySelectorAll('.ytd-badge-supported-renderer, #ad-badge, .badge-shape-wiz__text, #ad-info, .ytd-ad-slot-renderer');
    for (const badge of badges) {
       if (badge.innerText && badge.innerText.toLowerCase().includes('sponsored')) {
          const container = badge.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer');
          if (container) {
             container.style.display = 'none';
          }
       }
    }
  }, 300);


  window.addEventListener('DOMContentLoaded', () => {
    if (window.ADBLOCK_ENABLED) {
      window.toggleAdblockCSS(true);
    }
  });
}
