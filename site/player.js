/* MASS EFFECT: REFUSE — cinematic archive player. Plain JS, no dependencies. */
(function () {
  'use strict';
  const cfg = window.REFUSE_MEDIA || {};
  const qs = new URLSearchParams(location.search);
  const $ = (id) => document.getElementById(id);

  const player = $('player');
  const video = $('video');
  const subs = $('subs');
  const bigplay = $('bigplay');
  const playBtn = $('play');
  const restartBtn = $('restart');
  const muteBtn = $('mute');
  const volume = $('volume');
  const ccBtn = $('cc');
  const trailerBtn = $('trailer');
  const fsBtn = $('fullscreen');
  const progress = $('progress');
  const played = $('played');
  const buffer = $('buffer');
  const knob = $('knob');
  const markers = $('markers');
  const current = $('current');
  const duration = $('duration');
  const nowPlaying = $('nowPlaying');
  const modeTag = $('modeTag');
  const status = $('status');
  const chapterList = $('chapterList');
  const runtime = $('runtime');
  const links = $('links');

  let chapters = [];
  let totalSeconds = 0;
  let mode = 'film';
  let pendingSeek = null;

  const fmt = (s) => {
    if (!isFinite(s)) return '0:00';
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  };

  const showStatus = (text) => {
    if (!text) {
      status.hidden = true;
      return;
    }
    status.textContent = text;
    status.hidden = false;
  };

  const sourceFor = (m) => {
    const override = qs.get(m === 'film' ? 'src' : 'trailer');
    if (override) return override;
    return m === 'film' ? cfg.film : cfg.trailer;
  };

  const setMode = (m) => {
    mode = m;
    const src = sourceFor(m);
    const wasPlaying = !video.paused;
    video.src = src || '';
    subs.src = m === 'film' ? 'generated/film.vtt' : 'generated/film.vtt';
    subs.track && (subs.track.mode = ccBtn.classList.contains('on') && m === 'film' ? 'showing' : 'hidden');
    modeTag.textContent = m === 'film' ? 'FILM' : 'TRAILER';
    trailerBtn.classList.toggle('on', m === 'trailer');
    trailerBtn.setAttribute('aria-pressed', String(m === 'trailer'));
    if (!src) showStatus('MEDIA NOT YET PUBLISHED — SEE README FOR THE RENDER WORKFLOW');
    else showStatus('');
    video.load();
    if (wasPlaying) video.play().catch(() => {});
    updateChapters();
  };

  const chapterAt = (t) => {
    let c = chapters[0];
    for (const ch of chapters) if (t >= ch.start) c = ch;
    return c;
  };

  const updateChapters = () => {
    const c = mode === 'film' ? chapterAt(video.currentTime || 0) : null;
    nowPlaying.textContent = c ? (c.number === 0 ? 'PROLOGUE' : 'CHAPTER ' + c.number) + ' — ' + c.title.toUpperCase() : 'TRAILER';
    for (const el of chapterList.children) el.firstElementChild.classList.toggle('active', !!c && Number(el.dataset.number) === c.number && mode === 'film');
  };

  const renderChapters = () => {
    chapterList.innerHTML = '';
    for (const c of chapters) {
      const li = document.createElement('li');
      li.dataset.number = String(c.number);
      const b = document.createElement('button');
      b.className = 'chapter';
      b.type = 'button';
      b.innerHTML =
        '<span class="num">' + (c.number === 0 ? 'PRO' : String(c.number).padStart(2, '0')) + '</span>' +
        '<span class="name">' + c.title.toUpperCase() + '</span>' +
        '<span class="tc">' + fmt(c.start) + '</span>';
      b.addEventListener('click', () => seekChapter(c));
      li.appendChild(b);
      chapterList.appendChild(li);
    }
    markers.innerHTML = '';
    if (totalSeconds > 0) {
      for (const c of chapters) {
        if (c.start === 0) continue;
        const m = document.createElement('div');
        m.className = 'marker';
        m.style.left = (c.start / totalSeconds) * 100 + '%';
        m.title = c.title;
        markers.appendChild(m);
      }
    }
    runtime.textContent = fmt(totalSeconds);
  };

  const seekChapter = (c) => {
    if (mode !== 'film') setMode('film');
    const go = () => {
      video.currentTime = c.start + 0.05;
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) go();
    else {
      pendingSeek = go;
    }
    updateChapters();
  };

  const togglePlay = () => {
    if (video.paused) video.play().catch(() => showStatus('PLAYBACK BLOCKED — TAP PLAY AGAIN'));
    else video.pause();
  };

  // wiring
  bigplay.addEventListener('click', () => {
    bigplay.hidden = true;
    video.muted = false;
    togglePlay();
  });
  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', () => {
    player.classList.add('touched');
    togglePlay();
  });
  restartBtn.addEventListener('click', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
  });
  volume.addEventListener('input', () => {
    video.volume = Number(volume.value);
    video.muted = video.volume === 0;
  });
  ccBtn.addEventListener('click', () => {
    const on = !ccBtn.classList.contains('on');
    ccBtn.classList.toggle('on', on);
    ccBtn.setAttribute('aria-pressed', String(on));
    if (subs.track) subs.track.mode = on ? 'showing' : 'hidden';
  });
  trailerBtn.addEventListener('click', () => setMode(mode === 'film' ? 'trailer' : 'film'));
  fsBtn.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (player.requestFullscreen) player.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });

  const seekTo = (fraction) => {
    if (!isFinite(video.duration)) return;
    video.currentTime = Math.max(0, Math.min(video.duration, fraction * video.duration));
  };
  const progressFraction = (ev) => {
    const r = progress.getBoundingClientRect();
    const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
    return Math.max(0, Math.min(1, x / r.width));
  };
  let scrubbing = false;
  progress.addEventListener('pointerdown', (ev) => {
    scrubbing = true;
    progress.setPointerCapture(ev.pointerId);
    seekTo(progressFraction(ev));
  });
  progress.addEventListener('pointermove', (ev) => {
    if (scrubbing) seekTo(progressFraction(ev));
  });
  progress.addEventListener('pointerup', () => (scrubbing = false));
  progress.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') video.currentTime += 5;
    if (ev.key === 'ArrowLeft') video.currentTime -= 5;
  });

  video.addEventListener('play', () => {
    player.classList.add('playing');
    player.classList.remove('paused');
    bigplay.hidden = true;
  });
  video.addEventListener('pause', () => {
    player.classList.remove('playing');
    player.classList.add('paused');
  });
  video.addEventListener('volumechange', () => {
    player.classList.toggle('muted', video.muted || video.volume === 0);
    volume.value = video.muted ? 0 : video.volume;
  });
  video.addEventListener('loadedmetadata', () => {
    duration.textContent = fmt(video.duration);
    if (pendingSeek) {
      const f = pendingSeek;
      pendingSeek = null;
      f();
    }
  });
  video.addEventListener('timeupdate', () => {
    const d = video.duration || 0;
    const f = d ? video.currentTime / d : 0;
    played.style.width = f * 100 + '%';
    knob.style.left = f * 100 + '%';
    current.textContent = fmt(video.currentTime);
    progress.setAttribute('aria-valuenow', String(Math.round(f * 100)));
    updateChapters();
  });
  video.addEventListener('progress', () => {
    try {
      if (video.buffered.length && video.duration) buffer.style.width = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100 + '%';
    } catch (e) {
      /* ignore */
    }
  });
  video.addEventListener('error', () => {
    showStatus('COULD NOT LOAD VIDEO — ' + (sourceFor(mode) || 'no source configured'));
  });
  video.addEventListener('ended', () => {
    player.classList.remove('playing');
    player.classList.add('paused');
    bigplay.hidden = false;
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
    switch (ev.key) {
      case ' ':
        ev.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        video.currentTime += 5;
        break;
      case 'ArrowLeft':
        video.currentTime -= 5;
        break;
      case 'f':
      case 'F':
        fsBtn.click();
        break;
      case 'c':
      case 'C':
        ccBtn.click();
        break;
      case 'm':
      case 'M':
        muteBtn.click();
        break;
      case 'r':
      case 'R':
        restartBtn.click();
        break;
      case 't':
      case 'T':
        trailerBtn.click();
        break;
      default:
        if (/^[1-8]$/.test(ev.key)) {
          const c = chapters.find((x) => x.number === Number(ev.key) - 1);
          if (c) seekChapter(c);
        }
    }
  });

  // links
  if (cfg.repo) {
    links.innerHTML =
      '<a href="' + cfg.repo + '">SOURCE REPOSITORY</a>' +
      (cfg.releases ? '<a href="' + cfg.releases + '">DOWNLOAD MP4</a>' : '') +
      '<a href="generated/film.vtt">SUBTITLES (VTT)</a>';
  }

  // boot
  fetch('generated/chapters.json')
    .then((r) => r.json())
    .then((data) => {
      chapters = data.chapters;
      totalSeconds = data.totalSeconds;
      renderChapters();
      setMode('film');
      player.classList.add('paused');
      video.volume = Number(volume.value);
      window.__refuseReady = true;
    })
    .catch(() => showStatus('CHAPTER DATA MISSING — RUN npm run site:build'));
})();
