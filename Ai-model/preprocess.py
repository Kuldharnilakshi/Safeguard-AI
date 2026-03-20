import librosa
import numpy as np

def extract_features(file_path):
    try:
        audio, sample_rate = librosa.load(file_path, duration=3, offset=0.5)

        # ❗ Skip very short audio
        if len(audio) < 1000:
            return None

        audio = librosa.util.normalize(audio)

        # MFCC
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfccs = np.mean(mfccs.T, axis=0)

        # Chroma
        stft = np.abs(librosa.stft(audio, n_fft=512))
        chroma = librosa.feature.chroma_stft(S=stft, sr=sample_rate)
        chroma = np.mean(chroma.T, axis=0)

        # Mel
        mel = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
        mel = np.mean(mel.T, axis=0)

        return np.hstack([mfccs, chroma, mel])

    except Exception as e:
        print("Error processing:", file_path, "|", e)
        return None