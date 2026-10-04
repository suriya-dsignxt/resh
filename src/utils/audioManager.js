import bgMusicUrl from '../assets/audio/kalaivaniye.mp3';

let globalAudio = null;
let isPlaying = false;
const listeners = new Set();

const notifyListeners = () => {
    listeners.forEach(cb => cb(isPlaying));
};

export const getAudioInstance = () => {
    if (!globalAudio && typeof window !== 'undefined') {
        globalAudio = new Audio(bgMusicUrl);
        globalAudio.loop = true;
        globalAudio.volume = 0.6;
        globalAudio.preload = 'auto';

        globalAudio.onplay = () => {
            isPlaying = true;
            notifyListeners();
        };

        globalAudio.onpause = () => {
            isPlaying = false;
            notifyListeners();
        };

        // Attach global interaction listeners for instant automatic start
        const handleFirstUserGesture = () => {
            if (globalAudio && globalAudio.paused) {
                globalAudio.play().then(() => {
                    removeGestureListeners();
                }).catch(() => {});
            }
        };

        const removeGestureListeners = () => {
            const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll'];
            events.forEach(evt => {
                window.removeEventListener(evt, handleFirstUserGesture);
                document.removeEventListener(evt, handleFirstUserGesture);
            });
        };

        const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll'];
        events.forEach(evt => {
            window.addEventListener(evt, handleFirstUserGesture, { passive: true });
            document.addEventListener(evt, handleFirstUserGesture, { passive: true });
        });
    }
    return globalAudio;
};

export const playBgMusic = () => {
    const audio = getAudioInstance();
    if (audio) {
        return audio.play().then(() => {
            isPlaying = true;
            notifyListeners();
        }).catch(err => {
            console.log('Autoplay waiting for user gesture:', err);
        });
    }
};

export const pauseBgMusic = () => {
    if (globalAudio) {
        globalAudio.pause();
        isPlaying = false;
        notifyListeners();
    }
};

export const toggleBgMusic = () => {
    if (isPlaying) {
        pauseBgMusic();
    } else {
        playBgMusic();
    }
};

export const subscribeAudioState = (callback) => {
    listeners.add(callback);
    callback(isPlaying);
    return () => listeners.delete(callback);
};
