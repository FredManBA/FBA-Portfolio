import { expect, test, type Page } from '@playwright/test';

function collectProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      problems.push(message.text());
    }
  });
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) {
      problems.push(`${response.status()} ${response.url()}`);
    }
  });
  return problems;
}

test('loads every section and screenshot without errors or horizontal overflow', async ({
  page,
}) => {
  const problems = collectProblems(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Fredman Bolívar Alfaro');
  for (const name of ['Proyectos', 'Tecnologías', 'Sobre mí', 'Hablemos']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeAttached();
  }

  const screenshots = page.locator('#proyectos img');
  await expect(screenshots).toHaveCount(3);
  for (const screenshot of await screenshots.all()) {
    await screenshot.scrollIntoViewIfNeeded();
    await expect
      .poll(() => screenshot.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth))
      .toBeGreaterThan(0);
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  expect(problems).toEqual([]);
});

test('switches to English without reloading and remembers the choice', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Software Developer');
  await expect(page).toHaveTitle('Fredman Bolívar Alfaro | Software Developer');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('opens a project from the keyboard and restores focus on Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Ver proyecto TechBuilder' });

  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'TechBuilder' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Ver demo/ })).toHaveAttribute(
    'href',
    'https://techbuilder.pages.dev/',
  );

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('asks for the missing fields instead of sending an empty message', async ({ page }) => {
  await page.goto('/#contacto');

  await page.getByRole('button', { name: 'Enviar mensaje' }).click();

  await expect(page.getByText('Escribe tu nombre.')).toBeVisible();
  await expect(page.getByLabel('Nombre')).toBeFocused();
});

test('tilts project cards under the mouse', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The pointer tilt only runs with a mouse.');
  await page.goto('/');
  const card = page.getByRole('article', { name: 'Costa Rica 360' });

  // hover() waits until the card is visible and stable before moving the mouse.
  await card.hover({ position: { x: 80, y: 80 } });
  await card.hover({ position: { x: 120, y: 110 } });

  await expect(card).toHaveAttribute('data-tilt', 'active');
});

test('navigates with the mobile menu', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only exists on small screens.');
  await page.goto('/');

  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('link', { name: 'Contacto' })
    .click();

  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Hablemos' })).toBeInViewport();
});
