export function createBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Chart container not found!");
        return;
    }
    container.innerHTML = '';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const width = container.clientWidth;
    const isMobile = width < 768;

    const paddingTop = 50;
    const paddingBottom = isMobile ? 100 : 150;
    const paddingLeft = isMobile ? 40 : 50;
    const paddingRight = isMobile ? 20 : 50;

    const height = isMobile ? 400 : 600;
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    if (data.length === 0) {
        const noDataText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        noDataText.setAttribute('x', width / 2);
        noDataText.setAttribute('y', height / 2);
        noDataText.setAttribute('fill', 'var(--secondary-color)');
        noDataText.setAttribute('text-anchor', 'middle');
        noDataText.textContent = "No project data to display.";
        svg.appendChild(noDataText);
        container.appendChild(svg);
        return;
    }

    const drawableWidth = width - paddingLeft - paddingRight;
    const drawableHeight = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...data.map(p => p.amount));
    const barWidth = drawableWidth / data.length * 0.8;
    const scaleY = (val) => height - paddingBottom - (val / maxVal) * drawableHeight;

    // Draw Axes
    const axisColor = 'var(--input-border-color)';
    const textColor = 'var(--secondary-color)';
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute('x1', paddingLeft);
    xAxis.setAttribute('y1', height - paddingBottom);
    xAxis.setAttribute('x2', width - paddingRight);
    xAxis.setAttribute('y2', height - paddingBottom);
    xAxis.setAttribute('stroke', axisColor);
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute('x1', paddingLeft);
    yAxis.setAttribute('y1', paddingTop);
    yAxis.setAttribute('x2', paddingLeft);
    yAxis.setAttribute('y2', height - paddingBottom);
    yAxis.setAttribute('stroke', axisColor);
    svg.appendChild(yAxis);

    // Draw Y-axis labels and grid lines
    const numYLabels = 5;
    for (let i = 0; i <= numYLabels; i++) {
        const val = (maxVal / numYLabels) * i;
        const y = scaleY(val);
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute('x', paddingLeft - 10);
        label.setAttribute('y', y + 4);
        label.setAttribute('fill', textColor);
        label.setAttribute('font-size', '10');
        label.setAttribute('text-anchor', 'end');
        label.textContent = `${(val / 1000).toFixed(1)}k`;
        svg.appendChild(label);

        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute('x1', paddingLeft);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', width - paddingRight);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', axisColor);
        gridLine.setAttribute('stroke-dasharray', '2,2');
        svg.appendChild(gridLine);
    }

    // Draw bars and X-axis labels
    data.forEach((point, i) => {
        const barX = paddingLeft + i * (drawableWidth / data.length) + (drawableWidth / data.length * 0.1);
        const y = scaleY(point.amount);
        const barHeight = height - paddingBottom - y;

        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute('x', barX);
        bar.setAttribute('y', y);
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', barHeight);
        bar.setAttribute('fill', 'var(--primary-color)');

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${point.object.name}: ${point.amount.toLocaleString()} XP`;
        bar.appendChild(title);
        svg.appendChild(bar);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const labelX = barX + barWidth / 2;
        const labelY = height - paddingBottom + 10;
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.setAttribute('fill', textColor);
        label.setAttribute('font-size', isMobile ? '8' : '9');
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('transform', `rotate(-65, ${labelX}, ${labelY})`);
        label.textContent = point.object.name;
        svg.appendChild(label);
    });

    container.appendChild(svg);
}
