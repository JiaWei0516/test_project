// 替换为你的 Google Cloud Functions 或 Cloud Run 的实际 API 链接
const API_URL = "https://YOUR_CLOUD_FUNCTION_URL/checkShipping";

document.getElementById('search-btn').addEventListener('click', doSearch);
// 允许回车键直接查询
document.getElementById('tracking-id').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') doSearch();
});

async function doSearch() {
    const idInput = document.getElementById('tracking-id').value.trim();
    const errorBox = document.getElementById('error-message');
    const resultBox = document.getElementById('result-container');
    const timeline = document.getElementById('timeline');

    // 重置界面状态
    errorBox.classList.add('hidden');
    resultBox.classList.add('hidden');
    timeline.innerHTML = '';

    if (!idInput) {
        showError('请输入物流单号！');
        return;
    }

    try {
        // 1. 发起网络请求，获取后端传回的 JSON 数据
        const response = await fetch(`${API_URL}?id=${encodeURIComponent(idInput)}`);
        
        if (!response.ok) {
            throw new Error('未查询到相关物流信息，请检查单号是否正确。');
        }

        const data = await response.json(); // 解析 JSON
        
        // 2. 渲染基础信息到前端
        document.getElementById('res-id').innerText = data.trackingId;
        document.getElementById('res-status').innerText = data.currentStatus;

        // 3. 循环渲染时间线 (假设后端传回的 details 是一个数组)
        data.details.forEach(item => {
            const itemHtml = `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-time">${item.time}</div>
                    <div class="timeline-content">${item.context}</div>
                </div>
            `;
            timeline.insertAdjacentHTML('beforeend', itemHtml);
        });

        // 显示结果区域
        resultBox.classList.remove('hidden');

    } catch (error) {
        showError(error.message || '网络连接失败，请稍后再试。');
    }
}

function showError(msg) {
    const errorBox = document.getElementById('error-message');
    errorBox.innerText = msg;
    errorBox.classList.remove('hidden');
}