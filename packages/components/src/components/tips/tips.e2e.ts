import { newE2EPage } from '@stencil/core/testing';

describe('avl-tips', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<avl-tips></avl-tips>');

    const element = await page.find('avl-tips');
    expect(element).toHaveClass('hydrated');
  });
});
