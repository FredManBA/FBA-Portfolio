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

  await expect(page.getByRole('heading', { level: 1, name: 'Needy Friends' })).toBeVisible();
  for (const name of [
    'Tres mundos, un mismo estudio',
    'Somos tres',
    '¿Tienes una idea que necesita amigos?',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeAttached();
  }
  for (const name of ['Videojuegos', 'Webs', 'Herramientas']) {
    await expect(page.getByRole('heading', { level: 3, name })).toBeAttached();
  }

  const screenshots = page.locator('#universo img');
  await expect(screenshots).toHaveCount(10);
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

  await expect(page.getByText('We make games, websites and digital tools.')).toBeVisible();
  await expect(page).toHaveTitle('Needy Friends | Games, websites and digital tools');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('a hero planet leads to its area', async ({ page }) => {
  // With reduced motion the planets rest in place, which also makes them stable to click.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await page.locator('#inicio').getByRole('link', { name: 'Herramientas' }).click();

  await expect(page).toHaveURL(/#herramientas$/);
  await expect(page.getByRole('heading', { level: 3, name: 'Herramientas' })).toBeInViewport();
});

test('opens a project from the keyboard and restores focus on Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Ver detalles TechBuilder' });

  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'TechBuilder' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Abrir demo/ })).toHaveAttribute(
    'href',
    'https://techbuilder.pages.dev/',
  );

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('filters the page down to one area and back', async ({ page }) => {
  await page.goto('/#universo');
  const filters = page.getByRole('group', { name: 'Mostrar áreas' });

  await filters.getByRole('button', { name: /^Webs/ }).click();

  await expect(page.locator('#webs')).toBeVisible();
  await expect(page.locator('#videojuegos')).toHaveCount(0);

  await filters.getByRole('button', { name: /^Todo/ }).click();
  await expect(page.locator('#videojuegos')).toBeAttached();
});

test('asks for the missing fields before preparing the email', async ({ page }) => {
  await page.goto('/#contacto');

  await page.getByRole('button', { name: 'Abrir en mi correo' }).click();

  await expect(page.getByText('Escribe tu nombre.')).toBeVisible();
  await expect(page.getByLabel('Nombre')).toBeFocused();
  await expect(page.getByRole('link', { name: 'needyfriends.service@gmail.com' })).toBeVisible();
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
  await expect(
    page.getByRole('heading', { level: 2, name: '¿Tienes una idea que necesita amigos?' }),
  ).toBeInViewport();
});

test('publishes the third-party license notices linked from the footer', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Licencias de terceros' });
  await expect(link).toHaveAttribute('href', '/third-party-licenses.txt');

  const response = await request.get('/third-party-licenses.txt');
  expect(response.ok()).toBe(true);
  const text = await response.text();
  for (const name of [
    'react 19',
    'framer-motion',
    'lucide-react',
    '@fontsource-variable/unbounded',
  ]) {
    expect(text).toContain(name);
  }
});
