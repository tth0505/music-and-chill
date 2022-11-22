const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

/** Các chức năng:
 * A1 - Render playlist ra màn hình 
 * A2 - CD rotate 
 * A3 - Ấn để ra playlist 
 * A4 - Play,pause,seek + chỉnh âm lượng
 * A5 - Next, previous 
 * A6 - Random song 
 * A7 - Next or Repeat when ended
 * A8 - Active song trong playlist
 * A9 - Scroll active song lên view
 * A10 - Play song khi click
 */

const player = $('.music_player')
const cd = $('.cd')
const titleSongName = $('.title_name h2');
const titleSongArtist = $('.title_name h4');
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const volumnBar = $('.volumn_value');
const timeCurrent = $('.progress_time-current');
const timeDuration = $('.progress_time-duration');
const volumnUp = $('.volumn_icon');
const volumnMute = $('.mute');
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Sầu Hồng Gai',
            singer: 'G5R Squad',
            path: './assets/music/SauHongGai-G5R.mp3',
            image: './assets/img/sau-hong-gai.png'
        },
        {
            name: 'Tình Ka',
            singer: 'G5R Squad',
            path: './assets/music/TinhKa-G5R.mp3',
            image: './assets/img/tinh-ka.png'
        },
        {
            name: 'Than Thân',
            singer: 'G5R Squad',
            path: './assets/music/ThanThan-G5R.mp3',
            image: './assets/img/than-than.png'
        },
        {
            name: 'Chí Khí Nam Nhi',
            singer: 'G5R Squad',
            path: './assets/music/ChiKhiNamNhi-G5R-7211093.mp3',
            image: './assets/img/chi-khi-nam-nhi.png'
        },
        {
            name: 'Hùng Long Phong Ba',
            singer: 'G5R Squad',
            path: './assets/music/HungLongPhongBa-G5R-7211133.mp3',
            image: './assets/img/hung-long-phong-ba.png'
        },
        {
            name: 'Miền Cực Lạc',
            singer: 'G5R Squad',
            path: './assets/music/MienCucLac-DanhKaG5R-7205798.mp3',
            image: './assets/img/mien-cuc-lac.png'
        },
        {
            name: 'Nhất Long Thăng Thiên',
            singer: 'G5R Squad',
            path: './assets/music/NhatLongThangThien-G5R-7198473.mp3',
            image: './assets/img/nhat-long-thang-thien.png'
        },
        {
            name: 'Phong Trần',
            singer: 'G5R Squad',
            path: './assets/music/PhongTran-G5R.mp3',
            image: './assets/img/phong-tran.png'
        },
        {
            name: 'Thước Đo',
            singer: 'G5R Squad',
            path: './assets/music/ThuocDo-AnhRongG5R-7564929.mp3',
            image: './assets/img/thuoc-do.png'
        },
        {
            name: 'Họa Mây',
            singer: 'X2X',
            path: './assets/music/HoaMayCoGiangTinh2-X2XDinhLong-6558765.mp3',
            image: './assets/img/hoa-may.png'
        },
        {
            name: 'Cố Giang Tình',
            singer: 'X2X',
            path: './assets/music/CoGiangTinh-X2X-6257264.mp3',
            image: './assets/img/co-giang-tinh.png'
        },
        {
            name: 'Cưa Là Đổ',
            singer: 'X2X',
            path: './assets/music/CuaLaDo-PhatHoX2X-7113266.mp3',
            image: './assets/img/cua-la-do.png'
        },
        {
            name: 'Yêu Là Cưới',
            singer: 'X2X',
            path: './assets/music/YeuLaCuoi-PhatHoX2X-7099562.mp3',
            image: './assets/img/yeu-la-cuoi.png'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
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
        timeCurrent.innerText = `00:00`
        timeDuration.innerText = `00:00`
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            // Hiển thị thời gian bài hát
            let current_minutes = Math.floor(audio.currentTime/60);
            let current_seconds = Math.floor(audio.currentTime - current_minutes * 60);
            let duration_minutes = Math.floor(audio.duration/60);
            let duration_seconds = Math.floor(audio.duration - duration_minutes * 60);
            if (current_minutes < 10){
                current_minutes = `0${current_minutes}`
            }
            if(current_seconds < 10){
                current_seconds = `0${current_seconds}`
            }
            if(duration_minutes < 10){
                duration_minutes = `0${duration_minutes}`
            }
            if(duration_seconds < 10){
                duration_seconds = `0${duration_seconds}`
            }
            timeCurrent.innerText = `${current_minutes}:${current_seconds}`
            timeDuration.innerText = `${duration_minutes}:${duration_seconds}`
        }

        

        // Xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100 * e.target.value)
            audio.currentTime = seekTime
        }

        // Xử lí âm lượng 
        volumnBar.oninput = function(e){
            theVolume = e.target.value /100;
            audio.volume = theVolume;
            if(theVolume === 0){
                volumnUp.classList.remove('overBlock');
                volumnMute.classList.add('overBlock');
            }else{
                volumnMute.classList.remove('overBlock');
                volumnUp.classList.add('overBlock');
            }
        }
        volumnUp.onclick = function(){
            volumnUp.classList.remove('overBlock');
            volumnMute.classList.add('overBlock');
            audio.volume = 0;
            volumnBar.value = 0;
        }
        volumnMute.onclick = function(){
            volumnMute.classList.remove('overBlock');
            volumnUp.classList.add('overBlock');
            audio.volume = 1;
            volumnBar.value = 100;
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
         
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }

            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý phát lại một bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)

        },

        // Xử lý bật / tắt random bài hát
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)           
        }

        // Xử lý next bài hát khi end
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {

                // Xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào option bài hát
                if(e.target.closest('.option')) {

                }

            }
        }

    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'start'
            })
        }, 300)
    },

    loadCurrentSong: function() {
        titleSongName.innerText = this.currentSong.name
        titleSongArtist.innerText = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRepeat = this.config.isRepeat
        this.isRandom = this.config.isRandom
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }

        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        // Gán cấu hình từ config vào app
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy app
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiện thị trạng thái ban đầu của button repeat & random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start()