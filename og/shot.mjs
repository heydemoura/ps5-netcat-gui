import { chromium } from 'playwright-core';
const b=await chromium.launch({executablePath:'/usr/bin/chromium'});const p=await b.newPage({viewport:{width:1200,height:630}});
await p.goto('file://'+process.argv[2]);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
await p.screenshot({path:process.argv[3],...(process.argv[3].endsWith('.jpg')?{type:'jpeg',quality:90}:{})});await b.close();
