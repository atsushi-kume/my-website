// グローバルな名前空間を作成（他のJSと衝突しないように）
window.MyCustomLogger = (function() {
    const logs = []; // ログを蓄積する変数
    const originalLog = console.log;

    // console.logを上書き
    console.log = function(...args) {
        // 1. 本来のコンソールにも出す
        originalLog.apply(console, args);

        // 2. ログの内容を整形して配列に保存
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    };

    // 蓄積されたログをHTML側に渡すための関数
    return {
        getLogs: function() {
            return logs.join('\n');
        },
        clearLogs: function() {
            logs.length = 0;
        }
    };
})();