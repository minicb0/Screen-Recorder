var startBtn = document.getElementById('start');
var stopBtn = document.getElementById('stop');
var saveBtn = document.getElementById('save');
var filename = document.getElementById('filename');
var saveAnchor = document.getElementById('saveAnchor');
var video = document.getElementById('video');

var mediaRecorder;
var stream;

startBtn.addEventListener('click', () => {
    startBtn.classList.add('hide')
    stopBtn.classList.remove('hide')
    saveBtn.classList.add('hide')
    filename.classList.add('hide')
    video.src = ''
    video.controls = false
    video.load()
    startRecording();
})

stopBtn.addEventListener('click', () => {
    startBtn.classList.remove('hide')
    stopBtn.classList.add('hide')
    saveBtn.classList.remove('hide')
    filename.classList.remove('hide')
    video.controls = true
    video.load()
    mediaRecorder.stop();
    stream.getVideoTracks()[0].stop();
})

saveBtn.addEventListener('click', () => {
    startBtn.classList.remove('hide')
    stopBtn.classList.add('hide')
    saveAnchor.href = video.src
    if (filename.value.trim() != '') {
        saveAnchor.setAttribute('download', `${filename.value.trim()}.mp4`)
    } else {
        saveAnchor.setAttribute('download', `video-recorder.mp4`)
    }
})

async function startRecording() {
    stream = await navigator.mediaDevices.getDisplayMedia({
        video: { MediaSource: "screen" }
    })

    mediaRecorder = new MediaRecorder(stream)
    const chunks = []
    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
    }
    mediaRecorder.onstop = (e) => {
        const completeBlob = new Blob(chunks, { type: chunks[0].type })
        video.src = URL.createObjectURL(completeBlob)
    }
    mediaRecorder.start()

    stream.getVideoTracks()[0].onended = function () {
        startBtn.classList.remove('hide')
        stopBtn.classList.add('hide')
        saveBtn.classList.remove('hide')
        filename.classList.remove('hide')
        video.controls = true
        video.load()
        mediaRecorder.stop();
        stream.getVideoTracks()[0].stop();
    }
}