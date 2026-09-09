window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ==================== 原有的链接拦截逻辑 ====================
// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })


// ==================== 新增的ESC退出全屏功能 ====================
// 监听键盘事件，当按下ESC键时退出全屏
document.addEventListener('keydown', async (event) => {
    // 检查是否按下了 ESC 键 (键码为 27 或 key 为 'Escape')
    if (event.key === 'Escape' || event.keyCode === 27) {
        // 检查 Tauri 的 window API 是否可用（是否在Tauri环境中运行）
        if (window.__TAURI__ && window.__TAURI__.window) {
            try {
                // 尝试获取当前窗口并退出全屏
                const appWindow = window.__TAURI__.window.getCurrentWindow();
                // 检查当前是否处于全屏状态
                if (await appWindow.isFullscreen()) {
                    await appWindow.setFullscreen(false);
                    console.log('ESC pressed, exited fullscreen.');
                }
            } catch (error) {
                // 如果调用API失败（例如权限问题或不在Tauri环境），静默忽略错误
                console.warn('Failed to exit fullscreen via Tauri API:', error);
            }
        } else {
            // 如果在浏览器环境中测试，可以使用HTML5 Fullscreen API作为备选
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.warn('Failed to exit fullscreen via HTML5 API:', err);
                });
            }
        }
    }
}, { capture: true }); // 使用 capture 阶段确保尽早捕获