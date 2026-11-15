// Load the embedded player only after an explicit Play action.
document.querySelectorAll('[data-project-video]').forEach(frame => {
  const button = frame.querySelector('.project-video-play');
  button.hidden = false;
  button.addEventListener('click', () => {
    const player = document.createElement('iframe');
    player.src = `https://www.youtube-nocookie.com/embed/${frame.dataset.projectVideo}?autoplay=1&playsinline=1&rel=0`;
    player.title = frame.dataset.videoTitle;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(player);
    player.focus();
  }, {once: true});
});
