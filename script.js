
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const audioPlayer = document.getElementById('audio-player');
            const playBtn = document.getElementById('play-btn');
            const playIcon = document.getElementById('play-icon');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const progressBar = document.getElementById('progress-bar');
            const currentTimeEl = document.getElementById('current-time');
            const durationEl = document.getElementById('duration');
            const songTitle = document.getElementById('song-title');
            const songArtist = document.getElementById('song-artist');
            const albumImage = document.getElementById('album-image');
            const albumArt = document.getElementById('album-art');
            const volumeControl = document.getElementById('volume-control');
            const shuffleBtn = document.getElementById('shuffle-btn');
            const repeatBtn = document.getElementById('repeat-btn');
            const playlistEl = document.getElementById('playlist');
            const autoplayToggle = document.getElementById('autoplay-toggle');
            const addSongBtn = document.getElementById('add-song-btn');
            const themeToggle = document.getElementById('theme-toggle');
            
            // Song data
            let songs = [
                {
                    title: "Saiyaara",
                    artist: "Faheem Abdullah",
                    src: "./Saiyaara-128kbps.mp3",
                    image: "./Saiyaara.webp"
                },
                {
                    title: "Thodi Si Daaru",
                    artist: "AP Dhillon",
                    src: "./Thodi Si Daaru-128kbps.mp3",
                    image: "./AP Dhillon.jpg"
                },
                {
                    title: "Aavan Jaavan From WAR 2",
                    artist: "Pritam",
                    src: "./Aavan Jaavan From WAR 2-128kbps.mp3",
                    image: "./Aavan-img.jpg"
                },
                {
                    title: "Ye Kaisa Ishq",
                    artist: "Gurpreet Saini",
                    src: "./Ye Kaisa Ishq-128kbps.mp3",
                    image: "./Gurpreet-img.jpg"
                },
                {
                    title: "Morni",
                    artist: "Darshan Raval",
                    src: "./CodeAlpha-Music Player\Morni-128kbps.mp3",
                    image: "./Darshan Raval.jpg"
                }
            ];
            
            let currentSongIndex = 0;
            let isPlaying = false;
            let isShuffle = false;
            let isRepeat = false;
            
            // Initialize player
            function initPlayer() {
                loadSong(currentSongIndex);
                renderPlaylist();
                
                // Set initial volume
                audioPlayer.volume = volumeControl.value / 100;
            }
            
            // Load song
            function loadSong(index) {
                const song = songs[index];
                songTitle.textContent = song.title;
                songArtist.textContent = song.artist;
                albumImage.src = song.image;
                audioPlayer.src = song.src;
                
                // Highlight current song in playlist
                updatePlaylistHighlight();
            }
            
            // Play song
            function playSong() {
                isPlaying = true;
                playIcon.classList.replace('fa-play', 'fa-pause');
                albumArt.classList.remove('paused');
                audioPlayer.play();
            }
            
            // Pause song
            function pauseSong() {
                isPlaying = false;
                playIcon.classList.replace('fa-pause', 'fa-play');
                albumArt.classList.add('paused');
                audioPlayer.pause();
            }
            
            // Next song
            function nextSong() {
                if (isShuffle) {
                    let newIndex;
                    do {
                        newIndex = Math.floor(Math.random() * songs.length);
                    } while (newIndex === currentSongIndex && songs.length > 1);
                    currentSongIndex = newIndex;
                } else {
                    currentSongIndex = (currentSongIndex + 1) % songs.length;
                }
                
                loadSong(currentSongIndex);
                if (isPlaying) playSong();
            }
            
            // Previous song
            function prevSong() {
                if (audioPlayer.currentTime > 3) {
                    // If song has been playing for more than 3 seconds, restart it
                    audioPlayer.currentTime = 0;
                } else {
                    // Otherwise go to previous song
                    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
                    loadSong(currentSongIndex);
                    if (isPlaying) playSong();
                }
            }
            
            // Update progress bar
            function updateProgress() {
                const { currentTime, duration } = audioPlayer;
                const progressPercent = (currentTime / duration) * 100;
                progressBar.value = progressPercent;
                
                // Update time display
                currentTimeEl.textContent = formatTime(currentTime);
                
                // Update duration if not already set
                if (duration) {
                    durationEl.textContent = formatTime(duration);
                }
            }
            
            // Set progress
            function setProgress() {
                const progressPercent = progressBar.value;
                audioPlayer.currentTime = (progressPercent / 100) * audioPlayer.duration;
            }
            
            // Format time
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
            }
            
            // Update volume
            function updateVolume() {
                audioPlayer.volume = volumeControl.value / 100;
            }
            
            // Render playlist
            function renderPlaylist() {
                playlistEl.innerHTML = '';
                
                songs.forEach((song, index) => {
                    const li = document.createElement('li');
                    li.className = `flex items-center p-2 rounded hover:bg-gray-600 cursor-pointer ${index === currentSongIndex ? 'bg-gray-600' : ''}`;
                    li.innerHTML = `
                        <img src="${song.image}" alt="${song.title}" class="w-10 h-10 rounded mr-3">
                        <div class="flex-1">
                            <h4 class="font-medium truncate">${song.title}</h4>
                            <p class="text-xs text-gray-400">${song.artist}</p>
                        </div>
                        <span class="text-xs text-gray-400">${index === currentSongIndex && isPlaying ? '<i class="fas fa-volume-up"></i>' : ''}</span>
                    `;
                    
                    li.addEventListener('click', () => {
                        currentSongIndex = index;
                        loadSong(currentSongIndex);
                        playSong();
                    });
                    
                    playlistEl.appendChild(li);
                });
            }
            
            // Update playlist highlight
            function updatePlaylistHighlight() {
                const playlistItems = playlistEl.querySelectorAll('li');
                playlistItems.forEach((item, index) => {
                    if (index === currentSongIndex) {
                        item.classList.add('bg-gray-600');
                        const icon = isPlaying ? '<i class="fas fa-volume-up"></i>' : '';
                        item.querySelector('div + span').innerHTML = icon;
                    } else {
                        item.classList.remove('bg-gray-600');
                        item.querySelector('div + span').innerHTML = '';
                    }
                });
            }
            
            // Add new song
            function addNewSong() {
                const title = prompt("Enter song title:");
                if (!title) return;
                
                const artist = prompt("Enter artist name:");
                if (!artist) return;
                
                const src = prompt("Enter audio URL:");
                if (!src) return;
                
                const newSong = {
                    title,
                    artist,
                    src,
                    image: "https://source.unsplash.com/random/400x400/?music"
                };
                
                songs.push(newSong);
                renderPlaylist();
            }
            
            // Toggle theme
            function toggleTheme() {
                document.body.classList.toggle('bg-gray-100');
                document.body.classList.toggle('text-gray-900');
                
                const player = document.querySelector('.bg-gray-800');
                player.classList.toggle('bg-gray-100');
                player.classList.toggle('text-gray-900');
                
                const playlist = document.querySelector('.bg-gray-700');
                playlist.classList.toggle('bg-gray-200');
                
                const settings = document.querySelector('.bg-gray-800');
                settings.classList.toggle('bg-gray-200');
                
                const themeIcon = themeToggle.querySelector('i');
                if (themeIcon.classList.contains('fa-moon')) {
                    themeIcon.classList.replace('fa-moon', 'fa-sun');
                } else {
                    themeIcon.classList.replace('fa-sun', 'fa-moon');
                }
            }
            
            // Event Listeners
            playBtn.addEventListener('click', () => {
                isPlaying ? pauseSong() : playSong();
                updatePlaylistHighlight();
            });
            
            prevBtn.addEventListener('click', prevSong);
            nextBtn.addEventListener('click', nextSong);
            
            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('ended', () => {
                if (isRepeat) {
                    audioPlayer.currentTime = 0;
                    playSong();
                } else if (autoplayToggle.checked) {
                    nextSong();
                } else {
                    pauseSong();
                }
            });
            
            progressBar.addEventListener('input', setProgress);
            volumeControl.addEventListener('input', updateVolume);
            
            shuffleBtn.addEventListener('click', () => {
                isShuffle = !isShuffle;
                shuffleBtn.classList.toggle('text-blue-400');
                shuffleBtn.classList.toggle('text-gray-400');
            });
            
            repeatBtn.addEventListener('click', () => {
                isRepeat = !isRepeat;
                repeatBtn.classList.toggle('text-blue-400');
                repeatBtn.classList.toggle('text-gray-400');
            });
            
            addSongBtn.addEventListener('click', addNewSong);
            themeToggle.addEventListener('click', toggleTheme);
            
            // Initialize
            initPlayer();
        });
    