
import React, { useState } from 'react';

interface UbuntuIntegrationProps {
  currentImageUrl: string;
}

const UbuntuIntegration: React.FC<UbuntuIntegrationProps> = ({ currentImageUrl }) => {
  const [copiedType, setCopiedType] = useState<'current' | 'auto' | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'auto'>('auto');

  const currentScript = `
# 修复：确保脚本能找到桌面会话（防止黑屏）
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u)/bus"

URL="${currentImageUrl}"
DEST="$HOME/Pictures/ubuntu_wallpaper.jpg"

# 下载图片
wget -O "$DEST" "$URL"

# 检查文件是否下载成功
if [ -s "$DEST" ]; then
    # 同时兼容浅色和深色模式
    gsettings set org.gnome.desktop.background picture-uri "file://$DEST"
    gsettings set org.gnome.desktop.background picture-uri-dark "file://$DEST"
    echo "壁纸设置成功！"
else
    echo "下载失败，请检查网络。"
fi
  `.trim();

  const autoSyncScript = `
#!/bin/bash
# 解决 Cron 运行时的环境变量问题
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u)/bus"

# 1. 获取 Bing 图片 URL
BING_RES=$(curl -s "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN")
IMG_PATH=$(echo $BING_RES | grep -oP '(?<="url":")[^"]+')
IMG_URL="https://www.bing.com\${IMG_PATH}"
DEST="$HOME/Pictures/bing_daily.jpg"

# 2. 下载图片并检查大小
wget -q -O "$DEST" "$IMG_URL"

# 3. 只有图片不为空时才设置壁纸，防止变黑
if [ -s "$DEST" ]; then
    gsettings set org.gnome.desktop.background picture-uri "file://$DEST"
    gsettings set org.gnome.desktop.background picture-uri-dark "file://$DEST"
fi
  `.trim();

  const handleCopy = (text: string, type: 'current' | 'auto') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="glass p-6 rounded-3xl mb-8 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <i className="fab fa-ubuntu text-3xl text-[#E95420]"></i>
          <h2 className="text-xl font-bold">Ubuntu 自动化配置</h2>
        </div>
        <div className="flex bg-black/40 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('auto')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'auto' ? 'bg-[#E95420] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            全自动每日同步
          </button>
          <button 
            onClick={() => setActiveTab('current')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'current' ? 'bg-[#E95420] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            设置当前图
          </button>
        </div>
      </div>

      {activeTab === 'auto' ? (
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <i className="fas fa-info-circle text-blue-400 mt-1"></i>
            <div>
              <p className="text-sm font-semibold text-blue-200">为什么之前会黑屏？</p>
              <p className="text-xs text-blue-200/60 mt-1">
                Ubuntu 的壁纸命令需要访问 D-Bus 会话。新版本脚本加入了 <code>DBUS_SESSION_BUS_ADDRESS</code> 自动检测，解决了定时任务执行时找不到桌面环境的问题。
              </p>
            </div>
          </div>
          <div className="bg-black/40 p-4 rounded-xl font-mono text-sm relative group">
            <pre className="overflow-x-auto text-orange-400 scrollbar-hide">
              <code>{autoSyncScript}</code>
            </pre>
            <button 
              onClick={() => handleCopy(autoSyncScript, 'auto')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              {copiedType === 'auto' ? <i className="fas fa-check text-green-500"></i> : <i className="far fa-copy"></i>}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="font-bold text-gray-400 uppercase mb-2">排查步骤</p>
              <ul className="list-disc ml-4 space-y-1 text-gray-500">
                <li>确保安装了 <code>curl</code> 和 <code>wget</code></li>
                <li>运行 <code>./daily.sh</code> 查看是否有报错</li>
                <li>检查 <code>~/Pictures/bing_daily.jpg</code> 是否真的有图片</li>
              </ul>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <p className="font-bold text-gray-400 uppercase mb-2">Cronjob 推荐写法</p>
              <code className="block bg-black/30 p-2 rounded text-orange-300">@reboot /path/to/daily.sh</code>
              <p className="mt-2 text-gray-500">开机自动执行一次，最稳妥。</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">此脚本将“立即”把当前网页展示的图片设置为你的桌面壁纸：</p>
          <div className="bg-black/40 p-4 rounded-xl font-mono text-sm relative group">
            <pre className="overflow-x-auto text-orange-400">
              <code>{currentScript}</code>
            </pre>
            <button 
              onClick={() => handleCopy(currentScript, 'current')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              {copiedType === 'current' ? <i className="fas fa-check text-green-500"></i> : <i className="far fa-copy"></i>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UbuntuIntegration;
