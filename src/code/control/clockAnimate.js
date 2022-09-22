// 控制器 时间动画
import * as Cesium from 'cesium';

function sprintf() {
    let args = arguments, string = args[0];
    for (let i = 1; i < args.length; i++) {
        let item = arguments[i];
        if (item < 10) {
            item = `0${item}`
        }
        string = string.replace('%02d', item);
    }
    return string;
}

class ClockAnimate {

    props = {
        left: 0,
        bottom: 0,
        width: 172
    }
    constructor(viewer) {
        this.container = viewer.container;
        this.viewer = viewer;
        this.clock = viewer.clock
        this.dom = document.createElement('div')
        this.dom.className = "gismap-clockanimate"
        this.timeDom = document.createElement('div')
        this.timeDom.className = 'gismap-time'
        this.multiplierDom = document.createElement('div')
        this.multiplierDom.className = 'gismap-multiplier'
        this.playDom = document.createElement('div')
        this.playDom.className = 'gismap-play'
        this.playBtn = document.createElement('div')
        this.playBtn.className = 'gismap-clock-btn'
        this.playBtn.innerHTML = ` <svg
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2202"
            width="24"
            height="24"
        >
            <path
            d="M256 287.616c0-65.877333 71.424-106.88 128.341333-73.728l384.64 224.426667c56.448 32.896 56.448 114.474667 0 147.413333l-384.64 224.341333C327.424 843.264 256 802.261333 256 736.426667V287.616zM725.973333 512L341.333333 287.616V736.426667L725.973333 512z"
            p-id="2203"
            >
            </path>
        </svg>`
        this.pauseBtn = document.createElement('div')
        this.pauseBtn.className = 'gismap-clock-btn'
        this.pauseBtn.innerHTML = ` <svg
        t="1663815440103"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2356"
        width="24"
        height="24"
      >
        <path
          d="M384 256a42.666667 42.666667 0 0 1 42.666667 42.666667v426.666666a42.666667 42.666667 0 1 1-85.333334 0V298.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m256 0a42.666667 42.666667 0 0 1 42.666667 42.666667v426.666666a42.666667 42.666667 0 1 1-85.333334 0V298.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z"
          p-id="2357"
        >
        </path>
      </svg>`



        this.playDom.appendChild(this.playBtn)
        this.playDom.appendChild(this.pauseBtn)
        this.dom.appendChild(this.playDom)
        this.dom.appendChild(this.timeDom)
        this.dom.appendChild(this.multiplierDom)
        this.container.appendChild(this.dom);

        this.selectDom = document.createElement('div')
        this.selectDom.className = "gismap-multiplier-select"

        this.selectDom.innerHTML = `<div>
            <div value="120" class="gismap-multiplier-select-item">x120</div>
            <div value="60" class="gismap-multiplier-select-item">x60</div>
            <div value="10" class="gismap-multiplier-select-item">x10</div>
            <div value="1" class="gismap-multiplier-select-item">x1</div>
        </div>`
        this.dom.appendChild(this.selectDom)
        this.create()
    }

    create() {
        this.renderDom()
        this.on()
        this.render(this.clock)

        this.playBtn.onclick = () => {
            this.clock.shouldAnimate = true
        }
        this.pauseBtn.onclick = () => {
            this.clock.shouldAnimate = false
        }
        this.multiplierDom.onclick = () => {
            if (this.selectDom.style.display === 'block') {
                this.selectDom.style.display = "none"
            } else {
                this.selectDom.style.display = "block"
            }

        }
        this.selectDom.onclick = (e) => {
            let value = e.target?.attributes?.value?.value || '1'
            this.clock.multiplier = parseInt(value)
            this.selectDom.style.display = "none"
        }
    }
    destroy() {
        this.off()
    }
    renderDom() {

    }
    on() {
        this.clock.onTick.addEventListener(this.onTick, this)
        this.clock.onStop.addEventListener(this.onStop, this)

    }
    off() {
        this.clock.onTick.removeEventListener(this.onTick)
        this.clock.onStop.removeEventListener(this.onStop)
    }
    onTick(clock) {
        this.render(clock)

    }
    onStop(clock) {
        // console.log('onStop', clock)
    }


    DateTimeFormatter(datetime, viewModel = null, ignoredate = null) {
        var julianDT = new Cesium.JulianDate()
        Cesium.JulianDate.addHours(datetime, 8, julianDT)
        var gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)
        var objDT
        if (ignoredate)
            objDT = ''
        else {
            objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day)
            objDT = gregorianDT.year + '-' + gregorianDT.month + '-' + gregorianDT.day + ' '
            if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
                return objDT
            objDT += ' '
        }

        return objDT + sprintf('%02d:%02d:%02d', gregorianDT.hour, gregorianDT.minute, gregorianDT.second)
    }

    render(clock) {

        let time = this.DateTimeFormatter(clock.currentTime)
        // if (time !== this.timeDom.innerText) {
        this.timeDom.innerText = time
        // }
        let multiplier = 'x' + clock.multiplier
        if (multiplier !== this.multiplierDom.innerText) {
            this.multiplierDom.innerText = multiplier
        }


        if (this.clock.shouldAnimate && this.pauseBtn.style.display !== 'flex') {
            this.pauseBtn.style.display = 'flex'
            this.playBtn.style.display = 'none'
        }
        if (!this.clock.shouldAnimate && this.pauseBtn.style.display !== 'none') {
            this.pauseBtn.style.display = 'none'
            this.playBtn.style.display = 'flex'
        }
    }
}

export default ClockAnimate