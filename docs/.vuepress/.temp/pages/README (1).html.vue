<template><div><h1 id="ios端cr机器人开发流程" tabindex="-1"><a class="header-anchor" href="#ios端cr机器人开发流程" aria-hidden="true">#</a> ios端cr机器人开发流程</h1>
<h2 id="一、cr机器人流程" tabindex="-1"><a class="header-anchor" href="#一、cr机器人流程" aria-hidden="true">#</a> 一、cr机器人流程</h2>
<p><img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/fe5149e2-acd0-4d0c-b3c5-07393d6efff4.png#id=DzU2P&amp;originHeight=194&amp;originWidth=1410&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt="">
<img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/f59320d9-1819-43cf-8353-488a408514f8.png#id=G4jde&amp;originHeight=389&amp;originWidth=1197&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt="">
<strong>使用：</strong>
1、由代码提交者提交 MR 后在钉钉 写入mr地址并 @机器人。
2、由cr机器人自动完成CR过程，处理成功之后会在钉钉群中发送处理结果消息并@代码提交者</p>
<h2 id="二、平台实现" tabindex="-1"><a class="header-anchor" href="#二、平台实现" aria-hidden="true">#</a> 二、平台实现</h2>
<h3 id="_0、引申问题" tabindex="-1"><a class="header-anchor" href="#_0、引申问题" aria-hidden="true">#</a> 0、引申问题</h3>
<ul>
<li><strong>mr列表处理（已解决）</strong></li>
</ul>
<p><a href="https://git.yupaopao.com/terminal/ios/yuer/YRSwiftDemo/merge_requests/1/diffs" target="_blank" rel="noopener noreferrer">https://git.yupaopao.com/terminal/ios/yuer/YRSwiftDemo/merge_requests/1/diffs<ExternalLinkIcon/></a> 
<a href="https://git.yupaopao.com/terminal/ios/yuer/YRSwiftDemo/merge_requests/2/diffs" target="_blank" rel="noopener noreferrer">https://git.yupaopao.com/terminal/ios/yuer/YRSwiftDemo/merge_requests/2/diffs<ExternalLinkIcon/></a> 
一次@机器人的多个mr地址<strong>是否需要异步或线程池，是否重试等</strong></p>
<ul>
<li><strong>对于diffs大文件的处理（待完善）</strong></li>
</ul>
<p>举例 <a href="https://git.yupaopao.com/testteam/middle-platform/bugPlatform/commit/8098e9012258b8ecf3adc351979086e4364efc0e" target="_blank" rel="noopener noreferrer">https://git.yupaopao.com/testteam/middle-platform/bugPlatform/commit/8098e9012258b8ecf3adc351979086e4364efc0e<ExternalLinkIcon/></a></p>
<ul>
<li>**无用大文件：**大文件如果所设计的文件不需要进行 cr 处理。比如 除代码文件、无用的 json 信息文件</li>
<li>**有用大文件：**如果文件过于大是否需要进行 cr，以及是否拆分，涉及到性能问题</li>
<li><strong>根据文件类型或者某些逻辑过滤diff（待完善）</strong></li>
<li><em><em>对于gitlab 没有提供 批量方式一次提交所有的comment，<strong>导致每次需要发送一次http请求，提交一行评论。</strong>（已解决）</em></em></li>
</ul>
<p>如果commet过多 调用的http次数过多会存在以下问题：</p>
<ul>
<li>http请求失败，是否需要重试、重试次数、异常处理</li>
</ul>
<p>**解决：**cr机器人工具类项目对数据一致性不高可忽略 多次重试失败的极端问题，用kafka解决重试，重试次数为2次，kafka异步解决AI调用耗时和提交comment</p>
<h3 id="_1、流程图" tabindex="-1"><a class="header-anchor" href="#_1、流程图" aria-hidden="true">#</a> 1、流程图</h3>
<p><img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/5923b14a-3ffa-4054-b2ba-ab9f7302b574.webp#id=Ft3uz&amp;originHeight=1197&amp;originWidth=937&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt=""></p>
<hr>
<p><img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/d5757134-8e83-4dbc-a9c4-476e27d485a1.png#id=fRrtN&amp;originHeight=1071&amp;originWidth=1378&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt=""></p>
<h3 id="_2、mr和diff信息处理" tabindex="-1"><a class="header-anchor" href="#_2、mr和diff信息处理" aria-hidden="true">#</a> 2、MR和diff信息处理</h3>
<h4 id="通过mr获取diff信息" tabindex="-1"><a class="header-anchor" href="#通过mr获取diff信息" aria-hidden="true">#</a> 通过mr获取diff信息</h4>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code>https<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>git<span class="token punctuation">.</span>yupaopao<span class="token punctuation">.</span>com<span class="token operator">/</span>terminal<span class="token operator">/</span>ios<span class="token operator">/</span>yuer<span class="token operator">/</span><span class="token class-name">YRSwiftDemo</span><span class="token operator">/</span>merge_requests<span class="token operator">/</span><span class="token number">1</span><span class="token operator">/</span>diffs
https<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>git<span class="token punctuation">.</span>yupaopao<span class="token punctuation">.</span>com<span class="token operator">/</span>terminal<span class="token operator">/</span>ios<span class="token operator">/</span>yuer<span class="token operator">/</span><span class="token class-name">YRSwiftDemo</span><span class="token operator">/</span>merge_requests<span class="token operator">/</span><span class="token number">2</span><span class="token operator">/</span>diffs
https<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>git<span class="token punctuation">.</span>yupaopao<span class="token punctuation">.</span>com<span class="token operator">/</span>terminal<span class="token operator">/</span>ios<span class="token operator">/</span>yuer<span class="token operator">/</span><span class="token class-name">YRSwiftDemo</span><span class="token operator">/</span>merge_requests<span class="token operator">/</span><span class="token number">3</span><span class="token operator">/</span>diffs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <strong>YRSwuftDemo</strong> 对应的为 项目名称 ，<strong>1 2 3</strong>对应的 请求合并id
<strong>实现步骤：</strong></p>
<ul>
<li>代码提交人可能会提交多个mr地址，需要对多个地址字符串通过正则表达式（ <strong>\n+| +</strong> ）分别拆分成单个列表mr地址</li>
<li>获取单个mr地址 再次通过正则表达式（ <strong>/(\w+)/merge_requests/(\d+)/</strong> ）获取到 项目名称和请求id</li>
</ul>
<p>此时需要通过调用 app.yupaopao.com/api/ci/list?curPage=1&amp;platform=iOS&amp;keyword=YRSwiftDemo 接口</p>
<ul>
<li>获取对应项目的项目id转换为 gitlab的diff接口调用地址：</li>
</ul>
<p>https://git.yupaopao.com/api/v4/projects/<strong>{project_id}</strong>/merge_requests/<strong>{request_id}</strong>/changes</p>
<ul>
<li>调用该接口获取本次mr请求所有diff信息，对单个diff信息进行封装为 DiffInfo对象</li>
</ul>
<blockquote>
<p>一次mr地址对应的diff会产生多个diffInfo，一个diffInfo对应于一个具体文件的更改</p>
</blockquote>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DiffInfo</span>  <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">MergeRequestInfo</span> mergeRequestInfo<span class="token punctuation">;</span> <span class="token comment">//提交comment 调用接口所需的公共参数</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> fileSuffix<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> operationType<span class="token punctuation">;</span> <span class="token comment">//new delete modify</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> diff<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> oldPath<span class="token punctuation">;</span> 
    <span class="token keyword">private</span> <span class="token class-name">String</span> newPath<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">public</span>  <span class="token keyword">class</span> <span class="token class-name">MergeRequestInfo</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * 合并请求的 基本 SHA、主 SHA 和起始 SHA
     * 三个SHA的作用：作为接口调用 提交comments发表评论时所需的参数
     * */</span>
    <span class="token keyword">private</span> <span class="token class-name">Integer</span> id<span class="token punctuation">;</span><span class="token comment">//mr的id 对应gitlab API文档为 merge_request_iid</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> base_sha<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> head_sha<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> start_sha<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="diff格式" tabindex="-1"><a class="header-anchor" href="#diff格式" aria-hidden="true">#</a> diff格式</h4>
<p>@@ -14,7 +14,7 @@ 
 -14,7  表示原文件中被修改的起始行是第14行。而<code v-pre>,7</code>表示紧随其后的7行也受到了更改。
 +14,7 表示新文件中被修改的起始行是第14行。<code v-pre>,7</code>表示紧随其后的7行也有变化。
文件中  - +  即表示 旧代码和新代码，未标识- +的即为原始上下代码参照
<img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/1618c18a-31a2-4b72-b9e4-4fa716c33bec.png#id=WMS6i&amp;originHeight=250&amp;originWidth=765&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt=""></p>
<h3 id="_3、回写comments到gitlab" tabindex="-1"><a class="header-anchor" href="#_3、回写comments到gitlab" aria-hidden="true">#</a> 3、回写comments到Gitlab</h3>
<h4 id="提交comment接口调用" tabindex="-1"><a class="header-anchor" href="#提交comment接口调用" aria-hidden="true">#</a> 提交comment接口调用</h4>
<p><strong>gitlab接口文档  ：</strong><a href="https://docs.gitlab.com/ee/api/discussions.html#create-new-merge-request-thread" target="_blank" rel="noopener noreferrer">Discussions API | GitLab<ExternalLinkIcon/></a></p>
<blockquote>
<p>提交单行接口  POST   https://git.yupaopao.com/api/v4/projects/7484/merge_requests/1/discussions
7484对应project_id    1对应request_iid</p>
</blockquote>
<blockquote>
<p>base_sha、start_sha、head_sha可通过获取(获取最新条记录)
 GET  <a href="https://git.yupaopao.com/api/v4/projects/7484/merge_requests/1/versions" target="_blank" rel="noopener noreferrer">https://git.yupaopao.com/api/v4/projects/7484/merge_requests/1/versions<ExternalLinkIcon/></a></p>
</blockquote>
<blockquote>
<p>old_path、new_path 可通过获取 GET <a href="https://git.yupaopao.com/api/v4/projects/7484/merge_requests/1/changes" target="_blank" rel="noopener noreferrer">https://git.yupaopao.com/api/v4/projects/7484/merge_requests/1/changes<ExternalLinkIcon/></a></p>
</blockquote>
<p>注意：
**position_type 即为评论类型 **
<strong>new_line和old_line必须对应diff文件的修改行(增加 修改), 不可用于未出现在diff文件的其他的行号 （实际上old_line用不上）</strong>
<strong>否则会出现接口调用如下错误：</strong></p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token punctuation">{</span>
    <span class="token string">"message"</span><span class="token operator">:</span> <span class="token string">"400 (Bad request) &amp;quot;Note {:line_code=>[&amp;quot;can't be blank&amp;quot;, &amp;quot;must be a valid line code&amp;quot;]}&amp;quot; not given"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4、kafka异步" tabindex="-1"><a class="header-anchor" href="#_4、kafka异步" aria-hidden="true">#</a> 4、kafka异步</h3>
<p><strong>kafka相关配置：</strong>
<strong>topic</strong>：cr_test_ai
<strong>key</strong>：cr_ai_invoke、cr_ai_result</p>
<hr>
<p><strong>cr_ai_invoke</strong>对应分区1（用于异步调用AI接口获取反馈结果 （耗时））
<strong>cr_ai_result</strong>对应于分区0 （异步调用 写入comment到gitlab（gitlab官方只提供了 提交一次单行代码建议接口））</p>
<ul>
<li>设置重试次数为2，异常时会再次重试。</li>
<li>设置多线程消费为2，后期可以再做修改</li>
</ul>
<p><img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/67dc216e-8825-4a0e-ad6d-b0690bcca22a.png#id=XxI31&amp;originHeight=635&amp;originWidth=1113&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt=""></p>
<h3 id="_5、redis记录" tabindex="-1"><a class="header-anchor" href="#_5、redis记录" aria-hidden="true">#</a> 5、Redis记录</h3>
<p><strong>key：cr_mr_headHash</strong>  （headHash表示一次mr请求对应的MD5）
<img src="https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq76jEV5R2nAKe/img/72518d40-e271-4504-8f72-4ab1347cca04.png#id=l2nWR&amp;originHeight=152&amp;originWidth=499&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;status=done&amp;style=none" alt="">
记录一个mr地址的diff_total和AI反馈的行建议comment_total
Kafka异步：   1、调用AI接口处理时记录diff_completed_count数量 （表示已经由AI处理完的diff数量）
2、调用gitlab接口回填comment时记录comment_completed_count（表示已经提交到gitlab的数量）
当处理的数量与总数量相同时 即代表处理完成，如果不相等可做失败兜底</p>
<h2 id="三、ai大模型" tabindex="-1"><a class="header-anchor" href="#三、ai大模型" aria-hidden="true">#</a> 三、AI大模型</h2>
<p><strong>模型搭建：</strong></p>
<ul>
<li><strong>模型</strong>：本地部署大模型+本地知识库</li>
</ul>
<p>所有的流程都在内部执行，不会有泄露数据的风险。</p>
<ul>
<li><strong>Review的有效性</strong> =  模型选择 + 合适的prompt</li>
</ul>
<p>选择模型的参数当然是越多越好，越多的参数也就意味着更高的准确性，但是越多的参数也需要越好的硬件设备。一般7b需要8G内存，13b需要16G内存等等。
本地机器为32G内存，所以基本上选择模型在32b左右。</p>
<ul>
<li><strong>模型对比：</strong></li>
</ul>
<table>
<thead>
<tr>
<th>模型<a href="https://ollama.com/library" target="_blank" rel="noopener noreferrer">library<ExternalLinkIcon/></a></th>
<th>input</th>
<th>output</th>
<th>准确性评分（10分制）</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://ollama.com/library/codellama:13b" target="_blank" rel="noopener noreferrer">codellama:13b<ExternalLinkIcon/></a></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td><a href="https://ollama.com/library/qwen2" target="_blank" rel="noopener noreferrer">qwen2:7b<ExternalLinkIcon/></a></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
</div></template>


