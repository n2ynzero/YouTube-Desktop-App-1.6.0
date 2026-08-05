const SEPARATOR = ' • ';
const MAX_TIMESTAMP = 2147483647000;

export const PAGE_SCRAPE_JS = `(function () {
  function textOf(selector) {
    var el = document.querySelector(selector);
    return el && el.textContent ? el.textContent.trim() : null;
  }

  function videoState() {
    var v = document.querySelector('video');
    if (!v) return null;
    var duration = isFinite(v.duration) && v.duration > 0 ? v.duration : null;
    return {
      position: isFinite(v.currentTime) && v.currentTime > 0 ? v.currentTime : 0,
      duration: duration,
      paused: !!v.paused
    };
  }

  var path = location.pathname.toLowerCase();
  
  if (path === '/watch') {
    var title = textOf('h1.ytd-watch-metadata') || document.title.replace(/^\\(\\d+\\) /, '').replace(' - YouTube', '');
    var author = textOf('#owner-name a') || textOf('.ytd-channel-name a') || null;
    return JSON.stringify({
      kind: 'watch',
      title: title || null,
      author: author || null,
      video: videoState(),
      url: location.href
    });
  }

  if (path.startsWith('/@') || path.startsWith('/c/') || path.startsWith('/channel/')) {
    var channelName = textOf('#channel-name .ytd-channel-name') || document.title.replace(/^\\(\\d+\\) /, '').replace(' - YouTube', '');
    return JSON.stringify({ kind: 'channel', channel: channelName, url: location.href });
  }

  return JSON.stringify({ kind: null, url: location.href });
})()`;

export function contextFromUrl(url) {
  let path;
  try {
    path = new URL(url).pathname.toLowerCase();
  } catch {
    return { activity: { details: 'Using YouTube', state: 'Watching videos' }, track: null };
  }

  if (path === '/watch') {
    return { activity: { details: 'Watching something...', state: 'Loading...' }, track: 'watch' };
  }
  if (path.startsWith('/@') || path.startsWith('/c/') || path.startsWith('/channel/')) {
    return { activity: { details: 'Browsing a channel', state: 'Looking for videos...' }, track: 'channel' };
  }

  const activity =
    (path === '/feed/subscriptions' && { details: 'Checking subscriptions', state: 'Seeing what is new' }) ||
    (path === '/feed/history' && { details: 'Looking at watch history', state: 'What did I watch again?' }) ||
    (path === '/results' && { details: 'Searching for videos', state: 'Looking for something specific' }) ||
    ((path === '/' || path === '') && { details: 'Browsing YouTube', state: 'On the home page' }) ||
    { details: 'Browsing YouTube', state: 'Exploring videos' };

  return { activity, track: null };
}

export function activityFromPage(data) {
  if (!data) return null;

  if (data.kind === 'channel') {
    if (!data.channel) return null;
    return { details: `Browsing ${data.channel}`, state: 'Checking out the channel', url: data.url };
  }

  if (data.kind === 'watch' && data.title) {
    const details = data.title;
    let state = data.author || 'Watching a video';

    const activity = { details, state, url: data.url };
    const video = data.video;

    if (video && video.duration) {
      if (video.paused) {
        activity.state = `(Paused) ${state}`;
      } else {
        const now = Date.now();
        const remaining = Math.max(0, video.duration - video.position);
        const end = now + Math.round(remaining * 1000);
        if (end < MAX_TIMESTAMP) {
          activity.startTimestamp = now - Math.round(video.position * 1000);
        }
      }
    }

    return activity;
  }

  return null;
}
