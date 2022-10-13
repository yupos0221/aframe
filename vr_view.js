AFRAME.registerComponent('play-on-window-click', {
    init: function () {
      this.onClick = this.onClick.bind(this);
    },
    play: function () {
      window.addEventListener('click', this.onClick);
    },
    pause: function () {
      window.removeEventListener('click', this.onClick);
    },
    onClick: function (evt) {
      hideWaitMessage();
      // joinRoom(null);
      startMediaAndJoinRoom();
    }
});

AFRAME.registerComponent('hide-once-playing', {
    schema: {type: 'selector'},
    init: function () {
        this.onPlaying = this.onPlaying.bind(this);
        this.onPause = this.onPause.bind(this);
    },
    play: function () {
        if (this.data) {
        this.data.addEventListener('playing', this.onPlaying);
        this.data.addEventListener('pause', this.onPause);
        }
    },
    pause: function () {
        if (this.data) {
        this.data.removeEventListener('playing', this.onPlaying);
        this.data.removeEventListener('pause', this.onPause);
        }
    },
    onPlaying: function (evt) {
        this.el.setAttribute('visible', false);
    },
    onPause: function (evt) {
        this.el.setAttribute('visible', true);
    }
});

