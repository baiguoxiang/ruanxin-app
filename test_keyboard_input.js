// 真实键盘输入版测试：点击可见的 taro-textarea-core 后用 keyboard.type 逐字输入
const { chromium } = require('C:\\Users\\Administrator\\Documents\\Codex\\2026-07-03\\6-29-ai-5-3-3\\UI-TARS-desktop\\node_modules\\playwright');
const path = require('path');

(async () => {
  const targetUrl = 'https://baiguoxiang.github.io/ruanxin-app/#/pages/emotion/index';
  const dir = __dirname;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('================ 真实键盘输入测试 ================');
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const coreEl = page.locator('taro-textarea-core.index-module__input___uw2bk').first();
  const textareaEl = page.locator('textarea.taro-textarea[placeholder*="和心语说说心里话"]').first();

  // 滚动到输入区
  await page.evaluate(() => {
    const el = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);

  const measure = async (label) => {
    return await page.evaluate(() => {
      const ta = document.querySelector('textarea.taro-textarea[placeholder*="和心语说说心里话"]');
      const core = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
      const send = Array.from(document.querySelectorAll('*')).find(e => (e.innerText || '').trim() === '发送' && e.getBoundingClientRect().width > 0);
      const row = core ? core.parentElement : null;
      const card = core ? core.closest('[class*="card"]') : null;
      const r = (el) => el ? el.getBoundingClientRect() : null;
      const s = (el) => el ? window.getComputedStyle(el) : null;
      return {
        ta: ta ? { h: r(ta).height, top: r(ta).top, sh: ta.scrollHeight, cssH: s(ta).height, cssMaxH: s(ta).maxHeight, val: ta.value } : null,
        core: core ? { h: r(core).height, top: r(core).top, w: r(core).width, sh: core.scrollHeight, cssH: s(core).height, cssMaxH: s(core).maxHeight } : null,
        row: row ? { h: r(row).height, top: r(row).top, cssH: s(row).height } : null,
        card: card ? { h: r(card).height, top: r(card).top, cssH: s(card).height } : null,
        send: send ? { top: r(send).top, left: r(send).left, h: r(send).height } : null
      };
    });
  };

  const before = await measure('前');
  console.log('\n输入前:', JSON.stringify(before, null, 2));
  await page.screenshot({ path: path.join(dir, 'kbd_before.png') });

  // 点击可见 core 元素，聚焦底层 textarea
  console.log('\n点击输入框并逐字输入...');
  await coreEl.click({ timeout: 5000 }).catch(e => console.log('  core click 失败:', e.message.split('\n')[0]));
  await page.waitForTimeout(300);
  // 确认焦点
  const focusedTag = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  console.log('  当前焦点元素:', focusedTag);

  // 用真实键盘逐字输入
  const longText = '测试输入框是否会变化高度，输入一些文字看看效果，再多输入一些文字测试一下效果';
  await page.keyboard.type(longText, { delay: 30 });
  await page.waitForTimeout(1500); // 等待 Taro 自适应高度

  const after = await measure('后');
  console.log('\n输入后:', JSON.stringify(after, null, 2));
  await page.screenshot({ path: path.join(dir, 'kbd_after.png') });

  // 对比
  console.log('\n================ 对比 ================');
  const d = (a, b) => (b - a).toFixed(3);
  if (before.ta && after.ta) {
    console.log(`textarea.height: ${before.ta.h} -> ${after.ta.h} (Δ ${d(before.ta.h, after.ta.h)})`);
    console.log(`textarea.scrollHeight: ${before.ta.sh} -> ${after.ta.sh} (Δ ${d(before.ta.sh, after.ta.sh)})`);
    console.log(`textarea.cssHeight: ${before.ta.cssH} -> ${after.ta.cssH}`);
    console.log(`textarea.value(后): "${after.ta.val}"`);
  }
  if (before.core && after.core) {
    console.log(`core.height: ${before.core.h} -> ${after.core.h} (Δ ${d(before.core.h, after.core.h)})`);
    console.log(`core.scrollHeight: ${before.core.sh} -> ${after.core.sh} (Δ ${d(before.core.sh, after.core.sh)})`);
    console.log(`core.cssHeight: ${before.core.cssH} -> ${after.core.cssH}`);
    console.log(`core.cssMaxHeight: ${before.core.cssMaxH} -> ${after.core.cssMaxH}`);
  }
  if (before.row && after.row) {
    console.log(`row.height: ${before.row.h} -> ${after.row.h} (Δ ${d(before.row.h, after.row.h)})`);
  }
  if (before.card && after.card) {
    console.log(`card.height: ${before.card.h} -> ${after.card.h} (Δ ${d(before.card.h, after.card.h)})`);
  }
  if (before.send && after.send) {
    console.log(`send.top: ${before.send.top} -> ${after.send.top} (Δ ${d(before.send.top, after.send.top)})`);
    console.log(`send.height: ${before.send.h} -> ${after.send.h} (Δ ${d(before.send.h, after.send.h)})`);
  }

  console.log('\n================ 结论 ================');
  const dh = before.core && after.core ? after.core.h - before.core.h : 0;
  const dBtn = before.send && after.send ? after.send.top - before.send.top : 0;
  if (Math.abs(dh) < 0.5) {
    console.log(`输入框高度无变化 (Δ ${dh.toFixed(3)}px) → 即使真实键盘输入长文字，输入框高度也【不】随内容自适应。`);
  } else {
    console.log(`输入框高度变化 (Δ ${dh.toFixed(3)}px) → 输入框会随内容自适应高度。`);
  }
  if (Math.abs(dBtn) < 0.5) {
    console.log(`发送按钮位置无变化 (Δ top ${dBtn.toFixed(3)}px)。`);
  } else {
    console.log(`发送按钮位置变化 (Δ top ${dBtn.toFixed(3)}px) → 随输入框高度联动。`);
  }

  await browser.close();
  console.log('\n测试结束。');
})().catch(err => { console.error('异常:', err); process.exit(1); });
