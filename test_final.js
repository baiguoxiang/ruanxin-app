// 最终测试：直接 focus 底层 textarea + 键盘输入，并检查 auto-height 配置
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

  console.log('================ 最终测试 ================');
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  // 检查 auto-height 相关属性
  console.log('\n=== 检查 textarea 属性与 Taro 组件配置 ===');
  const attrs = await page.evaluate(() => {
    const ta = document.querySelector('textarea.taro-textarea[placeholder*="和心语说说心里话"]');
    const core = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
    const taAttrs = ta ? Array.from(ta.attributes).map(a => `${a.name}="${a.value}"`) : [];
    const coreAttrs = core ? Array.from(core.attributes).map(a => `${a.name}="${a.value}"`) : [];
    // 查找 Taro 组件 props（在 React fiber 上）
    let reactProps = null;
    if (core) {
      const fiberKey = Object.keys(core).find(k => k.startsWith('__reactProps') || k.startsWith('__reactFiber'));
      reactProps = fiberKey ? 'found fiber' : 'no fiber';
    }
    return { taAttrs, coreAttrs, reactProps, taStyle: ta ? ta.getAttribute('style') : null, coreStyle: core ? core.getAttribute('style') : null };
  });
  console.log('  textarea 属性:', attrs.taAttrs);
  console.log('  textarea style:', attrs.taStyle);
  console.log('  core 属性:', attrs.coreAttrs);
  console.log('  core style:', attrs.coreStyle);

  const textareaEl = page.locator('textarea.taro-textarea[placeholder*="和心语说说心里话"]').first();
  const coreEl = page.locator('taro-textarea-core.index-module__input___uw2bk').first();

  // 滚动到输入区
  await page.evaluate(() => {
    const el = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);

  const measure = async () => {
    return await page.evaluate(() => {
      const ta = document.querySelector('textarea.taro-textarea[placeholder*="和心语说说心里话"]');
      const core = document.querySelector('taro-textarea-core.index-module__input___uw2bk');
      const send = Array.from(document.querySelectorAll('*')).find(e => (e.innerText || '').trim() === '发送' && e.getBoundingClientRect().width > 0);
      const row = core ? core.parentElement : null;
      const card = core ? core.closest('[class*="card"]') : null;
      const r = (el) => el ? el.getBoundingClientRect() : null;
      const s = (el) => el ? window.getComputedStyle(el) : null;
      return {
        ta: ta ? { h: r(ta).height, top: r(ta).top, sh: ta.scrollHeight, cssH: s(ta).height, val: ta.value, valLen: ta.value.length } : null,
        core: core ? { h: r(core).height, top: r(core).top, w: r(core).width, sh: core.scrollHeight, cssH: s(core).height, cssMaxH: s(core).maxHeight } : null,
        row: row ? { h: r(row).height, cssH: s(row).height } : null,
        card: card ? { h: r(card).height, cssH: s(card).height } : null,
        send: send ? { top: r(send).top, left: r(send).left, h: r(send).height } : null
      };
    });
  };

  const before = await measure();
  console.log('\n输入前度量:', JSON.stringify(before, null, 2));
  await page.screenshot({ path: path.join(dir, 'final_before.png') });

  // 方案A：直接 focus textarea（width=0 也能聚焦），然后键盘输入
  console.log('\n=== 方案A: focus textarea + keyboard.type ===');
  await textareaEl.focus();
  await page.waitForTimeout(200);
  const focusedA = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  console.log('  focus 后活动元素:', focusedA);
  const longText = '测试输入框是否会变化高度，输入一些文字看看效果，再多输入一些文字测试一下效果';
  await page.keyboard.type(longText, { delay: 20 });
  await page.waitForTimeout(1500);
  const afterA = await measure();
  console.log('  方案A 输入后:', JSON.stringify({ taVal: afterA.ta ? afterA.ta.val : null, taValLen: afterA.ta ? afterA.ta.valLen : 0, coreH: afterA.core ? afterA.core.h : null, taSh: afterA.ta ? afterA.ta.sh : null }, null, 2));
  await page.screenshot({ path: path.join(dir, 'final_after_A.png') });

  // 方案B：如果方案A未输入成功，用原生 setter + 触发 Taro input 事件
  if (!afterA.ta || afterA.ta.valLen === 0) {
    console.log('\n=== 方案B: 原生 setter + InputEvent (Taro 兼容) ===');
    await page.evaluate((txt) => {
      const ta = document.querySelector('textarea.taro-textarea[placeholder*="和心语说说心里话"]');
      if (!ta) return;
      // 使用 InputEvent 以更贴近真实输入
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(ta, txt);
      ta.dispatchEvent(new InputEvent('input', { bubbles: true, data: txt, inputType: 'insertText' }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      // Taro textarea 还可能监听 'blur'/'confirm'，但高度调整通常在 input 时
    }, longText);
    await page.waitForTimeout(1500);
  }
  const afterB = await measure();
  console.log('\n方案B 输入后度量:', JSON.stringify(afterB, null, 2));
  await page.screenshot({ path: path.join(dir, 'final_after_B.png') });

  // 方案C：模拟更完整的交互——先 click core 让 Taro 进入编辑态，再 focus textarea 输入
  if (!afterB.ta || afterB.ta.valLen === 0) {
    console.log('\n=== 方案C: click core + focus textarea + type ===');
    await coreEl.click().catch(() => {});
    await page.waitForTimeout(300);
    await textareaEl.focus();
    await page.waitForTimeout(200);
    await page.keyboard.type(longText, { delay: 20 });
    await page.waitForTimeout(1500);
  }
  const afterC = await measure();
  console.log('\n方案C 输入后度量:', JSON.stringify(afterC, null, 2));
  await page.screenshot({ path: path.join(dir, 'final_after_C.png') });

  // 取最终成功写入的度量
  const final = (afterA.ta && afterA.ta.valLen > 0) ? afterA : ((afterB.ta && afterB.ta.valLen > 0) ? afterB : afterC);

  console.log('\n================ 最终对比 ================');
  const d = (a, b) => (b - a).toFixed(3);
  console.log(`textarea.value: "${before.ta ? before.ta.val : ''}" -> "${final.ta ? final.ta.val : ''}"`);
  console.log(`textarea.height: ${before.ta ? before.ta.h : '?'} -> ${final.ta ? final.ta.h : '?'} (Δ ${before.ta && final.ta ? d(before.ta.h, final.ta.h) : '?'})`);
  console.log(`textarea.scrollHeight: ${before.ta ? before.ta.sh : '?'} -> ${final.ta ? final.ta.sh : '?'} (Δ ${before.ta && final.ta ? d(before.ta.sh, final.ta.sh) : '?'})`);
  console.log(`core.height: ${before.core ? before.core.h : '?'} -> ${final.core ? final.core.h : '?'} (Δ ${before.core && final.core ? d(before.core.h, final.core.h) : '?'})`);
  console.log(`core.scrollHeight: ${before.core ? before.core.sh : '?'} -> ${final.core ? final.core.sh : '?'} (Δ ${before.core && final.core ? d(before.core.sh, final.core.sh) : '?'})`);
  console.log(`core.cssHeight: ${before.core ? before.core.cssH : '?'} -> ${final.core ? final.core.cssH : '?'}`);
  console.log(`core.cssMaxHeight: ${before.core ? before.core.cssMaxH : '?'} -> ${final.core ? final.core.cssMaxH : '?'}`);
  console.log(`row.height: ${before.row ? before.row.h : '?'} -> ${final.row ? final.row.h : '?'} (Δ ${before.row && final.row ? d(before.row.h, final.row.h) : '?'})`);
  console.log(`card.height: ${before.card ? before.card.h : '?'} -> ${final.card ? final.card.h : '?'} (Δ ${before.card && final.card ? d(before.card.h, final.card.h) : '?'})`);
  console.log(`send.top: ${before.send ? before.send.top : '?'} -> ${final.send ? final.send.top : '?'} (Δ ${before.send && final.send ? d(before.send.top, final.send.top) : '?'})`);
  console.log(`send.height: ${before.send ? before.send.h : '?'} -> ${final.send ? final.send.h : '?'} (Δ ${before.send && final.send ? d(before.send.h, final.send.h) : '?'})`);

  console.log('\n================ 结论 ================');
  const dh = before.core && final.core ? final.core.h - before.core.h : 0;
  const dBtn = before.send && final.send ? final.send.top - before.send.top : 0;
  const valEntered = final.ta && final.ta.valLen > 0;
  console.log(`文字是否成功输入: ${valEntered ? '是 (value 长度=' + final.ta.valLen + ')' : '否'}`);
  if (!valEntered) {
    console.log('注意：所有输入方案均未能成功写入文字，无法测试高度变化。');
  } else if (Math.abs(dh) < 0.5) {
    console.log(`输入框高度无变化 (Δ ${dh.toFixed(3)}px) → 输入长文字后，输入框高度【不】随内容自适应。`);
    console.log(`发送按钮位置无变化 (Δ top ${dBtn.toFixed(3)}px)。`);
  } else {
    console.log(`输入框高度变化 (Δ ${dh.toFixed(3)}px) → 输入框会随内容自适应高度。`);
    console.log(`发送按钮位置变化 (Δ top ${dBtn.toFixed(3)}px)。`);
  }

  await browser.close();
  console.log('\n测试结束。');
})().catch(err => { console.error('异常:', err); process.exit(1); });
