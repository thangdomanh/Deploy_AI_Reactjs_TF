// Define our labelmap
const labelMap = {
    1: { name: 'Hello', color: 'red' },
    2: { name: 'Thank You', color: 'yellow' },
    3: { name: 'Hit-Hop never die', color: 'lime' },
    4: { name: 'Hit', color: 'blue' },
    5: { name: 'No', color: 'purple' },
}

// Định nghĩa Hàm vẽ
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // trích xuất
            const [y, x, height, width] = boxes[i]
            const text = classes[i]

            // đặt style
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // tiến hành vẽ
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10)
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 1.5);
            ctx.stroke()
        }
    }
}