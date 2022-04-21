const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const LOCAL_STORAGE_KEY = 'My music list'

const playlist = $('.playlist')

const cd = $('.cd');

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const player = $('.player')
const toggleBtn = $('.btn-toggle-play')

const progress = $('#progress')

const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')

const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

var app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          name: "Chạy về nơi phía anh",
          singer: "Khac Viet",
          path: "./Music/song1.mp3",
          image: "./img/song1.jpg"
        },
        {
          name: "Thủ đô Cypher",
          singer: "RPT",
          path: "./Music/song2.mp3",
          image: "./img/song2.jpg"
        },
        {
          name: "Thần thoại",
          singer: "Dương Edward",
          path: "./Music/song3.mp3",
          image: "./img/song3.jpg"
        },
        {
          name: "Đêm lao xao",
          singer: "Hòa Minzy",
          path: "./Music/song4.mp3",
          image: "./img/song4.jpg"
        },
        {
          name: "Sài Gòn đau lòng quá",
          singer: "Hòa Minzy",
          path: "./Music/song5.mp3",
          image: "./img/song5.jpg"
        },
        {
          name: "Ngôi nhà hạnh phúc remix",
          singer: "Noo Phước Thịnh",
          path: "./Music/song6.mp3",
          image: "./img/song6.jpg"
        },
        {
          name: "Hạnh phúc mới piano",
          singer: "Bằng Cường",
          path: "./Music/song7.mp3",
          image: "./img/song7.jpg"
        }
      ],
    config: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
      this.config[key] = value;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.config));
    },
    defineProperties: function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
    },

    handleEvents: function() {
      _this = this;
      const cdWidth = cd.offsetWidth;

      // ***** CD Rotate *****
      const cdAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ], {
        duration: 10000, // 10s
        iterations: Infinity
      })
      cdAnimate.pause();

      // ***** Scroll top to resize CD *****
      document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const cdNewWidth = cdWidth - scrollTop > 0 ? cdWidth - scrollTop : 0;
        cd.style.width = cdNewWidth + 'px';
        cd.style.opacity = cdNewWidth/cdWidth
      }

      // ***** Play/Pause/Seek ***** 
        // 1) Handle play/pause audio, click (toggleBtn)
        toggleBtn.onclick = function() {
          if(_this.isPlaying ) {
            audio.pause();
          } else {
            audio.play();
          }
        }
        // 2) Handle play/pause UI (audio)
        audio.onplay = function() {
          _this.isPlaying = true;
          player.classList.add('playing');
          cdAnimate.play();
        }
        audio.onpause = function() {
          _this.isPlaying = false;
          player.classList.remove('playing');
          cdAnimate.pause();
        }
        // 3) Connect audio time to progress bar
        audio.ontimeupdate = function() {
          if(this.duration) {
            const progressPercent = this.currentTime / this.duration * 100;
            progress.value = progressPercent;
          }
        }
        // 4) Connect progress bar back to audio timeout
        progress.onchange = function() {
          const newProgressPercent = progress.value;
          const newCurrentTime = progress.value / 100 * audio.duration;
          audio.currentTime = newCurrentTime;
        }
      // ***** Next/Prev Btn *****
        // 1) Next button
        nextBtn.onclick = function() {
          if(_this.isRandom) {
            _this.randomSong();
          } else {
            _this.nextSong();
          }
          _this.render();
          _this.scrollToActiveSong();
          audio.play();
        }
        // 2) Prev button
        prevBtn.onclick = function() {
          if(_this.isRandom) {
            _this.randomSong();
          } else {
            _this.prevSong();
          }
          _this.render();
          _this.scrollToActiveSong();
          audio.play();
        }
      // ***** Random Btn UI*****
      randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom;
        _this.setConfig('isRandom', _this.isRandom);
        this.classList.toggle('active', _this.isRandom);
      }

      // ***** Repeat/End when a song ended *****
        // 1) Handle Repeat Btn UI
        repeatBtn.onclick = function() {
          _this.isRepeat = !_this.isRepeat;
        _this.setConfig('isRepeat', _this.isRepeat);
          this.classList.toggle('active', _this.isRepeat);
        }

        // 2) Handle Repeat Btn Logic
        audio.onended = function() {
          if(_this.isRepeat) {
            audio.play();
          } else {
            nextBtn.click();
          }
        }
      // ***** Click a song and play it *****
      playlist.onclick = function(e) {
        let songNode = e.target.closest('.song:not(.active)');
        if(songNode || !e.target.closest('.option')) {
          if(songNode) {
            _this.currentIndex = Number(songNode.dataset.index); //getAttribute('data-index)
            _this.loadCurrentSong();
            _this.render();
            _this.scrollToActiveSong();
            audio.play();
          }
          if(e.target.closest('.option')) {
            audio.pause();
          }
        }

      }
     
    },

    render: function() {
      const htmls = this.songs.map((song,index) => {
        return `
        <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index = ${index}>
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `
      })
      playlist.innerHTML = htmls.join('')
    },

    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    },

    loadConfig: function() {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;

      // Object.assign(this, this.config) => ko an toan
    },

    nextSong: function() {
      this.currentIndex++;
      if (this.currentIndex > this.songs.length - 1) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },

    prevSong: function() {
      this.currentIndex--;
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
    },

    randomSong: function() { 
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
      } while (this.currentIndex === newIndex)
      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      }, 200);
    },
    
    start: function() {
      this.loadConfig();

      this.defineProperties();

      this.render();

      this.loadCurrentSong();

      this.handleEvents();

      // Display config
      randomBtn.classList.toggle('active', _this.isRandom);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }
}

app.start();
