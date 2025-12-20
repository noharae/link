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
// 默认设置值-卡片标记颜色-原默认值'rgba(210, 57, 24)'
const DEFAULT_CARD_MARK_COLOR = 'rgba(92, 124, 250, 0.8)';
// 默认设置值-导航颜色
const DEFAULT_NAV_MARK_COLOR = 'rgba(96, 98, 102, 1)';

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
                commonlyUsedLinks: '常用',
                entertainmentLinks: '娱乐',
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
                commonlyUsedLinks: Object.freeze([
                    {name: 'WorkFlowy', label: 'WorkFlowy', url: 'https://workflowy.com/'},
                    {name: 'Habitica', label: 'Habitica', url: 'https://habtica.com/'},
                    {name: 'Notion', label: 'Notion', url: 'https://www.notion.com/'},
                    {name: 'JustNote', label: 'JustNote', url: 'https://justnote.cc/'},
                    {name: 'Follow', label: 'Follow', url: 'https://app.follow.is/feeds'},
                    {name: 'GEMINI', label: 'Gemini', url: 'https://gemini.google.com/app'},
                    {name: 'Onedrive', label: 'Onedrive', url: 'https://onedrive.live.com/'},
                    {name: 'Telegram', label: 'Telegram', url: 'https://web.telegram.org/a/'},
                ]),
                entertainmentLinks: Object.freeze([
                    {name: 'bangumi', label: 'bangumi', url: 'https://bangumi.tv/'},
                    {name: 'bilibili', label: 'bili稍后再看', url: 'https://www.bilibili.com/watchlater/#/list'},
                    {name: 'TieBa', label: '贴吧', url: 'https://tieba.baidu.com/'},
                    {name: 'WeiBo', label: '微博', url: 'https://weibo.com'},
                    {name: 'Twitter', label: 'Twitter', url: 'https://twitter.com'},
                    {name: 'Pixiv', label: 'Pixiv', url: 'https://www.pixiv.net/'},
                    {name: 'Steam', label: 'Steam', url: 'https://store.steampowered.com/'},
                    {name: '52poke', label: '神百', url: 'http://wiki.52poke.com/wiki/主页'},
                    {name: 'Mikan', label: 'Mikan', url: 'https://mikanani.me/'},
                    {name: 'MXAnime', label: 'MX动漫', url: 'http://mxdm.xyz/'},
                ]),
                otherLinks: Object.freeze([
                    
                    {name: 'MikuTools', label: 'MikuTools', url: 'https://tools.miku.ac/'},
                    {name: 'ImagesTool', label: 'Images Tool', url: 'https://imagestool.com/'},
                    {name: 'Photopea', label: 'Photopea', url: 'https://www.photopea.com/'},
                    {name: 'iLovePDF', label: 'iLovePDF', url: 'https://www.ilovepdf.com/'},
                    {name: 'DeepL', label: 'DeepL', url: 'https://www.deepl.com/'},
                    {name: 'FeiShu', label: '飞书妙记', url: 'https://www.feishu.cn/product/minutes'},
                    {name: 'BaiMiao', label: '白描', url: 'https://web.baimiaoapp.com/'},
                    {name: 'ToKindle', label: 'To Kindle', url: 'https://www.amazon.com/sendtokindle'},
                    {name: 'AmazonCollection', label: 'Contentlist', url: 'https://www.amazon.com/hz/mycd/digital-console/contentlist/'},
                    {name: 'TxtXrl', label: '易笺', url: 'https://txt.xrl.app/'},
                    {name: 'MImageViewer', label: '瀑布流图片', url: 'https://wlm3201.github.io/Masonry_Image_Viewer/'},
                    {name: 'Smms', label: 'SM.MS', url: 'https://smms.app/'},
                    {name: 'Cobalt', label: 'Cobalt', url: 'https://cobalt.tools/github'},
                    {name: 'InternetArchive', label: 'Int Archive', url: 'https://archive.org/'},
//                    {name: 'noharae', label: '野原', url: 'https://noharae.eu.org/'},
                ])
            },
            bookMarkHoverStates: reactive({}),
            // 左抽屉组名（添加新组时直接在后面追加格式：自定义英文组名: '自定义组名', ）
            leftBookMarkGroupNames: {
                emailLinks: '邮箱',
                cloudDiskLinks: '云盘',
                fileLinks: '综合',
                aiLinks: 'AI',
                dictionaryLinks: '翻译',
                textLinks: '文本',
                audioLinks: '音视频',
                pictureLinks: '图片',
                bookLinks: '书籍',
                developLinks: '开发',
                otherLinks: '其他'
            },
            // 左抽屉收藏夹，添加新组时追加格式：
            //  上面那个自定义的英文组名: [ {xxx},{xxx},{xxx} ],
            //  xxx是对象格式 {id: 每组单独前缀数字+顺序数字, mark: 是否高亮标签 ,label: 随意显示出来的名称 ,url: 如名},
            leftBookMarkGroups: {
                emailLinks: Object.freeze([
                    {mark: false, label: 'Outlook', url: 'https://outlook.live.com'},
                    {mark: false, label: 'Gmail', url: 'https://mail.google.com/mail'},
                    {mark: false, label: '163邮箱', url: 'https://mail.163.com/'},
                    {mark: false, label: '阿里邮箱', url: 'https://mail.aliyun.com/'},
                ]),
                cloudDiskLinks: Object.freeze([
                    {mark: true, label: 'Onedrive', url: 'https://onedrive.live.com/'},
                    {mark: true, label: 'Google Drive', url: 'https://drive.google.com/'},
                    {mark: false, label: 'MEGA', url: 'https://mega.nz/'},
                    {mark: true, label: '坚果云', url: 'https://www.jianguoyun.com/'},
                    {mark: false, label: '百度网盘', url: 'http://pan.baidu.com/disk/home'},
                    {mark: false, label: '阿里云盘', url: 'https://www.aliyundrive.com/drive'},
                    {mark: false, label: 'Office365', url: 'https://www.office.com/?auth=1'},
                    {mark: true, label: '萌盘', url: 'https://pan.moe/home'},
                ]),
                fileLinks: Object.freeze([
                    {mark: true, label: 'MikuTools', url: 'https://tools.miku.ac/'},
                    {mark: false, label: '即时工具', url: 'https://www.67tool.com/'},
                    {mark: false, label: 'Convertio 转换', url: 'https://convertio.co/zh/'},
                    {mark: false, label: 'docsmall', url: 'https://docsmall.com/'},
                    {mark: true, label: 'iLovePDF', url: 'https://www.ilovepdf.com/'},
                    {mark: false, label: 'Stirling PDF', url: 'https://stirlingpdf.io/'},
                    {mark: false, label: 'WulinGate', url: 'https://www.wulingate.com/'},
                    {mark: false, label: '文叔叔', url: 'https://www.wenshushu.cn/'},
                    {mark: false, label: '微信文件传输', url: 'https://szfilehelper.weixin.qq.com/'},
                ]),
                aiLinks: Object.freeze([
                    {mark: false, label: 'ChatGPT', url: 'https://chatgpt.com/'},
                    {mark: true, label: 'Gemini', url: 'https://gemini.google.com/app'},
                    {mark: false, label: 'AI Studio', url: 'https://aistudio.google.com/app/prompts/new_chat'},
                    {mark: true, label: 'NotebookLM', url: 'https://notebooklm.google/'},
                    {mark: true, label: 'DeepSeek', url: 'https://chat.deepseek.com'},
                    {mark: false, label: 'Kimi', url: 'https://kimi.moonshot.cn/'},
                    {mark: false, label: '豆包', url: 'https://www.doubao.com/chat/'},
                    {mark: false, label: '秘塔搜索', url: 'https://metaso.cn/'},
                    {mark: false, label: 'Poe', url: 'https://poe.com/GPT-4-Turbo'},
                    {mark: false, label: '必应图像创建器', url: 'https://cn.bing.com/images/create/'},
                    {mark: false, label: 'TB AI', url: 'https://tbai.xin/'},
                    {mark: false, label: 'ALL IN API', url: 'https://oneai.evanora.top/'},
                    {mark: false, label: 'OpenRouter', url: 'https://openrouter.ai/'},
                    {mark: false, label: 'Chatbox AI', url: 'https://chatboxai.app/zh'},
                ]),
                dictionaryLinks: Object.freeze([
                    {mark: true, label: 'Google翻译', url: 'https://translate.google.com.hk/?hl=zh-CN&tab=wT'},
                    {mark: false, label: '百度翻译', url: 'https://fanyi.baidu.com/mtpe-individual/multimodal#/'},
                    {mark: false, label: '有道翻译', url: 'https://fanyi.youdao.com/#/AITranslate'},
                    {mark: true, label: 'DeepL', url: 'https://www.deepl.com/'},
                    {mark: false, label: 'Linguee', url: 'https://www.linguee.com/'},
                    {mark: false, label: 'Weblio辞書', url: 'https://www.weblio.jp/'},
                    {mark: false, label: 'Weblio古语辞典', url: 'https://kobun.weblio.jp/'},
                ]),
                textLinks: Object.freeze([
                    {mark: true, label: '深言达意', url: 'https://www.shenyandayi.com/'},
                    {mark: false, label: '反向词典', url: 'https://wantwords.net/'},
                    {mark: false, label: '据意查句', url: 'https://wantquotes.net/'},
                    {mark: false, label: 'DeepL Write', url: 'https://www.deepl.com/zh/write'},
                    {mark: false, label: 'Underworld PrivateBin', url: 'https://paste.underworld.fr/'},
                    {mark: false, label: 'Unicode 符号表', url: 'https://unicode-table.com/cn/'},
                    {mark: false, label: 'Emoji searcher', url: 'https://emoji.muan.co/#'},
                    {mark: false, label: 'Fancy Text Generator', url: 'https://lingojam.com/FancyTextGenerator'},
                    {mark: false, label: 'MD转换', url: 'https://www.strerr.com/cn/markdown2word.html'},
                    {mark: false, label: 'Paste to Markdown', url: 'https://euangoddard.github.io/clipboard2markdown/'},
                    {mark: false, label: 'Table Convert Online', url: 'https://tableconvert.com/'},
                    {mark: false, label: 'MarkdownMate', url: 'https://kimmknight.github.io/MarkdownMate/'},
                    {mark: true, label: '白描网页版', url: 'https://web.baimiaoapp.com/'},
                    {mark: false, label: 'regex101', url: 'https://regex101.com/'},
                    {mark: false, label: 'Text Compare', url: 'https://diffsuite.com/'},
                    {mark: false, label: 'Telegraph', url: 'https://telegra.ph/'},
                ]),
                audioLinks: Object.freeze([
                    {mark: true, label: '飞书妙记', url: 'https://www.feishu.cn/product/minutes'},
                    {mark: true, label: 'Whisper JAX', url: 'https://huggingface.co/spaces/sanchit-gandhi/whisper-jax'},
                    {mark: false, label: '文本转语音 Microsoft Azure', url: 'https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/?cdn=disable#features'},
                    {mark: false, label: '时分秒计算器', url: 'https://www.23bei.com/tool/286.html'},
                    {mark: false, label: '歌词字幕转换器', url: 'http://www.lrccon.com/convert.php'},
                    {mark: false, label: 'bili视频摘要', url: 'https://aitodo.co/'},
                    {mark: true, label: 'Cobalt 下载', url: 'https://cobalt.tools/'},
                    {mark: false, label: 'SaveTwitter', url: 'https://savetwitter.net/'},
                ]),
                pictureLinks: Object.freeze([
                    {mark: true, label: 'Images Tool', url: 'https://imagestool.com/zh_CN/'},
                    {mark: false, label: 'Photopea', url: 'https://www.photopea.com/'},
                    {mark: false, label: '在线PS', url: 'https://ps.gaoding.com/#/?hmsr=zc-cc'},
                    {mark: false, label: '图片改字PS', url: 'https://www.tugaigai.com/online_ps/'},
                    {mark: false, label: 'iLoveIMG', url: 'https://www.iloveimg.com/zh-cn'},
                    {mark: false, label: 'docsmall', url: 'https://docsmall.com/'},
                    {mark: false, label: '截图拼接工具', url: 'http://join-screenshots.zhanghai.me/'},
                    {mark: false, label: 'Caesium 压缩', url: 'https://caesium.app/'},
                    {mark: false, label: 'waifu2x', url: 'https://waifu2x.udp.jp/index.zh-CN.html'},
                    {mark: false, label: 'Bigjpg', url: 'https://bigjpg.com/'},
                    {mark: false, label: 'Cleanup.pictures', url: 'https://cleanup.pictures/'},
                    {mark: false, label: 'One Last Image', url: 'https://lab.magiconch.com/one-last-image/'},
                    {mark: true, label: 'SM.MS', url: 'https://smms.app/'},
                    {mark: false, label: '流浪图床', url: 'https://p.sda1.dev/'},
                    {mark: false, label: '路过图床', url: 'https://imgse.com/'},
                    {mark: false, label: 'Snaggy', url: 'https://snag.gy/'},
                    {mark: true, label: 'Pixian.AI', url: 'https://pixian.ai/'},
                    {mark: false, label: 'remove.bg', url: 'https://www.remove.bg/zh/'},
                    {mark: false, label: 'Bg Eraser', url: 'https://www.bgeraser.com/'},
                    {mark: false, label: 'Photo Editor', url: 'https://photokit.com/'},
                    {mark: false, label: 'Segment Anything', url: 'https://segment-anything.com/demo#'},
                    {mark: true, label: 'Free Icons', url: 'https://icons8.com/'},
                    {mark: false, label: 'tablericons', url: 'https://tablericons.com/'},
                    {mark: false, label: '阿里巴巴矢量图标库', url: 'https://www.iconfont.cn/'},
                    {mark: false, label: 'PNG转SVG', url: 'https://www.samt.cloud/'},
                    {mark: false, label: 'SVG在线压缩合并工具', url: 'https://www.zhangxinxu.com/sp/svgo/'},
                    {mark: false, label: '图片隐写加密', url: 'http://c.p2hp.com/yinxietu/'},
                    {mark: false, label: '好拼-在线拼图', url: 'https://img.ops-coffee.com/photo/'},
                ]),
                bookLinks: Object.freeze([
                    {mark: true, label: 'Send To Kindle', url: 'https://www.amazon.com/sendtokindle'},
                    {mark: true, label: 'Amazon 收藏', url: 'https://www.amazon.com/hz/mycd/myx#/home/content/collection/modDateDsc/'},
                    {mark: false, label: '天火藏書', url: 'https://ebook.cdict.info/epub/'},
                    {mark: false, label: 'Epub Manga Creator', url: 'https://wing-kai.github.io/epub-manga-creator/'},
                    {mark: false, label: '古诗文网', url: 'https://www.gushiwen.cn/'},
                    {mark: false, label: '鲁迅博物馆', url: 'http://www.luxunmuseum.com.cn/cx/works.php'},
                ]),
                developLinks: Object.freeze([
                    {mark: false, label: 'GitHub', url: 'https://github.com/'},
                    {mark: false, label: '在线工具', url: 'https://tool.lu/'},
                    {mark: false, label: '脚本之家', url: 'https://tools.jb51.net/'},
                    {mark: false, label: 'EU.org', url: 'https://nic.eu.org/arf/en'},
                    {mark: false, label: 'Vercel', url: 'https://vercel.com/'},
                    {mark: false, label: 'Netlify', url: 'https://app.netlify.com/'},
                    {mark: false, label: 'ClawCloud', url: 'https://ap-southeast-1.run.claw.cloud/'},
                    {mark: false, label: 'Cloudflare', url: 'https://dash.cloudflare.com/'},
                    {mark: false, label: 'Spaceship', url: 'https://www.spaceship.com/zh/launchpad/'},
                    {mark: false, label: 'API Test', url: 'https://reqbin.com/'},
                ]),
                otherLinks: Object.freeze([
                    {mark: true, label: 'RSSHub', url: 'https://docs.rsshub.app/zh/'},
                    {mark: false, label: 'Quicker动作库', url: 'https://getquicker.net/Share/Actions'},
                    {mark: true, label: 'Zapier', url: 'https://zapier.com/app/dashboard'},
                    {mark: true, label: 'ZeroTier Central', url: 'https://my.zerotier.com/network'},
                    {mark: false, label: 'Sticky notes', url: 'https://notes-sticky.vercel.app/'},
                    {mark: false, label: 'Bookmarklet书签', url: 'https://www.runningcheese.com/bookmarklets'},
                    {mark: false, label: '在线钢琴模拟器', url: 'https://www.xiwnn.com/piano/'},
                    {mark: false, label: 'Wayback Machine', url: 'https://web.archive.org/save/'},
                    {mark: false, label: 'Cotrans Manga Image Translator', url: 'https://cotrans.touhou.ai//'},
                    {mark: false, label: 'MangaEditor', url: 'https://moeka.me/mangaEditor/'},
                    {mark: false, label: 'YOPmail', url: 'https://yopmail.com/zh/'},

                    {mark: false, label: '传统颜色', url: 'https://www.zhongguose.com/'},
                    {mark: false, label: '日本の伝統色', url: 'http://nipponcolors.com/'},
                    {mark: false, label: '一言', url: 'http://hitokoto.cn/'},
                    {mark: false, label: '今日热榜官网', url: 'https://tophub.today/'},
                    {mark: false, label: 'Literature Clock', url: 'http://jenevoldsen.com/literature-clock/'},
                    {mark: false, label: 'Time.is', url: 'https://time.is/'},
                    {mark: false, label: 'Google 趋势', url: 'https://trends.google.com/trends/?geo=US'},
                    {mark: false, label: '菜单一键生成', url: 'https://www.xiachufang.com/page/market/2311/'},
                    {mark: false, label: '百度脑图', url: 'https://naotu.baidu.com/'},
                    {mark: false, label: 'tldraw', url: 'https://www.tldraw.com/'},
                    {mark: false, label: '思绪思维导图', url: 'https://wanglin2.github.io/mind-map/#/'},
                    {mark: false, label: 'Ankiweb', url: 'https://ankiweb.net/decks'},
                    {mark: false, label: 'Excalidraw', url: 'https://excalidraw.com/'},
                    {mark: false, label: 'ProcessOn', url: 'https://www.processon.com/'},
                ]),
            },
            leftBookMarkHoverStates: reactive({}),
            //右抽屉组名（添加新组时直接在后面追加格式：自定义英文组名: '自定义组名', ）
            rightBookMarkGroupNames: {
                comprehensiveLinks: '综合',
                AnimaLinks: '动画',
                subtitleLinks: '字幕',
                comicLinks: '漫画',
                fanArtLinks: '图片/同人/画集',
                gameLinks: '游戏',
                onlineGameLinks: '在线娱乐',
                wikiLinks: '攻略',
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
                comprehensiveLinks: Object.freeze([
                    {mark: true, label: 'Nyaa', url: 'https://nyaa.si/'},
                    {mark: true, label: '天使动漫论坛', url: 'http://www.tsdm39.com'},
                    {mark: true, label: '動漫花園', url: 'https://share.dmhy.org/'},
                    {mark: false, label: 'RuTracker', url: 'https://rutracker.org/forum/index.php'},
                    {mark: true, label: 'Internet Archive', url: 'https://archive.org/'},
                    {mark: false, label: '油管搜索', url: 'https://www.youtube.com/results?search_query'},
                    {mark: false, label: '哔哩哔哩搜索', url: 'https://search.bilibili.com/all'},
                    {mark: false, label: 'Discord', url: 'https://discord.com/'},
                    {mark: false, label: 'Mastodon', url: 'https://mastodon.social/home'},
                    {mark: false, label: 'Telegram', url: 'https://web.telegram.org/a/'},
                ]),
                AnimaLinks: Object.freeze([
                    {mark: true, label: 'MX动漫', url: 'http://mxdm.xyz/'},
                    {mark: false, label: 'OmoFun', url: 'https://omofun.in/'},
                    {mark: true, label: '稀饭动漫', url: 'https://dick.xfani.com/'},
                    {mark: false, label: 'girigiri愛動漫', url: 'https://anime.girigirilove.com/'},
                    {mark: false, label: '次元城动画', url: 'https://www.cycani.org/'},
                    {mark: false, label: 'Anime1.me', url: 'https://anime1.me/'},
                    {mark: false, label: '飞极速在线', url: 'http://feijisu21.com/'},
                    {mark: false, label: 'BTNull', url: 'https://www.gying.org/'},
                    {mark: false, label: 'LIBVIO', url: 'https://libvio.link/'},
                    {mark: false, label: 'ニコニコ', url: 'https://www.nicovideo.jp/'},
                    {mark: true, label: 'Mikan Project', url: 'https://mikanani.me/'},
                    {mark: false, label: 'Mikan Project2', url: 'https://mikanime.tv'},
                    {mark: false, label: '每日放送', url: 'https://bgmlist.com/'},
                    {mark: false, label: 'Bgm 新番排行榜', url: 'https://rinshankaiho.fun/'},
                ]),
                subtitleLinks: Object.freeze([
                    {mark: true, label: 'Anime字幕论坛', url: 'https://bbs.acgrip.com/'},
                    {mark: true, label: 'kitsunekko', url: 'https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F'},
                    {mark: false, label: 'kitsunekko mirror', url: 'https://github.com/Ajatt-Tools/kitsunekko-mirror'},
                    {mark: false, label: '射手网(伪)', url: 'https://assrt.net/'},
                    {mark: false, label: '字幕库', url: 'https://zimuku.org/'},
                    {mark: false, label: 'SubHD', url: 'https://subhd.tv/'},
                ]),
                comicLinks: Object.freeze([
                    {mark: true, label: 'Kox.moe', url: 'https://kox.moe/'},
                    {mark: true, label: 'DLRaw', url: 'https://dlraw.to/raw/'},
                    {mark: false, label: 'A-z manga', url: 'http://www.a-zmanga.net/'},
                    {mark: false, label: 'Mangareader', url: 'https://mangareader.tv/'},
                    {mark: false, label: 'MangaDex', url: 'https://mangadex.org/'},
                    {mark: false, label: 'mangabz', url: 'https://www.mangabz.com'},
                    {mark: false, label: '动漫之家漫画网', url: 'https://comic.idmzj.com/'},
                    {mark: false, label: '漫画柜', url: 'https://www.manhuagui.com/'},
                    {mark: false, label: '古风漫画网', url: 'https://www.gufengmh.com/'},
                    {mark: false, label: 'Lililicious', url: 'http://www.lililicious.net/'},
                    {mark: false, label: 'BOOK☆WALKER', url: 'https://bookwalker.jp/top/'},
                ]),
                fanArtLinks: Object.freeze([
                    {mark: true, label: 'Pixiv', url: 'https://www.pixiv.net/'},
                    {mark: false, label: 'BlueSky', url: 'https://bsky.app/'},
                    {mark: false, label: 'Yandex.Images', url: 'https://yandex.com/images/'},
                    {mark: false, label: 'DeviantArt', url: 'https://www.deviantart.com/'},
                    {mark: false, label: 'Zerochan HQ', url: 'https://www.zerochan.net/'},
                    {mark: true, label: 'Settei Dreams', url: 'https://setteidreams.net/settei/'},
                    {mark: true, label: 'Internet Archive', url: 'https://archive.org/'},
                    {mark: false, label: 'sakugabooru', url: 'https://www.sakugabooru.com'},
                    {mark: false, label: 'exhentai.org', url: 'https://exhentai.org/'},
                    {mark: false, label: 'SauceNAO', url: 'https://saucenao.com/'},
                    {mark: false, label: '搜图bot', url: 'https://soutubot.moe/'},
                    {mark: false, label: 'DLsite', url: 'https://www.dlsite.com/index.html'},
                    {mark: false, label: 'BOOTH', url: 'https://booth.pm/zh-cn'},
                    {mark: false, label: 'Archive of Our Own', url: 'https://archiveofourown.org/'},
                ]),
                gameLinks: Object.freeze([
                    {mark: false, label: 'Steam', url: 'https://store.steampowered.com/'},
                    {mark: false, label: 'GOG', url: 'https://www.gog.com/'},
                    {mark: false, label: 'Epic', url: 'https://store.epicgames.com'},
                    {mark: false, label: 'steamdb.info', url: 'https://steamdb.info/'},
                    {mark: false, label: 'Nintendo Official', url: 'https://www.nintendo.com/'},
                    {mark: false, label: 'Nintendo Store', url: 'https://store.nintendo.com.hk/games/all-released-games'},
                    {mark: true, label: '老男人游戏网', url: 'https://www.oldmantvg.net/'},
                    {mark: false, label: '爱3DS', url: 'https://i3ds.fun/'},
                    {mark: false, label: 'switch520', url: 'https://www.gamer520.com/'},
                    {mark: false, label: 'Switch520', url: 'https://sway.office.com/ZyHdQKVF0lCLyEuA'},
                    {mark: false, label: '太原Switch专修', url: 'https://www.xn--switch-8q7iu0k1wkono.cn/'},
                    {mark: false, label: 'Switch | 时鹏亮', url: 'https://shipengliang.com/download/switch/'},
                    {mark: false, label: 'Nesbbs', url: 'http://www.nesbbs.com/bbs/'},
                    {mark: false, label: '一只火狐的杂物间', url: 'https://stray-soul.com/'},
                ]),
                onlineGameLinks: Object.freeze([
                    {mark: false, label: '老游戏在线玩', url: 'https://zaixianwan.app/'},
                    {mark: false, label: 'Flash 保存计划', url: 'https://flash.zczc.cz/'},
                    {mark: false, label: '千秋戏', url: 'https://bubububaoshe.github.io/'},
                    {mark: false, label: '千秋戏 - 开发版', url: 'http://edgeofmap.com/qqx/index.html'},
                    {mark: false, label: 'Sketch Swap', url: 'http://www.sketchswap.com/'},
                    {mark: false, label: '名字竞技场', url: 'http://namerena.github.io/'},
                    {mark: false, label: 'Poki在线游戏', url: 'https://poki.com/zh'},
                ]),
                wikiLinks: Object.freeze([
                    {mark: false, label: '空洞骑士 Wiki', url: 'https://hkss.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5'},
                    {mark: false, label: '饥荒 Wiki', url: 'https://dontstarve.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5'},
                    {mark: false, label: '泰拉瑞亚 Wiki', url: 'https://terraria.wiki.gg/zh/'},
                    {mark: false, label: '誠也の部屋', url: 'https://seiya-saiga.com/'},
                    {mark: false, label: 'Speedrun', url: 'https://www.speedrun.com/zh-CN'},
                ]),
                musicLinks: Object.freeze([
                    {mark: false, label: '网易云音乐', url: 'https://music.163.com/'},
                    {mark: true, label: 'JPopsuki', url: 'https://jpopsuki.eu/index.php'},
                    {mark: true, label: '天使动漫论坛', url: 'http://www.tsdm39.com'},
                    {mark: false, label: 'Nyaa', url: 'https://nyaa.si/'},
                    {mark: false, label: 'VGMdb', url: 'https://vgmdb.net/'},
                    {mark: false, label: 'iSearch 4.5', url: 'https://i.oppsu.cn/'},
                    {mark: false, label: 'ACG漫音社', url: 'http://www.acgjc.com/'},
                    {mark: false, label: 'J-pop Music Download', url: 'https://jpop.xyz/'},
                    {mark: false, label: 'Sitting on Clouds', url: 'https://www.sittingonclouds.net/'},
                    {mark: true, label: 'Video Game Music Downloads', url: 'https://downloads.khinsider.com/'},
                    {mark: false, label: '音乐磁场', url: 'https://www.hifini.com/'},
                ]),
                sheetMusicLinks: Object.freeze([
                    {mark: true, label: 'Musescore', url: 'https://musescore.com/'},
                    {mark: false, label: 'dl-librescore', url: 'https://github.com/LibreScore/dl-librescore'},
                    {mark: false, label: 'Sheethost', url: 'https://sheet.host/'},
                    {mark: false, label: 'Ichigo\'s Sheet Music', url: 'https://ichigos.com/sheets'},
                    {mark: false, label: 'josh\'s anime sheet', url: 'http://josh.agarrado.net/music/anime/index.php'},
                    {mark: false, label: 'Sheet Music - Theishter', url: 'https://www.theishter.com/sheet-music.html'},
                    {mark: false, label: 'IMSLP', url: 'https://cn.imslp.org/wiki/Main_Page'},
                    {mark: false, label: 'MidiShow', url: 'https://www.midishow.com/'},
                    {mark: false, label: 'canta-per-me  » Sheet Music', url: 'https://canta-per-me.net/sheet-music/unofficial/'},
                    {mark: true, label: '虫虫钢琴', url: 'https://www.gangqinpu.com/'},
                    {mark: false, label: '弹琴吧', url: 'http://www.tan8.com/'},
                    {mark: false, label: '中国曲谱网', url: 'http://www.qupu123.com/Search'},
                ]),
                bookLinks: Object.freeze([
                    {mark: true, label: 'Zlib', url: 'https://z-library.sk'},
                    {mark: false, label: 'Internet Archive', url: 'https://archive.org/'},
                    {mark: false, label: 'Book Searcher', url: 'https://zlib.missuo.me/'},
                    {mark: true, label: '安娜的档案', url: 'https://zh.annas-archive.org/'},
                    {mark: false, label: 'Itazuranekoyomi', url: 'https://itazuranekoyomi.neocities.org/library/shousetu/shouall'},
                    {mark: false, label: '青空文庫', url: 'https://www.aozora.gr.jp/'},
                    {mark: false, label: 'MOBIぞら文庫', url: 'http://www.netbuffalo.net/NetApps/kindle/aozora'},
                ]),
                softwareLinks: Object.freeze([
                    {mark: false, label: '小众软件', url: 'https://www.appinn.com/'},
                    {mark: false, label: '小众软件论坛', url: 'https://meta.appinn.net/'},
                    {mark: false, label: '果核剥壳', url: 'https://www.ghxi.com/'},
                    {mark: false, label: '423Down', url: 'https://www.423down.com/'},
                    {mark: false, label: 'dayanzai', url: 'http://dayanzai.me/'},
                    {mark: false, label: '吾爱破解', url: 'https://www.52pojie.cn/forum.php'},
                    {mark: false, label: '卡饭网', url: 'https://www.kafan.cn/'},
                    {mark: false, label: 'Репаки мультимедиа программ', url: 'https://lrepacks.net/repaki-multimedia-programm/'},
                    {mark: false, label: 'F-Droid', url: 'https://f-droid.org/zh_Hans/packages/'},
                    {mark: false, label: 'apkcombo', url: 'https://apkcombo.com/zh/'},
                    {mark: false, label: 'APKMirror', url: 'https://www.apkmirror.com/'},
                    {mark: false, label: 'crxsoso', url: 'https://www.crxsoso.com/search'},
                    {mark: false, label: 'strnghrs - 博客园', url: 'https://www.cnblogs.com/stronghorse/'},
                ]),
                buyLinks: Object.freeze([
                    {mark: true, label: '駿河屋', url: 'https://www.suruga-ya.jp/feature/campaign/index.html'},
                    {mark: false, label: '現在開催中', url: 'https://www.suruga-ya.jp/feature/campaign/index.html'},
                    {mark: true, label: 'メルカリ', url: 'https://jp.mercari.com/'},
                    {mark: false, label: '日亚', url: 'https://www.amazon.co.jp/'},
                    {mark: false, label: '美亚', url: 'https://www.amazon.com/ref=nav_logo'},
                    {mark: false, label: 'ヤフオク', url: 'https://auctions.yahoo.co.jp/'},
                    {mark: false, label: 'PayPal', url: 'https://www.paypal.com/'},
                    {mark: false, label: 'HPOI 手办维基', url: 'https://www.hpoi.net/'},
                ]),
                pmLinks: Object.freeze([
                    {mark: true, label: '神奇宝贝百科', url: 'http://wiki.52poke.com/wiki/主页'},
                    {mark: false, label: '朱／紫 数据库', url: 'https://sv.xzonn.top/wiki/宝可梦一览'},
                    {mark: false, label: 'Bulbapedia', url: 'http://bulbapedia.bulbagarden.net/wiki/Main_Page'},
                    {mark: false, label: 'Serebii.net', url: 'https://www.serebii.net/index2.shtml'},
                    {mark: false, label: 'ポケモンWiki', url: 'https://wiki.xn--rckteqa2e.com/wiki/メインページ'},
                    {mark: false, label: 'PTCGP Tracker', url: 'https://ptcgp-tracker.com/'},
                    {mark: true, label: 'PTCGP 百科', url: 'https://pokemon-tcg-pocket.wiki/zh-Hans/cards'},
                    {mark: false, label: 'Pokemon Nier', url: 'https://pokemonnier.com/zh-Hans/cards'},
                    {mark: true, label: 'SHOWDOWN', url: 'http://play.pokemonshowdown.com/'},
                    {mark: false, label: 'SHOWDOWN国服', url: 'http://china.psim.us/'},
                    {mark: true, label: '猫鼬社群 Bot', url: 'https://www.meerkatnow.com/meerkat/389162/393204'},
                    {mark: false, label: 'Pokemon Fusion', url: 'http://pokemon.alexonsager.net/47/93'},
                    {mark: false, label: '宝可梦活动公告', url: 'https://sv-news.pokemon.co.jp/sc/list'},
                    {mark: false, label: 'PokéCommunity Forums', url: 'https://www.pokecommunity.com/'},
                    {mark: false, label: '口袋中心', url: 'https://www.pmcenter.cn/'},
                    {mark: false, label: '増田部長のめざめるパワー', url: 'https://gamefreak.co.jp/blog/dir/index.html'},
                ]),
                sgLinks: Object.freeze([
                    {mark: false, label: 'Steins;Gate Wiki', url: 'https://steins-gate.fandom.com/wiki/Steins;Gate_Wiki'},
                    {mark: false, label: '未在調査拠点 N.R.W.', url: 'https://nrw.nobody.jp'},
                    {mark: false, label: '科学ADV中文wiki', url: 'https://sci-adv.cc/wiki/首页'},
                    {mark: false, label: '萌娘百科 SG', url: 'https://zh.moegirl.org.cn/命运石之门系列'},
                    {mark: false, label: '未来技术实验室·科A共享服务器', url: 'https://drive.sci-adv.cc/zh-CN/'},
                    {mark: false, label: '新LAB资料库 漫画&小说分库', url: 'https://tieba.baidu.com/p/4621337179'},
                    {mark: false, label: 'Committee of Zero', url: 'https://sonome.dareno.me/'},
                    {mark: false, label: 'ろくに lit.link', url: 'https://lit.link/en/rocni'},
                    {mark: false, label: 'Reddit SG', url: 'https://www.reddit.com/r/steinsgate/'},
                ]),
                jyLinks: Object.freeze([
                    {mark: false, label: 'IKUNI', url: 'https://ikuni.net/'},
                    {mark: true, label: '虚构星体观测室', url: 'https://virtualstar.home.blog/'},
                    {mark: true, label: '薔薇物語 テキスト', url: 'http://kasira.blog97.fc2.com/category4-0.html'},
                    {mark: true, label: 'Empty Movement', url: 'http://ohtori.nu/'},
                    {mark: false, label: '>> Resources', url: 'http://ohtori.nu/resources/'},
                    {mark: false, label: '>> Gallery', url: 'http://ohtori.nu/gallery/'},
                    {mark: false, label: '>> Doujinshi', url: 'http://ohtori.nu/doujinshi/'},
                    {mark: false, label: '>> archive.org', url: 'https://archive.org/details/@empty_movement'},
                    {mark: false, label: 'Something Eternal', url: 'https://emptymovement.com/'},
                    {mark: false, label: 'イクニのメルとも蔵Blog', url: 'https://ikuni.net/archives/'},
                    {mark: false, label: '霊廟 [フォレストページ＋]', url: 'https://plus.fm-p.jp/u/kobeya_2019'},
                    {mark: false, label: 'スタジオ カノープスsatellite', url: 'https://ameblo.jp/studio-canopus/'},
                    {mark: false, label: '天与海の世界', url: 'http://www.harukamichiru.com/forum.php'},
                    {mark: false, label: '少女革命ウテナ 決闘の歌 注釈', url: 'http://www.ne.jp/asahi/krk/kct/misc/utena_song_tv.htm'},
                ]),
                otherLinks: Object.freeze([
                    {mark: true, label: 'YuC\'s AnimeList', url: 'http://yuc.wiki/'},
                    {mark: false, label: '竹箒日記', url: 'http://www.typemoon.org/bbb/diary/'},
                    {mark: false, label: 'TYPE-MOON不完全年表', url: 'http://www.st.rim.or.jp/~nmisaki/topics/typemoon.html'},
                    {mark: false, label: '乐园之扉', url: 'http://fjorg.lofter.com/post/1f46f9a3_1252bef2'},
                    {mark: false, label: 'FictionJunction', url: 'https://fictionjunction.com/'},
                    {mark: false, label: 'canta-per-me', url: 'https://canta-per-me.net/'},
                    {mark: false, label: '白之預言書', url: 'http://www.horizon-wiki.com/'},
                    {mark: false, label: '电解熔融氧化铝', url: 'https://yodhcn.pages.dev/'},
                ]),
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
            //导航颜色（默认值）
            navMarkColor: DEFAULT_NAV_MARK_COLOR,
            //预设可选颜色：R，G，B，不透明度
            predefineColors: [
                DEFAULT_NAV_MARK_COLOR,
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
            ],
            leftGroupActiveKey: null,
            leftGroupRefs: {},
            rightGroupActiveKey: null,
            rightGroupRefs: {},
            isManualScrolling: false,
            isPageVisible: true
        }
    },
    created() {
        Object.keys(this.bookMarkGroups).forEach(groupName => {
            this.bookMarkHoverStates[groupName] = reactive({})
            this.bookMarkGroups[groupName].forEach((_, index) => {
                this.bookMarkHoverStates[groupName][index] = false
            })
        });
        Object.keys(this.leftBookMarkGroups).forEach(groupName => {
            this.leftBookMarkHoverStates[groupName] = reactive({})
            this.leftBookMarkGroups[groupName].forEach((_, index) => {
                this.leftBookMarkHoverStates[groupName][index] = false
            })
        });
        Object.keys(this.rightBookMarkGroups).forEach(groupName => {
            this.rightBookMarkHoverStates[groupName] = reactive({})
            this.rightBookMarkGroups[groupName].forEach((_, index) => {
                this.rightBookMarkHoverStates[groupName][index] = false
            })
        });
    },
    computed: {
        // 计算当前使用的搜索引擎
        currentEngine() {
            return this.searchEngines.find(engine => engine.name === this.currentEngineName);
        }
    },
    mounted() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.fetchHitokoto();
        this.loadSettings();
    },
    beforeUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        document.querySelectorAll('.steins-gate-number').forEach(el => {
            el.parentNode?.removeChild(el);
        });
        this.handleDrawerClose();
    },
    methods: {
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
            this.checkAndCreateSteinsGateNumber();
        },
        // 右侧抽屉
        handleClickRightDrawer() {
            clearInterval(this.steinsGateInterval);
            this.steinsGateInterval = null;
            this.rightDrawerVisible = !this.rightDrawerVisible;
            this.isRightContainerActive = this.rightDrawerVisible;
            this.isRightActive = this.rightDrawerVisible;
            this.checkAndCreateSteinsGateNumber();
        },
        // 边缘悬浮效果
        handleEdgeHoverEnter(direction) {
            if (direction === 'L' && !this.leftDrawerVisible) {
                this.isLeftActive = true;
                this.checkAndCreateSteinsGateNumber();
            } else if (direction === 'R' && !this.rightDrawerVisible) {
                this.isRightActive = true;
                this.checkAndCreateSteinsGateNumber();
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
        // 检查是否开启烧电脑模式
        checkAndCreateSteinsGateNumber() {
            if (!this.isSteinsGateOpen) {
                return;
            }
            if (this.isLeftActive || this.isRightActive || this.leftDrawerVisible || this.rightDrawerVisible) {
                const isLeft = this.isLeftActive || this.leftDrawerVisible;
                this.steinsGateInterval = setInterval(() => {
                    if (!this.isPageVisible) {
                        return;
                    }
                    this.createSteinsGateNumber(isLeft);
                }, this.steinsGateSpeed);
            }
        },
        // 通用创建命运石之门世界线变动率
        createSteinsGateNumber(isLeft) {
            requestAnimationFrame(() => {
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
                    ${isLeft ? 'left: -20px' : 'right: -20px'};
                    --move-distance: ${isLeft ? moveDistance : -moveDistance};
                    animation-delay: ${animationDelay}s;
                    will-change: transform, opacity;
                `;

                number.textContent = Math.floor(Math.random() * 10);
                const overlayEl = isLeft ?
                    document.querySelector('#leftOverlay') :
                    document.querySelector('#rightOverlay');
                overlayEl.appendChild(number);

                setTimeout(() => {
                    if (number.parentNode) {
                        number.parentNode.removeChild(number);
                    }
                }, this.steinsGateKeepTime);
            });
        },
        // 保存设置
        saveSettings() {
            const settings = {
                engine: this.currentEngineName,
                isSteinsGateOpen: this.isSteinsGateOpen,
                speed: this.steinsGateSpeed,
                keepTime: this.steinsGateKeepTime,
                moveDistance: this.steinsGateMoveDistance,
                cardMarkColor: this.cardMarkColor,
                navMarkColor: this.navMarkColor
            }
            localStorage.setItem('appSettings', JSON.stringify(settings));
            this.showSettings = false;
            document.documentElement.style.setProperty('--el-color-primary', this.cardMarkColor)
            ElMessage.success('设置已保存');
        },
        // 加载设置（包含默认值）
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
                    this.cardMarkColor = settings.cardMarkColor || DEFAULT_CARD_MARK_COLOR;
                    this.navMarkColor = settings.navMarkColor || DEFAULT_NAV_MARK_COLOR;
                } catch(e) {
                    console.error('设置加载失败:', e);
                    ElMessage.error('设置加载失败');
                }
            }
        },
        checkIsLeft() {
            if (this.leftDrawerVisible) {
                return true;
            } else if (this.rightDrawerVisible) {
                return false;
            } else {
                return null;
            }
        },
        // 设置分组DOM引用
        setGroupRef(el, key) {
            const isLeft = this.checkIsLeft();
            if (isLeft === null) {
                return;
            }
            if (el) {
                if (isLeft) {
                    this.leftGroupRefs[key] = el;
                } else {
                    this.rightGroupRefs[key] = el;
                }

            }
        },
        // 滚动到指定分组
        scrollToGroup(key) {
            const isLeft = this.checkIsLeft();
            if (isLeft === null) return;
            this.isManualScrolling = true;
            if (isLeft) {
                this.leftGroupActiveKey = key;
            } else {
                this.rightGroupActiveKey = key;
            }
            const body = {behavior: 'smooth', block: 'start'}
            if (isLeft) {
                this.leftGroupActiveKey = key;
                if (this.leftGroupRefs[key] && this.$refs.leftContentScroll) {
                    this.leftGroupRefs[key].scrollIntoView(body);
                }
            } else {
                this.rightGroupActiveKey = key;
                if (this.rightGroupRefs[key] && this.$refs.rightContentScroll) {
                    this.rightGroupRefs[key].scrollIntoView(body);
                }
            }
            this.$nextTick(() => {
                this.scrollNavToActiveItem();
            });
            setTimeout(() => {
                this.isManualScrolling = false;
            }, 1000);
        },
        // 滚动导航条使当前激活项可见
        scrollNavToActiveItem() {
            const isLeft = this.checkIsLeft();
            if (isLeft === null) {
                return;
            }
            const navScrollRect = isLeft ? this.$refs.leftNavScroll : this.$refs.rightNavScroll;
            if (!navScrollRect) {
                return;
            }
            const navItems = navScrollRect.children;
            if (!navItems.length) {
                return;
            }

            // 找到当前激活的导航项
            let activeItem = null;
            const activeItemName = isLeft ? this.leftBookMarkGroupNames[this.leftGroupActiveKey] : this.rightBookMarkGroupNames[this.rightGroupActiveKey];
            for (let i = 0; i < navItems.length; i++) {
                if (navItems[i].textContent.trim() === activeItemName) {
                    activeItem = navItems[i];
                    break;
                }
            }
            if (!activeItem) {
                return;
            }
            const navRect = navScrollRect.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();

            // 如果激活项在可视区域外，滚动导航条
            if (itemRect.left < navRect.left) {
                navScrollRect.scrollTo({
                    left: navScrollRect.scrollLeft + (itemRect.left - navRect.left) - 20,
                    behavior: 'smooth'
                });
            } else if (itemRect.right > navRect.right) {
                navScrollRect.scrollTo({
                    left: navScrollRect.scrollLeft + (itemRect.right - navRect.right) + 20,
                    behavior: 'smooth'
                });
            }
        },
        // 抽屉打开时触发
        async handleDrawerOpened() {
            await this.$nextTick();

            const isLeft = this.checkIsLeft();
            if (isLeft === null) {
                return;
            }

            const drawerElement = isLeft ? this.$refs.leftDrawer.$el.nextElementSibling : this.$refs.rightDrawer.$el.nextElementSibling;
            if (drawerElement) {
                const scrollContainer = drawerElement.querySelector('.el-drawer__body');
                if (scrollContainer) {
                    scrollContainer.addEventListener('scroll', this.handleContentScroll);
                }
                this.handleContentScroll();
                this.addNavScrollHandler(isLeft);
            }
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
            // 移除滚动事件监听
            if (this.$refs.leftContentScroll) {
                this.$refs.leftContentScroll.removeEventListener('scroll', this.handleContentScroll);
            }
            if (this.$refs.rightContentScroll) {
                this.$refs.rightContentScroll.removeEventListener('scroll', this.handleContentScroll);
            }
            this.removeNavScrollHandlers();
        },
        // 添加导航滚动处理
        addNavScrollHandler(isLeft) {
            const navElement = isLeft ? this.$refs.leftNavScroll : this.$refs.rightNavScroll;
            if (!navElement) {
                return;
            }

            const handler = (e) => {
                e.preventDefault();
                // 调整滚动速度
                const currentScroll = navElement.scrollLeft;
                navElement.scrollLeft = currentScroll + e.deltaY * 2;
            };
            navElement.addEventListener('wheel', handler, { passive: false });
            navElement.__wheelHandler__ = handler;
        },
        // 移除所有导航滚动处理
        removeNavScrollHandlers() {
            [this.$refs.leftNavScroll, this.$refs.rightNavScroll].forEach(el => {
                if (el && el.__wheelHandler__) {
                    el.removeEventListener('wheel', el.__wheelHandler__);
                    delete el.__wheelHandler__;
                }
            });
        },
        // 监听内容区域滚动
        handleContentScroll() {
            if (this.scrollThrottle) {
                return;
            }
            this.scrollThrottle = true;
            if (this.isManualScrolling) {
                this.scrollThrottle = false;
                return;
            }

            requestAnimationFrame(() => {
                const isLeft = this.checkIsLeft();
                if (isLeft === null) {
                    return;
                }
                const scrollContainer = isLeft ? this.$refs.leftContentScroll : this.$refs.rightContentScroll;
                if (!scrollContainer) {
                    return;
                }

                const scrollTop = scrollContainer.getBoundingClientRect().top;
                const groups = isLeft ? Object.keys(this.leftBookMarkGroups) : Object.keys(this.rightBookMarkGroups);

                const target = 100;
                let left = 0;
                let right = groups.length - 1;
                let idx = groups.length;
                while (left <= right) {
                    const mid = Math.floor((left + right) / 2);
                    const midGroup = groups[mid];
                    const groupEl = isLeft ? this.leftGroupRefs[midGroup] : this.rightGroupRefs[midGroup];
                    const distance = groupEl.offsetTop + scrollTop;
                    if (distance >= target) {
                        idx = mid;
                        right = mid - 1;
                    } else {
                        left = mid + 1;
                    }
                }
                let visibleGroup = null;
                if (idx <= 0) {
                    visibleGroup = groups[0];
                } else if (idx >= groups.length) {
                    visibleGroup = groups[groups.length - 1];
                } else {
                    //对比谁离target更近
                    const previousOne = groups[idx - 1];
                    const thisOne = groups[idx];
                    const previousOneOffset = isLeft ? this.leftGroupRefs[previousOne].offsetTop : this.rightGroupRefs[previousOne].offsetTop;
                    const thisOneOffset = isLeft ? this.leftGroupRefs[thisOne].offsetTop : this.rightGroupRefs[thisOne].offsetTop;
                    const previousOneDiff = Math.abs(target - (previousOneOffset + scrollTop));
                    const thisOneDiff = Math.abs(target - (thisOneOffset + scrollTop));
                    visibleGroup = previousOneDiff <= thisOneDiff ? previousOne : thisOne;
                }

                const isDifferent = isLeft ? this.leftGroupActiveKey !== visibleGroup : this.rightGroupActiveKey !== visibleGroup;
                if (visibleGroup && isDifferent) {
                    if (isLeft) {
                        this.leftGroupActiveKey = visibleGroup;
                    } else {
                        this.rightGroupActiveKey = visibleGroup;
                    }
                    this.scrollNavToActiveItem();
                }

                this.scrollThrottle = false;
            });
        },
        handleVisibilityChange() {
            this.isPageVisible = document.visibilityState === 'visible';
        }
    }
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus);
app.mount('#app'); 