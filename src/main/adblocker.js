const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch');
const settings = require('./settings');
const { session } = require('electron');

let blocker = null;

async function initAdblocker() {
  if (blocker) return;

  try {
    blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
    if (blocker.config) {
      blocker.config.loadCosmeticFilters = false;
    }
    blocker.update({
      addedFilters: [
        '||youtube.com/pagead/*',
        '||youtube.com/api/stats/ads*',
        '||doubleclick.net^',
        '||googleadservices.com^',
        '||googlesyndication.com^',
        '||base44.com^'
      ]
    });
    applyAdblockerState();
  } catch (error) {
    console.error('Failed to initialize adblocker', error);
  }
}

function applyAdblockerState() {
  if (!blocker) return;

  const isEnabled = settings.get('adblockEnabled', true);
  const ytSession = session.fromPartition('persist:youtube');

  if (isEnabled) {
    blocker.enableBlockingInSession(ytSession);
  } else {
    try {
      blocker.disableBlockingInSession(ytSession);
    } catch (e) {}
  }
}

module.exports = { initAdblocker, applyAdblockerState };
