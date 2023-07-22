document.addEventListener('DOMContentLoaded', () => {
    "use strict"

    let interval = null, pause = false, delta = null

    const timerForm = document.getElementById("timerForm"),
        stopBtn = document.getElementById('stopBtn'),
        inputEl = document.querySelector('input')

    const timer = {
        hours10: document.getElementById('hours10'),
        hours: document.getElementById('hours'),
        minutes10: document.getElementById('minutes10'),
        minutes: document.getElementById('minutes'),
        seconds10: document.getElementById('seconds10'),
        seconds: document.getElementById('seconds'),
    }

    let buffer = {
        hours10: Number(hours10.innerHTML),
        hours: Number(hours.innerHTML),
        minutes10: Number(minutes10.innerHTML),
        minutes: Number(minutes.innerHTML),
        seconds10: Number(seconds10.innerHTML),
        seconds: Number(seconds.innerHTML),
    }

    inputEl.addEventListener("input", (e) => {
        const value = e.target.value
        const numbersOnly = value.replace(/\D/g, "")
        e.target.value = numbersOnly
    })

    timerForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        //time - get input by name
        const time = formData.get('time')
        if (interval) clearInterval(interval)
        startTimer(time)
    })

    stopBtn.addEventListener('click', (e) => {
        pause = false
        e.preventDefault()
        timerForm.reset()
        if (interval) clearInterval(interval)
        setTimer({ hours10: 0, hours: 0, minutes10: 0, minutes: 0, seconds10: 0, seconds: 0 })
    })

    pauseBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (interval && !pause) {
            pauseBtn.innerHTML = `
                <div class='pause-icon'></div>
                <div class='pause-icon'></div>
                Продолжить
            `
            clearInterval(interval)
            pause = true
            return
        }

        if (pause) {
            pauseBtn.innerHTML = `
                <div class='pause-icon'></div>
                <div class='pause-icon'></div>
                Пауза
            `
            pauseTimer()
            pause = false
            return
        }
    })

    function startTimer(time) {
        pause = false
        // дата + мин из инпута * 60 сек * 1000 мл.сек
        const end = Date.now() + time * 60 * 1000
        onInterval(end)
    }

    function pauseTimer() {
        const end = Date.now() + delta
        onInterval(end)
    }

    function onInterval(end) {
        interval = setInterval(() => {
            const now = Date.now()
            delta = end - now

            if (delta && delta < 0) {
                clearInterval(interval)
                return
            }

            setTimer({ ...msToTime(delta) })
        }, 1000)
    }

    function setTimer({ hours10, hours, minutes10, minutes, seconds10, seconds }) {
        timer.hours10.innerHTML = hours10 !== buffer.hours10 ? `<div class='animate'>${hours10}</div>` : hours10
        timer.hours.innerHTML = hours !== buffer.hours ? `<div class='animate'>${hours}</div>` : hours
        timer.minutes10.innerHTML = minutes10 !== buffer.minutes10 ? `<div class='animate'>${minutes10}</div>` : minutes10
        timer.minutes.innerHTML = minutes !== buffer.minutes ? `<div class='animate'>${minutes}</div>` : minutes
        timer.seconds10.innerHTML = seconds10 !== buffer.seconds10 ? `<div class='animate'>${seconds10}</div>` : seconds10
        timer.seconds.innerHTML = seconds !== buffer.seconds ? `<div class='animate'>${seconds}</div>` : seconds

        buffer = { hours10, hours, minutes10, minutes, seconds10, seconds }
    }
})

// helpers
function msToTime(duration) {
    let sec = Math.floor((duration / 1000) % 60),
        min = Math.floor((duration / (1000 * 60)) % 60),
        hrs = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hrs = (hrs < 10) ? "0" + hrs : hrs
    min = (min < 10) ? "0" + min : min
    sec = (sec < 10) ? "0" + sec : sec

    const hours10 = +String(hrs).charAt(0),
        hours = +String(hrs).charAt(1),
        minutes10 = +String(min).charAt(0),
        minutes = +String(min).charAt(1),
        seconds10 = +String(sec).charAt(0),
        seconds = +String(sec).charAt(1)

    return { hours10, hours, minutes10, minutes, seconds10, seconds }
}