// SOP 辅助函数（Owner文件缺失的函数）
let sopGuideTimer = null;

function getToday() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getSOPData() {
  try { return JSON.parse(localStorage.getItem(STORAGE.SOP) || '{}'); } catch (e) { return {}; }
}

function saveSOPData(data) {
  localStorage.setItem(STORAGE.SOP, JSON.stringify(data));
}

function getSOPStreaks() {
  try { return JSON.parse(localStorage.getItem(STORAGE.SOP_STREAKS) || '{}'); } catch (e) { return {}; }
}

function saveSOPStreaks(streaks) {
  localStorage.setItem(STORAGE.SOP_STREAKS, JSON.stringify(streaks));
}

function updateSOPCatStreak(catId, catYes) {
  var streaks = getSOPStreaks();
  var today = getToday();
  if (!streaks[catId]) streaks[catId] = { streak: 0, lastDate: '' };
  if (catYes > 0) {
    if (streaks[catId].lastDate === today) {
      // same day, keep streak
    } else {
      var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      var ys = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0');
      if (streaks[catId].lastDate === ys) {
        streaks[catId].streak += 1;
      } else {
        streaks[catId].streak = 1;
      }
    }
    streaks[catId].lastDate = today;
  } else {
    streaks[catId].streak = 0;
    streaks[catId].lastDate = today;
  }
  saveSOPStreaks(streaks);
}

function getSOPHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE.SOP_HISTORY) || '[]'); } catch (e) { return []; }
}

function saveSOPToHistory(record) {
  var history = getSOPHistory();
  history.push(record);
  if (history.length > 30) history = history.slice(-30);
  localStorage.setItem(STORAGE.SOP_HISTORY, JSON.stringify(history));
}

function autoCloseSOPGuide() {
  if (sopGuideTimer) clearTimeout(sopGuideTimer);
  sopGuideTimer = setTimeout(function () {
    var overlay = document.getElementById('sopGuideOverlay');
    if (overlay) closeSOPGuide();
  }, 5000);
}
