import { DHSSTemplatePage } from './app.po';

describe('DHSS App', function() {
  let page: DHSSTemplatePage;

  beforeEach(() => {
    page = new DHSSTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
