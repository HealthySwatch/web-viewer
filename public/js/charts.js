Chart.defaults.scales.time.format = 'DD/MM/YYYY HH:mm:ss'
Chart.defaults.scales.time.tooltipFormat = 'DD/MM/YYYY HH:mm:ss'
Chart.defaults.aspectRatio = 4

function createHeartRateChart(canvas, dataSet) {
    let color = getComputedStyle(document.documentElement).getPropertyValue('--bs-success');
    const data = {
        datasets: [{
            label: 'Fréquence cardiaque',
            backgroundColor: color,
            borderColor: color,
            data: dataSet,
        }]
    };
    const config = {
        type: 'line',
        data,
        options: {
            elements: {
                line: {
                    tension: 0.4
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parsing: 'DD/MM/YYYY HH:mm:ss',
                        format: 'DD/MM/YYYY HH:mm:ss',
                        tooltipFormat: 'DD/MM/YYYY HH:mm:ss'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Batements par minute'
                    }
                }
            }
        }
    };
    return new Chart(
        canvas,
        config
    )
}

function createBloodOxygenChart(canvas, dataSet) {
    let color = getComputedStyle(document.documentElement).getPropertyValue('--bs-danger');
    const data = {
        datasets: [{
            label: 'Oxygenation sanguine',
            backgroundColor: color,
            borderColor: color,
            data: dataSet,
        }]
    };
    const config = {
        type: 'line',
        data,
        options: {
            elements: {
                line: {
                    tension: 0.4
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parsing: 'DD/MM/YYYY HH:mm:ss',
                        format: 'DD/MM/YYYY HH:mm:ss',
                        tooltipFormat: 'DD/MM/YYYY HH:mm:ss'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Pourcentage'
                    }
                }
            }
        }
    };
    return new Chart(
        canvas,
        config
    )
}