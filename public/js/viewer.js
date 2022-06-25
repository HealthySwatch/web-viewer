let key = window.location.hash.substring(1);
if (key === '') {
    throw 'no encryption key given';
}

let locale = window.navigator.userLanguage || window.navigator.language;
let base58 = new baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
let loadedReports = []
let loadedName = 'Unknown'

let startWindow = 0
let endWindow = 0

let renderedCharts = []

async function decodeData(key, password) {
    let encryptionKey = arraybufferToString(base58.decode(key)).padStart(32, '\u0000')
    let data = []
    for (const raw of Array.from(rawData)) {
        data.push(JSON.parse(await decode(raw, encryptionKey, password)))
    }
    loadedReports = data
    if (rawName != null && rawName !== '') {
        loadedName = await decode(JSON.parse(rawName), encryptionKey, password)
    }
}

function cleanup() {
    for (const chart of renderedCharts) {
        chart.destroy()
    }
    renderedCharts = []
}

function init(reports) {
    document.title='HealtySWatch - Patient ' + loadedName
    document.getElementById('patientName').innerText = loadedName
    document.getElementById('stats.nb-reports').innerText = reports.length
    let elements = ['periodStartDateSelect', 'periodEndDateSelect']
    for (const element of elements) {
        document.getElementById(element).innerHTML = ''
    }
    if (reports.length > 0) {
        let startSelect = document.getElementById('periodStartDateSelect')
        let endSelect = document.getElementById('periodEndDateSelect')

        for (const report of reports) {
            let option = document.createElement("option")
            option.value = report.startAt
            option.appendChild(document.createTextNode(moment(report.startAt * 1000).format('LL')))
            startSelect.appendChild(option)
            option = document.createElement("option")
            option.value = report.endAt
            option.appendChild(document.createTextNode(moment(report.endAt * 1000).format('LL')))
            endSelect.appendChild(option)
        }

        startWindow = reports[0].startAt
        endWindow = reports[reports.length - 1].endAt

        startSelect.selectedIndex = 0
        endSelect.selectedIndex = reports.length - 1

        document.getElementById('update-date').innerText = tableDateFormatter(endWindow * 1000)
    }
    document.getElementById("wrapper").style.display = 'block'
}

function render(reports) {
    let events = []
    if (reports.length > 0) {
        let $eventsTable = $('#events-table')
        let heartRateDS = []
        let bloodOxygenDS = []
        let minHR = -1, maxHR = -1
        let minBO = -1, maxBO = -1
        reports.forEach(report => {
            if (report.startAt > endWindow || report.endAt < startWindow) return
            report.events.forEach(event => {
                events.push({
                    date: (report.startAt + event.time) * 1000,
                    source: event.source,
                    message: event.message
                })
            })
            report.samples.HeartRateSensor.forEach(sample => {
                heartRateDS.push({x: (report.startAt + sample.time) * 1000, y: sample.data})
                if (sample.data > maxHR || maxHR === -1) maxHR = sample.data
                if (sample.data < minHR || minHR === -1) minHR = sample.data
            })
            report.samples.BloodOxygenSensor.forEach(sample => {
                bloodOxygenDS.push({x: (report.startAt + sample.time) * 1000, y: (sample.data * 100)})
                if (sample.data > maxBO || maxBO === -1) maxBO = sample.data
                if (sample.data < minBO || minBO === -1) minBO = sample.data
            })
            report.startAt += 60 * 3;
        })
        $eventsTable.bootstrapTable('load', events)
        if (events.length <= 5) {
            document.getElementsByClassName('fixed-table-pagination').forEach(element => {
                element.style.display = 'none'
            })
        }
        document.getElementById('stats.heart-rate.max').innerText = maxHR
        document.getElementById('stats.heart-rate.min').innerText = minHR
        document.getElementById('stats.blood-oxygen.max').innerText = maxBO
        document.getElementById('stats.blood-oxygen.min').innerText = minBO

        renderedCharts.push(createHeartRateChart(document.getElementById('heart-rate-chart'), heartRateDS))
        renderedCharts.push(createBloodOxygenChart(document.getElementById('blood-oxygen-chart'), bloodOxygenDS))
    }
    document.getElementById('stats.nb-alert').innerText = events.length
}

async function createPageOrPrompt(password) {
    try {
        await decodeData(key, password)
    } catch (err) {
        let modal = passwordModal();
        modal.show()
        if (password !== '') {
            let errorLabel = document.getElementById("passwordError")
            errorLabel.style.color = 'red'
            errorLabel.innerText = "Mot de passe invalide"
        }
        return false
    }
    cleanup()
    init(loadedReports)
    render(loadedReports)
    return true
}

function passwordFromModal() {
    let errorLabel = document.getElementById("passwordError");
    let newPassword = document.getElementById('inputPassword').value
    if (newPassword !== '' && newPassword != null) {
        errorLabel.style.color = 'gray'
        errorLabel.innerHTML = '<i class="fas fa-cog fa-spin"></i>'
        createPageOrPrompt(newPassword).then(res => {
            if (res) {
                passwordModal().hide()
            }
        })
    }
}

function passwordModal() {
    let element = document.getElementById('passwordModal')
    let modal = bootstrap.Modal.getInstance(element)
    if (modal == null) {
        modal = new bootstrap.Modal(element)
        element.addEventListener('shown.bs.modal', function () {
            document.getElementById('inputPassword').focus()
        })
    }
    return modal;
}

function updatePeriod() {
    let element = document.getElementById('periodModal')
    let modal = bootstrap.Modal.getInstance(element)
    modal.hide()
    startWindow = document.getElementById('periodStartDateSelect').value;
    endWindow = document.getElementById('periodEndDateSelect').value;
    cleanup()
    render(loadedReports)
}

function tableDateFormatter(timestamp) {
    return moment(timestamp).format('LLLL')
}

document.getElementById('inputPassword').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        passwordFromModal()
    }
});

moment.locale(locale)
createPageOrPrompt('')