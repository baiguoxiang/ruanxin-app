// 测试心语页面输入框在输入文字时是否会发生高度变化（Taro 适配版）
const { chromium } = require('C:\\Users\\Administrator\\Documents\\Codex\\2026-07-03\\6-29-ai-5-3-3\\UI-TARS-desktop\\node_modules\\playwright');
const path = require('path');

(async () => {
  const targetUrl = 'https://baiguoxiang.github.io/ruanxin-app/#/pages/emotion/index';
  const dir = __dirname;
  const beforeShot = path.join(dir, 'input_before.png');
  const afterShot = path.join(dir, 'input_after.png');
  const fullBeforeShot = path.join(dir, 'full_before.png');
  const fullAfterShot = path.join(dir, 'full_after.png');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('================ 测试开始 ================');
  console.log('目标 URL:', targetUrl);

  // 1. 打开页面
  console.log('\n[1/6] 正在打开页面并等待加载...');
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  // 2. 定位元素
  console.log('\n[2/6] 定位底部输入框...');
  // Taro: 可见的是 taro-textarea-core，底层 textarea 宽度为0但可输入
  const textareaEl = page.locator('textarea.taro-textarea[placeholder*="和心语说说心里话"]').first();
  const coreEl = page.locator('taro-textarea-core.index-module__input___uw2bk').first();
  // 输入框所在的视觉容器（父级）
  const inputContainer = page.locator('.index-module__input___uw2bk').first();

  console.log('  textarea 元素数量:', await textareaEl.count());
  console.log('  taro-textarea-core 元素数量:', await coreEl.count());

  // 找发送按钮
  const sendBtn = page.locator('text=发送').first();
  console.log('  发送按钮数量:', await sendBtn.count());

  // 滚动让心语卡片输入区进入视口中部
  await page.evaluate(() => {
    const el = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);

  // 3. 测量输入前的尺寸
  console.log('\n[3/6] 测量输入前状态...');
  const measure = async () => {
    return await page.evaluate(() => {
      const ta = document.querySelector('textarea.taro-textarea[placeholder*="和心语说说心里话"]');
      const core = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
      const getRect = (el) => { const r = el.getBoundingClientRect(); const s = window.getComputedStyle(el); return { width: r.width, height: r.height, top: r.top, left: r.left, scrollHeight: el.scrollHeight || 0, offsetHeight: el.offsetHeight, clientHeight: el.clientHeight, cssHeight: s.height, cssMaxHeight: s.maxHeight, cssWidth: s.width, cssResize: s.resize, cssOverflow: s.overflow, cssOverflowY: s.overflowY, cssTransition: s.transition }; };
      const send = Array.from(document.querySelectorAll('*')).find(e => (e.innerText || '').trim() === '发送' && e.getBoundingClientRect().width > 0);
      const sendRect = send ? (() => { const r = send.getBoundingClientRect(); return { width: r.width, height: r.height, top: r.top, left: r.left, tag: send.tagName.toLowerCase(), class: (send.className||'').toString().substring(0,60) }; })() : null;
      // 输入行的容器：找 core 的最近 flex 父级
      const rowParent = core ? core.parentElement : null;
      const rowRect = rowParent ? (() => { const r = rowParent.getBoundingClientRect(); const s = window.getComputedStyle(rowParent); return { tag: rowParent.tagName.toLowerCase(), class: (rowParent.className||'').toString().substring(0,80), width: r.width, height: r.height, top: r.top, left: r.left, cssHeight: s.height, display: s.display }; })() : null;
      return {
        textarea: ta ? getRect(ta) : null,
        textareaValue: ta ? ta.value : '',
        core: core ? getRect(core) : null,
        sendBtn: sendRect,
        rowParent: rowRect
      };
    });
  };

  const before = await measure();
  console.log('  textarea(前):', JSON.stringify(before.textarea, null, 2));
  console.log('  taro-textarea-core(前):', JSON.stringify(before.core, null, 2));
  console.log('  输入行父容器(前):', JSON.stringify(before.rowParent, null, 2));
  console.log('  发送按钮(前):', JSON.stringify(before.sendBtn, null, 2));

  // 4. 截图记录输入前
  console.log('\n[4/6] 截图记录输入前...');
  await page.screenshot({ path: fullBeforeShot, fullPage: false });
  // 截取输入区域附近（底部 200px 范围）
  const coreBox = await coreEl.boundingBox();
  if (coreBox) {
    const clip = { x: Math.max(0, coreBox.x - 30), y: Math.max(0, coreBox.y - 60), width: Math.min(390, coreBox.width + 200), height: 180 };
    await page.screenshot({ path: beforeShot, clip });
    console.log('  输入区域截图(前):', beforeShot, 'clip=', JSON.stringify(clip));
  } else {
    console.log('  无法获取 core 边界框，跳过区域截图');
  }
  console.log('  整页截图(前):', fullBeforeShot);

  // 5. 点击并输入长文字
  console.log('\n[5/6] 点击输入框并输入长文字...');
  // 直接对底层 textarea 执行 fill（即使 width=0 也能写入值）
  await textareaEl.scrollIntoViewIfNeeded().catch(() => {});
  await textareaEl.focus();
  await page.waitForTimeout(200);
  const longText = '测试输入框是否会变化高度，输入一些文字看看效果，再多输入一些文字测试一下效果';
  await textareaEl.evaluate((el, txt) => {
    // 使用原生 setter 触发 React/Taro 的 onChange
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeInputValueSetter.call(el, txt);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    // Taro textarea 常监听 keyup/handleInput，再触发一次
    el.dispatchEvent(new Event('keyup', { bubbles: true }));
  }, longText);
  await page.waitForTimeout(1000); // 等待自适应高度与过渡动画

  // 也尝试用 fill 兜底
  try {
    await textareaEl.fill(longText, { timeout: 3000 });
    await page.waitForTimeout(800);
  } catch (e) {
    console.log('  fill 调用失败（已用 evaluate 写入），错误:', e.message.split('\n')[0]);
  }

  // 6. 测量输入后
  console.log('\n[6/6] 测量输入后状态...');
  const after = await measure();
  console.log('  textarea(后):', JSON.stringify(after.textarea, null, 2));
  console.log('  textarea.value(后):', JSON.stringify(after.textareaValue));
  console.log('  taro-textarea-core(后):', JSON.stringify(after.core, null, 2));
  console.log('  输入行父容器(后):', JSON.stringify(after.rowParent, null, 2));
  console.log('  发送按钮(后):', JSON.stringify(after.sendBtn, null, 2));

  // 截图记录输入后
  await page.screenshot({ path: fullAfterShot, fullPage: false });
  const coreBox2 = await coreEl.boundingBox();
  if (coreBox2) {
    const clip = { x: Math.max(0, coreBox2.x - 30), y: Math.max(0, coreBox2.y - 60), width: Math.min(390, coreBox2.width + 200), height: 220 };
    await page.screenshot({ path: afterShot, clip });
    console.log('  输入区域截图(后):', afterShot);
  }
  console.log('  整页截图(后):', fullAfterShot);

  // 对比
  console.log('\n================ 对比结果 ================');
  const cmp = (label, a, b, key) => {
    if (!a || !b) { console.log(`${label}.${key}: 数据缺失`); return null; }
    const d = (b[key] || 0) - (a[key] || 0);
    console.log(`${label}.${key}: ${a[key]} -> ${b[key]} (Δ ${d.toFixed(3)})`);
    return d;
  };
  console.log('--- 底层 textarea ---');
  const dTaH = cmp('textarea', before.textarea, after.textarea, 'height');
  cmp('textarea', before.textarea, after.textarea, 'scrollHeight');
  cmp('textarea', before.textarea, after.textarea, 'cssHeight');
  cmp('textarea', before.textarea, after.textarea, 'top');
  console.log('--- 可见 taro-textarea-core ---');
  const dCoreH = cmp('core', before.core, after.core, 'height');
  cmp('core', before.core, after.core, 'cssHeight');
  cmp('core', before.core, after.core, 'top');
  cmp('core', before.core, after.core, 'width');
  console.log('--- 输入行父容器 ---');
  const dRowH = cmp('rowParent', before.rowParent, after.rowParent, 'height');
  cmp('rowParent', before.rowParent, after.rowParent, 'cssHeight');
  console.log('--- 发送按钮 ---');
  const dBtnTop = cmp('sendBtn', before.sendBtn, after.sendBtn, 'top');
  cmp('sendBtn', before.sendBtn, after.sendBtn, 'left');
  cmp('sendBtn', before.sendBtn, after.sendBtn, 'height');

  console.log('\n================ 结论 ================');
  const heightDelta = dCoreH !== null ? dCoreH : (dTaH !== null ? dTaH : null);
  if (heightDelta !== null && Math.abs(heightDelta) < 0.5) {
    console.log(`输入框高度几乎无变化 (Δ ${heightDelta.toFixed(3)}px) → 输入文字时输入框高度【不】随内容自适应。`);
  } else if (heightDelta !== null) {
    console.log(`输入框高度发生变化 (Δ ${heightDelta.toFixed(3)}px) → 输入文字时输入框高度【会】随内容自适应。`);
  }
  if (dBtnTop !== null) {
    if (Math.abs(dBtnTop) < 0.5) {
      console.log(`发送按钮位置几乎无变化 (Δ top ${dBtnTop.toFixed(3)}px)。`);
    } else {
      console.log(`发送按钮位置发生变化 (Δ top ${dBtnTop.toFixed(3)}px) → 会随输入框高度联动移动。`);
    }
  }
  if (dRowH !== null && Math.abs(dRowH) >= 0.5) {
    console.log(`输入行容器高度变化 (Δ ${dRowH.toFixed(3)}px)，整行布局会随输入内容增高。`);
  }

  await browser.close();
  console.log('\n测试结束。');
})().catch(err => { console.error('测试脚本异常:', err); process.exit(1); });
