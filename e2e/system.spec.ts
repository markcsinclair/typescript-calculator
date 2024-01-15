import { test, expect, Locator } from '@playwright/test';
import { JSDOM } from 'jsdom';

const decodeHTML = (input: string) => {
    return JSDOM.fragment(input).textContent;
}

let button1: Locator;
let button2: Locator;
let button3: Locator;
let plus: Locator;
let minus: Locator;
let multiply: Locator;
let divide: Locator;
let evaluate: Locator;
let onDisplay: Locator;

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:1236/');

  button1   = page.locator('.calcButton1');
  button2   = page.locator('.calcButton2');
  button3   = page.locator('.calcButton3');
  plus      = page.locator('.calcButton12');
  minus     = page.locator('.calcButton13');
  multiply  = page.locator('.calcButton14');
  divide    = page.locator('.calcButton15');
  evaluate  = page.locator('.calcButton17');
  onDisplay = page.locator('.onDisplay');
});

test('Has calculator layout', async ({ page }) => {
    // Expect keyboard
    await expect(page.locator('.calcButton1')).toContainText('1');
    await expect(page.locator('.calcButton2')).toContainText('2');
    await expect(page.locator('.calcButton3')).toContainText('3');
    await expect(page.locator('.calcButton4')).toContainText('4');
    await expect(page.locator('.calcButton5')).toContainText('5');
    await expect(page.locator('.calcButton6')).toContainText('6');
    await expect(page.locator('.calcButton7')).toContainText('7');
    await expect(page.locator('.calcButton8')).toContainText('8');
    await expect(page.locator('.calcButton9')).toContainText('9');
    await expect(page.locator('.calcButton0')).toContainText('0');
    await expect(page.locator('.calcButton10')).toContainText('.');
    await expect(page.locator('.calcButton16')).toContainText('C');
    await expect(page.locator('.calcButton17')).toContainText('=');

    // Expect operators
    await expect(page.locator('.calcButton11')).toContainText('^');
    await expect(plus).toContainText(decodeHTML('&plus;'));
    await expect(minus).toContainText(decodeHTML('&minus;'));
    await expect(multiply).toContainText(decodeHTML('&times;'));
    await expect(divide).toContainText(decodeHTML('&divide;'));
    await expect(page.locator('.calcButton18')).toContainText('-/+');

    // onDisplay
    await expect(page.locator('.onDisplay')).toContainText('0');
  });

  test('Add two numbers', async ({ page }) => {
    button1.click();
    await expect(onDisplay).toContainText('1');
    await plus.click();
    await expect(onDisplay).toContainText('1');
    await button2.click();
    await expect(onDisplay).toContainText('2');
    await evaluate.click();
    await expect(onDisplay).toContainText('3');
  });

  test('Subtract two numbers', async ({ page }) => {
    button1.click();
    await expect(onDisplay).toContainText('1');
    await minus.click();
    await expect(onDisplay).toContainText('1');
    await button2.click();
    await expect(onDisplay).toContainText('2');
    await evaluate.click();
    await expect(onDisplay).toContainText('-1');
  });

  test('Multiply two numbers', async ({ page }) => {
    button2.click();
    await expect(onDisplay).toContainText('2');
    await multiply.click();
    await expect(onDisplay).toContainText('2');
    await button3.click();
    await expect(onDisplay).toContainText('3');
    await evaluate.click();
    await expect(onDisplay).toContainText('6');
  });

  test('Divide two numbers', async ({ page }) => {
    button3.click();
    await expect(onDisplay).toContainText('3');
    await divide.click();
    await expect(onDisplay).toContainText('3');
    await button2.click();
    await expect(onDisplay).toContainText('2');
    await evaluate.click();
    await expect(onDisplay).toContainText('1.5');
  });