function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "L", start.x, start.y, 
        "Z"
    ].join(" ");

    return d;
}

export function createPieChart(containerId, legendId, data) {
    const container = document.getElementById(containerId);
    const legendContainer = document.getElementById(legendId);
    if (!container || !legendContainer) {
        console.error("Chart container or legend container not found!");
        return;
    }

    container.innerHTML = '';
    legendContainer.innerHTML = '';
    
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    if (totalValue === 0) {
        container.innerHTML = '<p style="color: var(--secondary-color); text-align: center;">No audit data to display.</p>';
        return;
    }
    
    const size = 180;
    const radius = size / 2;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    let startAngle = 0;

    data.forEach(slice => {
        const sliceAngle = (slice.value / totalValue) * 360;
        if (sliceAngle === 0) return;
        
        const endAngle = startAngle + sliceAngle;
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('d', describeArc(radius, radius, radius, startAngle, endAngle));
        path.setAttribute('fill', slice.color);

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${slice.label}: ${slice.value.toLocaleString()} (${Math.round((slice.value / totalValue) * 100)}%)`;
        path.appendChild(title);

        svg.appendChild(path);
        startAngle = endAngle;

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color-box" style="background-color: ${slice.color};"></div>
            <span>${slice.label} (${Math.round((slice.value / totalValue) * 100)}%)</span>
        `;
        legendContainer.appendChild(legendItem);
    });

    container.appendChild(svg);
}
