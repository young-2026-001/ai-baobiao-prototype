/**
 * SKYNET Dashboard - JavaScript 交互逻辑
 * 实现数据模拟、图表渲染、地图交互、时间切换等功能
 */

// ==================== 全局状态管理 ====================
const appState = {
    dashboardType: 'region', // 'region' 或 'domain'
    currentRegion: 'japan',
    currentDomain: 'apec',
    timeRange: '24h',
    isLiveUpdate: true,
    updateInterval: null,
    dataCache: {
        region: {},
        domain: {}
    }
};

// ==================== 模拟数据生成器 ====================

// 模拟热点事件数据
function generateEventsData(region) {
    const events = [];
    const eventsDB = {
        japan: [
            { name: '东京奥运会准备进展', type: '体育', date: '2024-12-28', heat: 98 },
            { name: '新安保法案通过', type: '政治', date: '2024-12-27', heat: 95 },
            { name: '日元汇率大幅波动', type: '经济', date: '2024-12-26', heat: 87 },
            { name: '福岛核水处理进展', type: '安全', date: '2024-12-25', heat: 85 },
            { name: '动漫产业新政策', type: '文化', date: '2024-12-24', heat: 82 },
            { name: '机器人技术突破', type: '科技', date: '2024-12-23', heat: 80 },
            { name: '老龄化社会对策', type: '社会', date: '2024-12-22', heat: 78 },
            { name: '防灾演习大规模举行', type: '安全', date: '2024-12-21', heat: 75 },
            { name: '皇室庆典筹备', type: '文化', date: '2024-12-20', heat: 73 },
            { name: '旅游业复苏数据', type: '经济', date: '2024-12-19', heat: 70 }
        ],
        korea: [
            { name: '韩朝关系新进展', type: '政治', date: '2024-12-28', heat: 96 },
            { name: 'K-POP全球巡演', type: '娱乐', date: '2024-12-27', heat: 92 },
            { name: '半导体产业投资', type: '经济', date: '2024-12-26', heat: 88 },
            { name: '军事演习', type: '军事', date: '2024-12-25', heat: 85 },
            { name: '医疗系统改革', type: '健康', date: '2024-12-24', heat: 82 },
            { name: 'AI技术发展', type: '科技', date: '2024-12-23', heat: 79 },
            { name: '教育政策调整', type: '教育', date: '2024-12-22', heat: 76 },
            { name: '传统艺术展览', type: '艺术', date: '2024-12-21', heat: 74 },
            { name: '社会福利改革', type: '社会', date: '2024-12-20', heat: 71 },
            { name: '网络安全会议', type: '安全', date: '2024-12-19', heat: 69 }
        ],
        singapore: [
            { name: '金融中心地位强化', type: '经济', date: '2024-12-28', heat: 94 },
            { name: '智慧城市建设', type: '科技', date: '2024-12-27', heat: 90 },
            { name: '国际教育合作', type: '教育', date: '2024-12-26', heat: 86 },
            { name: '医疗旅游发展', type: '健康', date: '2024-12-25', heat: 83 },
            { name: '文化艺术节', type: '文化', date: '2024-12-24', heat: 80 },
            { name: '区域安全合作', type: '安全', date: '2024-12-23', heat: 77 },
            { name: '娱乐产业投资', type: '娱乐', date: '2024-12-22', heat: 74 },
            { name: '体育赛事承办', type: '体育', date: '2024-12-21', heat: 72 },
            { name: '社会住房政策', type: '社会', date: '2024-12-20', heat: 69 },
            { name: '艺术博览会', type: '艺术', date: '2024-12-19', heat: 67 }
        ],
        taiwan: [
            { name: '两岸关系动态', type: '政治', date: '2024-12-28', heat: 97 },
            { name: '半导体供应链', type: '经济', date: '2024-12-27', heat: 93 },
            { name: '文化产业发展', type: '文化', date: '2024-12-26', heat: 89 },
            { name: '医疗健保改革', type: '健康', date: '2024-12-25', heat: 86 },
            { name: '科技创新园区', type: '科技', date: '2024-12-24', heat: 83 },
            { name: '教育体系优化', type: '教育', date: '2024-12-23', heat: 80 },
            { name: '娱乐产业合作', type: '娱乐', date: '2024-12-22', heat: 77 },
            { name: '体育赛事举办', type: '体育', date: '2024-12-21', heat: 75 },
            { name: '社会议题讨论', type: '社会', date: '2024-12-20', heat: 72 },
            { name: '艺术交流活动', type: '艺术', date: '2024-12-19', heat: 70 }
        ],
        hongkong: [
            { name: '金融政策调整', type: '经济', date: '2024-12-28', heat: 95 },
            { name: '文化艺术中心', type: '文化', date: '2024-12-27', heat: 91 },
            { name: '智慧城市发展', type: '科技', date: '2024-12-26', heat: 88 },
            { name: '医疗设施升级', type: '健康', date: '2024-12-25', heat: 85 },
            { name: '教育改革方案', type: '教育', date: '2024-12-24', heat: 82 },
            { name: '娱乐产业复兴', type: '娱乐', date: '2024-12-23', heat: 79 },
            { name: '体育盛事筹备', type: '体育', date: '2024-12-22', heat: 76 },
            { name: '艺术展览活动', type: '艺术', date: '2024-12-21', heat: 73 },
            { name: '社会民生政策', type: '社会', date: '2024-12-20', heat: 70 },
            { name: '安全措施加强', type: '安全', date: '2024-12-19', heat: 68 }
        ]
    };

    const baseEvents = eventsDB[region] || eventsDB.japan;
    return baseEvents.map((event, index) => ({
        rank: index + 1,
        name: event.name,
        type: event.type,
        date: event.date,
        heat: event.heat
    }));
}

// 模拟新闻数据
function generateNewsData(region) {
    const newsSources = ['NHK', '朝日新闻', '读卖新闻', '共同社', 'TBS'];
    const newsTypes = ['政治', '经济', '社会', '国际', '科技'];
    const news = [];

    for (let i = 0; i < 10; i++) {
        news.push({
            index: i + 1,
            title: `${region === 'japan' ? '日本' : region === 'korea' ? '韩国' : '新加坡'}${newsTypes[i % newsTypes.length]}：${newsTypes[i % newsTypes.length]}相关最新报道`,
            type: newsTypes[i % newsTypes.length],
            site: newsSources[i % newsSources.length],
            time: getTimeAgo(i * 5)
        });
    }
    return news;
}

// 模拟热门趋势数据
function generateTrendsData(region) {
    const trends = [];
    const trendBase = {
        korea: ['K-POP热潮', '半导体技术', '冬奥会筹备', '韩流文化', '韩语学习'],
        singapore: ['金融监管', '智慧城市', '科技创新', '旅游复苏', '教育改革'],
        taiwan: ['半导体产业', '科技发展', '两岸关系', '经济政策', '文化产业']
    };

    const baseTrends = trendBase[region] || trendBase.korea;
    const platforms = ['Facebook', 'X', 'Instagram', 'TikTok'];

    for (let i = 0; i < 10; i++) {
        trends.push({
            rank: i + 1,
            name: baseTrends[i % baseTrends.length],
            mentions: Math.floor(Math.random() * 50000) + 10000,
            interactions: Math.floor(Math.random() * 10000) + 1000,
            isNew: i === 0,
            trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'flat' : 'down'
        });
    }
    return trends;
}

// 模拟负面信息数据 - 按照需求规范
function generateNegativeData() {
    const categories = [
        { type: 'political', name: '涉政', color: '#ef4444', count: 82 },
        { type: 'extremism', name: '涉恐/极端主义', color: '#f97316', count: 47 },
        { type: 'stability', name: '涉稳', color: '#eab308', count: 35 },
        { type: 'violence', name: '暴力/违法犯罪', color: '#84cc16', count: 28 },
        { type: 'fake', name: '虚假信息', color: '#06b6d4', count: 19 },
        { type: 'hate', name: '仇恨言论/歧视', color: '#8b5cf6', count: 15 },
        { type: 'harassment', name: '营销骚扰/黑产', color: '#ec4899', count: 8 }
    ];

    const total = categories.reduce((sum, cat) => sum + cat.count, 0);
    categories.forEach(cat => cat.percentage = Math.round((cat.count / total) * 100));

    console.log('生成负面信息数据:', categories);
    return categories;
}

// 模拟负面信息详情列表 - 按照需求规范
function generateNegativeListItems() {
    const items = [
        {
            id: 1,
            avatar: 'user101',
            name: '网络观察员_张',
            verified: true,
            time: '2分钟前',
            contentType: 'text',
            content: '关于最近的政策调整，我认为存在一些需要进一步讨论的问题...',
            tags: ['涉政', '敏感话题'],
            platform: 'X',
            likes: 234,
            shares: 56
        },
        {
            id: 2,
            avatar: 'user102',
            name: '匿名用户8765',
            verified: false,
            time: '15分钟前',
            contentType: 'image',
            content: '[图片] 传播未经核实的消息截图，涉及不实信息',
            imagePlaceholder: true,
            tags: ['虚假信息', '谣言'],
            platform: 'Facebook',
            likes: 89,
            shares: 234
        },
        {
            id: 3,
            avatar: 'user103',
            name: '激进观点123',
            verified: false,
            time: '32分钟前',
            contentType: 'text',
            content: '强烈反对某些群体的存在，这种言论不应该被容忍...',
            tags: ['仇恨言论', '群体歧视'],
            platform: 'X',
            likes: 45,
            shares: 12
        },
        {
            id: 4,
            avatar: 'user104',
            name: '安全卫士_Li',
            verified: true,
            time: '1小时前',
            contentType: 'video',
            content: '[视频] 分享极端主义相关宣传内容',
            videoPlaceholder: true,
            tags: ['涉恐', '极端主义'],
            platform: 'TikTok',
            likes: 12,
            shares: 56
        },
        {
            id: 5,
            avatar: 'user105',
            name: '营销号999',
            verified: false,
            time: '2小时前',
            contentType: 'text',
            content: '点击链接领取免费礼品，限时优惠...',
            tags: ['营销骚扰', '黑产'],
            platform: 'Instagram',
            likes: 7,
            shares: 3
        }
    ];

    console.log('生成负面信息列表:', items);
    return items;
}

// 模拟群体数据 - 按照需求中的群体类型
function generateGroupsData() {
    const groups = [
        { name: '政治人物', percentage: 28, color: '#3b82f6', count: 28450 },
        { name: '媒体人士', percentage: 22, color: '#ef4444', count: 22350 },
        { name: '科技人士', percentage: 16, color: '#10b981', count: 16250 },
        { name: '企业高管', percentage: 12, color: '#f59e0b', count: 12150 },
        { name: '教育人士', percentage: 8, color: '#8b5cf6', count: 8100 },
        { name: '医疗人士', percentage: 6, color: '#ec4899', count: 6075 },
        { name: '艺术人士', percentage: 4, color: '#06b6d4', count: 4050 },
        { name: '体育人士', percentage: 3, color: '#84cc16', count: 3038 },
        { name: '军人', percentage: 1, color: '#f97316', count: 1013 }
    ];

    console.log('生成群体数据:', groups);
    return groups;
}

// 模拟群体讨论议题 - TOP 5
function generateGroupTopics() {
    const topics = [
        { name: 'AI技术发展与监管', count: 8756, size: 'lg' },
        { name: '数字化转型与隐私保护', count: 6234, size: 'lg' },
        { name: '经济政策与国际贸易', count: 5432, size: 'md' },
        { name: '教育改革与人才发展', count: 4321, size: 'md' },
        { name: '医疗创新与公共卫生', count: 3876, size: 'sm' }
    ];

    console.log('生成群体议题:', topics);
    return topics;
}

// 模拟领域相关事件
function generateDomainEvents(domain) {
    const events = [
        { id: 1, name: 'APEC领导人会议筹备', region: '亚太', type: '政治', date: '2024-12-28' },
        { id: 2, name: '贸易协定谈判进展', region: '全球', type: '经济', date: '2024-12-27' },
        { id: 3, name: '数字经济合作论坛', region: '亚太', type: '科技', date: '2024-12-26' },
        { id: 4, name: '气候变化峰会', region: '全球', type: '环境', date: '2024-12-25' },
        { id: 5, name: '金融监管合作', region: '亚太', type: '经济', date: '2024-12-24' }
    ];

    return events;
}

// 模拟热门账号
function generateHotAccounts(domain) {
    return [
        { rank: 1, avatar: 'user1', name: '@GlobalInsights', posts: 45678, interactions: 234567 },
        { rank: 2, avatar: 'user2', name: '@AsiaNews', posts: 38900, interactions: 189234 },
        { rank: 3, avatar: 'user3', name: '@EcoWatch', posts: 32100, interactions: 156789 },
        { rank: 4, avatar: 'user4', name: '@TechToday', posts: 29876, interactions: 134567 },
        { rank: 5, avatar: 'user5', name: '@PolicyHub', posts: 26543, interactions: 112345 }
    ];
}

// 模拟热门帖文
function generateHotPosts(domain) {
    return [
        {
            id: 1,
            avatar: 'user1',
            name: '@GlobalInsights',
            text: '最新APEC会议显示各国在数字经济领域的合作正在加速推进，重点包括AI伦理框架制定和数据跨境流动规则...',
            time: '2小时前',
            likes: 12345,
            shares: 2345
        },
        {
            id: 2,
            avatar: 'user2',
            name: '@AsiaNews',
            text: '气候变化谈判取得突破性进展，多国承诺2030年前实现碳达峰...',
            time: '4小时前',
            likes: 9876,
            shares: 1876
        },
        {
            id: 3,
            avatar: 'user3',
            name: '@EcoWatch',
            text: '可再生能源技术再次突破，新型太阳能电池效率创世界纪录...',
            time: '6小时前',
            likes: 8765,
            shares: 1543
        }
    ];
}

// 辅助函数：获取相对时间
function getTimeAgo(minutes) {
    if (minutes < 60) return `${minutes}分钟前`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
    return `${Math.floor(minutes / 1440)}天前`;
}

// ==================== DOM 加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化');
    initializeDashboard();
    setupEventListeners();
    startLiveUpdates();
    console.log('初始化完成');
});

// ==================== 初始化仪表盘 ====================
function initializeDashboard() {
    // 设置初始状态
    appState.dashboardType = 'region';
    appState.currentRegion = 'japan';

    // 确保区域仪表盘显示，领域仪表盘隐藏
    const regionDashboard = document.getElementById('region-dashboard');
    const domainDashboard = document.getElementById('domain-dashboard');

    if (regionDashboard) {
        regionDashboard.style.display = 'grid';
    }
    if (domainDashboard) {
        domainDashboard.style.display = 'none';
    }

    // 渲染区域仪表盘
    renderRegionDashboard();
}

// ==================== 渲染区域仪表盘 ====================
function renderRegionDashboard() {
    console.log('开始渲染区域仪表盘...');

    // 渲染统计卡片
    renderStatsCards();

    // 渲染热门事件
    renderEvents();

    // 渲染实时新闻
    renderNews();

    // 渲染热门趋势
    renderTrends();

    // 渲染负面信息
    renderNegativeInfo();

    // 渲染群体动向
    renderGroupsMovement();

    console.log('区域仪表盘渲染完成');
}

// 渲染统计卡片
function renderStatsCards() {
    const region = appState.currentRegion;
    const stats = {
        japan: { persons: 1247, accounts: 56823, communities: 2341, sites: 3421, posts: 1284567 },
        korea: { persons: 2156, accounts: 89234, communities: 3456, sites: 4156, posts: 2345678 },
        singapore: { persons: 987, accounts: 45678, communities: 1876, sites: 2890, posts: 987654 },
        taiwan: { persons: 1567, accounts: 67890, communities: 2543, sites: 3678, posts: 1567890 },
        hongkong: { persons: 1456, accounts: 54321, communities: 2123, sites: 3234, posts: 1123456 }
    };

    const data = stats[region] || stats.japan;

    updateStatValue('stat-persons', data.persons);
    updateStatValue('stat-accounts', data.accounts);
    updateStatValue('stat-communities', data.communities);
    updateStatValue('stat-sites', data.sites);
    updateStatValue('stat-posts', data.posts);
}

// 更新统计值动画
function updateStatValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;

    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const steps = 20;
    const increment = (value - currentValue) / steps;
    let step = 0;

    const animate = () => {
        step++;
        const newValue = Math.floor(currentValue + increment * step);
        element.textContent = newValue.toLocaleString();

        if (step < steps) {
            requestAnimationFrame(animate);
        }
    };

    animate();
}

// ==================== 渲染热门事件 ====================
function renderEvents(filterTypes = null) {
    const events = generateEventsData(appState.currentRegion);
    const tbody = document.getElementById('events-table-body');

    // 根据过滤器筛选事件
    let filteredEvents = events;
    if (filterTypes && filterTypes.length > 0 && !filterTypes.includes('all')) {
        filteredEvents = events.filter(event => filterTypes.includes(event.type));
    }

    tbody.innerHTML = filteredEvents.map(event => `
        <div class="table-row">
            <span class="col-rank ${event.rank <= 3 ? 'top-' + event.rank : ''}">${event.rank}</span>
            <span class="col-name">${event.name}</span>
            <span class="col-type">${event.type}</span>
            <span class="col-date">${event.date}</span>
            <span class="col-heat">${event.heat}</span>
        </div>
    `).join('');

    // 如果没有数据，显示提示
    if (filteredEvents.length === 0) {
        tbody.innerHTML = '<div class="no-data">暂无相关类型的事件</div>';
    }
}

// 渲染实时新闻
function renderNews() {
    const news = generateNewsData(appState.currentRegion);
    const newsList = document.getElementById('news-list');

    newsList.innerHTML = news.map(item => `
        <div class="news-item">
            <span class="news-index">${item.index}</span>
            <span class="news-title">${item.title}</span>
            <span class="news-type">${item.type}</span>
            <span class="news-site">${item.site}</span>
            <span class="news-time">${item.time}</span>
        </div>
    `).join('');
}

// 渲染热门趋势
function renderTrends() {
    const trends = generateTrendsData(appState.currentRegion);
    const trendsList = document.getElementById('trends-list');

    trendsList.innerHTML = trends.map(trend => `
        <div class="trend-item">
            <span class="trend-rank">#${trend.rank}</span>
            <span class="trend-name">
                ${trend.name}
                ${trend.isNew ? '<span class="new-tag">新</span>' : ''}
            </span>
            <span class="trend-mentions">${trend.mentions.toLocaleString()}</span>
            <span class="trend-interactions">${trend.interactions.toLocaleString()}</span>
            <div class="trend-trend ${trend.trend}">
                <svg viewBox="0 0 16 16">
                    <path d="M3 12l4-4 3 3 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
        </div>
    `).join('');
}

// 渲染负面信息
function renderNegativeInfo() {
    console.log('开始渲染负面信息...');

    const categories = generateNegativeData();
    const negativeCount = categories.reduce((sum, cat) => sum + cat.count, 0);

    console.log('负面信息总数:', negativeCount);

    // 更新负面计数
    document.getElementById('negative-count').querySelector('.alert-number').textContent = negativeCount;

    // 更新总计显示
    document.getElementById('negative-total').textContent = negativeCount;

    // 渲染饼图
    renderPieChart(categories);

    // 渲染柱状图
    renderBarChart();

    // 渲染负面信息列表
    renderNegativeList();

    console.log('负面信息渲染完成');
}

// 渲染饼图
function renderPieChart(categories) {
    const svg = document.getElementById('negative-pie');
    const centerX = 50;
    const centerY = 50;
    const radius = 42;

    let currentAngle = -90; // 从顶部开始
    let paths = [];

    categories.forEach((cat, index) => {
        const angle = (cat.percentage / 100) * 360;
        const endAngle = currentAngle + angle;

        // 计算路径
        const x1 = centerX + radius * Math.cos(currentAngle * Math.PI / 180);
        const y1 = centerY + radius * Math.sin(currentAngle * Math.PI / 180);
        const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
        const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        paths.push({ data: pathData, color: cat.color });

        currentAngle = endAngle;
    });

    // 更新图例
    const legendItems = document.querySelectorAll('.legend-item');
    categories.forEach((cat, index) => {
        if (legendItems[index]) {
            legendItems[index].querySelector('.legend-color').style.background = cat.color;
            legendItems[index].querySelector('.legend-label').textContent = cat.name;
            legendItems[index].querySelector('.legend-count').textContent = cat.count;
        }
    });

    // 清空并重新创建SVG内容
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // 创建环形图路径
    paths.forEach((path, index) => {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path.data);
        pathElement.setAttribute('fill', path.color);
        pathElement.setAttribute('stroke', 'var(--bg-secondary)');
        pathElement.setAttribute('stroke-width', '2');
        pathElement.setAttribute('opacity', '0.8');
        svg.appendChild(pathElement);
    });

    // 创建中心遮罩实现环形效果
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', centerX);
    centerCircle.setAttribute('cy', centerY);
    centerCircle.setAttribute('r', '30');
    centerCircle.setAttribute('fill', 'var(--bg-secondary)');
    svg.appendChild(centerCircle);
}

// 渲染柱状图
function renderBarChart() {
    const container = document.getElementById('negative-bar-chart');
    if (!container) return;

    // 生成近7天数据
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const maxValue = 50;
    const data = [32, 28, 45, 38, 42, 25, 35];

    container.innerHTML = data.map((value, index) => `
        <div class="bar-chart-bar">
            <div class="bar" style="height: ${(value / maxValue) * 80}px" data-value="${value}"></div>
            <span class="label">${days[index]}</span>
        </div>
    `).join('');
}

// 渲染负面信息列表
function renderNegativeList() {
    const negativeList = document.getElementById('negative-list');
    const items = generateNegativeListItems();

    if (!negativeList) {
        console.error('找不到 negative-list 元素');
        return;
    }

    negativeList.innerHTML = items.map(item => `
        <div class="negative-item">
            <div class="negative-avatar">
                <img src="https://picsum.photos/seed/${item.avatar}/40/40.jpg" alt="${item.name}">
                ${item.verified ? '<span class="verified-badge">✓</span>' : ''}
            </div>
            <div class="negative-content">
                <div class="negative-user">
                    <span class="negative-name">${item.name}</span>
                    <span class="negative-platform">${item.platform}</span>
                    <span class="negative-time">${item.time}</span>
                </div>
                <div class="negative-text">
                    ${item.contentType === 'image' ? '<span class="content-badge">📷 图片</span>' : ''}
                    ${item.contentType === 'video' ? '<span class="content-badge">🎬 视频</span>' : ''}
                    ${item.content}
                </div>
                <div class="negative-tags">
                    ${item.tags.map(tag => `<span class="negative-tag">${tag}</span>`).join('')}
                </div>
                <div class="negative-stats">
                    <span>👍 ${item.likes}</span>
                    <span>↗️ ${item.shares}</span>
                </div>
            </div>
        </div>
    `).join('');

    console.log('负面信息列表渲染完成');
}

// 渲染群体动向
function renderGroupsMovement() {
    console.log('开始渲染群体动向...');
    const groups = generateGroupsData();
    const topics = generateGroupTopics();

    console.log('群体数据:', groups);
    console.log('群体议题:', topics);

    // 渲染群体分布
    renderGroupDistribution(groups);

    // 渲染群体讨论议题
    renderGroupTopics(topics);
}

// 渲染群体分布
function renderGroupDistribution(groups) {
    const distribution = document.getElementById('group-distribution');

    console.log('找到分布容器:', distribution);

    if (!distribution) {
        console.error('找不到 group-distribution 元素');
        return;
    }

    distribution.innerHTML = groups.map(group => `
        <div class="dist-bar">
            <span class="dist-bar-label">${group.name}</span>
            <div class="dist-bar-track">
                <div class="dist-bar-fill" style="width: ${group.percentage}%; background: ${group.color}"></div>
            </div>
            <span class="dist-bar-value">${group.percentage}%</span>
        </div>
    `).join('');

    console.log('群体分布渲染完成');
}

// 渲染群体讨论议题
function renderGroupTopics(topics) {
    const topicsCloud = document.getElementById('group-topics');

    console.log('找到议题容器:', topicsCloud);

    if (!topicsCloud) {
        console.error('找不到 group-topics 元素');
        return;
    }

    topicsCloud.innerHTML = topics.map(topic => `
        <span class="topic-tag ${topic.size}">
            ${topic.name} (${topic.count.toLocaleString()})
        </span>
    `).join('');

    console.log('群体议题渲染完成');
}

// ==================== 渲染领域仪表盘 ====================
function renderDomainDashboard() {
    console.log('开始渲染领域仪表盘，当前领域:', appState.currentDomain);

    // 更新统计数据
    const domainStats = {
        apec: { accounts: 234567, posts: 5678234, negative: 12345 },
        'russia-ukraine': { accounts: 456789, posts: 8901234, negative: 23456 },
        'iran-israel': { accounts: 345678, posts: 4567890, negative: 17890 },
        climate: { accounts: 123456, posts: 2345678, negative: 8765 },
        'ai-tech': { accounts: 567890, posts: 7890123, negative: 15678 }
    };

    const data = domainStats[appState.currentDomain] || domainStats.apec;
    console.log('领域统计数据:', data);

    updateStatValue('domain-accounts', data.accounts);
    updateStatValue('domain-posts', data.posts);
    updateStatValue('domain-negative', data.negative);

    // 渲染相关事件
    renderDomainEvents();

    // 渲染热门账号
    renderHotAccounts();

    // 渲染实时新闻
    renderDomainNews();

    // 渲染热门帖文
    renderHotPosts();

    console.log('领域仪表盘渲染完成');
}

// 渲染领域相关事件
function renderDomainEvents() {
    const events = generateDomainEvents(appState.currentDomain);
    const tbody = document.getElementById('related-events-body');

    tbody.innerHTML = events.map(event => `
        <div class="table-row">
            <span class="col-rank">${event.id}</span>
            <span class="col-name">${event.name}</span>
            <span class="col-region">${event.region}</span>
            <span class="col-type">${event.type}</span>
            <span class="col-date">${event.date}</span>
        </div>
    `).join('');
}

// 渲染热门账号
function renderHotAccounts() {
    const accounts = generateHotAccounts(appState.currentDomain);
    const accountsList = document.getElementById('hot-accounts-list');

    accountsList.innerHTML = accounts.map(account => `
        <div class="account-item">
            <div class="account-avatar">
                <img src="https://picsum.photos/seed/${account.avatar}/36/36.jpg" alt="${account.name}">
            </div>
            <span class="account-name">${account.name}</span>
            <span class="account-stats">
                <div class="value">${account.posts.toLocaleString()}</div>
                <div>帖子</div>
            </span>
            <span class="account-stats">
                <div class="value">${account.interactions.toLocaleString()}</div>
                <div>互动</div>
            </span>
        </div>
    `).join('');
}

// 渲染领域新闻
function renderDomainNews() {
    const news = generateNewsData(appState.currentDomain);
    const newsList = document.getElementById('domain-news-list');

    newsList.innerHTML = news.map(item => `
        <div class="news-item">
            <span class="news-index">${item.index}</span>
            <span class="news-title">${item.title}</span>
            <span class="news-type">${item.type}</span>
            <span class="news-site">${item.site}</span>
            <span class="news-time">${item.time}</span>
        </div>
    `).join('');
}

// 渲染热门帖文
function renderHotPosts() {
    const posts = generateHotPosts(appState.currentDomain);
    const postsList = document.getElementById('hot-posts-list');

    postsList.innerHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-avatar">
                <img src="https://picsum.photos/seed/${post.avatar}/40/40.jpg" alt="${post.name}">
            </div>
            <div class="post-content">
                <div class="post-user">
                    <span class="post-name">${post.name}</span>
                    <span class="post-time">${post.time}</span>
                </div>
                <div class="post-text">${post.text}</div>
                <div class="post-stats">
                    👍 ${post.likes} | ↗️ ${post.shares}
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== 事件监听器设置 ====================
function setupEventListeners() {
    console.log('设置事件监听器...');

    // 专题选择 - 统一处理区域和领域
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topicType = this.dataset.type; // 'region' 或 'domain'
            const topicValue = this.dataset.topic;

            console.log('点击了专题:', topicType, topicValue);

            // 移除所有专题按钮的active状态
            document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
            // 激活当前按钮
            this.classList.add('active');

            // 根据类型切换仪表盘
            switchDashboardByTopic(topicType, topicValue);
        });
    });

    // 时间范围选择
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            appState.timeRange = this.dataset.range;

            // 模拟时间切换效果
            showNotification(`切换到${this.textContent}数据`);

            // 重新渲染数据
            if (appState.dashboardType === 'region') {
                renderRegionDashboard();
            } else {
                renderDomainDashboard();
            }
        });
    });

    // 地图交互
    setupMapInteractions();

    // 类型下拉菜单
    setupTypeDropdown();

    // 时间范围下拉菜单
    setupTimeDropdown();

    // 弹窗关闭
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('detail-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // 查看全部按钮
    document.querySelectorAll('.view-all-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('正在加载更多数据...');
        });
    });
}

// ==================== 根据专题切换仪表盘 ====================
function switchDashboardByTopic(type, value) {
    console.log('切换到专题:', type, value);

    if (type === 'region') {
        // 切换到区域仪表盘
        appState.dashboardType = 'region';
        appState.currentRegion = value;

        // 切换仪表盘显示
        const regionDashboard = document.getElementById('region-dashboard');
        const domainDashboard = document.getElementById('domain-dashboard');

        regionDashboard.style.display = 'grid';
        domainDashboard.style.display = 'none';

        // 渲染区域仪表盘
        renderRegionDashboard();
        showNotification(`已切换到${getTopicName('region', value)}区域仪表盘`);
    } else if (type === 'domain') {
        // 切换到领域仪表盘
        appState.dashboardType = 'domain';
        appState.currentDomain = value;

        // 切换仪表盘显示
        const regionDashboard = document.getElementById('region-dashboard');
        const domainDashboard = document.getElementById('domain-dashboard');

        regionDashboard.style.display = 'none';
        domainDashboard.style.display = 'grid';

        // 渲染领域仪表盘
        renderDomainDashboard();
        // 初始化地图
        initMap();
        showNotification(`已切换到${getTopicName('domain', value)}领域仪表盘`);
    }
}

// 获取专题名称
function getTopicName(type, value) {
    const regionNames = {
        'japan': '日本',
        'korea': '韩国',
        'singapore': '新加坡',
        'taiwan': '台湾',
        'hongkong': '香港'
    };

    const domainNames = {
        'apec': 'APEC',
        'russia-ukraine': '俄乌战争',
        'iran-israel': '伊以冲突',
        'climate': '气候变化',
        'ai-tech': 'AI技术'
    };

    if (type === 'region') {
        return regionNames[value] || value;
    } else {
        return domainNames[value] || value;
    }
}

// ==================== 地图交互设置 ====================
function setupMapInteractions() {
    const countryPaths = document.querySelectorAll('.country-path');
    const countryLabels = document.querySelectorAll('.country-label');
    const tooltip = document.getElementById('map-tooltip');

    console.log('设置地图交互，国家路径数量:', countryPaths.length);
    console.log('设置地图交互，国家标签数量:', countryLabels.length);

    // 国家路径交互
    countryPaths.forEach(path => {
        path.addEventListener('mouseenter', function(e) {
            const country = this.dataset.country;
            const count = this.dataset.count;

            // 高亮当前国家
            this.style.stroke = '#ffffff';
            this.style.strokeWidth = '2';
            this.style.filter = 'url(#mapGlow)';

            // 显示工具提示
            tooltip.querySelector('.tooltip-country').textContent = country;
            tooltip.querySelector('.tooltip-count').textContent = `帖文数量: ${count}`;
            tooltip.classList.add('visible');
        });

        path.addEventListener('mousemove', function(e) {
            const mapRect = document.getElementById('world-map').getBoundingClientRect();
            const relativeX = e.clientX - mapRect.left;
            const relativeY = e.clientY - mapRect.top;

            tooltip.style.left = relativeX + 'px';
            tooltip.style.top = (relativeY - 60) + 'px';
        });

        path.addEventListener('mouseleave', function() {
            // 恢复默认样式
            this.style.stroke = '#ffffff';
            this.style.strokeWidth = '0.8';
            this.style.filter = 'none';

            tooltip.classList.remove('visible');
        });

        path.addEventListener('click', function() {
            const country = this.dataset.country;
            const count = this.dataset.count;
            showPostDetail(country, count);
        });
    });

    // 国家标签交互
    countryLabels.forEach(label => {
        label.addEventListener('mouseenter', function(e) {
            const countryName = this.querySelector('.label-name').textContent;
            const countValue = this.querySelector('.label-count').textContent;

            // 高亮对应的国家路径
            const countryPath = document.querySelector(`.country-path[data-country="${countryName}"]`);
            if (countryPath) {
                countryPath.style.stroke = '#ffffff';
                countryPath.style.strokeWidth = '2';
                countryPath.style.filter = 'url(#mapGlow)';
            }

            // 显示工具提示
            tooltip.querySelector('.tooltip-country').textContent = countryName;
            tooltip.querySelector('.tooltip-count').textContent = `帖文数量: ${countValue}`;
            tooltip.classList.add('visible');
        });

        label.addEventListener('mousemove', function(e) {
            const mapRect = document.getElementById('world-map').getBoundingClientRect();
            const relativeX = e.clientX - mapRect.left;
            const relativeY = e.clientY - mapRect.top;

            tooltip.style.left = relativeX + 'px';
            tooltip.style.top = (relativeY - 60) + 'px';
        });

        label.addEventListener('mouseleave', function() {
            const countryName = this.querySelector('.label-name').textContent;

            // 恢复对应国家路径的默认样式
            const countryPath = document.querySelector(`.country-path[data-country="${countryName}"]`);
            if (countryPath) {
                countryPath.style.stroke = '#ffffff';
                countryPath.style.strokeWidth = '0.8';
                countryPath.style.filter = 'none';
            }

            tooltip.classList.remove('visible');
        });

        label.addEventListener('click', function() {
            const countryName = this.querySelector('.label-name').textContent;
            const countValue = this.querySelector('.label-count').textContent;
            showPostDetail(countryName, countValue);
        });
    });

    console.log('地图交互设置完成');
}

// ==================== 实时更新 ====================
function startLiveUpdates() {
    // 每30秒更新一次数据
    appState.updateInterval = setInterval(() => {
        if (appState.isLiveUpdate) {
            // 随机更新一些数据以模拟实时效果
            updateRandomData();
        }
    }, 30000);

    // 模拟即时新闻更新
    simulateNewsUpdates();
}

// 停止实时更新
function stopLiveUpdates() {
    if (appState.updateInterval) {
        clearInterval(appState.updateInterval);
        appState.updateInterval = null;
    }
}

// 更新随机数据
function updateRandomData() {
    // 更新统计数据（小幅度波动）
    const statElements = ['stat-persons', 'stat-accounts', 'stat-communities', 'stat-sites', 'stat-posts'];
    statElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const currentValue = parseInt(element.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 100) - 50;
            const newValue = Math.max(0, currentValue + change);
            element.textContent = newValue.toLocaleString();
        }
    });

    // 更新新闻时间
    const newsTimes = document.querySelectorAll('.news-time');
    newsTimes.forEach((time, index) => {
        const minutes = index * 5 + Math.floor(Math.random() * 10);
        time.textContent = getTimeAgo(minutes);
    });
}

// 模拟新闻更新
function simulateNewsUpdates() {
    setInterval(() => {
        const newsIndex = Math.floor(Math.random() * 3);
        const newsItems = document.querySelectorAll('.news-item');

        if (newsItems[newsIndex]) {
            // 添加新消息动画
            newsItems[newsIndex].style.borderLeft = '3px solid var(--accent-primary)';
            setTimeout(() => {
                newsItems[newsIndex].style.borderLeft = '3px solid transparent';
            }, 2000);
        }
    }, 15000);
}

// ==================== 地图初始化 ====================
function initMap() {
    console.log('初始化地图...');

    const countryPaths = document.querySelectorAll('.country-path');
    const countryLabels = document.querySelectorAll('.country-label');

    // 重置国家路径动画
    countryPaths.forEach((path, index) => {
        path.style.opacity = '0';
        path.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            path.style.opacity = '1';
        }, index * 50);
    });

    // 重置国家标签动画
    countryLabels.forEach((label, index) => {
        label.style.opacity = '0';
        label.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            label.style.opacity = '1';
        }, 0.5 + index * 50);
    });

    console.log('地图初始化完成');
}

// ==================== 弹窗功能 ====================
function showPostDetail(country, count) {
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = `${country} - 帖文详情`;
    body.innerHTML = `
        <div style="padding: 20px;">
            <h4>📍 ${country} 热点分析</h4>
            <p>总计发现 <strong>${count}</strong> 条相关帖文</p>
            <div style="margin: 20px 0;">
                <h5>热门话题：</h5>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    ${['科技', '经济', '文化', '政治', '社会', '环境'].map(t =>
                        `<span style="padding: 5px 10px; background: var(--bg-tertiary); border-radius: 4px; font-size: 14px;">${t}</span>`
                    ).join('')}
                </div>
            </div>
            <div style="margin: 20px 0;">
                <h5>情绪分析：</h5>
                <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="color: var(--accent-primary);">正面</span>
                        <div style="flex: 1; min-width: 100px; height: 10px; background: var(--bg-elevated); border-radius: 5px; overflow: hidden;">
                            <div style="width: 65%; height: 100%; background: var(--accent-primary);"></div>
                        </div>
                        <span style="color: var(--accent-secondary);">中性</span>
                        <div style="flex: 1; min-width: 100px; height: 10px; background: var(--bg-elevated); border-radius: 5px; overflow: hidden;">
                            <div style="width: 25%; height: 100%; background: var(--accent-secondary);"></div>
                        </div>
                        <span style="color: var(--accent-danger);">负面</span>
                        <div style="flex: 1; min-width: 100px; height: 10px; background: var(--bg-elevated); border-radius: 5px; overflow: hidden;">
                            <div style="width: 10%; height: 100%; background: var(--accent-danger);"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin: 20px 0;">
                <h5>趋势变化：</h5>
                <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>近7天趋势：</span>
                        <span style="color: var(--accent-primary); font-weight: bold;">↗ +${Math.floor(Math.random() * 30) + 10}%</span>
                        <span style="color: var(--text-secondary);">较上期增长</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('visible');
}

function showAlertDetail(country, count) {
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = `${country} - 负面信息警示`;
    body.innerHTML = `
        <div style="padding: 20px; color: var(--accent-danger);">
            <h4>⚠️ 警示信息</h4>
            <p>${country} 地区检测到 ${count} 条负面信息</p>
            <div style="margin: 20px 0;">
                <h5>主要风险类型：</h5>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li>涉政信息（占比 35%）</li>
                    <li>极端主义言论（占比 20%）</li>
                    <li>暴力内容（占比 15%）</li>
                </ul>
            </div>
            <div style="margin: 20px 0;">
                <h5>建议措施：</h5>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li>加强内容审核机制</li>
                    <li>提高用户举报响应速度</li>
                    <li>部署智能识别算法</li>
                </ul>
            </div>
            <button onclick="closeModal()" style="
                width: 100%;
                padding: 10px;
                background: var(--accent-danger);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            ">关闭警示</button>
        </div>
    `;

    modal.classList.add('visible');
}

function closeModal() {
    document.getElementById('detail-modal').classList.remove('visible');
}

// ==================== 类型下拉菜单 ====================
function setupTypeDropdown() {
    const dropdownBtn = document.getElementById('type-dropdown-btn');
    const dropdownMenu = document.getElementById('type-dropdown-menu');
    const closeBtn = document.getElementById('type-dropdown-close');
    const selectAllCheckbox = document.getElementById('select-all-types');
    const typeCount = document.getElementById('type-count');

    // 切换下拉菜单
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownBtn.classList.toggle('active');
        closeOtherDropdowns('type-dropdown');
    });

    // 关闭按钮
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownBtn.classList.remove('active');
    });

    // 全选复选框
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = dropdownMenu.querySelectorAll('.dropdown-item input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = this.checked);
        updateTypeCount();
    });

    // 类型复选框
    dropdownMenu.querySelectorAll('.dropdown-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllCheckbox();
            updateTypeCount();
        });
    });

    // 更新类型数量显示
    function updateTypeCount() {
        const checkboxes = dropdownMenu.querySelectorAll('.dropdown-item input[type="checkbox"]');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const totalCount = checkboxes.length;

        if (checkedCount === totalCount) {
            typeCount.textContent = '全选';
        } else if (checkedCount === 0) {
            typeCount.textContent = '未选择';
        } else {
            typeCount.textContent = `${checkedCount}/${totalCount}`;
        }

        // 应用筛选
        applyTypeFilter();
    }

    // 更新全选复选框状态
    function updateSelectAllCheckbox() {
        const checkboxes = dropdownMenu.querySelectorAll('.dropdown-item input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
    }

    // 应用类型筛选
    function applyTypeFilter() {
        const checkboxes = dropdownMenu.querySelectorAll('.dropdown-item input[type="checkbox"]');
        const selectedTypes = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        renderEvents(selectedTypes);
    }

    // 点击外部关闭
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownBtn.classList.remove('active');
        }
    });
}

// ==================== 时间范围下拉菜单 ====================
function setupTimeDropdown() {
    const dropdownBtn = document.getElementById('time-dropdown-btn');
    const dropdownMenu = document.getElementById('time-dropdown-menu');
    const closeBtn = document.getElementById('time-dropdown-close');
    const timeValue = document.getElementById('time-value');
    const applyBtn = document.getElementById('time-apply-btn');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    // 初始化日期
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    startDateInput.value = formatDate(sevenDaysAgo);
    endDateInput.value = formatDate(today);

    // 切换下拉菜单
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownBtn.classList.toggle('active');
        closeOtherDropdowns('time-dropdown');
    });

    // 关闭按钮
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownBtn.classList.remove('active');
    });

    // 预设时间按钮
    dropdownMenu.querySelectorAll('.time-preset').forEach(btn => {
        btn.addEventListener('click', function() {
            dropdownMenu.querySelectorAll('.time-preset').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const days = parseInt(this.dataset.days);
            updateTimeDisplay(days);
        });
    });

    // 应用自定义时间范围
    applyBtn.addEventListener('click', function() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate > endDate) {
            showNotification('开始日期不能晚于结束日期');
            return;
        }

        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        dropdownMenu.querySelectorAll('.time-preset').forEach(b => b.classList.remove('active'));
        timeValue.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        showNotification(`已设置时间范围：${diffDays}天`);

        dropdownBtn.classList.remove('active');

        // 重新渲染数据
        renderEvents();
    });

    // 更新时间显示
    function updateTimeDisplay(days) {
        if (days === 1) {
            timeValue.textContent = '今天';
        } else if (days === 3) {
            timeValue.textContent = '近3天';
        } else if (days === 7) {
            timeValue.textContent = '近7天';
        } else if (days === 30) {
            timeValue.textContent = '近30天';
        }

        // 重新渲染数据
        renderEvents();
    }

    // 格式化日期
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 点击外部关闭
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownBtn.classList.remove('active');
        }
    });
}

// ==================== 关闭其他下拉菜单 ====================
function closeOtherDropdowns(currentId) {
    const allDropdowns = document.querySelectorAll('.filter-dropdown-btn');
    allDropdowns.forEach(btn => {
        const dropdown = btn.closest('.filter-dropdown');
        if (dropdown.id !== currentId) {
            btn.classList.remove('active');
        }
    });
}

// ==================== 通知系统 ====================
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-elevated);
        border: 1px solid var(--accent-cyan);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slide-in 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slide-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== 响应式处理 ====================
window.addEventListener('resize', () => {
    // 当窗口大小改变时重新调整布局
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        // 移动端优化
        document.querySelectorAll('.stat-card').forEach(card => {
            card.style.fontSize = '14px';
        });
    }
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    stopLiveUpdates();
});
