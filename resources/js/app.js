const {createApp, ref, computed, reactive} = Vue;
const {ElMessage} = ElementPlus;

// 默认设置值-搜索引擎
const DEFAULT_ENGINE_NAME = 'Bing';
// 默认设置值-是否开启辉光数字
const DEFAULT_IS_STEINS_GATE_OPEN = true;
// 默认设置值-辉光数字速度（个/ms）
const DEFAULT_STEINS_GATE_SPEED = 80;
// 默认设置值-辉光数字停留时间（ms）
const DEFAULT_STEINS_GATE_KEEP_TIME = 2800;
// 默认设置值-辉光数字移动距离（px）
const DEFAULT_STEINS_GATE_MOVE_DISTANCE = 250;
// 默认设置值-卡片标记颜色
const DEFAULT_CARD_MARK_COLOR = 'rgba(92, 124, 250, 0.8)';
//原默认值'rgba(210, 57, 24)'

const app = createApp({
    data() {
        return {
            // 当前选择的搜索引擎
            currentEngineName: DEFAULT_ENGINE_NAME,
            // 搜索引擎
            searchEngines: [
                {name: 'Bing', label: '必应', url: 'https://www.bing.com/search?q='},
                {name: 'Baidu', label: '百度', url: 'https://www.baidu.com/s?wd='},
                {name: 'Google', label: '谷歌', url: 'https://www.google.com/search?q='},
                {name: 'RedNote', label: '小红书', url: 'https://www.xiaohongshu.com/search_result?keyword='},
                {name: 'Wechat', label: '微信文章', url: 'https://weixin.sogou.com/weixin?type=2&s_from=input&query='},
                {name: 'ZhiHu', label: '知乎', url: 'https://www.zhihu.com/search?type=content&q='},
                {name: 'GitHub', label: 'GitHub', url: 'https://github.com/search?q='},
                {name: 'V2EX', label: 'V2EX', url: 'https://www.google.com.hk/search?q=site:v2ex.com/t%20'},
                {name: 'WikipediaCn', label: 'Wikipedia CN', url: 'https://zh.wikipedia.org/w/index.php?search='},
                {name: 'WikipediaJa', label: 'Wikipedia JA', url: 'https://ja.wikipedia.org/w/index.php?search='},
            ],
            searchQuery: '',
            hiToKoToText: '',
            isSearchBarFixed: false,
            //首页收藏组名（添加新组时直接在后面追加格式：自定义英文组名: '自定义组名', ）
            bookMarkGroupNames: {
                commonlyUsedLinks: '常用链接',
                entertainmentLinks: '世俗娱乐',
                otherLinks: '快速访问',
            },
            //首页收藏夹，添加新组时追加格式：
            //  上面那个自定义的英文组名: [ {xxx},{xxx},{xxx} ],
            //  xxx是对象格式 {id: 每组单独前缀数字+顺序数字, name: 只能英文（我习惯首字母大写） ,label: 随意显示出来的名称 ,url: 如名},
            //  注意因为这个是首页收藏夹，所以你还需要在icons.svg文件中添加对应的图标，格式：
            //  <symbol id="上面那行说的只能英文的name" viewBox="0 0 1024 1024">
            //         <path d="XXX" fill="#XXX"/>
            //  </symbol>
            bookMarkGroups: {
                commonlyUsedLinks: [
                    {id: 101, name: 'WorkFlowy', label: 'WorkFlowy', url: 'https://workflowy.com/'},
                    {id: 102, name: 'Notion', label: 'Notion', url: 'https://www.notion.com/'},
                    {id: 103, name: 'Habitica', label: 'Habitica', url: 'https://habtica.com/'},
                    {id: 104, name: 'JustNote', label: 'JustNote', url: 'https://justnote.cc/'},
                    {id: 105, name: 'Follow', label: 'Follow', url: 'https://app.follow.is/feeds'},
                ],
                entertainmentLinks: [
                    {id: 301, name: 'bangumi', label: 'bangumi', url: 'https://bangumi.tv/'},
                    {id: 302, name: 'bilibili', label: 'bili稍后再看', url: 'https://www.bilibili.com/watchlater/#/list'},
                    {id: 303, name: 'TieBa', label: '贴吧', url: 'https://tieba.baidu.com/'},
                    {id: 304, name: 'WeiBo', label: '微博', url: 'https://weibo.com'},
                    {id: 305, name: 'Telegram', label: 'Telegram', url: 'https://web.telegram.org/a/'},
                    {id: 306, name: 'Twitter', label: 'Twitter', url: 'https://twitter.com'},
                    {id: 307, name: 'BlueSky', label: 'BlueSky', url: 'https://bsky.app/'},
                    {id: 308, name: 'Pixiv', label: 'Pixiv', url: 'https://www.pixiv.net/'},
                    {id: 309, name: 'Steam', label: 'Steam', url: 'https://store.steampowered.com/'},
                    {id: 310, name: '52poke', label: '神百', url: 'http://wiki.52poke.com/wiki/主页'},
                    {id: 311, name: 'MX动漫', label: 'MX动漫', url: 'http://mxdm.xyz/'},
                    {id: 312, name: 'OmoFun', label: 'OmoFun', url: 'https://omofun.in/'},
                ],
                otherLinks: [
                    {id: 401, name: 'ChatGPT', label: 'ChatGPT', url: 'https://chatgpt.com/'},
                    {id: 402, name: 'DeepSeek', label: 'DeepSeek', url: 'https://chat.deepseek.com'},
                    {id: 403, name: 'MikuTools', label: 'MikuTools', url: 'https://tools.miku.ac/'},
                    {id: 404, name: 'ImagesTool', label: 'Images Tool', url: 'https://imagestool.com/'},
                    {id: 405, name: 'iLovePDF', label: 'iLovePDF', url: 'https://www.ilovepdf.com/'},
                    {id: 406, name: 'Onedrive', label: 'Onedrive', url: 'https://onedrive.live.com/'},
                    {id: 407, name: 'DeepL', label: 'DeepL', url: 'https://www.deepl.com/'},
                    {id: 408, name: 'FeiShu', label: '飞书妙记', url: 'https://www.feishu.cn/product/minutes'},
                    {id: 409, name: 'BaiMiao', label: '白描', url: 'https://web.baimiaoapp.com/'},
                    {id: 410, name: 'ToKindle', label: 'To Kindle', url: 'https://www.amazon.com/sendtokindle'},
                    {id: 411, name: 'TxtXrl', label: '易笺', url: 'https://txt.xrl.app/'},
                    {id: 412, name: 'MImageViewer', label: '瀑布流图片', url: 'https://wlm3201.github.io/Masonry_Image_Viewer/'},
                    {id: 413, name: 'Smms', label: 'SM.MS', url: 'https://smms.app/'},
                    {id: 414, name: 'Photopea', label: 'Photopea', url: 'https://www.photopea.com/'},
                    {id: 415, name: 'Cobalt', label: 'Cobalt', url: 'https://cobalt.tools/'},
//                    {id: 416, name: 'noharae', label: '野原', url: 'https://noharae.eu.org/'},
                ]
            },
            bookMarkHoverStates: reactive({}),
            // 左抽屉组名（添加新组时直接在后面追加格式：自定义英文组名: '自定义组名', ）
            leftBookMarkGroupNames: {
                emailLinks: '邮箱',
                cloudDiskLinks: '云盘',
                fileLinks: '综合/文件',
                aiLinks: 'AI',
                dictionaryLinks: '翻译/词典',
                textLinks: '文字',
                audioLinks: '音频/视频',
                pictureLinks: '图片',
                bookLinks: '文学/书籍',
                mindMapLinks: '思维绘图',
                developLinks: '开发/部署',
                otherLinks: '未分类'
            },
            // 左抽屉收藏夹，添加新组时追加格式：
            //  上面那个自定义的英文组名: [ {xxx},{xxx},{xxx} ],
            //  xxx是对象格式 {id: 每组单独前缀数字+顺序数字, mark: 是否高亮标签 ,label: 随意显示出来的名称 ,url: 如名},
            leftBookMarkGroups: {
                emailLinks: [
                    {id: 101, mark: false, label: 'Outlook', url: 'https://outlook.live.com'},
                    {id: 102, mark: false, label: 'Gmail', url: 'https://mail.google.com/mail'},
                    {id: 103, mark: false, label: '163邮箱', url: 'https://mail.163.com/'},
                    {id: 104, mark: false, label: '阿里邮箱', url: 'https://mail.aliyun.com/'},
                ],
                cloudDiskLinks: [
                    {id: 201, mark: true, label: 'Onedrive', url: 'https://onedrive.live.com/'},
                    {id: 202, mark: false, label: 'MEGA', url: 'https://mega.nz/'},
                    {id: 203, mark: false, label: '坚果云', url: 'https://www.jianguoyun.com/'},
                    {id: 204, mark: false, label: '百度网盘', url: 'http://pan.baidu.com/disk/home'},
                    {id: 205, mark: false, label: '阿里云盘', url: 'https://www.aliyundrive.com/drive'},
                    {id: 206, mark: false, label: 'Office365', url: 'https://www.office.com/?auth=1'},
                    {id: 207, mark: false, label: '萌盘', url: 'https://pan.moe/home'},
                ],
                fileLinks: [
                    {id: 301, mark: true, label: 'MikuTools', url: 'https://tools.miku.ac/'},
                    {id: 302, mark: false, label: '即时工具', url: 'https://www.67tool.com/'},
                    {id: 303, mark: false, label: 'Convertio 转换', url: 'https://convertio.co/zh/'},
                    {id: 304, mark: false, label: 'docsmall', url: 'https://docsmall.com/'},
                    {id: 305, mark: true, label: 'iLovePDF', url: 'https://www.ilovepdf.com/'},
                    {id: 306, mark: false, label: 'Stirling PDF', url: 'https://stirlingpdf.io/'},
                    {id: 307, mark: false, label: 'WulinGate', url: 'https://www.wulingate.com/'},
                    {id: 308, mark: false, label: '文叔叔', url: 'https://www.wenshushu.cn/'},
                    {id: 309, mark: false, label: '微信文件传输', url: 'https://szfilehelper.weixin.qq.com/'},
                ],
                aiLinks: [
                    {id: 401, mark: false, label: 'ChatGPT', url: 'https://chatgpt.com/'}, 
                    {id: 402, mark: false, label: 'DeepSeek', url: 'https://chat.deepseek.com'}, 
                    {id: 403, mark: true, label: 'Gemini', url: 'https://gemini.google.com/app'},
                    {id: 404, mark: false, label: 'Copilot', url: 'https://github.com/copilot'},
                    {id: 405, mark: false, label: 'Poe', url: 'https://poe.com/GPT-4-Turbo'},
                    {id: 406, mark: false, label: 'aiStudio', url: 'https://aistudio.google.com/app/prompts/new_chat'},
                    {id: 407, mark: false, label: '必应图像创建器', url: 'https://cn.bing.com/images/create/'},
                    {id: 408, mark: false, label: '结构化提示词', url: 'https://langgptai.feishu.cn/wiki/WOMhwOkPsiNacKkgz2ecu9Mmngc'},
                    {id: 409, mark: false, label: 'Kimi', url: 'https://kimi.moonshot.cn/'},
                    {id: 410, mark: false, label: '豆包', url: 'https://www.doubao.com/chat/'},
                    {id: 411, mark: false, label: '问小白', url: 'https://www.wenxiaobai.com/'},
                    {id: 412, mark: false, label: '秘塔搜索', url: 'https://metaso.cn/'},
                ],
                dictionaryLinks: [
                    {id: 501, mark: true, label: 'Google翻译', url: 'https://translate.google.com.hk/?hl=zh-CN&tab=wT'},
                    {id: 502, mark: false, label: '百度翻译', url: 'https://fanyi.baidu.com/mtpe-individual/multimodal#/'},
                    {id: 503, mark: false, label: '有道翻译', url: 'https://fanyi.youdao.com/#/AITranslate'},
                    {id: 504, mark: true, label: 'DeepL', url: 'https://www.deepl.com/'},
                    {id: 505, mark: false, label: 'Linguee', url: 'https://www.linguee.com/'},
                    {id: 506, mark: false, label: 'Weblio辞書', url: 'https://www.weblio.jp/'},
                    {id: 507, mark: false, label: 'Weblio古语辞典', url: 'https://kobun.weblio.jp/'},
                ],
                textLinks: [
                    {id: 701, mark: true, label: '深言达意', url: 'https://www.shenyandayi.com/'},
                    {id: 702, mark: false, label: '反向词典', url: 'https://wantwords.net/'},
                    {id: 703, mark: false, label: '据意查句', url: 'https://wantquotes.net/'},
                    {id: 704, mark: false, label: 'DeepL Write', url: 'https://www.deepl.com/zh/write'},
                    {id: 705, mark: false, label: 'Underworld PrivateBin', url: 'https://paste.underworld.fr/'},
                    {id: 706, mark: false, label: 'Unicode 符号表', url: 'https://unicode-table.com/cn/'},
                    {id: 707, mark: false, label: 'Emoji searcher', url: 'https://emoji.muan.co/#'},
                    {id: 708, mark: false, label: 'Fancy Text Generator', url: 'https://lingojam.com/FancyTextGenerator'},
                    {id: 709, mark: false, label: 'MD转换', url: 'https://www.strerr.com/cn/markdown2word.html'},
                    {id: 710, mark: false, label: 'Paste to Markdown', url: 'https://euangoddard.github.io/clipboard2markdown/'},
                    {id: 711, mark: false, label: 'Table Convert Online', url: 'https://tableconvert.com/'},
                    {id: 712, mark: false, label: 'MarkdownMate', url: 'https://kimmknight.github.io/MarkdownMate/'},
                    {id: 713, mark: true, label: '白描网页版', url: 'https://web.baimiaoapp.com/'},
                    {id: 714, mark: false, label: 'regex101', url: 'https://regex101.com/'},
                    {id: 715, mark: false, label: 'Text Compare', url: 'https://diffsuite.com/'},
                    
                ],
                audioLinks: [
                    {id: 801, mark: true, label: '飞书妙记', url: 'https://www.feishu.cn/product/minutes'},
                    {id: 802, mark: true, label: 'Whisper JAX', url: 'https://huggingface.co/spaces/sanchit-gandhi/whisper-jax'},
                    {id: 803, mark: false, label: '文本转语音 Microsoft Azure', url: 'https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/?cdn=disable#features'},
                    {id: 804, mark: false, label: '时分秒计算器', url: 'https://www.23bei.com/tool/286.html'},
                    {id: 805, mark: false, label: '歌词字幕转换器', url: 'http://www.lrccon.com/convert.php'},
                    {id: 806, mark: false, label: 'bili视频摘要', url: 'https://aitodo.co/'},
                    {id: 807, mark: true, label: 'Cobalt 下载', url: 'https://cobalt.tools/'},
                    {id: 808, mark: false, label: 'SaveTwitter', url: 'https://savetwitter.net/'},
                ],
                pictureLinks: [
                    {id: 901, mark: true, label: 'Images Tool', url: 'https://imagestool.com/zh_CN/'},
                    {id: 902, mark: false, label: 'Photopea', url: 'https://www.photopea.com/'},
                    {id: 903, mark: false, label: '在线PS', url: 'https://ps.gaoding.com/#/?hmsr=zc-cc'},
                    {id: 904, mark: false, label: '图片改字PS', url: 'https://www.tugaigai.com/online_ps/'},
                    {id: 905, mark: false, label: 'iLoveIMG', url: 'https://www.iloveimg.com/zh-cn'},
                    {id: 906, mark: false, label: 'docsmall', url: 'https://docsmall.com/'},
                    {id: 907, mark: false, label: '截图拼接工具', url: 'http://join-screenshots.zhanghai.me/'},
                    {id: 908, mark: false, label: 'Caesium 压缩', url: 'https://caesium.app/'},
                    {id: 909, mark: false, label: 'waifu2x', url: 'https://waifu2x.udp.jp/index.zh-CN.html'},
                    {id: 910, mark: false, label: 'Bigjpg', url: 'https://bigjpg.com/'},
                    {id: 911, mark: false, label: 'Cleanup.pictures', url: 'https://cleanup.pictures/'},
                    {id: 912, mark: false, label: 'One Last Image', url: 'https://lab.magiconch.com/one-last-image/'},
                    {id: 913, mark: true, label: 'SM.MS', url: 'https://smms.app/'},
                    {id: 914, mark: false, label: '流浪图床', url: 'https://p.sda1.dev/'},
                    {id: 915, mark: false, label: '路过图床', url: 'https://imgse.com/'},
                    {id: 916, mark: false, label: 'Snaggy', url: 'https://snag.gy/'},
                    {id: 917, mark: true, label: 'Pixian.AI', url: 'https://pixian.ai/'},
                    {id: 918, mark: false, label: 'remove.bg', url: 'https://www.remove.bg/zh/'},
                    {id: 919, mark: false, label: 'Bg Eraser', url: 'https://www.bgeraser.com/'},
                    {id: 920, mark: false, label: 'Photo Editor', url: 'https://photokit.com/'},
                    {id: 921, mark: false, label: 'Segment Anything', url: 'https://segment-anything.com/demo#'},
                    {id: 922, true: false, label: 'Free Icons', url: 'https://icons8.com/'},
                    {id: 923, mark: false, label: 'tablericons', url: 'https://tablericons.com/'},
                    {id: 924, mark: false, label: '阿里巴巴矢量图标库', url: 'https://www.iconfont.cn/'},
                    {id: 925, mark: false, label: 'PNG转SVG', url: 'https://www.samt.cloud/'},
                    {id: 926, mark: false, label: 'SVG在线压缩合并工具', url: 'https://www.zhangxinxu.com/sp/svgo/'},
                    {id: 927, mark: false, label: '图片隐写加密', url: 'http://c.p2hp.com/yinxietu/'},
                ],
                bookLinks: [
                    {id: 601, mark: false, label: 'Send To Kindle', url: 'https://www.amazon.com/sendtokindle'}, 
                    {id: 602, mark: false, label: 'Amazon 收藏', url: 'https://www.amazon.com/hz/mycd/myx#/home/content/collection/modDateDsc/'},
                    {id: 603, mark: false, label: '天火藏書', url: 'https://ebook.cdict.info/epub/'},
                    {id: 604, mark: false, label: 'Epub Manga Creator', url: 'https://wing-kai.github.io/epub-manga-creator/'},
                    {id: 605, mark: false, label: '古诗文网', url: 'https://www.gushiwen.cn/'},
                    {id: 606, mark: false, label: '鲁迅博物馆', url: 'http://www.luxunmuseum.com.cn/cx/works.php'},
                ],
                mindMapLinks: [
                    {id: 1001, mark: false, label: '百度脑图', url: 'https://naotu.baidu.com/'},
                    {id: 1002, mark: false, label: 'tldraw', url: 'https://www.tldraw.com/'},
                    {id: 1003, mark: false, label: '思绪思维导图', url: 'https://wanglin2.github.io/mind-map/#/'},
                    {id: 1004, mark: false, label: 'Ankiweb', url: 'https://ankiweb.net/decks'},
                    {id: 1005, mark: false, label: 'Excalidraw', url: 'https://excalidraw.com/'},
                    {id: 1006, mark: false, label: 'ProcessOn', url: 'https://www.processon.com/'},
                ],
                developLinks: [
                    {id: 1101, mark: false, label: 'GitHub', url: 'https://github.com/'},
                    {id: 1102, mark: false, label: '在线工具', url: 'https://tool.lu/'},
                    {id: 1103, mark: false, label: '脚本之家', url: 'https://tools.jb51.net/'},
                    {id: 1104, mark: false, label: 'EU.org', url: 'https://nic.eu.org/arf/en'},
                    {id: 1105, mark: false, label: 'Vercel', url: 'https://vercel.com/'},
                    {id: 1106, mark: false, label: 'Netlify', url: 'https://app.netlify.com/'},
                    {id: 1107, mark: false, label: 'ClawCloud', url: 'https://ap-southeast-1.run.claw.cloud/'},
                    {id: 1108, mark: false, label: 'Cloudflare', url: 'https://dash.cloudflare.com/'},
                    {id: 1109, mark: false, label: 'Spaceship', url: 'https://www.spaceship.com/zh/launchpad/'},
                ],
                otherLinks: [
                    {id: 1201, mark: false, label: 'RSSHub', url: 'https://docs.rsshub.app/zh/'},
                    {id: 1202, mark: false, label: 'Quicker动作库', url: 'https://getquicker.net/Share/Actions'},
                    {id: 1203, mark: false, label: 'Zapier', url: 'https://zapier.com/app/dashboard'},
                    {id: 1204, mark: false, label: 'ZeroTier Central', url: 'https://my.zerotier.com/network'},
                    {id: 1205, mark: false, label: 'Telegraph', url: 'https://telegra.ph/'},
                    {id: 1206, mark: false, label: 'Sticky notes', url: 'https://notes-sticky.vercel.app/'},
                    {id: 1207, mark: false, label: 'Bookmarklet书签', url: 'https://www.runningcheese.com/bookmarklets'},
                    {id: 1208, mark: false, label: '在线钢琴模拟器', url: 'https://www.xiwnn.com/piano/'},
                    {id: 1209, mark: false, label: 'Wayback Machine', url: 'https://web.archive.org/save/'},
                    {id: 1210, mark: false, label: 'Cotrans Manga Image Translator', url: 'https://cotrans.touhou.ai//'},
                    {id: 1211, mark: false, label: 'MangaEditor', url: 'https://moeka.me/mangaEditor/'},
                    {id: 1212, mark: false, label: 'YOPmail', url: 'https://yopmail.com/zh/'},
                    
                    {id: 1212, mark: false, label: '传统颜色', url: 'https://www.zhongguose.com/'},
                    {id: 1213, mark: false, label: '日本の伝統色', url: 'http://nipponcolors.com/'},
                    {id: 1214, mark: false, label: '一言', url: 'http://hitokoto.cn/'},
                    {id: 1215, mark: false, label: '今日热榜官网', url: 'https://tophub.today/'},
                    {id: 1216, mark: false, label: 'Literature Clock', url: 'http://jenevoldsen.com/literature-clock/'},
                    {id: 1217, mark: false, label: 'Time.is', url: 'https://time.is/'},
                    {id: 1218, mark: false, label: 'Google 趋势', url: 'https://trends.google.com/trends/?geo=US'},
                    {id: 1219, mark: false, label: '菜单一键生成', url: 'https://www.xiachufang.com/page/market/2311/'},
                ],
            },
            leftBookMarkHoverStates: reactive({}),
            //右抽屉组名（添加新组时直接在后面追加格式：自定义英文组名: '自定义组名', ）
            rightBookMarkGroupNames: {
                comprehensiveLinks: '综合',
                AnimaLinks: '动画',
                subtitleLinks: '字幕',
                comicLinks: '漫画',
                fanArtLinks: '图片/同人/画集/其它',
                gameLinks: '游戏',
                onlineGameLinks: '在线娱乐',
                musicLinks: '音乐',
                sheetMusicLinks: '乐谱',
                bookLinks: '书籍',
                softwareLinks: '软件',
                buyLinks: '买买买',
                pmLinks: 'PM',
                sgLinks: '科A',
                jyLinks: '几原',
                otherLinks: '杂',
            },
            //右抽屉收藏夹，添加新组时追加格式：
            //  上面那个自定义的英文组名: [ {xxx},{xxx},{xxx} ],
            //  xxx是对象格式 {id: 每组单独前缀数字+顺序数字, mark: 是否高亮标签 ,label: 随意显示出来的名称 ,url: 如名},
            rightBookMarkGroups: {
                comprehensiveLinks: [
                    {id: 101, mark: true, label: 'Nyaa', url: 'https://nyaa.si/'},
                    {id: 102, mark: true, label: '天使动漫论坛', url: 'http://www.tsdm39.com'},
                    {id: 103, mark: true, label: '動漫花園', url: 'https://share.dmhy.org/'},
                    {id: 104, mark: false, label: 'RuTracker', url: 'https://rutracker.org/forum/index.php'},
                    {id: 105, mark: false, label: 'Mikan Project', url: 'https://mikanani.me/'},
                    {id: 106, mark: false, label: 'Mikan Project2', url: 'https://mikanime.tv'},
                    {id: 107, mark: false, label: '油管搜索', url: 'https://www.youtube.com/results?search_query'},
                    {id: 108, mark: false, label: '哔哩哔哩搜索', url: 'https://search.bilibili.com/all'},
                    {id: 109, mark: false, label: 'Mastodon', url: 'https://mastodon.social/home'},
                    {id: 110, mark: false, label: 'Discord', url: 'https://discord.com/'},
                    {id: 111, mark: false, label: 'Telegram', url: 'https://web.telegram.org/a/'},
                ],
                AnimaLinks: [
                    {id: 201, mark: true, label: 'MX动漫', url: 'http://mxdm.xyz/'},
                    {id: 202, mark: false, label: 'OmoFun', url: 'https://omofun.in/'},
                    {id: 203, mark: false, label: '稀饭动漫', url: 'https://dick.xfani.com/'},
                    {id: 204, mark: false, label: '飞极速在线', url: 'http://feijisu21.com/'},
                    {id: 205, mark: false, label: 'BTNull', url: 'https://www.gying.org/'},
                    {id: 206, mark: false, label: 'ニコニコ', url: 'https://www.nicovideo.jp/'},
                ],
                subtitleLinks: [
                    {id: 301, mark: true, label: 'Anime字幕论坛', url: 'https://bbs.acgrip.com/'},
                    {id: 302, mark: false, label: 'Japanese subtitles', url: 'https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F'},
                    {id: 303, mark: false, label: '射手网(伪)', url: 'https://assrt.net/'},
                    {id: 304, mark: false, label: '字幕库', url: 'https://zimuku.org/'},
                    {id: 305, mark: false, label: 'SubHD', url: 'https://subhd.tv/'},
                ],
                comicLinks: [
                    {id: 401, mark: true, label: 'Kox.moe', url: 'https://kox.moe/'},
                    {id: 402, mark: true, label: 'DLRaw', url: 'https://dlraw.to/raw/'},
                    {id: 403, mark: false, label: 'A-z manga', url: 'http://www.a-zmanga.net/'},
                    {id: 404, mark: false, label: 'Mangareader', url: 'https://mangareader.tv/'},
                    {id: 405, mark: false, label: 'MangaDex', url: 'https://mangadex.org/'},
                    {id: 406, mark: false, label: 'mangabz', url: 'https://www.mangabz.com'},
                    {id: 407, mark: false, label: '动漫之家漫画网', url: 'https://comic.idmzj.com/'},
                    {id: 408, mark: false, label: '漫画柜', url: 'https://www.manhuagui.com/'},
                    {id: 409, mark: false, label: '古风漫画网', url: 'https://www.gufengmh.com/'},
                    {id: 410, mark: false, label: 'Lililicious', url: 'http://www.lililicious.net/'},
                    {id: 411, mark: false, label: 'BOOK☆WALKER', url: 'https://bookwalker.jp/top/'},
                ],
                fanArtLinks: [
                    {id: 501, mark: true, label: 'Pixiv', url: 'https://www.pixiv.net/'},
                    {id: 502, mark: false, label: 'Yandex.Images', url: 'https://yandex.com/images/'},
                    {id: 503, mark: false, label: 'DeviantArt', url: 'https://www.deviantart.com/'},
                    {id: 504, mark: false, label: 'Zerochan HQ', url: 'https://www.zerochan.net/'},
                    {id: 505, mark: true, label: 'Settei Dreams', url: 'https://setteidreams.net/settei/'},
                    {id: 506, mark: true, label: 'Internet Archive', url: 'https://archive.org/'},
                    {id: 507, mark: false, label: 'sakugabooru', url: 'https://www.sakugabooru.com'},
                    {id: 508, mark: false, label: 'exhentai.org', url: 'https://exhentai.org/'},
                    {id: 509, mark: false, label: 'SauceNAO', url: 'https://saucenao.com/'},
                    {id: 510, mark: false, label: '搜图bot', url: 'https://soutubot.moe/'},
                    {id: 511, mark: false, label: 'DLsite', url: 'https://www.dlsite.com/index.html'},
                    {id: 512, mark: false, label: 'BOOTH', url: 'https://booth.pm/zh-cn'},
                    {id: 513, mark: false, label: 'Archive of Our Own', url: 'https://archiveofourown.org/'},
                ],
                gameLinks: [
                    {id: 601, mark: false, label: 'Steam', url: 'https://store.steampowered.com/'},
                    {id: 602, mark: false, label: 'GOG', url: 'https://www.gog.com/'},
                    {id: 603, mark: false, label: 'Epic', url: 'https://store.epicgames.com'},
                    {id: 604, mark: false, label: 'steamdb.info', url: 'https://steamdb.info/'},
                    {id: 605, mark: false, label: 'Nintendo Official', url: 'https://www.nintendo.com/'},
                    {id: 606, mark: false, label: 'Nintendo Store', url: 'https://store.nintendo.com.hk/games/all-released-games'},
                    {id: 607, mark: true, label: '老男人游戏网', url: 'https://www.oldmantvg.net/'},
                    {id: 608, mark: false, label: '爱3DS', url: 'https://i3ds.fun/'},
                    {id: 609, mark: false, label: 'switch520', url: 'https://www.gamer520.com/'},
                    {id: 610, mark: false, label: 'Switch520', url: 'https://sway.office.com/ZyHdQKVF0lCLyEuA'},
                    {id: 611, mark: false, label: '太原Switch专修', url: 'https://www.xn--switch-8q7iu0k1wkono.cn/'},
                    {id: 612, mark: false, label: 'Switch | 时鹏亮', url: 'https://shipengliang.com/download/switch/'},
                    {id: 613, mark: false, label: 'Nesbbs', url: 'http://www.nesbbs.com/bbs/'},
                    {id: 617, mark: false, label: '一只火狐的杂物间', url: 'https://stray-soul.com/'},
                ],
                onlineGameLinks: [
                    {id: 701, mark: false, label: '老游戏在线玩', url: 'https://zaixianwan.app/'},
                    {id: 702, mark: false, label: 'Flash 保存计划', url: 'https://flash.zczc.cz/'},
                    {id: 703, mark: false, label: '千秋戏', url: 'https://bubububaoshe.github.io/'},
                    {id: 704, mark: false, label: '千秋戏 - 开发版', url: 'http://edgeofmap.com/qqx/index.html'},
                    {id: 705, mark: false, label: 'Sketch Swap', url: 'http://www.sketchswap.com/'},
                    {id: 706, mark: false, label: '名字竞技场', url: 'http://namerena.github.io/'},
                    {id: 707, mark: false, label: 'Poki在线游戏', url: 'https://poki.com/zh'},
                ],
                musicLinks: [
                    {id: 801, mark: false, label: '网易云音乐', url: 'https://music.163.com/'},
                    {id: 802, mark: true, label: 'JPopsuki', url: 'https://jpopsuki.eu/index.php'},
                    {id: 803, mark: true, label: '天使动漫论坛', url: 'http://www.tsdm39.com'},
                    {id: 804, mark: false, label: 'Nyaa', url: 'https://nyaa.si/'},
                    {id: 805, mark: false, label: 'VGMdb', url: 'https://vgmdb.net/'},
                    {id: 806, mark: false, label: 'iSearch 4.5', url: 'https://i.oppsu.cn/'},
                    {id: 807, mark: false, label: 'ACG漫音社', url: 'http://www.acgjc.com/'},
                    {id: 808, mark: false, label: 'J-pop Music Download', url: 'https://jpop.xyz/'},
                    {id: 809, mark: false, label: 'Sitting on Clouds', url: 'https://www.sittingonclouds.net/'},
                    {id: 810, mark: true, label: 'Video Game Music Downloads', url: 'https://downloads.khinsider.com/'},
                    {id: 811, mark: false, label: '音乐磁场', url: 'https://www.hifini.com/'},
                ],
                sheetMusicLinks: [
                    {id: 901, mark: true, label: 'Musescore', url: 'https://musescore.com/'},
                    {id: 902, mark: false, label: 'dl-librescore', url: 'https://github.com/LibreScore/dl-librescore'},
                    {id: 903, mark: false, label: 'Sheethost', url: 'https://sheet.host/'},
                    {id: 904, mark: false, label: 'Ichigo\'s Sheet Music', url: 'https://ichigos.com/sheets'},
                    {id: 905, mark: false, label: 'josh\'s anime sheet', url: 'http://josh.agarrado.net/music/anime/index.php'},
                    {id: 906, mark: false, label: 'Sheet Music - Theishter', url: 'https://www.theishter.com/sheet-music.html'},
                    {id: 907, mark: false, label: 'IMSLP', url: 'https://cn.imslp.org/wiki/Main_Page'},
                    {id: 908, mark: false, label: 'MidiShow', url: 'https://www.midishow.com/'},
                    {id: 909, mark: false, label: 'canta-per-me  » Sheet Music', url: 'https://canta-per-me.net/sheet-music/unofficial/'},
                    {id: 910, mark: false, label: '虫虫钢琴', url: 'https://www.gangqinpu.com/'},
                    {id: 911, mark: false, label: '弹琴吧', url: 'http://www.tan8.com/'},
                    {id: 912, mark: false, label: '中国曲谱网', url: 'http://www.qupu123.com/Search'},
                ],
                bookLinks: [
                    {id: 1001, mark: true, label: 'Zlib', url: 'https://z-library.sk'},
                    {id: 1002, mark: false, label: 'Internet Archive', url: 'https://archive.org/'},
                    {id: 1003, mark: false, label: 'Book Searcher', url: 'https://zlib.missuo.me/'},
                    {id: 1004, mark: true, label: '安娜的档案', url: 'https://zh.annas-archive.org/'},
                    {id: 1005, mark: false, label: 'Itazuranekoyomi', url: 'https://itazuranekoyomi.neocities.org/library/shousetu/shouall'},
                    {id: 1006, mark: false, label: '青空文庫', url: 'https://www.aozora.gr.jp/'},
                    {id: 1007, mark: false, label: 'MOBIぞら文庫', url: 'http://www.netbuffalo.net/NetApps/kindle/aozora'},
                ],
                softwareLinks: [
                    {id: 1101, mark: false, label: '小众软件', url: 'https://www.appinn.com/'},
                    {id: 1102, mark: false, label: '小众软件论坛', url: 'https://meta.appinn.net/'},
                    {id: 1103, mark: false, label: '果核剥壳', url: 'https://www.ghxi.com/'},
                    {id: 1104, mark: false, label: '423Down', url: 'https://www.423down.com/'},
                    {id: 1105, mark: false, label: 'dayanzai', url: 'http://dayanzai.me/'},
                    {id: 1106, mark: false, label: '吾爱破解', url: 'https://www.52pojie.cn/forum.php'},
                    {id: 1107, mark: false, label: '卡饭网', url: 'https://www.kafan.cn/'},
                    {id: 1108, mark: false, label: 'Репаки мультимедиа программ', url: 'https://lrepacks.net/repaki-multimedia-programm/'},
                    {id: 1109, mark: false, label: 'F-Droid', url: 'https://f-droid.org/zh_Hans/packages/'},
                    {id: 1110, mark: false, label: 'apkcombo', url: 'https://apkcombo.com/zh/'},
                    {id: 1111, mark: false, label: 'APKMirror', url: 'https://www.apkmirror.com/'},
                    {id: 1112, mark: false, label: 'crxsoso', url: 'https://www.crxsoso.com/search'},
                    {id: 1113, mark: false, label: 'strnghrs - 博客园', url: 'https://www.cnblogs.com/stronghorse/'},
                ],
                buyLinks: [
                    {id: 1201, mark: false, label: '駿河屋', url: 'https://www.suruga-ya.jp/feature/campaign/index.html'},
                    {id: 1202, mark: false, label: '現在開催中', url: 'https://www.suruga-ya.jp/feature/campaign/index.html'},
                    {id: 1203, mark: false, label: 'メルカリ', url: 'https://jp.mercari.com/'},
                    {id: 1204, mark: false, label: '日亚', url: 'https://www.amazon.co.jp/'},
                    {id: 1205, mark: false, label: '美亚', url: 'https://www.amazon.com/ref=nav_logo'},
                    {id: 1206, mark: false, label: 'ヤフオク', url: 'https://auctions.yahoo.co.jp/'},
                    {id: 1207, mark: false, label: 'PayPal', url: 'https://www.paypal.com/'},
                    {id: 1208, mark: false, label: 'HPOI 手办维基', url: 'https://www.hpoi.net/'},
                ],
                pmLinks: [
                    {id: 1301, mark: true, label: '神奇宝贝百科', url: 'http://wiki.52poke.com/wiki/主页'},
                    {id: 1302, mark: false, label: 'Bulbapedia', url: 'http://bulbapedia.bulbagarden.net/wiki/Main_Page'},
                    {id: 1303, mark: false, label: '朱／紫 数据库', url: 'https://sv.xzonn.top/wiki/宝可梦一览'},
                    {id: 1304, mark: false, label: '口袋百科', url: 'http://www.pokemon.name/wiki/首页'},
                    {id: 1305, mark: false, label: 'Serebii.net', url: 'https://www.serebii.net/index2.shtml'},
                    {id: 1306, mark: false, label: 'ポケモンWiki', url: 'https://wiki.xn--rckteqa2e.com/wiki/メインページ'},
                    {id: 1307, mark: true, label: 'SHOWDOWN', url: 'http://play.pokemonshowdown.com/'},
                    {id: 1308, mark: false, label: 'SHOWDOWN国服', url: 'http://china.psim.us/'},
                    {id: 1309, mark: false, label: '猫鼬社群 Bot', url: 'https://www.meerkatnow.com/meerkat/389162/393204'},
                    {id: 1310, mark: false, label: 'AI Team Builder', url: 'https://aiteambuilder.com/sv_single_s1.html'},
                    {id: 1311, mark: false, label: 'Pokemon Fusion', url: 'http://pokemon.alexonsager.net/47/93'},
                    {id: 1312, mark: false, label: 'Pokedex.org', url: 'https://www.pokedex.org/'},
                    {id: 1313, mark: false, label: '宝可梦活动公告', url: 'https://sv-news.pokemon.co.jp/sc/list'},
                    {id: 1314, mark: false, label: 'PokéCommunity Forums', url: 'https://www.pokecommunity.com/'},
                    {id: 1315, mark: false, label: '口袋中心', url: 'https://www.pmcenter.cn/'},
                    {id: 1316, mark: false, label: '増田部長のめざめるパワー', url: 'https://gamefreak.co.jp/blog/dir/index.html'},
                ],
                sgLinks: [
                    {id: 1401, mark: false, label: 'Steins;Gate Wiki', url: 'https://steins-gate.fandom.com/wiki/Steins;Gate_Wiki'},
                    {id: 1402, mark: false, label: '未在調査拠点 N.R.W.', url: 'https://nrw.nobody.jp'},
                    {id: 1403, mark: false, label: '科学ADV中文wiki', url: 'https://sci-adv.cc/wiki/首页'},
                    {id: 1404, mark: false, label: '萌娘百科 SG', url: 'https://zh.moegirl.org.cn/命运石之门系列'},
                    {id: 1405, mark: false, label: '未来技术实验室·科A共享服务器', url: 'https://drive.sci-adv.cc/zh-CN/'},
                    {id: 1406, mark: false, label: '新LAB资料库 漫画&小说分库', url: 'https://tieba.baidu.com/p/4621337179'},
                    {id: 1407, mark: false, label: 'Committee of Zero', url: 'https://sonome.dareno.me/'},
                    {id: 1408, mark: false, label: 'ろくに lit.link', url: 'https://lit.link/en/rocni'},
                    {id: 1409, mark: false, label: 'Reddit SG', url: 'https://www.reddit.com/r/steinsgate/'},
                ],
                jyLinks: [
                    {id: 1501, mark: false, label: 'IKUNI', url: 'https://ikuni.net/'},
                    {id: 1502, mark: true, label: '虚构星体观测室', url: 'https://virtualstar.home.blog/'},
                    {id: 1503, mark: true, label: '薔薇物語 テキスト', url: 'http://kasira.blog97.fc2.com/category4-0.html'},
                    {id: 1504, mark: true, label: 'Empty Movement', url: 'http://ohtori.nu/'},
                    {id: 1505, mark: false, label: '>> Resources', url: 'http://ohtori.nu/resources/'},
                    {id: 1506, mark: false, label: '>> Gallery', url: 'http://ohtori.nu/gallery/'},
                    {id: 1507, mark: false, label: '>> Doujinshi', url: 'http://ohtori.nu/doujinshi/'},
                    {id: 1508, mark: false, label: 'Something Eternal', url: 'https://emptymovement.com/'},
                    {id: 1509, mark: false, label: 'イクニのメルとも蔵Blog', url: 'https://ikuni.net/archives/'},
                    {id: 1510, mark: false, label: '霊廟 [フォレストページ＋]', url: 'https://plus.fm-p.jp/u/kobeya_2019'},
                    {id: 1511, mark: false, label: 'スタジオ カノープスsatellite', url: 'https://ameblo.jp/studio-canopus/'},
                    {id: 1512, mark: false, label: '天与海の世界', url: 'http://www.harukamichiru.com/forum.php'},
                    {id: 1513, mark: false, label: '少女革命ウテナ 決闘の歌 注釈', url: 'http://www.ne.jp/asahi/krk/kct/misc/utena_song_tv.htm'},
                ],
                otherLinks: [
                    {id: 1601, mark: true, label: 'YuC\'s AnimeList', url: 'http://yuc.wiki/'},
                    {id: 1602, mark: false, label: '竹箒日記', url: 'http://www.typemoon.org/bbb/diary/'},
                    {id: 1603, mark: false, label: 'TYPE-MOON不完全年表', url: 'http://www.st.rim.or.jp/~nmisaki/topics/typemoon.html'},
                    {id: 1604, mark: false, label: '乐园之扉', url: 'http://fjorg.lofter.com/post/1f46f9a3_1252bef2'},
                    {id: 1605, mark: false, label: 'FictionJunction', url: 'https://fictionjunction.com/'},
                    {id: 1606, mark: false, label: 'canta-per-me', url: 'https://canta-per-me.net/'},
                    {id: 1607, mark: false, label: '白之預言書', url: 'http://www.horizon-wiki.com/'},
                ],
            },
            rightBookMarkHoverStates: reactive({}),
            // 抽屉状态
            leftDrawerVisible: false,
            rightDrawerVisible: false,
            isLeftContainerActive: false,
            isRightContainerActive: false,
            isLeftActive: false,
            isRightActive: false,
            isSteinsGateOpen: DEFAULT_IS_STEINS_GATE_OPEN,
            //辉光数字容器
            steinsGateInterval: null,
            //辉光数字生成速率（多少毫秒生成一个），值越小，速度越快
            steinsGateSpeed: DEFAULT_STEINS_GATE_SPEED,
            //辉光数字保留时间（多少毫秒后消失）
            steinsGateKeepTime: DEFAULT_STEINS_GATE_KEEP_TIME,
            //辉光数字移动距离（px）
            steinsGateMoveDistance: DEFAULT_STEINS_GATE_MOVE_DISTANCE,
            showSettings: false,
            currentYear: new Date().getFullYear(),
            //卡片标记颜色（默认值）
            cardMarkColor: DEFAULT_CARD_MARK_COLOR,
            //预设可选颜色：R，G，B，不透明度
            predefineColors: ref([
                DEFAULT_CARD_MARK_COLOR,
                'rgba(211, 56, 28, 0.8)',
                'rgba(255, 107, 107, 0.8)',
                'rgba(240, 101, 149, 0.8)',
                'rgba(204, 93, 232, 0.8)',
                'rgba(132, 94, 247, 0.8)',
                'rgba(92, 124, 250, 0.8)',
                'rgba(51, 154, 240, 0.8)',
                'rgba(34, 184, 207, 0.8)',
                'rgba(32, 201, 151, 0.8)',
                'rgba(81, 207, 102, 0.8)',
                'rgba(148, 216, 45, 0.8)',
                'rgba(252, 196, 25, 0.8)',
                'rgba(255, 146, 43, 0.8)',
                'rgba(233, 102, 54, 0.5)',
            ])
        }
    },
    created() {
        Object.keys(this.bookMarkGroups).forEach(groupName => {
            this.bookMarkHoverStates[groupName] = reactive({})
            this.bookMarkGroups[groupName].forEach((_, index) => {
                this.bookMarkHoverStates[groupName][index] = false
            })
        })
        Object.keys(this.leftBookMarkGroups).forEach(groupName => {
            this.leftBookMarkHoverStates[groupName] = reactive({})
            this.leftBookMarkGroups[groupName].forEach((_, index) => {
                this.leftBookMarkHoverStates[groupName][index] = false
            })
        })
        Object.keys(this.rightBookMarkGroups).forEach(groupName => {
            this.rightBookMarkHoverStates[groupName] = reactive({})
            this.rightBookMarkGroups[groupName].forEach((_, index) => {
                this.rightBookMarkHoverStates[groupName][index] = false
            })
        })
    },
    computed: {
        // 计算当前使用的搜索引擎
        currentEngine() {
            return this.searchEngines.find(engine => engine.name === this.currentEngineName);
        }
    },
    mounted() {
        this.loadSettings();
        window.addEventListener('scroll', this.handleScroll);
        this.fetchHitokoto();
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        this.handleDrawerClose();
    },
    methods: {
        //隐藏滚动条
        handleScroll() {
            const searchBar = document.querySelector('.search-bar-container');
            const searchBarRect = searchBar.getBoundingClientRect();
            this.isSearchBarFixed = searchBarRect.top <= 0;
            searchBar.classList.toggle('fixed', this.isSearchBarFixed);
        },
        // 更改搜索引擎
        changeSearchEngine(engineName) {
            this.currentEngineName = engineName;
        },
        //获取一言
        async fetchHitokoto() {
            try {
                // a-动画, b-漫画, c-游戏, d-文学, e-原创, f-来自网络, g-其他, h-影视, i-诗词, j-网易云, k-哲学, l-抖机灵
                // 语录大全啥都有：https://v1.hitokoto.cn/?encode=text
                // 只有二次元：https://v1.hitokoto.cn/?c=a&c=b&c=c&encode=text
                const response = await fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&encode=text');
                let text = await response.text();
                if (!response.ok) {
                    ElMessage.error('获取一言异常');
                    text = '你所热爱的，就是你的生活';
                }
                this.hiToKoToText = text;
            } catch (error) {
                ElMessage.error('获取一言出现错误');
                this.hiToKoToText = '你所热爱的，就是你的生活';
            }
        },
        // 执行搜索
        search() {
            if (!this.searchQuery.trim()) {
                this.searchQuery = this.hiToKoToText;
            }
            const searchUrl = this.currentEngine.url + encodeURIComponent(this.searchQuery);
            window.open(searchUrl, '_blank');
        },
        // 打开链接
        openLink(url) {
            window.open(url, '_blank');
        },
        // 获取中文分组名称
        getChineseGroupName(group, groupKey) {
            return group[groupKey] || groupKey
        },
        // 设置卡片悬停状态
        setCardHoverState(group, groupKey, cardIndex, state) {
            group[groupKey][cardIndex] = state
        },
        // 左侧抽屉
        handleClickLeftDrawer() {
            clearInterval(this.steinsGateInterval);
            this.steinsGateInterval = null;
            this.leftDrawerVisible = !this.leftDrawerVisible;
            this.isLeftContainerActive = this.leftDrawerVisible;
            this.isLeftActive = this.leftDrawerVisible;
            this.steinsGateInterval = setInterval(() => {
                this.createSteinsGateNumber('left');
            }, this.steinsGateSpeed);
        },
        // 右侧抽屉
        handleClickRightDrawer() {
            clearInterval(this.steinsGateInterval);
            this.steinsGateInterval = null;
            this.rightDrawerVisible = !this.rightDrawerVisible;
            this.isRightContainerActive = this.rightDrawerVisible;
            this.isRightActive = this.rightDrawerVisible;
            this.steinsGateInterval = setInterval(() => {
                this.createSteinsGateNumber('right');
            }, this.steinsGateSpeed);
        },
        // 边缘悬浮效果
        handleEdgeHoverEnter(direction) {
            if (direction === 'left' && !this.leftDrawerVisible) {
                this.isLeftActive = true;
                this.steinsGateInterval = setInterval(() => {
                    this.createSteinsGateNumber(direction);
                }, this.steinsGateSpeed);
            } else if (direction === 'right' && !this.rightDrawerVisible) {
                this.isRightActive = true;
                this.steinsGateInterval = setInterval(() => {
                    this.createSteinsGateNumber(direction);
                }, this.steinsGateSpeed);
            }
        },
        // 边缘离开
        handleEdgeHoverLeave() {
            if (!this.leftDrawerVisible && !this.rightDrawerVisible) {
                this.isLeftActive = false;
                this.isRightActive = false;
                clearInterval(this.steinsGateInterval);
                this.steinsGateInterval = null;
            }
        },
        // 通用创建命运石之门世界线变动率
        createSteinsGateNumber(direction) {
            if (!this.isSteinsGateOpen) {
                return;
            }
            const number = document.createElement('div');
            number.className = 'steins-gate-number';

            const fontSize = Math.floor(Math.random() * 28 + 18);
            const verticalPos = Math.random() * 95;
            const moveDistance = Math.random() * 200 + this.steinsGateMoveDistance;
            const animationDelay = Math.random() * 0.5;

            number.style.cssText = `
                position: absolute;
                font-size: ${fontSize}px;
                top: ${verticalPos}%;
                ${direction === 'left' ? 'left: -20px' : 'right: -20px'};
                --move-distance: ${direction === 'left' ? moveDistance : -moveDistance};
                animation-delay: ${animationDelay}s;
            `;

            number.textContent = Math.floor(Math.random() * 10);
            const overlayEl = direction === 'left' ?
                document.querySelector('#leftOverlay') :
                document.querySelector('#rightOverlay');
            overlayEl.appendChild(number);

            setTimeout(() => {
                number.remove();
            }, this.steinsGateKeepTime);
        },
        // 抽屉关闭处理
        handleDrawerClose() {
            this.isLeftActive = false;
            this.isRightActive = false;
            this.isLeftContainerActive = false;
            this.isRightContainerActive = false;
            if (this.steinsGateInterval) {
                clearInterval(this.steinsGateInterval);
            }
            this.steinsGateInterval = null;
        },
        beforeUnmount() {
            this.handleDrawerClose();
        },
        // 保存设置
        saveSettings() {
            const settings = {
                engine: this.currentEngineName,
                isSteinsGateOpen: this.isSteinsGateOpen,
                speed: this.steinsGateSpeed,
                keepTime: this.steinsGateKeepTime,
                moveDistance: this.steinsGateMoveDistance,
                color: this.cardMarkColor
            }
            localStorage.setItem('appSettings', JSON.stringify(settings));
            this.showSettings = false;
            document.documentElement.style.setProperty('--el-color-primary', this.cardMarkColor)
            ElMessage.success('设置已保存');
        },

        // 加载设置（包含默认值）（Mu可修改：当你要修改默认值）
        loadSettings() {
            const saved = localStorage.getItem('appSettings');
            if (saved) {
                try {
                    const settings = JSON.parse(saved);
                    this.currentEngineName = settings.engine || DEFAULT_ENGINE_NAME;
                    this.isSteinsGateOpen = settings.isSteinsGateOpen !== false;
                    this.steinsGateSpeed = settings.speed || DEFAULT_STEINS_GATE_SPEED;
                    this.steinsGateKeepTime = settings.keepTime || DEFAULT_STEINS_GATE_KEEP_TIME;
                    this.steinsGateMoveDistance = settings.moveDistance || DEFAULT_STEINS_GATE_MOVE_DISTANCE;
                    this.cardMarkColor = settings.color || DEFAULT_CARD_MARK_COLOR;
                } catch(e) {
                    console.error('设置加载失败:', e);
                    ElMessage.error('设置加载失败');
                }
            }
        }
    }
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus);
app.mount('#app'); 